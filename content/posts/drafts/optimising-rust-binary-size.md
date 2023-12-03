---
title: "Optimising Rust binary sizes"
date: 2023-12-03T15:22:00Z
draft: true
tags:
  - rust
---

Taken from: https://github.com/johnthagen/min-sized-rust

Tool: https://github.com/RazrFalcon/cargo-bloat

Project: LoD ~v0.4

Also see: https://arusahni.net/blog/2020/03/optimizing-rust-binary-size.html

Experiment with: https://github.com/TimonPost/cargo-unused-features

---

> start

cargo bloat --release --crates

```bash
    Finished release [optimized] target(s) in 0.06s
    Analyzing target/release/lod

 File  .text     Size Crate
30.9%  56.4% 341.2KiB std
14.9%  27.2% 164.5KiB toml_edit
 3.4%   6.3%  38.0KiB toml
 2.4%   4.4%  26.6KiB lod
 1.0%   1.8%  10.9KiB [Unknown]
 0.7%   1.2%   7.4KiB winnow
 0.5%   1.0%   5.9KiB objc2
 0.5%   0.9%   5.7KiB tempfile
 0.5%   0.9%   5.2KiB toml_datetime
 0.3%   0.6%   3.8KiB system_status_bar_macos
 0.3%   0.6%   3.5KiB objc2_encode
 0.2%   0.4%   2.2KiB icrate
 0.1%   0.1%     592B serde
 0.1%   0.1%     576B fastrand
 0.0%   0.0%     112B hashbrown
 0.0%   0.0%      16B libc
54.8% 100.0% 604.6KiB .text section size, the file size is 1.1MiB

Note: numbers above are a result of guesswork. They are not 100% correct and never will be.
```

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 0.05s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
 1.6%   2.9%  17.8KiB       std std::backtrace_rs::symbolize::gimli::Context::new
 1.1%   2.0%  11.8KiB       std std::backtrace_rs::symbolize::gimli::resolve
 1.1%   1.9%  11.7KiB       std addr2line::ResUnit<R>::find_function_or_location::{{closure}}
 1.0%   1.8%  10.8KiB [Unknown] __mh_execute_header
 1.0%   1.8%  10.7KiB toml_edit toml_edit::parser::strings::string
 0.9%   1.6%  10.0KiB toml_edit toml_edit::parser::document::parse_keyval
 0.9%   1.6%   9.5KiB       std gimli::read::dwarf::Unit<R>::new
 0.8%   1.4%   8.4KiB       std addr2line::Lines::parse
 0.7%   1.3%   8.0KiB toml_edit toml_edit::parser::value::value::{{closure}}
 0.5%   0.9%   5.7KiB       std gimli::read::unit::parse_attribute
46.4%  84.6% 511.8KiB           And 1713 smaller methods. Use -n N to show more.
54.8% 100.0% 604.6KiB           .text section size, the file size is 1.1MiB
```

---

> lto = true

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 27.55s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
 2.3%   3.7%  20.4KiB toml_edit winnow::combinator::multi::repeat0_
 1.8%   3.0%  16.5KiB       std std::backtrace_rs::symbolize::gimli::Context::new
 1.6%   2.6%  14.2KiB       lod lod::config::Config::load
 1.3%   2.1%  11.5KiB       std addr2line::ResUnit<R>::find_function_or_location::{{closure}}
 1.3%   2.0%  11.2KiB       std std::sys_common::backtrace::_print_fmt::{{closure}}
 1.2%   1.9%  10.5KiB toml_edit toml_edit::parser::strings::string
 1.1%   1.8%   9.9KiB [Unknown] __mh_execute_header
 1.0%   1.7%   9.3KiB       std gimli::read::dwarf::Unit<R>::new
 1.0%   1.6%   8.7KiB       std std::sys::unix::process::process_inner::<impl std::sys::unix::process::process_common::Command>::spawn
 0.9%   1.5%   8.2KiB       std addr2line::Lines::parse
49.5%  80.1% 441.2KiB           And 994 smaller methods. Use -n N to show more.
61.8% 100.0% 550.7KiB           .text section size, the file size is 890.4KiB
```

---

