import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body to get location coordinates
    let location = { lat: 51.5074, lon: -0.1278 }; // Default to London
    
    try {
      const body = await req.text();
      if (body) {
        const parsedBody = JSON.parse(body);
        if (parsedBody.lat && parsedBody.lon) {
          location = parsedBody;
        }
      }
    } catch (parseError) {
      // Use default location if parsing fails
      console.info('Using default location due to parsing error:', parseError.message);
    }

    // Get API key from secrets
    const apiKey = await apper.getSecret('OPENWEATHER_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Weather service configuration error. Please contact support.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenWeatherMap API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;
    
    const weatherResponse = await fetch(weatherUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('Weather API Error:', errorText);
      
      if (weatherResponse.status === 401) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Weather service authentication failed. Please contact support.'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (weatherResponse.status === 404) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Location not found. Please try again or enable location services.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Weather service temporarily unavailable. Please try again later.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const weatherData = await weatherResponse.json();

    // Validate response structure
    if (!weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid weather data received. Please try again.'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format weather data for response
    const formattedWeather = {
      location: weatherData.name || 'Unknown Location',
      country: weatherData.sys?.country || 'Unknown',
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: weatherData.wind?.speed || 0,
      windDirection: weatherData.wind?.deg || 0,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null,
      cloudiness: weatherData.clouds?.all || 0,
      sunrise: weatherData.sys?.sunrise ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString() : null,
      sunset: weatherData.sys?.sunset ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString() : null,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      data: formattedWeather
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get Weather Function Error:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Unable to fetch weather data. Please check your internet connection and try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});