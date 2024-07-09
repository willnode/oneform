import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
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
        <FormItem>
          {schema.label && <FormLabel>{schema.label}</FormLabel>}
          {(!schema.variant ||
            schema.variant === "single-select" ||
            schema.variant === "multi-select") && (
            <Select
              name={name}
              required={!!schema.required}
              // multiple={schema.variant === "multi-select"}
              data-parent={parentID}
              onValueChange={field.onChange}
              defaultValue={field.value}
              // defaultValue={value?.[schema.id]}
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
                  <FormItem className="form-check" key={x.value}>
                    <Input
                      className="form-check-input"
                      type={schema.variant}
                      name={name}
                      required={!!schema.required}
                      data-parent={parentID}
                      defaultChecked={x.value === field.value}
                      onChange={field.onChange}
                      value={x.value}
                    />
                    <div className="form-check-label">{x.value}</div>
                  </FormItem>
                ))
              : null)}
        </FormItem>
      )}
    />
  );
}
