require("dotenv").config()
module.exports = {
    /* BASIC CONFIGS */
    PORT: process.env.PORT || 4000,


    /* AUTH CONFIGS */
    JWT_SECRET: process.env.JWT_SECRET || "thisismyjwtsecret",
    JWT_EXPIRY: "3d",
    COOKIE_TIME: process.env.COOKIE_TIME || 3,


    /* GOOGLE OUTH CONFIGS */
    GOOGLE_CLIENT_ID:
        process.env.GOOGLE_CLIENT_ID ||
        "58002058409-g9mik5iv9nok2omm7t84u269s82qpops.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET:
        process.env.GOOGLE_CLIENT_SECRET || "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",
    GOOGLE_CALLBACK_URI:
        process.env.GOOGLE_CALLBACK_URI ||
        "http://localhost:3000/api/v1/login/google/callback",

    /* DISCORD CONFIGS */

    /* AWS CONFIGS */
    AWS_ACCESS_KEY: process.env.AWS_ACCESS || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "",



    AWS_ACCESS_VERCEL: "AKIASVZKZRNBKE72YAHU",
    AWS_SECRET_ACCESS_KEY_VERCEL: "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",

    AWS_BUCKET_NAME: "listableawsbucket",

    AWS_SDK_LOAD_CONFIG: 1
};



