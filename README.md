# HealthSync - AI Health Insights

A Next.js health tracking application that syncs your health data with AI-powered insights and personalized recommendations.

## Features

- 🤖 AI-powered health insights and goal adjustments
- 📊 Visual progress tracking with calendar view
- 🎯 Personalized daily targets for calories and steps
- 📱 Responsive design with mobile hamburger menu
- 🔄 Real-time goal updates based on AI recommendations

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: React hooks with localStorage
- **AI Integration**: Custom API routes for health analysis
- **Deployment**: AWS Amplify

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is configured for AWS Amplify deployment with the included `amplify.yml` build configuration.

### Deploy to AWS Amplify:

1. Push code to GitHub/GitLab
2. Connect repository to AWS Amplify
3. Amplify will automatically build and deploy

## Project Structure

- `/src/app/` - Next.js app directory
- `/src/app/components/` - Reusable React components
- `/src/app/hooks/` - Custom React hooks
- `/src/app/api/` - API routes for AI functionality
- `/src/app/dashboard/` - Main dashboard page
- `/src/app/sign-up/` - User onboarding flow

## Key Components

- **Calendar**: Visual tracking with color-coded performance
- **AI Summary**: Personalized insights and goal adjustments
- **Progress Cards**: Real-time goal tracking and statistics
- **Mobile Navigation**: Responsive hamburger menu
- **Data Sync Ready**: Built for MyFitnessPal and Withings integration