const env: string = process.env.NODE_ENV || 'dev'

if (env === 'dev') {
    process.env.PORT = 3001
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TallyDev'
} else if (env === 'test') {
    process.env.PORT = 3001
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TallyTest'
}