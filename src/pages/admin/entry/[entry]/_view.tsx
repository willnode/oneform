import { FormControl } from "@/components/control/FormControl";
import { Button } from "@/components/ui/button";

export default function ViewEntry({ form, entry }: any) {
  function onSubmit(data: any) {}
  return (
    <>
      <Button asChild variant="secondary">
        <a href={`/form/${form.id}/entries`}>
          Back to Entries
        </a>
      </Button>
        <h1 className="text-2xl my-5">{form.title}</h1>
        <fieldset disabled>
          <FormControl
            schema={form.schema}
            onSubmit={onSubmit}
            value={entry.data}
          />
        </fieldset>
    </>
  );
}
