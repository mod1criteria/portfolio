/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../db/database.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly db: DatabaseService,
    private readonly users: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.users.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  async login(user: User) {
    const tokenId = randomUUID();
    const accessToken = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti: tokenId },
      { expiresIn: '7d' },
    );

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.db.run(
      `INSERT INTO refresh_tokens (id, userId, tokenHash, expiresAt) VALUES (?, ?, ?, strftime('%s','now') + 7*24*60*60)`,
      [tokenId, user.id, hash],
    );
    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; jti: string }>(
        token,
      );
      const record = await this.db.get<{ tokenHash: string }>(
        `SELECT tokenHash FROM refresh_tokens WHERE id = ? AND userId = ?`,
        [payload.jti, payload.sub],
      );
      if (!record) return null;

      const match = await bcrypt.compare(token, record.tokenHash);
      if (!match) return null;
      await this.db.run(`DELETE FROM refresh_tokens WHERE id = ?`, [
        payload.jti,
      ]);
      const user = await this.users.findOne(payload.sub);
      if (!user) return null;
      return this.login(user);
    } catch {
      return null;
    }
  }

  async removeToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ jti: string }>(token);
      await this.db.run(`DELETE FROM refresh_tokens WHERE id = ?`, [
        payload.jti,
      ]);
    } catch {
      // ignore invalid token
    }
  }
}
