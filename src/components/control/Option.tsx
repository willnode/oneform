import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import type { ControlProps } from "./Control";

export default function Option({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          <FormLabel>{schema.label}</FormLabel>
          {(!schema.variant ||
            schema.variant === "single-select" ||
            schema.variant === "multi-select") && (
            <Select
              name={name}
              required={!!schema.required}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder={schema.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* {(!value?.[schema.id] || !schema.required) && (
              <SelectItem disabled={schema.required} value="" />
            )} */}
                {Array.isArray(schema?.values)
                  ? schema.values.map((x: any) => (
                      <SelectItem key={x.value} value={x.value}>
                        {x.value}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          )}
          {(schema.variant === "radio" || schema.variant === "checkbox") &&
            (Array.isArray(schema?.values)
              ? schema.values.map((x: any) => (
                  <FormItem className="grow" key={x.value}>
                    <FormLabel className="items-top flex space-x-2">
                      <FormControl>
                        <Checkbox
                          name={name}
                          checked={x.value === field.value}
                          required={schema.required}
                          onCheckedChange={(e) => e && field.onChange(x.value)}
                        />
                      </FormControl>
                      <span>{x.value}</span>
                    </FormLabel>
                  </FormItem>
                ))
              : null)}
        </FormItem>
      )}
    />
  );
}
