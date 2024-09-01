## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


## Start from Nextjs.org

- Documentation: https://nextjs.org/docs

- Go to https://nextjs.org/learn

- Start with react foundation for a basic understanding of react

- Next, learn the nextjs; 
  `https://nextjs.org/learn/dashboard-app/getting-started`

- OReilly: Next.js from Scratch; Brad Traversy; Published by Packt Publishing; Github: bradtraversy/property-pulse-nextjs 

## Development Environment setup

- Setup Windows WSL, and install all the prerequisites for nextjs
  development in the WSL.
- Create or clone project folder
- Install VS code in the Windows host
- Start vs code and connect remotely to WSL
- Then open the code folder in wsl

### Tools

- Browser extension: react developer tool
- MongoDB Compass: free interactive client tool for MongoDB
- VS code extension: ES7+ React/Reduc/React-Native snippets
- VS code extension: Prettier - code formatter
- VS code extension: Javascript (ES6) code snippets

### Setup wsl for next.js development environment
- Per recommendation from nextjs.org, use `pnpm` instead of `npm` or `yarn`
  because it's faster and more efficient
- Install `pnpm` using `npm`
```
npm install -g pnpm
# to update
#corepack install -g pnpm@9.8.0
```
- Install nextjs & react MANUALLY
```
npm install react@latest react-dom@latest next@latest
```
- Create new example project
```
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
```
- Install the packages
```
cd nextjs-dashboard
pnpm i
```
- Run
```
#npm run dev
pnpm dev
```

## Nextjs Development

- Nextjs is the module on top of react. Knowing the react fundamental is useful, see "The react fundamental" below.
- See misc notes about nextjs, "Nextjs nsic notes" below
- Application global files:
  - /app/layout.tsx
  - /app/page.tsx  -> `https://<domain>/`
  - /app/ui/global.css
  - /app/ui/home.module.css
  - /app/ui/fonts.ts
  - /app/dashboard/page.tsx  -> `https://<domain>/dashboard`
  - /app/lib
  - /public/*.png; /public/<subpage>/*.png

- Folder structure
  - nextjs recommend: 
    - src > app, pages, etc
    - public
  - nextjs dashboard:
    - app > dashboard, lib, login, seed, ui
    - app > layout.tsx, page.tsx
  - saas boilerplate:
    - src > app, components, features, hooks, libs, locales, models, 
            styles, templates, types, utils
    - src > instrumentation.ts, middleware.ts
    - public


### Next misc notes
- CSS - [CSS Module](https://nextjs.org/docs/pages/building-your-application/styling) is the next built-in css support; Tailwind is more popular;
  - To use CSS module, for example, add `/app/ui/home.module.css`
- CSS - Conditional style using `clsx`
- ROUTE - nextjs use file-system routing where "folders" are used to create nexted routes; each folder represents a route segment that maps to a URL segement.
- Parentheses in folder names are used to define "Group Routes." These are special types of routes that allow for organizing the project structure without affecting the URL structure. This can be particularly useful for organizing layouts, separating concerns, or grouping related components.

## The react fundamental
- At a minimum react needs two modules: core, dom & babel; that can be 
  downloaded from `unpkg.com`;
```
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

## REMOVE 
```
find . -name "*Zone.Identifier" -type f -delete
```