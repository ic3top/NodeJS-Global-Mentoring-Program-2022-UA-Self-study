import { faker } from '@faker-js/faker';

export const generateUsersData = (amount: number): any[] => {
  const users: any[] = [];
  while (amount >= 1) {
    users.push([
      faker.name.firstName(),
      faker.internet.password(),
      faker.datatype.number({ min: 10, max: 100 }),
      Math.random() < 0.8,
    ]);
    // eslint-disable-next-line no-param-reassign
    amount--;
  }
  return users;
};

export const INIT_USERS_DATA = generateUsersData(10);
