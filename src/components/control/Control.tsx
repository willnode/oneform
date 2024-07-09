import Number from "./Number.tsx";
import Option from "./Option.tsx";
import Text from "./Text.tsx";
import Group from "./Group.tsx";
import List from "./List.tsx";
import Checkbox from "./Checkbox.tsx";
import Hidden from "./Hidden.tsx";
import Time from "./Time.tsx";
import File from "./File.tsx";
import { useForm } from "react-hook-form";

export type ControlProps = {
  parentID: string;
  schema: any;
  form: ReturnType<typeof useForm>;
};

export default function Control({
  parentID: pID,
  schema,
  form,
}: ControlProps) {
  return (
    <>
      {schema?.type === "hidden" && (
        <Hidden parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "checkbox" && (
        <Checkbox parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "time" && (
        <Time parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "number" && (
        <Number parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "option" && (
        <Option parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "text" && (
        <Text parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "file" && (
        <File parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "group" && (
        <Group parentID={pID} form={form} schema={schema} />
      )}
      {schema?.type === "list" && (
        <List parentID={pID} form={form} schema={schema} />
      )}
    </>
  );
}
