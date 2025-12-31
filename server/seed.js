const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Parking = require('./models/Parking');

dotenv.config();

const parkingData = [
    // --- KADIKOY (Deep Coverage) ---
    { name: 'ISPARK Caferaga Spor Salonu', district: 'Kadikoy', neighborhood: 'Caferaga', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 160, coordinates: { latitude: 40.989, longitude: 29.023 } },
    { name: 'ISPARK Moda Sahil', district: 'Kadikoy', neighborhood: 'Moda', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 200, coordinates: { latitude: 40.983, longitude: 29.026 } },
    { name: 'ISPARK Rihtim Acik', district: 'Kadikoy', neighborhood: 'Rasimpasa', totalCapacity: 350, currentOccupancy: 0, pricePerHour: 170, coordinates: { latitude: 40.992, longitude: 29.022 } },
    { name: 'ISPARK Haldun Taner', district: 'Kadikoy', neighborhood: 'Caferaga', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 180, coordinates: { latitude: 40.991, longitude: 29.020 } },
    { name: 'ISPARK Ayrilik Cesmesi', district: 'Kadikoy', neighborhood: 'Rasimpasa', totalCapacity: 500, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 41.000, longitude: 29.030 } },
    { name: 'ISPARK Yeldegirmeni', district: 'Kadikoy', neighborhood: 'Rasimpasa', totalCapacity: 80, currentOccupancy: 0, pricePerHour: 165, coordinates: { latitude: 40.995, longitude: 29.025 } },
    { name: 'ISPARK Goztepe Parki', district: 'Kadikoy', neighborhood: 'Caddebostan', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 190, coordinates: { latitude: 40.975, longitude: 29.055 } },
    { name: 'ISPARK Bostanci Sahil', district: 'Kadikoy', neighborhood: 'Bostanci', totalCapacity: 400, currentOccupancy: 0, pricePerHour: 160, coordinates: { latitude: 40.952, longitude: 29.094 } },
    { name: 'ISPARK Kurbali Dere', district: 'Kadikoy', neighborhood: 'Hasanpasa', totalCapacity: 250, currentOccupancy: 0, pricePerHour: 155, coordinates: { latitude: 40.993, longitude: 29.035 } },
    { name: 'ISPARK Erenkoy Istasyon', district: 'Kadikoy', neighborhood: 'Erenkoy', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 185, coordinates: { latitude: 40.977, longitude: 29.070 } },
    { name: 'Kadikoy Merkez Acik Otopark', district: 'Kadikoy', neighborhood: 'Osmanağa', totalCapacity: 120, currentOccupancy: 0, pricePerHour: 195, coordinates: { latitude: 40.990, longitude: 29.028 } },
    { name: 'Bahariye Otopark', district: 'Kadikoy', neighborhood: 'Caferaga', totalCapacity: 60, currentOccupancy: 0, pricePerHour: 210, coordinates: { latitude: 40.988, longitude: 29.030 } },
    { name: 'Sogutlucesme Otopark', district: 'Kadikoy', neighborhood: 'Hasanpasa', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 40.995, longitude: 29.038 } },
    { name: 'Feneryolu Otopark', district: 'Kadikoy', neighborhood: 'Feneryolu', totalCapacity: 90, currentOccupancy: 0, pricePerHour: 175, coordinates: { latitude: 40.982, longitude: 29.045 } },
    { name: 'Bagdat Caddesi Park', district: 'Kadikoy', neighborhood: 'Suadiye', totalCapacity: 50, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 40.965, longitude: 29.080 } },

    // --- BESIKTAS (Deep Coverage) ---
    { name: 'ISPARK Besiktas Evlendirme', district: 'Besiktas', neighborhood: 'Sinanpasa', totalCapacity: 120, currentOccupancy: 0, pricePerHour: 190, coordinates: { latitude: 41.043, longitude: 29.004 } },
    { name: 'ISPARK Macka Parki', district: 'Besiktas', neighborhood: 'Visnezade', totalCapacity: 180, currentOccupancy: 0, pricePerHour: 220, coordinates: { latitude: 41.042, longitude: 28.995 } },
    { name: 'ISPARK Abbasaga', district: 'Besiktas', neighborhood: 'Cihannuma', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 180, coordinates: { latitude: 41.045, longitude: 29.003 } },
    { name: 'ISPARK Ortakoy Acik', district: 'Besiktas', neighborhood: 'Mecidiye', totalCapacity: 90, currentOccupancy: 0, pricePerHour: 240, coordinates: { latitude: 41.048, longitude: 29.025 } },
    { name: 'ISPARK Bebek Yokusu', district: 'Besiktas', neighborhood: 'Bebek', totalCapacity: 60, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 41.076, longitude: 29.040 } },
    { name: 'ISPARK Balmumcu', district: 'Besiktas', neighborhood: 'Balmumcu', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 170, coordinates: { latitude: 41.055, longitude: 29.010 } },
    { name: 'ISPARK Yildiz Parki', district: 'Besiktas', neighborhood: 'Yildiz', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 160, coordinates: { latitude: 41.049, longitude: 29.015 } },
    { name: 'ISPARK Dikilitas', district: 'Besiktas', neighborhood: 'Dikilitas', totalCapacity: 130, currentOccupancy: 0, pricePerHour: 165, coordinates: { latitude: 41.053, longitude: 29.002 } },
    { name: 'Besiktas Carsi Otopark', district: 'Besiktas', neighborhood: 'Carsi', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 230, coordinates: { latitude: 41.042, longitude: 29.007 } },
    { name: 'Validecesme Otopark', district: 'Besiktas', neighborhood: 'Visnezade', totalCapacity: 80, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 41.040, longitude: 28.998 } },
    { name: 'Etiler Acik Otopark', district: 'Besiktas', neighborhood: 'Etiler', totalCapacity: 140, currentOccupancy: 0, pricePerHour: 225, coordinates: { latitude: 41.080, longitude: 29.030 } },
    { name: 'Gayrettepe Otopark', district: 'Besiktas', neighborhood: 'Gayrettepe', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 185, coordinates: { latitude: 41.060, longitude: 29.005 } },
    { name: 'Levent Carsi Otopark', district: 'Besiktas', neighborhood: 'Levent', totalCapacity: 110, currentOccupancy: 0, pricePerHour: 215, coordinates: { latitude: 41.075, longitude: 29.015 } },

    // --- SISLI (Deep Coverage) ---
    { name: 'ISPARK Nisantasi Katli', district: 'Sisli', neighborhood: 'Tesvikiye', totalCapacity: 400, currentOccupancy: 0, pricePerHour: 245, coordinates: { latitude: 41.050, longitude: 28.995 } },
    { name: 'ISPARK Macka Demokrasi', district: 'Sisli', neighborhood: 'Harbiye', totalCapacity: 300, currentOccupancy: 0, pricePerHour: 210, coordinates: { latitude: 41.047, longitude: 28.992 } },
    { name: 'ISPARK Ferikoy Pazar', district: 'Sisli', neighborhood: 'Ferikoy', totalCapacity: 250, currentOccupancy: 0, pricePerHour: 160, coordinates: { latitude: 41.055, longitude: 28.980 } },
    { name: 'ISPARK Sisli Camii', district: 'Sisli', neighborhood: 'Merkez', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 200, coordinates: { latitude: 41.060, longitude: 28.990 } },
    { name: 'ISPARK Darulaceze Perpa', district: 'Sisli', neighborhood: 'Halil Rifat Pasa', totalCapacity: 500, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 41.065, longitude: 28.975 } },
    { name: 'Bomonti Otopark', district: 'Sisli', neighborhood: 'Bomonti', totalCapacity: 180, currentOccupancy: 0, pricePerHour: 215, coordinates: { latitude: 41.056, longitude: 28.981 } },
    { name: 'Pangalti Otopark', district: 'Sisli', neighborhood: 'Cumhuriyet', totalCapacity: 120, currentOccupancy: 0, pricePerHour: 195, coordinates: { latitude: 41.052, longitude: 28.985 } },
    { name: 'Mecidiyekoy Otopark', district: 'Sisli', neighborhood: 'Mecidiyekoy', totalCapacity: 220, currentOccupancy: 0, pricePerHour: 185, coordinates: { latitude: 41.066, longitude: 28.995 } },
    { name: 'Osmanbey Otopark', district: 'Sisli', neighborhood: 'Halaskargazi', totalCapacity: 90, currentOccupancy: 0, pricePerHour: 235, coordinates: { latitude: 41.054, longitude: 28.988 } },
    { name: 'Fulya Otopark', district: 'Sisli', neighborhood: 'Fulya', totalCapacity: 300, currentOccupancy: 0, pricePerHour: 175, coordinates: { latitude: 41.058, longitude: 29.000 } },
    { name: 'Kurtulus Son Durak Otopark', district: 'Sisli', neighborhood: 'Kurtulus', totalCapacity: 80, currentOccupancy: 0, pricePerHour: 155, coordinates: { latitude: 41.048, longitude: 28.980 } },
    { name: 'Esentepe Otopark', district: 'Sisli', neighborhood: 'Esentepe', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 190, coordinates: { latitude: 41.070, longitude: 29.010 } },

    // --- BEYOGLU (Deep Coverage) ---
    { name: 'ISPARK Tepebasi Katli', district: 'Beyoglu', neighborhood: 'Tepebasi', totalCapacity: 600, currentOccupancy: 0, pricePerHour: 210, coordinates: { latitude: 41.032, longitude: 28.974 } },
    { name: 'ISPARK Sishane Yeralti', district: 'Beyoglu', neighborhood: 'Sishane', totalCapacity: 800, currentOccupancy: 0, pricePerHour: 200, coordinates: { latitude: 41.028, longitude: 28.973 } },
    { name: 'ISPARK Karakoy Katli', district: 'Beyoglu', neighborhood: 'Karakoy', totalCapacity: 400, currentOccupancy: 0, pricePerHour: 230, coordinates: { latitude: 41.024, longitude: 28.978 } },
    { name: 'ISPARK Galata Kulesi', district: 'Beyoglu', neighborhood: 'Bereketzade', totalCapacity: 50, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 41.025, longitude: 28.974 } },
    { name: 'Taksim Acik Otopark', district: 'Beyoglu', neighborhood: 'Taksim', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 240, coordinates: { latitude: 41.037, longitude: 28.985 } },
    { name: 'Cihangir Otopark', district: 'Beyoglu', neighborhood: 'Cihangir', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 220, coordinates: { latitude: 41.031, longitude: 28.983 } },
    { name: 'Kabatas Otopark', district: 'Beyoglu', neighborhood: 'Kabatas', totalCapacity: 100, currentOccupancy: 0, pricePerHour: 180, coordinates: { latitude: 41.033, longitude: 28.992 } },
    { name: 'Talimhane Otopark', district: 'Beyoglu', neighborhood: 'Taksim', totalCapacity: 180, currentOccupancy: 0, pricePerHour: 215, coordinates: { latitude: 41.040, longitude: 28.983 } },
    { name: 'Dolapdere Otopark', district: 'Beyoglu', neighborhood: 'Dolapdere', totalCapacity: 250, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 41.042, longitude: 28.975 } },

    // --- USKUDAR (Deep Coverage) ---
    { name: 'ISPARK Uskudar Sahil', district: 'Uskudar', neighborhood: 'Mimar Sinan', totalCapacity: 300, currentOccupancy: 0, pricePerHour: 175, coordinates: { latitude: 41.026, longitude: 29.016 } },
    { name: 'ISPARK Harem', district: 'Uskudar', neighborhood: 'Salacak', totalCapacity: 400, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 41.015, longitude: 29.010 } },
    { name: 'ISPARK Altunizade', district: 'Uskudar', neighborhood: 'Altunizade', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 180, coordinates: { latitude: 41.022, longitude: 29.038 } },
    { name: 'Uskudar Merkez Otopark', district: 'Uskudar', neighborhood: 'Ahmediye', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 190, coordinates: { latitude: 41.025, longitude: 29.020 } },
    { name: 'Kuzguncuk Otopark', district: 'Uskudar', neighborhood: 'Kuzguncuk', totalCapacity: 60, currentOccupancy: 0, pricePerHour: 165, coordinates: { latitude: 41.036, longitude: 29.029 } },
    { name: 'Beylerbeyi Otopark', district: 'Uskudar', neighborhood: 'Beylerbeyi', totalCapacity: 90, currentOccupancy: 0, pricePerHour: 200, coordinates: { latitude: 41.044, longitude: 29.043 } },

    // --- FATIH & OTHERS ---
    { name: 'ISPARK Sultanahmet', district: 'Fatih', neighborhood: 'Sultanahmet', totalCapacity: 150, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 41.006, longitude: 28.976 } },
    { name: 'ISPARK Eminonu', district: 'Fatih', neighborhood: 'Eminonu', totalCapacity: 250, currentOccupancy: 0, pricePerHour: 230, coordinates: { latitude: 41.018, longitude: 28.973 } },
    { name: 'ISPARK Yenikapi Miting', district: 'Fatih', neighborhood: 'Yenikapi', totalCapacity: 2000, currentOccupancy: 0, pricePerHour: 150, coordinates: { latitude: 41.003, longitude: 28.955 } },
    { name: 'ISPARK Balat', district: 'Fatih', neighborhood: 'Balat', totalCapacity: 300, currentOccupancy: 0, pricePerHour: 160, coordinates: { latitude: 41.032, longitude: 28.948 } },
    { name: 'ISPARK Emirgan Korusu', district: 'Sariyer', neighborhood: 'Emirgan', totalCapacity: 200, currentOccupancy: 0, pricePerHour: 210, coordinates: { latitude: 41.107, longitude: 29.053 } },
    { name: 'ISPARK Tarabya', district: 'Sariyer', neighborhood: 'Tarabya', totalCapacity: 180, currentOccupancy: 0, pricePerHour: 220, coordinates: { latitude: 41.140, longitude: 29.057 } },
    { name: 'Bebek Sahil Otopark', district: 'Besiktas', neighborhood: 'Bebek', totalCapacity: 50, currentOccupancy: 0, pricePerHour: 250, coordinates: { latitude: 41.075, longitude: 29.044 } }
];

const Reservation = require('./models/Reservation');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        await Promise.all([
            Parking.deleteMany({}),
            Reservation.deleteMany({})
        ]);
        console.log('Cleared Parking and Reservation collections');

        // Apply realistic random occupancy
        const updatedData = parkingData.map((p, index) => {
            let occupancyRate;

            // Make a few specific ones FULL or nearly FULL
            if (index === 1 || index === 5) { // e.g. Moda Sahil, Yeldegirmeni
                occupancyRate = 1.0; // Full
            } else if (index === 2) {
                occupancyRate = 0.95; // Very busy
            } else {
                // Random between 0% and 80% for others
                occupancyRate = Math.random() * 0.8;
            }

            const currentOccupancy = Math.floor(p.totalCapacity * occupancyRate);

            return {
                ...p,
                currentOccupancy
            };
        });

        // Insert new data
        await Parking.insertMany(updatedData);
        console.log(`Successfully seeded ${updatedData.length} ISPARK and Independent parking lots with realistic occupancy!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
