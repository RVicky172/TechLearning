# TechLearning

TechLearning is a documentation-style learning site built with Next.js, React, TypeScript, Framer Motion, and a structured topic tree. Each technology is modeled as data and rendered through shared UI so new learning tracks can be added without changing page logic.

## Current Learning Catalog

The app currently ships first-class learning tracks for:

- React
- JavaScript
- TypeScript
- Node.js
- Databases
- Cloud Infrastructure
- CSS
- SCSS
- Fullstack Concepts
- AI
- DSA
- Webpack

Recent additions include broader real-world coverage for:

- SQL, NoSQL, caching, search, and vector storage
- Cloud infrastructure, CI/CD, and deploying applications to the cloud
- Proxies, reverse proxies, and networking layers in production
- Authentication methods, auth attacks, and practical defenses

## How Content Is Organized

Learning content lives under `src/data/technologies/`.

- `src/data/types.ts` defines shared data shapes such as `Technology`, `TopicNode`, and `TheoryDetail`
- `src/data/technologies/index.ts` is the registry of all top-level technologies shown in the UI
- `src/data/technologies/<tech>/index.ts` assembles a single technology from smaller topic files
- Larger technologies are split into one topic file per section or sub-topic folder

This structure keeps the app UI generic while the curriculum evolves through data-only changes.

## App Structure

- `src/app/page.tsx` renders the home catalog
- `src/app/tech/[id]/page.tsx` renders each technology overview and topic details
- `src/components/` contains shared UI such as the sidebar, search, code block, and CSS preview
- `src/contexts/ThemeContext.tsx` manages the light and dark theme toggle

## Development

Run the app locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

```bash
npm run dev
npm run build
npm run lint
```

## Adding or Updating Topics

1. Create or edit topic files under the relevant folder in `src/data/technologies/`.
2. Keep the technology `index.ts` file as a thin assembler.
3. Register new top-level technologies in `src/data/technologies/index.ts`.
4. Update any README or instructions file that documents the affected structure.

## Notes

- Styling uses Tailwind utility classes plus CSS custom properties defined in `src/app/globals.css`.
- Content examples should be realistic, production-oriented, and concise enough to scan on the topic page.
- The site is designed to feel like product documentation rather than a blog or course landing page.
