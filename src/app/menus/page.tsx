'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from "@clerk/nextjs"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { Button } from '@/components/ui/Button'
import { MenuCard } from '@/components/dashboard/MenuCard'
import { CreateMenuModal } from '@/components/dashboard/CreateMenuModal'
import { toast } from '@/components/ui/Toast'
import { menuApi, Menu } from '@/lib/api'
import {
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const filterOptions = [
  { label: 'All', value: undefined },
  { label: 'Public', value: true },
  { label: 'Private', value: false },
] as const

export default function Dashboard() {
  const router = useRouter()
  const { isLoaded, userId, isLoading: isAuthLoading } = useRequireAuth()
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterPublic, setFilterPublic] = useState<boolean | undefined>(undefined)

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await menuApi.getMenus({
        search: searchQuery || undefined,
        isPublic: filterPublic,
        limit: 50
      })
      setMenus(response.data)
    } catch (error) {
      console.error('Failed to load menus:', error)
      toast.error('Failed to load menus')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filterPublic])

  useEffect(() => {
    if (userId) {
      loadMenus()
    }
  }, [searchQuery, filterPublic, userId, loadMenus])

  const handleEditMenu = (menu: Menu) => router.push(`/menus/${menu.id}/edit`)
  const handlePreviewMenu = (menu: Menu) => router.push(`/preview/${menu.shareToken}`)

  const handleShareMenu = (menu: Menu) => {
    if (menu.shareToken) {
      const shareUrl = `${window.location.origin}/preview/${menu.shareToken}`
      navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } else {
      toast.error('This menu cannot be shared')
    }
  }

  const handleDeleteMenu = async (menu: Menu) => {
    if (!confirm(`Are you sure you want to delete "${menu.name}"? This action cannot be undone.`)) {
      return
    }
    try {
      await menuApi.deleteMenu(menu.id)
      toast.success('Menu deleted successfully')
      loadMenus()
    } catch (error) {
      console.error('Failed to delete menu:', error)
      toast.error('Failed to delete menu')
    }
  }

  const filteredMenus = menus.filter(menu => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return menu.name.toLowerCase().includes(query) ||
             menu.description?.toLowerCase().includes(query)
    }
    return true
  })

  const publicCount = menus.filter(m => m.isPublic).length
  const privateCount = menus.filter(m => !m.isPublic).length

  if (isAuthLoading || !userId) {
    return <LoadingScreen variant="light" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z" opacity="0.3"/>
                  <path d="M8 6h13v2H8V6zm0 8h13v2H8v-2zM3 6h3v2H3V6zm0 8h3v2H3v-2z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground">MenuCraft</span>
            </div>
            <UserButton
              showName
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                  userButtonPopoverCard: "shadow-warm",
                }
              }}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Menus</h1>
            <p className="text-muted-foreground mt-1">
              Create, manage and share your catering menus
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="sm:w-auto w-full rounded-xl shadow-warm hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Menu
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Menus', value: menus.length, icon: '📋' },
            { label: 'Public', value: publicCount, icon: '🌐' },
            { label: 'Private', value: privateCount, icon: '🔒' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            {filterOptions.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setFilterPublic(opt.value)}
                className={clsx(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                  filterPublic === opt.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="h-1.5 skeleton" />
                <div className="p-5">
                  <div className="h-5 skeleton rounded-lg w-3/4 mb-3" />
                  <div className="h-3 skeleton rounded w-full mb-2" />
                  <div className="h-3 skeleton rounded w-2/3 mb-6" />
                  <div className="h-9 skeleton rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
                onShare={handleShareMenu}
                onPreview={handlePreviewMenu}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? 'No menus found' : 'No menus yet'}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first menu to get started. It only takes a few minutes!'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-xl shadow-warm"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Menu
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateMenuModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadMenus}
      />
    </div>
  )
}
