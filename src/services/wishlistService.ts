// Wishlist Service
// Handles wishlist operations and sharing (Feature 10)

import { v4 as uuidv4 } from 'uuid';
import { Wishlist, WishlistItem } from '../types';

const WISHLIST_KEY = 'userWishlist';
const WISHLIST_STORAGE_KEY = 'wishlistsStorage';

export const wishlistService = {
  /**
   * Get or create user's wishlist
   */
  getUserWishlist(): Wishlist {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Create new wishlist
    const newWishlist: Wishlist = {
      id: 'wishlist-' + Date.now(),
      userId: 'user-' + Date.now(),
      items: [],
      uuid: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
    return newWishlist;
  },

  /**
   * Add item to wishlist
   */
  addItem(productId: string): boolean {
    try {
      const wishlist = this.getUserWishlist();

      // Check if already in wishlist
      if (wishlist.items.some(item => item.productId === productId)) {
        return true;
      }

      wishlist.items.push({
        productId,
        addedAt: Date.now()
      });
      wishlist.updatedAt = Date.now();

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  /**
   * Remove item from wishlist
   */
  removeItem(productId: string): boolean {
    try {
      const wishlist = this.getUserWishlist();
      wishlist.items = wishlist.items.filter(item => item.productId !== productId);
      wishlist.updatedAt = Date.now();

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  /**
   * Check if item is in wishlist
   */
  isInWishlist(productId: string): boolean {
    try {
      const wishlist = this.getUserWishlist();
      return wishlist.items.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  /**
   * Get wishlist by UUID (for sharing)
   */
  getWishlistByUuid(uuid: string): Wishlist | null {
    try {
      const storage = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '{}');
      return storage[uuid] || null;
    } catch (error) {
      console.error('Error retrieving shared wishlist:', error);
      return null;
    }
  },

  /**
   * Get shareable UUID for current wishlist
   */
  getShareableUuid(): string {
    const wishlist = this.getUserWishlist();

    if (!wishlist.uuid) {
      wishlist.uuid = uuidv4();
      wishlist.updatedAt = Date.now();
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }

    // Also store in shared storage for viewing
    try {
      const storage = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '{}');
      storage[wishlist.uuid!] = {
        ...wishlist,
        userId: undefined // Don't expose user ID in shared version
      };
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error storing shared wishlist:', error);
    }

    return wishlist.uuid;
  },

  /**
   * Get all items in wishlist
   */
  getWishlistItems(): WishlistItem[] {
    const wishlist = this.getUserWishlist();
    return wishlist.items;
  },

  /**
   * Get wishlist size
   */
  getWishlistSize(): number {
    return this.getWishlistItems().length;
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist(): boolean {
    try {
      localStorage.removeItem(WISHLIST_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  }
};
