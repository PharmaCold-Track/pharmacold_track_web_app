export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
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
