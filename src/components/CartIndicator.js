"use client";

import { ShoppingBag } from "lucide-react";

export default function CartIndicator({ items, total, onOpen }) {
    if (items.length === 0) return null;

    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <button onClick={onOpen} className="w-full bg-[#1C1917] text-white px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between font-medium hover:bg-[#2D2824] transition-colors text-sm md:text-base">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 md:h-6 w-5 md:w-6" />
                    <span>VIEW BASKET · {itemCount}</span>
                </div>
                <span>₦{total.toLocaleString()}</span>
            </button>
        </div>
    );
}
