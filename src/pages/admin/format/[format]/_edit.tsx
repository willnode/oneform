import { Button } from "@/components/ui/button";

export default function EditFormat({ form }: any) {
  return (
    <div>
      <Button asChild variant="secondary">
        <a href={`/form/${form.id}/config`}>
          Back to Form Config
        </a>
      </Button>
      <form id="form" className="my-5">
        <h1 className="display-4">{form.title}</h1>
      </form>
    </div>
  );
}
