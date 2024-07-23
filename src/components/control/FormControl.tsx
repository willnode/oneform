import { useForm, type SubmitHandler } from "react-hook-form";
import Control from "./Control.tsx";
import { Form } from "../ui/form.tsx";
import formSchema from "../editor/form.ts";
import viewSchema from "../editor/view.ts";
import { Button } from "../ui/button.tsx";
import viewComponentSchema from "../editor/viewComponent.ts";
import fileSchema from "../editor/file.ts";

export type FormProps = {
  schema: any;
  value: any;
  disabled?: boolean;
  onSubmit: SubmitHandler<any>;
};

export function EditorFormControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={formSchema} />;
}

export function EditorViewControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={viewSchema} />;
}

export function EditorFileControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={fileSchema} />;
}

export function EditorViewComponentControl(props: Omit<FormProps, "schema">) {
  return <FormControl {...props} schema={viewComponentSchema} />;
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
          <Button name="formSubmitBtn" className="my-3">Save</Button>
        </fieldset>
      </form>
    </Form>
  );
}
