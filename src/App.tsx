import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import './App.css';
import axios from 'axios';

interface WeatherData {
  latitude: number;
  longitude: number;
  country: string;
  humidity: number;
  temperature: number;
  maxTemp: number;
  minTemp: number;
  feelsTemperature: number;
  windSpeed: number;
  location: string;
  state: string;
  clouds: number;
  image: string;
}

interface HourlyWeatherData {
  temperature_1: number;
  maxTemp_1: number;
  minTemp_1: number;
  pop_1: number;
  image_1: string;
  date_1: string;

  temperature_2: number;
  maxTemp_2: number;
  minTemp_2: number;
  pop_2: number;
  image_2: string;
  date_2: string;

  temperature_3: number;
  maxTemp_3: number;
  minTemp_3: number;
  pop_3: number;
  image_3: string;
  date_3: string;

  temperature_4: number;
  maxTemp_4: number;
  minTemp_4: number;
  pop_4: number;
  image_4: string;
  date_4: string;

  temperature_5: number;
  maxTemp_5: number;
  minTemp_5: number;
  pop_5: number;
  image_5: string;
  date_5: string;

  temperature_6: number;
  maxTemp_6: number;
  minTemp_6: number;
  pop_6: number;
  image_6: string;
  date_6: string;
}

interface WeatherForecast {
  temperatureMax_1: number;
  temperatureMin_1: number;
  date_1: string;
  forecastImg_1: string,
  temperatureMax_2: number;
  temperatureMin_2: number;
  date_2: string;
  forecastImg_2: string,
  temperatureMax_3: number;
  temperatureMin_3: number;
  date_3: string;
  forecastImg_3: string,
  temperatureMax_4: number;
  temperatureMin_4: number;
  date_4: string;
  forecastImg_4: string,
  temperatureMax_5: number;
  temperatureMin_5: number;
  date_5: string;
  forecastImg_5: string,
}

