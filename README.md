# SBG Sci-Fi Client build repository

This repository contains a small patch layer over `wrager/sbg-scout` v1.2.0.
GitHub Actions clones the upstream source, applies the clean Sci-Fi Client patch and builds an installable debug APK.

## What is intentionally removed

- SBG Vanilla+
- SBG Enhanced UI
- SBG CUI
- visible third-party userscript manager controls
- userscript update UI
- Vanilla+ automation/settings injection

## What remains

- Scout WebView, login/session, geolocation and game integration
- minimal native settings
- bundled `SBG Sci-Fi Client` visual-only shell
- graphics profiles `MIN / BAL / FULL`

The shell does not synthesize/repeat clicks, accelerate actions, or send extra gameplay requests.

## Build

Push these files to the `master` branch. Open **Actions → Build Android APK** and wait for the workflow. The APK appears under **Artifacts** as `sbg-scifi-client-v0.7-debug`.
