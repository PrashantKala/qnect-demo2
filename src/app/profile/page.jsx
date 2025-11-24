"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  fetchMyQRs,
  fetchProfile,
  updateAddress,
  updateProfile,
  toggleQRStatus as toggleQRStatusApi,
  resendQR,
  addGuardian,
  deleteGuardian
} from '../../../lib/api';
import {
  IoCopy,
  IoCheckmark,
  IoDownloadOutline,
  IoPencilOutline,
  IoRepeatOutline,
  IoToggleOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoCloseCircleOutline
} from 'react-icons/io5';

export default function ProfilePage() {
  const { userToken, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();
  const [qrs, setQrs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState({});
  const [editedProfile, setEditedProfile] = useState({});
  
  // Guardian states
  const [manageGuardians, setManageGuardians] = useState(false);
  const [newGuardian, setNewGuardian] = useState({ name: '', email: '', phoneNumber: '', relation: '' });

  const handleResendQR = async (qrId) => {
    try {
      await resendQR(qrId);
      alert('QR code has been sent to your email!');
    } catch (error) {
      console.error('Error sending QR:', error);
      alert('Failed to send QR code. Please try again.');
    }
  };

  const handleToggleQRStatus = async (qrId) => {
    try {
      const qr = qrs.find(q => q.qrId === qrId);
      const newStatus = qr.status === 'activated' ? 'disabled' : 'activated';
      const response = await toggleQRStatusApi(qrId, newStatus);
      if (response.data) {
        setQrs(qrs.map(q =>
          q.qrId === qrId ? { ...q, status: newStatus } : q
        ));
      } else {
        throw new Error('Failed to update QR status');
      }
    } catch (error) {
      console.error('Error toggling QR status:', error);
      alert('Failed to update QR status. Please try again.');
    }
  };

  const handleReorder = () => {
    alert('Reorder functionality coming soon!');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(editedProfile);
      if (response.data) {
        setProfile(prev => ({ ...prev, ...editedProfile }));
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateAddress(editedAddress);
      if (response.data) {
        setProfile(prev => ({ ...prev, address: editedAddress }));
        setEditAddress(false);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    }
  };

  const handleAddGuardian = async (e) => {
    e.preventDefault();
    if (!newGuardian.name || !newGuardian.phoneNumber) {
      alert('Name and Phone Number are required');
      return;
    }
    try {
      const response = await addGuardian(newGuardian);
      if (response.data) {
        setProfile(response.data);
        setNewGuardian({ name: '', email: '', phoneNumber: '', relation: '' });
        setManageGuardians(false);
        alert('Guardian added successfully');
      }
    } catch (error) {
      console.error('Error adding guardian:', error);
      alert('Failed to add guardian');
    }
  };

  const handleDeleteGuardian = async (guardianId) => {
    if (!confirm('Are you sure you want to remove this guardian?')) return;
    try {
      const response = await deleteGuardian(guardianId);
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error deleting guardian:', error);
      alert('Failed to delete guardian');
    }
  };

  // Protect route
  useEffect(() => {
    if (!isAuthLoading && !userToken) {
      router.replace('/login?redirect=/profile');
    }
  }, [userToken, isAuthLoading, router]);

  // Fetch data
  useEffect(() => {
    if (userToken) {
      Promise.all([fetchMyQRs(), fetchProfile()])
        .then(([qrsResponse, profileResponse]) => {
          setQrs(qrsResponse.data);
          setProfile(profileResponse.data);
          setEditedAddress(profileResponse.data.address || {});
          setEditedProfile({
            mobileNumber: profileResponse.data.mobileNumber || '',
            vehicleNumber: profileResponse.data.vehicleNumber || ''
          });
        })
        .catch(err => console.error("Failed to fetch data", err))
        .finally(() => setIsLoading(false));
    }
  }, [userToken]);

  if (isAuthLoading || (isLoading && userToken)) {
    return <main className="container mx-auto px-6 py-12 pt-24 min-h-screen"><p>Loading profile...</p></main>;
  }

  return (
    <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
      <h1 className="text-4xl font-bold text-primary-blue mb-8">My Profile & QRs</h1>

      <div className="grid md:grid-cols-[40%_60%] gap-8">
        {/* Profile Section */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-white/80">{profile?.email}</p>
                </div>
              </div>
              <button onClick={() => setEditMode(true)} className="p-2 hover:bg-white/20 rounded-full transition">
                <IoPencilOutline className="h-5 w-5" />
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-white/80">Mobile Number</label>
                  <input
                    type="text"
                    value={editedProfile.mobileNumber || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, mobileNumber: e.target.value })}
                    className="w-full p-2 rounded-lg mt-1 text-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/80">Vehicle Number</label>
                  <input
                    type="text"
                    value={editedProfile.vehicleNumber || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, vehicleNumber: e.target.value })}
                    className="w-full p-2 rounded-lg mt-1 text-black"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-white text-primary-blue font-medium rounded-lg">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditMode(false)} className="flex-1 px-4 py-2 bg-white/20 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-white/80">Mobile Number</p>
                  <p>{profile?.mobileNumber}</p>
                </div>
                {profile?.vehicleNumber && (
                  <div>
                    <p className="text-sm text-white/80">Vehicle Number</p>
                    <p>{profile.vehicleNumber}</p>
                  </div>
                )}
              </div>
            )}

            <button onClick={logout} className="w-full text-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
              Logout
            </button>
          </div>

          {/* Address Card (moved just after profile) */}
          <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Address</h2>
              <button onClick={() => setEditAddress(true)} className="p-2 hover:bg-white/20 rounded-full transition">
                <IoPencilOutline className="h-5 w-5" />
              </button>
            </div>
            {editAddress ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                {[
                  ['houseNumber', 'House/Flat Number'],
                  ['streetName', 'Street Name'],
                  ['landmark', 'Landmark (Optional)'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['pincode', 'Pincode'],
                  ['country', 'Country']
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-white/80">{label}</label>
                    <input
                      type="text"
                      value={editedAddress[key] || ''}
                      onChange={(e) => setEditedAddress({ ...editedAddress, [key]: e.target.value })}
                      className="w-full p-2 rounded-lg mt-1 text-black"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-white text-primary-blue font-medium rounded-lg">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditAddress(false)} className="flex-1 px-4 py-2 bg-white/20 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p>{profile?.address?.houseNumber}, {profile?.address?.streetName} {profile?.address?.landmark && `, ${profile.address.landmark}`}</p>
                <p>{profile?.address?.city}, {profile?.address?.state} {profile?.address?.pincode}</p>
                <p>{profile?.address?.country}</p>
              </div>
            )}
          </div>

          {/* Guardians Card */}
          <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Guardians</h2>
              <button onClick={() => setManageGuardians(!manageGuardians)} className="p-2 hover:bg-white/20 rounded-full transition">
                {manageGuardians ? <IoCloseCircleOutline className="h-6 w-6" /> : <IoAddCircleOutline className="h-6 w-6" />}
              </button>
            </div>

            {manageGuardians && (
              <form onSubmit={handleAddGuardian} className="bg-white/10 p-4 rounded-lg mb-4 space-y-3">
                <h3 className="font-bold mb-2">Add New Guardian</h3>
                <input
                  type="text"
                  placeholder="Name *"
                  value={newGuardian.name}
                  onChange={(e) => setNewGuardian({...newGuardian, name: e.target.value})}
                  className="w-full p-2 rounded text-black"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={newGuardian.phoneNumber}
                  onChange={(e) => setNewGuardian({...newGuardian, phoneNumber: e.target.value})}
                  className="w-full p-2 rounded text-black"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={newGuardian.email}
                  onChange={(e) => setNewGuardian({...newGuardian, email: e.target.value})}
                  className="w-full p-2 rounded text-black"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Father)"
                  value={newGuardian.relation}
                  onChange={(e) => setNewGuardian({...newGuardian, relation: e.target.value})}
                  className="w-full p-2 rounded text-black"
                />
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-white text-primary-blue py-2 rounded font-bold">Add</button>
                  <button type="button" onClick={() => setManageGuardians(false)} className="flex-1 bg-white/20 py-2 rounded">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {profile?.guardians && profile.guardians.length > 0 ? (
                profile.guardians.map((guardian) => (
                  <div key={guardian._id} className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                    <div>
                      <p className="font-bold">{guardian.name}</p>
                      <p className="text-sm text-white/80">{guardian.relation} • {guardian.phoneNumber}</p>
                    </div>
                    <button onClick={() => handleDeleteGuardian(guardian._id)} className="p-2 hover:bg-red-500/20 rounded-full text-red-200 hover:text-red-100 transition">
                      <IoTrashOutline className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white/60 italic text-center py-2">No guardians added yet.</p>
              )}
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
            <div className="bg-white/20 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold mb-2">{profile?.wallet?.credits || 0}</p>
              <p className="text-white/80">Credits Available</p>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Referral Code</h2>
            <div className="flex items-center justify-between bg-white/20 p-4 rounded-lg">
              <span className="font-mono text-lg">{profile?.referralCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile?.referralCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 hover:bg-white/30 rounded-full transition"
              >
                {copied ? <IoCheckmark className="text-green-300" /> : <IoCopy />}
              </button>
            </div>
            <p className="text-sm text-white/80 mt-2">
              Share this code with friends to earn 50 credits when they sign up!
            </p>
          </div>
        </div>

        {/* QR List Section */}
        <div className="bg-qnect-gradient text-white p-6 md:p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Activated QR Codes ({qrs.length})</h2>
            <Link href="/order-qr" className="inline-block px-4 py-2 bg-white text-primary-blue font-bold rounded-lg text-sm hover:opacity-90">
              + Get New QR
            </Link>
          </div>
          <div className="space-y-4">
            {qrs.length > 0 ? (
              qrs.map(qr => (
                <div key={qr._id} className="p-6 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-sm text-white/80">ID: {qr.qrId}</p>
                      <p className="text-lg font-semibold">
                        Status: <span className={`capitalize ${qr.status === 'activated' ? 'text-green-300' : 'text-yellow-200'}`}>{qr.status}</span>
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        Activated: {new Date(qr.activatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleResendQR(qr.qrId)} className="px-3 py-2 text-sm font-medium bg-white text-primary-blue rounded flex items-center hover:opacity-90">
                        <IoDownloadOutline className="h-4 w-4 mr-1" /> Resend
                      </button>
                      <button
                        onClick={() => handleToggleQRStatus(qr.qrId)}
                        className={`px-3 py-2 text-sm font-medium rounded flex items-center hover:opacity-90 ${
                          qr.status === 'activated' ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
                        }`}
                      >
                        <IoToggleOutline className="h-4 w-4 mr-1" />
                        {qr.status === 'activated' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleReorder(qr.qrId)} className="px-3 py-2 text-sm font-medium bg-white/20 rounded flex items-center hover:bg-white/30">
                        <IoRepeatOutline className="h-4 w-4 mr-1" /> Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/80 text-center py-8">
                You have not purchased or activated any QR codes yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
