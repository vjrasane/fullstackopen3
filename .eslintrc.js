module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd" : true,
        "node" : true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": 0,
        "eqeqeq" : [
          "error"
        ],
        "no-trailing-spaces": [
          "error"
        ],
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "no-console" : 0
    }
};
