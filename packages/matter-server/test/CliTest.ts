/**
 * @license
 * Copyright 2025-2026 Open Home Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseCliArgs } from "../src/cli.js";

describe("CLI --dcl-production-url", () => {
    it("parses a valid URL", () => {
        const opts = parseCliArgs(["node", "test", "--dcl-production-url", "https://custom.dcl.example.com"]);
        expect(opts.dclProductionUrl).to.equal("https://custom.dcl.example.com");
    });

    it("trims whitespace from the URL", () => {
        const opts = parseCliArgs(["node", "test", "--dcl-production-url", "  https://custom.dcl.example.com  "]);
        expect(opts.dclProductionUrl).to.equal("https://custom.dcl.example.com");
    });

    it("defaults to null when not provided", () => {
        const opts = parseCliArgs(["node", "test"]);
        expect(opts.dclProductionUrl).to.be.null;
    });

    it("rejects an invalid URL", () => {
        expect(() => parseCliArgs(["node", "test", "--dcl-production-url", "not-a-url"])).to.throw("Invalid URL");
    });

    it("rejects an empty string", () => {
        expect(() => parseCliArgs(["node", "test", "--dcl-production-url", "  "])).to.throw("must not be empty");
    });

    it("rejects non-http schemes", () => {
        expect(() => parseCliArgs(["node", "test", "--dcl-production-url", "file:///etc/passwd"])).to.throw(
            "Only http and https are allowed",
        );
    });

    it("accepts http URL", () => {
        const opts = parseCliArgs(["node", "test", "--dcl-production-url", "http://localhost:26657"]);
        expect(opts.dclProductionUrl).to.equal("http://localhost:26657");
    });

    it("reads from DCL_PRODUCTION_URL env var", () => {
        const original = process.env.DCL_PRODUCTION_URL;
        try {
            process.env.DCL_PRODUCTION_URL = "https://env.dcl.example.com";
            const opts = parseCliArgs(["node", "test"]);
            expect(opts.dclProductionUrl).to.equal("https://env.dcl.example.com");
        } finally {
            if (original === undefined) {
                delete process.env.DCL_PRODUCTION_URL;
            } else {
                process.env.DCL_PRODUCTION_URL = original;
            }
        }
    });

    it("CLI arg overrides env var", () => {
        const original = process.env.DCL_PRODUCTION_URL;
        try {
            process.env.DCL_PRODUCTION_URL = "https://env.dcl.example.com";
            const opts = parseCliArgs(["node", "test", "--dcl-production-url", "https://cli.dcl.example.com"]);
            expect(opts.dclProductionUrl).to.equal("https://cli.dcl.example.com");
        } finally {
            if (original === undefined) {
                delete process.env.DCL_PRODUCTION_URL;
            } else {
                process.env.DCL_PRODUCTION_URL = original;
            }
        }
    });
});
