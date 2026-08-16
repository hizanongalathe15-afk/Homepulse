import axios from 'axios';
import { logger } from '../config/logger.config';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId?: string;
}

export class GeocodingService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env['MAPBOX_TOKEN'] || '';
    this.baseUrl = process.env['MAPBOX_GEOCODING_URL'] || 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  }

  async geocode(address: string): Promise<GeocodingResult> {
    try {
      const response = await axios.get(`${this.baseUrl}/${encodeURIComponent(address)}.json`, {
        params: {
          access_token: this.apiKey,
          limit: 1,
          country: 'KE',
        },
      });

      const feature = response.data.features[0];

      if (!feature) {
        throw new Error('No results found');
      }

      return {
        latitude: feature.center[1],
        longitude: feature.center[0],
        formattedAddress: feature.place_name,
        placeId: feature.id,
      };
    } catch (error) {
      logger.error('Geocoding failed:', error);
      throw new Error('Geocoding failed');
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
    try {
      const response = await axios.get(`${this.baseUrl}/${longitude},${latitude}.json`, {
        params: {
          access_token: this.apiKey,
          limit: 1,
        },
      });

      const feature = response.data.features[0];

      if (!feature) {
        throw new Error('No results found');
      }

      return {
        latitude: feature.center[1],
        longitude: feature.center[0],
        formattedAddress: feature.place_name,
        placeId: feature.id,
      };
    } catch (error) {
      logger.error('Reverse geocoding failed:', error);
      throw new Error('Reverse geocoding failed');
    }
  }

  async getPlaceDetails(placeId: string): Promise<GeocodingResult> {
    try {
      const response = await axios.get(`${this.baseUrl}/${placeId}.json`, {
        params: {
          access_token: this.apiKey,
        },
      });

      const feature = response.data.features[0];

      if (!feature) {
        throw new Error('Place not found');
      }

      return {
        latitude: feature.center[1],
        longitude: feature.center[0],
        formattedAddress: feature.place_name,
        placeId: feature.id,
      };
    } catch (error) {
      logger.error('Get place details failed:', error);
      throw new Error('Get place details failed');
    }
  }
}
