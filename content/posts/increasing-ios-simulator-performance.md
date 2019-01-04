---
title: "Improving iOS Simulator Performance"
date: 2019-01-04T12:03:00Z
draft: false
tags: 
  - ios
  - performance
---

Happy New Year everyone, I hope 2019 is a good year for you. I am re-publishing this post, originally written for my company blog on 6th March 2018.

---

I am not exactly sure when it first started, but in recent releases of Xcode, I have felt the iOS Simulator become more and more sluggish. This is hardly surprising given the ever-increasing resolutions of iPhone's, and given my local setup has not seen a refresh in a number of years as, like many others, I am waiting to see what Apple announces with a new modular Mac Pro (this year?).

Here at [Optimised Labs](https://www.optimisedlabs.com), we are always looking for ways to improve performance. Given I spend a lot of time modernising existing iOS apps or writing new ones from the ground up, a small boost in performance would increase my productivity considerably!

Sure, there was [this bug](https://forums.developer.apple.com/message/262835#262835) in Xcode 9.0 with the OpenGLES.framework, but I always use the most recent version of Xcode. At the time of writing this is Xcode 9.2.

During my research I discovered two quick wins on how to increase the performance of the iOS Simulator:

1. Always use either 'Physical Size' (⌘1) or 'Pixel Accurate' (⌘2) window sizes. If Pixel Accurate is greyed out the screen resolution on your Mac does not support this size. Instead try a different simulated device, eg, iPhone SE.
2. Try an [alternative rendering mode](https://forums.developer.apple.com/message/253762#253762) for the simulator. This can be done with `defaults write com.apple.CoreSimulator.IndigoFramebufferServices FramebufferRendererHint X` where `X` is `0...3`. I have found `3` (OpenGL) works best for me. Remember to restart the simulator after changing.

Using these two techniques my iOS Simulator went from practically unusable back to 'reasonable'. However, I went ahead and filed a [radar](rdar://problem/38136193) as [suggested](https://forums.developer.apple.com/message/268880#268880) because I would like to see my GPU being used instead! Feel free to dupe if you find the same on your machine.

*Update* 6th March 2018:  got back to me asking for more information on what I meant by "unusable". In order to demonstrate, I supplied two videos of scrolling performance in the iOS Simulator before and afterwards.

*Update* 8th March 2018:  closed my radar as a dupe of [radar](rdar://problem/18430676).