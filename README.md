> [!WARNING]
> This repository is deprecated and is now read-only.

# Newzio

<img src="/public/files/icon.svg" width="64" height="64" align="right" alt="Newzio" />

A news platform designed for users to publish and interact with news articles.

## Features

- **User Generated Content**
- **Rich Text Editing**
- **Community Engagement**

## Installation

To get started with Newzio, follow these steps:

1. Clone the repository

```sh
git clone https://github.com/WoIfey/Newzio.git
```

2. Navigate into the project directory

```sh
cd Newzio
```

3. Install dependencies

```sh
npm install
```

> [!NOTE]
> Make sure to do `npm run postinstall` to install TinyMCE before running development server.

4. Set up environment variables as needed. Refer to `.env.example` for guidance.

> [!WARNING]
> Make sure to make a .env.local for your environment variables, never share them!

> [!CAUTION]
> This project does not include a schema yet to easily make tables for your database.

5. Start the development server

```sh
npm run dev
```

and then navigate to `http://localhost:3000`

## Scripts

- `npm run dev` Starts the development server
- `npm run build` Builds Newzio for production
- `npm run start` Starts the production server
- `npm run postinstall` Installs TinyMCE locally
- `npm run lint` Checks for ESLint warnings or errors
