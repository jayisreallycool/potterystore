import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface ShippingReturnsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShippingReturns: React.FC<ShippingReturnsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1D1A18]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E3D9CB] overflow-hidden my-8"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3] bg-[#FAF7F2]">
          <h2 className="font-serif text-2xl text-[#2C2723]">Shipping & Returns</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EFEAE1] hover:bg-[#E3D9CB] text-[#2C2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scroll max-h-[calc(100vh-120px)] text-sm text-[#5A4E44]">
          <div className="space-y-6 font-serif leading-relaxed">

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Shipping Information</h3>
              <p className="mb-3">
                After Clifford confirms your order details and payment arrangements, your pieces will be carefully packed and shipped to your address.
              </p>
              <p className="mb-2"><strong>Shipping rates:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Orders under $150: $18 flat rate</li>
                <li>Orders $150+: Free shipping</li>
                <li>International shipping: Contact us for a quote</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Packaging & Protection</h3>
              <p>
                Every piece is double-boxed using recyclable wood straw and shock-absorbing honeycomb pulp to ensure safe arrival. CliffCooks guarantees 100% breakage-free delivery. If a piece arrives damaged, contact us immediately with photos and we will work with you to resolve the issue.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Delivery Timeline</h3>
              <p className="mb-2">
                Delivery times vary based on your location and current shipping volume. Clifford will provide an estimated delivery window when payment is arranged.
              </p>
              <p>
                <strong>Domestic (US):</strong> Typically 5-10 business days after shipment<br />
                <strong>International:</strong> 10-30 business days depending on destination
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Returns & Exchanges</h3>
              <p className="mb-2">
                Because every piece is handmade and one of a kind, exchanges are not available. However, if a piece arrives damaged or with significant defects, we will work with you to find an appropriate solution.
              </p>
              <p>
                <strong>To report damage or defects:</strong> Contact us within 7 days of delivery with photos. Damage claims are handled on a case-by-case basis.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Refunds</h3>
              <p>
                Refunds are handled on a case-by-case basis and depend on the reason for the request. Since each piece is unique and handmade, standard return policies may not apply. Contact us to discuss your specific situation.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Care Instructions</h3>
              <p className="mb-2">
                Each piece comes with specific care instructions. General guidelines include:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hand wash with gentle soap and warm water</li>
                <li>Avoid harsh abrasives or dishwasher (unless indicated)</li>
                <li>Allow air drying to prevent thermal shock</li>
                <li>Keep away from extreme temperature changes</li>
                <li>Natural variations in glaze and surface texture are part of the piece's character</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Questions?</h3>
              <p>
                For shipping tracking, delivery questions, or care information, contact us at:<br />
                <strong>Email:</strong> hello@cliffcooks.studio
              </p>
            </div>

            <div className="text-xs text-[#8A7B6D] pt-4 border-t border-[#DDD1C0]">
              <p>Last updated: October 2026</p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
