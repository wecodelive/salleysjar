"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AddToCartModal({ product, isOpen, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(
        product?.variants ? product.variants[0] : null
    );

    if (!isOpen || !product) return null;

    const hasVariants = product.variants && product.variants.length > 0;
    const price = hasVariants ? selectedVariant?.price : product.price;
    const unit = hasVariants ? selectedVariant?.size : product.unit;
    const totalPrice = price * quantity;

    const handleAddToCart = () => {
        const cartItem = hasVariants
            ? {
                ...product,
                selectedVariant,
                price: selectedVariant.price,
                quantity,
            }
            : {
                ...product,
                quantity,
            };
        onAddToCart(cartItem);
        onClose();
        setQuantity(1);
    };

    return (
        <div className="fixed inset-0 bg-[#1C19174D] z-50 flex items-center justify-center p-4">
            <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[45%] bg-white rounded-lg md:rounded-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom shadow-2xl">
                {/* Close Button */}

                {/* Product Image */}
                {product.image && (
                    <div className="relative w-full h-[280px] sm:h-[336px] md:h-[400px] bg-gray-200 overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={200}
                            className="w-full h-full object-contain"
                        />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-[#1C1917]" />
                        </button>
                    </div>
                )}

                {/* Product Details */}
                <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
                    {/* Name and Price */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg md:text-2xl font-medium text-[#1C1917] leading-7 md:leading-9">
                                {product.name}
                            </h2>
                            <p className="text-[#79716B] leading-6 md:leading-7 mt-2 md:mt-3 text-sm md:text-base">
                                {product.description}
                            </p>
                        </div>
                        <span className="text-base md:text-xl font-medium text-[#44403B] flex-shrink-0">
                            ₦{price.toLocaleString()}
                        </span>
                    </div>

                    {/* Unit Info */}
                    <div>
                        <p className="text-[#A6A09B] text-xs md:text-sm tracking-[1.6px] font-medium">
                            SOLD PER {unit?.toUpperCase() || product.unit?.toUpperCase()}
                        </p>
                    </div>

                    {/* Size Variants */}
                    {hasVariants && (
                        <div>
                            <p className="text-[#1C1917] mb-4 md:mb-5 text-sm md:text-base font-medium">SIZE</p>
                            <div className="flex gap-3 md:gap-4">
                                {product.variants.map((variant, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 md:px-5 py-2 md:py-2.5 rounded border font-medium transition-all text-sm md:text-base ${selectedVariant?.size === variant.size
                                            ? "bg-[#1C1917] text-white border-[#1C1917]"
                                            : "border-[#D6D3D1] text-[#1C1917] hover:border-[#1C1917]"
                                            }`}
                                    >
                                        {variant.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="h-2 border-b border-[#E7E5E4]" />


                    {/* Quantity Selector */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                            <p className="text-[#79716B] tracking-[1.6px] text-xs md:text-sm font-medium">QUANTITY</p>
                            <div className="flex items-center gap-5 md:gap-6">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-[#79716B] hover:text-[#1C1917] text-lg md:text-xl transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-[#1C1917] min-w-[28px] text-center font-medium text-base md:text-lg">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-[#79716B] hover:text-[#1C1917] text-lg md:text-xl transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] text-sm md:text-base hover:bg-[#2D2824] transition-colors rounded"
                        >
                            ADD — ₦{totalPrice.toLocaleString()}
                        </button>
                    </div>

                    {/* Spacing for mobile */}
                    {/* <div className="h-8" /> */}
                </div>
            </div>
        </div>
    );
}
