# Changelog

## 0.2.6 — 2026-10-26

- Synchronize Spotify pause/resume with character quiet modes, including group scenes, runners and fighters.
- Expire stale audio frames and prevent delayed playback polling from overriding a newer pause event.
- Forward native Spotify song-state updates to MusicThing.
- Keep startup compatible with Car Thing’s Chromium 69; add a regression check without globalThis.


## 0.2.5 — 2026-10-26

- Add Deadpan, Zest and Chiseled with distinct bodies, facial artwork and quiet activities.
- Redesign AFK with the supplied gamer reference, mixer pose B and keyboard quiet pose D.
- Remove redundant DJ prefixes from character display names while preserving saved IDs.
- Refresh the twenty-five-character galleries; Guest Set and Dance Party remain last.

## 0.2.4 — 2026-10-26

Add DJ Croak & Dagger (royal frog) and DJ AFK (gamer), with distinct bodies, native vector heads, quiet activities and participation in Guest Set/Dance Party. Refresh the galleries for twenty-two DJ choices; existing selections retain their IDs.

## 0.2.3 — 2026-10-26

Rename DJ Scream to DJ Scare and Full Crew to Dance Party. Remove Bubble Pop’s stray hair stroke above her head. Refresh character galleries.

## 0.2.2 — 2026-10-26

- Keep visualizer scenes proportional and centered in fullscreen and Spotify preview.
- Prevent Spotify’s optional liked-status lookup from blocking track metadata during rate limits. The integration omits automatic liked-status retrieval while retaining explicit like actions.

## 0.2.1 — 2026-10-26

Fix DeskThing’s song metadata handler stopping when artwork is already locally proxied. Titles, artists and playback state continue updating, without repeatedly proxying the same image. Includes modern/legacy regression coverage.

## 0.2.0 — 2026-10-26

- Add Neon Stage, Beat Fighter and Beat DJ, bringing the collection to eight visualizers.
- Add six fighters, twenty DJ choices, unique runner bodies and illustrated galleries for every effect and character collection.
- Add Chrome & Gold’s five additional set routines: headphone check, crossfader sweep, double scratch, overhead clap and robot wave.
- Add DJ Couture, DJ Mellow, DJ Scare, DJ Ibiza and DJ Glitch; shared-table robot duo, Guest Set and an eight-character Dance Party scene.
- Add expressive performance gestures and individual silence activities, varied fighter targets and katana choreography.
- Keep live Spectrum Waves behind fighters; remove static arena scenery and walking ground.
- Add a compact character dropdown while preserving tap-to-cycle. Move the music-note lyrics toggle left of the name.
- Separate Runner, Fighter and DJ pace; preserve selections across Spotify preview, fullscreen and menu returns.
- Improve icon controls, gesture isolation, spectrum styling and Spotify return navigation.

## 0.1.0 — 2026-10-26

First public release: five audio-reactive effects; seventeen Beat Runner characters with unique environments and silence animations; independent runner-speed and skyline controls; Spotify preview integration; compact/fullscreen player layouts; timed lyrics and an optional current/next-line visualizer overlay; queue, recent-history and speaker pages. Visualizer gestures and buttons are isolated from Spotify's automatic side-panel handlers.

Includes a backed-up, repeatable client/Spotify integration installer, setup and privacy notes, dependency notices, runtime/source archives and a separate DeskThing latest.json asset. Tested on Apple Silicon/macOS 13+, DeskThing Server 0.11.17, client 0.11.2. Protected music-video playback is unavailable on the tested Car Thing browser.
