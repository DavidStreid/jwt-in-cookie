var expect = require("chai").expect;
const jwtInCookie = require("../index");

describe("JWT-in-cookie tests", function () {
    it("Configured instance validates payload encoded by same secret", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const timeoutDuration = "1m";
        const payload = {"foo": "bar"};
        jwtInCookie.configure({secret, timeoutDuration});

        const req = {
            cookies: {
                "jic": jwtInCookie.encodePayload(payload)
            }
        };

        expect(() => jwtInCookie.validateJwtToken(req)).to.not.throw();
    });

    it("Payload signed w/ different secret throws error", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const payload = {"foo": "bar"};
        jwtInCookie.configure({secret});
        const req = {
            cookies: {
                "jic": jwtInCookie.encodePayload(payload)
            }
        };

        // Re-configure
        jwtInCookie.configure({secret: "1234567abcdefghijklmnopqrstuvwxyz"});

        expect(() => jwtInCookie.validateJwtToken(req)).to.throw();
    });
});
