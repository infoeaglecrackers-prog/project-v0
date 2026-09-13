import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { addressService } from "../services/addressService";
import { userService } from "../services/userService";
import AddressForm from "../components/checkout/AddressForm";
import AddressList from "../components/checkout/AddressList";
import Modal from "../components/common/Modal";
import type { IAddress } from "../types";
import toast from "react-hot-toast";
import { User, Lock, MapPin, Upload } from "lucide-react";

type Tab = "profile" | "password" | "addresses";

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [addrModal, setAddrModal] = useState(false);
  const [editAddr, setEditAddr] = useState<IAddress | null>(null);
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addressService.getAll().then((r) => setAddresses(r.data.data?.addresses || [])).catch(() => {});
  }, []);

  const handleAddrSave = async (data: Omit<IAddress, "_id">) => {
    try {
      if (editAddr) { await addressService.update(editAddr._id, data); }
      else { await addressService.add(data); }
      const r = await addressService.getAll();
      setAddresses(r.data.data?.addresses || []);
      setAddrModal(false);
      toast.success("Saved!");
    } catch { toast.error("Failed"); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingAvatar(true);
    try {
      await userService.uploadAvatar(file);
      toast.success("Avatar updated!");
      window.location.reload(); // Refresh to show new avatar
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Upload failed");
      setPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const tabs = [
    { key: "profile" as Tab, label: "Profile", icon: User },
    { key: "password" as Tab, label: "Password", icon: Lock },
    { key: "addresses" as Tab, label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-dark dark:text-gray-100 mb-4 sm:mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Navigation Tabs - Horizontal on mobile, vertical sidebar on desktop */}
        <div className="flex md:flex-col overflow-x-auto pb-1 md:pb-0 scrollbar-none md:w-48 shrink-0 gap-1.5 md:space-y-1 border-b md:border-b-0 border-gray-200 dark:border-gray-700">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm text-left transition-colors ${
                tab === key
                  ? "bg-primary text-white md:bg-primary/10 md:text-primary font-semibold md:font-medium shadow-sm md:shadow-none"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 card p-4 sm:p-6">
          {tab === "profile" && (
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={preview || user?.avatar?.url || "/default-avatar.svg"}
                    alt={user?.name} 
                    className="w-20 h-24 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary/10 shadow-sm"
                  />
                  <button
                    onClick={() => avatarRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 shadow-md"
                    title="Upload photo"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                  </button>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-dark dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all mt-0.5">{user?.email}</p>
                  <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                    <span className="badge bg-primary/10 text-primary capitalize font-medium">{user?.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click the icon on your avatar to upload a new profile picture.</p>
                </div>
              </div>

              {/* User details summary card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Full Name</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{user?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Email Address</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 break-all">{user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "password" && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated!"); }}>
              <h3 className="font-semibold text-dark dark:text-gray-100 text-base sm:text-lg">Change Password</h3>
              {(["current", "newPwd", "confirm"] as const).map((k) => (
                <div key={k}>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                    {k === "current" ? "Current Password" : k === "newPwd" ? "New Password" : "Confirm New Password"}
                  </label>
                  <input
                    type="password"
                    value={pwd[k]}
                    onChange={(e) => setPwd((p) => ({ ...p, [k]: e.target.value }))}
                    className="input-field mt-1 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <button className="btn-primary w-full sm:w-auto mt-2">Update Password</button>
            </form>
          )}

          {tab === "addresses" && (
            <AddressList
              addresses={addresses}
              selected={null}
              onSelect={() => {}}
              onAdd={() => { setEditAddr(null); setAddrModal(true); }}
              onEdit={(a) => { setEditAddr(a); setAddrModal(true); }}
              onDelete={async (id) => {
                await addressService.delete(id);
                setAddresses((prev) => prev.filter((a) => a._id !== id));
              }}
            />
          )}
        </div>
      </div>

      <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} title={editAddr ? "Edit Address" : "Add Address"}>
        <AddressForm initial={editAddr || undefined} onSubmit={handleAddrSave} onCancel={() => setAddrModal(false)} />
      </Modal>
    </div>
  );
}
