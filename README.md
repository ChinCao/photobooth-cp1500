# Photo Booth Application

A modern photo booth application built with Next.js and Socket.IO, featuring real-time photo capture, custom frames, and image filters.

## Features

- 📸 Real-time photo capture with webcam support
- 🖼️ Multiple theme options (PROM, Usagyuuun)
- ✨ 30+ Instagram-style filters
- 🎞️ Custom frame layouts (single and double formats)
- 🔄 Real-time preview and editing
- 🌐 Socket.IO integration for real-time communication
- ☁️ AWS S3 integration for image storage
- 🎨 Tailwind CSS with custom UI components

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun
- PostgreSQL database (for image metadata)

## Environment Setup

1. Copy the example environment file:

```bash
cp copy.env .env
```

2. Configure the following environment variables:

```
ACCOUNT_ID=your_account_id
ACCESS_KEY_ID=your_access_key
SECRET_ACCESS_KEY=your_secret_key
DATABASE_URL=your_database_url
```

## Installation

1. Install client dependencies:

```bash
cd client
npm install
```

2. Install server dependencies:

```bash
cd server
npm install
```

## Development

1. Start the client development server:

```bash
cd client
npm run dev
```

The client will be available at `http://localhost:8080`

2. Start the server:

```bash
cd server
npm run dev
```

The Socket.IO server will run on port 6969

## Database Management

Generate database migrations:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Launch Drizzle Studio:

```bash
npm run db:studio
```

## Project Structure

- `/client` - Next.js frontend application
- `/server` - Socket.IO backend print server
- `/public` - Static assets including frames and images
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and shared logic
- `/src/constants` - Application constants and configurations

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [AWS S3](https://aws.amazon.com/s3/) - Image storage
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed by [@ChinCao](https://github.com/ChinCao) and sponsored by VECTR.
- All rights reserved to [@ChinCao](https://github.com/ChinCao).
