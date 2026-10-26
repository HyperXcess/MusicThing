# MusicThing

[Releases](https://github.com/HyperXcess/MusicThing/releases) · [Issues](https://github.com/HyperXcess/MusicThing/issues)

**Eight retrowave visualizers, animated characters and timed lyrics for your Car Thing.**

Audio capture starts automatically. Explore EQ Bars, Warp Tunnel, Synth Grid, Spectrum Waves, Neon Stage, Beat Runner, Beat Fighter and Beat DJ. No audio recordings are saved.

![Beat DJ live visualizer](docs/visualizer-7.png)

**[Explore the illustrated visualizer and character guide →](docs/VISUAL-GUIDE.md)** — screenshots of all eight effects, all 17 runners, all six fighters and all 25 DJ choices, plus Chrome & Gold’s five new set routines.

## Requirements

Tested on an Apple Silicon Mac running macOS 13+, DeskThing Server **0.11.17**, client **0.11.2**, and a Thing Labs-flashed Car Thing. Windows, Linux and Intel Mac audio capture are not supported by this release. The optional client integrations validate the exact 0.11.2 modern and legacy bundle layouts before writing. An upstream client update may require reinstalling a compatible integration.

Install and sign in to DeskThing's **Spotify app** first. Music must play through the Mac's audio output for the visualizer to respond; playback only on a phone or another Spotify speaker is not captured. Allow DeskThing under macOS **Privacy & Security → Screen & System Audio Recording** when prompted, then reopen DeskThing if required. The helper receives audio only; no screen images are transmitted to the Car Thing.

## Install

1. In DeskThing, open **Downloads → Add Client/App** in the left sidebar.
2. Add `https://github.com/HyperXcess/MusicThing` as an **App** repository, then pull/download the latest release and initialize it.
3. The declared post-install helper backs up and stages MusicThing navigation and the Spotify visualizer integration. Spotify must already be installed. It does not modify Spotify credentials or calendar settings.
4. Open **Clients → Push staged client**, then **Restart Chromium on the Device**.
5. Open MusicThing from your app launcher. Audio capture starts automatically.

The `musicthing-vVERSION.zip` asset is the installable app. `latest.json` provides store metadata, the version-pinned runtime URL, embedded icon, size, and SHA-512. `MusicThing-source-vVERSION.zip` is development source.

[LaunchThing](https://github.com/HyperXcess/LaunchThing) and [ControlThing](https://github.com/HyperXcess/ControlThing) are optional companions. ControlThing adds the bottom waveform entry: tap it or pull up from the bottom edge to open MusicThing. The entry disappears inside MusicThing; **Back** returns to your previous app. A short pull previews and cancels. Without ControlThing, use your app launcher.

## Controls

| Action | Result |
| --- | --- |
| Swipe left/right on visuals, or turn the dial | Change visualizer; selection also persists underneath Spotify |
| Swipe up/down on a non-character effect | Change sensitivity, initially 1.0× |
| Swipe up/down on Runner, Fighter or DJ | Change that mode’s independent animation pace |
| Tap a character visualizer | Cycle characters without stopping the animation |
| Tap the character name ▾ | Open a compact, scrollable character dropdown |
| Tap the music-note icon left of the name | Toggle timed lyrics in the upper-right background |
| Expand | Hide the compact playback row; restore with the lower-left control |
| More → Adjust | Adjust pace separately from audio/EQ reaction |
| More | Effect picker, visual pause, Lyrics, Up Next, Recent and Devices |

On the original Spotify screen, swipe sideways to cycle artwork and effects; swipe up on artwork to show EQ Bars. Spotify’s playback controls remain above the preview. MusicThing’s own screen uses a compact player row. Header controls stay in fixed positions, away from the physical dial.

## Character modes

**Beat Runner:** seventeen distinct bodies and moving vector environments, a clean EQ skyline, bass-triggered hurdles, animated trails and individual silence animations. Speed and skyline sensitivity are separate. Hurdles respond to audio onsets and then travel toward the runner; this is not exact beat-grid synchronization.

**Beat Fighter:** six fighters, including Master Jin and The Bride, with varied targets, spinning kicks, jumps, ducks and character-specific strikes. Fighters hold a breathing ready stance between encounters. The shared Spectrum Waves effect remains behind them at reduced opacity; static arena scenery is removed. Silence animations retain their captions. Combat pace is independent of Runner and DJ speed.

**Beat DJ:** twenty-five choices, alphabetized with Guest Set and Dance Party last. Distinct bodies, faces and outfits accompany scratches, fader moves, headphone checks, crowd gestures, occasional headbangs and character-specific quiet activities. Croak & Dagger wears a crown and gold chain and polishes his gold during silence; AFK has a broad gamer build, works the mixer and takes a keyboard break. Deadpan, Zest and Chiseled add coffee, joke-notes and mirror-check quiet activities. Couture takes peace-sign selfies; Toast Malone has an occasional toast/fire routine; Bubble Pop uses a bubble wand. Chrome & Gold share one two-platter table and trade mixing/hype roles, with five additional smoothly blended routines. Dance Party caps the scene at eight characters to limit rendering load.

See the [visual guide](docs/VISUAL-GUIDE.md) for every character and effect.

## Lyrics and Spotify permissions

Timed lyrics from **LRCLIB** highlight and follow playback on the Lyrics page; manual scrolling exposes **Follow live**. Some recordings have only plain lyrics, and some have none. The visualizer overlay requires timed lyrics and reports when unavailable. Track title, artist, album and duration are sent to LRCLIB to find a match. No Spotify token is sent to LRCLIB or the browser.

Up Next shows the Spotify queue with playback/queue actions. Devices lists Spotify Connect speakers. Recent requires Spotify's `user-read-recently-played` permission; if the installed Spotify integration has not requested that scope, Spotify returns an error until its authorization is updated. This app does not silently grant new scopes.

The optional integration also removes the Spotify app’s automatic liked-status lookup from its metadata path, so a rate-limited library request cannot hold up the song title. Explicit like actions remain available; automatic heart-state retrieval is omitted.

The backend reuses the existing local DeskThing Spotify integration's token and sends it only to Spotify's API. It does not provide a separate OAuth flow. **Music videos are not supported on the tested Car Thing browser**, which lacks the protected-playback support Spotify requires. Experimental embed code is not exposed in navigation.

## Optional legacy HTTPS relay

The release defaults **Enable legacy Spotify HTTPS relay** to off. It is only for devices already configured to use a Spotify-only USB proxy; initialization does not change firmware, proxy settings or the browser supervisor command. Enabling it starts a loopback-only Mac relay, restores port 8892 for one connected device and synchronizes its clock. Only allowlisted Spotify HTTPS destinations are accepted; TLS and certificate validation remain intact. This does not make protected Spotify video work. Normal audio visuals and lyrics do not require this relay.

## Build, test and package

On Apple Silicon/macOS, install Node.js 20+ and Apple's Command Line Tools:

```sh
npm ci
npm test
npm run package
```

The build compiles the Swift ScreenCaptureKit helper and bundles client/server code for Chromium 69/Node 20. Release files are in `release/`. For a manual integration, build, then run `node dist/postinstall.mjs --host "/path/to/deskthing"` with DeskThing closed; push the staged client afterward.

Post-install changes have `.musicthing.backup` files. Restore these with DeskThing closed, then push/restart the client to undo the integration. A full-bundle backup can include older companion versions; reapply other extensions afterward. Reinstalling or updating Spotify can replace its client integration; reinitialize MusicThing to restore it.

## License

MIT. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for dependency credits and licenses. Not an official Spotify or DeskThing product.
