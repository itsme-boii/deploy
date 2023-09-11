import { expect } from "chai";
import { CubeSigner, Ed25519, Org, Secp256k1 } from "../src";
import { newCubeSigner } from "./setup";

describe("Key", () => {
  let cs: CubeSigner;
  let org: Org;
  let me: string;

  beforeAll(async () => {
    cs = await newCubeSigner();
    const aboutMe = await cs.aboutMe();
    org = await cs.getOrg(aboutMe.org_ids[0]);
    me = aboutMe.user_id;
  });

  it("create key, enable, disable", async () => {
    const key = await org.createKey(Secp256k1.Evm);
    expect(await key.enabled()).to.equal(true);
    expect(key.type).to.equal(Secp256k1.Evm);
    expect(await key.owner()).to.equal(me);

    // retrieve key by id from org
    const key2 = await org.getKey(key.id);
    expect(await key2.enabled()).to.equal(true);
    expect(key2.type).to.equal(Secp256k1.Evm);
    expect(await key2.owner()).to.equal(me);

    // disable:
    await key.disable();
    expect(await key.enabled()).to.equal(false);
    // re-enable:
    await key.enable();
    expect(await key.enabled()).to.equal(true);
  });

  it("create key is in list", async () => {
    const key = await org.createKey(Ed25519.Sui);
    // list keys with filtering
    let keys = await org.keys(Ed25519.Sui);
    expect(keys.map((k) => k.id)).to.include(key.id);
    // list keys without filtering
    keys = await org.keys();
    expect(keys.map((k) => k.id)).to.include(key.id);
    // list keys with filtering for different type
    keys = await org.keys(Ed25519.Aptos);
    expect(keys.map((k) => k.id)).to.not.include(key.id);
  });
});