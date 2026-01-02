# Frontend - Ticket Bot Dashboard

A modern, responsive dashboard built with Next.js 15 and React 19 for managing your Discord ticket bot.

## Features

- 📊 **Dashboard**: Real-time statistics and metrics
- ⚙️ **Configuration**: Easy bot settings management
- 💬 **Message Editor**: Customize bot messages with live preview
- 📋 **Menu Manager**: Visual menu and button creation
- 🔗 **Webhook Manager**: Configure external integrations
- 🎫 **Ticket Viewer**: Monitor all ticket activity
- 📝 **Logs Viewer**: Real-time action monitoring

## Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start               # Run production server

# Linting
npm run lint            # Run ESLint
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GUILD_ID=your_discord_guild_id
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with navigation
│   ├── page.tsx        # Dashboard home
│   ├── config/         # Configuration page
│   ├── messages/       # Message editor page
│   ├── menus/          # Menu manager page
│   ├── webhooks/       # Webhook manager page
│   ├── tickets/        # Ticket viewer page
│   └── logs/           # Logs viewer page
│
├── components/          # React components
│   ├── Navigation.tsx
│   ├── DashboardStats.tsx
│   ├── ConfigForm.tsx
│   ├── MessageEditor.tsx
│   ├── MenuManager.tsx
│   └── WebhookManager.tsx
│
├── lib/                # Utilities
│   └── api.ts          # API client
│
├── types/              # TypeScript types
│   └── index.ts
│
└── styles/             # Global styles
    └── globals.css
```

## Pages

### Dashboard (`/`)
- Ticket statistics
- Quick overview
- Getting started guide

### Configuration (`/config`)
- Guild settings
- Channel IDs
- Feature toggles
- Support role configuration

### Messages (`/messages`)
- Message type selector
- Content editor
- Embed configuration
- Live preview
- Color picker

### Menus (`/menus`)
- Create/edit menus
- Button management
- Style selection
- Category assignment

### Webhooks (`/webhooks`)
- Create webhooks
- Configure events
- Secret management
- Enable/disable webhooks

### Tickets (`/tickets`)
- Filter by status
- View ticket details
- Monitor ratings
- Track activity

### Logs (`/logs`)
- Action history
- User activity
- Configurable limit
- Timestamp sorting

## Components

### DashboardStats
Displays key metrics:
- Total tickets
- Open tickets
- Closed tickets
- Average rating

### ConfigForm
Guild configuration form with:
- Channel ID inputs
- Feature toggles
- Save functionality

### MessageEditor
Message customization with:
- Content editor
- Embed builder
- Live preview
- Color picker

### MenuManager
Visual menu builder:
- Menu creation
- Button management
- Style selection
- Order configuration

### WebhookManager
Webhook configuration:
- URL management
- Event selection
- Secret authentication
- Enable/disable

## Styling

The dashboard uses a custom CSS design system with:

- Dark theme optimized for Discord users
- Responsive grid layouts
- Custom components (buttons, inputs, cards)
- Consistent color scheme
- Smooth transitions

### CSS Variables

```css
--primary-color: #5865f2;
--secondary-color: #4752c4;
--success-color: #3ba55d;
--danger-color: #ed4245;
--warning-color: #faa81a;
--background-primary: #0f0f0f;
--background-secondary: #1a1a1a;
--background-tertiary: #2a2a2a;
--text-primary: #e0e0e0;
--text-secondary: #b0b0b0;
--border-color: #3a3a3a;
```

## API Integration

The frontend uses Axios for API calls through `src/lib/api.ts`:

```typescript
import { configAPI, ticketsAPI, menusAPI, messagesAPI, webhooksAPI, logsAPI } from '@/lib/api';

// Example usage
const config = await configAPI.get(guildId);
const tickets = await ticketsAPI.getAll(guildId);
```

## Development

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file
3. Import necessary components
4. Add navigation link in `Navigation.tsx`

### Creating Components

1. Create component in `src/components/`
2. Use TypeScript for type safety
3. Import types from `@/types`
4. Use API client from `@/lib/api`

### Styling

- Use global classes from `globals.css`
- Follow existing component patterns
- Use CSS-in-JS for component-specific styles
- Maintain consistent spacing and colors

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GUILD_ID=your_guild_id
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Optimization

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization
- Static page generation where possible
- API response caching

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Review CORS settings

### Build Errors
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check for TypeScript errors

### Styling Issues
- Clear browser cache
- Check CSS variable values
- Verify import paths

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Real-time updates with WebSockets
- [ ] Mobile app
- [ ] Multi-language support
