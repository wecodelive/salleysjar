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
        <div className="fixed inset-0 bg-[#1C19174D] z-50 flex items-center justify-center">
            <div className="w-[90%] bg-white rounded-t-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
                {/* Close Button */}

                {/* Product Image */}
                {product.image && (
                    <div className="relative w-full h-[336px] bg-gray-200 overflow-hidden">
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
                <div className="px-4 py-6 space-y-6">
                    {/* Name and Price */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-[500] text-[#1C1917]">
                                {product.name}
                            </h2>
                            <p className="text-[#79716B] leading-6 mt-1">
                                {product.description}
                            </p>
                        </div>
                        <span className="text-base font-[500] text-[#44403B]">
                            ₦{price.toLocaleString()}
                        </span>
                    </div>

                    {/* Unit Info */}
                    <div>
                        <p className="text-[#A6A09B] text-base tracking-[1.6px]">
                            SOLD PER {unit?.toUpperCase() || product.unit?.toUpperCase()}
                        </p>
                    </div>

                    {/* Size Variants */}
                    {hasVariants && (
                        <div>
                            <p className="text-[#1C1917] mb-3">SIZE</p>
                            <div className="flex gap-3">
                                {product.variants.map((variant, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 rounded border font-medium transition-all ${selectedVariant?.size === variant.size
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[#79716B] tracking-[1.6px]">QUANTITY</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-[#79716B] hover:text-[#1C1917] w-4 h-4 flex items-center justify-center"
                                >
                                    −
                                </button>
                                <span className="text-[#1C1917] min-w-[20px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-[#79716B] hover:text-[#1C1917] w-4 h-4 flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#1C1917] text-white py-3.5 font-[500] tracking-[1.6px] hover:bg-[#2D2824] transition-colors"
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
