# React + Vite

## Local development

Use Node.js 22.x (see `.node-version` and `package.json`). Set the deployment
environment's Node.js version to 22.x as well.

```sh
npm ci
npm run dev
```

Run `npm run build` to create a production build.

## Cloudflare Pages

Use npm with the committed `package-lock.json` for dependency installation.
Do not add a Bun or Yarn lockfile alongside it: multiple lockfiles can cause
the deployment environment to select a different package manager.

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 22.x


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin foundation (#16 / #17)

- [UI mockups and state rules](docs/admin-design.md)
- [Data, API, authentication and hosting contract](docs/admin-platform.md)
- [Migration and recovery](docs/admin-migration.md)

Run `npm run dev` and open `/admin/design` to review the development-only
mockups. Production administration requires server-side Cloudflare Access and
D1 configuration; live editing forms and public API integration belong to
issues #20 / #21. The public page continues using the existing static data.

Checks: `npm run test:content`, `npm run test:projects`, `npm run lint`,
`npm run build`, `npm run build:functions`. Migration preparation writes a
reviewable bundle without modifying any database.
