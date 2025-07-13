import { Menu } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'

interface MenuCardProps {
  menu: Menu
  onEdit: (menu: Menu) => void
  onDelete: (menu: Menu) => void
  onShare: (menu: Menu) => void
  onPreview: (menu: Menu) => void
}

export function MenuCard({ menu, onEdit, onDelete, onShare, onPreview }: MenuCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="group bg-card rounded-xl border border-border/50 p-6 shadow-card hover:shadow-lg transition-all duration-200 hover:border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {menu.name}
          </h3>
          {menu.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {menu.description}
            </p>
          )}
        </div>
        
        {/* Menu Actions */}
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5" />
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
                      onClick={() => onEdit(menu)}
                      className={clsx(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      )}
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit Menu
                    </button>
                  )}
                </HeadlessMenu.Item>
                
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onPreview(menu)}
                      className={clsx(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      )}
                    >
                      <EyeIcon className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </HeadlessMenu.Item>
                
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onShare(menu)}
                      className={clsx(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      )}
                    >
                      <ShareIcon className="w-4 h-4" />
                      Share
                    </button>
                  )}
                </HeadlessMenu.Item>
                
                <div className="border-t border-border my-1" />
                
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(menu)}
                      className={clsx(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        active ? 'bg-destructive text-destructive-foreground' : 'text-destructive'
                      )}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <span>{menu._count?.categories || 0} categories</span>
        <span>•</span>
        <span>Created {formatDate(menu.createdAt)}</span>
        {menu.isPublic && (
          <>
            <span>•</span>
            <span className="text-primary font-medium">Public</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onEdit(menu)}
          className="flex-1"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Menu
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(menu)}
        >
          <EyeIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}