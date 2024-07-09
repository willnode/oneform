import type { Context } from "hono";
import bcrypt from "bcryptjs";

export function rError(c: Context, message: string) {
  c.status(400);
  return c.json({
    status: "error",
    message,
  } as {
    status: "error";
    message: string;
  });
}

export function rOK<T>(c: Context, data?: T) {
  return c.json({
    status: "ok",
    data,
  } as {
    status: "ok";
    data: T;
  });
}

export async function encryptPW(pw: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pw, salt);
}

export async function checkPW(pw: string, hash: string) {
  return await bcrypt.compare(pw, hash);
}
