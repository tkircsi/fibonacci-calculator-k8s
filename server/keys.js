module.exports = {
  serverPort: process.env.PORT || 5000,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  pgUser: process.env.PGUSER,
  pgPassword: process.env.PGPASSWORD,
  pgHost: process.env.PGHOST,
  pgPort: process.env.PGPORT,
  pgDatabase: process.env.PGDATABASE,
};
