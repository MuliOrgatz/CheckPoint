import { Sequelize } from 'sequelize';

const DATABASE_URL =
  process.env.USER_DB_URL ||
  'postgres://muli:123123@localhost:5432/user_service_db';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
