// export async function encrypt(str: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // TODO: retrieve from process.env.SECRET
//     const salt = randomBytes(16).toString("hex");

//     scrypt(str, salt, 64, (err, derivedKey) => {
//       if (err) reject(err);
//       resolve(salt + ":" + derivedKey.toString("hex"));
//     });
//   });
// }

// export async function verifyEncriptedValue(
//   str: string,
//   hash: string,
// ): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     const [salt, key] = hash.split(":");
//     scrypt(str, salt, 64, (err, derivedKey) => {
//       if (err) reject(err);
//       resolve(key === derivedKey.toString("hex"));
//     });
//   });
// }
