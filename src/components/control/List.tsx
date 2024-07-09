import { useFieldArray } from "react-hook-form";
import Control, { type ControlProps } from "./Control.tsx";

export default function List({ parentID, form, schema }: ControlProps) {
  let id = parentID ? `${parentID}.${schema.id}` : schema.id;
  let {fields, append, remove } = useFieldArray({
    control: form.control,
    name: id || '',
  });

  return (
    <div className="card oneform-list" id={id}>
      <div className="card-body">
        <h5 className="card-title flex">
          <span className="flex-grow-1">{schema.label}</span>
          <button
            type="button"
            className="btn btn-sm btn-success"
            // onclick="appendItem(this)"
          >
            Add
          </button>
        </h5>
        <hr />
        <div className="oneform-list-entries" data-list-parent={id}>
          {fields.map((v: any, i: number) => (
            <div
              data-list-parent={id}
              data-index={i}
              className="oneform-list-item"
              key={i}
            >
              <div className="flex items-center">
                <div className="flex-grow-1">
                  <Control
                    form={form}
                    parentID={`${id}.${i}`}
                    schema={schema.child}
                  />
                </div>
                <div className="ms-2 flex flex-col">
                  <button
                    type="button"
                    // onclick="deleteItem(this)"
                    className="btn btn-sm btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
