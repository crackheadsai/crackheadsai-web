# crackheads.ai landing page

`index.html` is the whole site: one self-contained page with every SVG inlined. Host this folder as-is (for example, Cloudflare Pages with `site` as the output directory).

To change the page, edit `src/template.html` and regenerate it:

```
cd site/src
python3 gen.py template.html ../index.html
```

`gen.py` reads the logo, icon and banner SVGs from `site/brand/` and inlines them.

Placeholders: the build-night date (Thu Dec 4, 6 PM CT), the seat count and venue, and the three AI news picks.
