import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import type { ControlProps } from "./Control";

export default function Number({
  parentID,
  form,
  schema,
}: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          <FormLabel>{schema.label}</FormLabel>
          <Input
            type="number"
            name={name}
            className="form-control"
            onChange={field.onChange}
            defaultValue={field.value}
            min={schema.min}
            max={schema.max}
            step={schema.step}
          />
        </FormItem>
      )}
    />
  );
}
