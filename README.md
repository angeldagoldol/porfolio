# Three Chapters, One Canvas — Group Portfolio

A responsive group portfolio built with React and Vite. The project presents three equal member chapters while keeping content, components, and external CSS organized according to a standard React folder structure.

## Current member status

- Chapter 01: Angel Mc Lorenz K. Dagoldol — profile and photo included.
- Chapter 02: Mike Jaspher P. Liggayu — profile information and supplied photo included.
- Chapter 03: Van Yowrick B. Eapina — profile information and supplied photo included.

## Included features

- Selected three-column editorial design with equal member prominence
- Davao night and nebula visual direction
- Animated shared signal, page particles, guitar strings, and table-tennis trail
- Complete member chapters for personal information, About, Skills, Projects, Achievements, Hobbies, and Contact
- Honest handling of social names that were provided without profile links
- Responsive desktop, tablet, and mobile layouts
- Keyboard-accessible navigation and mobile menu
- Smooth internal navigation, active-section tracking, and scroll reveals
- Reduced-motion support
- Responsive WebP images and capped canvas rendering
- External CSS only; no inline JSX styling

## Project structure

```text
angel-mc-lorenz-group-portfolio/
├── public/
│   ├── images/
│   │   ├── davao-nebula-night-*.webp
│   │   ├── lorenz-profile-*.webp
│   │   ├── mike-liggayu-profile-*.webp
│   │   ├── van-yowrick-eapina-profile-*.webp
│   │   ├── member-placeholder-*.webp
│   │   └── student-desk-scene-*.webp
│   └── favicon.svg
├── screenshots/
├── src/
│   ├── components/
│   ├── data/
│   │   └── portfolioData.js
│   ├── hooks/
│   ├── styles/
│   │   ├── layout.css
│   │   ├── motion.css
│   │   ├── responsive.css
│   │   ├── tokens.css
│   │   └── portfolio.css
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   └── group-portfolio.test.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Run locally

Requirements:

- Node.js `20.19.0` or a newer supported version
- npm

Commands:

```bash
npm install
npm run dev
```

## Validate the project

```bash
npm test
npm run build
```

Or run both checks:

```bash
npm run check
```

## Upload to GitHub

Create an empty GitHub repository, open a terminal inside this project folder, and run:

```bash
git init
git add .
git commit -m "Create three-member group portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Confirm the framework preset is Vite.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

If this project is inside a larger repository, set Vercel's Root Directory to the folder containing this `package.json` file.
