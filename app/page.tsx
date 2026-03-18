"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
// Import our new secure server actions
import { fetchAdminUsers, deleteAdminUser, updateAdminPassword } from './actions';

// Helper function to translate YYYY-MM-DD into Dhivehi format
const formatDhivehiDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; 
  
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const months = [
    "ޖެނުއަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރީލް",
    "މޭ", "ޖޫން", "ޖުލައި", "އޮގަސްޓް",
    "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ"
  ];
  
  return `${day} ${months[monthIndex]} ${year}`;
};

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
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

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

  if (!session) {
    return <LoginScreen />;
  }

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
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="admin@transport.gov.mv" />
          </div>

          {mode === 'login' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <button type="button" onClick={() => setMode('reset')} className="text-xs text-gray-500 hover:text-black font-medium transition-colors">Forgot password?</button>
              </div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="••••••••" />
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
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Admin User Management State
  const [adminList, setAdminList] = useState<any[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Permit Form State
  const emptyForm = {
    permit_number: '', owner_name: '', chassis_number: '', engine_number: '', issue_date: '', due_date: '', status: 'Valid'
  };
  const [formData, setFormData] = useState(emptyForm);

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

  // Fetch Admins whenever the Manage Admins modal opens
  useEffect(() => {
    if (isUserModalOpen) {
      loadAdminUsers();
    }
  }, [isUserModalOpen]);

  const loadAdminUsers = async () => {
    setIsLoadingAdmins(true);
    try {
      const users = await fetchAdminUsers();
      setAdminList(users);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
    setIsLoadingAdmins(false);
  };

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

  const openNewPermitModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsCreateModalOpen(true);
  };

  const openEditPermitModal = (permit: any) => {
    setFormData({
      permit_number: permit.permit_number,
      owner_name: permit.owner_name,
      chassis_number: permit.chassis_number,
      engine_number: permit.engine_number,
      issue_date: permit.issue_date,
      due_date: permit.due_date,
      status: permit.status
    });
    setEditingId(permit.id);
    setIsCreateModalOpen(true);
  };

  const handleSavePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let error;

    if (editingId) {
      const { error: updateError } = await supabase.from('permits').update(formData).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('permits').insert([formData]);
      error = insertError;
    }
    
    setIsSubmitting(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(editingId ? 'Permit updated successfully.' : 'Permit issued successfully.', 'success');
      setFormData(emptyForm);
      setEditingId(null);
      setIsCreateModalOpen(false);
      fetchPermits();
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
    });
    setIsSubmitting(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Admin account created successfully!', 'success');
      setNewUserEmail('');
      setNewUserPassword('');
      loadAdminUsers(); // Refresh the list
    }
  };

  // Secure Delete Admin
  const handleDeleteAdmin = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? They will lose all access immediately.")) return;
    setIsSubmitting(true);
    try {
      await deleteAdminUser(userId);
      showToast('User deleted successfully.', 'success');
      loadAdminUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
    setIsSubmitting(false);
  };

  // Secure Change Password
  const handleChangePassword = async (userId: string) => {
    const newPass = window.prompt("Enter new password for this user (minimum 6 characters):");
    if (!newPass) return;
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateAdminPassword(userId, newPass);
      showToast('Password updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
    setIsSubmitting(false);
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
            <button onClick={openNewPermitModal} className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              + Issue Permit
            </button>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-6xl mx-auto w-full">
          
          <div className="md:hidden mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <button onClick={openNewPermitModal} className="bg-black text-white p-2 rounded-full shadow-md">
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
                        <button onClick={() => openEditPermitModal(permit)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-xs transition-colors">Edit</button>
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
                <div className="flex gap-2 mb-2">
                  <button onClick={() => openEditPermitModal(permit)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium text-xs transition-colors">Edit</button>
                  <button onClick={() => handleDownloadPDF(permit)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium text-xs transition-colors">PDF</button>
                </div>
                <a href={`/verify?verify=${permit.permit_number}`} target="_blank" className="block w-full bg-white border border-gray-300 text-gray-800 py-2 rounded-lg font-medium text-xs text-center">Open Verification Page</a>
              </div>
            ))}
          </div>

        </div>

        {/* CREATE / EDIT PERMIT MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] sm:p-4 overflow-hidden">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up overflow-hidden relative">
              
              {/* Mobile Drag Indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden absolute top-0 left-0">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white mt-2 sm:mt-0">
                <h3 className="font-bold text-gray-900 text-xl sm:text-lg">
                  {editingId ? 'Edit Permit' : 'New Import Permit'}
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              </div>
              
              <form onSubmit={handleSavePermit} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Permit Number</label>
                    <input required name="permit_number" value={formData.permit_number} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="TA-T(L)2026/0060" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Owner Name</label>
                    <input required name="owner_name" value={formData.owner_name} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="HASSAAN KHALIDH" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Chassis No.</label>
                      <input required name="chassis_number" value={formData.chassis_number} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Engine No.</label>
                      <input required name="engine_number" value={formData.engine_number} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Issue Date</label>
                      <input type="date" required name="issue_date" value={formData.issue_date} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                      <input type="date" required name="due_date" value={formData.due_date} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-[16px] text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none">
                      <option value="Valid">Valid</option>
                      <option value="Expired">Expired</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white mt-auto">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-[16px] transition-colors disabled:opacity-50 shadow-lg shadow-black/10 active:scale-[0.98]">
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Permit' : 'Save Permit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MANAGE ADMINS MODAL */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] sm:p-4 overflow-hidden">
            <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up overflow-hidden relative">
              
              {/* Mobile Drag Indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden absolute top-0 left-0">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white mt-2 sm:mt-0">
                <div>
                  <h3 className="font-bold text-gray-900 text-xl sm:text-lg">Manage Admins</h3>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Add, edit, or remove access to the system.</p>
                </div>
                <button onClick={() => setIsUserModalOpen(false)} className="bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                {/* Add New Admin Form */}
                <form onSubmit={handleCreateAdmin} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6">
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Add New Admin</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full sm:flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[16px] sm:text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="staff@transport.gov.mv" />
                    <input required type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full sm:flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[16px] sm:text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="Temp Password (min 6)" minLength={6} />
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-6 py-3.5 sm:py-2 rounded-xl font-bold sm:font-medium text-[16px] sm:text-sm transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </form>

                {/* Admin List Table */}
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Active Admins</h4>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  {isLoadingAdmins ? (
                    <div className="p-8 text-center text-sm text-gray-500">Loading users...</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {adminList.map((admin) => {
                        const isCurrentUser = session?.user?.id === admin.id;
                        return (
                          <div key={admin.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-2 text-[16px] sm:text-sm">
                                {admin.email}
                                {isCurrentUser && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 sm:hidden">Created: {admin.created_at}</div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 hidden sm:block mr-2">{admin.created_at}</span>
                              <button onClick={() => handleChangePassword(admin.id)} className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 sm:py-1.5 px-3 rounded-xl sm:rounded-lg text-[14px] sm:text-xs font-bold sm:font-medium transition-colors text-center">Edit Password</button>
                              {!isCurrentUser && (
                                <button onClick={() => handleDeleteAdmin(admin.id)} className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-600 py-3 sm:py-1.5 px-3 rounded-xl sm:rounded-lg text-[14px] sm:text-xs font-bold sm:font-medium transition-colors text-center">Delete</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}