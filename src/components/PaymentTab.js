"use client";

import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { validatePaymentDetails } from "@/lib/formValidator";

export default function PaymentTab({ items = [], onOrderPlaced, deliveryFee = 1500, customerDetails = {} }) {
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const bankDetails = {
    bank: "OPay",
    accountNumber: "8106858963",
    businessName: "Quadri Olanlesi",
  };

  const handleCopyBankDetails = () => {
    const text = `${bankDetails.bank}\n${bankDetails.accountNumber}\n${bankDetails.businessName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const total = subtotal + deliveryFee;

  const submitOrder = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setValidationErrors({});

      // Validate payment details
      const validation = validatePaymentDetails(customerDetails, paymentMethod);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setSubmitError(Object.values(validation.errors)[0] || "Please complete your payment information");
        setIsSubmitting(false);
        return;
      }

      if (!customerDetails.email || !customerDetails.phone || !customerDetails.fullName) {
        setSubmitError("Please complete your delivery details");
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        email: customerDetails.email,
        phone: customerDetails.phone,
        fullName: customerDetails.fullName,
        address: customerDetails.address || null,
        city: customerDetails.city || null,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        deliveryMode: customerDetails.deliveryMode || "delivery",
        deliveryDate: customerDetails.deliveryDate || null,
        deliveryTime: customerDetails.deliveryTime || null,
        notes: customerDetails.notes || null,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const result = await response.json();
      console.log("Order created:", result);

      if (onOrderPlaced) {
        onOrderPlaced();
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(error.message || "Failed to process order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2">
          <div className="space-y-6 pb-8">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-[#1C1917] font-medium mb-4">Payment</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Card Payment */}
                {/* <button
            onClick={() => setPaymentMethod("card")}
            className={`p-4 border-2 rounded text-left transition-all ${paymentMethod === "card"
              ? "border-[#1C1917] bg-white"
              : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
              }`}
          >
            <div className="font-medium text-[#1C1917]">Card</div>
            <div className="text-xs text-[#79716B] mt-1">Pay now</div>
          </button> */}

                {/* Bank Transfer */}
                <button
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-4 border-2 rounded text-left transition-all ${paymentMethod === "transfer"
                    ? "border-[#1C1917] bg-white"
                    : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
                    }`}
                >
                  <div className="font-medium text-[#1C1917]">Transfer</div>
                  <div className="text-xs text-[#79716B] mt-1">Bank deposit</div>
                </button>

                {/* On Delivery */}
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 border-2 rounded text-left transition-all ${paymentMethod === "cash"
                    ? "border-[#1C1917] bg-white"
                    : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
                    }`}
                >
                  <div className="font-medium text-[#1C1917]">On delivery</div>
                  <div className="text-xs text-[#79716B] mt-1">Cash on transfer</div>
                </button>
              </div>
            </div>

            {/* Payment Forms */}
            <div className="space-y-4">

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                      CARDHOLDER NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                        EXPIRY
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[#79716B]">Security processed. Demo, no real charge</p>

                  <button onClick={submitOrder} disabled={isSubmitting} className="w-full lg:hidden bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded text-sm md:text-base">
                    {isSubmitting ? "Processing..." : `PAY ₦${total.toLocaleString()}`}
                  </button>
                </div>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === "transfer" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                      SEND ₦{total.toLocaleString()} TO
                    </label>
                    <div className="p-3 bg-[#F5F5F5] rounded border border-[#D6D3D1] space-y-2">
                      <div className="flex gap-2 justify-between items-center">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs text-[#79716B]">{bankDetails.bank}</p>
                          <p className="text-sm font-medium text-[#1C1917]">{bankDetails.accountNumber}</p>
                          <p className="text-xs text-[#79716B]">{bankDetails.businessName}</p>
                        </div>
                        <button
                          onClick={handleCopyBankDetails}
                          className="p-2 hover:bg-[#E7E5E4] rounded transition-colors flex-shrink-0"
                        >
                          {copied ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <Copy className="h-5 w-5 text-[#79716B]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#79716B]">
                    After transfer, send proof to WhatsApp +234 810 685 8963
                  </p>

                  <button onClick={submitOrder} disabled={isSubmitting} className="w-full lg:hidden bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded text-sm md:text-base">
                    {isSubmitting ? "Processing..." : "I'VE MADE THE TRANSFER"}
                  </button>
                </div>
              )}

              {/* Cash on Delivery */}
              {paymentMethod === "cash" && (
                <div className="space-y-4">
                  <p className="text-sm text-[#79716B]">
                    Please have the exact amount ready for payment on delivery.
                  </p>

                  <div className="bg-[#FEF3E2] border border-[#F59E0B] rounded p-3 space-y-2">
                    <p className="text-xs font-medium text-[#D97706]">Payment Amount</p>
                    <p className="text-lg font-medium text-[#1C1917]">₦{total.toLocaleString()}</p>
                  </div>

                  <button onClick={submitOrder} disabled={isSubmitting} className="w-full lg:hidden bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded text-sm md:text-base">
                    {isSubmitting ? "Processing..." : `PLACE ORDER · ₦${total.toLocaleString()}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary - Sticky on Desktop */}
        <div className="lg:col-span-1 lg:sticky lg:top-0 lg:h-fit">
          <div className="bg-[#F5F5F5] rounded-lg p-6 md:p-8">
            <h3 className="text-xs md:text-sm tracking-[2.4px] text-[#79716B] mb-6 font-medium">SUMMARY</h3>

            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs md:text-sm mb-4 pb-4 border-b border-[#E7E5E4]">
                <span className="text-[#79716B]">
                  {item.quantity || 1} × {item.name}
                </span>
                <span className="text-[#1C1917] font-medium">
                  ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-[#79716B]">Subtotal</span>
                <span className="text-[#1C1917]">₦{subtotal.toLocaleString()}</span>
              </div>
              {/* <div className="flex justify-between text-xs md:text-sm">
                <span className="text-[#79716B]">Delivery</span>
                <span className="text-[#1C1917]">₦{deliveryFee.toLocaleString()}</span>
              </div> */}
              <div className="flex justify-between text-base md:text-lg font-medium pt-3 border-t border-[#E7E5E4] mt-4">
                <span className="text-[#1C1917]">Total</span>
                <span className="text-[#1C1917]">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Desktop Payment Buttons */}
            {paymentMethod === "card" && (
              <button onClick={submitOrder} disabled={isSubmitting} className="hidden lg:block w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded mt-8 text-sm md:text-base">
                {isSubmitting ? "Processing..." : `PAY ₦${total.toLocaleString()}`}
              </button>
            )}
            {paymentMethod === "transfer" && (
              <button onClick={submitOrder} disabled={isSubmitting} className="hidden lg:block w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded mt-8 text-sm md:text-base">
                {isSubmitting ? "Processing..." : "I'VE MADE THE TRANSFER"}
              </button>
            )}
            {paymentMethod === "cash" && (
              <button onClick={submitOrder} disabled={isSubmitting} className="hidden lg:block w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded mt-8 text-sm md:text-base">
                {isSubmitting ? "Processing..." : `PLACE ORDER · ₦${total.toLocaleString()}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