function App() {
  //Get actual date
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); //useState for actual weather data
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null); //useState for forecast data
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeatherData | null>(null); //useState for hourly weather data

  const inputRef = useRef<HTMLInputElement>(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  //This function get the latitude and longitude of the user to search the city and get the wheather data.
  const getUserCoords = () => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const REVERSE_GEODECODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        try {
          const response = await axios.get(REVERSE_GEODECODING_URL);
          const data = response.data;
          const { name } = data[0];
          searchCoords(name);
        } catch (error) {
          console.error(error);
        }
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Permiso de ubicación denegado por el usuario.");
          searchCoords("La plata")
        }
      }
    );
  };

  //This function get de weather data from a given city in the form or in the user location.
  const searchCoords = async (city: string) => {
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ES&appid=${API_KEY}`;
    try {
      const response = await axios.get(WEATHER_API);
      const data = response.data;
      //console.log(data);
      setWeatherData({
        latitude: data.coord.lat,
        longitude: data.coord.lon,
        country: data.sys.country,
        humidity: data.main.humidity,
        temperature: Math.floor(data.main.temp),
        maxTemp: Math.floor(data.main.temp_max),
        minTemp: Math.floor(data.main.temp_min),
        feelsTemperature: Math.floor(data.main.feels_like),
        windSpeed: data.wind.speed,
        location: data.name,
        state: data.weather[0].description,
        clouds: data.clouds.all,
        image: data.weather[0].icon
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      alert("Datos incorrectos");;
    }
  };

  const weatherIcon = `https://openweathermap.org/img/wn/${weatherData?.image}@2x.png`

  //This function gets the 16 days forecast of the given location
  const getWeatherDetails = async (lat: number, lon: number) => {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ES&appid=${API_KEY}`;
    try {
      const response = await axios.get(FORECAST_API_URL);
      const data = response.data;
      setWeatherForecast({
        temperatureMax_1: Math.floor(data.list[0].main.temp_max),
        temperatureMin_1: Math.floor(data.list[0].main.temp_min),
        date_1: data.list[0].dt_txt,
        forecastImg_1: data.list[0].weather[0].icon,

        temperatureMax_2: Math.floor(data.list[8].main.temp_max),
        temperatureMin_2: Math.floor(data.list[8].main.temp_min),
        date_2: data.list[8].dt_txt,
        forecastImg_2: data.list[8].weather[0].icon,

        temperatureMax_3: Math.floor(data.list[16].main.temp_max),
        temperatureMin_3: Math.floor(data.list[16].main.temp_min),
        date_3: data.list[16].dt_txt,
        forecastImg_3: data.list[16].weather[0].icon,

        temperatureMax_4: Math.floor(data.list[24].main.temp_max),
        temperatureMin_4: Math.floor(data.list[24].main.temp_min),
        date_4: data.list[24].dt_txt,
        forecastImg_4: data.list[24].weather[0].icon,

        temperatureMax_5: Math.floor(data.list[32].main.temp_max),
        temperatureMin_5: Math.floor(data.list[32].main.temp_min),
        date_5: data.list[32].dt_txt,
        forecastImg_5: data.list[32].weather[0].icon,
      });

      getHourlyForecast(lat, lon)
      //console.log(data);
    } catch (error) {
      console.error('Error buscando el pronostico:', error);
      alert("Error en el pronostico")
    }
  };

  const getHourlyForecast = async (lat: number, lon: number) => {
    const HOURLY_FORECAST_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ES&appid=${API_KEY}`;
    try {
      const response = await axios.get(HOURLY_FORECAST_API);
      const data = response.data;
      //console.log(data);
      setHourlyForecast({
        temperature_1: Math.floor(data.list[0].main.temp),
        maxTemp_1: Math.floor(data.list[0].main.temp_max),
        minTemp_1: Math.floor(data.list[0].main.temp_min),
        pop_1: data.list[0].pop,
        image_1: data.list[0].weather[0].icon,
        date_1: data.list[0].dt_txt.split(" ")[1].slice(0, 5),

        temperature_2: Math.floor(data.list[1].main.temp),
        maxTemp_2: Math.floor(data.list[1].main.temp_max),
        minTemp_2: Math.floor(data.list[1].main.temp_min),
        pop_2: data.list[1].pop,
        image_2: data.list[1].weather[0].icon,
        date_2: data.list[1].dt_txt.split(" ")[1].slice(0, 5),

        temperature_3: Math.floor(data.list[2].main.temp),
        maxTemp_3: Math.floor(data.list[2].main.temp_max),
        minTemp_3: Math.floor(data.list[2].main.temp_min),
        pop_3: data.list[2].pop,
        image_3: data.list[2].weather[0].icon,
        date_3: data.list[2].dt_txt.split(" ")[1].slice(0, 5),

        temperature_4: Math.floor(data.list[3].main.temp),
        maxTemp_4: Math.floor(data.list[3].main.temp_max),
        minTemp_4: Math.floor(data.list[3].main.temp_min),
        pop_4: data.list[3].pop,
        image_4: data.list[3].weather[0].icon,
        date_4: data.list[3].dt_txt.split(" ")[1].slice(0, 5),

        temperature_5: Math.floor(data.list[4].main.temp),
        maxTemp_5: Math.floor(data.list[4].main.temp_max),
        minTemp_5: Math.floor(data.list[4].main.temp_min),
        pop_5: data.list[4].pop,
        image_5: data.list[4].weather[0].icon,
        date_5: data.list[4].dt_txt.split(" ")[1].slice(0, 5),

        temperature_6: Math.floor(data.list[5].main.temp),
        maxTemp_6: Math.floor(data.list[5].main.temp_max),
        minTemp_6: Math.floor(data.list[5].main.temp_min),
        pop_6: data.list[5].pop,
        image_6: data.list[5].weather[0].icon,
        date_6: data.list[5].dt_txt.split(" ")[1].slice(0, 5)
      });
      //console.log(hourlyForecast);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      alert("Datos incorrectos h");;
    }
  }

  const hourlyForecastIcon_1 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_1}@2x.png`
  const hourlyForecastIcon_2 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_2}@2x.png`
  const hourlyForecastIcon_3 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_3}@2x.png`
  const hourlyForecastIcon_4 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_4}@2x.png`
  const hourlyForecastIcon_5 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_5}@2x.png`
  const hourlyForecastIcon_6 = `https://openweathermap.org/img/wn/${hourlyForecast?.image_6}@2x.png`

  const weatherForecastIcon_1 = `https://openweathermap.org/img/wn/${weatherForecast?.forecastImg_1}@2x.png`
  const weatherForecastIcon_2 = `https://openweathermap.org/img/wn/${weatherForecast?.forecastImg_2}@2x.png`
  const weatherForecastIcon_3 = `https://openweathermap.org/img/wn/${weatherForecast?.forecastImg_3}@2x.png`
  const weatherForecastIcon_4 = `https://openweathermap.org/img/wn/${weatherForecast?.forecastImg_4}@2x.png`
  const weatherForecastIcon_5 = `https://openweathermap.org/img/wn/${weatherForecast?.forecastImg_5}@2x.png`

  //Get the user coords
  useEffect(() => {
    getUserCoords()
  }, []);

  //Search a given location
  useEffect(() => {
    if (weatherData) {
      getWeatherDetails(weatherData.latitude, weatherData.longitude);
    }
  }, [weatherData]);

  function MyComponent() {
    const map = useMap();
    map.flyTo([weatherData?.latitude || 0, weatherData?.longitude || 0], map.getZoom());
    return null;
  }

  const position: [number, number] = [weatherData?.latitude||0, weatherData?.longitude||0];

  return (
    <div className="weather-app">
      <div className='form'>
        <input maxLength={20} ref={inputRef} type="text" placeholder='Ubicación' />
        <button onClick={() => inputRef.current?.value && searchCoords(inputRef.current.value)}>Buscar</button>
        <br />
        <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", alignItems: "center" }}>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <button className='coords' onClick={getUserCoords}>Obtener coordenadas</button>
        </div>
      </div>
      <h1 style={{ textDecoration: "underline" }}>Ubicaciones Populares:</h1>
      <div className='group'>
        <button onClick={() => searchCoords("Buenos Aires")}>Buenos Aires, AR</button>
        <button onClick={() => searchCoords("Londres")}>Londres, GB</button>
        <button onClick={() => searchCoords("Dubai")}>Dubai, EAU</button>
        <button onClick={() => searchCoords("Tokyo")}>Tokyo, JP</button>
        <button onClick={() => searchCoords("Cancún")}>Cancún, MX</button>
      </div>
      <div className='weather-card'>
        <h2 style={{ textDecoration: "underline" }}>
          Clima en {weatherData?.location}, {weatherData?.country} - {date}/{month}/{year} {formattedHours}:{formattedMinutes}hs.
        </h2>
        <img src={weatherIcon} alt="weather state" />
        <div className='card-items'>
          <p style={{ textTransform: 'capitalize' }}>Estado: {weatherData?.state}</p>
          <p>Temperatura: {weatherData?.temperature}°C</p>
          <p>Sensacion termica: {weatherData?.feelsTemperature}°C</p>
          <p>Temperatura maxima: {weatherData?.maxTemp}°C</p>
          <p>Temperatura minima: {weatherData?.minTemp}°C</p>
          <p>Humedad: {weatherData?.humidity}%</p>
          <p>Nubosidad: {weatherData?.clouds}%</p>
          <p>Velocidad del viento: {weatherData?.windSpeed} m/s</p>
        </div>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {weatherData?.location}, {weatherData?.country}
            </Popup>
          </Marker>
          <MyComponent />
        </MapContainer>
        <h2 style={{ textDecoration: "underline" }}>Estado del dia</h2>
        <div className='hourly'>
          <div className='hourly_card'>
            <p>{hourlyForecast?.date_1}hs</p>
            <img src={hourlyForecastIcon_1} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_1}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_1}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_1}°C</p>
            <p>% Lluvia: {hourlyForecast?.pop_1}%</p>
          </div>

          <div className='hourly_card'>
            <p>{hourlyForecast?.date_2}hs</p>
            <img src={hourlyForecastIcon_2} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_2}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_2}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_2}°C</p>
            <p>% Lluvia: {hourlyForecast?.pop_2}%</p>
          </div>

          <div className='hourly_card'>
            <p>{hourlyForecast?.date_3}hs</p>
            <img src={hourlyForecastIcon_3} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_3}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_3}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_3}°C</p>
            <p>% Lluvia: {hourlyForecast?.pop_3}%</p>
          </div>

          <div className='hourly_card'>
            <p>{hourlyForecast?.date_4}hs</p>
            <img src={hourlyForecastIcon_4} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_4}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_4}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_4}°C</p>
            <p>% Lluvia: {hourlyForecast?.pop_4}%</p>
          </div>

          <div className='hourly_card'>
            <p>{hourlyForecast?.date_5}hs</p>
            <img src={hourlyForecastIcon_5} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_5}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_5}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_5}°C</p>
            <p>P.Lluvia: {hourlyForecast?.pop_5}%</p>
          </div>

          <div className='hourly_card'>
            <p>{hourlyForecast?.date_6}hs</p>
            <img src={hourlyForecastIcon_6} alt="weather state" />
            <p>Temperatura: {hourlyForecast?.temperature_6}°C</p>
            <p>T.Max: {hourlyForecast?.maxTemp_6}°C</p>
            <p>T.Min: {hourlyForecast?.minTemp_6}°C</p>
            <p>P.Lluvia: {hourlyForecast?.pop_6}%</p>
          </div>
        </div>
      </div>
      <h2 style={{ textDecoration: "underline" }}>Pronostico de los siguientes 5 dias</h2>
      <div className='forecast'>
        <div>
          <p>{weatherForecast?.date_1}</p>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <p>T. Max: {weatherForecast?.temperatureMax_1}°C</p>
          <p>T. Min: {weatherForecast?.temperatureMin_1}°C</p>
          <img style={{ width: "100px" }} src={weatherForecastIcon_1} alt="forecast img" />
        </div>

        <div>
          <p>{weatherForecast?.date_2}</p>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <p>T. Max: {weatherForecast?.temperatureMax_2}°C</p>
          <p>T. Min: {weatherForecast?.temperatureMin_2}°C</p>
          <img style={{ width: "100px" }} src={weatherForecastIcon_2} alt="forecast img" />
        </div>

        <div>
          <p>{weatherForecast?.date_3}</p>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <p>T. Max: {weatherForecast?.temperatureMax_3}°C</p>
          <p>T. Min: {weatherForecast?.temperatureMin_3}°C</p>
          <img style={{ width: "100px" }} src={weatherForecastIcon_3} alt="forecast img" />
        </div>

        <div>
          <p>{weatherForecast?.date_4}</p>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <p>T. Max: {weatherForecast?.temperatureMax_4}°C</p>
          <p>T. Min: {weatherForecast?.temperatureMin_4}°C</p>
          <img style={{ width: "100px" }} src={weatherForecastIcon_4} alt="forecast img" />
        </div>

        <div>
          <p>{weatherForecast?.date_5}</p>
          <span style={{ borderTop: "1px solid gray", width: "300px" }}></span>
          <p>T. Max: {weatherForecast?.temperatureMax_5}°C</p>
          <p>T. Min: {weatherForecast?.temperatureMin_5}°C</p>
          <img style={{ width: "100px" }} src={weatherForecastIcon_5} alt="forecast img" />
        </div>
      </div>
    </div>
  );
}

export default App;
