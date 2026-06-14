# design-assets

Original / source art and unused high-resolution assets that should **not** ship
to production. These were moved out of `public/` so Vite no longer copies them
into `dist/` (which is what gets deployed to GitHub Pages).

Nothing here is referenced by the live site. Kept in version control so the
originals aren't lost. Includes:

- High-resolution dialog portrait PNGs (the site uses the `.webp` versions in `public/Dialog/Pictures/`)
- `Plus.kra` — Krita source for the favicon/logo
- `HeroBGVideo_Old.mp4` — superseded hero background video
- `*.png~` — editor auto-backups
- Other `*Old*` variants

If you need to re-export a web asset, edit the source here and place the
optimized output (`.webp`, compressed `.mp4`, etc.) into `public/`.
