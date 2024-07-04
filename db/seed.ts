import { User, UserAuth, Team, Form, db, Entry } from "astro:db";
import { ulid } from "ulid";
import { encryptPW } from "../src/helper";

// https://astro.build/db/seed
export default async function seed() {
  // avoid relogin on reseed
  let uid = "01J1JEY8ZJHYHBYYBHAVBEDMRS";
  let tid = "01J1V1RJ2ZWKRX3MEYA7RB6YSQ";
  let fid = "01J1V1S83HZG78JWD31K2BT9ZB";
  await db
    .insert(User)
    .values([{ id: uid, email: "user@user", name: "Test W" }]);
  await db
    .insert(UserAuth)
    .values([
      {
        id: ulid(),
        identifier: await encryptPW("user"),
        type: "email",
        userId: uid,
      },
    ]);

  await db.insert(Team).values([{ id: tid, userId: uid }]);
  let schema = [
    {
      id: ulid(),
      type: "text",
      variant: "single-line",
      code: "name",
      label: "Name",
      required: true,
    },
    {
      id: ulid(),
      type: "text",
      variant: "multi-line",
      code: "address",
      label: "Address",
      placeholder: "Enter Address",
    },
    {
      id: ulid(),
      type: "number",
      variant: "number",
      min: 0,
      code: "rating",
      label: "Rating",
    },
    {
      id: ulid(),
      type: "option",
      variant: "radio",
      valueType: "constant",
      values: [{ value: "meat" }, { value: "vegan" }],
      code: "food-type",
      label: "Food Type",
    },
    {
      id: ulid(),
      type: "file",
      accept: "image",
      multiple: true,
    },
  ];
  await db.insert(Form).values([
    {
      id: fid,
      teamId: tid,
      title: "Restaurat Review",
      schema,
      privilenge: "public",
    },
  ]);
  await db.insert(Entry).values([
    {
      id: ulid(),
      formId: fid,
      data: {
        [schema[0].id]: "Rogan",
        [schema[1].id]: "St. Hardwood\nSan Jofree",
        [schema[2].id]: 4.5,
        [schema[3].id]: "vegan",
      },
      authorId: null,
    },
  ]);
}
