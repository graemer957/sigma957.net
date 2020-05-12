---
title: "Xcode Behaviours"
date: 2018-12-27T11:42:00Z
draft: false
tags: 
  - ios
  - xcode
---
Here is another blog post, I am re-publishing, originally written for my company blog on 3rd January 2018.

---

When I attended WWDC in 2012, I visited session 402 titled [Working Efficiently with Xcode](https://developer.apple.com/videos/play/wwdc2012/402/). In this session, the engineers explained about setting up behaviours in Xcode to optimise your workflow. I used what I learnt then to configure my Xcode environment for increased productivity, which I still use to this day!

## Behaviours
My idea when setting this up is to have a tab for each of the tasks I find myself performing most frequently, namely:

* **Editing** code
* Running projects and looking for console output, called **Console**
* Debugging a problem, called **Debug**
* **Search**ing the codebase


With that in mind, by the end of this article, you will have a separate tab named the same as each highlighted word above. Not only that, but Xcode will:

* Switch to **Console** tab, which is configured to maximise visibility for console output, when you run your project
* Switch to the **Debug** tab, which is configured for debugging if a breakpoint is reached
* At **any point** you can hit Option + Cmd + E to switch to the **Editing** tab to continue, well, editing your code
* When you need to perform a search hit Option + Cmd + S to switch to the **Search** tab to search the project. Alas, the cursor is not placed in the search text field! If you know a trick for this, please get in touch 🙃
* After you stop running the project, automatically switch to the **Editing** tab, so you can continue editing

## Process
1. Launch Xcode
2. Open _Preferences_ by navigating to `Xcode → Preferences` or hitting `Cmd + ,`
3. Navigate to the `Behaviors` section

### Console
On the left-hand side choose `Running → Starts` and:

1. Enable `Show tab named`, enter "Console" then in `active window`
2. Enable `Hide` navigator
3. Enable `Show` debugger with `Console View`
4. Enable `Hide` utilities

When you have finished your behaviour should look like:

![Console Behaviour](console-behaviour.0f9d7bd29967a3032e1e72cb822c1788b2a214e1501b7cef3a297daa00e13635.png)

### Debug
On the left-hand side choose `Running → Pauses` and:

1. Enable `Show tab named`, enter "Debug" then in `active window`
2. Enable `Show` navigator called `Debug navigator`
3. Enable `Show` debugger with `Variables & Console View`
4. Enable `Hide` utilities

When you have finished your behaviour should look like:

![Debug Behaviour](debug-behaviour.d85076f9deac3bf28492267861e54b9e7dfbe0e9078f8a1b46f28d05adabdc7c.png)

### Editing
This behaviour has two parts, firstly on the left-hand side chose `Running → Completes` and:

1. Enable `Show tab named`, enter "Editing" then in `active window`
2. Disable all other options

When you have finished your behaviour should look like:

![Completes Behaviour](completes-behaviour.b901a1e32fd3489ede4bac12166a0d6fda630e1e8d3294f974f0dfd07e0ae2a2.png)

Next up tap the `+` button in the bottom right of the pane, and:

1. Enter the name of "Editing"
2. At the right-hand side, enter the shortcut `Opt + Cmd + E`
3. Configure the same behaviours as we did for `Running → Completes`, which will leave you with:

![Editing Behaviour](editing-behaviour.9b8c96b6a358f53adf2acd84137cbfec5ec34e3815f138475c48297c56edf748.png)

### Searching
Tap the `+` button in the bottom right of the pane, and:

1. Enter the name of "Searching"
2. At the right-hand side, enter the shortcut `Opt + Cmd + S`
3. In your new behaviour, you can now:
    - Enable `Show tab named`, enter "Search" then in `active window`
    - Enable `Show` navigator called `Find navigator`
    - Enable `Hide` debugger
    - Enable `Hide` utilities

When you have finished your behaviour should look like:

![Searching Behaviour](searching-behaviour.df572244b5af0b63a353519448e276fb2f0fed7ad641014b3473f536001d446c.png)

### Misc
* Select `Build → Generates new issues` and disable all options. This will remove the checkmark to the left.
* Navigate to both `Generates output`s and again disable all the options.


## Other Personal Preferences
Each of these preferences can be found under the relevant pane with the given subheading.

### General
* Enable `Continue building after errors` will mean Xcode shows more errors than the first it encounters. I have found this useful during Swift source migrations.

### Fonts & Colours
* I find the `Dusk` theme to be the best balance between readability for long periods and usefulness.

### Text Editing
* Enable `Line` numbers, no explanation needed and a no-brainer in my opinion!


## Conclusion
I hope this leaves you with a better understanding of how my Xcode behaviours are configured and some ideas on how you may modify yours. I really wish that there was a supported method of exporting/importing. If I've missed it, please get in contact and let me know 😀