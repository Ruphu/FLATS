export const API_PATHS = {
  AUTH: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  APARTMENTS: {
    list: "/apartment",
    details: (id) => `/apartment/${id}`,
    recommendations: "/apartment/recommendations",
    recommendationCriteria: "/apartment/recommendations/criteria",
    compare: "/apartment/compare",
  },
  USER: {
    preferences: "/user/preferences",
    favorites: "/user/favorites",
    favoriteDetails: (id) => `/user/favorites/${id}`,
  },
};
