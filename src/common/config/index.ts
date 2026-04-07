export default () => ({
  app: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    accessTokenTtl: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    algorithm: 'HS256' as const,
  },
});
