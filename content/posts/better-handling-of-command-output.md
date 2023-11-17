---
title: "Better handling of `Command` output"
date: 2023-11-17T16:28:00Z
tags:
  - debugging
  - rust
---
In my post about [macOS `defaults` unexpected exit code](../macos-defaults-unexpected-exit-code) I reminded myself of the importance of not ignoring `stdout` or `stderr`.

I have been musing on how best to handle the output from `Command`. Maybe a newtype that would:
- check the status code is zero, before making `stdout` available
- otherwise raise a recoverable `Error`

Initial thinking:
```goat
.---------------.                         .--------------------.
| Any `Command` +--- Success ------------>| Output             |
|               |    (status_code == 0)   | Access to `stdout` |
.------+--------.                         .--------------------.
       |
       |                                   .-----------------------------.
       .------------ Failure ------------->| Displable / Debugable Error |
                     (status_code != 0)    .-----------------------------.
```

Create our own `Command`:
```rust
pub struct Command<'a> {
    program: &'a str,
    args: &'a [&'a str],
}
```
...when constructed let's store in fields for later:
```rust
impl<'a> Command<'a> {
    pub const fn new(program: &'a str, args: &'a [&'a str]) -> Self {
        Command { program, args }
    }
}
```

For the success path, return `Output`:
```rust
pub struct Output {
    status_code: i32,
    stdout: Vec<u8>,
    stderr: Vec<u8>,
}
```

For the failure path, return `Error`:
```rust
pub enum Error {
    /// `Command` exited with a non-zero status code
    NonZeroStatusCode(Output),

    /// `Command` encountered an I/O error
    Io(io::Error),

    /// Unable to get the status code from the `Command`
    BadStatusCode,
}
```
...which conforms to the Rust `Error` trait:
```rust
impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NonZeroStatusCode(result) => {
                write!(f, "Non-zero status code: {}", result.status_code)
            }
            Self::Io(error) => write!(f, "{error}"),
            Self::BadStatusCode => write!(f, "Unable to get status code from `Command`"),
        }
    }
}

// Implemented manually, because I found `ExitStatus` does not show the underlying
// status code properly.
impl Debug for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NonZeroStatusCode(result) => {
                let status_code = result.status_code;
                let stdout = String::from_utf8(result.stdout.clone())
                    .unwrap_or_else(|error| format!("{error}"));
                let stderr = String::from_utf8(result.stderr.clone())
                    .unwrap_or_else(|error| format!("{error}"));

                write!(
                    f,
                    "Unexpected status code: {status_code} | stdout: {stdout:?} | stderr: {stderr:?}"
                )
            }
            Self::Io(error) => write!(f, "{error:?}"),
            Self::BadStatusCode => write!(f, "Unable to get status code from `Command`"),
        }
    }
}

impl std::error::Error for Error {}
```

I tried a few different approaches so that `.clone()` was not necessary, but didn't like the resultant API or how it forced consumers to be aware of internals, so went with KISS!

The last piece for error handling is being able to create our `Error` from `Output` or `io::Error`:
```rust
impl From<Output> for Error {
    fn from(result: Output) -> Self {
        Self::NonZeroStatusCode(result)
    }
}

impl From<io::Error> for Error {
    fn from(error: io::Error) -> Self {
        Self::Io(error)
    }
}
```

Tying it all together is the `execute` method on `Command`:
```rust
impl<'a> Command<'a> {
    pub fn execute(self) -> Result<Output, Error> {
        let output = std::process::Command::new(self.program)
            .args(self.args)
            .output()?;

        let status_code = output.status.code().ok_or(Error::BadStatusCode)?;
        let result = Output {
            status_code,
            stdout: output.stdout,
            stderr: output.stderr,
        };

        if status_code != 0 {
            return Err(result.into());
        }
        Ok(result)
    }
}
```

We can then make use of our newtype, such as this:
```rust
pub fn dock_autohide() -> Result<bool, Box<dyn Error>> {
    let result = Command::new("defaults", &["read", "com.apple.dock", "autohide"]).execute()?;

    let digit = result
        .stdout()
        .first()
        .ok_or("Could not get first byte of output")?;

    match *digit {
        b'1' => Ok(true),
        _ => Ok(false),
    }
}
```

This results in a fair amount of code that is challenging to write automated tests for. Next up I am planning to use [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), also known as the "Ports & Adapters Architecture", to address that!