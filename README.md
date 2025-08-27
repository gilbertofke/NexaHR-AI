# Nexa Interviews

## Project info

This repository contains the Nexa Interviews web application.

## How can I edit this code?

There are several ways of editing your application.

## Local Development

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Deploy with your preferred platform (Vercel, Netlify, Render, etc.).

## Running the FastAPI stub locally

1. Install Python 3.10+.
2. Setup the virtual environment and install deps:

```bash
npm run backend:setup
```

3. Start both backend and frontend during development:

```bash
npm run dev:full
```

The frontend dev server proxies API calls from `/api/*` to `http://localhost:8000` (see `vite.config.ts`).

To run only the backend stub:

```bash
npm run backend:start
```
