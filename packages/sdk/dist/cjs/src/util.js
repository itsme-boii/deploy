"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeToHex = exports.delay = exports.encodeToBase64Url = exports.encodeToBase64 = exports.decodeBase64Url = exports.decodeBase64 = exports.pathJoin = void 0;
/**
 * Path join
 * @param {string} dir Parent directory
 * @param {string} file Pathname
 * @return {string} New pathname
 */
function pathJoin(dir, file) {
    const sep = globalThis?.process?.platform === "win32" ? "\\" : "/";
    return `${dir}${sep}${file}`;
}
exports.pathJoin = pathJoin;
/**
 * Browser-friendly helper for decoding a 'base64'-encoded string into a byte array.
 *
 * @param {string} b64 The 'base64'-encoded string to decode
 * @return {Uint8Array} Decoded byte array
 */
function decodeBase64(b64) {
    return typeof Buffer === "function"
        ? Buffer.from(b64, "base64")
        : Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
exports.decodeBase64 = decodeBase64;
/**
 * Browser-friendly helper for decoding a 'base64url'-encoded string into a byte array.
 *
 * @param {string} b64url The 'base64url'-encoded string to decode
 * @return {Uint8Array} Decoded byte array
 */
function decodeBase64Url(b64url) {
    // NOTE: there is no "base64url" encoding in the "buffer" module for the browser (unlike in node.js)
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/").replace(/=*$/g, "");
    return decodeBase64(b64);
}
exports.decodeBase64Url = decodeBase64Url;
/**
 *
 * Browser-friendly helper for encoding a byte array into a padded `base64`-encoded string.
 *
 * @param {Iterable<number>} buffer The byte array to encode
 * @return {string} The 'base64' encoding of the byte array.
 */
function encodeToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const b64 = typeof Buffer === "function"
        ? Buffer.from(bytes).toString("base64")
        : btoa(bytes.reduce((s, b) => s + String.fromCharCode(b), ""));
    return b64;
}
exports.encodeToBase64 = encodeToBase64;
/**
 * Browser-friendly helper for encoding a byte array into a 'base64url`-encoded string.
 *
 * @param {Iterable<number>} buffer The byte array to encode
 * @return {string} The 'base64url' encoding of the byte array.
 */
function encodeToBase64Url(buffer) {
    const b64 = encodeToBase64(buffer);
    // NOTE: there is no "base64url" encoding in the "buffer" module for the browser (unlike in node.js)
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");
}
exports.encodeToBase64Url = encodeToBase64Url;
/**
 * Sleeps for `ms` milliseconds.
 *
 * @param {number} ms Milliseconds to sleep
 * @return {Promise<void>} A promise that is resolved after `ms` milliseconds.
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.delay = delay;
/**
 * Converts a string or a uint8 array into a hex string. Strings are encoded in UTF-8 before
 * being converted to hex.
 * @param {string | Uint8Array} message The input
 * @return {string} Hex string prefixed with "0x"
 */
