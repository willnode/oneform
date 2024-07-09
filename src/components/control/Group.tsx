import { useWatch } from "react-hook-form";
import Control, { type ControlProps } from "./Control.tsx";

export default function Group({ parentID, form, schema }: ControlProps) {
  let id = [parentID, schema?.id].filter((x) => x).join(".");
  let cond = true;
  let val = useWatch({
    control: form.control,
    name: id,
  });
  if (schema.if && typeof schema.if === "string") {
    // basic sanitasion
    schema.if = schema.if.replace(/[;\n]/g, "");
    var x = new Function("value", schema.if);
    cond = !!x(val);
  }

  return (
    <fieldset
      className={(cond ? "" : "hidden") + " oneform-group"}
      disabled={!cond}
      data-parent={parentID}
      data-if={schema.if}
    >
      {schema.label && <legend>{schema.label}</legend>}
      <div
        className={
          "flex gap-2 " +
          (schema.horizontal ? "items-center flex-row" : "flex-col")
        }
      >
        {schema.children.map((child: any, i: number) => (
          <Control form={form} key={i} schema={child} parentID={id} />
        ))}
      </div>
    </fieldset>
  );
}
