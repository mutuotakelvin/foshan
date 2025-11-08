"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CartSheet() {
  const items = useCartStore((s) => s.items)
  const totalItems = useCartStore((s) => s.totalItems)()
  const totalPrice = useCartStore((s) => s.totalPrice)()
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Cart ({totalItems})
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 mt-4">
          {items.length === 0 ? (
            <div className="text-slate-600">Your cart is empty.</div>
          ) : (
            <ScrollArea className="h-[60vh] pr-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <Image src={item.image} alt={item.name} width={56} height={56} className="w-14 h-14 rounded object-cover" />
                      )}
                      <div>
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-sm text-slate-600">${item.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-8 text-center">{item.quantity}</div>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Total</div>
            <div className="text-xl font-bold">${totalPrice.toLocaleString()}</div>
          </div>
          <Link href="/checkout" className="w-full">
            <Button className="w-full bg-amber-600 hover:bg-amber-700" disabled={items.length === 0}>
              Checkout
            </Button>
          </Link>
          <div className="text-xs text-slate-500 text-center">
            By checking out, you agree to our {" "}
            <Link href="/refund-policy" className="text-amber-700 underline">Refund Policy</Link>.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
