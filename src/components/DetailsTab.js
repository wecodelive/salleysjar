"use client";

import { useState, useEffect } from "react";
import { calculateDistanceAndFee } from "@/lib/distanceCalculator";
import { validateDeliveryDetails } from "@/lib/formValidator";
import AddressAutocomplete from "./AddressAutocomplete";
import { AlertCircle } from "lucide-react";

export default function DetailsTab({ items = [], onNavigate, onUpdateCustomerName, onUpdateDeliveryFee, onUpdateCustomerDetails }) {
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

  const [deliveryFee, setDeliveryFee] = useState(250);
  const [distance, setDistance] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [distanceError, setDistanceError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [lastCustomerDetailsUpdate, setLastCustomerDetailsUpdate] = useState(null);

  // Notify parent of customer details changes (only when data actually changes)
  useEffect(() => {
    if (onUpdateCustomerDetails) {
      const customerData = {
        ...formData,
        deliveryMode,
      };
      // Only call callback if data actually changed
      const dataString = JSON.stringify(customerData);
      if (dataString !== lastCustomerDetailsUpdate) {
        setLastCustomerDetailsUpdate(dataString);
        onUpdateCustomerDetails(customerData);
      }
    }
  }, [formData, deliveryMode]);

  // Calculate delivery fee when address or city changes
  useEffect(() => {
    const calculateFee = async () => {
      if (deliveryMode === "pickup" || !formData.address || !formData.city) {
        setDeliveryFee(250); // Reset to base fee
        setDistance(null);
        setDistanceError(null);
        return;
      }

      setCalculating(true);
      setDistanceError(null);

      // Combine address and city for better geocoding
      const fullAddress = `${formData.address}, ${formData.city}, Lagos`;
      const result = await calculateDistanceAndFee(fullAddress);

      if (result.error) {
        setDistanceError(result.error);
        setDeliveryFee(250); // Reset to base fee on error
        setDistance(null);
      } else {
        setDeliveryFee(result.fee);
        setDistance(result.distance);
        setDistanceError(null);
      }

      setCalculating(false);
    };

    const debounceTimer = setTimeout(calculateFee, 800); // Debounce API calls
    return () => clearTimeout(debounceTimer);
  }, [formData.address, formData.city, deliveryMode]);

  // Notify parent of delivery fee changes
  useEffect(() => {
    if (onUpdateDeliveryFee) {
      if (deliveryMode === "pickup") {
        onUpdateDeliveryFee(0);
      } else {
        onUpdateDeliveryFee(deliveryFee || 250);
      }
    }
  }, [deliveryFee, deliveryMode, onUpdateDeliveryFee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Update customer name when full name field changes
    if (name === "fullName" && onUpdateCustomerName) {
      onUpdateCustomerName(value);
    }
  };

  const handleContinueToPayment = () => {
    const validation = validateDeliveryDetails(formData, deliveryMode);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('[name="' + Object.keys(validation.errors)[0] + '"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setValidationErrors({});
    onNavigate?.("payment");
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const finalDeliveryFee = deliveryMode === "pickup" ? 0 : (deliveryFee || 250); // Use calculated fee or default base fee
  const total = subtotal + finalDeliveryFee;

  return (
    <>
      {/* Delivery Mode - Full Width */}
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-[#1C1917] font-medium mb-4">Delivery details</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setDeliveryMode("delivery")}
              className={`flex-1 p-4 border-2 rounded transition-all text-sm ${deliveryMode === "delivery"
                ? "border-[#1C1917] bg-white"
                : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
                }`}
            >
              <div className="font-medium text-[#1C1917]">Delivery</div>
              <div className="text-xs text-[#79716B] mt-1">We bring it to you</div>
            </button>
            <button
              onClick={() => setDeliveryMode("pickup")}
              className={`flex-1 p-4 border-2 rounded transition-all text-sm ${deliveryMode === "pickup"
                ? "border-[#1C1917] bg-white"
                : "border-[#D6D3D1] bg-white hover:border-[#1C1917]"
                }`}
            >
              <div className="font-medium text-[#1C1917]">Pickup</div>
              <div className="text-xs text-[#79716B] mt-1">Collect at shop</div>
            </button>
          </div>
        </div>
      </div>

      {/* Form and Summary Layout - Side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Form Fields */}
        <div className="lg:col-span-2">
          {/* Validation Errors Summary */}
          {/* {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.values(validationErrors).map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )} */}

          <div className="space-y-4">
            {/* Row 1: Full Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none transition-colors ${validationErrors.fullName ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                    }`}
                  placeholder="Your full name"
                />
                {validationErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>
                )}
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
                  className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none transition-colors ${validationErrors.phone ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                    }`}
                  placeholder="+234 800 000 0000"
                />
                {validationErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
                )}
              </div>
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
                className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none transition-colors ${validationErrors.email ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                  }`}
                placeholder="your@email.com"
              />
              {validationErrors.email && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Delivery Address */}
            {deliveryMode === "delivery" && (
              <>
                <div>
                  <label className="block text-xs text-[#79716B] tracking-[1.6px] mb-2">
                    DELIVERY ADDRESS
                  </label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={handleInputChange}
                    hasError={!!validationErrors.address}
                    placeholder="Enter your address"
                  />
                  {validationErrors.address && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.address}</p>
                  )}
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
                    className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none transition-colors ${validationErrors.city ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                      }`}
                    placeholder="Your area"
                  />
                  {validationErrors.city && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.city}</p>
                  )}
                </div>

                {/* Distance & Delivery Fee Indicator */}
                {calculating && (
                  <div className="bg-[#F5F5F5] border border-[#D6D3D1] rounded p-3">
                    <p className="text-xs text-[#79716B] animate-pulse">Calculating delivery fee...</p>
                  </div>
                )}

                {distanceError && (
                  <div className="bg-[#FEF3E2] border border-[#F59E0B] rounded p-3">
                    <p className="text-xs text-[#D97706]">{distanceError}</p>
                  </div>
                )}

                {distance && !distanceError && deliveryFee && (
                  <div className="bg-[#F5F5F5] border border-[#D6D3D1] rounded p-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#79716B]">Distance:</span>
                      <span className="text-sm font-medium text-[#1C1917]">{distance} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#79716B]">Delivery fee:</span>
                      <span className="text-sm font-medium text-[#1C1917]">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Row 2: Delivery Date & Time Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] focus:outline-none transition-colors ${validationErrors.date ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                    }`}
                />
                {validationErrors.date && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.date}</p>
                )}
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
                  className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] focus:outline-none transition-colors ${validationErrors.timeWindow ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                    }`}
                >
                  <option value="">Select time window</option>
                  <option value="morning">8am - 12pm</option>
                  <option value="afternoon">12pm - 4pm</option>
                  <option value="evening">4pm - 7pm</option>
                </select>
                {validationErrors.timeWindow && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.timeWindow}</p>
                )}
              </div>
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

          {/* Continue Button - Hidden on Desktop */}
          <button onClick={handleContinueToPayment} className="w-full lg:hidden bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded mt-8 text-sm md:text-base">
            CONTINUE TO PAYMENT
          </button>
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
              {deliveryMode === "delivery" && (
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-[#79716B]">Delivery</span>
                  <span className="text-[#1C1917]">₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base md:text-lg font-medium pt-3 border-t border-[#E7E5E4] mt-4">
                <span className="text-[#1C1917]">Total</span>
                <span className="text-[#1C1917]">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Continue Button - Shown on Desktop */}
            <button onClick={handleContinueToPayment} className="hidden lg:block w-full bg-[#1C1917] text-white py-3 md:py-4 font-medium tracking-[1.6px] hover:bg-[#2D2824] transition-colors rounded mt-8 text-sm md:text-base">
              CONTINUE TO PAYMENT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
