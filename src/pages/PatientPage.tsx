import React, { useEffect, useState } from 'react';
import { Database, Shield, Share2, Clock, Plus, LogIn, UserPlus, FileDown } from 'lucide-react';

const PatientPage = () => {
  const features = [
    {
      icon: Database,
      title: "Historical Records Access",
      description: "Retrieve your complete medical history from affiliated hospitals and clinics"
    },
    {
      icon: Shield,
      title: "Consent-Based Sharing",
      description: "You control who accesses your data with granular consent management"
    },
    {
      icon: Share2,
      title: "Seamless Portability",
      description: "Take your medical records anywhere with standardized data formats"
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Immediate access to new medical records and test results"
    }
  ];

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dateOfVisit, setDateOfVisit] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [docs, setDocs] = useState<Array<{ id: string; date_of_visit: string; hospital_name?: string; file_url: string }>>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-verification gating state
  const [isDocsUnlocked, setIsDocsUnlocked] = useState(false);
  const [verifyPass, setVerifyPass] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showRecords, setShowRecords] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auth_token');
    if (saved) setToken(saved);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (!res.ok) throw new Error('Authentication failed');
      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      // Ensure older docs remain locked until explicit verification
      setIsDocsUnlocked(false);
      setDocs([]);
      setShowRecords(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setIsDocsUnlocked(false);
    setDocs([]);
    setVerifyPass('');
    setVerifyError(null);
    setShowRecords(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !dateOfVisit) {
      setError('Please select a PDF and provide date of visit');
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('date_of_visit', dateOfVisit);
      form.append('hospital_name', hospitalName);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form
      });
      if (!res.ok) throw new Error('Upload failed');
      setFile(null);
      setDateOfVisit('');
      setHospitalName('');
      // Only refresh the list if unlocked (otherwise keep hidden and avoid fetch)
      if (isDocsUnlocked) {
        await fetchDocs();
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDocs = async () => {
    if (!token || !isDocsUnlocked) return;
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      setDocs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isDocsUnlocked]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: verifyPass })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: 'Verification failed' }));
        throw new Error(msg.error || 'Verification failed');
      }
      setIsDocsUnlocked(true);
      setVerifyPass('');
      await fetchDocs();
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewOlderClick = () => {
    setShowRecords(true);
    if (isDocsUnlocked) {
      fetchDocs();
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Patient Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take control of your healthcare data with secure, consent-based access 
            to your medical records across all healthcare providers.
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Left column: Auth + Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {!token ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{authMode === 'login' ? 'Login' : 'Register'}</h3>
                  <button className="text-sm text-green-700 underline" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
                  </button>
                </div>
                <form onSubmit={handleAuth} className="space-y-3">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Name</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input className="w-full border rounded-lg px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                    <input className="w-full border rounded-lg px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center justify-center">
                    {authMode === 'login' ? <LogIn className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    {authMode === 'login' ? 'Login' : 'Register'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Add New Record</h3>
                  <button onClick={handleLogout} className="text-sm text-red-600 underline">Logout</button>
                </div>
                <form onSubmit={handleUpload} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">PDF File</label>
                    <input className="w-full border rounded-lg px-3 py-2" type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Date of Visit</label>
                    <input className="w-full border rounded-lg px-3 py-2" type="date" value={dateOfVisit} onChange={e => setDateOfVisit(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Hospital Name (optional)</label>
                    <input className="w-full border rounded-lg px-3 py-2" value={hospitalName} onChange={e => setHospitalName(e.target.value)} placeholder="City General Hospital" />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button disabled={isUploading} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Add New Record'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right column: Older records area controlled via button */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Records</h3>
              {token && (
                <button onClick={handleViewOlderClick} className="text-sm text-green-700 underline">View Older Records</button>
              )}
            </div>

            {!token && (
              <p className="text-sm text-gray-600">Login to view your previous documents.</p>
            )}

            {token && showRecords && !isDocsUnlocked && (
              <div>
                <p className="text-sm text-gray-600 mb-3">For your security, please re-enter your password to view older documents.</p>
                <form onSubmit={handleVerify} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                    <input className="w-full border rounded-lg px-3 py-2" type="password" value={verifyPass} onChange={e => setVerifyPass(e.target.value)} placeholder="••••••••" />
                  </div>
                  {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}
                  <button disabled={isVerifying} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {isVerifying ? 'Verifying...' : 'Verify Password'}
                  </button>
                </form>
              </div>
            )}

            {token && showRecords && isDocsUnlocked && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">Your Documents</h4>
                  <button onClick={fetchDocs} className="text-sm text-green-700 underline">Refresh</button>
                </div>
                {loadingDocs ? (
                  <p className="text-gray-600">Loading...</p>
                ) : docs.length === 0 ? (
                  <p className="text-gray-600">No documents yet.</p>
                ) : (
                  <ul className="divide-y">
                    {docs.map(d => (
                      <li key={d.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.date_of_visit}</p>
                          <p className="text-sm text-gray-600">{d.hospital_name || '—'}</p>
                        </div>
                        <a href={d.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-green-700 hover:text-green-800">
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Minimized features at the bottom */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-200">
              <feature.icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientPage;