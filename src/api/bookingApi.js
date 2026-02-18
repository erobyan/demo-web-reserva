const GET_AVAILABILITY_URL = "https://getreservationavailability-jom4xg72oa-uc.a.run.app";
const MAKE_RESERVATION_URL = "https://makereservation-jom4xg72oa-uc.a.run.app";
const GET_RESERVATION_METADATA_URL = "https://getreservationmetadata-jom4xg72oa-uc.a.run.app";
export const CAPACITY_ORG_ID = "KbCF4LQ52X9JQ2tUvcrC";


export const getAvailability = async (date, people) => {
  console.log(`[API] Checking availability for ${date} with ${people} people...`);

  try {
    const params = new URLSearchParams({
      orgId: CAPACITY_ORG_ID,
      date: date,
      people: people.toString(),
    });

    const response = await fetch(GET_AVAILABILITY_URL + "?" + params.toString());

    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    console.log("Availability response:", data);
    return data;
  } catch (error) {
    console.error("API failed", error);
    throw error;
  }
};

export const getReservationMetadata = async () => {
  try {
    const params = new URLSearchParams({
      orgId: CAPACITY_ORG_ID
    });
    const response = await fetch(GET_RESERVATION_METADATA_URL + "?" + params.toString());
    if (!response.ok) throw new Error("API Error");
    return await response.json();
  } catch (error) {
    console.error("Metadata API failed", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  console.log("[API] Creating booking with payload:", bookingData);

  try {
    // Ensure orgId is included
    const payload = {
      ...bookingData,
      orgId: CAPACITY_ORG_ID,
    };

    const response = await fetch(MAKE_RESERVATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API Error");
    return await response.json();
  } catch (error) {
    console.error("API failed", error);
    throw error;
  }
};