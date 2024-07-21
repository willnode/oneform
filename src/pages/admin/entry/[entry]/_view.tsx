import { FormControl } from "@/components/control/FormControl";
import { Button } from "@/components/ui/button";

export default function ViewEntry({ form, formats, entry }: any) {
  function onSubmit(data: any) {}
  return (
    <>
      <Button asChild variant="secondary">
        <a href={`/form/${form.id}/entries`}>
          Back to Entries
        </a>
      </Button>
        <div className="flex gap-2 items-center justify-center">
          Display as a format
          {formats.map((x: any) => (
            <Button asChild size="sm" variant="secondary">
              <a href={`/format/${x.id}/entry/${entry.id}/view`}>{x.title}</a>
            </Button>
          ))}
          Or
          <Button asChild size="sm" variant="outline">
            <a href={`/form/${form.id}/formats`}> create new format</a>
          </Button>
        </div>
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
