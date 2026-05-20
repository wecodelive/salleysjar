"use client";

import { ChevronLeft, Trash2, AlertCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { validateBasketDetails } from "@/lib/formValidator";
import Header from "./header";
import DetailsTab from "./DetailsTab";
import PaymentTab from "./PaymentTab";
import OrderConfirmation from "./OrderConfirmation";

export default function CartPage({ isOpen, onClose, items = [], onOrderConfirmed, onRemoveItem, onUpdateQuantity }) {
    const [activeTab, setActiveTab] = useState("basket");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [dynamicDeliveryFee, setDynamicDeliveryFee] = useState(0);
    const [basketValidationError, setBasketValidationError] = useState(null);
    const [customerDetails, setCustomerDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        deliveryMode: "delivery",
        deliveryDate: "",
        deliveryTime: "",
        notes: "",
    });

    if (!isOpen) return null;

    const handleBackToShop = () => {
        setOrderPlaced(false);
        setActiveTab("basket");
        setCustomerName("");
        setDynamicDeliveryFee(1500);
        setCustomerDetails({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            deliveryMode: "delivery",
            deliveryDate: "",
            deliveryTime: "",
            notes: "",
        });
        if (onOrderConfirmed) {
            onOrderConfirmed();
        }
        onClose();
    };

    const handleUpdateCustomerDetails = (details) => {
        setCustomerDetails(prev => ({ ...prev, ...details }));
    };

    const handleUpdateDeliveryFee = (fee) => {
        setDynamicDeliveryFee(fee !== null && fee !== undefined ? fee : 0);
    };

    const subtotal = items.reduce((sum, item) => {
        const quantity = item.quantity || 1;
        return sum + (item.price || 0) * quantity;
    }, 0);

    const deliveryFee = dynamicDeliveryFee;
    const minOrder = 1000;
    const total = subtotal + deliveryFee;
    const remaining = Math.max(0, minOrder - subtotal);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (onUpdateQuantity) {
            onUpdateQuantity(itemId, newQuantity);
        }
    };

    const handleRemove = (itemId) => {
        if (onRemoveItem) {
            onRemoveItem(itemId);
        }
    };

    const handleContinueToDetails = () => {
        // Validate basket before allowing navigation
        const validation = validateBasketDetails(items, subtotal, minOrder);
        if (!validation.isValid) {
            setBasketValidationError(validation.errors.basket || "Please check your order");
            return;
        }
        setBasketValidationError(null);
        setActiveTab("details");
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="border-b border-[#E7E5E4] sticky top-0 bg-white">
                <Header />
                <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-[#79716B] text-[#1C1917] hover:opacity-70"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-xs md:text-sm tracking-[1.6px]">BACK</span>
                    </button>
                    <div className="w-8" />
                </div>

                {/* Tabs */}
                <div className="flex justify-between px-4 md:px-8 lg:px-12 py-3 md:py-4 gap-6 border-t border-[#E7E5E4] text-xs md:text-sm tracking-[1.6px]">
                    <button
                        onClick={() => setActiveTab("basket")}
                        className={activeTab === "basket" ? "text-[#1C1917] font-medium" : "text-[#D6D3D1]"}
                    >
                        01 · BASKET
                    </button>
                    <button
                        onClick={() => setActiveTab("details")}
                        className={activeTab === "details" ? "text-[#1C1917] font-medium" : "text-[#D6D3D1]"}
                    >
                        02 · DETAILS
                    </button>
                    <button
                        onClick={() => setActiveTab("payment")}
                        className={activeTab === "payment" ? "text-[#1C1917] font-medium" : "text-[#D6D3D1]"}
                    >
                        03 · PAYMENT
                    </button>
                </div>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
                {activeTab === "basket" && (
                    <>
                        {/* Basket Container - Side by side on desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            {/* Left: Your Basket Items */}
                            <div className="lg:col-span-2">
                                <h2 className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-[#1C1917] font-medium">Your basket</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-8">
                                    {items.length > 0 ? (
                                        items.map((item) => {
                                            const itemQuantity = item.quantity || 1;
                                            const itemPrice = (item.price || 0) * itemQuantity;

                                            return (
                                                <div
                                                    key={item.id}
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
                                                            <h3 className="text-sm md:text-base text-[#1C1917] font-medium">{item.name}</h3>
                                                            <p className="text-xs md:text-sm text-[#79716B]">
                                                                ₦{item.price?.toLocaleString()} / {item.unit || "each"}
                                                            </p>
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleQuantityChange(item.id, itemQuantity - 1)
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
                                                                    handleQuantityChange(item.id, itemQuantity + 1)
                                                                }
                                                                className="text-[#79716B] hover:text-[#1C1917]"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Item Price & Remove */}
                                                    <div className="flex flex-col items-end justify-between">
                                                        <span className="text-sm md:text-base font-medium text-[#1C1917]">
                                                            ₦{itemPrice.toLocaleString()}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemove(item.id)}
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
                                {/* <p className="text-xs md:text-sm text-[#79716B] mb-4">
                                    Ready in about 15 minutes from order time.
                                </p> */}

                                {/* Delivery Warning & Validation Error */}
                                {remaining > 0 && (
                                    <div className="bg-[#FEF3E2] border border-[#F59E0B] rounded p-3 md:p-4 mb-6">
                                        <p className="text-xs md:text-sm text-[#D97706]">
                                            Delivery minimum is{" "}
                                            <span className="font-medium">₦{minOrder.toLocaleString()}</span>
                                            . Add{" "}
                                            <span className="font-medium">₦{remaining.toLocaleString()}</span>{" "}
                                            more or choose pickup.
                                        </p>
                                    </div>
                                )}

                                {basketValidationError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">{basketValidationError}</p>
                                    </div>
                                )}

                                {/* Continue Button - Hidden on Desktop */}
                                <button onClick={handleContinueToDetails} className="w-full lg:hidden bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded mb-8 text-sm md:text-base">
                                    CONTINUE
                                </button>
                            </div>

                            {/* Right: Summary - Sticky on Desktop */}
                            <div className="lg:col-span-1 lg:sticky lg:top-0 lg:h-fit">
                                <div className="bg-[#F5F5F5] rounded-lg p-6 md:p-8">
                                    <h3 className="text-xs md:text-sm tracking-[2.4px] text-[#79716B] mb-6 font-medium">
                                        SUMMARY
                                    </h3>

                                    {items.map((item) => {
                                        const itemQuantity = item.quantity || 1;
                                        return (
                                            <div key={item.id} className="flex justify-between text-xs md:text-sm mb-4 pb-4 border-b border-[#E7E5E4]">
                                                <span className="text-[#79716B]">
                                                    {itemQuantity} × {item.name}
                                                </span>
                                                <span className="text-[#1C1917] font-medium">
                                                    ₦{((item.price || 0) * itemQuantity).toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    <div className="space-y-4 pt-4">
                                        <div className="flex justify-between text-xs md:text-sm">
                                            <span className="text-[#79716B]">Subtotal</span>
                                            <span className="text-[#1C1917]">
                                                ₦{subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs md:text-sm">
                                            <span className="text-[#79716B]">Delivery</span>
                                            <span className="text-[#1C1917]">
                                                ₦{deliveryFee.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base md:text-lg font-medium pt-3 border-t border-[#E7E5E4] mt-4">
                                            <span className="text-[#1C1917]">Total</span>
                                            <span className="text-[#1C1917]">
                                                ₦{total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continue Button - Shown on Desktop */}
                                    <button onClick={handleContinueToDetails} className="hidden lg:block w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded mt-8 text-sm md:text-base">
                                        CONTINUE
                                    </button>
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
                        onUpdateDeliveryFee={handleUpdateDeliveryFee}
                        onUpdateCustomerDetails={handleUpdateCustomerDetails}
                    />
                )}

                {activeTab === "payment" && (
                    <PaymentTab
                        items={items}
                        onOrderPlaced={() => setOrderPlaced(true)}
                        deliveryFee={deliveryFee}
                        customerDetails={customerDetails}
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
