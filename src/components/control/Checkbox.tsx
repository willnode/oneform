import { FormField, FormItem, FormLabel } from "../ui/form";
import type { ControlProps } from "./Control";

export default function Checkbox({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <input
            type="checkbox"
            className="form-check-input"
            data-parent={parentID}
            name={name}
            onChange={field.onChange}
            defaultChecked={field.value}
          />
          {schema.label && (
            <span className="form-check-label">{schema.label}</span>
          )}
        </FormItem>
      )}
    />
  );
}
