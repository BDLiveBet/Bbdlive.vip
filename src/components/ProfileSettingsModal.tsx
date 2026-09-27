import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Camera,
  ShieldCheck,
  Copy,
  Sparkles
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: AuthUser | null;
  onUpdateUser: (updatedUser: AuthUser) => void;
  onOpenAvatarModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onUpdateUser,
  onOpenAvatarModal,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Edit State
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || '');
  const [username, setUsername] = useState<string>(currentUser?.username || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);

    const token = localStorage.getItem('bdlivebet_token') || localStorage.getItem('1xbetlive_token') || localStorage.getItem('hibajee_token');
    if (!token) {
      setProfileErrorMsg('অনুগ্রহ করে পুনরায় লগইন করুন (Session expired)');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setProfileErrorMsg(data.error || 'Failed to update profile');
        setIsSavingProfile(false);
        return;
      }

      const updated: AuthUser = {
        ...currentUser!,
        fullName: data.user.fullName,
        username: data.user.username,
        email: data.user.email
      };

      onUpdateUser(updated);
      setProfileSuccessMsg(
        language === 'bn'
          ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!'
          : 'Profile updated successfully!'
      );
      onShowToast(
        language === 'bn' ? 'প্রোফাইল তথ্য আপডেট সম্পন্ন' : 'Profile updated successfully'
      );
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setProfileErrorMsg('Server error during profile update');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);

    if (!currentPassword) {
      setPasswordErrorMsg(
        language === 'bn'
          ? 'বর্তমান পাসওয়ার্ড প্রদান করুন'
          : 'Please enter current password'
      );
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordErrorMsg(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে'
          : 'New password must be at least 6 characters'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না'
          : 'New password and confirm password do not match'
      );
      return;
    }

    const token = localStorage.getItem('bdlivebet_token') || localStorage.getItem('1xbetlive_token') || localStorage.getItem('hibajee_token');
    if (!token) {
      setPasswordErrorMsg('অনুগ্রহ করে পুনরায় লগইন করুন (Session expired)');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/auth/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordErrorMsg(
          data.error ||
            (language === 'bn'
              ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে'
              : 'Password update failed')
        );
        setIsSavingPassword(false);
        return;
      }

      setPasswordSuccessMsg(
        language === 'bn'
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
          : 'Password changed successfully!'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast(
        language === 'bn'
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে'
          : 'Password updated successfully'
      );
    } catch (err) {
      console.error('Password change failed:', err);
      setPasswordErrorMsg('Server error during password change');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'প্রোফাইল সেটিংস ও নিরাপত্তা' : 'Profile Settings & Security'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আপনার ডাকনাম, ইমেইল ও পাসওয়ার্ড কাস্টমাইজ করুন'
                  : 'Manage your profile details and security credentials'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রোফাইল কাস্টমাইজেশন' : 'Profile Details'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 no-scrollbar space-y-4">
          {/* TAB 1: PROFILE CUSTOMIZATION */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Avatar Selector Trigger */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200">
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm bg-gray-100">
                    <img
                      src={
                        currentUser?.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAvatarModal}
                    className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{currentUser?.fullName || currentUser?.username}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold border border-amber-200">
                      VIP{currentUser?.vipLevel || 2}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'bn'
                      ? '২০টি প্রিসেট গেমিং অ্যাভাটার থেকে নির্বাচন করুন'
                      : 'Choose from 20 exclusive preset gaming avatars'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAvatarModal}
                    className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অ্যাভাটার পরিবর্তন করুন ›' : 'Change Avatar (20 Options) ›'}</span>
                  </button>
                </div>
              </div>

              {/* Status Alerts */}
              {profileSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
              {profileErrorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              {/* Field 1: Unique Numeric User ID (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ইউজার আইডি (User ID - অপরিবর্তনযোগ্য)' : 'User ID (Permanent & Unique)'}
                </label>
                <div className="flex items-center rounded-lg bg-[#f8f9fa] border border-gray-200 px-3 py-2 text-slate-700 select-none">
                  <span className="font-mono font-bold text-amber-700 text-sm flex-1 tracking-wider">
                    {currentUser?.userId || '84739210'}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await copyToClipboard(currentUser?.userId || '84739210');
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Copy User ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Field 2: Fixed Phone Number (STRICTLY NON-EDITABLE / DISABLED) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'মোবাইল নম্বর (Phone Number)' : 'Mobile Phone Number'}
                  </label>
                  <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'bn' ? 'অপরিবর্তনযোগ্য (Fixed / Non-editable)' : 'Fixed / Non-editable'}</span>
                  </span>
                </div>
                <div className="flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-slate-600 cursor-not-allowed select-none">
                  <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <span className="font-mono text-sm text-slate-700 font-semibold">
                    {currentUser?.phone || '+8801712345678'}
                  </span>
                  <span className="ml-auto text-xs px-2.5 py-0.5 rounded bg-gray-200 text-slate-600 border border-gray-300 font-semibold">
                    {language === 'bn' ? 'লক করা' : 'Locked'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === 'bn'
                    ? '⚠️ নিরাপত্তার স্বার্থে নিবন্ধিত মোবাইল নম্বর পরিবর্তন করা যাবে না।'
                    : '⚠️ For account security, the verified phone number cannot be modified.'}
                </p>
              </div>

              {/* Field 3: Display Name / Full Name (EDITABLE) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'প্রদর্শন নাম / ডাকনাম (Display Name / Nickname)' : 'Display Name / Nickname'}
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f8f9fa] border border-gray-300 focus-within:border-amber-500 transition">
                  <User className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    required
                    className="w-full px-3 py-2.5 bg-transparent text-slate-900 text-sm focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Field 4: Email Address (EDITABLE) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ইমেইল ঠিকানা (Email Address)' : 'Email Address'}
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f8f9fa] border border-gray-300 focus-within:border-amber-500 transition">
                  <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@bdlivebet.vip"
                    className="w-full px-3 py-2.5 bg-transparent text-slate-900 text-sm focus:outline-none placeholder-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === 'bn'
                    ? 'অ্যাকাউন্ট পুনরুদ্ধার এবং গুরুত্বপূর্ণ বিজ্ঞপ্তির জন্য ব্যবহৃত হবে।'
                    : 'Used for account recovery notifications.'}
                </p>
              </div>

              {/* Save Profile Button */}
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isSavingProfile ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন নীতি' : 'Password Security Policy'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {language === 'bn'
                    ? 'অ্যাকাউন্ট সুরক্ষিত রাখতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন। পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।'
                    : 'To protect your account, change your password regularly. Must be at least 6 characters.'}
                </p>
              </div>

              {/* Status Alerts */}
              {passwordSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}
              {passwordErrorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              {/* Field 1: Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'বর্তমান পাসওয়ার্ড (Current Password)' : 'Current Password'}
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f8f9fa] border border-gray-300 focus-within:border-amber-500 transition">
                  <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder=""
                    required
                    className="w-full pl-3 pr-10 py-2.5 bg-transparent text-slate-900 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password (min 6 chars)'}
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f8f9fa] border border-gray-300 focus-within:border-amber-500 transition">
                  <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=""
                    required
                    minLength={6}
                    className="w-full pl-3 pr-10 py-2.5 bg-transparent text-slate-900 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 3: Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password)' : 'Confirm New Password'}
                </label>
                <div className="relative flex items-center rounded-lg bg-[#f8f9fa] border border-gray-300 focus-within:border-amber-500 transition">
                  <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=""
                    required
                    minLength={6}
                    className="w-full pl-3 pr-10 py-2.5 bg-transparent text-slate-900 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Change Password Submit Button */}
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isSavingPassword ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update & Hash Password'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
