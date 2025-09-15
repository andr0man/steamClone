export const formatDateForInput = (dateStr) => {
    if (!dateStr) return new Date().toISOString().slice(0, 16);
    const date = new Date(dateStr);
    // Get local ISO string without seconds/milliseconds
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  };