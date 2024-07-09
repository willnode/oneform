import { useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import type { ControlProps } from "./Control";

const mimes = {
  all: "*",
  audio: "audio/mpeg",
  video: "video/mp4",
  image: "image/jpeg,image/png",
  pdf: "application/pdf",
  zip: "application/zip,application/x-zip",
  text: "plain/text,application/json,application/csv,application/yaml,application/xml",
  word: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  sheet:
    "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  slides:
    "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export default function File({ parentID, form, schema }: ControlProps) {
  let name = parentID ? `${parentID}.${schema.id}` : schema.id;
  let value = useWatch({
    control: form.control,
    name: name,
  });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {schema.label && <FormLabel>{schema.label}</FormLabel>}
          {
            // schema.accept == "image" && !schema.multiline && (
            //     <img
            //         src={
            //             value?.[schema.id] ||
            //             "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
            //         }
            //         id={`${name}_thumb`}
            //         height="100px"
            //         className="me-2"
            //     />
            // )
          }
          <div className="flex input-group">
            {value && (
              <a
                href={`/upload/file/${value}/`}
                className="btn btn-success"
                target="_blank"
              >
                Open File
              </a>
            )}
            <Input
              type="file"
              accept={
                // @ts-ignore
                mimes[schema.accept] || "*"
              }
              className="form-control"
              data-parent={parentID}
              placeholder={schema.placeholder}
              multiple={schema.multiple}
              name={name}
              required={!!schema.required}
            />
          </div>
        </FormItem>
      )}
    />
  );
}