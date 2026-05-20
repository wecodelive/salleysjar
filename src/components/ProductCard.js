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
            {/* Mobile/Tablet: Horizontal card */}
            <div className="hidden sm:flex gap-4 py-4 border-b border-[#E7E5E4] last:border-b-0 lg:hidden">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                        />
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <div>
                        <h3 className="text-[#1C1917] font-medium text-sm md:text-base">{product.name}</h3>
                        <p className="text-[#79716B] text-xs md:text-sm leading-6">
                            {product.description}
                        </p>
                    </div>

                    {/* Price and Time */}
                    <div className="flex items-center gap-3 mt-2 text-sm md:text-base">
                        <span className="text-[#1C1917] font-medium">
                            ₦{displayPrice.toLocaleString()}
                        </span>
                        {!hasVariants && product.unit && (
                            <span className="text-[#79716B] text-xs md:text-sm">/ {product.unit}</span>
                        )}
                        {product.time && (
                            <>
                                <Clock className="h-4 text-[#79716B]" />
                                <span className="text-[#79716B] text-xs md:text-sm">{product.time}m</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center border-2 border-[#1C1917] rounded-full hover:bg-[#1C1917] hover:text-white transition-all"
                >
                    <Plus className="h-5 text-[#1C1917]" />
                </button>
            </div>

            {/* Mobile: Vertical card (single column) */}
            <div className="flex flex-col sm:hidden py-3">
                <div className="w-full h-40 rounded-lg bg-gray-200 overflow-hidden cursor-pointer mb-3" onClick={() => setIsModalOpen(true)}>
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={200}
                            height={160}
                            className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                        />
                    )}
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <h3 className="text-[#1C1917] font-medium text-sm">{product.name}</h3>
                    <p className="text-[#79716B] text-xs leading-5 mb-2">
                        {product.description}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#1C1917] font-medium">
                            ₦{displayPrice.toLocaleString()}
                        </span>
                        {!hasVariants && product.unit && (
                            <span className="text-[#79716B] text-xs">/ {product.unit}</span>
                        )}
                        {product.time && (
                            <>
                                <Clock className="h-4 text-[#79716B]" />
                                <span className="text-[#79716B] text-xs">{product.time}m</span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-8 h-8 flex items-center justify-center border-2 border-[#1C1917] rounded-full hover:bg-[#1C1917] hover:text-white transition-all"
                    >
                        <Plus className="h-4 text-[#1C1917]" />
                    </button>
                </div>
            </div>

            {/* Desktop: Vertical card (grid) */}
            <div className="hidden lg:flex flex-col cursor-pointer group">
                <div className="w-full h-56 rounded-lg bg-gray-200 overflow-hidden mb-3" onClick={() => setIsModalOpen(true)}>
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={224}
                            className="w-full h-full object-contain group-hover:opacity-90 transition-opacity"
                        />
                    )}
                </div>
                <div className="flex-1" onClick={() => setIsModalOpen(true)}>
                    <h3 className="text-[#1C1917] font-medium text-base leading-6">{product.name}</h3>
                    <p className="text-[#79716B] text-sm leading-5 mb-3 min-h-10">
                        {product.description}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-base">
                        <span className="text-[#1C1917] font-medium">
                            ₦{displayPrice.toLocaleString()}
                        </span>
                        {!hasVariants && product.unit && (
                            <span className="text-[#79716B] text-sm">/ {product.unit}</span>
                        )}
                        {product.time && (
                            <>
                                <Clock className="h-4 text-[#79716B]" />
                                <span className="text-[#79716B] text-sm">{product.time}m</span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-9 h-9 flex items-center justify-center border-2 border-[#1C1917] rounded-full hover:bg-[#1C1917] hover:text-white transition-all flex-shrink-0"
                    >
                        <Plus className="h-5 text-[#1C1917]" />
                    </button>
                </div>
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
