import { parseISO } from 'date-fns';

export const formatDateForDisplay = (dateInput: string | Date) => {
    if (!dateInput) return "";
    
    try {
        const dateString = dateInput instanceof Date 
            ? dateInput.toISOString() 
            : String(dateInput);
        
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        
        if (!year || !month || !day) return "";
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error, dateInput);
        return "";
    }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateInput: string | Date) => {
    if (!dateInput) return "";
    
    const dateString = dateInput instanceof Date 
        ? dateInput.toISOString() 
        : String(dateInput);
    
    const date = parseISO(dateString);
    return date.toISOString().split('T')[0];
};