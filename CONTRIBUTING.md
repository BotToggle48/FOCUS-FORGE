# Contributing to FocusForge

Thank you for your interest in contributing to **FocusForge**! We welcome improvements, bug reports, and suggestions to make this focus sanctuary even better.

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/focusforge.git
   cd focusforge
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Run Unit Tests**
   Before submitting changes, ensure all unit tests pass:
   ```bash
   npx tsx --test src/utils/__tests__/*.ts
   ```

5. **Type Checking & Linting**
   ```bash
   npm run lint
   ```

## Architectural Guidelines

- **Decoupled Persistent Audio:** Never unmount `PersistentSpotifyHost.tsx` or couple iframe rendering with transient state like timer ticks.
- **Strict Anti-Inflation:** Never advance the 30-Day Challenge counter simply because a timer starts or a page opens. Only verified completed sessions exceeding the daily goal increment challenge days.
- **Design Consistency:** Retain the zero-pill, high-contrast dark aesthetic with neon turquoise accents. Follow Tailwind CSS v4 variables defined in `index.css`.
