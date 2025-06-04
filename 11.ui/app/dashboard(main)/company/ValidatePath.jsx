'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { validatePath, listAllASNValues } from '../../features/ipPrefix/ipPrefixSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

// Simulated decoded token values
const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac001',
};

const ValidatePath = () => {
  const dispatch = useAppDispatch();
  const { loading, data: asnData, error } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: decodedUser.org,
    memberID: decodedUser.memberID,
    prefix: '',
    pathJSON: '',
  });

  const [selectedASNs, setSelectedASNs] = useState([]);

  useEffect(() => {
    dispatch(listAllASNValues({ org: decodedUser.org, memberID: decodedUser.memberID }));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (asn) => {
    const updated = selectedASNs.includes(asn)
      ? selectedASNs.filter((a) => a !== asn)
      : [...selectedASNs, asn];

    setSelectedASNs(updated);
    setForm((prev) => ({ ...prev, pathJSON: JSON.stringify(updated) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let parsedPath;

    try {
      parsedPath = JSON.parse(form.pathJSON);
    } catch (err) {
      toast.error('Invalid JSON format in Path JSON field');
      return;
    }

    try {
      await dispatch(validatePath({ ...form, pathJSON: parsedPath })).unwrap();
      toast.success('Path validated successfully');
      setForm((prev) => ({ ...prev, prefix: '', pathJSON: '' }));
      setSelectedASNs([]);
    } catch (err) {
      toast.error(`Validation failed: ${err.message || err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>✅ Validate Path</h2>

      <div style={styles.infoBox}>
        <p><strong>Member ID:</strong> {form.memberID}</p>
      </div>

      <label style={styles.label}>Prefix</label>
      <input
        type="text"
        name="prefix"
        value={form.prefix}
        onChange={handleChange}
        placeholder="Prefix (e.g. 203.0.113.0/24)"
        required
        style={styles.input}
      />

      <label style={styles.label}>Select Path (ASN)</label>
      {loading ? (
        <p>Loading ASN values...</p>
      ) : asnData?.length > 0 ? (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {asnData.map((asn) => (
            <li key={asn}>
              <label>
                <input
                  type="checkbox"
                  value={asn}
                  checked={selectedASNs.includes(asn)}
                  onChange={() => handleCheckboxChange(asn)}
                />{' '}
                ASN {asn}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ASN values found.</p>
      )}

      <div>
        <strong>Selected Path JSON:</strong>
        <pre>{form.pathJSON}</pre>
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Validating...' : 'Validate Path'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 600,
    margin: '20px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    fontFamily: 'Arial, sans-serif',
  },
  infoBox: {
    backgroundColor: '#eef',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    lineHeight: 1.5,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default ValidatePath;
