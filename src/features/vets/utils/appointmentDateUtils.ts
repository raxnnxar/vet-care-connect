
// Convert appointment_date from Json to string
export const getAppointmentDateString = (appointmentDate: any): string => {
  if (!appointmentDate) return new Date().toISOString();
  
  if (typeof appointmentDate === 'string') {
    return appointmentDate;
  }
  
  if (typeof appointmentDate === 'object' && appointmentDate !== null) {
    if (appointmentDate.date) {
      return appointmentDate.date;
    }
    if (appointmentDate.datetime) {
      return appointmentDate.datetime;
    }
  }
  
  return new Date().toISOString();
};
