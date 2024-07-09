import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import type { ControlProps } from "./Control";

export default function Time({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;

  const variantMap = {
    date: "date",
    time: "time",
    week: "week",
    "date-time": "datetime-local",
    "year-month": "month",
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          {schema.label && <FormLabel>{schema.label}</FormLabel>}
          {
            <Input
              type={
                // @ts-ignore
                variantMap?.[schema.variant] || "time"
              }
              className="form-control"
              name={name}
              required={!!schema.required}
              onChange={field.onChange}
              defaultValue={field.value}
            />
          }
        </FormItem>
      )}
    />
  );
}
