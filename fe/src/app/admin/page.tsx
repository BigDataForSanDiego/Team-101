import { cookies } from "next/headers";

export default async function AdminHome() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.SESSION_COOKIE_NAME ?? "relink_session");

  if (!token) {
    return (
      <main className="p-6">
        <p>Not signed in.</p>
        <a className="underline" href="/admin/login">
          Go to login
        </a>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p>Welcome back, you’re signed in ✅</p>
      <a className="underline" href="/admin/users">
        Manage Admins →
      </a>
    </main>
  );
}
