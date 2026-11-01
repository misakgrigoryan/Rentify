import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, X } from "lucide-react";
import api from "../../lib/api.js";

// Lets the owner pick a photo from the phone's gallery or camera.
// The photo is uploaded through our server, and its web address is passed back up.
export default function ImageUpload({ value, onChange }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const dataUrl = await readFile(file);
      const res = await api.post("/uploads", { image: dataUrl });
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || t("upload.error"));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{t("upload.label")}</span>
      {value ? (
        <div className="relative w-full overflow-hidden rounded-2xl bg-bg ring-1 ring-border">
          <img src={value} alt="" className="h-48 w-full object-contain p-3" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={t("upload.remove")}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-md"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-bg p-6 text-center text-sm font-semibold text-primary hover:border-primary">
          <ImagePlus size={28} />
          {busy ? t("upload.uploading") : t("upload.choose")}
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} disabled={busy} className="hidden" />
        </label>
      )}
      {error && <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
