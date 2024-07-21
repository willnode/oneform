import _ from "lodash-es";
import { twj } from "tw-to-css";

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
      location: "/auth/login",
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

export function twToStyle(str: string) {
  if (typeof str !== 'string') return {};
  return twj(str);
}
export function cssToStyle(str: string) {
  if (typeof str !== 'string') return {};
  return str.split(';').reduce((obj: Record<string, string>, line) => {
    let [key, ...value] = _.split(line, ':');
    obj[_.kebabCase(key)] = value.join(":").trim();
    return obj;
  }, {})
}