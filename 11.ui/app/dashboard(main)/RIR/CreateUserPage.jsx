'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createOrgUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

const CreateRIRUser = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    userID: '',
    name: '',
    email: '',
    orgMSP: 'Org1MSP',
    role: '',
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createOrgUser(form)).unwrap();
      toast.success('Org user created successfully');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create Org User</h2>

        <input name="userID" placeholder="User ID" required onChange={handleChange} value={form.userID} style={styles.input} />
        <input name="name" placeholder="Name" required onChange={handleChange} value={form.name} style={styles.input} />
        <input name="email" placeholder="Email" required onChange={handleChange} value={form.email} style={styles.input} />

        <select name="orgMSP" onChange={handleChange} value={form.orgMSP} style={styles.input}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP'].map((org) => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>

        <input name="role" placeholder="Role" required onChange={handleChange} value={form.role} style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}
      {success && (
        <div style={styles.result}>
          <h4>Success</h4>
          <pre>{JSON.stringify(success, null, 2)}</pre>
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
    padding: 12, fontSize: 16, backgroundColor: '#007bff', color: '#fff',
    border: 'none', borderRadius: 4, cursor: 'pointer',
  },
  error: { color: 'red', marginTop: 10 },
  result: { marginTop: 20, backgroundColor: '#e8f0fe', padding: 10, borderRadius: 6 },
};

export default CreateRIRUser;
