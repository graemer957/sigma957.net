---
title: "macOS `defaults` unexpected exit code"
date: 2023-11-10T21:11:00Z
draft: false
tags:
  - debugging
  - macos
  - rust
---
Recently I have been working on a new Rust project. I plan to write more about that soon™, but for this post, it is a simple macOS utility app. One can run the app from the terminal, but I would like it to be a fully-fledged macOS `.app`. I have another use case for this in mind, but one of the goals of this is to work out the feasibility. Conceptually it is put together like this:
```goat
    .------------.              .-------.               .------.     
    | macOS .app +- Executes -->| Swift +-  Executes -->| Rust |     
    .------------.              .-------.               .------.     
```

Regarding the snag... Running the utility directly from the terminal worked. However, running via the Swift macOS `.app` returned an unexpected exit code of `1`:
```text
Error: "Got non-zero exit status for `defaults`"
```

The command in question is `defaults read com.apple.dock autohide`. Stupidly I was ignoring `stderr` at this point. After dumping that out:
```text
[src/lib.rs:35] stderr = "2023-11-10 20:58:08.277 defaults[11951:419861] \nThe domain/default pair of (com.apple.dock, autohide) does not exist\n"
```

Hmmm, not much to go on! Attempts to use the absolute path or configure various environment variables that I thought might be missing did not resolve the issue.

At a loss, I switched to using `plutil` instead:
```bash
plutil -extract autohide raw ~/Library/Preferences/com.apple.dock.plist
```

This did not work either and returned a status code of `1`. The output from `stderr` was not much help either:
```text
[src/lib.rs:39] stderr = ""
```

I had still been ignoring `stdout`, so figured that was worth checking:
```text
[src/lib.rs:31] stdout = "~/Library/Preferences/com.apple.dock.plist: file does not exist or is not readable or is not a regular file (Error Domain=NSCocoaErrorDomain Code=257 \"The file “com.apple.dock.plist” couldn’t be opened because you don’t have permission to view it.\" UserInfo={NSFilePath=~/Library/Preferences/com.apple.dock.plist, NSUnderlyingError=0x600001650060 {Error Domain=NSPOSIXErrorDomain Code=1 \"Operation not permitted\"}})\n"
```

Do not have permission to view the file. What the!?

It then dawned on me that I had used the latest Xcode 15.0 macOS App template, which had created a `.entitlements` file at the root of my project. The default contents are:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.app-sandbox</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-only</key>
  <true/>
</dict>
</plist>
```

Could this be the root cause 🤔 ...surely enough disabling the "App Sandbox" and retrying resulted in success! I have no plans to submit this app to the App Store, nor do I have the interest right now to tweak the sandbox settings to permit this, if that is even possible. You can more about the [App Sandbox](https://developer.apple.com/documentation/security/app_sandbox) on Apple's developer site.

Lesson (re)learnt... do **not** ignore `stdout` and `stderr`!