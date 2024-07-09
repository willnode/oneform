import { FormField } from "../ui/form";
import type { ControlProps } from "./Control";

export default function Hidden({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <input
          type="hidden"
          data-parent={parentID}
          data-hidden-variant={schema.variant}
          name={name}
          onChange={field.onChange}
          defaultValue={field.value}
        />
      )}
    />
  );
}
