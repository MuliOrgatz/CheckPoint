import sequelize from '../db';
import RefreshToken from '../models/refreshToken';
import User from '../models/user';

async function init() {
  await sequelize.sync({ force: true }); // Drops and recreates tables

  // Create mock users
  const user1 = await User.create({
    username: 'alice',
    password: await User.hashPassword('password123'),
    email: 'alice@example.com',
  });
  const user2 = await User.create({
    username: 'bob',
    password: await User.hashPassword('securepass'),
    email: 'bob@example.com',
  });

  // Create mock refresh tokens
  await RefreshToken.create({
    token: 'mock_refresh_token_1',
    userId: user1.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await RefreshToken.create({
    token: 'mock_refresh_token_2',
    userId: user2.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log('Database initialized with mock data');
  process.exit(0);
}

init();
