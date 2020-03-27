const expect = require("chai").expect;
const httpMocks = require("node-mocks-http");
const jwtInCookie = require("../index");

describe("JWT-in-cookie tests", function () {
    it("validateJwtToken: Configured instance validates payload encoded by same secret", function () {
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

    it("validateJwtToken: Payload signed w/ different secret throws error", function () {
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

    it("setJwtToken: JWT is set correctly encoded in the cookie", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const payload = {"foo": "bar"};

        const res = httpMocks.createResponse();
        jwtInCookie.configure({secret});
        jwtInCookie.setJwtToken(res, payload);

        const encodedPayload = jwtInCookie.encodePayload(payload);
        expect(res.cookies['jic'].value).to.equal(encodedPayload);
    });
});
