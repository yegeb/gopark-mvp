export const calculateParkingFee = (basePrice: number, durationHours: number): number => {
    // Pricing Multipliers based on standard ISPARK-like curve
    // 0-1 Hour: Base Price
    // 1-2 Hours: ~1.2x Base
    // 2-4 Hours: ~1.5x Base
    // 4-8 Hours: ~1.8x Base
    // 8-12 Hours: ~2.3x Base
    // 12-24 Hours: ~3.3x Base

    if (durationHours <= 0) return 0;
    if (durationHours <= 1) return basePrice;
    if (durationHours <= 2) return Math.ceil(basePrice * 1.2);
    if (durationHours <= 4) return Math.ceil(basePrice * 1.5);
    if (durationHours <= 8) return Math.ceil(basePrice * 1.8);
    if (durationHours <= 12) return Math.ceil(basePrice * 2.3);
    return Math.ceil(basePrice * 3.3 * Math.ceil(durationHours / 24)); // Scale for multiple days
};

export const getPricingTiers = (basePrice: number) => {
    return [
        { duration: '0-1 Hour', price: basePrice },
        { duration: '1-2 Hour', price: Math.ceil(basePrice * 1.2) },
        { duration: '2-4 Hour', price: Math.ceil(basePrice * 1.5) },
        { duration: '4-8 Hour', price: Math.ceil(basePrice * 1.8) },
        { duration: '8-12 Hour', price: Math.ceil(basePrice * 2.3) },
        { duration: 'Full Day', price: Math.ceil(basePrice * 3.3) },
    ];
};
