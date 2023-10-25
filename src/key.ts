import { CubeSigner, KeyPolicy } from ".";
import { components } from "./client";
import { assertOk } from "./util";

/** Secp256k1 key type */
export enum Secp256k1 {
  Evm = "SecpEthAddr", // eslint-disable-line no-unused-vars
  Btc = "SecpBtc", // eslint-disable-line no-unused-vars
  BtcTest = "SecpBtcTest", // eslint-disable-line no-unused-vars
  Ava = "SecpAvaAddr", // eslint-disable-line no-unused-vars
  AvaTest = "SecpAvaTestAddr", // eslint-disable-line no-unused-vars
}

/** BLS key type */
export enum Bls {
  Eth2Deposited = "BlsPub", // eslint-disable-line no-unused-vars
  Eth2Inactive = "BlsInactive", // eslint-disable-line no-unused-vars
}

/** Ed25519 key type */
export enum Ed25519 {
  Solana = "Ed25519SolanaAddr", // eslint-disable-line no-unused-vars
  Sui = "Ed25519SuiAddr", // eslint-disable-line no-unused-vars
  Aptos = "Ed25519AptosAddr", // eslint-disable-line no-unused-vars
  Cardano = "Ed25519CardanoAddrVk", // eslint-disable-line no-unused-vars
}

/** Mnemonic key type */
export const Mnemonic = "Mnemonic" as const;
export type Mnemonic = typeof Mnemonic;

/** Stark key type */
export const Stark = "Stark" as const;
export type Stark = typeof Stark;

/** Key type */
export type KeyType = Secp256k1 | Bls | Ed25519 | Mnemonic | Stark;

/** Schema key type (i.e., key type at the API level) */
type SchemaKeyType = components["schemas"]["KeyType"];

type UpdateKeyRequest = components["schemas"]["UpdateKeyRequest"];
type KeyInfoApi = components["schemas"]["KeyInfo"];
type KeyTypeApi = components["schemas"]["KeyType"];

/** Additional properties (for backward compatibility) */
export interface KeyInfo extends KeyInfoApi {
  /** Alias for key_id */
  id: string;
  /** Alias for key_type */
  type: KeyTypeApi;
  /** Alias for material_id */
  materialId: string;
  /** Alias for public_key */
  publicKey: string;
}

/**
 * Define some additional (backward compatibility) properties
 * on a `KeyInfoApi` object returned from the remote end.
 *
 * @param {KeyInfoApi} key Key information returned from the remote end
 * @return {KeyInfo} The same `key` object extended with some derived properties.
 */
export function toKeyInfo(key: KeyInfoApi): KeyInfo {
  return {
    ...key,
    id: key.key_id,
    type: key.key_type,
    publicKey: key.public_key,
    materialId: key.material_id,
  };
}

/** Signing keys. */
export class Key {
  /** The CubeSigner instance that this key is associated with */
  readonly #cs: CubeSigner;
  /** The organization that this key is in */
  readonly orgId: string;
  /**
   * The id of the key: "Key#" followed by a unique identifier specific to
   * the type of key (such as a public key for BLS or an ethereum address for Secp)
   * @example Key#0x8e3484687e66cdd26cf04c3647633ab4f3570148
   * */
  readonly id: string;

  /**
   * A unique identifier specific to the type of key, such as a public key or an ethereum address
   * @example 0x8e3484687e66cdd26cf04c3647633ab4f3570148
   * */
  readonly materialId: string;

  /**
   * @description Hex-encoded, serialized public key. The format used depends on the key type:
   * - secp256k1 keys use 65-byte uncompressed SECG format
   * - BLS keys use 48-byte compressed BLS12-381 (ZCash) format
   * @example 0x04d2688b6bc2ce7f9879b9e745f3c4dc177908c5cef0c1b64cff19ae7ff27dee623c64fe9d9c325c7fbbc748bbd5f607ce14dd83e28ebbbb7d3e7f2ffb70a79431
   * */
  readonly publicKey: string;

