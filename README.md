Eunoia

Eunoia is an AI-powered makeup assistant that helps users discover makeup products suited to their skin tone, undertone, preferences, budget, and preferred brands.

Features
User authentication with Supabase
Facial skin analysis
Skin tone and undertone detection
Personalized makeup recommendations
Budget-based product filtering
Preferred brand selection
Personalized makeup kit
Saved products stored in Supabase
User-specific data protection with Row Level Security
Responsive web interface
Cross foundation matcher

How It Works
Create an account or log in.
Scan your face using the skin analysis feature.
Eunoia analyzes your skin tone and undertone.
Select your preferences:
Skin type
Preferred look
Budget
Preferred brands
Receive personalized makeup recommendations.
Add products to your makeup kit.
Your preferences, analysis, and saved products are securely stored in your account.
Aside from that, you can match shades between concealers and foundations from different brands

Tech Stack

Frontend
React
Vite
Tailwind CSS
React Router
Lucide React

AI and Skin Analysis
MediaPipe Face Landmarker
JavaScript-based skin analysis
Custom skin tone and undertone detection
Custom product matching and recommendation logic

Backend
Supabase
Supabase Authentication
PostgreSQL
Row Level Security (RLS)

Deployment
Vercel

Project Structure
src/
├── analysis/
├── components/
├── data/
├── lib/
├── pages/
├── services/
├── matcher.js
├── recommend.js
└── main.jsx

public/
└── eunoia-logo.png

Running Locally
Clone the repository:
git clone <repository-url>

Move into the project directory:
cd glowmatch-app

Install the dependencies:
npm install

Create a .env.local file in the project root:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Start the development server:
npm run dev

To create a production build:
npm run build

To preview the production build locally:
npm run preview

Database

Eunoia uses Supabase for authentication and data storage.

The main database tables are:

profiles
preferences
skin_analyses
saved_products

Row Level Security ensures that users can only access their own personal data.

Environment Variables

The following environment variables are required:
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY

For local development, these values should be stored in .env.local.

For production, they should be configured through the deployment platform.

Do not commit .env.local or expose environment secrets in the repository.

Deployment

Eunoia is deployed using Vercel.

Production URL:

https://eunoia-makeup-assistant.vercel.app

The production environment requires:
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY

Team

Eunoia was developed as a collaborative project combining:

Frontend development
AI-based skin analysis
Product recommendation logic
Backend and database integration
Authentication and user data management

License
This project was created for educational and hackathon purposes.