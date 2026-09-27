# Jentre Tailoring Dashboard

A simple dashboard built to track daily work for the tailors at my family's shop, Jentre.pk. Built from scratch using HTML, CSS, and Vanilla JavaScript.

![Jentre dashboard screenshot](./screenshot.png)
**[Live Demo →](https://hafizzahmadraza.github.io/Jentre-tailoring-dashboard/)**

## Why I built this

My mom handles the tailoring side of Jentre, our online boutique. A few tailors work with her, and every day they'd come and tell her what they stitched  shirts, trousers, pajamas — and she'd write it all down on a register by hand.

While I have explored advanced workflows previously, this Jentre Dashboard is my first independent project focused entirely on raw fundamentals. I wanted a real-world problem to practice Vanilla JavaScript on without relying on frameworks or AI generation. Watching her manage daily records manually clicked that I could build a functional digital tool for her to solidify my DOM manipulation and state persistence skills.

## What it does

- Add multiple tailor profiles, and switch between them to see their individual work history
- Add a daily entry for a tailor: category (shirt/trouser/pajama), number of pieces, and rate per piece
- Automatically calculates earnings for each entry
- See a summary of total pieces and earnings for the selected tailor
- Edit or delete an entry if a mistake was made
- Undo a deleted entry (5 second window before it's gone for good)
- Search and filter the history list by category or keyword
- See a monthly summary of pieces and earnings for a tailor
- Rename or remove a tailor
- Add a new tailor anytime
- All data is saved in the browser using localStorage, so it's still there after a refresh

## Tech stack

- **HTML5 & CSS3:** Responsive UI layout structured with CSS Grid and Flexbox.
- **Vanilla JavaScript (ES6 Modules):** No external frameworks or libraries.
- **3-Tier Architecture:** Clean separation of concerns divided into:
  - `state.js` — Data structures, mutations, and `localStorage` sync.
  - `ui.js` — DOM rendering, summary updates, and UI helper functions.
  - `script.js` — Main controller, form handling, and event listeners.
- **Tooling:** ESLint & Prettier for code formatting and quality standards.

## How to run it

Since the project uses native ES6 Modules, it must be served over an HTTP server (e.g., VS Code Live Server) to prevent browser CORS policy restrictions on local file imports.

```text
jentre-tailoring/
├── .vscode/
├── index.html
├── style.css
├── state.js            <-- Data engine & localStorage logic
├── ui.js               <-- DOM rendering module
├── script.js           <-- Main event controller
├── Screenshot.png
├── eslint.config.mjs   <-- Linter configuration
├── package.json        <-- Project tooling dependencies
├── package-lock.json
├── LICENSE
└── .gitignore
```

The dashboard comes with some sample data (a few tailors and entries) already filled in, so you can see how it works right away. If you want to start fresh, just clear your browser's localStorage for this page.


## What I struggled with (and learned)

Engineering Challenges & learnings:

● Case-Sensitivity Bugs: Experienced early layout bugs due to HTML/CSS class naming mismatches (e.g., Tailor-chip vs tailor-chip), establishing a strict convention to maintain consistent lowercase naming.   
● State ID Collision: Initially generated IDs based on array length, causing collisions after deletions. Resolved this by dynamically calculating IDs based on the highest existing ID.  
● ES6 Modular Refactoring: Migrated a monolithic script into 3 distinct modules (state.js, ui.js, script.js) to enforce encapsulation, handle live bindings safely, and manage strict module scoping.   
● Event Delegation: Implemented dynamic event listeners on parent elements for dynamically generated edit/delete buttons in the history list


## Next steps
```
-Add calendar-based filtering for specific date ranges.
-Dynamic category management (currently hardcoded categories).
-Upgrade backend persistence from localStorage to a REST API (Node.js/Express).
-Migrate frontend to React after mastering core JavaScript fundamentals.
```

## License

MIT see [LICENSE](./LICENSE) file.
