import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

const deriveKey = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash || !/^[a-f0-9]{128}$/i.test(hash)) return false;

  const expected = Buffer.from(hash, "hex");
  const actual = await deriveKey(password, salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
