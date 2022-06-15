import { DataTypes, Model } from 'sequelize';
import { UserInt } from './user';
import { sequelize } from '../db';

export enum Permissions {
  read = 'READ',
  write = 'WRITE',
  delete = 'DELETE',
  shared = 'SHARE',
  uploadFiles = 'UPLOAD_FILES',
}

export interface GroupInt {
  id: string;
  name: string;
  permissions: Permissions[];
}

export class Group extends Model<GroupInt> {
  declare id: string;

  declare name: string;

  declare permissions: Permissions[];
}

Group.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.ENUM({
      values: Object.values(Permissions),
    })),
  },
}, {
  sequelize,
  tableName: 'groups',
  timestamps: true,
  updatedAt: 'updateTimestamp',
});
