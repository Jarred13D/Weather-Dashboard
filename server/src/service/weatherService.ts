import fs from 'node:fs/promises';
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
//  Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.city = '';
  }
  //  Define the baseURL, API key, and city name properties
  //  Create fetchLocationData method
   private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}weather?q=${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return data;
   }
  //  Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitude } = locationData;
    return { latitude, longitude };
   }
  //  Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    return `${this.city}`;
   }
  //  Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `lat=${latitude}&lon=${longitude}`;
   }
  //  Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
   }
  //  Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(`${this.baseURL}onecall?${this.buildWeatherQuery(coordinates)}&appid=${this.apiKey}`);
    const data = await response.json();
    return data;
   }
  //  Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { name } = response;
    const { temp } = response.main;
    const { description, icon } = response.weather[0];
    return new Weather(name, temp, description, icon);
   }
  //  Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((weather: any) => {
      const { dt, temp, weather: conditions } = weather;
      const { description, icon } = conditions[0];
      return {
        date: dt,
        temperature: temp,
        conditions: description,
        icon: icon,
      };
    });
    return forecastArray;
   }
  //  Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return { currentWeather, forecast: forecastArray };
   }
}

export default new WeatherService();
