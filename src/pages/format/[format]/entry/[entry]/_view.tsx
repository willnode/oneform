import { generate } from "@/components/format/json";
import { Button } from "@/components/ui/button";

export default function EntryView({ form, format, entry }: any) {
  return (
    <div>
      <div className="flex gap-2">
        <Button asChild variant="secondary">
          <a href={`/entry/${entry.id}/view`}>Back to Entry</a>
        </Button>
        <Button asChild>
          <a href={`/format/${format.id}/entry/${entry.id}`}>Open Raw</a>
        </Button>
      </div>

      <code className="text-wrap my-5">
        <pre children={generate(form, format, entry)} />
      </code>
    </div>
  );
}
