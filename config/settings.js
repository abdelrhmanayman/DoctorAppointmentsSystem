const mongoURL = 'mongodb://raqiim:raqiim45@ds147125.mlab.com:47125/raqiim'
module.exports = {
    serverPort: 8888,
    mongoURL,
    mongoConfig: {
        useNewUrlParser: true,
        autoReconnect: true,
        useCreateIndex: true
    },
    sessionConfig: {
        secret: "raqiimSecret",
        cookie: { maxAge: 60 * 60 * 1000, httpOnly: false },
        resave: false,
        rolling: true,
        saveUninitialized: false,
    },
    mongoStoreConfig: {
        url: mongoURL,
        autoRemove: 'native',
        autoReconnect: true
    }
}