'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getAllPrefixesAssignedByRONO } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

const GetAllPrefixesAssignedPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, userData } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    userId: '',
    org: 'Org1MSP',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(getAllPrefixesAssignedByRONO(form)).unwrap();
      toast.success('Prefixes fetched successfully');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Get All Prefixes Assigned By RONO</h2>

      <label style={styles.label}>User ID</label>
      <input
        name="userId"
        value={form.userId}
        onChange={handleChange}
        placeholder="User ID"
        required
        style={styles.input}
      />

      <label style={styles.label}>Organization</label>
      <select
        name="org"
        value={form.org}
        onChange={handleChange}
        style={styles.input}
      >
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Fetching...' : 'Get Prefixes'}
      </button>

      {error && <p style={styles.error}>Error: {error}</p>}

      {userData && Array.isArray(userData) && (
        <div style={styles.result}>
          <h3>Assigned Prefixes</h3>
          <ul>
            {userData.map((item, idx) => (
              <li key={idx}>
                <strong>Prefix:</strong> {item.prefix} <br />
                <strong>Assigned To:</strong> {item.assignedTo} <br />
                <strong>Company ID:</strong> {item.companyID}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 500,
    margin: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  result: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
};

export default GetAllPrefixesAssignedPage;
