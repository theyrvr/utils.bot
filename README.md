# Utils.Bot - Complete Discord Ticket Bot

A professional, production-ready Discord ticket bot with a modern web dashboard. Built with Discord.js, Prisma v7, Express, and Next.js.

## 🌟 Features

### Backend Features
- ✅ **Complete Ticket System** - Full ticket lifecycle management
- ✅ **Prisma v7 Database** - PostgreSQL with type-safe ORM
- ✅ **Configurable Menus** - Create custom ticket menus with buttons
- ✅ **Ephemeral Messages** - Support for private messages
- ✅ **Quick Responses** - Helpful/Not Helpful feedback system
- ✅ **5-Star Rating System** - Sent via DM after ticket closure
- ✅ **Webhook Integration** - Create webhooks for external integrations
- ✅ **Comprehensive Logging** - Track all bot actions
- ✅ **Automatic Transcripts** - HTML transcripts of ticket conversations
- ✅ **RESTful API** - Full API for frontend integration

### Frontend Features
- ✅ **Modern Dashboard** - Next.js 15 with React 19
- ✅ **Configuration Panel** - Easy bot configuration
- ✅ **Message Editor** - Configure all bot messages with live preview
- ✅ **Menu Manager** - Visual menu and button creation
- ✅ **Webhook Manager** - Configure webhook integrations
- ✅ **Ticket Viewer** - Monitor all tickets
- ✅ **Logs Viewer** - Real-time log monitoring
- ✅ **Statistics Dashboard** - View key metrics

## 📁 Project Structure

```
utils.bot/
├── backend/               # Discord bot and API server
│   ├── prisma/           # Database schema and migrations
│   ├── src/
│   │   ├── api/          # Express API routes
│   │   ├── bot/          # Discord bot logic
│   │   ├── utils/        # Utilities (logger, webhooks, etc.)
│   │   └── index.ts      # Main entry point
│   ├── logs/             # Log files
│   └── transcripts/      # Ticket transcripts
│
└── frontend/             # Next.js dashboard
    ├── src/
    │   ├── app/          # Next.js pages
    │   ├── components/   # React components
    │   ├── lib/          # API client
    │   ├── types/        # TypeScript types
    │   └── styles/       # Global styles
    └── public/           # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Discord Bot Token
- Discord Application with proper intents

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=your_guild_id_here
   DATABASE_URL="postgresql://user:password@localhost:5432/ticketbot?schema=public"
   PORT=3001
   ```

4. **Set up the database:**
   ```bash
   npm run prisma:push
   npm run prisma:generate
   ```

5. **Start the backend (development):**
   ```bash
   npm run dev
   ```

   **Or for production:**
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_GUILD_ID=your_guild_id_here
   ```

4. **Start the frontend (development):**
   ```bash
   npm run dev
   ```

   **Or for production:**
   ```bash
   npm run build
   npm start
   ```

5. **Access the dashboard:**
   Open http://localhost:3000 in your browser

## 🔧 Configuration

### Discord Bot Setup

1. **Create a Discord Application** at https://discord.com/developers/applications

2. **Enable required intents:**
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

3. **Invite the bot** to your server with these permissions:
   - Manage Channels
   - Read Messages/View Channels
   - Send Messages
   - Manage Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Manage Roles

### Database Migrations

Run migrations when updating the schema:
```bash
cd backend
npm run prisma:migrate
```

View your database:
```bash
npm run prisma:studio
```

## 📖 Usage

### Creating a Ticket Menu

1. Go to the **Menus** page in the dashboard
2. Click "Create Menu"
3. Add buttons for different ticket categories
4. Save and deploy to your Discord channel

### Configuring Messages

1. Navigate to the **Messages** page
2. Select a message type
3. Customize content, embeds, and colors
4. Preview changes in real-time
5. Save your configuration

### Setting Up Webhooks

1. Visit the **Webhooks** page
2. Click "Create Webhook"
3. Configure webhook URL and events
4. Optionally add a secret for authentication
5. Enable and save

### Monitoring

- **Dashboard**: View statistics and metrics
- **Tickets**: Monitor all ticket activity
- **Logs**: Track all bot actions in real-time

## 🏗️ Technology Stack

### Backend
- **Discord.js v14** - Discord bot framework
- **Express** - API server
- **Prisma v5** - Database ORM (compatible with v7 schema)
- **PostgreSQL** - Database
- **Winston** - Logging
- **TypeScript** - Type safety

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Axios** - API client
- **React Icons** - Icon library

## 🔒 Security Features

- Environment-based configuration
- Webhook secret authentication
- Role-based ticket access
- Ephemeral messages for privacy
- Comprehensive logging

## 📝 API Documentation

The backend provides a RESTful API at `http://localhost:3001/api/`:

- `GET/PUT /config/:guildId` - Guild configuration
- `GET /tickets/:guildId` - List tickets
- `GET /tickets/:guildId/stats` - Ticket statistics
- `GET/POST/PUT/DELETE /menus/:guildId` - Menu management
- `GET/PUT/DELETE /messages/:guildId/:key` - Message management
- `GET/POST/PUT/DELETE /webhooks/:guildId` - Webhook management
- `GET /logs/:guildId` - Fetch logs

## 🤝 Contributing

This is a complete, production-ready system. Feel free to customize it for your needs.

## 📄 License

MIT License - feel free to use this in your projects.

## 🆘 Support

For issues or questions:
1. Check the logs in `backend/logs/`
2. Review the database with Prisma Studio
3. Ensure all environment variables are set correctly
4. Verify Discord bot permissions and intents

## 🎯 Roadmap

Future enhancements:
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Ticket templates
- [ ] Auto-responses
- [ ] SLA tracking
- [ ] Export/import configurations

---

Made with ❤️ for the Discord community