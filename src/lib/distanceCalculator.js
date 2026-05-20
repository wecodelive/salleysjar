import { deliveryConfig, calculateDeliveryFee, isDeliveryPossible } from "@/config/delivery";

/**
 * Convert address to coordinates using Nominatim (free geocoding service)
 * @param {string} address - Full address string
 * @returns {Promise<{latitude: number, longitude: number}|null>}
 */
export const geocodeAddress = async (address) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

/**
 * Calculate distance between seller and delivery address using OSRM
 * @param {string} deliveryAddress - Customer's delivery address
 * @returns {Promise<{distance: number, fee: number, error: string|null}>}
 */
export const calculateDistanceAndFee = async (deliveryAddress) => {
    try {
        if (!deliveryAddress || deliveryAddress.trim().length < 5) {
            return { distance: null, fee: null, error: "Please enter a valid address" };
        }

        // Geocode the delivery address
        const customerCoordinates = await geocodeAddress(deliveryAddress);
        if (!customerCoordinates) {
            return { distance: null, fee: null, error: "Address not found. Please check and try again." };
        }

        // Build OSRM request URL
        const sellerLat = deliveryConfig.sellerCoordinates.latitude;
        const sellerLng = deliveryConfig.sellerCoordinates.longitude;
        const customerLat = customerCoordinates.latitude;
        const customerLng = customerCoordinates.longitude;

        const osrmUrl = `${deliveryConfig.osrmApi}/${sellerLng},${sellerLat};${customerLng},${customerLat}?overview=false`;

        // Call OSRM API to get actual route distance
        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            return { distance: null, fee: null, error: "Unable to calculate route. Address may be unreachable." };
        }

        // Distance is in meters, convert to km
        const distanceInKm = data.routes[0].distance / 1000;

        // Check if within delivery radius
        if (!isDeliveryPossible(distanceInKm)) {
            return {
                distance: distanceInKm,
                fee: null,
                error: `Sorry, we only deliver within ${deliveryConfig.maxDeliveryRadius}km. Your location is ${distanceInKm.toFixed(1)}km away.`,
            };
        }

        const fee = calculateDeliveryFee(distanceInKm);

        return {
            distance: parseFloat(distanceInKm.toFixed(1)),
            fee,
            error: null,
        };
    } catch (error) {
        console.error("Distance calculation error:", error);
        return {
            distance: null,
            fee: null,
            error: "Error calculating delivery fee. Please try again.",
        };
    }
};
