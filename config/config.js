const localMongoURI = 'mongodb://127.0.0.1:27017/genshininfo';

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI || localMongoURI,
    sessionSecret: process.env.SESSION_SECRET || 'a',
    env: process.env.NODE_ENV || 'development'
};
