"use client";

import { Clock, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({ product, onAddToCart }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const hasVariants = product.variants && product.variants.length > 0;
    const displayPrice = hasVariants ? product.variants[0]?.price : product.price;

    return (
        <>
            <div className="flex gap-4 py-4 border-b border-[#E7E5E4] last:border-b-0">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <div>
                        <h3 className="text-[#1C1917] font-[500] text-base">{product.name}</h3>
                        <p className="text-[#79716B] text-base leading-6">
                            {product.description}
                        </p>
                    </div>

                    {/* Price and Time */}
                    <div className="flex items-center gap-3 mt-2 text-base">
                        <span className="text-[#1C1917] font-[500]">
                            ₦{displayPrice.toLocaleString()}
                        </span>
                        {!hasVariants && product.unit && (
                            <span className="text-[#79716B] text-base">/ {product.unit}</span>
                        )}
                        {product.time && (
                            <>
                                <Clock className="h-4 text-[#79716B]" />
                                <span className="text-[#79716B] text-base">{product.time}m</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center border-2 border-[#1C1917] rounded-full hover:bg-[#1C1917] hover:text-white transition-all"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Add to Cart Modal */}
            <AddToCartModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={onAddToCart}
            />
        </>
    );
}
