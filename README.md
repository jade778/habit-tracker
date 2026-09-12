# Habit Quest

A simple habit tracker with a real-money treat fund instead of virtual rewards.

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`). This sandbox had no internet access to run `npm install` for you, so do that step on your own machine first.

To install it to your phone's home screen: open the dev URL (or a deployed version) in your phone's browser, then use "Add to Home Screen" (iOS Safari) or the install prompt (Android Chrome).

## Deploying to GitHub Pages

The project is already configured for a repo named `habit-tracker` (see `base` in `vite.config.js`). If you name your repo something else, update that one line to match: `base: '/your-repo-name/'`.

```bash
npm install
```

Create a new repo on GitHub called `habit-tracker`, then from this project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/habit-tracker.git
git push -u origin main
```

Then deploy the built app to a `gh-pages` branch:

```bash
npm run deploy
```

This runs the build and pushes the `dist` folder to a `gh-pages` branch automatically (via the `gh-pages` package).

**One-time setup in GitHub:** go to your repo's Settings → Pages, and under "Build and deployment" set the source to "Deploy from a branch", branch `gh-pages`, folder `/ (root)`. Save. After a minute or two, your app is live at:

```
https://<your-username>.github.io/habit-tracker/
```

Open that URL on your phone and use "Add to Home Screen" (iOS Safari) or the install prompt (Android Chrome) to get an app icon.

**Updating later:** after making changes, just run `npm run deploy` again — it rebuilds and re-publishes.

## How it works

- **Data model** (`src/lib/storage.js`): everything lives in `localStorage` under one key. No backend, no account — data stays on the device.
- **Habit types** (`src/lib/habitLogic.js`):
  - `daily` habits are yes/no per day, with a difficulty (`easy`/`medium`/`hard`) that sets the point value.
  - `quota` habits (like running) track a count against a weekly target, with a custom unit and per-instance + completion-bonus payouts.
- **Reward economy**: every habit action earns points, points convert to cents at one fixed rate (`CENTS_PER_POINT` in `habitLogic.js`). Change that one number to retune how fast the whole app pays out.
- **Treat fund** (`src/components/TreatFund.jsx`): one goal at a time (name + dollar amount), fills up from habit completions, resets to $0 when redeemed. Shows a live pace estimate based on your last 14 days of earnings.

## Tuning the economy

Open `src/lib/habitLogic.js`:

```js
export const POINTS = {
  easy: 1, medium: 2, hard: 3,
  quotaInstance: 2, quotaBonus: 4,
}
export const CENTS_PER_POINT = 25
```

Raise `CENTS_PER_POINT` to make treats fill up faster; adjust individual `POINTS` values to change relative weighting between habit types.

## Next steps (not built yet)

- Strava/Google Calendar integration — deferred for now; manual run logging covers the core loop.
- Editing existing habits (currently: add or delete only).
- Multi-goal treat history (currently only tracks the single active goal; past redemptions aren't logged).
