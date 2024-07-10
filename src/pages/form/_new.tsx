import { client } from "@/api/client";
import { EditorFormControl } from "@/components/control/FormControl";
import { useState } from "react";

export default function NewForm({ value }: any) {
  const [error, setError] = useState("");

  async function onSubmit(json: any) {
    let r = await client.api.form.new.$post({ json });
    let rj = await r.json();
    if (rj.status == "ok") {
      alert(JSON.stringify(rj));
    } else {
      setError(rj.message);
    }
  }

  return (
    <div>
      <EditorFormControl onSubmit={onSubmit} value={value} />
    </div>
  );
}
