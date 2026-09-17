import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

// jsdom does not expose TextEncoder/TextDecoder, but react-router needs them.
if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

// jsdom does not expose fetch. Most tests only use mocked hooks, but
// importing pokemonApi.js still evaluates fetchBaseQuery(). Tests that need
// a real fetch/Request/Headers implementation (see pokemonApi.test.js) run
// under the "node" test environment instead, where these are already native.
if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn();
}

// jsdom does not implement IntersectionObserver, but Home.jsx uses it
// for the infinite scroll sentinel.
class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock;
