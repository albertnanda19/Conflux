import { type ReactNode } from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const Dropdown = DropdownMenuPrimitive.Root
const DropdownTrigger = DropdownMenuPrimitive.Trigger
const DropdownGroup = DropdownMenuPrimitive.Group
const DropdownPortal = DropdownMenuPrimitive.Portal
const DropdownSub = DropdownMenuPrimitive.Sub

function DropdownContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-hairline bg-canvas p-1 shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownItem({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink outline-none transition-colors',
        'focus:bg-surface focus:text-ink',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function DropdownLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2 py-1.5 text-xs font-semibold text-steel', className)}
      {...props}
    />
  )
}

function DropdownSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-hairline-soft', className)}
      {...props}
    />
  )
}

function DropdownItemWithIcon({ icon, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { icon: ReactNode }) {
  return (
    <DropdownItem {...props}>
      <span className="flex-shrink-0 text-steel">{icon}</span>
      <span>{children}</span>
    </DropdownItem>
  )
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownItemWithIcon,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
}
