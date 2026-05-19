"use client";

import { useState } from "react";

export default function OrderConfirmation({ customerName, onBackToShop }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                {/* Order Placed Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-medium text-[#1C1917] mb-2">
                        ORDER PLACED
                    </h1>
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-full border-2 border-[#1C1917] flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Thank You Message */}
                <div className="mb-6">
                    <h2 className="text-xl text-[#1C1917] mb-4">
                        Thank you, {customerName}!
                    </h2>
                </div>

                {/* Instructions */}
                <div className="mb-8 space-y-3 text-sm text-[#79716B]">
                    <p>
                        Pick us on WhatsApp or call our shop.
                    </p>
                    <p className="font-medium text-[#1C1917]">
                        From ₦50 ready on delivery
                    </p>
                </div>

                {/* Back to Shop Button */}
                <button
                    onClick={onBackToShop}
                    className="w-full border-2 border-[#1C1917] text-[#1C1917] py-3 font-medium tracking-[1.2px] hover:bg-[#F5F5F5] transition-colors rounded"
                >
                    BACK TO SHOP
                </button>
            </div>
        </div>
    );
}
