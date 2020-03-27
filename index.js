const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");  // Allows for parsing req.cookies & res.cookie(...)

const DEFAULT_TIMEOUT_DURATION = "2 hours";

class JwtInCookie {
    #secret;
    #timeoutDuration;
    #tokenKey;

    constructor(secret, timeoutDuration) {
        this.#secret = secret;
        this.#timeoutDuration = timeoutDuration;
        this.#tokenKey = "jic";     // Default cookie key for JWT
    }

    getTokenKey() {
        return this.#tokenKey;
    }

    getTimeout() {
        return this.#timeoutDuration
    }

    getSecret() {
        return this.#secret;
    }
}

// Define a default instance cookie. Will be set in the configure method
let instance = new JwtInCookie("", DEFAULT_TIMEOUT_DURATION);

/**
 * Configures the instance w/ a secret and optional timeout duration
 *
 * @param config, { secret: "", timeoutDuration: "" }
 */
exports.configure = function (config) {
    const secret = config["secret"];
    let timeout = config["timeoutDuration"] || DEFAULT_TIMEOUT_DURATION;
    if (!secret) {
        throw new Error("Secret must be specified");
    }
    instance = new JwtInCookie(secret, timeout);
};

/**
 * Adds JWT token to the express response's cookie
 *
 * @param res
 */
exports.setJwtToken = function (res, payload, cookieOptions = {httpOnly: true, expires: 0}) {
    const encodedToken = encodePayload(payload);
    res.cookie(instance.getTokenKey(), encodedToken, cookieOptions);
    return res;
};

/**
 * Encodes input payload as token
 *
 * @param payload
 * @returns {undefined|*}
 */
const encodePayload = function (payload) {
    const jwtData = {
        expiresIn: instance.getTimeout()
    };
    const encoded = jwt.sign(payload, instance.getSecret(), jwtData);
    return encoded;
};
exports.encodePayload = encodePayload;

/**
 * Retrieves token from the request cookie
 *
 * @param req - express request
 * @returns {*}
 */
const retrieveTokenFromCookie = function (req) {
    const token = req.cookies[instance.getTokenKey()];
    if (token === undefined || token === null) {
        throw new Error("JWT Token not defined in cookie");
    }
    jwt.verify(token, instance.getSecret(), function (err, decoded) {
        if (err) {
            throw new Error("Invalid JWT Token");
        }
    });
    return token;
};
exports.retrieveTokenFromCookie = retrieveTokenFromCookie;

/**
 * Returns true if the request has a valid token in its cookie
 *
 * @param req
 * @returns {*}
 */
exports.validateJwtToken = function (req) {
    retrieveTokenFromCookie(req);
    return true;
};
