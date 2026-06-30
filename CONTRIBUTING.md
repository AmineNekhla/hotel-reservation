# Contributing to LuxeStay Hotel Reservation System

Thank you for considering contributing to **LuxeStay**! This document outlines the process for contributing to this project. By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/AmineNekhla/hotel-reservation.git
   cd hotel-reservation
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-description
   ```

---

## How to Contribute

You can contribute in many ways:

- 🐛 **Bug fixes** — Found something broken? Open an issue first, then submit a PR.
- ✨ **New features** — Check existing issues/discussions before starting.
- 📝 **Documentation** — Improve the README, API docs, or code comments.
- 🎨 **UI/UX improvements** — Enhance the frontend design.
- 🧪 **Tests** — Add missing unit or integration tests.
- ♻️ **Refactoring** — Improve code quality without changing behavior.

---

## Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17 or higher |
| Maven | 3.8+ |
| Node.js | 18 LTS or higher |
| Angular CLI | 17+ |

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8082`.

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

---

## Coding Standards

### Java (Backend)

- Follow **Java naming conventions** (camelCase for methods/variables, PascalCase for classes).
- All public classes and methods must have **JavaDoc comments**.
- Use **constructor injection** over field injection (`@Autowired`).
- Never bypass the Service layer by injecting Repositories directly into Controllers.
- All business logic belongs in the **Service layer**.
- Use **DTOs** for all API request/response payloads — never expose entities directly.
- Validation annotations (`@NotBlank`, `@Min`, etc.) belong on **DTOs**, not entities.
- Prefer `ResponseEntity<T>` for controller return types.

### TypeScript / Angular (Frontend)

- Use **TypeScript strict mode** — no `any` types.
- Component logic should be minimal — delegate to Services.
- HTTP calls belong exclusively in **Services**, never in components.
- Use **Reactive Forms** (`FormGroup`, `FormControl`) for all forms.
- All observables should be properly **unsubscribed** in `ngOnDestroy`.
- CSS variables should be used from the design system — no magic numbers.

### General

- Follow the **SOLID principles**.
- Write **self-documenting code** — variable and method names should be descriptive.
- No commented-out dead code in commits.
- No `TODO` comments left in production code without a linked issue.

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code restructuring (no feature or fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates |

**Examples:**

```
feat(auth): add JWT refresh token support
fix(reservation): prevent double-booking for same room
docs(readme): update installation guide for Windows
refactor(admin): extract stats logic into StatsService
```

---

## Pull Request Process

1. Ensure your branch is **up to date** with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Make sure the backend **builds and all tests pass**:
   ```bash
   cd backend && mvn clean test
   ```
3. Make sure the frontend **compiles without errors**:
   ```bash
   cd frontend && ng build
   ```
4. Submit your PR against the `main` branch.
5. Fill out the **PR template** completely.
6. At least one review approval is required before merging.
7. Squash commits before merging for a clean history.

---

## Reporting Bugs

Please open a [GitHub Issue](https://github.com/AmineNekhla/hotel-reservation/issues) using the **Bug Report** template and include:

- A clear, descriptive title.
- Steps to reproduce the behavior.
- Expected vs. actual behavior.
- Screenshots if applicable.
- Environment details (OS, Java version, Node version, browser).

---

## Suggesting Features

Open a [GitHub Issue](https://github.com/AmineNekhla/hotel-reservation/issues) using the **Feature Request** template and explain:

- The problem your feature solves.
- Your proposed solution.
- Any alternative approaches you considered.

---

## Questions?

Feel free to reach out via the contact information in the [README](README.md) or open a Discussion on GitHub.

Thank you for contributing! 🙏
