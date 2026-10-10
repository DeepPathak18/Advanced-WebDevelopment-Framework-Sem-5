# Performance

## Before

Captured before the Practical 8 application changes:

```text
> student@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 37 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-s_APBDef.css    7.11 kB │ gzip:  2.34 kB
dist/assets/index-eetRJ03c.js   225.59 kB │ gzip: 71.39 kB

✓ built in 170ms
```

JavaScript files in the build: 1.

## After

Captured after adding route-based lazy loading:

```text
> student@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 40 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.45 kB │ gzip:  0.29 kB
dist/assets/index-z5dXKR3C.css      7.27 kB │ gzip:  2.37 kB
dist/assets/Errormsg-CGEGeDq9.js    0.28 kB │ gzip:  0.23 kB
dist/assets/RepoList-CPdW73eR.js    0.30 kB │ gzip:  0.24 kB
dist/assets/Contact-Btkzesh4.js     0.82 kB │ gzip:  0.45 kB
dist/assets/Register-Tu27nLVG.js    1.19 kB │ gzip:  0.59 kB
dist/assets/Login-CvNktxEI.js       1.37 kB │ gzip:  0.69 kB
dist/assets/Projects-BbIu9K3d.js    1.46 kB │ gzip:  0.80 kB
dist/assets/Tasks-Ba_5_zPq.js       3.16 kB │ gzip:  1.32 kB
dist/assets/index-CuSfrIZJ.js     220.46 kB │ gzip: 70.49 kB

✓ built in 169ms
```

### Build comparison

| Output | Before | After |
|---|---:|---:|
| Main JavaScript bundle | `index-eetRJ03c.js` — 225.59 kB / 71.39 kB gzip | `index-CuSfrIZJ.js` — 220.46 kB / 70.49 kB gzip |
| JavaScript file count | 1 | 8 |
| Contact route chunk | Included in main bundle | `Contact-Btkzesh4.js` — 0.82 kB / 0.45 kB gzip |
| Register route chunk | Included in main bundle | `Register-Tu27nLVG.js` — 1.19 kB / 0.59 kB gzip |
| Login route chunk | Included in main bundle | `Login-CvNktxEI.js` — 1.37 kB / 0.69 kB gzip |
| GitHub page route chunk (`/github`) | Included in main bundle | `Projects-BbIu9K3d.js` — 1.46 kB / 0.80 kB gzip |
| Tasks route chunk (`/projects` and `/tasks`) | Included in main bundle | `Tasks-Ba_5_zPq.js` — 3.16 kB / 1.32 kB gzip |
| Supplementary GitHub list chunk | Included in main bundle | `RepoList-CPdW73eR.js` — 0.30 kB / 0.24 kB gzip |
| Shared lazy-page error component | Included in main bundle | `Errormsg-CGEGeDq9.js` — 0.28 kB / 0.23 kB gzip |

The entry bundle is only modestly smaller (5.13 kB raw, 0.90 kB gzip), which is
expected for this small application. The main benefit is that route-specific
code is now fetched on first visit instead of loading every route upfront.
Vite also emits a shared lazy-page chunk for `Errormsg`.

### Browser measurements

Fill these values in using the browser Network tab. The build report cannot
measure request timing, transferred bytes in your browser, or throttled load
time.

| Measurement | Before | After, normal network | After, Slow 3G |
|---|---|---|---|
| JavaScript requests | to be filled by student | to be filled by student | to be filled by student |
| Total JavaScript transferred | to be filled by student | to be filled by student | to be filled by student |
| Load time | to be filled by student | to be filled by student | to be filled by student |
