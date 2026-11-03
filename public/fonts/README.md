# Local font licenses and source

Two font families are served locally: Exo 2 by the Exo 2 Project Authors for body text, and Barlow Condensed by Jeremy Tribby for display headings. Both use the SIL Open Font License 1.1; the complete licenses are retained beside these files. No third-party font request occurs at runtime.

Source records (the committed local files are the build inputs):

| Local subset | Original URL | Weight/style |
| --- | --- | --- |
| exo-2-400-latin.woff2 | https://cdn.jsdelivr.net/npm/@fontsource/exo-2@5.3.0/files/exo-2-latin-400-normal.woff2 | 400 normal; downloaded 2026-11-03 |
| exo-2-600-latin.woff2 | https://cdn.jsdelivr.net/npm/@fontsource/exo-2@5.3.0/files/exo-2-latin-600-normal.woff2 | 600 normal; downloaded 2026-11-03 |
| barlow-condensed-800-italic-latin.woff2 | https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-italic.woff2 | 800 italic |

These are Latin subsets; internal font names are unchanged. Exo 2 license source: https://cdn.jsdelivr.net/npm/@fontsource/exo-2@5.3.0/LICENSE, corresponding to https://github.com/google/fonts/blob/main/ofl/exo2/OFL.txt. The display subset was downloaded on 2026-11-02; its binary remains unchanged. Display license source: https://github.com/google/fonts/blob/main/ofl/barlowcondensed/OFL.txt.

The former Barlow body WOFF2 files and their license are archived in `docs/font-source/barlow/` and are no longer shipped. The existing CV PDF and its separate Barlow TTF source assets were not changed.
