# Automatic Paddle product sync

## Changes
- Make the product price editable in the admin form and remove the Paddle price ID field from the interface.
- Treat the admin price as the source: Sync will push that amount and currency to Paddle.
- On Sync, automatically link the same-name Paddle product; if none exists, create the Paddle product and its one-time price.
- Replace stale or invalid saved Paddle IDs automatically and keep the resolved ID hidden.
- Improve success and error messages so each product reports whether it was created, linked, or updated.

## Technical details
- Follow Paddle pagination when reading the catalog, avoiding the current first-200-item limit.
- Use Paddle product and price write endpoints with the configured sandbox/live credentials.
- Add focused tests for name matching and the USD 99.99 price payload.

## Validation
- Run the focused tests and check the preview build.
- Verify the admin editor no longer asks for a Paddle ID and the price is editable.
