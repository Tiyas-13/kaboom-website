# Camp Kaboom 💥

Website for **Camp Kaboom**, a hands-on, offline confidence-building camp for Classes 4 & 5. Ready, Set, Kaboom!

## Pages
- `index.html`: Flagship 3-day camp (home, for parents)
- `pilot.html`: Free 1-day school pilot (for schools)
- `join.html`: Interest, pilot request and contact forms + FAQ

Shared styles and scripts live in `assets/`.

## Run locally
```bash
python3 -m http.server 8765
```
Then open http://127.0.0.1:8765

## Forms
Forms don't send anywhere until you paste a form endpoint (e.g. Formspree) into `FORM_ENDPOINT` at the top of `assets/kaboom.js`.
