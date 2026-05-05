import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyProfile } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        const response = await getMyProfile();
        setData(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const items = [
    { label: "Employee Code", value: data?.employeeCode },
    { label: "Full Name", value: data?.fullName },
    { label: "Email", value: data?.email },
    { label: "Role", value: data?.role },
    { label: "Department", value: data?.department },
    { label: "Designation", value: data?.designation },
    { label: "Join Date", value: formatDate(data?.joinDate) },
    { label: "Phone", value: data?.phone },
    { label: "Address", value: data?.address },
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
          <div className="profile-grid">
            {items.map((item) => (
              <div key={item.label}>
                <div className="profile-item-label">{item.label}</div>
                <div className="profile-item-value">{item.value || "-"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
