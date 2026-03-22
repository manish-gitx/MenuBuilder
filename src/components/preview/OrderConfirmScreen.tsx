"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Category, MenuItem } from "../../lib/api";

interface OrderConfirmScreenProps {
  cart: MenuItem[];
  menuName: string;
  menuId: string;
  storageKey: string;
  onClose: () => void;
  onConfirm: () => void;
  categories: Category[];
  referralCode?: string;
}

const ls = {
  get: (key: string) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key: string, val: string) => { try { localStorage.setItem(key, val); } catch {} },
  del: (key: string) => { try { localStorage.removeItem(key); } catch {} },
};

const INDIAN_PHONE_RE = /^[6-9]\d{9}$/;

const OrderConfirmScreen = ({
  cart,
  menuName,
  menuId,
  storageKey,
  onClose,
  onConfirm,
  categories,
  referralCode,
}: OrderConfirmScreenProps) => {
  const eventKey = `mb_event_${storageKey}`;

  const [vegGuests, setVegGuests] = useState<number>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).vegGuests ?? 0; } catch {} }
    return 0;
  });
  const [nonVegGuests, setNonVegGuests] = useState<number>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).nonVegGuests ?? 0; } catch {} }
    return 0;
  });
  const [date, setDate] = useState<string>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).date ?? ""; } catch {} }
    return "";
  });
  const [phone, setPhone] = useState<string>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).phone ?? ""; } catch {} }
    return "";
  });
  const [phoneError, setPhoneError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [expandedCatId, setExpandedCatId] = useState<string | null>(() => {
    const cartIds = new Set(cart.map(i => i.id));
    const first = categories.find(cat => {
      if (cat.childCategories?.length) {
        return cat.childCategories.some(sub =>
          (sub.menuItems ?? []).some(i => cartIds.has(i.id))
        );
      }
      return (cat.menuItems ?? []).some(i => cartIds.has(i.id));
    });
    return first?.id ?? null;
  });

  useEffect(() => {
    ls.set(eventKey, JSON.stringify({ vegGuests, nonVegGuests, date, phone }));
  }, [vegGuests, nonVegGuests, date, phone, eventKey]);

  const cartIds = new Set(cart.map(i => i.id));

  const categoriesWithCart: Array<{
    cat: Category;
    items: MenuItem[];
    subGroups: Array<{ subCat: Category; items: MenuItem[] }>;
  }> = [];

  for (const cat of categories) {
    const hasSubCats = cat.childCategories && cat.childCategories.length > 0;
    if (hasSubCats) {
      const subGroups: Array<{ subCat: Category; items: MenuItem[] }> = [];
      for (const subCat of cat.childCategories!) {
        const items = (subCat.menuItems ?? []).filter(i => cartIds.has(i.id));
        if (items.length > 0) subGroups.push({ subCat, items });
      }
      if (subGroups.length > 0) categoriesWithCart.push({ cat, items: [], subGroups });
    } else {
      const items = (cat.menuItems ?? []).filter(i => cartIds.has(i.id));
      if (items.length > 0) categoriesWithCart.push({ cat, items, subGroups: [] });
    }
  }

  const toggleCat = (catId: string) =>
    setExpandedCatId(prev => (prev === catId ? null : catId));
  const isCatExpanded = (catId: string) => expandedCatId === catId;

  const handlePhoneChange = (val: string) => {
    // Only allow digits, max 10
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (digits.length === 0) {
      setPhoneError("Phone number is required");
    } else if (!INDIAN_PHONE_RE.test(digits)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
    } else {
      setPhoneError("");
    }
  };

  const buildPdf = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    // ── Header block ──────────────────────────────────────────────
    doc.setFillColor(24, 24, 43);
    doc.rect(0, 0, pageW, 42, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(menuName, 14, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 210);
    doc.text("Order Summary", 14, 27);
    doc.text(`Generated: ${today}`, 14, 34);

    // ── Items table ───────────────────────────────────────────────
    const rows: string[][] = [];
    for (const { cat, items, subGroups } of categoriesWithCart) {
      if (subGroups.length > 0) {
        for (const { subCat, items: sItems } of subGroups) {
          for (const item of sItems) {
            rows.push([cat.name, subCat.name, item.name, item.description ?? ""]);
          }
        }
      } else {
        for (const item of items) {
          rows.push([cat.name, "", item.name, item.description ?? ""]);
        }
      }
    }

    autoTable(doc, {
      head: [["Category", "Sub-category", "Item", "Description"]],
      body: rows,
      startY: 50,
      headStyles: {
        fillColor: [24, 24, 43],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
      alternateRowStyles: { fillColor: [245, 245, 252] },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: "auto" },
      },
      margin: { left: 14, right: 14 },
    });

    // ── Event details block ───────────────────────────────────────
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFillColor(245, 245, 252);
    doc.roundedRect(14, finalY, pageW - 28, 8, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 43);
    doc.text("Event Details", 18, finalY + 5.5);

    autoTable(doc, {
      body: [
        ["Vegetarian Guests", String(vegGuests), "Non-Veg Guests", String(nonVegGuests)],
        ["Preferred Date", date || "—", "Phone", phone],
        ...(referralCode ? [["Referral Code", referralCode, "", ""]] : []),
      ],
      startY: finalY + 12,
      theme: "plain",
      bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 42, textColor: [80, 80, 110] },
        1: { cellWidth: 50 },
        2: { fontStyle: "bold", cellWidth: 42, textColor: [80, 80, 110] },
        3: { cellWidth: "auto" },
      },
      margin: { left: 14, right: 14 },
    });

    // ── Footer ────────────────────────────────────────────────────
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 180);
    doc.setFont("helvetica", "normal");
    doc.text(`${menuName} · ${today}`, pageW / 2, footerY, { align: "center" });

    return doc;
  };

  const handleConfirm = async () => {
    // Validate phone
    if (!phone || !INDIAN_PHONE_RE.test(phone)) {
      setPhoneError(phone ? "Enter a valid 10-digit Indian mobile number" : "Phone number is required");
      const el = document.getElementById("oc-phone-input");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const doc = buildPdf();

      // Upload PDF to S3 first to get URL
      let pdfUrl: string | undefined;
      try {
        const pdfBuf = doc.output("arraybuffer");
        const filename = `${Date.now()}.pdf`;
        const uploadRes = await fetch("/api/orders/upload-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdf: Array.from(new Uint8Array(pdfBuf)),
            filename,
          }),
        });
        if (uploadRes.ok) {
          const resJson = await uploadRes.json();
          pdfUrl = resJson?.data?.url;
        }
      } catch {
        // S3 upload failure is non-fatal
      }

      // Save order to DB (with pdfUrl if available)
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId,
          menuName,
          phone,
          vegGuests,
          nonVegGuests,
          date: date || undefined,
          menuSnapshot: cart,
          referralCode: referralCode || undefined,
          pdfUrl: pdfUrl || undefined,
        }),
      });

      // Send WhatsApp (non-blocking)
      if (pdfUrl) {
        fetch("/api/orders/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfUrl, menuName, vegGuests, nonVegGuests, date, phone, referralCode }),
        }).catch(() => {});
      }

      // Download PDF locally
      doc.save(`${menuName}_order.pdf`);

      ls.del(eventKey);
      ls.del(`mb_cart_${storageKey}`);
      ls.del(`mb_openCat_${storageKey}`);
      onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--preview-confirm-bg)' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 backdrop-blur-[6px] border-b px-4 py-4 flex items-center gap-3"
        style={{ backgroundColor: 'var(--preview-surface-muted)', borderColor: 'var(--preview-border-strong)' }}
      >
        <button
          onClick={onClose}
          className="size-[40px] rounded-full flex items-center justify-center"
          style={{ color: 'var(--preview-text-primary)' }}
          aria-label="Go back"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </button>
        <span className="text-[18px] font-bold tracking-[-0.45px]" style={{ color: 'var(--preview-text-primary)' }}>
          Review &amp; Confirm
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32 flex flex-col gap-8">

        {/* Selected Items */}
        <section className="px-4 pt-6">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-[20px] font-bold tracking-[-0.5px]" style={{ color: 'var(--preview-text-primary)' }}>
              Selected Items
            </span>
            <span className="text-[14px] font-medium" style={{ color: 'var(--preview-text-secondary)' }}>
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {categoriesWithCart.map(({ cat, items, subGroups }) => {
              const totalInCat =
                subGroups.reduce((s, g) => s + g.items.length, 0) + items.length;
              const expanded = isCatExpanded(cat.id);

              return (
                <div
                  key={cat.id}
                  className="border rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
                  style={{ backgroundColor: 'var(--preview-surface)', borderColor: 'var(--preview-border-strong)' }}
                >
                  <button
                    onClick={() => toggleCat(cat.id)}
                    className="w-full border-b px-4 py-4 flex items-center justify-between"
                    style={{ borderColor: 'var(--preview-surface-low)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-bold" style={{ color: 'var(--preview-text-primary)' }}>
                        {cat.name}
                      </span>
                      <span
                        className="rounded-[4px] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[1px]"
                        style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-secondary)' }}
                      >
                        {totalInCat}
                      </span>
                    </div>
                    {expanded
                      ? <ChevronUp style={{ width: 16, height: 16, color: 'var(--preview-text-secondary)' }} />
                      : <ChevronDown style={{ width: 16, height: 16, color: 'var(--preview-text-secondary)' }} />
                    }
                  </button>

                  {expanded && (
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="gap-6 p-4 flex flex-col">
                        {subGroups.length > 0 ? (
                          subGroups.map(({ subCat, items: sItems }, idx) => {
                            const dietaryTag = sItems[0]?.tags?.find(t => t.type === "dietary");
                            const isNonVeg =
                              dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
                              dietaryTag?.name.toLowerCase().includes("non vegetarian");

                            return (
                              <div key={subCat.id}>
                                {idx > 0 && <div className="h-px mb-6" style={{ backgroundColor: 'var(--preview-surface-low)' }} />}
                                <div className="flex items-center gap-1 mb-3">
                                  <div
                                    className="size-[6px] rounded-full flex-shrink-0"
                                    style={{ backgroundColor: isNonVeg ? "#dc2626" : "#16a34a" }}
                                  />
                                  <span
                                    className="text-[10px] font-extrabold uppercase tracking-[1px]"
                                    style={{ color: isNonVeg ? "#b91c1c" : "#15803d" }}
                                  >
                                    {subCat.name}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                  {sItems.map(item => (
                                    <ConfirmItemRow key={item.id} item={item} />
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          items.map(item => (
                            <ConfirmItemRow key={item.id} item={item} />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Event Details */}
        <section className="px-4 flex flex-col gap-8">
          <span className="text-[20px] font-bold tracking-[-0.5px] px-2" style={{ color: 'var(--preview-text-primary)' }}>
            Event Details
          </span>

          {/* Serving Size */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] px-2" style={{ color: 'var(--preview-text-secondary)' }}>
              Serving Size
            </span>

            {/* Veg Guests */}
            <div
              className="border rounded-[16px] p-[17px] flex items-center justify-between"
              style={{ backgroundColor: 'var(--preview-surface)', borderColor: 'var(--preview-border-strong)' }}
            >
              <div className="flex items-center gap-3">
                <div className="size-[32px] rounded-full bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: 'var(--preview-text-primary)' }}>
                  Vegetarian Guests
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVegGuests(v => Math.max(0, v - 1))}
                  className="size-[32px] rounded-full flex items-center justify-center font-bold text-[16px]"
                  style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-primary)' }}
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={vegGuests}
                  onChange={e => setVegGuests(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-[48px] text-center text-[16px] font-bold bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ color: 'var(--preview-text-primary)' }}
                />
                <button
                  onClick={() => setVegGuests(v => v + 1)}
                  className="size-[32px] rounded-full flex items-center justify-center font-bold text-[16px]"
                  style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-primary)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Non-Veg Guests */}
            <div
              className="border rounded-[16px] p-[17px] flex items-center justify-between"
              style={{ backgroundColor: 'var(--preview-surface)', borderColor: 'var(--preview-border-strong)' }}
            >
              <div className="flex items-center gap-3">
                <div className="size-[32px] rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: 'var(--preview-text-primary)' }}>
                  Non-Veg Guests
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNonVegGuests(v => Math.max(0, v - 1))}
                  className="size-[32px] rounded-full flex items-center justify-center font-bold text-[16px]"
                  style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-primary)' }}
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={nonVegGuests}
                  onChange={e => setNonVegGuests(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-[48px] text-center text-[16px] font-bold bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ color: 'var(--preview-text-primary)' }}
                />
                <button
                  onClick={() => setNonVegGuests(v => v + 1)}
                  className="size-[32px] rounded-full flex items-center justify-center font-bold text-[16px]"
                  style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-primary)' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Preferred Date */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] px-2" style={{ color: 'var(--preview-text-secondary)' }}>
              Preferred Date
            </span>
            <div
              className="border rounded-[16px] px-[17px] py-[17px] relative"
              style={{ backgroundColor: 'var(--preview-surface)', borderColor: 'var(--preview-border-strong)' }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--preview-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-[32px] text-[16px] bg-transparent outline-none"
                style={{ color: 'var(--preview-text-primary)' }}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] px-2" style={{ color: 'var(--preview-text-secondary)' }}>
              Contact Info <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <div
              className="border rounded-[16px] relative"
              style={{
                backgroundColor: 'var(--preview-surface)',
                borderColor: phoneError ? '#dc2626' : 'var(--preview-border-strong)',
              }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--preview-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <input
                id="oc-phone-input"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-[49px] pr-[17px] py-[17px] text-[16px] bg-transparent outline-none rounded-[16px]"
                style={{ color: 'var(--preview-text-primary)' }}
              />
            </div>
            {phoneError && (
              <span className="text-[12px] px-2" style={{ color: '#dc2626' }}>
                {phoneError}
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-[12px] border-t px-4 pt-[17px] pb-8 flex-shrink-0"
        style={{ backgroundColor: 'var(--preview-confirm-bar-bg)', borderColor: 'var(--preview-border-strong)' }}
      >
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="rounded-[16px] w-full py-4 text-[18px] font-bold text-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.15),0px_4px_6px_-4px_rgba(0,0,0,0.1)] disabled:opacity-60"
          style={{ backgroundColor: 'var(--preview-accent)', color: 'var(--preview-accent-text)' }}
        >
          {submitting ? "Processing…" : "Confirm Request"}
        </button>
      </div>
    </div>
  );
};

const ConfirmItemRow = ({ item }: { item: MenuItem }) => {
  const dietaryTag = item.tags?.find(t => t.type === "dietary");
  const highlightTags = item.tags?.filter(t => t.type !== "dietary") ?? [];
  const isNonVeg =
    dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
    dietaryTag?.name.toLowerCase().includes("non vegetarian");
  const isVeg =
    dietaryTag?.name.toLowerCase().includes("vegetarian") &&
    !dietaryTag?.name.toLowerCase().includes("non");

  return (
    <div className="flex items-start gap-3">
      <div
        className="size-[80px] rounded-[12px] flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: 'var(--preview-surface-low)' }}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--preview-surface-low)' }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-bold leading-snug" style={{ color: 'var(--preview-text-primary)' }}>{item.name}</p>
        {item.description && (
          <p className="text-[12px] mt-[2px] line-clamp-2 leading-snug" style={{ color: 'var(--preview-text-secondary)' }}>
            {item.description}
          </p>
        )}
        {(dietaryTag || highlightTags.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-[6px]">
            {dietaryTag && (
              <span
                className="inline-flex items-center rounded-[4px] px-[6px] py-[0.5px] text-[9px] font-bold uppercase tracking-[0.45px]"
                style={{
                  backgroundColor: 'var(--preview-surface-low)',
                  color: isNonVeg ? "#b91c1c" : isVeg ? "#15803d" : 'var(--preview-text-secondary)',
                }}
              >
                {dietaryTag.name}
              </span>
            )}
            {highlightTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-[4px] px-[6px] py-[0.5px] text-[9px] font-bold uppercase tracking-[0.45px]"
                style={{ backgroundColor: 'var(--preview-surface-low)', color: 'var(--preview-text-secondary)' }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmScreen;
