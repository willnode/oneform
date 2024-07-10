import { Button } from "@/components/ui/button";

type Props = {
  list: any[];
};

export default function FormEntries({ list }: Props) {
  return (
    <div className="container my-5">
      <div className="my-3 flex">
        <Button asChild className="ms-auto">
          <a href="./export/csv" download>
            Download CSV
          </a>
        </Button>
      </div>
      <div className="grid grid-cols-1">
        {list.map((entry) => (
          <Button asChild variant="outline">
            <a
              href={`/entry/${entry.id}/view`}
            >
              {entry.created.toString()}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
