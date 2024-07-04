function renameKey(
  data: any,
  schema: any[],
  formatSchema: Record<string, any>,
) {
  let obj: Record<string, any> = {};
  if (!Array.isArray(schema)) {
    return obj;
  }
  for (const item of schema) {
    let label = item.label;
    if (
      formatSchema &&
      typeof formatSchema == "object" &&
      formatSchema[label]
    ) {
      if (typeof formatSchema[label] === "string") {
        label = formatSchema[label];
      } else if (formatSchema[label] && formatSchema[label][""]) {
        label = formatSchema[label][""];
      }
    }
    if (item.type === "group") {
      if (item.id) {
        if (label) {
          obj[label] = renameKey(
            data[item.id],
            item.children,
            formatSchema[item.id],
          );
        }
      } else {
        Object.assign(obj, renameKey(data, item.children, formatSchema));
      }
    } else if (item.type === "list") {
      if (item.id && label) {
        obj[label] = renameKey(
          data[item.id],
          [item.child],
          formatSchema[item.id],
        );
      }
    } else if (label) {
      obj[label] = data[item.id];
    }
  }
  return obj;
}

export function generate(form: any, format: any, entry: any) {
  let obj = renameKey(entry.data, form.schema, format.schema);
  return JSON.stringify(obj, null, 2);
}
