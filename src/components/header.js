import Image from 'next/image'
import React from 'react'
import { ShoppingBag } from 'lucide-react'

export default function Header({ cartCount = 0, onCartClick }) {
    return (
        <div className='px-4 py-2 flex items-center justify-between border-[#E7E5E4] border-b'>
            <Image
                className="h-[45px] w-auto "
                src="/salleysjarLogonew.png"
                alt="Salleysjar logo"
                width={100}
                height={20}
                priority
            />

            <button
                onClick={onCartClick}
                className="relative p-2 hover:opacity-70 transition-opacity"
            >
                <ShoppingBag className='h-5 w-5 text-[#44403B]' />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#1C1917] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </button>
        </div>
    )
}
