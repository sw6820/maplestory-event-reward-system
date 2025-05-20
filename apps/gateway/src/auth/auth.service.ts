import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('AUTH_SERVICE_URL');
    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not defined in environment variables');
    }
    this.authServiceUrl = url;
  }

  async getProfile(userId: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Failed to get user profile');
    }
  }
} 