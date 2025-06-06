require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/genshin_info',
    sessionSecret: process.env.SESSION_SECRET || 'your-secret-key'
};
