/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    const tokens = await this.auth.login(user);
    res.cookie('refresh', tokens.refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
    });
    return res.json({ accessToken: tokens.accessToken });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { cookies } = req as Request & { cookies?: Record<string, string> };
    const token = cookies?.refresh;
    if (!token) return res.status(401).send('No token');
    const newTokens = await this.auth.refresh(token);
    if (!newTokens) return res.status(401).send('Invalid token');
    res.cookie('refresh', newTokens.refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
    });
    return res.json({ accessToken: newTokens.accessToken });
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Req() req: Request, @Res() res: Response) {
    const { cookies } = req as Request & { cookies?: Record<string, string> };
    const token = cookies?.refresh;
    if (token) await this.auth.removeToken(token);
    res.clearCookie('refresh', { path: '/auth/refresh' });
    return res.sendStatus(200);
  }
}
