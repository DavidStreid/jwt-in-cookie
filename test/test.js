const expect = require("chai").expect;
const httpMocks = require("node-mocks-http");
const jwtInCookie = require("../index");

describe("JWT-in-cookie tests", function () {
    it("validateJwtToken: Configured instance validates payload encoded by same secret", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const timeoutDuration = "1m";
        const payload = {"foo": "bar"};
        jwtInCookie.configure({secret, timeoutDuration});

        const req = httpMocks.createRequest({cookies: { "jic": jwtInCookie.encodePayload(payload) }});
        expect(() => jwtInCookie.validateJwtToken(req)).to.not.throw();
    });

    it("validateJwtToken: Payload signed w/ different secret throws error", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const payload = {"foo": "bar"};
        jwtInCookie.configure({secret});
        const req = httpMocks.createRequest({cookies: { "jic": jwtInCookie.encodePayload(payload) }});

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

    it("clearToken: JWT is cleared, i.e. set to blank string, after being set", function () {
        const secret = "abcdefghijklmnopqrstuvwxyz1234567";
        const payload = {"foo": "bar"};

        const res = httpMocks.createResponse();
        jwtInCookie.configure({secret});
        jwtInCookie.setJwtToken(res, payload);

        const encodedPayload = jwtInCookie.encodePayload(payload);
        expect(res.cookies['jic'].value).to.equal(encodedPayload);

        jwtInCookie.clearToken(res);
        expect(res.cookies['jic'].value).to.equal('');
    });

    it("validateJwtToken (after clearToken): Error thrown if JWT is a blank string", function () {
        const req = httpMocks.createRequest({cookies: { "jic": "" }});
        expect(() => jwtInCookie.validateJwtToken(req)).to.throw();
    });
});
