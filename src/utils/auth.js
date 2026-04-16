// src/utils/auth.js
export const hasRole = (user, role) =>
  user?.roles?.includes(role);