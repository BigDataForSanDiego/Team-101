'use client';

import { useState, useEffect } from 'react';
import { useEmployerAuth } from '@/app/context/EmployerAuthContext';
import { useRouter } from 'next/navigation';

export default function EmployerProfilePage() {
  const { employer } = useEmployerAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ company_name: '', contact_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!employer) {
      router.push('/employer/login');
      return;
    }
    
    fetch(`http://localhost:8000/api/v1/profile/employer/${employer.id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          company_name: data.company_name,
          contact_name: data.contact_name || '',
          email: data.email,
          phone: data.phone || ''
        });
        setLoading(false);
      });
  }, [employer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/profile/employer/${employer?.id}`, {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
              />
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
