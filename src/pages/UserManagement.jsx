import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../components/AuthContext";

const UserModal = ({ user, onClose, onSave, roles }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    full_name: user?.full_name || "",
    role: user?.role || roles[0]?.name || "",
  });

  const isEditing = !!user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && !formData.password) {
      alert("Password wajib diisi untuk pengguna baru.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={isEditing}
            />
          </div>
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Peran (Role)
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { userProfile } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (userProfile?.role?.name === "admin") {
      fetchUsersAndRoles();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  const fetchUsersAndRoles = async () => {
    setLoading(true);

    // Ambil roles
    const { data: rolesData, error: rolesError } = await supabase
      .from("roles")
      .select("*");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      setLoading(false);
      return;
    }
    setRoles(rolesData);

    // Ambil users dari Edge Function get-users
    const { data: usersData, error: usersError } = await supabase.functions.invoke("get-users");

    if (usersError) {
      console.error("Error fetching users:", usersError);
    } else {
      setUsers(usersData);
    }

    setLoading(false);
  };

  const handleSaveUser = async (formData) => {
    const selectedRole = roles.find((r) => r.name === formData.role);
    if (!selectedRole) {
      alert("Peran tidak valid.");
      return;
    }

    if (editingUser) {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: formData.full_name, role_id: selectedRole.id })
        .eq("id", editingUser.id);

      if (error) alert("Gagal memperbarui pengguna: " + error.message);
      else alert("Pengguna berhasil diperbarui.");
    } else {
      const { error } = await supabase.functions.invoke("create-user", {
        body: {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
        },
      });

      if (error) alert("Gagal membuat pengguna: " + error.message);
      else alert("Pengguna baru berhasil dibuat.");
    }

    setIsModalOpen(false);
    setEditingUser(null);
    fetchUsersAndRoles();
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Anda yakin ingin menghapus pengguna ${user.email}?`)) {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { id: user.id },
      });

      if (error) alert("Gagal menghapus pengguna: " + error.message);
      else {
        alert("Pengguna berhasil dihapus.");
        fetchUsersAndRoles();
      }
    }
  };

  if (loading) {
    return <p className="text-center p-4">Memuat...</p>;
  }

  if (userProfile?.role?.name !== "admin") {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
        <p className="mt-2 text-slate-600">
          Hanya admin yang dapat mengakses halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Tambah Pengguna
        </button>
      </div>
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Belum ada pengguna yang ditambahkan.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3">Nama Lengkap</th>
                <th className="p-3">Email</th>
                <th className="p-3">Peran (Role)</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.full_name || "-"}</td>
                  <td className="p-3">{user.email || "-"}</td>
                  <td className="p-3">{user.role || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          roles={roles}
        />
      )}
    </div>
  );
};

export default UserManagement;
