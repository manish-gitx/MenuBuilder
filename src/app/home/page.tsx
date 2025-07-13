'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserButton } from "@clerk/nextjs"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MenuCard } from '@/components/dashboard/MenuCard'
import { CreateMenuModal } from '@/components/dashboard/CreateMenuModal'
import { toast } from '@/components/ui/Toast'
import { menuApi, Menu } from '@/lib/api'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'

export default function Dashboard() {
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterPublic, setFilterPublic] = useState<boolean | undefined>(undefined)

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/')
    }
  }, [isLoaded, userId, router])

  // Load menus
  const loadMenus = async () => {
    if (!userId) return
    
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
  }

  useEffect(() => {
    if (userId) {
      loadMenus()
    }
  }, [searchQuery, filterPublic, userId])

  const handleEditMenu = (menu: Menu) => {
    router.push(`/menus/${menu.id}/edit`)
  }

  const handlePreviewMenu = (menu: Menu) => {
    router.push(`/menus/${menu.id}/preview`)
  }

  const handleShareMenu = (menu: Menu) => {
    if (menu.shareToken) {
      const shareUrl = `${window.location.origin}/share/${menu.shareToken}`
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

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">      
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">MenuMaker</div>
              <div className="text-sm text-muted-foreground">Dashboard</div>
            </div>
            <UserButton 
              showName 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonPopoverCard: "shadow-warm",
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Menus</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your catering menus
            </p>
          </div>
          
          <Button 
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="lg:w-auto w-full"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Menu
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Dropdown */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </HeadlessMenu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-card shadow-lg ring-1 ring-border focus:outline-none">
                <div className="p-1">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setFilterPublic(undefined)}
                        className={clsx(
                          'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                          active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                          filterPublic === undefined && 'bg-accent text-accent-foreground'
                        )}
                      >
                        All Menus
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setFilterPublic(true)}
                        className={clsx(
                          'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                          active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                          filterPublic === true && 'bg-accent text-accent-foreground'
                        )}
                      >
                        Public Only
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setFilterPublic(false)}
                        className={clsx(
                          'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                          active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                          filterPublic === false && 'bg-accent text-accent-foreground'
                        )}
                      >
                        Private Only
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border/50 p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-6"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No menus found' : 'No menus yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Create your first menu to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Menu
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Menu Modal */}
      <CreateMenuModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadMenus}
      />
    </div>
  )
}