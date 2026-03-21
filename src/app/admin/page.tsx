'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── Types ────────────────────────────────────────────────────────
interface Order {
  id: string
  menuName: string
  phone: string
  vegGuests: number
  nonVegGuests: number
  date: string | null
  referralCode: string | null
  createdAt: string
  menuSnapshot: unknown[]
  referrer?: { name: string; code: string; rewardAmount: number } | null
}

interface Referrer {
  id: string
  name: string
  phone: string
  code: string
  rewardAmount: number
  orderCount: number
  totalEarned: number
  createdAt: string
}

interface Menu {
  id: string
  name: string
  shareToken: string | null
}

function generateCode(name: string, phone: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
  const last4 = phone.slice(-4)
  return `${slug}-${last4}`
}

// ── Admin page ───────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [tab, setTab] = useState<'orders' | 'referrers'>('orders')

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/menus')
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) return <LoadingScreen variant="light" />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <button
            onClick={() => router.push('/menus')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-6 flex gap-6">
          {(['orders', 'referrers'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {tab === 'orders' ? <OrdersTab /> : <ReferrersTab />}
      </div>
    </div>
  )
}

// ── PDF generation for an order ──────────────────────────────────
function downloadOrderPdf(o: Order) {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const createdDate = new Date(o.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  // Header block
  doc.setFillColor(24, 24, 43)
  doc.rect(0, 0, pageW, 42, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(o.menuName, 14, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 210)
  doc.text('Order Summary', 14, 27)
  doc.text(`Generated: ${createdDate}`, 14, 34)

  // Items table from menuSnapshot
  const snapshot = Array.isArray(o.menuSnapshot) ? o.menuSnapshot as Array<{
    name: string; description?: string; category?: { name: string }
  }> : []

  const rows = snapshot.map(item => [
    (item as any).categoryName ?? '',
    '',
    item.name ?? '',
    item.description ?? '',
  ])

  autoTable(doc, {
    head: [['Category', 'Sub-category', 'Item', 'Description']],
    body: rows.length ? rows : [['—', '', 'No items', '']],
    startY: 50,
    headStyles: { fillColor: [24, 24, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
    alternateRowStyles: { fillColor: [245, 245, 252] },
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 35 }, 2: { cellWidth: 45 }, 3: { cellWidth: 'auto' } },
    margin: { left: 14, right: 14 },
  })

  // Event details block
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  doc.setFillColor(245, 245, 252)
  doc.roundedRect(14, finalY, pageW - 28, 8, 2, 2, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(24, 24, 43)
  doc.text('Event Details', 18, finalY + 5.5)

  autoTable(doc, {
    body: [
      ['Vegetarian Guests', String(o.vegGuests), 'Non-Veg Guests', String(o.nonVegGuests)],
      ['Preferred Date', o.date || '—', 'Phone', o.phone],
      ...(o.referralCode ? [['Referral Code', o.referralCode, '', '']] : []),
    ],
    startY: finalY + 12,
    theme: 'plain',
    bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, textColor: [80, 80, 110] },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 42, textColor: [80, 80, 110] },
      3: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  })

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 180)
  doc.setFont('helvetica', 'normal')
  doc.text(`${o.menuName} · ${createdDate}`, pageW / 2, footerY, { align: 'center' })

  doc.save(`${o.menuName.replace(/\s+/g, '-')}_${o.phone}_order.pdf`)
}

// ── Orders Tab ───────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => setOrders(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted-foreground text-sm">Loading orders…</p>
  if (!orders.length) return <p className="text-muted-foreground text-sm">No orders yet.</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-foreground">Orders ({orders.length})</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground">
              {['Date', 'Menu', 'Phone', 'Veg', 'Non-Veg', 'Event Date', 'Referral', 'Items', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{o.menuName}</td>
                <td className="px-4 py-3 text-foreground">{o.phone}</td>
                <td className="px-4 py-3 text-center text-foreground">{o.vegGuests}</td>
                <td className="px-4 py-3 text-center text-foreground">{o.nonVegGuests}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date || '—'}</td>
                <td className="px-4 py-3">
                  {o.referrer ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 text-xs px-2 py-0.5 font-medium">
                      {o.referrer.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {Array.isArray(o.menuSnapshot) ? o.menuSnapshot.length : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => downloadOrderPdf(o)}
                    className="px-3 py-1 text-xs rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                  >
                    ↓ PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Referrers Tab ────────────────────────────────────────────────
function ReferrersTab() {
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', code: '', rewardAmount: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    Promise.all([
      fetch('/api/admin/referrers').then(r => r.json()),
      fetch('/api/menus?limit=100').then(r => r.json()),
    ]).then(([rData, mData]) => {
      setReferrers(rData.data ?? [])
      setMenus(mData.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, code: generateCode(name, f.phone) }))
  }

  const handlePhoneChange = (phone: string) => {
    const digits = phone.replace(/\D/g, '').slice(0, 10)
    setForm(f => ({ ...f, phone: digits, code: generateCode(f.name, digits) }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit Indian number'
    if (!form.code.trim()) errs.code = 'Code is required'
    if (!form.rewardAmount || isNaN(Number(form.rewardAmount))) errs.rewardAmount = 'Enter a valid amount'
    return errs
  }

  const handleCreate = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/referrers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          code: form.code.trim(),
          rewardAmount: Number(form.rewardAmount),
        }),
      })
      if (res.ok) {
        setForm({ name: '', phone: '', code: '', rewardAmount: '' })
        setFormErrors({})
        setShowForm(false)
        load()
      } else {
        const d = await res.json()
        setFormErrors({ submit: d.error ?? 'Failed to create' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this referrer? Their orders will remain.')) return
    await fetch(`/api/admin/referrers/${id}`, { method: 'DELETE' })
    load()
  }

  const copyLink = (ref: Referrer, menuId: string) => {
    const menu = menus.find(m => m.id === menuId)
    if (!menu?.shareToken) return
    const url = `${window.location.origin}/preview/${menu.shareToken}?ref=${ref.code}`
    navigator.clipboard.writeText(url)
    setCopied(ref.id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading…</p>

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Referrers ({referrers.length})</h2>
          <button
            onClick={() => setShowForm(s => !s)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? 'Cancel' : '+ Add Referrer'}
          </button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6 flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">New Referrer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" error={formErrors.name}>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Phone" error={formErrors.phone}>
                <input
                  value={form.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="9876543210"
                  inputMode="numeric"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Code (auto-generated, editable)" error={formErrors.code}>
                <input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  placeholder="rahul-sharma-3210"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary font-mono"
                />
              </Field>
              <Field label="Reward per Order (₹)" error={formErrors.rewardAmount}>
                <input
                  value={form.rewardAmount}
                  onChange={e => setForm(f => ({ ...f, rewardAmount: e.target.value }))}
                  placeholder="500"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>
            {formErrors.submit && <p className="text-sm text-red-500">{formErrors.submit}</p>}
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving ? 'Saving…' : 'Create Referrer'}
              </button>
            </div>
          </div>
        )}
      </div>

      {referrers.length === 0 ? (
        <p className="text-muted-foreground text-sm">No referrers yet. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                {['Name', 'Phone', 'Code', 'Reward/Order', 'Orders', 'Total Earned', 'Generate Link', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrers.map((ref, i) => (
                <tr key={ref.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                  <td className="px-4 py-3 font-medium text-foreground">{ref.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{ref.phone}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{ref.code}</td>
                  <td className="px-4 py-3 text-foreground">₹{ref.rewardAmount}</td>
                  <td className="px-4 py-3 text-center text-foreground">{ref.orderCount}</td>
                  <td className="px-4 py-3 font-medium text-green-700">₹{ref.totalEarned}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedMenu[ref.id] ?? ''}
                        onChange={e => setSelectedMenu(s => ({ ...s, [ref.id]: e.target.value }))}
                        className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground max-w-[140px] outline-none"
                      >
                        <option value="">Select menu…</option>
                        {menus.filter(m => m.shareToken).map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => selectedMenu[ref.id] && copyLink(ref, selectedMenu[ref.id])}
                        disabled={!selectedMenu[ref.id]}
                        className="px-3 py-1 text-xs rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 disabled:opacity-40 transition-colors whitespace-nowrap"
                      >
                        {copied === ref.id ? '✓ Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(ref.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Field wrapper ────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
