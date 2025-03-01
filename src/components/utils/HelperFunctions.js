export function extractSeatNumber(seatString) {
  const parts = seatString.split("-");
  return parts[1];
}

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getCityShortForm(cityName) {
  const cityShortForms = {
    Lahore: "LHR",
    Islamabad: "ISB",
    Karachi: "KHI",
    Faisalabad: "FSD",
    Multan: "MUX",
    Peshawar: "PEW",
    Quetta: "UET",
    Rawalpindi: "RWP",
    Sialkot: "SKT",
    Abbottabad: "ATD",
    Bahawalpur: "BWP",
    Sargodha: "SGD",
    Sukkur: "SKR",
    Hyderabad: "HDD",
    Jhelum: "JLM",
    Gujranwala: "GWL",
    Gujrat: "GRT",
    Mirpur: "MPR",
    Muzaffarabad: "MZD",
    Mardan: "MDN",
    Chitral: "CTR",
    Chiniot: "CHT",
    "Dera Ghazi Khan": "DGK",
    "Dera Ismail Khan": "DIK",
    Khushab: "KSB",
    Kohat: "KHT",
    Mansehra: "MNS",
    Mingora: "MNG",
    Nawabshah: "NWS",
    Okara: "OKR",
    Pakpattan: "PPT",
    "Rahim Yar Khan": "RYK",
    Sahiwal: "SWL",
    Sheikhupura: "SKP",
    Swat: "SWT",
    "Toba Tek Singh": "TTS",
    Vehari: "VHR",
    Attock: "ATK",
    Chakwal: "CKW",
    Jhang: "JHG",
    Kasur: "KSR",
    Larkana: "LRK",
    Thatta: "THT",
    Ziarat: "ZRT",
    Gilgit: "GLT",
    Skardu: "SKD",
    Turbat: "TBT",
    Gwadar: "GWD",
    Hangu: "HNG",
    Haripur: "HRP",
  };

  return cityShortForms[cityName] || cityName;
}

export function getDayShortName(dateString) {
  const date = new Date(dateString);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[date.getUTCDay()];
}

export function formatDateToDayMonth(date) {
  // Convert input to a Date object if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj)) {
    throw new Error("Invalid date provided");
  }

  // Extract the day and month
  const day = dateObj.getDate();
  const monthShort = dateObj.toLocaleString("en-US", { month: "short" });

  // Determine ordinal suffix for the day
  const suffix = ["th", "st", "nd", "rd"];
  const value = day % 100;
  const ordinal = suffix[(value - 20) % 10] || suffix[value] || suffix[0];

  // Return formatted string
  return `${day}${ordinal} ${monthShort}`;
}

export function formatTime(inputTime) {
  // If input is in "HH:mm" string format
  if (typeof inputTime === "string" && /^\d{2}:\d{2}$/.test(inputTime)) {
    const [hours, minutes] = inputTime.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  // For other formats (e.g., ISO string, timestamp)
  const date = new Date(inputTime);
  if (isNaN(date)) {
    throw new Error("Invalid input time format.");
  }

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function calcDuration(departure, arrival) {
  const parseTime = (time) => {
    if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0); // Set hours and minutes in a date object
      return date;
    }
    const date = new Date(time);
    if (isNaN(date)) {
      throw new Error("Invalid time format.");
    }
    return date;
  };

  try {
    const depTime = parseTime(departure);
    const arrTime = parseTime(arrival);

    const durationInMs = arrTime - depTime;
    if (durationInMs < 0) {
      throw new Error("Arrival time must be after departure time.");
    }

    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hours ${minutes} minutes`;
  } catch (error) {
    return error.message;
  }
}

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const roundedDistance = Math.ceil(distance);
  console.log(`Rounded distance (meters): ${roundedDistance}`);
  return roundedDistance;
};
