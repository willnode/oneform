import { client } from "@/api/client";
import { FormControl } from "@/components/control/FormControl";
import { useState } from "react";

export default function EditForm({ value, schema }: any) {
  const [error, setError] = useState("");

  async function onSubmit(json: any) {
    let r = await client.api.form.view.$post({ json });
    let rj = await r.json();
    if (rj.status == "ok") {
      alert(JSON.stringify(rj));
    } else {
      setError(rj.message);
    }
  }

  return (
    <div>
      <FormControl onSubmit={onSubmit} schema={schema} value={value} />
    </div>
  );
}
