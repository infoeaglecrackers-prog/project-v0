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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-6">My Account</h1>
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-left ${tab === key ? "bg-primary/10 text-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 card p-6">
          {tab === "profile" && (
            <div>
              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  <img 
                    src={preview || user?.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                  />
                  <button
                    onClick={() => avatarRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
                    title="Upload photo"
                  >
                    {uploadingAvatar ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
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
                <div>
                  <p className="font-semibold text-dark dark:text-gray-100">{user?.name}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{user?.email}</p>
                  <span className="badge bg-primary/10 text-primary mt-2">{user?.role}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Click the camera icon to change your photo</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Profile editing coming soon.</p>
            </div>
          )}

          {tab === "password" && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated!"); }}>
              <h3 className="font-semibold text-dark dark:text-gray-100">Change Password</h3>
              {(["current", "newPwd", "confirm"] as const).map((k) => (
                <div key={k}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{k === "current" ? "Current" : k === "newPwd" ? "New Password" : "Confirm"}</label>
                  <input type="password" value={pwd[k]} onChange={(e) => setPwd((p) => ({ ...p, [k]: e.target.value }))} className="input-field mt-1" />
                </div>
              ))}
              <button className="btn-primary">Update Password</button>
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
