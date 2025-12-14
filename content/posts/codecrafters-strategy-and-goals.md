---
title: "CodeCrafters Strategy and Goals"
date: 2025-12-14T00:00:00Z
draft: false
tags:
  - rust
---

It occurred to me the other day, that I was coming up close to a year of being
signed up to CodeCrafters. Whilst I have not been able to use it as regularly
as I would have liked, I have found it useful enough to recommend it to many
friends and colleagues by pointing them to my [learning](/learning/) page.

However, in all that time I had yet to sit down and write out my strategy and
goals. This post is my attempt to codify my approach in a way that is
shareable. A sizable portion of the strategy is shared with that from
[Exercism](https://github.com/graemer957/exercism). **Spoiler**: It boils down
to "make it work, then make it right" 😉

## Strategy

1. Read the current step and *attempt* to build a mental model. I use the word
attempt, because sometimes it is just that!
1. Write only enough code for `codecrafters test` to pass and **do not**
prematurely abstract or optimise 😇
1. Review the "Code Examples" from others. **NB**: This can be a time sink, so
be selective, ignoring the ranking, looking for genuinely different
approaches, Rust idioms and edge cases to consider.
1. Whilst I may have further ideas on how to improve or perform larger
refactors, I save this for later.
1. Commit the solution using the title and stage code (#xxx), so I can refer
back to it easily later
1. Continue repeating the above steps for all stages in a section (base or
extension)
1. Now I understand the problem(s) better, I can perform as many refactors
as necessary to:

    * Make the code more idiomatic, understandable and maintainable (principally
  code is written for humans to understand 🤓)
    * Add unit and/or integration tests to exercise the code in the same way as
  `codecrafters test` does on their CI environment

## Goals

* Use **as few** dependencies as possible. Whilst it may make sense to pull in
  an excellent Rust crate to solve X, Y or Z, the primary purpose is **my
  learning**.
* Make the solution as "production quality" as time permits. i.e., I enjoy
  spending time considering architecture, testing, performance, correctness and
  safety, but not at the cost of forward progress.
* Explore areas of interest that come up

## Non-goals

* 100% code coverage
* Features that are not requested by CodeCrafters
