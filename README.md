# Blog-Log

A minimal server-rendered blog application built with Node.js, Express, and EJS.

## Features
- Create, edit, and delete blog posts
- Search posts by title or content
- Sort posts by date or alphabetically
- Responsive UI built with Bootstrap
- Server-side rendering with EJS templates

## Tech Stack
- Node.js
- Express.js
- EJS
- Bootstrap 5

## Design Decisions
This project intentionally does not use a database.
Posts are stored in server memory to focus on:
- Express routing
- Server-side rendering
- Application structure

All data resets on server restart.

## Live Demo
🔗 https://blog-log--am-pixel-crypto.replit.app/

## Getting Started
```bash
npm install
node index.js
