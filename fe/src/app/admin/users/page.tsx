"use client";
import { useEffect, useState } from "react";

type AdminUser = {
  id: number;
  org_id: number;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{ email: string; phone: string; password: string; org_id: string }>({
    email: "",
    phone: "",
    password: "",
    org_id: "",
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Failed to load admins");
        setItems([]);
      } else {
        // handle both shapes: { items: [...] } or [...]
        const admins = Array.isArray(data) ? data : data.items;
        setItems(Array.isArray(admins) ? admins : []);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load admins");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password || !form.org_id) {
      setError("Email, Password, and Org ID are required");
      return;
    }

    const payload = {
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
      org_id: Number(form.org_id),
    };

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Failed to create admin");
        return;
      }

      // refresh from backend so new + old all appear
      await load();

      // reset form (keep org)
      setForm({ email: "", phone: "", password: "", org_id: form.org_id });
    } catch (e: any) {
      setError(e?.message || "Network error creating admin");
    }
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admins</h1>

      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-medium">Create Admin</h2>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={createAdmin}>
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Org ID (e.g., 2)"
            inputMode="numeric"
            value={form.org_id}
            onChange={(e) => setForm({ ...form, org_id: e.target.value })}
          />
          <button className="bg-black text-white rounded py-2 px-4 md:col-span-1">
            Create
          </button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-medium mb-2">Existing Admins</h2>
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p>No admins yet.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Org</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2">{a.id}</td>
                    <td>{a.email}</td>
                    <td>{a.phone || "-"}</td>
                    <td>{a.org_id}</td>
                    <td>{a.role}</td>
                    <td>{a.is_active ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
