"use client"
import React from "react";
import { MenuItem } from "../../../../lib/api";

interface PageChromeProps {
  cart: MenuItem[];
  previewText: string;
  onShowConfirm: () => void;
  onShowMenuModal: () => void;
}

export default function PageChrome({
  cart,
  previewText,
  onShowConfirm,
  onShowMenuModal,
}: PageChromeProps) {
  return (
    <>
      {/* Floating "Menu" button */}
      <div className="fixed bottom-[88px] right-4 z-40">
        <button
          onClick={onShowMenuModal}
          className="bg-[#5c5c63] rounded-[16px] px-5 py-3 flex items-center gap-2 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
          <span className="text-white text-[14px] font-bold">Menu</span>
        </button>
      </div>

      {/* Cart bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-[#2d3338] border border-[rgba(255,255,255,0.05)] rounded-[16px] p-[17px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-between gap-3">
            <button
              onClick={onShowConfirm}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
            >
              <div className="flex-shrink-0 size-[32px] rounded-[8px] bg-[#a04100] flex items-center justify-center">
                <span className="text-[14px] font-bold text-[#fff6f3]">
                  {cart.length}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#f9f9fb] leading-none mb-[3px]">
                  Review Order
                </p>
                <p className="text-[10px] text-[rgba(221,227,233,0.6)] truncate">
                  {previewText}
                </p>
              </div>
            </button>

            <button
              onClick={onShowConfirm}
              className="flex-shrink-0 bg-[#a04100] rounded-[12px] px-5 py-2 text-[12px] font-black uppercase tracking-[1.2px] text-[#fff6f3]"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </>
  );
}
