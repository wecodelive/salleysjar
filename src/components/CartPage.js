"use client";

import { ChevronLeft, Trash2 } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Header from "./header";
import DetailsTab from "./DetailsTab";
import PaymentTab from "./PaymentTab";
import OrderConfirmation from "./OrderConfirmation";

export default function CartPage({ isOpen, onClose, items = [], onOrderConfirmed }) {
    const [quantity, setQuantity] = useState({});
    const [activeTab, setActiveTab] = useState("basket");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [customerName, setCustomerName] = useState("");

    if (!isOpen) return null;

    const handleBackToShop = () => {
        setOrderPlaced(false);
        setActiveTab("basket");
        setQuantity({});
        setCustomerName("");
        if (onOrderConfirmed) {
            onOrderConfirmed();
        }
        onClose();
    };

    const subtotal = items.reduce((sum, item, idx) => {
        const qty = quantity[idx] || item.quantity || 1;
        return sum + (item.price || 0) * qty;
    }, 0);

    const deliveryFee = 1500;
    const minOrder = 2000;
    const total = subtotal + deliveryFee;
    const remaining = Math.max(0, minOrder - subtotal);

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity({ ...quantity, [index]: newQuantity });
        }
    };

    const handleRemove = (index) => {
        // This would need to be handled by parent component
        console.log("Remove item:", index);
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="border-b border-[#E7E5E4] sticky top-0 bg-white">
                <Header />
                <div className="flex items-center justify-between px-4 py-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-[#79716B] text-[#1C1917] hover:opacity-70"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-sm  tracking-[1.6px]">BACK</span>
                    </button>
                    <div className="w-8" />
                </div>

                {/* Tabs */}
                <div className="flex justify-between px-4 py-3 gap-6 border-t border-[#E7E5E4] text-xs tracking-[1.6px]">
                    <button
                        onClick={() => setActiveTab("basket")}
                        className={activeTab === "basket" ? "text-[#1C1917] font-[500]" : "text-[#D6D3D1]"}
                    >
                        01 · BASKET
                    </button>
                    <button
                        onClick={() => setActiveTab("details")}
                        className={activeTab === "details" ? "text-[#1C1917] font-[500]" : "text-[#D6D3D1]"}
                    >
                        02 · DETAILS
                    </button>
                    <button
                        onClick={() => setActiveTab("payment")}
                        className={activeTab === "payment" ? "text-[#1C1917] font-[500]" : "text-[#D6D3D1]"}
                    >
                        03 · PAYMENT
                    </button>
                </div>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {activeTab === "basket" && (
                    <>
                        {/* Your Basket */}
                        <h2 className="text-lg mb-6 text-[#1C1917]">Your basket</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {items.length > 0 ? (
                                items.map((item, idx) => {
                                    const itemQuantity = quantity[idx] || item.quantity || 1;
                                    const itemPrice = (item.price || 0) * itemQuantity;

                                    return (
                                        <div
                                            key={idx}
                                            className="flex gap-3 p-3 bg-[#F5F5F5] rounded-lg"
                                        >
                                            {/* Item Image */}
                                            <div className="w-16 h-16 flex-shrink-0 bg-gray-300 rounded overflow-hidden">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm text-[#1C1917]">{item.name}</h3>
                                                    <p className="text-xs text-[#79716B]">
                                                        ₦{item.price?.toLocaleString()} / {item.unit || "each"}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(idx, itemQuantity - 1)
                                                        }
                                                        className="text-[#79716B] hover:text-[#1C1917]"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-xs w-4 text-center">
                                                        {itemQuantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(idx, itemQuantity + 1)
                                                        }
                                                        className="text-[#79716B] hover:text-[#1C1917]"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item Price & Remove */}
                                            <div className="flex flex-col items-end justify-between">
                                                <span className="text-sm font-[500] text-[#1C1917]">
                                                    ₦{itemPrice.toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => handleRemove(idx)}
                                                    className="text-[#D6D3D1] hover:text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-[#79716B] text-center py-8">
                                    Your basket is empty
                                </p>
                            )}
                        </div>

                        {/* Ready Time Info */}
                        <p className="text-xs text-[#79716B] mb-3">
                            Ready in about 15 minutes from order time.
                        </p>

                        {/* Delivery Warning */}
                        {remaining > 0 && (
                            <div className="bg-[#FEF3E2] border border-[#F59E0B] rounded p-3 mb-6">
                                <p className="text-xs text-[#D97706]">
                                    Delivery minimum is{" "}
                                    <span className="font-[500]">₦{minOrder.toLocaleString()}</span>
                                    . Add{" "}
                                    <span className="font-[500]">₦{remaining.toLocaleString()}</span>{" "}
                                    more or choose pickup.
                                </p>
                            </div>
                        )}

                        {/* Continue Button */}
                        <button onClick={() => setActiveTab("details")} className="w-full bg-[#1C1917] text-white py-4 font-[500] tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded mb-8">
                            CONTINUE
                        </button>

                        {/* Summary */}
                        <div className="space-y-3 border-t border-[#E7E5E4] pt-6">
                            <h3 className="text-xs tracking-[2.4px] text-[#79716B] mb-4">
                                SUMMARY
                            </h3>

                            {items.map((item, idx) => {
                                const itemQuantity = quantity[idx] || item.quantity || 1;
                                return (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-[#79716B]">
                                            {itemQuantity} × {item.name}
                                        </span>
                                        <span className="text-[#1C1917]">
                                            ₦{((item.price || 0) * itemQuantity).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="border-t border-[#E7E5E4] pt-3 mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#79716B]">Subtotal</span>
                                    <span className="text-[#1C1917]">
                                        ₦{subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#79716B]">Delivery</span>
                                    <span className="text-[#1C1917]">
                                        ₦{deliveryFee.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-[500] pt-2 border-t border-[#E7E5E4]">
                                    <span className="text-[#1C1917]">Total</span>
                                    <span className="text-[#1C1917]">
                                        ₦{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "details" && (
                    <DetailsTab
                        items={items}
                        onNavigate={setActiveTab}
                        onUpdateCustomerName={setCustomerName}
                    />
                )}

                {activeTab === "payment" && (
                    <PaymentTab
                        items={items}
                        onOrderPlaced={() => setOrderPlaced(true)}
                    />
                )}

                {orderPlaced && (
                    <OrderConfirmation
                        customerName={customerName}
                        onBackToShop={handleBackToShop}
                    />
                )}
            </div>
        </div>
    );
}
