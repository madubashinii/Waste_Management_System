import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/profile", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching profile");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/auth/profile", user, { withCredentials: true });
      setUser(res.data);
      setEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="mb-2">
        <label className="block font-semibold">Name:</label>
        {editing ? (
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="border px-2 py-1 w-full rounded"
          />
        ) : (
          <p>{user.name}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Email:</label>
        <p>{user.email}</p>
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Phone:</label>
        {editing ? (
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="border px-2 py-1 w-full rounded"
          />
        ) : (
          <p>{user.phone}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Role:</label>
        <p>{user.role}</p>
      </div>

      {editing ? (
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
      )}
    </div>
  );
}
