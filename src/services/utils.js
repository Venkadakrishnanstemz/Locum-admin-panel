// aesUtils.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "STEMZ_AES_ENCRYPT_KEY_32_BYTE!12";

const getKey = () => CryptoJS.enc.Utf8.parse(SECRET_KEY); // must be 32-byte key

export function encryptAES(data) {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, getKey(), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // base64 encoded
}

export function decryptAES(cipherText) {
  const decrypted = CryptoJS.AES.decrypt(cipherText, getKey(), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  if (!decryptedText) {
    throw new Error("Decryption failed — possible padding or key mismatch");
  }

  return JSON.parse(decryptedText);
}
