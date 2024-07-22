# OneForm

A **Pseudo-Code** Open-Source CMS that abuses Form to pretty much anything you can imagine.

Pseudo-Code means, you don't have to change a single code in this codebase, but you can leverage your JS code via Admin UI to leverage many custom scripts to suit your business needs.

## Quickstart

1. Clone this repo
2. `yarn install`
3. Fill up `.env` with MySQL credentials
4. `yarn db:generate`
5. `yarn dev`
6. Open `http://localhost:4321/admin/`

## Core Ideas

1. Your entire organization is a `Team`. You may want to only have one team or more.
2. A `Form` is a way to generate an `Entry` in a `Team`. You can create a form via Admin UI.
3. A submitted `Entry` can be aggregrated into `Data` and be populated real time.
4. A submitted `Entry` can be added to `Hook`, giving additional integration to third party systems.
5. A `Data` can be exposed as an `API` endpoint. You can write custom data and API scripts via Admin UI.
6. A `View` is our additional feature to generate a webpage via Puck, a WYSIWYG web editor.
7. A `View` can be completely static or dynamic with the help of `API`, `Entry` or `Data` endpoints.
8. A custom `View Component` can be written to add more JS-powered HTML components to `View`. 
9. A `Team` can have more `User` and let them register new accounts with proper `Role`.
10. A `User` with given `Role` can create or manage `Entry` in specific `Form` in RBAC fashion.

## Goal

We aim to cover 80% of custom web usecases so you don't have to code it anymore.

1. Our form can have nested values, can be serialized to a JSON object, yet the UI is undestandable to human.
2. That same JSON can be used as a POST API, or much better, import/export as bulk with CSV.
3. The admin panel is not just for you, your users can utilize it as a CRUD UI. The form can be set public.
4. Yes, forms entries can have relationships and uniqueness without modifying our actual DDL.
5. You concern performance now? well, why don't you "hook" it to third party systems?
6. We have WYSIWYG web editor powered by Puck. Wanna add charts? Use custom components.
7. Your forms can be entries for web blogs, but also can be anything: ecommerce, product listings, radio talks, etc.
8. Entirely no touching codebase, but our admin UI talks your languages: Format UI with Tailwind CSS code, write custom components with Javascript, Aggregate data with \[JS-based\] pandas, Hook it so the form exports as PDF, etc.
9. 100% Free and Open source! We create this because becoming web devs are hard now and wages get cheaper, we must become a better devs and ships faster with better tooling 👌

## Our Stack

1. `Astro` as SSR server framework
2. `Hono` as API server framework
3. `Drizzle` as Database framework
4. `shacdn/ui` as UI framework
5. `tailwind` as CSS framework
6. `puck` as WYSIWYG web editor
7. `liquid` as languages inside web editor

## Supports Us!

Clone this repo, share it to the world. Contribute by code, give suggestions or click the support button above.
