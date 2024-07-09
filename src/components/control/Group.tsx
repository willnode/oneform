import { useWatch } from "react-hook-form";
import Control, { type ControlProps } from "./Control.tsx";
import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import jexl from "jexl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Button } from "../ui/button.tsx";

export default function Group({ parentID, form, schema }: ControlProps) {
  let id = [parentID, schema.id].filter((x) => x).join(".");
  let cond = true;
  let val = useWatch({
    control: form.control,
    ...(parentID ? { name: parentID } : {}),
  });
  if (schema.if && typeof schema.if === "string") {
    try {
      cond = jexl.evalSync(schema.if, val);
    } catch (error) {
      cond = false;
    }
  }

  let child = schema.children.map((child: any, i: number) => (
    <Control form={form} key={i} schema={child} parentID={id} />
  ));

  return (
    cond && (
      <fieldset
        className={clsx(
          "oneform-group",
          schema.variant == "dropdown" || "grow",
        )}
        data-if={schema.if}
      >
        {schema.id ? (
          <Card className="oneform-list" id={id}>
            <CardHeader>
              <CardTitle>{schema.label}</CardTitle>
            </CardHeader>
            <CardContent>{child}</CardContent>
          </Card>
        ) : schema.variant == "dropdown" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" variant="outline">
                {schema.label || "..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3">
              {child}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div
            className={clsx(
              "flex gap-2",
              schema.horizontal ? "items-center flex-row" : "flex-col",
            )}
          >
            {child}
          </div>
        )}
      </fieldset>
    )
  );
}
