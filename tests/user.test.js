import 'cross-fetch/polyfill';
import seedDatabase, { userOne } from './utils/seedDatabase';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'David',
      email: 'david@empiricists.org',
      password: 'AgeOfReason',
    },
  };

  const response = await client.mutate({ mutation: createUser, variables });
  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(exists).toBe(true);
});

test('Should expose public author profile', async () => {
  const response = await client.query({ query: getUsers });

  const {
    data: { users },
  } = response;
  expect(users[0].email).toBe(null);
  expect(users[0].name).toBe('Vince Carter');
});

test('Should not login with bad credentials', async () => {
  const variables = {
    data: { email: 'carter@mavs.org', password: 'amonsterDunkF@#32,;3' },
  };
  await expect(
    client.mutate({
      mutation: login,
      variables,
    }),
  ).rejects.toThrow();
});

test('Should not sign up with short password', async () => {
  const variables = {
    data: {
      email: 'jfoje@jfioe.com',
      name: 'Jason Kidd',
      password: 'tooshor',
    },
  };

  await expect(
    client.mutate({
      mutation: createUser,
      variables,
    }),
  ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);

  const {
    data: { me },
  } = await client.query({ query: getProfile });
  const { user } = userOne;

  expect(me.id).toBe(user.id);
  expect(me.name).toBe(user.name);
  expect(me.email).toBe(user.email);
});
