import { useFieldArray } from "react-hook-form";
import Control, { type ControlProps } from "./Control.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Button } from "../ui/button.tsx";
import React from "react";

export default function List({ parentID, form, schema }: ControlProps) {
  let id = parentID ? `${parentID}.${schema.id}` : schema.id;
  let { fields, append, remove } = useFieldArray({
    control: form.control,
    name: id || "",
  });

  return (
    <Card className="oneform-list" id={id}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="grow">{schema.label}</span>
          <Button
            type="button"
            size="sm"
            onClick={() => append({})}
            variant="secondary"
          >
            Add
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <hr />
        <div className="oneform-list-entries space-y-2" data-list-parent={id}>
          {fields.map((v: any, i: number) => (
            <React.Fragment key={fields.length + " " + i}>
              <hr />
              <div
                data-list-parent={id}
                data-index={i}
                className="flex items-start oneform-list-item"
              >
                <div className="grow">
                  <Control
                    form={form}
                    parentID={`${id}.${i}`}
                    schema={schema.child}
                  />
                </div>
                <div className="ms-2 mt-1.5 flex flex-col">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => remove(i)}
                    variant="destructive"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
