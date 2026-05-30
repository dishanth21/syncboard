import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      setUser(response.data);
      setEditName(response.data.name);
      setEditEmail(response.data.email);
    } catch (error) {
      showToast("Failed to load profile", "error");
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      await api.put("/user/profile", {
        name: editName,
        email: editEmail
      });
      setUser({ ...user, name: editName, email: editEmail });
      setShowEditModal(false);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
  }

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h1>SyncBoard</h1>
        <button onClick={() => navigate("/dashboard")} style={navButtonStyle}>
          ← Dashboard
        </button>
        <button onClick={logout} style={{ ...navButtonStyle, background: "#dc2626" }}>
          Logout
        </button>
      </div>

      <div style={mainContentStyle}>
        <div style={profileCardStyle}>
          <h2>My Profile</h2>
          
          <div style={fieldStyle}>
            <label style={labelStyle}>Name</label>
            <p style={valueStyle}>{user?.name || "Not set"}</p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <p style={valueStyle}>{user?.email}</p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <p style={valueStyle}>{user?.role || "User"}</p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Member Since</label>
            <p style={valueStyle}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </p>
          </div>

          <button 
            onClick={() => setShowEditModal(true)}
            style={editButtonStyle}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        title="Edit Profile"
        onClose={() => setShowEditModal(false)}
        onConfirm={updateProfile}
        confirmText="Save Changes"
        loading={updating}
      >
        <div>
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Your email"
              style={inputStyle}
            />
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

const containerStyle = {
  display: "flex",
  background: "#0f172a",
  color: "white",
  minHeight: "100vh"
};

const sidebarStyle = {
  width: "320px",
  padding: "20px",
  background: "#111827",
  borderRight: "1px solid #1f2937"
};

const navButtonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  border: "none",
  color: "white",
  borderRadius: "8px",
  marginBottom: "10px",
  cursor: "pointer"
};

const mainContentStyle = {
  flex: 1,
  padding: "40px"
};

const profileCardStyle = {
  background: "#1f2937",
  borderRadius: "12px",
  padding: "30px",
  maxWidth: "600px"
};

const fieldStyle = {
  marginBottom: "25px"
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  textTransform: "uppercase",
  color: "#9ca3af",
  marginBottom: "8px",
  fontWeight: "600"
};

const valueStyle = {
  margin: "0",
  fontSize: "16px",
  color: "white"
};

const editButtonStyle = {
  padding: "12px 24px",
  background: "#3b82f6",
  border: "none",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  marginTop: "20px"
};

const formGroupStyle = {
  marginBottom: "20px"
};

const formLabelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  color: "#9ca3af",
  fontWeight: "500"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  background: "#111827",
  border: "1px solid #374151",
  color: "white",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box"
};

export default UserProfilePage;
