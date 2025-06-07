module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genshin_info',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }
}; 