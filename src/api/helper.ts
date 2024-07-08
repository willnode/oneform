import type { Context } from "hono";

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
