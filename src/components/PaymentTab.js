"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function PaymentTab({ items = [], onOrderPlaced }) {
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [copied, setCopied] = useState(false);

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
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-6 pb-8">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-[#1C1917] font-medium mb-4">Payment</h3>

        <div className="space-y-3">
          {/* Card Payment */}
          {/* <button
            onClick={() => setPaymentMethod("card")}
            className={`w-full p-4 border-2 rounded text-left transition-all ${paymentMethod === "card"
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
            className={`w-full p-4 border-2 rounded text-left transition-all ${paymentMethod === "transfer"
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
            className={`w-full p-4 border-2 rounded text-left transition-all ${paymentMethod === "cash"
              ? "border-[#1C1917] bg-white"
              : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
              }`}
          >
            <div className="font-medium text-[#1C1917]">On delivery</div>
            <div className="text-xs text-[#79716B] mt-1">Cash on transfer</div>
          </button>
        </div>
      </div>

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

          <button onClick={onOrderPlaced} className="w-full bg-[#1C1917] text-white py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded">
            PAY ₦{total.toLocaleString()}
          </button>
        </div>
      )}

      {/* Bank Transfer Form */}
      {paymentMethod === "transfer" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
              SEND TO
            </label>
            <div className="p-3 bg-[#F5F5F5] rounded border border-[#D6D3D1] space-y-2">
              <div className="flex gap-2 justify-between items-center">
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-[#79716B]">OPay</p>
                  <p className="text-sm font-medium text-[#1C1917]">{bankDetails.accountNumber}</p>
                  <p className="text-xs text-[#79716B]">{bankDetails.businessName}</p>
                </div>
                <button
                  onClick={handleCopyBankDetails}
                  className="p-2 hover:bg-[#E7E5E4] rounded transition-colors"
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
            After transfer, send proof to WhatsApp +234 800 000 0000
          </p>

          <button onClick={onOrderPlaced} className="w-full bg-[#1C1917] text-white py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded">
            I'VE MADE THE TRANSFER
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

          <button onClick={onOrderPlaced} className="w-full bg-[#1C1917] text-white py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded">
            PLACE ORDER - ₦{total.toLocaleString()}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-3 border-t border-[#E7E5E4] pt-6">
        <h3 className="text-xs tracking-[2.4px] text-[#79716B]">SUMMARY</h3>

        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-[#79716B]">
              {item.quantity || 1} × {item.name}
            </span>
            <span className="text-[#1C1917]">
              ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
            </span>
          </div>
        ))}

        <div className="border-t border-[#E7E5E4] pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#79716B]">Subtotal</span>
            <span className="text-[#1C1917]">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#79716B]">Delivery</span>
            <span className="text-[#1C1917]">₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-medium pt-2 border-t border-[#E7E5E4]">
            <span className="text-[#1C1917]">Total</span>
            <span className="text-[#1C1917]">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
