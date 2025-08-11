# Musician Discovery Platform

This repository contains two independent Create React App projects:

- musician_web — Musician App (port 3000)
- restaurant_web — Restaurant App (port 3001)

Each app is a standalone CRA project with its own package.json and scripts.

## Prerequisites

- Node.js 18+
- npm 8+

## Install dependencies

Run once per app (from the app folder):

- For Musician App
  cd musician_web
  npm install

- For Restaurant App
  cd restaurant_web
  npm install

Note: Both apps share the same base template and already include required dependencies such as react, react-router-dom, react-scripts, and cross-env.

## Start the apps

In separate terminals:

- Musician App (port 3000)
  cd musician_web
  npm start
  # Opens http://localhost:3000

- Restaurant App (port 3001)
  cd restaurant_web
  npm start
  # Opens http://localhost:3001

The Restaurant App is configured to run on port 3001 via the start script in its package.json:
"start": "cross-env PORT=3001 react-scripts start"

## Build for production

- Musician App
  cd musician_web
  npm run build

- Restaurant App
  cd restaurant_web
  npm run build

## Test

- Musician App
  cd musician_web
  npm test

- Restaurant App
  cd restaurant_web
  npm test

## Notes

- Branding
  - Musician App shows "Musician App" in the header.
  - Restaurant App shows "Restaurant App" in the header.

- The codebase was duplicated from musician_marketplace_frontend and split into two app folders to support independent development and deployment.
