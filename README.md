# Incubyte OKR Frontend

React + TypeScript frontend for managing Objectives and Key Results.

## Overview

This frontend application provides:

- Objective and Key Result management UI
- Progress tracking
- AI-assisted OKR generation flow
- Integration with the NestJS backend API

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm

## Setup Instructions

### 1. Navigate to Frontend Directory

```bash
cd Incubyte_okr
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

Frontend runs at **`http://localhost:5173`**.

## Available Commands

- `pnpm dev` - Start local dev server
- `pnpm build` - Build production bundle
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Vitest

## Backend Integration

This app expects backend endpoints at:

- `http://localhost:3000/objectives`
- `http://localhost:3000/objectives/:id/key-results`
- `http://localhost:3000/ai/generate-okr`

Make sure backend is running first:

[Backend Documentation](https://github.com/SakshamKaundal/OKR_backend/blob/master/README.md)

## Notes

- API URLs are currently hardcoded to `http://localhost:3000` in frontend source files.
- If backend port changes, update frontend API URLs accordingly.
