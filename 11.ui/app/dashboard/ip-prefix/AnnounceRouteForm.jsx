'use client';

import React, { useState } from 'react';
import { announceRoute } from '../../features/ipPrefix/ipPrefixSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import toast from 'react-hot-toast';

const AnnounceRoute = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: 'Org1MSP',
    comapanyID: '',
    asn: '',
    prefix: '',
    pathJSON: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedPath = JSON.parse(form.pathJSON);
      await dispatch(announceRoute({ ...form, pathJSON: parsedPath })).unwrap();
      toast.success('Route announced successfully');
    } catch (err) {
      toast.error(`Announcement failed: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Announce Route</h2>

      <label style={styles.label}>Organization</label>
      <select name="org" value={form.org} onChange={handleChange} style={styles.input}>
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>

      <label style={styles.label}>Company ID</label>
      <input
        name="comapanyID"
        value={form.comapanyID}
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
        placeholder="Prefix (e.g., 192.0.2.0/24)"
        required
        style={styles.input}
      />

      <label style={styles.label}>Path JSON</label>
      <textarea
        name="pathJSON"
        value={form.pathJSON}
        onChange={handleChange}
        placeholder='e.g., ["AS1", "AS2", "AS3"]'
        required
        rows={4}
        style={styles.textarea}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Announcing...' : 'Announce Route'}
      </button>
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
    backgroundColor: '#f9f9f9',
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
  textarea: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
  },
};

export default AnnounceRoute;
