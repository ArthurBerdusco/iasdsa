import { toZonedTime, format } from 'date-fns-tz';

export const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    // Pega o timezone do usuário automaticamente
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Se não for do Brasil, força para São Paulo
    const brazilTimeZone = timeZone.includes('America/') ? timeZone : 'America/Sao_Paulo';
    
    const date = toZonedTime(dateString, brazilTimeZone);
    
    return format(date, 'dd/MM/yyyy', { timeZone: brazilTimeZone });
};


// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};