> opt-level = "z"

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 24.62s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
 2.3%   4.1%  19.5KiB toml_edit winnow::combinator::multi::repeat0_
 1.9%   3.5%  16.5KiB       std std::backtrace_rs::symbolize::gimli::Context::new
 1.3%   2.4%  11.4KiB [Unknown] __mh_execute_header
 1.3%   2.4%  11.3KiB       lod lod::config::Config::load
 1.3%   2.4%  11.2KiB       std addr2line::ResUnit<R>::find_function_or_location::{{closure}}
 1.3%   2.4%  11.1KiB       std std::sys_common::backtrace::_print_fmt::{{closure}}
 1.1%   2.0%   9.3KiB       std gimli::read::dwarf::Unit<R>::new
 1.0%   1.9%   9.0KiB toml_edit <(Alt2,Alt3,Alt4,Alt5) as winnow::combinator::branch::Alt<I,Output,Error>>::choice
 1.0%   1.8%   8.5KiB       std std::sys::unix::process::process_inner::<impl std::sys::unix::process::process_common::Command>::spawn
 0.9%   1.7%   8.1KiB       std addr2line::Lines::parse
42.9%  78.0% 366.9KiB           And 1246 smaller methods. Use -n N to show more.
55.0% 100.0% 470.7KiB           .text section size, the file size is 855.2KiB
```

---

> codegen-units = 1

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 23.63s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
 4.0%   7.1%  33.1KiB toml_edit toml_edit::parser::value::value::{{closure}}
 2.0%   3.6%  16.5KiB       std std::backtrace_rs::symbolize::gimli::Context::new
 1.4%   2.4%  11.2KiB       std addr2line::ResUnit<R>::find_function_or_location::{{closure}}
 1.3%   2.4%  11.1KiB       std std::sys_common::backtrace::_print_fmt::{{closure}}
 1.2%   2.1%   9.7KiB       lod lod::main
 1.1%   2.0%   9.3KiB       std gimli::read::dwarf::Unit<R>::new
 1.0%   1.8%   8.5KiB       std std::sys::unix::process::process_inner::<impl std::sys::unix::process::process_common::Command>::spawn
 1.0%   1.8%   8.1KiB       std addr2line::Lines::parse
 1.0%   1.7%   8.1KiB toml_edit toml_edit::parser::parse_document
 0.8%   1.5%   6.9KiB [Unknown] __mh_execute_header
41.9%  75.2% 348.1KiB           And 1202 smaller methods. Use -n N to show more.
55.7% 100.0% 463.0KiB           .text section size, the file size is 830.6KiB
```

---

> panic = "abort"

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 23.09s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
 3.5%   6.1%  26.3KiB toml_edit toml_edit::parser::value::value::{{closure}}
 2.2%   3.8%  16.5KiB       std std::backtrace_rs::symbolize::gimli::Context::new
 1.5%   2.6%  11.2KiB       std addr2line::ResUnit<R>::find_function_or_location::{{closure}}
 1.5%   2.6%  11.1KiB       std std::sys_common::backtrace::_print_fmt::{{closure}}
 1.2%   2.1%   9.3KiB       std gimli::read::dwarf::Unit<R>::new
 1.1%   2.0%   8.5KiB       std std::sys::unix::process::process_inner::<impl std::sys::unix::process::process_common::Command>::spawn
 1.1%   1.9%   8.1KiB       std addr2line::Lines::parse
 0.9%   1.6%   7.1KiB [Unknown] __mh_execute_header
 0.9%   1.6%   7.1KiB       lod lod::main
 0.9%   1.6%   7.1KiB toml_edit toml_edit::parser::parse_document
43.7%  75.9% 329.7KiB           And 1092 smaller methods. Use -n N to show more.
57.6% 100.0% 434.2KiB           .text section size, the file size is 754.3KiB
```

---

> strip = true

cargo bloat --release -n 10

```bash
    Finished release [optimized] target(s) in 25.15s
    Analyzing target/release/lod

 File  .text     Size     Crate Name
79.8% 101.6% 441.4KiB [Unknown] __mh_execute_header
 0.0%   0.0%       0B           And 0 smaller methods. Use -n N to show more.
78.5% 100.0% 434.5KiB           .text section size, the file size is 553.4KiB
```