function encodeToHex(message) {
    const buff = typeof message === "string" ? Buffer.from(message, "utf8") : Buffer.from(message);
    return "0x" + buff.toString("hex");
}
exports.encodeToHex = encodeToHex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBOzs7OztHQUtHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLEdBQVcsRUFBRSxJQUFZO0lBQ2hELE1BQU0sR0FBRyxHQUFHLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDbkUsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDL0IsQ0FBQztBQUhELDRCQUdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixZQUFZLENBQUMsR0FBVztJQUN0QyxPQUFPLE9BQU8sTUFBTSxLQUFLLFVBQVU7UUFDakMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQztRQUM1QixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBSkQsb0NBSUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxNQUFjO0lBQzVDLG9HQUFvRztJQUNwRyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0UsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUpELDBDQUlDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLE1BQXdCO0lBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sR0FBRyxHQUNQLE9BQU8sTUFBTSxLQUFLLFVBQVU7UUFDMUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVBELHdDQU9DO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxNQUF3QjtJQUN4RCxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsb0dBQW9HO0lBQ3BHLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFKRCw4Q0FJQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEVBQVU7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFGRCxzQkFFQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLE9BQTRCO0lBQ3RELE1BQU0sSUFBSSxHQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0YsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBSEQsa0NBR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogSlNPTiBtYXAgdHlwZSAqL1xuZXhwb3J0IGludGVyZmFjZSBKc29uTWFwIHtcbiAgW21lbWJlcjogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG51bGwgfCBKc29uQXJyYXkgfCBKc29uTWFwO1xufVxuXG4vKiogSlNPTiBhcnJheSB0eXBlICovXG5leHBvcnQgdHlwZSBKc29uQXJyYXkgPSBBcnJheTxzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgbnVsbCB8IEpzb25BcnJheSB8IEpzb25NYXA+O1xuXG4vKipcbiAqIFBhdGggam9pblxuICogQHBhcmFtIHtzdHJpbmd9IGRpciBQYXJlbnQgZGlyZWN0b3J5XG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZSBQYXRobmFtZVxuICogQHJldHVybiB7c3RyaW5nfSBOZXcgcGF0aG5hbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGhKb2luKGRpcjogc3RyaW5nLCBmaWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBzZXAgPSBnbG9iYWxUaGlzPy5wcm9jZXNzPy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gXCJcXFxcXCIgOiBcIi9cIjtcbiAgcmV0dXJuIGAke2Rpcn0ke3NlcH0ke2ZpbGV9YDtcbn1cblxuLyoqXG4gKiBCcm93c2VyLWZyaWVuZGx5IGhlbHBlciBmb3IgZGVjb2RpbmcgYSAnYmFzZTY0Jy1lbmNvZGVkIHN0cmluZyBpbnRvIGEgYnl0ZSBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYjY0IFRoZSAnYmFzZTY0Jy1lbmNvZGVkIHN0cmluZyB0byBkZWNvZGVcbiAqIEByZXR1cm4ge1VpbnQ4QXJyYXl9IERlY29kZWQgYnl0ZSBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlQmFzZTY0KGI2NDogc3RyaW5nKTogVWludDhBcnJheSB7XG4gIHJldHVybiB0eXBlb2YgQnVmZmVyID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IEJ1ZmZlci5mcm9tKGI2NCwgXCJiYXNlNjRcIilcbiAgICA6IFVpbnQ4QXJyYXkuZnJvbShhdG9iKGI2NCksIChjKSA9PiBjLmNoYXJDb2RlQXQoMCkpO1xufVxuXG4vKipcbiAqIEJyb3dzZXItZnJpZW5kbHkgaGVscGVyIGZvciBkZWNvZGluZyBhICdiYXNlNjR1cmwnLWVuY29kZWQgc3RyaW5nIGludG8gYSBieXRlIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiNjR1cmwgVGhlICdiYXNlNjR1cmwnLWVuY29kZWQgc3RyaW5nIHRvIGRlY29kZVxuICogQHJldHVybiB7VWludDhBcnJheX0gRGVjb2RlZCBieXRlIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVCYXNlNjRVcmwoYjY0dXJsOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcbiAgLy8gTk9URTogdGhlcmUgaXMgbm8gXCJiYXNlNjR1cmxcIiBlbmNvZGluZyBpbiB0aGUgXCJidWZmZXJcIiBtb2R1bGUgZm9yIHRoZSBicm93c2VyICh1bmxpa2UgaW4gbm9kZS5qcylcbiAgY29uc3QgYjY0ID0gYjY0dXJsLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL18vZywgXCIvXCIpLnJlcGxhY2UoLz0qJC9nLCBcIlwiKTtcbiAgcmV0dXJuIGRlY29kZUJhc2U2NChiNjQpO1xufVxuXG4vKipcbiAqXG4gKiBCcm93c2VyLWZyaWVuZGx5IGhlbHBlciBmb3IgZW5jb2RpbmcgYSBieXRlIGFycmF5IGludG8gYSBwYWRkZWQgYGJhc2U2NGAtZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtJdGVyYWJsZTxudW1iZXI+fSBidWZmZXIgVGhlIGJ5dGUgYXJyYXkgdG8gZW5jb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSAnYmFzZTY0JyBlbmNvZGluZyBvZiB0aGUgYnl0ZSBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVRvQmFzZTY0KGJ1ZmZlcjogSXRlcmFibGU8bnVtYmVyPik6IHN0cmluZyB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgY29uc3QgYjY0ID1cbiAgICB0eXBlb2YgQnVmZmVyID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gQnVmZmVyLmZyb20oYnl0ZXMpLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICA6IGJ0b2EoYnl0ZXMucmVkdWNlKChzLCBiKSA9PiBzICsgU3RyaW5nLmZyb21DaGFyQ29kZShiKSwgXCJcIikpO1xuICByZXR1cm4gYjY0O1xufVxuXG4vKipcbiAqIEJyb3dzZXItZnJpZW5kbHkgaGVscGVyIGZvciBlbmNvZGluZyBhIGJ5dGUgYXJyYXkgaW50byBhICdiYXNlNjR1cmxgLWVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7SXRlcmFibGU8bnVtYmVyPn0gYnVmZmVyIFRoZSBieXRlIGFycmF5IHRvIGVuY29kZVxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgJ2Jhc2U2NHVybCcgZW5jb2Rpbmcgb2YgdGhlIGJ5dGUgYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVUb0Jhc2U2NFVybChidWZmZXI6IEl0ZXJhYmxlPG51bWJlcj4pOiBzdHJpbmcge1xuICBjb25zdCBiNjQgPSBlbmNvZGVUb0Jhc2U2NChidWZmZXIpO1xuICAvLyBOT1RFOiB0aGVyZSBpcyBubyBcImJhc2U2NHVybFwiIGVuY29kaW5nIGluIHRoZSBcImJ1ZmZlclwiIG1vZHVsZSBmb3IgdGhlIGJyb3dzZXIgKHVubGlrZSBpbiBub2RlLmpzKVxuICByZXR1cm4gYjY0LnJlcGxhY2UoL1xcKy9nLCBcIi1cIikucmVwbGFjZSgvXFwvL2csIFwiX1wiKS5yZXBsYWNlKC89KiQvZywgXCJcIik7XG59XG5cbi8qKlxuICogU2xlZXBzIGZvciBgbXNgIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbXMgTWlsbGlzZWNvbmRzIHRvIHNsZWVwXG4gKiBAcmV0dXJuIHtQcm9taXNlPHZvaWQ+fSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBhZnRlciBgbXNgIG1pbGxpc2Vjb25kcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBzdHJpbmcgb3IgYSB1aW50OCBhcnJheSBpbnRvIGEgaGV4IHN0cmluZy4gU3RyaW5ncyBhcmUgZW5jb2RlZCBpbiBVVEYtOCBiZWZvcmVcbiAqIGJlaW5nIGNvbnZlcnRlZCB0byBoZXguXG4gKiBAcGFyYW0ge3N0cmluZyB8IFVpbnQ4QXJyYXl9IG1lc3NhZ2UgVGhlIGlucHV0XG4gKiBAcmV0dXJuIHtzdHJpbmd9IEhleCBzdHJpbmcgcHJlZml4ZWQgd2l0aCBcIjB4XCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVRvSGV4KG1lc3NhZ2U6IHN0cmluZyB8IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICBjb25zdCBidWZmID0gdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBCdWZmZXIuZnJvbShtZXNzYWdlLCBcInV0ZjhcIikgOiBCdWZmZXIuZnJvbShtZXNzYWdlKTtcbiAgcmV0dXJuIFwiMHhcIiArIGJ1ZmYudG9TdHJpbmcoXCJoZXhcIik7XG59XG4iXX0=