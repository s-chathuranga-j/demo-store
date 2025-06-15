const apiBase = process.env.API_BASE_URL || 'https://restcountries.com/v3.1';

export const apiEndpoints = {
  /**
   * Endpoint to get all independent countries.
   * @returns {string} The API endpoint URL for fetching all countries.
   */
  getAllCountries: `${apiBase}/independent?status=true`,
  /**
   * Endpoint to get a country by its name.
   * @param {string} countryName
   * @returns {string} The API endpoint URL for fetching a country by its name.
   */
  getCountryByName: (countryName: string) => `${apiBase}/name/${countryName}`,
  /**
   * Endpoint to get countries by language.
   * @param {string} language - The language to filter countries by.
   * @returns {string} The API endpoint URL for fetching countries by language.
   */
  getCountryByLanguage: (language: string) => `${apiBase}/lang/${language}`,
} as const;
