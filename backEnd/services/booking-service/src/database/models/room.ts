import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class Room extends Model {
  public id!: number;
  public name!: string;
  public location!: string;
  public pricePerNight!: number;
}

Room.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    pricePerNight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
    indexes: [{ fields: ['location'] }],
  }
);

export default Room;