  /** The type of key. */
  async type(): Promise<KeyType> {
    const data = await this.fetch();
    return fromSchemaKeyType(data.key_type);
  }

  /** Is the key enabled? */
  async enabled(): Promise<boolean> {
    const data = await this.fetch();
    return data.enabled;
  }

  /** Enable the key. */
  async enable() {
    await this.update({ enabled: true });
  }

  /** Disable the key. */
  async disable() {
    await this.update({ enabled: false });
  }

  /**
   * Set new policy (overwriting any policies previously set for this key)
   * @param {KeyPolicy} policy The new policy to set
   */
  async setPolicy(policy: KeyPolicy) {
    await this.update({ policy: policy as unknown as Record<string, never>[] });
  }

  /**
   * Append to existing key policy. This append is not atomic -- it uses {@link policy} to fetch the current policy and then {@link setPolicy} to set the policy -- and should not be used in across concurrent sessions.
   * @param {KeyPolicy} policy The policy to append to the existing one.
   */
  async appendPolicy(policy: KeyPolicy) {
    const existing = await this.policy();
    await this.setPolicy([...existing, ...policy]);
  }

  /**
   * Get the policy for the org.
   * @return {Promise<KeyPolicy>} The policy for the org.
   */
  async policy(): Promise<KeyPolicy> {
    const data = await this.fetch();
    return (data.policy ?? []) as unknown as KeyPolicy;
  }

  /**
   * @description Owner of the key
   * @example User#c3b9379c-4e8c-4216-bd0a-65ace53cf98f
   * */
  async owner(): Promise<string> {
    const data = await this.fetch();
    return data.owner;
  }

  /** Set the owner of the key. Only the key (or org) owner can change the owner of the key.
   * @param {string} owner The user-id of the new owner of the key.
   * */
  async setOwner(owner: string) {
    await this.update({ owner });
  }

  /**
   * Delete this key.
   */
  async delete() {
    await this.#cs.deleteKey(this.orgId, this.id);
  }

  // --------------------------------------------------------------------------
  // -- INTERNAL --------------------------------------------------------------
  // --------------------------------------------------------------------------

  /** Create a new key.
   * @param {CubeSigner} cs The CubeSigner instance to use for signing.
   * @param {string} orgId The id of the organization to which the key belongs.
   * @param {KeyInfo} data The JSON response from the API server.
   * @internal
   * */
  constructor(cs: CubeSigner, orgId: string, data: KeyInfoApi) {
    this.#cs = cs;
    this.orgId = orgId;
    this.id = data.key_id;
    this.materialId = data.material_id;
    this.publicKey = data.public_key;
  }

  /** Update the key.
   * @param {UpdateKeyRequest} request The JSON request to send to the API server.
   * @return {KeyInfo} The JSON response from the API server.
   * */
  private async update(request: UpdateKeyRequest): Promise<KeyInfo> {
    const resp = await (
      await this.#cs.management()
    ).patch("/v0/org/{org_id}/keys/{key_id}", {
      params: { path: { org_id: this.orgId, key_id: this.id } },
      body: request,
      parseAs: "json",
    });
    return toKeyInfo(assertOk(resp));
  }

  /** Create new signing keys.
   * @param {CubeSigner} cs The CubeSigner instance to use for signing.
   * @param {string} orgId The id of the organization to which the key belongs.
   * @param {KeyType} keyType The type of key to create.
   * @param {number} count The number of keys to create.
   * @param {string?} ownerId The owner of the keys. Defaults to the session's user.
   * @return {Key[]} The new keys.
   * @internal
   * */
  static async createKeys(
    cs: CubeSigner,
    orgId: string,
    keyType: KeyType,
    count: number,
    ownerId?: string,
  ): Promise<Key[]> {
    const chain_id = 0; // not used anymore
    const resp = await (
      await cs.management()
    ).post("/v0/org/{org_id}/keys", {
      params: { path: { org_id: orgId } },
      body: {
        count,
        chain_id,
        key_type: keyType,
        owner: ownerId || null,
      },
      parseAs: "json",
    });
    const data = assertOk(resp);
    return data.keys.map((k) => new Key(cs, orgId, k));
  }

