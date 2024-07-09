import { useForm } from "react-hook-form";
import Control from "./Control.tsx";
import { Form } from "../ui/form.tsx";

export type ControlProps = {
  schema: any;
  value: any;
};

export default function FormControl({ schema, value }: ControlProps) {
  const form = useForm({
    defaultValues: value,
  });
  let rSchema = Array.isArray(schema)
    ? { type: "group", children: schema }
    : schema;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <Control form={form} parentID="" schema={rSchema} />
      </form>
    </Form>
  );
}
