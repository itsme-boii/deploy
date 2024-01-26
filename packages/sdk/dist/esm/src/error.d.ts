import { CsErrCode } from "./schema_types";
import { operations } from "./schema";
/**
 * Error response type, thrown on non-successful responses.
 */
export declare class ErrResponse extends Error {
    /** Operation that produced this error */
    readonly operation?: keyof operations;
    /** HTTP status code text (derived from `this.status`) */
    readonly statusText?: string;
    /** HTTP status code */
    readonly status?: number;
    /** HTTP response url */
    readonly url?: string;
    /** CubeSigner error code */
    readonly errorCode?: CsErrCode;
    /**
     * @param {Partial<ErrResponse>} init Initializer
     */
    constructor(init: Partial<ErrResponse>);
    /**
     * Checks whether the root cause of an {@link ErrResponse} is an invalid session.
     *
     * Examples include:
     * - the session has expired
     * - the session has been revoked
     * - provided auth token is invalid/malformed/expired
     *
     * @return {boolean} Whether the response matches one of several different "invalid session" responses.
     */
    isSessionExpiredError(): boolean;
    /**
     * Checks whether the root cause of an {@link ErrResponse} is the user failing to answer an MFA challenge.
     *
     * Examples include:
     * - user provides a bad TOTP code
     * - user is TOTP-rate-limited (because of too many failed attempts)
     * - MFA challenge expired
     * - FIDO challenge verification failed
     *
     * @return {boolean} Whether the error was caused by the user failing to authenticate with MFA
     */
    isUserMfaError(): boolean;
}
/**
 * An error that is thrown when a session has expired
 */
export declare class SessionExpiredError extends ErrResponse {
    /**
     * Constructor.
     *
     * @param {operations} operation The operation that was attempted
     */
    constructor(operation?: keyof operations);
}