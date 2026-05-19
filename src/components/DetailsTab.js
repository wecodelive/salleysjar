"use client";

import { useState } from "react";

export default function DetailsTab({ items = [], onNavigate, onUpdateCustomerName }) {
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    date: "",
    timeWindow: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update customer name when full name field changes
    if (name === "fullName" && onUpdateCustomerName) {
      onUpdateCustomerName(value);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = deliveryMode === "pickup" ? 0 : 1500;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-6 pb-8">
      {/* Delivery Mode */}
      <div>
        <h3 className="text-[#1C1917] font-[500] mb-4">Delivery details</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setDeliveryMode("delivery")}
            className={`flex-1 p-4 border-2 rounded transition-all text-sm ${deliveryMode === "delivery"
                ? "border-[#1C1917] bg-white"
                : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
              }`}
          >
            <div className="font-[500] text-[#1C1917]">Delivery</div>
            <div className="text-xs text-[#79716B] mt-1">We bring it to you</div>
          </button>
          <button
            onClick={() => setDeliveryMode("pickup")}
            className={`flex-1 p-4 border-2 rounded transition-all text-sm ${deliveryMode === "pickup"
                ? "border-[#1C1917] bg-white"
                : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
              }`}
          >
            <div className="font-[500] text-[#1C1917]">Pickup</div>
            <div className="text-xs text-[#79716B] mt-1">Collect at shop</div>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            FULL NAME
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
            placeholder="Your full name"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            PHONE
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
            placeholder="+234 800 000 0000"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            EMAIL (OPTIONAL)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
            placeholder="your@email.com"
          />
        </div>

        {/* Delivery Address */}
        {deliveryMode === "delivery" && (
          <>
            <div>
              <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                DELIVERY ADDRESS
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                placeholder="Enter your address"
              />
            </div>

            {/* City / Area */}
            <div>
              <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                CITY / AREA
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917]"
                placeholder="Your area"
              />
            </div>
          </>
        )}

        {/* Delivery Date */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            DELIVERY DATE
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        {/* Time Window */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            TIME WINDOW
          </label>
          <select
            name="timeWindow"
            value={formData.timeWindow}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          >
            <option value="">Select time window</option>
            <option value="morning">8am - 12pm</option>
            <option value="afternoon">12pm - 4pm</option>
            <option value="evening">4pm - 7pm</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
            NOTES (OPTIONAL)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#D6D3D1] rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none focus:border-[#1C1917] resize-none"
            placeholder="Any special instructions..."
            rows="3"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button onClick={() => onNavigate?.("payment")} className="w-full bg-[#1C1917] text-white py-4 font-[500] tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded">
        CONTINUE TO PAYMENT
      </button>

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
          {deliveryMode === "delivery" && (
            <div className="flex justify-between text-sm">
              <span className="text-[#79716B]">Delivery</span>
              <span className="text-[#1C1917]">₦{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-[500] pt-2 border-t border-[#E7E5E4]">
            <span className="text-[#1C1917]">Total</span>
            <span className="text-[#1C1917]">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
