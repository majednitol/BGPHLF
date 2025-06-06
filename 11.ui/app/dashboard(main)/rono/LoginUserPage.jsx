'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loggedInUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

const LoggedInUser = () => {
  const dispatch = useAppDispatch();
  const { userData, isLoggedIn, loading, error } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({ userId: '', org: 'Org1MSP' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loggedInUser(form)).unwrap();
      toast.success('Login successful');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Logged In User</h2>

        <input
          name="userId"
          placeholder="User ID"
          value={form.userId}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select name="org" value={form.org} onChange={handleChange} style={styles.input}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP'].map((org) => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}
      {isLoggedIn && userData && (
        <div style={styles.result}>
          <h4>Logged In User</h4>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600, margin: 'auto', padding: 20, backgroundColor: '#f9f9f9',
    borderRadius: 8, boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 15,
  },
  input: {
    padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc',
  },
  button: {
    padding: 12, fontSize: 16, backgroundColor: '#17a2b8', color: '#fff',
    border: 'none', borderRadius: 4, cursor: 'pointer',
  },
  error: { color: 'red', marginTop: 10 },
  result: { marginTop: 20, backgroundColor: '#e8f0fe', padding: 10, borderRadius: 6 },
};

export default LoggedInUser;
