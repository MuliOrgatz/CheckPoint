import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../database/models/user';
import RefreshToken from '../database/models/refreshToken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  if (!username || !password || !email) {
    throw new Error('Username, password, and email are required');
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash, email });

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const login = async (username: string, password: string) => {
  if (!username || !password || username === '' || password === '') {
    throw new Error('Username and password required');
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken || refreshToken === '') {
    throw new Error('No token provided');
  }

  const stored = await RefreshToken.findOne({ where: { token: refreshToken } });

  if (!stored || stored.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as jwt.JwtPayload;
    const accessToken = jwt.sign(
      { id: payload.id, username: payload.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    return accessToken;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};
