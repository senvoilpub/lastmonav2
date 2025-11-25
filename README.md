# lastmona

A modern Next.js application built with the App Router for generating resumes using AI.

## Getting Started

First, install the dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

You can get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `app/api/` - API routes for Gemini AI integration
- `components/` - Reusable React components
- `public/` - Static assets

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Google Gemini AI API

