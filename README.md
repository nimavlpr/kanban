# Kanban - Interview Project

A fully functional Kanban built with **Next.js 14**, **TypeScript**, and **Zustand**. This project demonstrates clean architecture, drag-and-drop functionality, and local state persistence without a backend.

## 🚀 Features

- **Drag & Drop:** Smooth drag and drop for both Cards and Lists (using `@hello-pangea/dnd`).
- **Data Persistence:** All changes are saved automatically to `localStorage`.
- **CRUD Operations:**
    - Create, Read, Update, Delete Lists.
    - Create, Read, Update Cards.
    - "Delete All Cards" in a list feature.
- **Interactive UI:**
    - Inline editing for titles (Lists & Board).
    - Modal for card details and comments.
    - Custom context menus for list actions.
- **Tech Stack:**
    - Next.js (App Router)
    - TypeScript (Strict typing)
    - SCSS (Modular architecture with mixins/variables)
    - Zustand (State Management)

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nimavlpr/kanban.git
    cd kanban
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

The project follows the **SOLID** principles and **Separation of Concerns**:

- `/src/components`: Reusable UI components (Board, List, Card, etc.).
- `/src/store`: State management logic (Zustand store with actions).
- `/src/styles`: SCSS partials using 7-1 pattern architecture.
- `/src/types`: TypeScript interfaces and types.

## 🎨 Styling

Styling is done purely with **SCSS** (no Tailwind/Bootstrap) as per requirements.
- Uses **Variables** for consistency.
- Uses **Mixins** for reusable styles.
- Uses **BEM**-like naming convention.

---
Built with ❤️ for the frontend interview task.
