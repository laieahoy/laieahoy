import { readStorage, writeStorage, removeStorage } from './storage';

const USERS_KEY = 'site-users';
const CURRENT_USER_KEY = 'site-current-user';

export function getUsers() {
  return readStorage(USERS_KEY, []);
}

export function getCurrentUser() {
  return readStorage(CURRENT_USER_KEY, null);
}

export function registerUser({ username, email, password }) {
  const users = getUsers();

  if (!username || !email || !password) {
    throw new Error('请填写完整信息');
  }

  if (password.length < 8) {
    throw new Error('密码至少需要 8 位');
  }

  if (users.some((user) => user.email === email)) {
    throw new Error('该邮箱已经注册');
  }

  const user = {
    id: `${Date.now()}`,
    username,
    email,
    password,
    bio: '',
    avatar: '/img/avatar.png',
    createdAt: new Date().toISOString(),
  };

  writeStorage(USERS_KEY, [...users, user]);
  writeStorage(CURRENT_USER_KEY, user);
  return user;
}

export function loginUser(email, password) {
  const user = getUsers().find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    throw new Error('邮箱或密码错误');
  }

  writeStorage(CURRENT_USER_KEY, user);
  return user;
}

export function logoutUser() {
  removeStorage(CURRENT_USER_KEY);
}

export function updateCurrentUser(updates) {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  const users = getUsers().map((user) => (
    user.id === currentUser.id ? updatedUser : user
  ));

  writeStorage(USERS_KEY, users);
  writeStorage(CURRENT_USER_KEY, updatedUser);
  return updatedUser;
}