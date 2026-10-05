import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
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
          <h2 className="font-serif text-2xl text-[#2C2723]">Terms of Service</h2>
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
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Agreement to Terms</h3>
              <p>
                By accessing and using the Cliff Cooks website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Use License</h3>
              <p className="mb-2">Permission is granted to temporarily download one copy of the materials (information or software) on Cliff Cooks website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Product Information</h3>
              <p>
                All handmade ceramic pieces are unique. While we strive to provide accurate descriptions and images, slight variations in color, glaze, and texture are inherent to handmade pottery and are not considered defects. Each piece is one of a kind and final. Availability is limited to stock on hand.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Orders & Payment</h3>
              <p>
                All orders are subject to confirmation by Cliff Cooks. We reserve the right to refuse or cancel any order. Once an order is placed, no payment will be collected until Clifford contacts you to confirm your order details and arrange payment and shipping. Prices and availability are subject to change without notice.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Limitation of Liability</h3>
              <p>
                In no event shall Cliff Cooks be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cliff Cooks website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Modifications</h3>
              <p>
                Cliff Cooks may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2723] mb-2">Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
