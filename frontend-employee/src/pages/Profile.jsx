import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyProfile, updateMyProfile } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        const response = await getMyProfile();
        setData(response);
        setForm({
          fullName: response?.fullName || "",
          phone: response?.phone || "",
          address: response?.address || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setSuccess("");
    setError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSuccess("");
    setError("");
    setForm({
      fullName: data?.fullName || "",
      phone: data?.phone || "",
      address: data?.address || "",
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setSuccess("");
      setError("");
      const updated = await updateMyProfile(form);
      setData(updated);
      setForm({
        fullName: updated?.fullName || "",
        phone: updated?.phone || "",
        address: updated?.address || "",
      });
      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const items = [
    { label: "Employee Code", value: data?.employeeCode },
    { label: "Full Name", value: isEditing ? null : data?.fullName },
    { label: "Email", value: data?.email },
    { label: "Role", value: data?.role },
    { label: "Department", value: data?.department },
    { label: "Designation", value: data?.designation },
    { label: "Join Date", value: formatDate(data?.joinDate) },
    { label: "Phone", value: isEditing ? null : data?.phone },
    { label: "Address", value: isEditing ? null : data?.address },
  ];

  return (
    <div className="page">
      <h2 className="page-title">My Profile</h2>
      <div className="card">
        {loading ? (
          <div className="loading-wrap">
            <Loader message="Loading profile..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            {success ? <p style={{ color: "green" }}>{success}</p> : null}
            <div style={{ marginBottom: 12 }}>
              {!isEditing ? (
                <button type="button" onClick={handleStartEdit}>
                  Edit Profile
                </button>
              ) : null}
            </div>
            <div className="profile-grid">
              {items.map((item) => (
                <div key={item.label}>
                  <div className="profile-item-label">{item.label}</div>
                  <div className="profile-item-value">{item.value || "-"}</div>
                </div>
              ))}
            </div>
            {isEditing ? (
              <form onSubmit={handleSave} style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={form.address} onChange={handleChange} rows={3} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={handleCancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
