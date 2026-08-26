# KAC Vault

KAC Vault is a data-driven digital collection and memory archive for comics, cards, collectibles and the experiences connected to them.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- JSON data layer
- Git / GitHub
- GitHub Pages deployment

## v8.7 — Stabilization & Experience

Version 8.5 shifts KAC Vault from a primarily static catalog toward a maintainable data-driven application.

### Added
- Canonical structured inventory at `data/inventory.json`
- Schema versioning and permanent-SKU policy
- Browser JavaScript fallback data for local preview
- Full-text catalog search
- Filters for category, publisher, status, year and value range
- Multiple sort options
- Live collection analytics calculated from the same inventory data
- Publisher and condition/grading breakdowns
- Professionalized `/css`, `/js`, and `/data` structure
- Shared navigation behavior in `js/site.js`
- Data-layer documentation in `data/README.md`

### Preserved
- Permanent pages C-0001 through C-0040
- Existing vault entrance
- Games & Memories and photo galleries
- 2026 U.S. Open at Shinnecock Hills memory
- GitHub Pages compatibility and KACvault.com URLs

## Architecture

```text
/
├── assets/                 # photographs and collectible images
├── css/
│   └── styles.css
├── data/
│   ├── inventory.json      # canonical inventory data
│   ├── inventory-data.js   # local-preview fallback
│   ├── memories.json
│   ├── memories-data.js
│   └── README.md
├── js/
│   ├── inventory.js        # search, filters, analytics, rendering
│   └── site.js             # shared navigation behavior
├── item-c-0001.html ... item-c-0040.html
├── inventory.html
├── games-memories.html
├── memory.html
├── vault.html
└── index.html
```

## Next full-stack milestone

The v8.5 JSON model is intentionally structured for a later migration to a database/API. A future application release can add authenticated administration, image uploads, create/edit inventory actions and persistence without changing the permanent SKU model.


## v8.7 stabilization changes

- Restored the vault as the first experience directly on `index.html`
- Vault now opens as an entrance overlay rather than relying on a fragile gateway redirect
- Normalized the opening family photo orientation at the pixel level
- Removed known laptop / monitor placeholder images from public memory presentation
- Preserved the v8.5 JSON inventory, search, filters, analytics, and permanent SKU architecture
- Preserved the 2026 U.S. Open — Shinnecock Hills memory


## v9.2 entrance refinement

The photorealistic vault is now a responsive full-screen entrance. After opening, the footer navigation routes directly into the major sections of KAC Vault.


## v9.3 vault stage alignment

Vault artwork and hotspots now share a fixed-aspect-ratio stage so they remain aligned on any viewport. Letterboxing is preferred over cropping.
