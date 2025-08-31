import User from '../database/models/user';

export const getUserData = async (id: string) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email'],
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
