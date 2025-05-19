//date to YYYY-MM-DD format
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get the number of days in a month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get the day of the week
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};

// Get month number from date
export const getMonth = (date) => {
  return date.getMonth();
};

// Get year from date
export const getYear = (date) => {
  return date.getFullYear();
};


export const getDayOfWeek = (date) => {
  return date.getDay();
};

export const getDayOfWeekName = (day) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[day];
};

export const isToday = (dateString) => {
  const today = formatDate(new Date());
  return dateString === today;
};

// Extract hour from datetime string
export const getHourFromDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.getHours();
};

// Get time of day based on hour (morning, afternoon, evening, night)
export const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 22) return 'Evening';
  return 'Night';
};

// Calculate the date X days ago
export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

export const formatDateToHuman = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDayOfMonth = (date) => {
  return date.getDate();
};

export const isSameDay = (dateA, dateB) => {
  return formatDate(new Date(dateA)) === formatDate(new Date(dateB));
};

export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getCurrentWeekDates = () => {
  const now = new Date();
  const currentDay = now.getDay(); 
  const diff = now.getDate() - currentDay;
  
  const startDate = new Date(now);
  startDate.setDate(diff);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
};


export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};


export const getRelativeTimeDescription = (dateTimeString) => {
  const now = new Date();
  const date = new Date(dateTimeString);
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  
  return formatDateToHuman(dateTimeString);
};