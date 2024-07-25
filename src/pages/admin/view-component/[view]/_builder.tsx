// Editor.jsx
import { client } from "@/api/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import "redefine-custom-elements";
import { ComponentPreview } from "@/components/editor/component";
import { Button } from "@/components/ui/button";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { extractFormData } from "@/components/helper";

// Save the data to your database
const save = (id: string): SubmitHandler<any> => {
  return async (json: any,
    e: React.BaseSyntheticEvent<object, any, HTMLFormElement> | undefined) => {
    const form: any = extractFormData(new FormData(e?.target));
    let r = await client.api["view-component"].edit[":id"].$post({
      param: { id },
      form,
    });
    let rj = await r.json();
    if (rj.status == "ok") {
      toast("Form is saved");
    } else {
      // setError(rj.message);
    }
  }
};

type Props = {
  id: string,
  schema: string | null,
  config: string | null,
}

// Render Puck editor
export default function Editor({ id, schema, config }: Props) {
  const form = useForm({
    defaultValues: {
      schema,
      config,
    },
  });

  let nowConfig = useWatch({ control: form.control, name: 'config' });
  let nowSchema = useWatch({ control: form.control, name: 'schema' });

  return <div className="grid grid-cols-2 gap-2">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(save(id))}>
        <Button>Save</Button>
        <FormField
          control={form.control}
          name="config"
          render={({ field }) => (
            <FormItem className="grow">
              <Textarea
                className="form-control"
                defaultValue={field.value || ''}
                name="config"
                onChange={field.onChange}
                placeholder={"# Config\nmock:\n  title: My Component!"}
                rows={16}
              />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="schema"
          render={({ field }) => (
            <FormItem className="grow">
              <Textarea
                className="form-control"
                defaultValue={field.value || ''}
                name="schema"
                onChange={field.onChange}
                placeholder={"<!-- HTML body\n(style: use @import instead of href)\n(scripts: use this instead of document) -->\n<div id='tag'></div>\n<script src='https://unpkg.com/jquery/dist/jquery.min.js'>\n<script>$('#tag').text(this.dataset.title)</script>"}
                rows={16}
              />
            </FormItem>
          )} />
      </form>
    </Form>

    <ComponentPreview schema={nowSchema} config={nowConfig} />
  </div>
}