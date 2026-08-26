# KAC Vault Data Layer

`inventory.json` is the canonical public catalog data source for the collection.

## Core record model

- `sku` — permanent record identifier, never reused
- `category` — Comics, Cards, Memorabilia, etc.
- `title`, `issue`, `year`, `publisher`
- `status` — Raw, Graded, Packaged, etc.
- `grade` — grading company and grade when applicable
- `significance` — concise collector significance
- `valuation.low` / `valuation.high` — working catalog range
- `photos` — public web asset paths
- `recordUrl` — permanent item page
- optional grading fields: `cert`, `pages`, `creators`, `note`

The JSON model is intentionally designed so it can later map into a database/API without changing the permanent SKU system.
