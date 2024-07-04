import bcrypt from "bcryptjs";

export async function encryptPW(pw: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pw, salt);
}

export async function checkPW(pw: string, hash: string) {
  return await bcrypt.compare(pw, hash);
}

export function backTo(location: string) {
  return new Response(null, {
    status: 302,
    headers: {
      location,
    },
  });
}

export function backToLogin() {
  return new Response(null, {
    status: 302,
    headers: {
      location: "/login",
    },
  });
}

export function notFound() {
  return new Response("not found", {
    status: 404,
  });
}

export function asJson(data: any) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}

export function extractFormData(data: FormData) {
  const entries: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const [key, value] of data.entries()) {
    const existing = entries[key];
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        entries[key] = [existing, value];
      }
    } else {
      entries[key] = value;
    }
  }
  return entries;
}