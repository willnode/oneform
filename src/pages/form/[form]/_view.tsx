import { client } from "@/api/client";
import { FormControl } from "@/components/control/FormControl";
import { extractFormData } from "@/components/helper";
import { useState } from "react";

export default function ViewForm({ value, schema, id }: any) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    json: any,
    e: React.BaseSyntheticEvent<object, any, HTMLFormElement> | undefined,
  ) {
    try {
      setLoading(true);
      const form: any = extractFormData(new FormData(e?.target));
      let r = await client.api.form.view[":id"].$post({
        param: { id },
        form,
      });
      let rj = await r.json();
      if (rj.status == "ok") {
        window.location.assign('./posted');
      } else {
        setError(rj.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <FormControl
        onSubmit={onSubmit}
        schema={schema}
        disabled={loading}
        value={value}
      />
    </div>
  );
}
