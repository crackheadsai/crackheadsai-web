# crackheads.ai landing page

`public/index.html` is the whole site, with every SVG inlined. Netlify serves the checked-in page from `public/`.

To change the page, edit `src/template.html` and regenerate it from the repository root.

```bash
python3 src/gen.py src/template.html public/index.html
```

`gen.py` reads the logo, icon and banner SVGs from `public/brand/` and inlines them.

The build-night date (Thu Dec 4, 6 PM CT), the seat count and venue, and the three AI news picks are placeholders.
