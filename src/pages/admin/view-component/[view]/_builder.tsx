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
  title: string,
  schema: string | null,
  config: string | null,
}

const editorIndentSpaces = 2;
const indent = " ".repeat(editorIndentSpaces);
const unIndentPattern = new RegExp(`^ {${editorIndentSpaces}}`);

// https://stackoverflow.com/a/76821523/3908409
const keyDownModifier: React.KeyboardEventHandler<HTMLTextAreaElement> = (ev) => {
  const textarea = ev.currentTarget;
  const v = textarea.value;
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  if (ev.key === "Tab") {
    ev.preventDefault(); //stop the focus from changing
    const isUnIndenting = ev.shiftKey;

    if (startPos === endPos) {
      //nothing selected, just indent/unindent where the cursor is
      let newCursorPos;
      const lineStartPos = v.slice(0, startPos).lastIndexOf("\n") + 1;
      const lineEndPos = v.slice(lineStartPos, v.length).indexOf("/n");
      if (isUnIndenting) {
        const newLineContent = v
          .slice(lineStartPos, lineEndPos)
          .replace(unIndentPattern, "");
        textarea.value =
          v.slice(0, lineStartPos) + newLineContent + v.slice(lineEndPos);
        newCursorPos = Math.max(startPos - editorIndentSpaces, lineStartPos);
      } else {
        textarea.value =
          v.slice(0, lineStartPos) + indent + v.slice(lineStartPos);
        newCursorPos = startPos + editorIndentSpaces;
      }
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    } else {
      //Indent/unindent the selected text
      const lineStartPos = v.slice(0, startPos).lastIndexOf("\n") + 1;
      const selection = v.substring(lineStartPos, endPos);
      let result = "";
      const lines = selection.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (isUnIndenting) {
          //unindent selected lines
          result += lines[i].replace(unIndentPattern, "");
        } else {
          //Indent selected lines
          result += indent + lines[i];
        }

        if (i < lines.length - 1) {
          //add line breaks after all but the last line
          result += "\n";
        }
      }

      textarea.value = v.split(selection).join(result);
      if (isUnIndenting) {
        textarea.setSelectionRange(
          Math.max(startPos - editorIndentSpaces, lineStartPos),
          lineStartPos + result.length
        );
      } else {
        textarea.setSelectionRange(
          startPos + editorIndentSpaces,
          lineStartPos + result.length
        );
      }
    }
  } else if (ev.key === "Enter") {
    //When enter is pressed, maintain the current indentation level

    //We will place the newline character manually, this stops it from being typed
    ev.preventDefault();

    //Get the current indentation level and prefix the new line with the same
    const prevLinePos = v.slice(0, startPos).lastIndexOf("\n") + 1;
    const prevLine = v.slice(prevLinePos, endPos);
    const levels = (prevLine.match(/^ */)?.[0].length || 0) / editorIndentSpaces;
    const indentation = indent.repeat(levels);
    textarea.value =
      v.slice(0, endPos) + "\n" + indentation + v.slice(endPos);

    //Set the cursor position
    const newCursorPos = endPos + 1 + indentation.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  }

}

// Render Puck editor
export default function Editor({ id, schema, config, title }: Props) {
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
        <div className="flex items-center gap-3">
        <Button>Save</Button>
        <h2>{title}</h2>
        </div>
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