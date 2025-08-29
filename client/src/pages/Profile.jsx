import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets"; // Make sure to import assets

const Profile = () => {
  const { user, axios, fetchUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  // State for user details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // State for addresses
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // State for which address is currently being edited
  const [editingAddress, setEditingAddress] = useState(null);

  // --- BUG FIX START ---
  // This useEffect now has a condition to prevent overwriting user input while editing.
  useEffect(() => {
    // This effect syncs the local form state with the global user state.
    // The '!isEditing' condition prevents this from running while the user is typing in the form.
    if (user && !isEditing) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setImagePreview(user.profileImage || "");
    }
    // We still need to fetch addresses and set the new address email regardless of edit mode.
    if (user) {
      setNewAddress((prev) => ({ ...prev, email: user.email }));
      fetchAddresses();
    }
  }, [user, isEditing]); // Added isEditing to the dependency array
  // --- BUG FIX END ---

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const { data } = await axios.post("/api/user/update-profile", formData);
      if (data.success) {
        toast.success("Profile updated successfully!");
        await fetchUser();
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", {
        address: newAddress,
      });
      if (data.success) {
        toast.success("Address added!");
        fetchAddresses();
        setShowAddAddress(false);
        setNewAddress({
          firstName: "",
          lastName: "",
          email: user.email,
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
          phone: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/address/update/${editingAddress._id}`,
        { address: editingAddress }
      );
      if (data.success) {
        toast.success(data.message);
        fetchAddresses();
        setEditingAddress(null); // Close the edit form
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const { data } = await axios.delete(`/api/address/delete/${addressId}`);
        if (data.success) {
          toast.success(data.message);
          fetchAddresses(); // Refresh the address list
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-16 pb-16 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-gray-200 font-medium rounded hover:bg-gray-300 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Details Form */}
      <form
        onSubmit={handleProfileUpdate}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 border p-6 rounded-lg"
      >
        {/* --- UI IMPROVEMENT START --- */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="profileImageInput"
            className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
          >
            <img
              src={imagePreview || assets.profile_icon}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <img
                  src={assets.upload_area}
                  alt="upload"
                  className="w-10 h-10 invert"
                />
              </div>
            )}
          </label>
          {isEditing && (
            <input
              type="file"
              id="profileImageInput"
              onChange={handleImageChange}
              className="hidden" // The actual file input is hidden
              accept="image/*"
            />
          )}
        </div>
        {/* --- UI IMPROVEMENT END --- */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded bg-gray-50 disabled:bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded bg-gray-50 disabled:bg-gray-200"
            />
          </div>
          {isEditing && (
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary-dull transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-2 bg-gray-200 font-medium rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Address Management Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">My Addresses</h2>
          {!showAddAddress && (
            <button
              onClick={() => setShowAddAddress(true)}
              className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-primary-dull transition"
            >
              Add New Address
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form
            onSubmit={handleAddAddress}
            className="space-y-3 p-4 border rounded-lg mb-6"
          >
            <h3 className="text-lg font-medium">Add a New Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newAddress.firstName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, firstName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newAddress.lastName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, lastName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={newAddress.email}
              onChange={(e) =>
                setNewAddress({ ...newAddress, email: e.target.value })
              }
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Zip Code"
                value={newAddress.zipcode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zipcode: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="py-2 px-6 bg-primary text-white rounded"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="py-2 px-6 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Display Saved Addresses */}
        <div className="space-y-4">
          {addresses.map((addr) =>
            editingAddress?._id === addr._id ? (
              // EDITING VIEW
              <form
                key={addr._id}
                onSubmit={handleUpdateAddress}
                className="space-y-3 p-4 border-2 border-primary rounded-lg mb-6"
              >
                <h3 className="text-lg font-medium">Edit Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={editingAddress.firstName}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={editingAddress.lastName}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="phone"
                    value={editingAddress.phone}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="zip code"
                    value={editingAddress.zipcode}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        zipcode: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={editingAddress.city}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        city: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={editingAddress.state}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        state: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street"
                  value={editingAddress.street}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress,
                      street: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                {/* Add other fields for editing here if needed */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="py-2 px-6 bg-primary text-white rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAddress(null)}
                    className="py-2 px-6 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // DEFAULT VIEW
              <div
                key={addr._id}
                className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p>
                    {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}
                  </p>
                  <p>{addr.country}</p>
                  <p>Phone: {addr.phone}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditingAddress(addr)}
                    className="font-medium text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
