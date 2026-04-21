export const API_PATHS = {
  AUTH: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  APARTMENTS: {
    list: "/apartment",
    details: (id) => `/apartment/${id}`,
  },
  USER: {
    preferences: "/user/preferences",
  },
};
