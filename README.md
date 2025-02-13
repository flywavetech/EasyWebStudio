# Website Builder Platform

A simple yet powerful website builder platform that allows users to create and manage their business websites with ease. Built with React, Express, and modern web technologies.

## Features

- 🚀 Single-click website creation
- 🌐 Automatic site hosting under custom subdomain
- 🔒 Secure edit link generation
- 📊 Admin dashboard for site management
- 🎨 Simple template-based design system
- 💳 Gift card interest tracking

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Passport.js with session-based auth

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn package manager

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd website-builder
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```env
SESSION_SECRET=your-session-secret
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Page components
├── server/                # Backend Express application
│   ├── auth.ts           # Authentication setup
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage interface
└── shared/               # Shared types and schemas
    └── schema.ts         # Zod schemas and TypeScript types
```

## Deployment to Netlify

### Frontend Deployment

1. Build the frontend
```bash
npm run build
```

2. In your Netlify dashboard:
   - Create a new site
   - Connect to your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist/public`
   - Add environment variables from your `.env` file

3. Configure redirects by creating a `netlify.toml` in the root:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend Deployment

1. Create a new server (e.g., on Railway, Heroku, or your preferred platform)
2. Set environment variables
3. Update the frontend API URL to point to your deployed backend

## API Documentation

### Public Endpoints

- `POST /api/sites` - Create a new site
- `GET /api/sites/:slug` - Get site by slug
- `PATCH /api/sites/edit/:token` - Update site using edit token

### Admin Endpoints

- `GET /api/sites` - List all sites (requires authentication)
- `POST /api/register` - Register admin user
- `POST /api/login` - Login admin user
- `POST /api/logout` - Logout admin user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
