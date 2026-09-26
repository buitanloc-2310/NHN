# APP HOTFIX — 2026-09-26

## Fixed
- Public header no longer replaces the account/menu icon with the signed-in user's full name/email. It stays as the compact menu icon and routes to Admin when authenticated.
- Hero image saving in Admin Settings now uses `/api/admin/settings/hero`.
- The Hero endpoint uploads the image to R2, creates the public `files` row, and persists `hero_cover_url` to `settings` in the same request flow.
- Hero branding upload requires `settings.manage`, avoiding the previous split-permission failure where a settings administrator could edit branding but not complete the generic file upload flow.
- Settings UI now disables the save button while saving and surfaces save errors instead of silently appearing successful.

## Validation
- `node --check public/app.js`: PASS
- `node --check src/admin.js`: PASS
- `npm run validate`: NHN Production validation: OK
