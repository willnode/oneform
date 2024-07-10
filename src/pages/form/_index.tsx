import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  list: any[];
};
export default function ListForm({ list }: Props) {
  return (
    <>
      <Button className="float-end" asChild>
        <a href="/form/new"> New</a>
      </Button>
      <h1 className="text-2xl mb-5">Form List</h1>

      <div className="list-group grid xl:grid-cols-3 md:grid-cols-2 my-3 gap-3">
        {list.map((form) => (
          <Button variant="outline" asChild>
            <a href={`/form/${form.id}/edit`}>{form.title}</a>
          </Button>
        ))}
      </div>
    </>
  );
}
