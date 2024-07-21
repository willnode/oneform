import { client } from "@/api/client";
import { EditorViewControl } from "@/components/control/FormControl";
import { extractFormData } from "@/components/helper";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";

export default function EditForm({ value }: any) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    json: any,
    e: React.BaseSyntheticEvent<object, any, HTMLFormElement> | undefined,
  ) {
    try {
      setLoading(true);
      const form: any = extractFormData(new FormData(e?.target));
      let r = await client.api.form.edit[":id"].$post({
        param: { id: value.id },
        form,
      });
      let rj = await r.json();
      if (rj.status == "ok") {
        toast("Form is saved");
      } else {
        setError(rj.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <EditorViewControl onSubmit={onSubmit} disabled={loading} value={value} />
      <Toaster />
    </div>
  );
}
