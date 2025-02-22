import dotenv from 'dotenv';
dotenv.config();

//  Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
//  Define a class for the Weather object
class Weather {
  city: string;
  temperature: number;
  conditions: string;
  icon: string;

  constructor(city: string, temperature: number, conditions: string, icon: string) {
    this.city = city;
    this.temperature = temperature;
    this.conditions = conditions;
    this.icon = icon;
  }
}
// Define type for API responses
interface LocationData {
  lat: number;
  lon: number;
}

interface WeatherData {
  current: {
    temp: number;
    weather: { description: string; icon: string }[];
  };
  daily: {
    dt: number;
    temp: { day: number };
    weather: { description: string; icon: string }[];
  }[];
}
//  Complete the WeatherService class
class WeatherService {
  //  Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.city = '';
  }
  //  TODO: Create fetchLocationData method
   private async fetchLocationData(query: string): Promise<LocationData[]> {
    try {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
      console.error(error);
      throw error;
    }
   }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: LocationData[]): Coordinates {
    const { lat: latitude, lon: longitude } = locationData[0];
    return { latitude, longitude };
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
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
   }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherData> {
    try {
      const response = await fetch(`${this.baseURL}onecall?${this.buildWeatherQuery(coordinates)}&appid=${this.apiKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: WeatherData['current']): Weather {
    const { temp } = response;
    const { description, icon } = response.weather[0];
    return new Weather(this.city, temp, description, icon);
   }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: WeatherData['daily']) {
    return weatherData.map((weather) => {
      const { dt, temp, weather: conditions } = weather;
      const { description, icon } = conditions[0];
      return {
        date: dt,
        temperature: temp.day,
        conditions: description,
        icon: icon,
      };
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(weatherData.daily);
    return { currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
