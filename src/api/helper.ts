import type { Context } from "hono";
import bcrypt from "bcryptjs";

type rType<T> = {
  status: "ok",
  data: T,
} |  {
  status: "error",
  message: string,
} 

export function rError(c: Context, message: string) {
  c.status(400);
  let body: rType<any> = {
    status: "error",
    message,
  } 
  return c.json(body);
}

export function rOK<T>(c: Context, data?: T) {
  let body  = {
    status: "ok",
    data,
  }  as rType<T>
  return c.json(body);
}

export async function encryptPW(pw: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pw, salt);
}

export async function checkPW(pw: string, hash: string) {
  return await bcrypt.compare(pw, hash);
}
