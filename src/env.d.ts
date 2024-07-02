/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="client: any," />

declare const Astro: {
    request: Request
    props: any,
    params: any,
    response: Response,
    cookies: any,
    redirect: any,
    canonicalURL: any,
    url: URL,
    clientAddress: any,
    site: URL,
    generator: any,
    slots: any,
    self: any,
    locals: any,
    preferredLocale: any,
    preferredLocaleList: any,
    currentLocale: any,
};
