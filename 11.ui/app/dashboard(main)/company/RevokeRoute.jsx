'use client';

import React, { useState } from 'react';
import { revokeRoute } from '../../features/ipPrefix/ipPrefixSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import toast from 'react-hot-toast';

const RevokeRoute = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: 'Org1MSP',
    companyID: '',
    asn: '',
    prefix: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(revokeRoute(form)).unwrap();
      toast.success('Route revoked successfully');
      setForm({
        org: 'Org1MSP',
        companyID: '',
        asn: '',
        prefix: '',
      });
    } catch (err) {
      toast.error(`Revoke failed: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Revoke Route</h2>

        <label style={styles.label}>Organization</label>
        <select name="org" value={form.org} onChange={handleChange} style={styles.input}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <label style={styles.label}>Company ID</label>
        <input
          name="companyID"
          value={form.companyID}
          onChange={handleChange}
          placeholder="Company ID"
          required
          style={styles.input}
        />

        <label style={styles.label}>ASN</label>
        <input
          name="asn"
          value={form.asn}
          onChange={handleChange}
          placeholder="ASN"
          required
          style={styles.input}
        />

        <label style={styles.label}>Prefix</label>
        <input
          name="prefix"
          value={form.prefix}
          onChange={handleChange}
          placeholder="e.g., 203.0.113.0/24"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Revoking...' : 'Revoke Route'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#fdfdfd',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default RevokeRoute;
