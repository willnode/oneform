import _ from "lodash-es";
import { twi, twj } from "tw-to-css";
import { ulid } from "ulid";

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
  if (typeof str !== 'string') return "";
  try {
    return twi(str, {
      ignoreMediaQueries: false,
      merge: false,
      minify: false,
    });
  } catch (error) {
    console.error(error);
    return "";
  }
}
export function cssToStyle(str: string | undefined) {
  if (typeof str !== 'string') return {};
  return str.split(';').reduce((obj: Record<string, string>, line) => {
    let [key, ...value] = _.split(line, ':');
    obj[_.kebabCase(key)] = value.join(":").trim();
    return obj;
  }, {})
}

export function formatBytes(bytes: number, precision = 1) {
  var units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

  bytes = Math.max(bytes, 0);
  var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
  pow = Math.min(pow, units.length - 1);

  // Uncomment one of the following alternatives
  bytes /= Math.pow(1024, pow);
  // bytes /= (1 << (10 * pow));

  return bytes.toFixed(precision) + ' ' + units[pow];
}



const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" // Crockford's Base32

function hashEtag(input: Uint8Array) {
  let alphabet = ENCODING;

  const length = input.byteLength;

  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < length; i++) {
    value = (value << 8) | input[i]!;
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

export async function computeEtag(content: Uint8Array) {
  var hash = await crypto.subtle.digest("SHA-1", content);
  return hashEtag(new Uint8Array(hash)).substring(0, 27);
}

export const cacheBuster = ulid().substring(0, 8);