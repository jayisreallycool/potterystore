import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Clock, Check } from 'lucide-react';
import { PotteryProduct } from '../types';
import { getInventoryStatus } from '../utils/inventoryManager';

interface InventoryBadgeProps {
  product: PotteryProduct;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const InventoryBadge: React.FC<InventoryBadgeProps> = ({
  product,
  size = 'md',
  showLabel = true
}) => {
  const status = getInventoryStatus(product);

  if (!status.badge) return null;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-2.5 py-1.5',
    lg: 'text-sm px-3 py-2'
  };

  const getIcon = () => {
    if (status.badge === 'LAST ONE') {
      return <AlertCircle className="w-3.5 h-3.5" />;
    }
    if (status.badge === 'COMING SOON') {
      return <Clock className="w-3.5 h-3.5" />;
    }
    if (status.badge === 'AVAILABLE') {
      return <Check className="w-3.5 h-3.5" />;
    }
    return null;
  };

  const getColors = () => {
    switch (status.badge) {
      case 'LAST ONE':
        return {
          bg: 'bg-[#F0A59A]/15',
          border: 'border-[#C8623A]',
          text: 'text-[#8B3E18]',
          icon: 'text-[#C8623A]'
        };
      case 'COMING SOON':
        return {
          bg: 'bg-[#E2B17B]/15',
          border: 'border-[#C8943D]',
          text: 'text-[#7F6A3F]',
          icon: 'text-[#C8943D]'
        };
      case 'SOLD OUT':
        return {
          bg: 'bg-[#8A7B6D]/15',
          border: 'border-[#5A4E44]',
          text: 'text-[#3F3732]',
          icon: 'text-[#5A4E44]'
        };
      default:
        return {
          bg: 'bg-[#4E7755]/15',
          border: 'border-[#4E7755]',
          text: 'text-[#2C5C2A]',
          icon: 'text-[#4E7755]'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={status.urgent ? { scale: 1.05 } : {}}
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} rounded-full font-mono font-semibold uppercase tracking-wider border transition-all ${colors.bg} ${colors.border} ${colors.text}`}
    >
      <span className={colors.icon}>{getIcon()}</span>
      {showLabel && <span>{status.badge}</span>}
      {status.urgent && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-1.5 h-1.5 rounded-full ${colors.icon}`}
        />
      )}
    </motion.div>
  );
};

/**
 * Sticky "Last One Available" alert for product detail modal
 */
export const LastOneAlert: React.FC<{ product: PotteryProduct }> = ({ product }) => {
  const status = getInventoryStatus(product);

  if (status.badge !== 'LAST ONE') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-[#F0A59A]/20 border border-[#C8623A] flex items-center gap-2 text-sm text-[#8B3E18]"
    >
      <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
      <span className="font-medium">
        This is the last available piece. Reserve yours before it's gone.
      </span>
    </motion.div>
  );
};