  /**
   * Derives a key of a specified type using a supplied derivation path and an existing long-lived mnemonic.
   *
   * The owner of the derived key will be the owner of the mnemonic.
   *
   * @param {CubeSigner} cs The CubeSigner instance to use for key creation.
   * @param {string} orgId The id of the organization to which the key belongs.
   * @param {KeyType} keyType The type of key to create.
   * @param {string[]} derivationPaths Derivation paths from which to derive new keys.
   * @param {string} mnemonicId materialId of mnemonic key used to derive the new key.
   *
   * @return {Key[]} The newly derived keys.
   */
  static async deriveKeys(
    cs: CubeSigner,
    orgId: string,
    keyType: KeyType,
    derivationPaths: string[],
    mnemonicId: string,
  ): Promise<Key[]> {
    const resp = await (
      await cs.management()
    ).put("/v0/org/{org_id}/derive_key", {
      params: { path: { org_id: orgId } },
      body: {
        derivation_path: derivationPaths,
        mnemonic_id: mnemonicId,
        key_type: keyType,
      },
      parseAs: "json",
    });
    const data = assertOk(resp);
    return data.keys.map((k) => new Key(cs, orgId, k));
  }

  /** Get a key by id.
   * @param {CubeSigner} cs The CubeSigner instance to use for signing.
   * @param {string} orgId The id of the organization to which the key belongs.
   * @param {string} keyId The id of the key to get.
   * @return {Key} The key.
   * @internal
   * */
  static async getKey(cs: CubeSigner, orgId: string, keyId: string): Promise<Key> {
    const resp = await (
      await cs.management()
    ).get("/v0/org/{org_id}/keys/{key_id}", {
      params: { path: { org_id: orgId, key_id: keyId } },
      parseAs: "json",
    });
    const data = assertOk(resp);
    return new Key(cs, orgId, data);
  }

  /** Fetches the key information.
   * @return {KeyInfo} The key information.
   * @internal
   * */
  private async fetch(): Promise<KeyInfo> {
    const resp = await (
      await this.#cs.management()
    ).get("/v0/org/{org_id}/keys/{key_id}", {
      params: { path: { org_id: this.orgId, key_id: this.id } },
      parseAs: "json",
    });
    const data = assertOk(resp);
    return toKeyInfo(data);
  }
}

/** Convert a schema key type to a key type.
 * @param {SchemaKeyType} ty The schema key type.
 * @return {KeyType} The key type.
 * @internal
 * */
export function fromSchemaKeyType(ty: SchemaKeyType): KeyType {
  switch (ty) {
    case "SecpEthAddr":
      return Secp256k1.Evm;
    case "SecpBtc":
      return Secp256k1.Btc;
    case "SecpBtcTest":
      return Secp256k1.BtcTest;
    case "SecpAvaAddr":
      return Secp256k1.Ava;
    case "SecpAvaTestAddr":
      return Secp256k1.AvaTest;
    case "BlsPub":
      return Bls.Eth2Deposited;
    case "BlsInactive":
      return Bls.Eth2Inactive;
    case "Ed25519SolanaAddr":
      return Ed25519.Solana;
    case "Ed25519SuiAddr":
      return Ed25519.Sui;
    case "Ed25519AptosAddr":
      return Ed25519.Aptos;
    case "Ed25519CardanoAddrVk":
      return Ed25519.Cardano;
    case "Stark":
      return Stark;
    case "Mnemonic":
      return Mnemonic;
  }
}
