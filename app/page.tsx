"use client";

import React, { useState } from 'react';

// Mock data for the dashboard to show what it will look like when connected to Supabase
const mockPermits = [
  {
    id: 1,
    permit_number: 'TA-T(L)2026/0060',
    owner: 'HASSAAN KHALIDH',
    chassis: 'FE13-420261',
    issue_date: '2026-01-20',
    due_date: '2026-03-20',
    status: 'Valid'
  },
  {
    id: 2,
    permit_number: 'TA-T(L)2026/0061',
    owner: 'AHMED NAEEM',
    chassis: 'NKE165-302911',
    issue_date: '2026-02-15',
    due_date: '2026-04-15',
    status: 'Valid'
  },
  {
    id: 3,
    permit_number: 'TA-T(L)2025/0890',
    owner: 'FATHIMATH SHIFA',
    chassis: 'GP5-3029981',
    issue_date: '2025-11-10',
    due_date: '2026-01-10',
    status: 'Expired'
  }
];

export default function AdminDashboard() {
  // Add state to handle the Create Permit modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // A simple function to handle button clicks for now
  const handleNotImplemented = (actionName: string) => {
    alert(`${actionName} feature will be connected to Supabase in the next step!`);
  };

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
          <button onClick={() => handleNotImplemented('Permits List')} className="w-full flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors text-left">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Permits List
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="w-full flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors text-left">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Issue New Permit
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => handleNotImplemented('Logout')} className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white transition-colors">
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNotImplemented('User Profile')}>
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
              <div className="text-3xl font-bold text-gray-900">1,248</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Active / Valid</div>
              <div className="text-3xl font-bold text-[#198754]">982</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Expired / Revoked</div>
              <div className="text-3xl font-bold text-red-600">266</div>
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
                  {mockPermits.map((permit) => (
                    <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{permit.permit_number}</td>
                      <td className="px-6 py-4 text-gray-700">{permit.owner}</td>
                      <td className="px-6 py-4 text-gray-700">{permit.chassis}</td>
                      <td className="px-6 py-4 text-gray-700">{permit.issue_date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          permit.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleNotImplemented(`Edit Permit ${permit.permit_number}`)} className="text-[#253282] hover:text-[#1c2665] font-medium mr-3">Edit</button>
                        <button onClick={() => handleNotImplemented(`View QR for ${permit.permit_number}`)} className="text-gray-500 hover:text-gray-700 font-medium">View QR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
              <span>Showing 1 to 3 of 1,248 entries</span>
              <div className="flex gap-1">
                <button onClick={() => handleNotImplemented('Previous Page')} className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 transition-colors">Prev</button>
                <button onClick={() => handleNotImplemented('Next Page')} className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700 transition-colors">Next</button>
              </div>
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
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. HASSAAN KHALIDH" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. FE13-420261" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#253282]" placeholder="e.g. 6AA-FE13" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={() => { handleNotImplemented('Save to Database'); setIsCreateModalOpen(false); }} className="px-4 py-2 bg-[#253282] hover:bg-[#1c2665] text-white rounded-md transition-colors">Save Permit</button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}