import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMovies.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/admin/users");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Kullanıcılar alınamadı:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="admin-movies">
      <div className="container">
        <h1>Kullanıcı Yönetimi</h1>

        <div className="admin-movies__list">
          {users.map((user) => (
            <div className="admin-movies__card" key={user.id}>
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Rol: {user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;