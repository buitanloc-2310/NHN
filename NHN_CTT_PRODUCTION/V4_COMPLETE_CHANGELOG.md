# NHN V4 — Complete App Upgrade

## Public app
- App-style hierarchical navigation and mobile bottom navigation.
- News listing uses compact cards; full content opens in a dedicated reader view.
- Participate uses opportunity cards and opens dynamic forms inside the app.
- Direct image upload for news covers and home hero; no pasted image URL required.
- Dedicated administrator login screen at `#admin/login`.

## Admin app
- Expanded admin navigation and app shell.
- Per-route scroll restoration to avoid jumping back to the top after work.
- Form Builder supports create/edit/delete/duplicate forms and sections/questions.
- Question types: text, long text, email, phone, number, date, URL, dropdown, radio, multi-select, confirmation and file upload.
- Form open/closed state can be changed in the editor.
- Direct public-image upload through the file service.
- Responsive admin UI and improved table/modal/builder presentation.

## Security / operations
- New/reset passwords use PBKDF2-SHA256 with 150,000 iterations; existing hashes remain compatible via stored iteration count.
- Unknown Google accounts are no longer auto-provisioned through admin/member OAuth portals.
- Public health endpoint returns only `{ok}`.
- Automatic backup scope expanded to operational tables and runs with the configured daily cron.
- Service worker upgraded to versioned cache, old-cache cleanup, network-first navigation, and API/file no-cache handling.
- Production checklist corrected for `app.nhahanngu.io.vn`, D1 `nhn`, R2 `nhn-app-files`.
