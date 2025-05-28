import { toZonedTime, format } from 'date-fns-tz';

export const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";

    const timeZone = 'America/Sao_Paulo';
    const date = toZonedTime(dateString, timeZone); // substitui utcToZonedTime

    return format(date, 'dd/MM/yyyy', { timeZone });
};



// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};