// Web Crypto API utility for End-to-End Encryption

const getPasswordKey = async (password) => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Using a fixed salt here for prototype simplicity
  // In a robust app, the salt should be randomly generated and prepended to the ciphertext
  const salt = enc.encode('HeartScriptSalt123');
  
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptMessage = async (message, password) => {
  if (!password) return message;
  const key = await getPasswordKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(message)
  );
  
  // Pack IV and encrypted data into a base64 string format
  const buf = new Uint8Array(iv.length + encrypted.byteLength);
  buf.set(iv, 0);
  buf.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...buf));
};

export const decryptMessage = async (encryptedBase64, password) => {
  if (!password) return encryptedBase64;
  try {
    const key = await getPasswordKey(password);
    const buf = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
    const iv = buf.slice(0, 12);
    const data = buf.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    throw new Error("Incorrect password or corrupted data");
  }
};
