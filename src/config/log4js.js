module.exports = {
    "appenders": [
        {
            "type": "console"
        },
        {
            "category": "info",
            "type": "dateFile",
            "filename": "logs/info/",
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true,
            "maxLogSize": 1024
        },
        {
            "category": "warn",
            "type": "dateFile",
            "filename": "logs/warn/",
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true,
            "maxLogSize": 1024
        },
        {
            "category": "error",
            "type": "dateFile",
            "filename": "logs/error/",
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true,
            "maxLogSize": 1024
        }
    ]
}