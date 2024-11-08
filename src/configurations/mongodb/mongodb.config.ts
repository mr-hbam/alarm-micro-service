export const getMongoDbConnectionString = () => {
  const { DB_PREFIX, DB_URL, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_OPTIONS } =
    process.env;

  const mongoUri = `${DB_PREFIX}://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}${DB_OPTIONS}`;

  return mongoUri;
};
