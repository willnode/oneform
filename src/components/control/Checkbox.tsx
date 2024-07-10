import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import type { ControlProps } from "./Control";
import { Checkbox } from "../ui/checkbox";

export default function CheckBox({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          <FormLabel className="items-top flex space-x-2">
            <FormControl>
              <Checkbox
                name={name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <span>{schema.label}</span>
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
