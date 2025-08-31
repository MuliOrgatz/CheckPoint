import { Sequelize } from 'sequelize';

const DATABASE_URL =
  process.env.BOOKING_DB_URL ||
  'postgres://muli:123123@localhost:5432/booking_service_db';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, idle: 10000 },
});

export default sequelize;
