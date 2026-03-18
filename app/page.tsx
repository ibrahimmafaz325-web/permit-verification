"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [permits, setPermits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    permit_number: '',
    owner_name: '',
    chassis_number: '',
    engine_number: '',
    issue_date: '',
    due_date: '',
    status: 'Valid'
  });

  // Fetch permits on load
  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('permits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching permits:', error);
    } else {
      setPermits(data || []);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreatePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('permits')
      .insert([formData]);

    setIsSubmitting(false);

    if (error) {
      alert(`Error creating permit: ${error.message}`);
    } else {
      // Reset form and close modal
      setFormData({
        permit_number: '',
        owner_name: '',
        chassis_number: '',
        engine_number: '',
        issue_date: '',
        due_date: '',
        status: 'Valid'
      });
      setIsCreateModalOpen(false);
      // Refresh the table
      fetchPermits();
    }
  };

  // Calculate stats
  const totalPermits = permits.length;
  const validPermits = permits.filter(p => p.status === 'Valid').length;
  const expiredPermits = permits.filter(p => p.status === 'Expired' || p.status === 'Revoked').length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e2025] text-white flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-[#17191c]">
          <h1 className="text-lg font-bold text-white tracking-wide">Permit Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center px-4 py-2.5 bg-[#253282] text-white rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <button onClick={fetchPermits} className="w-full flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors text-left">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Refresh Permits
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="w-full flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors text-left">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Issue New Permit
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Ministry of Transport & Civil Aviation</h2>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#253282] text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-600">Admin User</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Dashboard Overview</h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#198754] hover:bg-[#157347] text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Create Permit
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Permits Issued</div>
              <div className="text-3xl font-bold text-gray-900">{isLoading ? '-' : totalPermits}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Active / Valid</div>
              <div className="text-3xl font-bold text-[#198754]">{isLoading ? '-' : validPermits}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Expired / Revoked</div>
              <div className="text-3xl font-bold text-red-600">{isLoading ? '-' : expiredPermits}</div>
            </div>
          </div>

          {/* Recent Permits Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">Recent Permits</h4>
              <input 
                type="text" 
                placeholder="Search by Permit or Chassis..." 
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#253282] focus:border-transparent"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">Permit Number</th>
                    <th className="px-6 py-3 font-medium">Owner</th>
                    <th className="px-6 py-3 font-medium">Chassis No.</th>
                    <th className="px-6 py-3 font-medium">Issue Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading permits from database...</td>
                    </tr>
                  ) : permits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No permits found. Create one to get started.</td>
                    </tr>
                  ) : (
                    permits.map((permit) => (
                      <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{permit.permit_number}</td>
                        <td className="px-6 py-4 text-gray-700">{permit.owner_name}</td>
                        <td className="px-6 py-4 text-gray-700">{permit.chassis_number}</td>
                        <td className="px-6 py-4 text-gray-700">{permit.issue_date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            permit.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {permit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a href={`/verify?verify=${permit.permit_number}`} target="_blank" rel="noreferrer" className="text-[#253282] hover:text-[#1c2665] font-medium">
                            Verify Page
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Create Permit Modal Overlay */}
        {isCreateModalOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-lg">Issue New Permit</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <form onSubmit={handleCreatePermit}>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit Number *</label>
                    <input required name="permit_number" value={formData.permit_number} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. TA-T(L)2026/0060" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                    <input required name="owner_name" value={formData.owner_name} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. HASSAAN KHALIDH" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number *</label>
                    <input required name="chassis_number" value={formData.chassis_number} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. FE13-420261" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number *</label>
                    <input required name="engine_number" value={formData.engine_number} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. 6AA-FE13" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                      <input required name="issue_date" value={formData.issue_date} onChange={handleInputChange} type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                      <input required name="due_date" value={formData.due_date} onChange={handleInputChange} type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]">
                      <option value="Valid">Valid</option>
                      <option value="Expired">Expired</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#253282] hover:bg-[#1c2665] text-white rounded-md transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Permit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}