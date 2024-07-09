import { useForm } from "react-hook-form";
import Control from "./Control.tsx";
import { Form } from "../ui/form.tsx";
import schema from "../editor/schema.ts";
import { Button } from "../ui/button.tsx";

export type FormProps = {
  schema: any;
  value: any;
  onSubmit: (data: any) => void;
};

export function EditorFormControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={schema} />;
}

export function FormControl({ schema, onSubmit, value }: FormProps) {
  const form = useForm({
    defaultValues: value,
  });
  let rSchema = Array.isArray(schema)
    ? { type: "group", children: schema }
    : schema;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Control form={form} parentID="" schema={rSchema} />
        <Button className="my-3">Save</Button>
      </form>
    </Form>
  );
}
