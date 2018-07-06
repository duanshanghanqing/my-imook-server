const config = {
    "dev": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "",
        "database": "haokeminzhai"
    },
    "test": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "",
        "database": "haokeminzhai"
    },
    "sim": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "",
        "database": "haokeminzhai"
    },
    "prod": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "",
        "database": "haokeminzhai"
    }
}
module.exports = config[process.env.STAGE_ENV]