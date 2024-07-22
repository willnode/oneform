import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import type { ControlProps } from "./Control";
import { Textarea } from "../ui/textarea";

export default function Text({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;
  const variantMap = {
    numeric: "text",
    email: "email",
    tel: "tel",
    url: "url",
    "single-line": "text",
  };
  const inputModeMap = {
    numeric: "numeric",
    email: "email",
    tel: "tel",
    url: "url",
    "single-line": "text",
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          <FormLabel>{schema.label}</FormLabel>
          {schema.variant === "multi-line" ? (
            <Textarea
              className="form-control"
              name={name}
              placeholder={schema.placeholder}
              maxLength={schema.maxlength}
              required={!!schema.required}
              defaultValue={field.value}
              onChange={field.onChange}
            />
          ) : (
            <Input
              type={
                // @ts-ignore
                variantMap?.[schema.variant] || "text"
              }
              inputMode={
                // @ts-ignore
                inputModeMap?.[schema.variant] || "text"
              }
              className="form-control"
              placeholder={schema.placeholder}
              name={name}
              required={!!schema.required}
              onChange={field.onChange}
              defaultValue={field.value}
            />
          )}
        </FormItem>
      )}
    />
  );
}
