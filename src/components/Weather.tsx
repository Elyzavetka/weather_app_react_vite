import React, { useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  console.log(API_KEY);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeatherData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Check the Weather Forecast</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
