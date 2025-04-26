---
title: "Running CodeCrafters CI locally"
date: 2025-04-26T00:00:00Z
draft: false
tags:
  - codecrafters
---

I have been happily using [CodeCrafters](https://codecrafters.io) since November 2024. My workflow involves making the changes I believe are needed, running the `codecrafters test` command then waiting for the results. Normally, this does not take long, but occasionally their CI infrastructure can go down, which of course is frustrating.

I always add my [own tests](https://github.com/graemer957/codecrafters-http-server-rust/blob/c5f1cf678a14cb5dbd53a12ad1835babf08d275f/src/connection.rs#L145) to exercise the code crafted, despite it already being exercised on their CI. Mainly because I want to ensure the code I write is testable, but also practise writing good tests, ensure a high code coverage and get quick feedback if a refactor changes some subtle behaviour.

As a result I end up reimplementing tests and burning precious time. It _feels like_ it would be more valuable to test the edge cases that often get left out, gaps in the instructions, things left open to interpretation or based on coverage guidance from tools.

What I would like to do is have `cargo test`, or similar, invoke the CodeCrafters test harness locally and gather coverage metrics. I'll be updating this blog post based on my findings!
