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

const indent = 2;

// https://stackoverflow.com/a/46063843/3908409
const keyDownModifier: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  const c = e.currentTarget;
  if (e.which == 13) // ASCII newline
  {
    requestAnimationFrame(function () {
      var start = c.selectionStart;
      var v = c.value;
      var thisLine = "";
      var indentation = 0;
      for (var i = start - 2; i >= 0 && v[i] != "\n"; i--) {
        thisLine = v[i] + thisLine;
      }
      for (var i = 0; i < thisLine.length && thisLine[i] == " "; i++) {

        indentation++;
      }
      c.value = v.slice(0, start) + " ".repeat(indentation) + v.slice(start);
      c.selectionStart = start + indentation;
      c.selectionEnd = start + indentation;
    });
  }
  if (e.which == 9) //ASCII tab
  {
    e.preventDefault();
    var start = c.selectionStart;
    var end = c.selectionEnd;
    var v = c.value;
    if (start == end) {
      c.value = v.slice(0, start) + " ".repeat(indent) + v.slice(start);
      c.selectionStart = start + indent;
      c.selectionEnd = start + indent;
      return;
    }

    var selectedLines = [];
    var inSelection = false;
    var lineNumber = 0;
    for (var i = 0; i < v.length; i++) {
      if (i == start) {
        inSelection = true;
        selectedLines.push(lineNumber);
      }
      if (i >= end)
        inSelection = false;

      if (v[i] == "\n") {
        lineNumber++;
        if (inSelection)
          selectedLines.push(lineNumber);
      }
    }
    var lines = v.split("\n");
    for (var i = 0; i < selectedLines.length; i++) {
      lines[selectedLines[i]] = " ".repeat(indent) + lines[selectedLines[i]];
    }

    c.value = lines.join("\n");
  }

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
                className="font-mono"
                defaultValue={field.value || ''}
                name="config"
                onChange={field.onChange}
                placeholder={"# Config\nmock:\n  title: My Component!"}
                rows={16}
                onKeyDown={keyDownModifier}
              />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="schema"
          render={({ field }) => (
            <FormItem className="grow">
              <Textarea
                className="font-mono"
                defaultValue={field.value || ''}
                name="schema"
                onChange={field.onChange}
                placeholder={"<!-- HTML body\n(style: use @import instead of href)\n(scripts: use this instead of document) -->\n<div id='tag'></div>\n<script src='https://unpkg.com/jquery/dist/jquery.min.js'>\n<script>$('#tag').text(this.dataset.title)</script>"}
                rows={16}
                onKeyDown={keyDownModifier}
              />
            </FormItem>
          )} />
      </form>
    </Form>

    <ComponentPreview schema={nowSchema} config={nowConfig} />
  </div>
}