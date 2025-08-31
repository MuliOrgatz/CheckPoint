import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import bcrypt from 'bcrypt';

export interface IUserMethods {
  hashPassword(password: string): Promise<boolean>;
}

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;

  static async hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
