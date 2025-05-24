export const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Obter dia, mês e ano e adicionar zeros à esquerda quando necessário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa do zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};