# Photo Booth Application 📸

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
- Canon SELPHY CP1500 printer ([Product Link](https://www.amazon.com/Canon-SELPHY-CP1500-Compact-Printer/dp/B0BF6T86WD))
- Canon SELPHY CP1500 ink & paper ([Product Link](https://www.amazon.com/KP-108IN-Cassette-Wireless-Compact-Printer/dp/B079B5LTGW))

## Printer Setup

The application is designed to work with the Canon SELPHY CP1500 photo printer. This compact printer offers:

- High-quality 300x300 DPI photo printing
- Support for postcard size (148x100mm)
- Borderless printing capability
- Direct wireless printing
- Dye-sublimation printing technology

The printer must be:

1. Connected to the computer via USBC cable
2. Only can be installed as a Windows printer, not macOS or Linux
3. Named containing "CP1500" in its printer name for auto-detection
4. Make sure Window's spooler service is properly configured and running

## Environment Setup

1. Copy the example environment file:

```bash
cp copy.env .env
```

2. Configure the following environment variables:

```
ACCOUNT_ID=cloudfare_account_id
ACCESS_KEY_ID=r2_access_key
SECRET_ACCESS_KEY=r2_secret_key
DATABASE_URL=neon_database_url
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

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2024 [@ChinCao](https://github.com/ChinCao). All rights reserved.

## Acknowledgments

- Developed by [@ChinCao](https://github.com/ChinCao) and sponsored by VECTR.
- All rights reserved to [@ChinCao](https://github.com/ChinCao).
