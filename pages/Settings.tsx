import React, { useState, useRef, useMemo } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Palette, 
  LogOut,
  Edit2,
  AlertTriangle,
  Upload,
  Check,
  Loader2,
  X,
  ExternalLink
} from 'lucide-react';

// Mock initial data
const INITIAL_DATA = {
    displayName: "Alex Trader",
    email: "alex@example.com",
    bio: "Crypto enthusiast focusing on swing trading and technical analysis. Looking to automate my strategies.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuJTguZmVI-HheCTs1929wh2jWEtx9Qk-vr6ETSLTvynDVIfkwxeSwOwKXY1enoji0_LLVsY02_CI_hFdESMReIvIgxicAiVhKt6nqAe5q0cEZg9TkC7Zu0Egi-ySa7Dgg46Os7g-CjLKmnrUtpOEum2xRcccChyuzg4pphoVRhWBj06I3X1LwRExs1Ua_orgzWx2TeJoGaY14CcelTF5TeYHNCkpHuF3r8e252F8ECZM6ZHyvnzFeFGAMEmJB8thkbys3mPSLJdk"
};

const Settings: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [savedData, setSavedData] = useState(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current form data differs from saved data
  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);

  // Calculate setup progress dynamically
  const progress = useMemo(() => {
      let completed = 0;
      let total = 4; // Name, Email, Bio, Avatar
      
      if (formData.displayName.trim().length > 2) completed++;
      if (formData.email.includes('@') && formData.email.includes('.')) completed++;
      if (formData.bio.trim().length > 10) completed++;
      if (formData.avatar) completed++;
      
      return Math.round((completed / total) * 100);
  }, [formData]);

  const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleChange('avatar', reader.result as string);
              showNotification('success', 'Avatar updated');
          };
          reader.readAsDataURL(file);
      }
  };

  const handleViewPublicProfile = () => {
      // Simulate copying link or opening
      navigator.clipboard.writeText(`https://traderone.app/u/${formData.displayName.replace(/\s+/g, '').toLowerCase()}`);
      showNotification('success', 'Profile link copied to clipboard!');
  };

  const handleSave = () => {
      // Validation
      if (formData.displayName.trim().length < 3) {
          showNotification('error', 'Display name must be at least 3 characters');
          return;
      }
      if (!formData.email.includes('@')) {
          showNotification('error', 'Please enter a valid email address');
          return;
      }

      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
          setSavedData(formData);
          setIsSaving(false);
          showNotification('success', 'Changes saved successfully');
      }, 1000);
  };

  const handleDiscard = () => {
      if (window.confirm("Discard unsaved changes?")) {
          setFormData(savedData);
          showNotification('success', 'Changes discarded');
      }
  };

  const handleDeleteAccount = () => {
      const confirmed = window.confirm("Are you ABSOLUTELY sure? This action cannot be undone.");
      if (confirmed) {
          // In a real app, this would call an API
          setIsSaving(true);
          setTimeout(() => {
             alert("Account deletion scheduled. Redirecting...");
             window.location.reload(); // Simulate logout/reset
          }, 1500);
      }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex flex-1 flex-col h-full relative animate-in fade-in duration-500">
      
      {/* Notification Toast */}
      {notification && (
          <div className={`fixed top-4 right-4 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
              notification.type === 'success' ? 'bg-emerald-600 dark:bg-primary text-white dark:text-black' : 'bg-red-500 text-white'
          }`}>
              {notification.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
              <span className="font-bold">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70"><X size={16}/></button>
          </div>
      )}

      <div className="flex flex-col w-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
        {/* Header */}
        <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase font-display mb-2">Account Settings</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg">Manage your profile, preferences, and trading environment.</p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Avatar Card */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-white/5 relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
                    <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick} title="Click to change avatar">
                        <div 
                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-cover bg-center border-4 border-gray-100 dark:border-surface-input transition-transform group-hover/avatar:scale-105" 
                            style={{ backgroundImage: `url("${formData.avatar}")` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                            <Upload size={24} className="text-white" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">{formData.displayName || 'Unnamed Trader'}</h2>
                            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-primary border border-emerald-200 dark:border-primary/20">Pro Member</span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 mb-4">@{formData.displayName.replace(/\s+/g, '').toLowerCase() || 'user'} • Member since Oct 2023</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                            <button 
                                onClick={handleAvatarClick}
                                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-surface-input border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-white hover:border-emerald-500 dark:hover:border-primary/50 hover:text-emerald-600 dark:hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={14} /> Change Avatar
                            </button>
                            <button 
                                onClick={handleViewPublicProfile}
                                className="px-4 py-2 rounded-lg bg-transparent border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <ExternalLink size={14} /> View Public Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="col-span-1 rounded-2xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-white/5 flex flex-col justify-center shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg font-display">Setup Progress</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm">Complete your profile</p>
                    </div>
                    <span className={`text-3xl font-black font-display ${progress === 100 ? 'text-emerald-600 dark:text-primary' : 'text-gray-900 dark:text-white'}`}>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-surface-input rounded-full h-3 mb-3 overflow-hidden">
                    <div 
                        className="bg-emerald-500 dark:bg-primary h-3 rounded-full shadow-sm dark:shadow-neon transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500">
                    {progress === 100 
                        ? "Profile complete! You're all set." 
                        : "Next: Add your phone number for 2FA security."}
                </p>
            </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
            <section className="glass-panel p-6 md:p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-primary/10 text-emerald-600 dark:text-primary"><User size={20} /></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-slate-300">Display Name</span>
                        <input 
                            value={formData.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-surface-input px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all shadow-sm" 
                            placeholder="Enter your name"
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-slate-300">Email Address</span>
                        <input 
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-surface-input px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all shadow-sm" 
                            placeholder="name@example.com"
                        />
                    </label>
                    <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-slate-300">Bio</span>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className="w-full resize-none rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-surface-input px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all shadow-sm" 
                            rows={3} 
                            placeholder="Tell us a bit about yourself..."
                        ></textarea>
                    </label>
                </div>
            </section>

            <section className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500"><AlertTriangle size={20} /></div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-500 font-display">Danger Zone</h3>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-900 dark:text-white font-medium">Delete Account</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button 
                        onClick={handleDeleteAccount}
                        className="px-6 py-2.5 rounded-xl border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-500 hover:text-white transition-colors whitespace-nowrap bg-white dark:bg-transparent"
                    >
                        Delete Account
                    </button>
                </div>
            </section>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className={`fixed bottom-0 right-0 left-0 lg:left-64 z-40 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#102216]/80 p-4 backdrop-blur-md transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="hidden sm:block text-sm text-gray-500 dark:text-slate-400">Unsaved changes will be lost.</p>
            <div className="flex w-full sm:w-auto items-center justify-end gap-3">
                <button 
                    onClick={handleDiscard}
                    className="flex-1 sm:flex-none rounded-xl border border-gray-300 dark:border-white/10 bg-transparent px-6 py-3 text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                    Discard
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none rounded-xl bg-emerald-600 dark:bg-primary px-8 py-3 text-sm font-bold text-white dark:text-background-dark shadow-sm dark:shadow-neon hover:bg-emerald-700 dark:hover:bg-primary-dark transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                >
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;