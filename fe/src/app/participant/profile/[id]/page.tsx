'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { useRouter, useParams } from 'next/navigation';

export default function ParticipantProfilePage() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [formData, setFormData] = useState({ display_name: '', phone: '', email: '', preferred_contact: 'NONE' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!admin) {
      return;
    }
    
    fetch(`http://localhost:8000/api/v1/profile/participant/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          display_name: data.display_name,
          phone: data.phone || '',
          email: data.email || '',
          preferred_contact: data.preferred_contact
        });
        setLoading(false);
      });
  }, [admin, router, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/profile/participant/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Profile updated successfully');
      } else {
        const error = await res.json();
        alert(error.detail || 'Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
              <select
                value={formData.preferred_contact}
                onChange={(e) => setFormData(prev => ({ ...prev, preferred_contact: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="NONE">None</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-white font-semibold rounded-lg transition disabled:opacity-50"
              style={{ backgroundColor: 'rgba(0, 0, 58, 0.95)' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
