import { Group } from '../models/group';
import { User } from '../models/user';

Group.belongsToMany(User, { through: 'UserGroup' });
User.belongsToMany(Group, { through: 'UserGroup' });
