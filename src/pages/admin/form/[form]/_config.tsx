import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function FormConfig({ formatList }: any) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <form method="post" className="float-end flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" size="sm" variant="outline">
                    Create New
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    name="type"
                    value="json"
                  >
                    JSON
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    name="type"
                    value="text"
                  >
                    TEXT
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    name="type"
                    value="html"
                  >
                    HTML
                  </Button>
                  <Button variant="secondary" size="sm" name="type" value="pdf">
                    PDF
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </form>
            <span className="text-3xl">Formats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {formatList.map((format: any) => (
              <Button asChild variant="outline">
                <a href={`/format/${format.id}/edit`}>
                  <span>{format.title}</span>
                  <Badge className="ms-3">{format.type}</Badge>
                </a>
              </Button>
            ))}
          </div>

          <div className="alert alert-info my-3">
            To Use Format, go Entries and open an entry, then click one of the
            formats.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
