import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'Vince Carter',
    email: 'carter@mavs.org',
    password: bcrypt.hashSync('monsterDunkF@#32,;3'),
  },
  user: undefined,
  jwt: undefined,
};

const userTwo = {
  input: {
    name: 'Michael Jordan',
    email: 'jordan@bulls.org',
    password: bcrypt.hashSync('6rIngsBAby!.;2f3(=2f45'),
  },
  user: undefined,
  jwt: undefined,
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
 }
