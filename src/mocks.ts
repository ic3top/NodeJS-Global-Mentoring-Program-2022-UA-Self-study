import { faker } from '@faker-js/faker';
import { User } from './modals/user';

export const generateUsersData = (amount: number): User[] => {
  const persons: User[] = [];
  while (amount >= 0) {
    persons.push({
      id: faker.database.mongodbObjectId(),
      login: faker.name.firstName(),
      password: faker.internet.password(),
      age: faker.datatype.number({ min: 10, max: 100 }),
      isDeleted: false,
    });
    // eslint-disable-next-line no-param-reassign
    amount--;
  }
  return persons;
};
