import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  icon: string;
}

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env['WEATHER_API_KEY'] || '';
    this.baseUrl = process.env['WEATHER_API_URL'] || 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      const data = response.data;

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      logger.error('Failed to get weather data:', error);
      throw new Error('Failed to get weather data');
    }
  }

  async getWeatherForecast(latitude: number, longitude: number, days: number = 5): Promise<WeatherData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8,
        },
      });

      const forecasts = response.data.list;
      const dailyForecasts: WeatherData[] = [];

      for (let i = 0; i < forecasts.length; i += 8) {
        const forecast = forecasts[i];
        dailyForecasts.push({
          temperature: forecast.main.temp,
          humidity: forecast.main.humidity,
          description: forecast.weather[0].description,
          windSpeed: forecast.wind.speed,
          icon: forecast.weather[0].icon,
        });
      }

      return dailyForecasts;
    } catch (error) {
      logger.error('Failed to get weather forecast:', error);
      throw new Error('Failed to get weather forecast');
    }
  }

  async getWeatherAlerts(latitude: number, longitude: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/onecall`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          exclude: 'current,minutely,hourly,daily',
        },
      });

      return response.data.alerts || [];
    } catch (error) {
      logger.error('Failed to get weather alerts:', error);
      return [];
    }
  }
}
