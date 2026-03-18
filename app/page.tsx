"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

// Sleek Toast Notification
const Toast = ({ message, type, isVisible, onClose }: any) => {
  if (!isVisible) return null;
  return (
    <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-lg shadow-lg border flex items-center gap-3 transition-all duration-300 animate-fade-in-down ${type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
      <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="font-medium text-sm text-gray-800">{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">✕</button>
    </div>
  );
};

export default function App() {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show Login Screen if not authenticated
  if (!session) {
    return <LoginScreen />;
  }

  // Show Admin Dashboard if authenticated
  return <AdminDashboard session={session} />;
}

/* ==========================================
   LOGIN & PASSWORD RESET SCREEN
========================================== */
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 4000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) showToast(error.message, 'error');
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) showToast(error.message, 'error');
      else {
        showToast('Password reset link sent to your email.', 'success');
        setMode('login');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans">
      <Toast {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />
      
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Permit System</h1>
        <p className="text-sm text-gray-500 mt-1">Authorized Personnel Only</p>
      </div>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {mode === 'login' ? 'Sign in to your account' : 'Reset your password'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="admin@transport.gov.mv" />
          </div>

          {mode === 'login' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <button type="button" onClick={() => setMode('reset')} className="text-xs text-gray-500 hover:text-black font-medium transition-colors">Forgot password?</button>
              </div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="••••••••" />
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium text-sm transition-colors mt-2 disabled:opacity-50">
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Send Reset Link'}
          </button>
        </form>

        {mode === 'reset' && (
          <div className="mt-6 text-center">
            <button onClick={() => setMode('login')} className="text-sm text-gray-500 hover:text-black font-medium transition-colors">← Back to login</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   SECURE ADMIN DASHBOARD
========================================== */
function AdminDashboard({ session }: { session: any }) {
  const [permits, setPermits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // New Admin Creation Modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Permit Form State
  const [formData, setFormData] = useState({
    permit_number: '', owner_name: '', chassis_number: '', engine_number: '', issue_date: '', due_date: '', status: 'Valid'
  });

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('permits').select('*').order('created_at', { ascending: false });
    if (error) showToast('Failed to load permits from database.', 'error');
    else setPermits(data || []);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreatePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('permits').insert([formData]);
    setIsSubmitting(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Permit issued successfully.', 'success');
      setFormData({ permit_number: '', owner_name: '', chassis_number: '', engine_number: '', issue_date: '', due_date: '', status: 'Valid' });
      setIsCreateModalOpen(false);
      fetchPermits();
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Creates a new user in Supabase Auth
    const { error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
    });
    setIsSubmitting(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Admin account created successfully! Check email for confirmation.', 'success');
      setNewUserEmail('');
      setNewUserPassword('');
      setIsUserModalOpen(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDownloadPDF = async (permit: any) => {
    try {
      showToast('Generating official PDF...', 'success');
      const verifyUrl = `${window.location.origin}/verify?verify=${encodeURIComponent(permit.permit_number)}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { type: 'image/jpeg', width: 300, margin: 1, color: { dark: '#111111', light: '#ffffff' }, rendererOpts: { quality: 0.5 } });
      const existingPdfBytes = await fetch('/permit-template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const firstPage = pdfDoc.getPages()[0];
      const qrImage = await pdfDoc.embedJpg(qrCodeDataUrl);
      
      firstPage.drawImage(qrImage, { x: 75, y: 690, width: 70, height: 70 });
      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Permit_${permit.permit_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showToast('Template error. Ensure permit-template.pdf is in public folder.', 'error');
    }
  };

  const totalPermits = permits.length;
  const validPermits = permits.filter(p => p.status === 'Valid').length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-gray-900 overflow-hidden">
      <Toast {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 z-40">
        <div className="font-bold tracking-tight text-lg">Permit System</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      {/* Minimal Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="font-bold text-lg tracking-tight">Permit System</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button className="w-full flex items-center px-3 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm transition-colors">
            <svg className="w-4 h-4 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"></path></svg>
            Registry Overview
          </button>
          <button onClick={() => { setIsUserModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
            <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Manage Admins
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleSignOut} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span>Sign Out</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pt-16 md:pt-0">
        
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Transport & Civil Aviation</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">{session.user.email}</span>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              + Issue Permit
            </button>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-6xl mx-auto w-full">
          
          <div className="md:hidden mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-black text-white p-2 rounded-full shadow-md">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>

          {/* Clean Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Issued</div>
              <div className="text-3xl font-light text-gray-900">{isLoading ? '-' : totalPermits}</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Active</div>
              <div className="text-3xl font-light text-green-600">{isLoading ? '-' : validPermits}</div>
            </div>
          </div>

          {/* Clean Data Table (Desktop & Tablet) */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Permit No.</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner Details</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {permits.map((permit) => (
                  <tr key={permit.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{permit.permit_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{permit.owner_name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">Chassis: {permit.chassis_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${permit.status === 'Valid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${permit.status === 'Valid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {permit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDownloadPDF(permit)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-xs transition-colors">PDF</button>
                        <a href={`/verify?verify=${permit.permit_number}`} target="_blank" className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium text-xs transition-colors">Verify</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clean Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {permits.map((permit) => (
              <div key={permit.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900">{permit.permit_number}</div>
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${permit.status === 'Valid' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="text-sm text-gray-600 mb-4">{permit.owner_name} <span className="text-gray-400 block text-xs mt-0.5">{permit.chassis_number}</span></div>
                <div className="flex gap-2">
                  <button onClick={() => handleDownloadPDF(permit)} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium text-xs">Download PDF</button>
                  <a href={`/verify?verify=${permit.permit_number}`} target="_blank" className="flex-1 bg-white border border-gray-300 text-gray-800 py-2 rounded-lg font-medium text-xs text-center">Verify Link</a>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ISSUE PERMIT MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-semibold text-gray-900">New Import Permit</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-900">✕</button>
              </div>
              
              <form onSubmit={handleCreatePermit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Permit Number</label>
                  <input required name="permit_number" value={formData.permit_number} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="TA-T(L)2026/0060" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Owner Name</label>
                  <input required name="owner_name" value={formData.owner_name} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="HASSAAN KHALIDH" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Chassis No.</label>
                    <input required name="chassis_number" value={formData.chassis_number} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Engine No.</label>
                    <input required name="engine_number" value={formData.engine_number} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Issue Date</label>
                    <input type="date" required name="issue_date" value={formData.issue_date} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Due Date</label>
                    <input type="date" required name="due_date" value={formData.due_date} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black">
                    <option value="Valid">Valid</option>
                    <option value="Expired">Expired</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving to Database...' : 'Save Permit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE ADMIN MODAL */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-semibold text-gray-900">Create Admin Account</h3>
                  <p className="text-xs text-gray-500 mt-0.5">They will receive an email to confirm.</p>
                </div>
                <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-900">✕</button>
              </div>
              
              <form onSubmit={handleCreateAdmin} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Staff Email Address</label>
                  <input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="staff@transport.gov.mv" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Temporary Password</label>
                  <input required type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="••••••••" minLength={6} />
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Create Account'}
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