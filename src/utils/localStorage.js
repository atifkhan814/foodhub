
const USERS_KEY = 'foodhub_users';
const CURRENT_USER_KEY = 'foodhub_current_user';

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function saveCurrentUser(user) {
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );

  window.dispatchEvent(new Event('foodhub-auth-change'));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);

  window.dispatchEvent(new Event('foodhub-auth-change'));
}
