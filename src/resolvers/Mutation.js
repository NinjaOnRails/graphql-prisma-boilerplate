import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const password = await hashPassword(data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password,
      },
    });
    return {
      user,
      token: generateToken(user.id),
    };
  },
  async login(
    parent,
    {
      data: { email, password },
    },
    { prisma },
    info
  ) {
    const user = await prisma.query.user({ where: { email } });
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }
    localStorage.setItem('token', res.data.login.token);
    return {
      user,
      token: generateToken(user.id),
    };
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);
    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }
    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data,
      },
      info
    );
  },
};

export { Mutation as default };
