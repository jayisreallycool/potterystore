import React, { useEffect, useState } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderRecord, subscribeToUserOrders } from '../services/storeService';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerOrdersModal({ isOpen, onClose }: CustomerOrdersModalProps) {
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToUserOrders(user.uid, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsub();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#2C2723] rounded-3xl border border-[#E3D9CB] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD3] bg-[#F4EFE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D97746]/15 flex items-center justify-center text-[#D97746]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2C2723]">
                Your orders
              </h3>
              <p className="text-xs text-[#736558]">
                CliffCooks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scroll">
          {!user ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EFEAE1] flex items-center justify-center mx-auto text-[#736558]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2C2723]">Sign in to see your orders</h4>
                <p className="text-xs text-[#736558] max-w-sm mx-auto mt-1">
                  See the pieces you've ordered and where each order is up to.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  openAuthModal('signin');
                }}
                className="px-6 py-2.5 rounded-full bg-[#D97746] text-white text-xs font-semibold hover:bg-[#C06536] transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-xs text-[#736558]">
              <div className="w-6 h-6 border-2 border-[#D97746] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading your orders…</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="font-serif text-base text-[#2C2723]">No orders yet</p>
              <p className="text-xs text-[#736558]">
                Pieces you order will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white border border-[#E3D9CB] shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE5DA] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#D97746]">{order.id}</span>
                        <span className="text-[10px] font-mono text-[#8C7D70]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#2C2723] mt-0.5">
                        Delivering to {order.shippingAddress}, {order.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'firing_in_progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-[#F2EDE4] text-[#5A4E44]'
                      }`}>
                        {order.status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {order.status === 'dispatched' && <Truck className="w-3.5 h-3.5" />}
                        {order.status === 'firing_in_progress' && <Flame className="w-3.5 h-3.5" />}
                        {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-[#5A4E44]">
                        <span>{it.quantity}× {it.productName}</span>
                        <span className="font-mono font-medium text-[#2C2723]">
                          ${it.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#ECE5DA] flex items-center justify-between text-xs font-semibold text-[#2C2723]">
                    <span>Order total (including shipping)</span>
                    <span className="font-serif text-sm">${order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
