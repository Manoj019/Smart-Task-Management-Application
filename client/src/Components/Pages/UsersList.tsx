import { useEffect, useState } from "react";

type User = {
  _id: string;
  email: string;
  isActive: boolean;
  name?: string;
};

type UserListProps = {
  refreshFlag: boolean;
};

const UserList: React.FC<UserListProps> = ({ refreshFlag }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/createduser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    console.log("Using token:", token);
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshFlag]);

 const handleDelete = async (userId: string) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/auth/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Delete failed with status: ${res.status}`);
    }
    const data = await res.json();
    alert(data.message);
    fetchUsers(); // Refresh the list
  } catch (error) {
    console.error("Error in handleDelete:", error);
    alert("Failed to delete user");
  }
};


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Created Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-gray-200 rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="text-gray-800 text-sm sm:text-base font-medium">
                {user.email}
              </div>
              <button
                className="mt-3 sm:mt-0 w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                onClick={() => handleDelete(user._id)}
              >
                Deactivate
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
