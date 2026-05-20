/**
 * Form Validation Utility
 * Validates various form types used in the checkout flow
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    // Accept various phone formats
    const phoneRegex = /^(\+?234|0)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
};

export const validateDeliveryDetails = (formData, deliveryMode) => {
    const errors = {};

    // Full Name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.fullName = "Full name is required (minimum 2 characters)";
    }

    // Phone
    if (!formData.phone || formData.phone.trim().length === 0) {
        errors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
        errors.phone = "Enter a valid Nigerian phone number (+234 or 0)";
    }

    // Email (optional but validate if provided)
    if (formData.email && formData.email.trim().length > 0) {
        if (!validateEmail(formData.email)) {
            errors.email = "Enter a valid email address";
        }
    }

    // Delivery-specific validations
    if (deliveryMode === "delivery") {
        if (!formData.address || formData.address.trim().length < 5) {
            errors.address = "Delivery address is required (minimum 5 characters)";
        }

        if (!formData.city || formData.city.trim().length < 2) {
            errors.city = "City/Area is required";
        }
    }

    // Delivery Date (required)
    if (!formData.date || formData.date.trim().length === 0) {
        errors.date = "Delivery date is required";
    }

    // Validate date is not in the past
    if (formData.date) {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errors.date = "Delivery date cannot be in the past";
        }
    }

    // Time Window (required)
    if (!formData.timeWindow || formData.timeWindow.trim().length === 0) {
        errors.timeWindow = "Time window is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validatePaymentDetails = (customerDetails, paymentMethod) => {
    const errors = {};

    // Ensure customer details are complete
    if (!customerDetails.fullName || customerDetails.fullName.trim().length === 0) {
        errors.customer = "Please complete your delivery details first";
        return { isValid: false, errors };
    }

    if (!customerDetails.phone || customerDetails.phone.trim().length === 0) {
        errors.customer = "Please complete your delivery details first";
        return { isValid: false, errors };
    }

    // Payment method specific validation
    if (paymentMethod === "card") {
        errors.payment = "Card payment is coming soon";
        return { isValid: false, errors };
    }

    if (paymentMethod === "transfer") {
        // Bank transfer is valid - just requires confirmation
    }

    if (paymentMethod === "cash") {
        // Cash on delivery is valid
    }

    if (!paymentMethod || paymentMethod.trim().length === 0) {
        errors.paymentMethod = "Please select a payment method";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateBasketDetails = (items, subtotal, minOrder) => {
    const errors = {};

    // Only validate that basket is not empty
    // Minimum order is checked at payment/submission time, not at basket navigation
    if (!items || items.length === 0) {
        errors.basket = "Your basket is empty";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
