# Pradeep UX Portfolio

Modern, responsive UX designer portfolio and case studies website.

## Project Structure

```
pradeep-framer-reference/
├── assets/
│   └── images/                 # Optimized avatars, case study covers, and UI mockups
├── css/
│   └── style.css               # Design system, light/dark theme variables, typography, and layout styles
├── js/
│   └── main.js                 # Theme toggler, mobile menu, and interactive canvas components
├── index.html                  # Home UX portfolio landing page
├── projects.html               # Selected works and project showcase
├── about.html                  # Profile, design philosophy, and background
├── resume.html                 # Experience, education, skills, and print-ready resume
├── lomo-track.html             # Case study: LOMO Track IoT logistics app
├── collaborative-learning.html # Case study: Peer-to-peer collaborative learning app
├── fitness-tracker.html        # Case study: Fitness & habit tracker mobile app
└── social-dining.html          # Case study: Social dining discovery platform
```

## Running the Website Locally

You can open `index.html` directly in any web browser, or serve it using any local static server:

```bash
# Using Python
python -m http.server 8000

# Using Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port specified).
