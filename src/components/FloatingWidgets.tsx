import React from 'react';
import { Language } from '../types';

interface FloatingWidgetsProps {
  language: Language;
  onOpenFeatured?: () => void;
  onOpenEvents?: () => void;
  onOpenSupport?: () => void;
}

// Cleaned up home screen: floating badges (FEATURED GAMES, EVENT, and bottom-left BD LIVE BET.VIP) removed as requested
export const FloatingWidgets: React.FC<FloatingWidgetsProps> = () => {
  return null;
};
