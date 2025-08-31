import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import Room from './room';

class Booking extends Model {
  public id!: number;
  public userId!: number;
  public roomId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public status!: 'confirmed' | 'cancelled';
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    startTime: { type: DataTypes.DATEONLY, allowNull: false },
    endTime: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'confirmed',
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      { fields: ['roomId', 'startTime'] },
      { fields: ['roomId', 'endTime'] },
      { fields: ['userId'] },
    ],
  }
);

// Associations
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export default Booking;
