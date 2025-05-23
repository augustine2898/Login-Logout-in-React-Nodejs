import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../features/adminUserSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, totalPages } = useSelector((state) => state.adminUsers);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers({ search, page }));
  }, [search, page, dispatch]);

  const validateForm = () => {
    let isValid = true;
    const { name, email, password } = newUser;

    const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@#$%^&+=_.-]*$/;
    if (!name) {
      toast.error("Name is required");
      isValid = false;
    } else if (!usernameRegex.test(name)) {
      toast.error(
        "Name must contain at least one letter and can include numbers or special characters"
      );
      isValid = false;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      toast.error("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/;
    if (!password) {
      toast.error("Password is required");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      isValid = false;
    }

    return isValid;
  };

  const handleCreateUser = () => {
    if (!validateForm()) return;

    dispatch(createUser(newUser)).then(() => {
      setNewUser({ name: "", email: "", password: "" });
      setIsModalOpen(false);
      toast.success("User created successfully");
    });
  };

  const handleUpdate = (user) => {
    setEditingUser({ ...user });
  };

  const handleEditSubmit = () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error("Name and Email are required");
      return;
    }

    dispatch(updateUser(editingUser)).then(() => {
      setEditingUser(null);
      toast.success("User updated successfully");
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: "#1e293b",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id)).then(() =>
          toast.success("User deleted successfully")
        );
      }
    });
  };

  return (
    <>
      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="mb-3 w-full px-4 py-2 rounded bg-[#0f172a] text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mb-3 w-full px-4 py-2 rounded bg-[#0f172a] text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="mb-4 w-full px-4 py-2 rounded bg-[#0f172a] text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="mb-3 w-full px-4 py-2 rounded bg-[#0f172a] text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="mb-4 w-full px-4 py-2 rounded bg-[#0f172a] text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="bg-[#0f172a] min-h-screen text-white px-4 py-24 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full sm:w-auto"
          >
            Create User
          </button>

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-[#1e293b] text-white placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left border-collapse bg-[#0f172a]">
            <thead className="bg-[#1e293b] text-gray-400 text-sm uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-4">#</th>
                <th className="px-4 sm:px-6 py-4">Name</th>
                <th className="px-4 sm:px-6 py-4">Email</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-[#1e293b] transition-all">
                    <td className="px-4 sm:px-6 py-4 font-bold">{index + 1}</td>
                    <td className="px-4 sm:px-6 py-4">{user.name}</td>
                    <td className="px-4 sm:px-6 py-4">{user.email}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${
                          user.isAccountVerified
                            ? "bg-blue-400 text-white"
                            : "border border-blue-400 text-blue-400"
                        }`}
                      >
                        {user.isAccountVerified ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => handleUpdate(user)}
                        className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserList;
