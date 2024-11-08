const capitalizeFirstLetter = (str) => {
    if (!str) return ''; // Handle empty string or null
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
  
export default capitalizeFirstLetter;
  