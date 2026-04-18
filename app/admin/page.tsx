import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Link href="/admin/subscribers" className="card-retro block">
        <h2 className="font-display text-xl text-text">Subscribers</h2>
        <p className="mt-2 text-text/70">View and delete newsletter signups.</p>
      </Link>
      <Link href="/admin/supplements" className="card-retro block">
        <h2 className="font-display text-xl text-text">Supplements</h2>
        <p className="mt-2 text-text/70">Create, edit, and delete supplements.</p>
      </Link>
      <Link href="/admin/profiles" className="card-retro block">
        <h2 className="font-display text-xl text-text">Profiles</h2>
        <p className="mt-2 text-text/70">View users and change roles.</p>
      </Link>
    </div>
  );
}
