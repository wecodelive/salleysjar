// Seller's location and delivery pricing configuration
export const deliveryConfig = {
    // Seller's address - used for distance calculation
    sellerAddress: "G99R+QVP, Dan Fodio Boulevard, Akoka, Lagos 101245, Lagos",

    // Approximate coordinates for Akoka, Lagos (backup for fallback)
    sellerCoordinates: {
        latitude: 6.5244,
        longitude: 3.3857,
    },

    // Pricing: base fee + per-km rate
    baseFee: 800,
    perKmRate: 100,

    // Delivery constraints
    maxDeliveryRadius: 50, // km - max distance we deliver
    serviceArea: "Lagos", // Delivery restricted to Lagos

    // OSRM API endpoint (free, open-source)
    osrmApi: "https://router.project-osrm.org/route/v1/driving",
};

/**
 * Calculate delivery fee based on distance
 * @param {number} distanceInKm - Distance in kilometers
 * @returns {number} Delivery fee in Naira
 */
export const calculateDeliveryFee = (distanceInKm) => {
    if (!distanceInKm) return deliveryConfig.baseFee;

    const fee = deliveryConfig.baseFee + (distanceInKm * deliveryConfig.perKmRate);
    return Math.round(fee);
};

/**
 * Check if delivery location is within service area
 * @param {number} distanceInKm - Distance in kilometers
 * @returns {boolean} Whether delivery is possible
 */
export const isDeliveryPossible = (distanceInKm) => {
    return distanceInKm && distanceInKm <= deliveryConfig.maxDeliveryRadius;
};
