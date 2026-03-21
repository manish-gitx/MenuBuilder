"use client"
import React, { useState } from "react";
import { MenuItem } from "../../lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronLeft, X } from "lucide-react";

interface CartProps {
  cart: MenuItem[];
  menuName: string;
  removeFromCart: (item: MenuItem) => void;
}

const Cart = ({ cart, menuName, removeFromCart }: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`${menuName} — Order Summary`, 14, 15);
    autoTable(doc, {
      head: [["Item", "Description"]],
      body: cart.map(i => [i.name, i.description ?? ""]),
      startY: 25,
    });
    doc.save(`${menuName}_order.pdf`);
  };

  const previewText = cart
    .slice(0, 3)
    .map(i => i.name)
    .join(", ")
    .concat(cart.length > 3 ? ` +${cart.length - 3} more` : "");

  /* ── Full-screen overlay ── */
  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1 text-gray-600 font-semibold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Menu
          </button>
          <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
          <div className="w-20" />
        </header>

        {/* Items list */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-3">
          {cart.map(item => {
            const isVeg =
              item.tags?.some(
                t =>
                  t.type === "dietary" &&
                  t.name.toLowerCase().includes("vegetarian") &&
                  !t.name.toLowerCase().includes("non")
              ) ?? false;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                {/* Dietary dot */}
                <div
                  className="w-[14px] h-[14px] rounded-sm border-2 flex-shrink-0 flex items-center justify-center"
                  style={{ borderColor: isVeg ? "#0f8a65" : "#d63b2f" }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full"
                    style={{ backgroundColor: isVeg ? "#0f8a65" : "#d63b2f" }}
                  />
                </div>

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(item)}
                  className="text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </main>

        {/* Footer */}
        <footer className="px-4 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{cart.length} {cart.length === 1 ? "item" : "items"} selected</span>
          </div>
          <button
            onClick={generatePdf}
            className="w-full bg-[#1ba672] text-white font-bold text-sm py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-transform"
          >
            Confirm & Download PDF
          </button>
        </footer>
      </div>
    );
  }

  /* ── Sticky bottom bar ── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1ba672] shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Left: count + preview */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center">
            <span className="text-[#1ba672] text-xs font-bold leading-none">
              {cart.length}
            </span>
          </div>
          <p className="text-white text-xs font-medium truncate">{previewText}</p>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-xs font-semibold underline underline-offset-2"
          >
            Review Order
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white text-[#1ba672] text-xs font-bold px-4 py-2 rounded-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
