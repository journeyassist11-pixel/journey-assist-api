const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Headers allow karte hain taaki aapki website is API ko call kar sake
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { departure, arrival, date } = req.query;

  if (!departure || !arrival || !date) {
    return res.status(400).json({ error: 'departure, arrival, and date are required' });
  }

  const apiKey = process.env.SERPAPI_KEY;

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_flights',
        departure_id: departure, // e.g. DEL
        arrival_id: arrival,     // e.g. DXB
        outbound_date: date,     // e.g. 2026-11-15
        currency: 'INR',
        hl: 'en',
        api_key: apiKey
      }
    });

    const bestFlights = response.data.best_flights || [];
    const otherFlights = response.data.other_flights || [];

    res.status(200).json({
      success: true,
      flights: [...bestFlights, ...otherFlights]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message
    });
  }
};