import React, { useEffect, useState } from 'react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await window.api.getUsers();
      setUsers(result);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      // Ensure the form includes the required fields
      if (!form.name || !form.email) {
        throw new Error('Name and Email are required');
      }

      // Add user via the API
      const newUser = await window.api.addUser(form);
      setUsers([...users, { id: newUser.id, ...form }]); // Update the state with the newly added user
      setForm({ name: '', email: '' }); // Reset form
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await window.api.deleteUser(id);
      // Update users state after deletion
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <h2>User Manager</h2>
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
