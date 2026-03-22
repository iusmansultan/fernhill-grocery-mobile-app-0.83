type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface TimeRange {
  open: { hour: number; minute: number };
  close: { hour: number; minute: number };
}

interface StoreHoursConfig {
  store: Record<DayOfWeek, TimeRange>;
  delivery: Record<DayOfWeek, TimeRange>;
}

const STORE_HOURS: StoreHoursConfig = {
  store: {
    0: { open: { hour: 8, minute: 0 }, close: { hour: 17, minute: 0 } },   // Sunday
    1: { open: { hour: 5, minute: 30 }, close: { hour: 19, minute: 0 } },  // Monday
    2: { open: { hour: 5, minute: 30 }, close: { hour: 19, minute: 0 } },  // Tuesday
    3: { open: { hour: 5, minute: 30 }, close: { hour: 19, minute: 0 } },  // Wednesday
    4: { open: { hour: 5, minute: 30 }, close: { hour: 19, minute: 0 } },  // Thursday
    5: { open: { hour: 5, minute: 30 }, close: { hour: 19, minute: 0 } },  // Friday
    6: { open: { hour: 6, minute: 30 }, close: { hour: 19, minute: 0 } },  // Saturday
  },
  delivery: {
    0: { open: { hour: 9, minute: 0 }, close: { hour: 16, minute: 0 } },   // Sunday
    1: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Monday
    2: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Tuesday
    3: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Wednesday
    4: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Thursday
    5: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Friday
    6: { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } },   // Saturday
  },
};

const STORE_INFO = {
  phone: "0141 634 0101",
  storeHoursText: {
    weekday: "Mon-Fri: 5:30 AM - 7 PM",
    saturday: "Sat: 6:30 AM - 7 PM",
    sunday: "Sun: 8 AM - 5 PM",
  },
  deliveryHoursText: {
    weekday: "Monday-Saturday: 9 AM - 6 PM",
    sunday: "Sunday: 9 AM - 4 PM",
  },
};

export const isStoreOpen = (date: Date = new Date()): boolean => {
  const day = date.getDay() as DayOfWeek;
  const hours = STORE_HOURS.store[day];
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const openMinutes = hours.open.hour * 60 + hours.open.minute;
  const closeMinutes = hours.close.hour * 60 + hours.close.minute;
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

export const isDeliveryAvailable = (date: Date = new Date()): boolean => {
  const day = date.getDay() as DayOfWeek;
  const hours = STORE_HOURS.delivery[day];
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const openMinutes = hours.open.hour * 60 + hours.open.minute;
  const closeMinutes = hours.close.hour * 60 + hours.close.minute;
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

export const getStoreInfo = () => STORE_INFO;

export default {
  isStoreOpen,
  isDeliveryAvailable,
  getStoreInfo,
  STORE_HOURS,
  STORE_INFO,
};
