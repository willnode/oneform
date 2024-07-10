import { useForm, type SubmitHandler } from "react-hook-form";
import Control from "./Control.tsx";
import { Form } from "../ui/form.tsx";
import schema from "../editor/schema.ts";
import { Button } from "../ui/button.tsx";

export type FormProps = {
  schema: any;
  value: any;
  disabled?: boolean;
  onSubmit: SubmitHandler<any>;
};

export function EditorFormControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={schema} />;
}

export function FormControl({ schema, onSubmit, disabled, value }: FormProps) {
  const form = useForm({
    defaultValues: value,
  });
  let rSchema = Array.isArray(schema)
    ? { type: "group", children: schema }
    : schema;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={disabled}>
          <Control form={form} parentID="" schema={rSchema} />
          <Button className="my-3">Save</Button>
        </fieldset>
      </form>
    </Form>
  );
}
