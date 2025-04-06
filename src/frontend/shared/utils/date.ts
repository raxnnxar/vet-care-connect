
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options);
};

export const getDayName = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
