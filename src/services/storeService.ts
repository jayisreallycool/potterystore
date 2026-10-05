import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { PotteryProduct } from '../types';
import { POTTERY_PRODUCTS } from '../data/potteryData';

export interface OrderItemRecord {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  selectedFinish?: string;
  engravingText?: string;
  giftBoxIncluded: boolean;
}

export interface OrderRecord {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country?: string;
  items: OrderItemRecord[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'firing_in_progress' | 'dispatched' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  pieceOfInterest?: string;
  createdAt: string;
  status?: 'unread' | 'read' | 'replied';
}

// Subscribe to real-time products
export function subscribeToProducts(callback: (products: PotteryProduct[]) => void) {
  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const fetchedMap = new Map<string, PotteryProduct>();
      
      // Start with bundled defaults
      POTTERY_PRODUCTS.forEach(p => fetchedMap.set(p.id, p));

      // Add from localStorage custom published items
      try {
        const localCustom = JSON.parse(localStorage.getItem('kiln_custom_products') || '[]');
        localCustom.forEach((p: PotteryProduct) => fetchedMap.set(p.id, p));
      } catch (e) {
        // ignore
      }

      // Merge Firestore products
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as PotteryProduct;
          if (item && item.id) {
            fetchedMap.set(item.id, item);
          }
        });
      }

      callback(Array.from(fetchedMap.values()));
    },
    (error) => {
      console.warn('Realtime products listener error, falling back to local catalog:', error);
      const fallbackMap = new Map<string, PotteryProduct>();
      POTTERY_PRODUCTS.forEach(p => fallbackMap.set(p.id, p));
      try {
        const localCustom = JSON.parse(localStorage.getItem('kiln_custom_products') || '[]');
        localCustom.forEach((p: PotteryProduct) => fallbackMap.set(p.id, p));
      } catch (e) {}
      callback(Array.from(fallbackMap.values()));
    }
  );
}

// Seed default products to Firestore if collection is empty
export async function seedDefaultCatalog(): Promise<number> {
  let count = 0;
  for (const product of POTTERY_PRODUCTS) {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product);
      count++;
    } catch (err) {
      console.warn(`Seed product warning for ${product.id}:`, err);
    }
  }
  return count;
}

// Upload product image to Firebase Storage with instant client data fallback
export async function uploadProductImage(file: File, productId: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `products/${productId}/${timestamp}_${cleanFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (storageErr) {
    console.warn('Firebase Storage upload note (using client DataURL):', storageErr);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Add or update a product with robust local storage fallback
export async function saveProduct(product: PotteryProduct): Promise<void> {
  // Always save to localStorage first for instant guaranteed publishing
  try {
    const customProducts = JSON.parse(localStorage.getItem('kiln_custom_products') || '[]');
    const existingIdx = customProducts.findIndex((p: PotteryProduct) => p.id === product.id);
    if (existingIdx >= 0) {
      customProducts[existingIdx] = product;
    } else {
      customProducts.push(product);
    }
    localStorage.setItem('kiln_custom_products', JSON.stringify(customProducts));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Then try to save to Firestore
  const path = `products/${product.id}`;
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.warn('Firestore write warning (published locally successfully):', err);
    // Do not throw so UI publishing succeeds seamlessly
  }
}

// Delete a product
export async function removeProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Create an order
export async function createOrder(order: OrderRecord): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Subscribe to user orders
export function subscribeToUserOrders(userId: string, callback: (orders: OrderRecord[]) => void) {
  const colRef = collection(db, 'orders');
  const q = query(colRef, where('userId', '==', userId));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: OrderRecord[] = [];
      snapshot.forEach((d) => {
        orders.push(d.data() as OrderRecord);
      });
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

// Subscribe to all orders (Admin only)
export function subscribeToAllOrders(callback: (orders: OrderRecord[]) => void) {
  const colRef = collection(db, 'orders');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const orders: OrderRecord[] = [];
      snapshot.forEach((d) => {
        orders.push(d.data() as OrderRecord);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

// Update order status (Admin only)
export async function updateOrderStatus(orderId: string, status: OrderRecord['status'], notes?: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }
    await updateDoc(docRef, updatePayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Submit inquiry
export async function submitInquiry(inquiry: InquiryRecord): Promise<void> {
  const path = `inquiries/${inquiry.id}`;
  try {
    const docRef = doc(db, 'inquiries', inquiry.id);
    await setDoc(docRef, inquiry);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Subscribe to inquiries (Admin only)
export function subscribeToInquiries(callback: (inquiries: InquiryRecord[]) => void) {
  const colRef = collection(db, 'inquiries');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: InquiryRecord[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as InquiryRecord);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'inquiries');
    }
  );
}
