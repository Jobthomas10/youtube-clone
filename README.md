# YouTube Clone (React.js & Material UI)

A modern, responsive, production-ready YouTube Clone built using React.js (Vite), Material UI (MUI v5), and React Router DOM. It integrates dynamically with either the official Google YouTube Data API v3 or the RapidAPI YouTube v3 API, utilizing a resilient Mock Data Fallback system.

---

## 🚀 Key Features

*   **Responsive UI**: Tailored for Mobile, Tablet, and Desktop screens. Supports a flat sidebar on large displays and an overlay Drawer menu on mobile screens.
*   **Dual-API Service Layer**: Transparently switches between the official Google YouTube API and RapidAPI.
*   **Zero-Config Demo Mode**: Starts in mock mode if no API key is specified—guaranteeing immediate display and trial.
*   **Light/Dark Mode Toggle**: Toggle between Light Mode and a custom dark mode matching YouTube's official branding.
*   **Watch History Drawer**: Automatically logs recently watched videos inside `localStorage`, complete with click-to-play links and a clear history function.
*   **Favorite Videos**: Add/Remove videos from favorites with instant `localStorage` persistence, viewable in a side drawer.
*   **Infinite Scrolling**: Detects scroll thresholds at the bottom of the feed and search results to fetch and append the next page of videos.
*   **Skeleton Loaders**: Custom shimmering skeletons that mimic cards for a premium visual transition.

---

## 🛠️ Tech Stack

*   **Framework**: [React.js](https://react.dev/) (via Vite)
*   **Styling & UI**: [Material UI (MUI v5)](https://mui.com/)
*   **Routing**: [React Router DOM v6](https://reactrouter.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Icons**: [MUI Icons Material](https://mui.com/material-ui/material-icons/)

---

## 📂 Project Architecture

```
youtube-clone/
 ├── public/                # Static assets
 ├── src/
 │    ├── components/
 │    │    ├── Navbar.jsx        # Top sticky navigation, toggles drawers
 │    │    ├── Sidebar.jsx       # Category navigation list
 │    │    ├── VideoCard.jsx     # Individual video card with hover effects
 │    │    ├── Videos.jsx        # Grid component with skeleton & scroll triggers
 │    │    ├── Loader.jsx        # Centered red circular progress loader
 │    │    └── SearchBar.jsx     # Rounded input search form
 │    ├── pages/
 │    │    ├── Feed.jsx          # Category feed page
 │    │    ├── VideoDetail.jsx   # Media player page with related column
 │    │    └── SearchFeed.jsx    # Search queries page
 │    ├── services/
 │    │    └── youtubeApi.js     # API layers and fallback mock database
 │    ├── App.jsx                # Theme provider, routing, and history/favorite state
 │    ├── main.jsx               # App mounting point
 │    ├── theme.js               # Dark & Light MUI themes
 │    └── index.css              # Global styles (resets & custom scrollbars)
 ├── .env.example            # Environment variables template
 ├── .gitignore             # Git ignored files (.env excluded)
 ├── package.json           # Scripts and dependencies configuration
 └── vite.config.js         # Vite configuration settings
```

---

## ⚙️ Installation & Setup

Follow these steps to run the application locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) installed.

### 2. Clone and Install Dependencies
Navigate to the project directory and install packages:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your API key:
```env
# To use RapidAPI YouTube v3 API (Default):
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_API_BASE_URL=https://youtube-v31.p.rapidapi.com
VITE_YOUTUBE_API_TYPE=rapidapi
VITE_YOUTUBE_API_HOST=youtube-v31.p.rapidapi.com

# Alternatively, to use official Google YouTube Data API v3:
# VITE_YOUTUBE_API_KEY=your_google_cloud_api_key_here
# VITE_YOUTUBE_API_BASE_URL=https://www.googleapis.com/youtube/v3
# VITE_YOUTUBE_API_TYPE=google
```

*Note: If you leave `VITE_YOUTUBE_API_KEY` blank or set to `your_api_key_here`, the application will seamlessly fall back to the built-in Mock Data system.*

### 4. Start Development Server
Run the local dev server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
To bundle the files for deployment:
```bash
npm run build
```

---

## 🌐 Deployment to Vercel

The application is pre-configured for instant deployment on [Vercel](https://vercel.com/):
1. Import your project repository into Vercel.
2. In the project configuration, add your Environment Variables matching the `.env` settings (`VITE_YOUTUBE_API_KEY`, etc.).
3. Vercel will automatically run the build command (`npm run build`) and deploy your production-ready YouTube Clone!
