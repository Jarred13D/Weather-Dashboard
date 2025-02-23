import dotenv from 'dotenv';
dotenv.config();

//  Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
//  Define a class for the Weather object
class Weather {
  tempF: number;
  humidity: string;
  windSpeed: string;
  icon: string;
  date?: string | undefined;
  city?: string;
  iconDescription?: string;
  conditions: string;

  constructor(city: string, tempF: number, conditions: string, icon: string, humidity: string, windSpeed: string, date?: string) {
    this.city = city;
    this.tempF = tempF;
    this.conditions = conditions;
    this.icon = icon;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.date = date;
  }
}
// Define type for API responses
interface LocationData {
  lat: number;
  lon: number;
}

interface WeatherData {
  list: {
    dt: number;
    main: {
      temp: number;
      humidity?: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind?: {
      speed: number;
    };
  }[];
  city: {
    name: string;
  };
}
//  Complete the WeatherService class
class WeatherService {
  //  Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }
  //  TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<LocationData[]> {
    try {
      console.log(`Fetching location data with query: ${query}`);
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      console.log('Location data:', data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: LocationData[]): Coordinates {
    return {
      latitude: locationData[0].lat,
      longitude: locationData[0].lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    const geoCodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geoCodeQuery;
   }
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `lat=${latitude}&lon=${longitude}`;
   }
  //  TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const geoQuery = this.buildGeocodeQuery();
    const locationData: LocationData[] = await this.fetchLocationData(geoQuery);
    const destructedLocationData = this.destructureLocationData(locationData);
    return destructedLocationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherData> {
    try {
      const query = `${this.baseURL}/data/2.5/forecast?${this.buildWeatherQuery(coordinates)}&appid=${this.apiKey}`;
      console.log(`Fetching weather data with query: ${query}`);
      const response = await fetch(query);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch weather data. Status: ${response.status}, Body: ${errorText}`);
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      console.log('Weather data:', data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: WeatherData): Weather {
    if (!response || !response.list || response.list.length === 0) {
      throw new Error('Current weather data is undefined');
    }
  
    const currentData = response.list[0]; // First data point
    const { temp: tempK } = currentData.main; // Temperature is in Kelvin
    const { description, icon } = currentData.weather[0];
  
    // Convert Kelvin to Fahrenheit
    const tempF = ((tempK - 273.15) * 9/5 + 32).toFixed(2);
  
    // Ensure windSpeed and humidity have default values if missing
    const windSpeed = currentData.wind?.speed !== undefined ? `${currentData.wind.speed} MPH` : "N/A";
    const humidity = currentData.main?.humidity !== undefined ? `${currentData.main.humidity}%` : "N/A";
  
    // Extract the forecast date from `dt_txt`
    const forecastDate = new Date(currentData.dt * 1000).toLocaleDateString();
  
    return new Weather(`${response.city.name} (${forecastDate})`, parseFloat(tempF), description, icon, humidity, windSpeed, forecastDate);
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: WeatherData): any[] {
    console.log("Raw forecast data received:", weatherData.list);
  
    // Object to store the closest forecast per day
    const dailyForecastMap = new Map<string, any>();
  
    weatherData.list.forEach((weather) => {
      const date = new Date(weather.dt * 1000).toLocaleDateString(); // Convert timestamp to date
  
      // We prefer the forecast closest to 12:00 PM (midday)
      const hour = new Date(weather.dt * 1000).getHours();
  
      if (!dailyForecastMap.has(date) || Math.abs(hour - 12) < Math.abs(new Date(dailyForecastMap.get(date).dt * 1000).getHours() - 12)) {
        dailyForecastMap.set(date, weather);
      }
    });
  
    return Array.from(dailyForecastMap.values()).map((weather) => {
      console.log("Processing weather item:", weather);
  
      const { dt, main, weather: conditions, wind } = weather;
      
      // Convert Kelvin to Fahrenheit
      const temperature = main?.temp !== undefined
        ? `${((main.temp - 273.15) * 9/5 + 32).toFixed(2)} °F`
        : "N/A";
      
      const { description, icon } = conditions[0];
  
      return {
        date: new Date(dt * 1000).toLocaleDateString(),
        temperature: temperature,
        conditions: description,
        icon: icon,
        windSpeed: wind?.speed ? `${wind.speed} MPH` : "N/A",
        humidity: main?.humidity !== undefined ? `${main.humidity}%` : "N/A"
      };
    });
  }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log('Weather data received:', weatherData); // Log the weather data received

    const currentWeather = this.parseCurrentWeather(weatherData);
    console.log('Current weather:', currentWeather); // Log the current weather

    const forecastArray = this.buildForecastArray(weatherData);
    console.log('Forecast array:', forecastArray); // Log the forecast array

    return [currentWeather, ...forecastArray];
  }
}
export default new WeatherService();
