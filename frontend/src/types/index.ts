export interface GuildConfig {
  id: string;
  guildId: string;
  ticketCategoryId?: string;
  logChannelId?: string;
  transcriptChannelId?: string;
  supportRoleId?: string;
  enableQuickResponses: boolean;
  enableRating: boolean;
  enableTranscripts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  guildId: string;
  name: string;
  description?: string;
  channelId?: string;
  messageId?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  buttons: MenuButton[];
}

export interface MenuButton {
  id: string;
  menuId: string;
  label: string;
  emoji?: string;
  style: 'Primary' | 'Secondary' | 'Success' | 'Danger';
  categoryId?: string;
  order: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  guildId: string;
  key: string;
  content: string;
  ephemeral: boolean;
  embedTitle?: string;
  embedDesc?: string;
  embedColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  guildId: string;
  channelId: string;
  userId: string;
  assignedUserId?: string;
  categoryName?: string;
  status: 'OPEN' | 'CLOSED' | 'ARCHIVED';
  closedAt?: Date;
  closedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  responses?: QuickResponse[];
  rating?: Rating;
  logs?: Log[];
}

export interface QuickResponse {
  id: string;
  ticketId: string;
  userId: string;
  wasHelpful: boolean;
  createdAt: Date;
}

export interface Rating {
  id: string;
  ticketId: string;
  userId: string;
  stars: number;
  feedback?: string;
  createdAt: Date;
}

export interface Log {
  id: string;
  guildId: string;
  ticketId?: string;
  userId?: string;
  action: string;
  details?: string;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  guildId: string;
  name: string;
  url: string;
  secret?: string;
  events: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketStats {
  total: number;
  open: number;
  closed: number;
  averageRating: number;
}
