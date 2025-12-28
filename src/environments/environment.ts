export const environment = {
  production: false,
  apiUrl: 'https://pharmacold-api.onrender.com/api/v1',
  googleMaps: {
    apiKey: 'AIzaSyBFdmIEB3BCnjPpk9TDfpqhJVrSLolMRCw',
    version: 'weekly',
    libraries: ['places', 'marker'] as const,
    mapIds: {
      depot: '',
      disposal: ''
    }
  },
};
