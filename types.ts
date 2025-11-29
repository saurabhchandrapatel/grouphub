export interface Group {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  platform: Platform;
  members: number;
  image: string;
  link?: string;
  isJoined?: boolean;
  createdAt?: string;
  rules?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedGroups: string[];
}

export type Platform = 'Discord' | 'Telegram' | 'WhatsApp' | 'Facebook' | 'LinkedIn' | 'Slack' | 'Reddit' | 'Other';

export type Category = 'Technology' | 'Hobbies' | 'Health & Wellness' | 'Education' | 'Sports' | 'Arts & Culture' | 'Local' | 'Business';
