"use client"
import React, { useState } from 'react';
import { MenuItem } from '../../lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface CartProps {
  cart: MenuItem[];
  menuName: string;
}

const Cart = ({ cart, menuName }: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`${menuName} - Order Summary`, 14, 15);

    const tableColumn = ["Item", "Description"];
    const tableRows: (string | null)[][] = [];

    cart.forEach(item => {
      const itemData = [
        item.name,
        item.description,
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save(`${menuName}_order.pdf`);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center"
        >
          <span className="font-semibold">View Cart</span>
          <span className="ml-2 bg-white text-blue-500 rounded-full px-2 py-0.5 text-sm font-bold">{cart.length}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={() => setIsOpen(false)} className="flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeftIcon className="w-6 h-6 mr-1" />
          <span className="font-semibold">Back to Menu</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Order Summary</h1>
      </header>

      {/* Cart Items */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4"/>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 bg-white">
        <button 
          onClick={generatePdf} 
          disabled={cart.length === 0}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirm Selection & Download PDF
        </button>
      </footer>
    </div>
  );
};

export default Cart;