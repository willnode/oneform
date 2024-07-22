// Editor.jsx
import { client } from "@/api/client";
import config from "@/components/editor/puck";
import { Toaster } from "@/components/ui/toaster";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { toast } from "sonner";

// Save the data to your database
const save = (id: string) => {
  return async (data: Data) => {
    console.log(data);
    localStorage.setItem('puck-data', JSON.stringify(data));
    let r = await client.api.view.builder[":id"].$post({
      param: { id },
      json: data,
    });
    let rj = await r.json();
    if (rj.status == "ok") {
      toast("Form is saved");
    } else {
      // setError(rj.message);
    }
  }
};

// Render Puck editor
export default function Editor({ id, schema }: { id: string, schema: any }) {
  return <div>
    <Puck config={config} data={schema || {}} onPublish={save(id)} />
    <div style={{ zIndex: 1000, position: 'absolute', top: 0 }}>
      <Toaster />
    </div>
  </div>
}