# AlumnConnect

A comprehensive alumni directory and networking platform hosted on Vercel, connecting graduates and fostering professional relationships.

## Features

- **Alumni Directory**: Search and connect with fellow alumni by year, location, industry, or interests
- **Events Management**: Discover and register for alumni meetups, reunions, and networking events
- **Job Board**: Share and find career opportunities within the alumni network
- **User Authentication**: Secure login with email verification and optional OAuth providers
- **Dashboard**: Personalized dashboard with relevant statistics and activity feed
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: PostgreSQL 
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alumn-connect.git
   cd alumn-connect
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and update the values with your configuration

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
alumn-connect/
├── app/                # Next.js app directory
├── components/         # React components
│   ├── ui/             # UI components based on shadcn/ui
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared logic
├── public/             # Static assets
├── styles/             # Global styles
```

## Database Setup

The project uses PostgreSQL for data storage. The database schema includes tables for:
- Users and authentication
- Alumni profiles
- Events
- Job opportunities
- Activity feed

You can find the database schema in `db-schema.js`.

## Deployment

This project is designed to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure the environment variables
4. Deploy

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)