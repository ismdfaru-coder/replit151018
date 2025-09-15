# Next.js Firebase AI Travel App

## Project Overview
This is a Next.js application for AI-powered travel planning and flight booking. The app uses Firebase for authentication and HuggingFace DeepSeek model for intelligent travel recommendations.

## Architecture
- **Frontend**: Next.js 15 with React 18, Tailwind CSS, Radix UI components
- **AI/Backend**: HuggingFace DeepSeek model for AI flows (flight search parsing, itinerary generation, booking assistance)
- **Authentication**: Firebase Auth
- **State Management**: React Context for auth state
- **UI**: Radix UI components with Tailwind styling

## Current Status
- ✅ Dependencies installed
- ✅ Next.js configured for Replit environment (CORS, host settings)
- ✅ Workflow configured on port 5000
- ✅ Environment variables template created
- ✅ Deployment configuration set up
- ✅ AI integration migrated from Google Gemini to HuggingFace DeepSeek
- ✅ HuggingFace API token configured securely

## Known Issues & Next Steps
1. **Environment Variables**: User needs to configure Firebase API keys (HuggingFace is already configured)
2. **Hydration Warnings**: Minor SSR hydration mismatches that don't break functionality
3. **CORS Warnings**: Next.js dev server warnings that don't affect production

## User Configuration Required
The HuggingFace AI is already configured. To make this app fully functional, configure these Firebase environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Recent Changes (Sept 15, 2025)
- **AI Migration**: Replaced Google Gemini/Genkit with HuggingFace DeepSeek model
- **Security**: Properly configured HuggingFace API token via Replit secrets (not hardcoded)
- **API Integration**: Created custom HuggingFace API client with error handling
- **Flow Updates**: Updated all AI flows (flight booking, itinerary generation, query parsing)
- **Code Cleanup**: Removed unused Genkit dependencies and configuration

## Features
- AI-powered flight search and booking assistant using HuggingFace DeepSeek
- Travel itinerary generation
- Firebase authentication (login/signup)
- Modern responsive UI with dark theme
- Flight filters and search functionality