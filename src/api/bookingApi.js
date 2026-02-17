const MOCK_DELAY = 800; // ms to simulate network latency

// Mock Data
const MOCK_HOURS_LUNCH = ["13:00", "13:30", "14:00", "14:30", "15:00"];
const MOCK_HOURS_DINNER = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL;
};

export const getAvailability = async (date, people) => {
  const baseUrl = getBaseUrl();
  console.log(`[API] Checking availability for ${date} with ${people} people...`);

  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/availability?date=${date}&people=${people}`);
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.warn("API failed, falling back to mock data", error);
    }
  }

  // Fallback / Mock
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate random availability
      resolve({
        lunch: MOCK_HOURS_LUNCH.filter(() => Math.random() > 0.2),
        dinner: MOCK_HOURS_DINNER.filter(() => Math.random() > 0.2),
      });
    }, MOCK_DELAY);
  });
};

export const createBooking = async (payload) => {
  const baseUrl = getBaseUrl();
  console.log("[API] Creating booking with payload:", payload);

  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.warn("API failed, falling back to mock data", error);
    }
  }

  // Fallback / Mock
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        bookingId: "CONF-" + Math.floor(Math.random() * 10000),
        message: "Reserva creada correctamente (MOCK)",
      });
    }, MOCK_DELAY);
  });
};
