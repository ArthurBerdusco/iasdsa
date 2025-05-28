import { parseISO } from 'date-fns';

export const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    try {
        // Parse direto da string ISO, ignora timezone
        const date = parseISO(dateString);
        
        // Pega só a parte da data em UTC e formata
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        return "";
    }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};