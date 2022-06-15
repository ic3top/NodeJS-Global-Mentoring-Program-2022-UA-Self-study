import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface UserInt {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export class User extends Model<UserInt> {
  declare id: string;

  declare login: string;

  declare password: string;

  declare age: number;

  declare isDeleted: boolean;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  login: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  updatedAt: 'updateTimestamp',
});
