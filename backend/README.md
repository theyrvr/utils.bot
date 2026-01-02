# Backend - Discord Ticket Bot

The backend powers the Discord bot and provides the API for the frontend dashboard.

## Architecture

- **Discord Bot**: Handles all Discord interactions (buttons, commands, etc.)
- **Express API**: RESTful API for the frontend
- **Prisma ORM**: Type-safe database access
- **Winston**: Structured logging
- **Webhooks**: External integration support

## Scripts

```bash
# Development
npm run dev              # Run with hot reload

# Production
npm run build           # Compile TypeScript
npm start               # Run compiled code

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:push     # Push schema to database
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open database GUI
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ticketbot"

# Server
PORT=3001
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Bot Settings
TICKET_CATEGORY_ID=category_id
LOG_CHANNEL_ID=log_channel_id
TRANSCRIPT_CHANNEL_ID=transcript_channel_id

# Environment
NODE_ENV=development
```

## Database Schema

The database includes the following models:

- **GuildConfig**: Server-wide bot configuration
- **Menu**: Ticket menus with customizable buttons
- **MenuButton**: Individual buttons for menus
- **Message**: Customizable bot messages
- **Ticket**: Ticket records with status tracking
- **QuickResponse**: User feedback on helpfulness
- **Rating**: 5-star rating system
- **Log**: Comprehensive action logging
- **Webhook**: External integration webhooks

## API Endpoints

### Configuration
- `GET /api/config/:guildId` - Get guild configuration
- `PUT /api/config/:guildId` - Update guild configuration

### Tickets
- `GET /api/tickets/:guildId` - List all tickets
- `GET /api/tickets/:guildId/:ticketId` - Get specific ticket
- `GET /api/tickets/:guildId/stats` - Get ticket statistics

### Menus
- `GET /api/menus/:guildId` - List all menus
- `POST /api/menus/:guildId` - Create new menu
- `PUT /api/menus/:guildId/:menuId` - Update menu
- `DELETE /api/menus/:guildId/:menuId` - Delete menu

### Messages
- `GET /api/messages/:guildId` - List all messages
- `GET /api/messages/:guildId/:key` - Get specific message
- `PUT /api/messages/:guildId/:key` - Create/update message
- `DELETE /api/messages/:guildId/:key` - Delete message

### Webhooks
- `GET /api/webhooks/:guildId` - List all webhooks
- `POST /api/webhooks/:guildId` - Create webhook
- `PUT /api/webhooks/:guildId/:webhookId` - Update webhook
- `DELETE /api/webhooks/:guildId/:webhookId` - Delete webhook

### Logs
- `GET /api/logs/:guildId?limit=100` - Fetch logs

## Features

### Ticket System
- Automatic channel creation
- Permission management
- Transcript generation (HTML)
- Quick response buttons
- Rating system via DM

### Logging
- Action tracking
- User activity monitoring
- Error logging with Winston
- Database persistence

### Webhooks
- Event-based triggers
- Secret authentication
- Multiple webhook support
- Configurable events

## Development

### Adding New Features

1. Update Prisma schema if needed
2. Generate Prisma client: `npm run prisma:generate`
3. Create/update bot handlers in `src/bot/handlers/`
4. Add API routes in `src/api/routes/`
5. Test thoroughly

### Debugging

- Check logs in `logs/` directory
- Use Prisma Studio to inspect database
- Enable debug mode in Discord.js
- Review Winston logs for errors

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong database credentials
- [ ] Configure proper Discord intents
- [ ] Set up log rotation
- [ ] Enable CORS for frontend domain
- [ ] Use environment variables for secrets
- [ ] Set up database backups
- [ ] Configure reverse proxy (nginx)
- [ ] Enable SSL/TLS

### Docker Support

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Troubleshooting

### Bot not connecting
- Verify `DISCORD_TOKEN` is correct
- Check bot intents are enabled
- Ensure bot is invited to server

### Database errors
- Verify `DATABASE_URL` format
- Run `npm run prisma:generate`
- Check PostgreSQL is running

### API errors
- Check port `3001` is available
- Verify CORS settings
- Review Winston logs

## Performance

- Use connection pooling for database
- Implement rate limiting for API
- Cache frequently accessed data
- Optimize Prisma queries
- Monitor memory usage

## Security

- Never commit `.env` files
- Use webhook secrets
- Validate all inputs
- Sanitize user content
- Implement rate limiting
- Use prepared statements (Prisma handles this)
