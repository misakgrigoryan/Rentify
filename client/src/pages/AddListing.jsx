import PageShell from "../components/ui/PageShell.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

export default function AddListing() {
  return (
    <PageShell title="Add a listing" subtitle="Tell renters what you are offering.">
      <form className="grid max-w-2xl gap-4 rounded-xl bg-surface p-6 shadow-sm" onSubmit={(e) => e.preventDefault()}>
        <Input id="title" label="Title" />
        <Input id="description" label="Description" />
        <div className="grid grid-cols-2 gap-4">
          <Input id="price" label="Price" type="number" />
          <Input id="location" label="Location" />
        </div>
        <Button type="submit">Publish</Button>
      </form>
    </PageShell>
  );
}
