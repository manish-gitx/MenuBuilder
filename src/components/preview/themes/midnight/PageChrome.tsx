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
  onShowConfirm,
  onShowMenuModal,
}: PageChromeProps) {
  return (
    <>
      {/* Floating "Menu" button */}
      <div className="fixed bottom-[108px] right-4 z-40">
        <button
          onClick={onShowMenuModal}
          className="backdrop-blur-[10px] rounded-[12px] px-5 py-3 flex items-center gap-2 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border"
          style={{
            background: 'var(--preview-nav-bg)',
            borderColor: 'var(--preview-nav-border)',
          }}
        >
          <svg width="15" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--preview-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
          <span
            className="text-xs sm:text-[13px] md:text-sm font-semibold uppercase tracking-[2.4px]"
            style={{ color: 'var(--preview-text-primary)' }}
          >
            Menu
          </span>
        </button>
      </div>

      {/* Cart bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div
            className="border border-[rgba(255,255,255,0.05)] rounded-[16px] p-[12px] min-[390px]:p-[17px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-between gap-2 min-[390px]:gap-3"
            style={{ background: 'var(--preview-cart-bg)' }}
          >
            <button
              onClick={onShowConfirm}
              className="flex items-center gap-2 min-[390px]:gap-4 flex-1 min-w-0 text-left"
            >
              <div
                className="flex-shrink-0 size-[40px] rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: 'var(--preview-cart-badge)' }}
              >
                <span
                  className="text-sm sm:text-[15px] md:text-base font-extrabold"
                  style={{ color: 'var(--preview-cart-badge-text)' }}
                >
                  {String(cart.length).padStart(2, '0')}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[1px] leading-none mb-[2px]"
                  style={{ color: 'var(--preview-cart-text)' }}
                >
                  Selection
                </p>
                <p
                  className="text-xs sm:text-[13px] md:text-sm font-semibold"
                  style={{ color: 'var(--preview-text-primary)' }}
                >
                  Review Order
                </p>
              </div>
            </button>

            <button
              onClick={onShowConfirm}
              className="flex-shrink-0 rounded-[8px] px-[32px] py-[12px] text-xs sm:text-[13px] md:text-sm font-bold uppercase tracking-[1.2px] shadow-[0px_4px_15px_0px_rgba(255,185,90,0.3)]"
              style={{ background: 'var(--preview-add-btn-bg)', color: 'var(--preview-add-btn-color)' }}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </>
  );
}
