'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import toast from 'react-hot-toast';
import { createUser } from '../../features/user/userSlice';

export default function CreateUserPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    userID: '',
    org: 'Org1',
    dept: 'department1',
    comapanyID: '',
    timestamp: new Date().toISOString(),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await dispatch(createUser(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('User created successfully!');
    } else {
      toast.error(res.payload || 'Failed to create user.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create User (Chaincode)</h2>

      <input
        name="userID"
        style={styles.input}
        placeholder="User ID"
        value={form.userID}
        onChange={handleChange}
      />
      <input
        name="comapanyID"
        style={styles.input}
        placeholder="Company ID"
        value={form.comapanyID}
        onChange={handleChange}
      />
      <select name="org" style={styles.select} value={form.org} onChange={handleChange}>
        {['Org1', 'Org2', 'Org3', 'Org4', 'Org5', 'Org6'].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <select name="dept" style={styles.select} value={form.dept} onChange={handleChange}>
        <option value="department1">department1</option>
        <option value="department2">department2</option>
      </select>

      <button style={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '30px auto',
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    color: '#2c3e50',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

