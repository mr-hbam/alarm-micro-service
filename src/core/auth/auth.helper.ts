import { jwtDecode } from 'jwt-decode';
import { JwtService } from '@nestjs/jwt';

export const generateAccessToken = (jwtService: JwtService, payload: any) => {
  const accessToken = jwtService.sign(payload);
  return {
    token: accessToken,
    exp: new Date(jwtDecode(accessToken).exp * 1000),
  };
};

export const generateRefreshToken = (jwtService: JwtService, payload: any) => {
  const refreshToken = jwtService.sign(payload, {
    expiresIn: '7d',
  });
  return {
    token: refreshToken,
    exp: new Date(jwtDecode(refreshToken).exp * 1000),
  };
};
