const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract day, month, year, hours, and minutes
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
}

// Example usage
const formattedDate = formatDate("2024-08-22T12:03:41.000000Z");

export default formatDate;