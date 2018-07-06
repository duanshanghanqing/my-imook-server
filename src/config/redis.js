const config = {
    "dev": {
        "host": "127.0.0.1",
        "password": "",
        "port": 6379,
        "ttl": 3600
    },
    "test": {
        "host": "127.0.0.1",
        "password": "",
        "port": 6379,
        "ttl": 3600
    },
    "sim": {
        "host": "127.0.0.1",
        "password": "",
        "port": 6379,
        "ttl": 3600
    },
    "prod": {
        "host": "127.0.0.1",
        "password": "",
        "port": 6379,
        "ttl": 3600
    }
}

module.exports = config[process.env.STAGE_ENV]