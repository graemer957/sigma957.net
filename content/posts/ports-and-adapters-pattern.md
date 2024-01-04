---
title: "Ports and Adapters pattern"
date: 2023-12-03T16:03:00Z
draft: false
tags: 
  - rust
---
After implementing my newtype in [Better handling of `Command` output](../better-handling-of-command-output) trying to write unit tests for 100% coverage was a non-starter. This, of course, was because internally it was instantiating `std::process::Command::new` itself. I set about looking for some kind of way to perform [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection).

I stumbled across a great blog post by [Ecky Putrady on Structuring Rust Projects for Testability](https://betterprogramming.pub/structuring-rust-project-for-testability-18207b5d0243) which talks about [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), otherwise known as the "Ports and Adapters pattern". The principles behind this pattern, along with the onion architecture amongst others, were combined by Robert C. Martin in 2012 to form the clean architecture. I am not yet sure if this is a Rust idiom, but figured it was worth taking a look.

Let us start with our ports (aka traits). We will need two. Firstly, an 'in port' called `Program` contains one method that allows us to `execute` returning a `Result<Output, Error>`. Both `Output` and `Error` are our own types (obmitted here for brievaty):
```rust
pub trait Program {
    fn execute(&mut self) -> Result<Output, Error>;
}
```

Now we have an 'out port' to describe how we collect the `Output` from the underlying implementation:
```rust
pub trait Command {
    fn output(&mut self) -> io::Result<std::process::Output>;
}
```

Notice we are using the standard library type here. I have done this for two reasons:
1. For testing it is easy to construct
2. The rabbit hole goes deeper... `Output` makes use of `ExitStatus`, which we would also need, so better stop sooner™

With our traits written, we can turn to the adapter. We only need the one for `std::process::Command`, which is straightforward:
```rust
impl Command for std::process::Command {
    fn output(&mut self) -> io::Result<std::process::Output> {
        self.output()
    }
}
```

Bringing this all together our domain, the `ProgramImpl` struct, which is generic over our `Command` trait:
```rust
pub struct ProgramImpl<T: Command> {
    command: T,
    expected_status_code: i32,
}

impl<T> Program for ProgramImpl<T>
where
    T: Command,
{
    fn execute(&mut self) -> Result<Output, Error> {
        let output = self.command.output()?;
        let status_code = output.status.code().ok_or(Error::NoStatusCode)?;
        let result = Output {
            status_code,
            stdout: output.stdout,
            stderr: output.stderr,
        };

        if status_code != self.expected_status_code {
            return Err(result.into());
        }
        Ok(result)
    }
}
```

To bring this all together visually we have the following:
```goat

  .---------------.             .-----------------.                   .---------------.
  | Consumer      +--- Uses --->| `Program` trait |<--- Implements ---+ `ProgramImpl` |
  |               |             | (aka port)      |                   | (aka domain)  |
  .---------------.             .-----------------.                   .--------+------.
                                                                               |
                                                                              Uses
                                                                               |
                                                                               v
                               .------------------.                   .-----------------.
                               | `Command` impl   +--- Implements --->| `Command` trait |
                               | (aka adapter)    |                   | (aka port)      |
                               .------------------.                   .-----------------.
```

The result is we can:
* construct any standard library `Command`
* ensure that the command exit code is checked and `stdout` and `stderr` are available to the consumer
* test all the code in the domain (`ProgramImpl`)

My project that uses this implementation is still a work in progress, but here is a working snippet for now:
```rust
let mut defaults = Command::new("defaults");
defaults.args(["read", "com.apple.dock", "autohide"]);
let output = ProgramImpl::new(defaults, 0).execute()?;
```
