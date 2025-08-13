'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  announceRoute,
  listAllASNValues,
  resetState as resetIpPrefixState,
} from '../../features/ipPrefix/ipPrefixSlice';
import {
  getAllocationsByMember,
  resetState as resetCompanyState,
} from '../../features/company/companySlice';



const AnnounceRoute = () => {
  const dispatch = useAppDispatch();
  const { data: asnData, loading: ipLoading, error: ipError } = useAppSelector((state) => state.ipPrefix);
  const { companyData, loading: companyLoading, error: companyError } = useAppSelector((state) => state.company);

  const [form, setForm] = useState({
    asn: '',
    prefix: '',
    pathJSON: '',
  });

  const [selectedASNs, setSelectedASNs] = useState([]);

  useEffect(() => {
    dispatch(getAllocationsByMember());
    dispatch(listAllASNValues());

    return () => {
      dispatch(resetCompanyState());
      dispatch(resetIpPrefixState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (ipError || companyError) {
      toast.error(ipError || companyError);
    }
  }, [ipError, companyError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    const selectedIndex = e.target.value;
    const selected = companyData[selectedIndex];
    if (selected && selected.asn && selected.prefix) {
      setForm((prev) => ({
        ...prev,
        asn: selected.asn,
        prefix: typeof selected.prefix === 'object' ? selected?.prefix?.prefix : selected.prefix,
      }));
    }
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
    try {
      const parsedPath = JSON.parse(form.pathJSON);
      await dispatch(announceRoute({ ...form, pathJSON: parsedPath })).unwrap();
      toast.success('Route announced successfully');
      setForm((prev) => ({ ...prev, pathJSON: '' }));
      setSelectedASNs([]);
    } catch (err) {
      toast.error(`Announcement failed: ${err.message || err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>📡 Announce Route</h2>

 

      <label style={styles.label}>Select Allocation</label>
      <select onChange={handleAllocationChange} style={styles.input} required>
        <option value="">-- Select an allocation --</option>
        {companyData?.map((alloc, index) => {
          const prefix = typeof alloc.prefix === 'object' ? alloc?.prefix?.prefix : alloc.prefix;
          return (
            alloc.asn && prefix ? (
              <option key={alloc.id || index} value={index}>
                ASN: {alloc.asn}, Prefix: {prefix}
              </option>
            ) : null
          );
        })}
      </select>

      <label style={styles.label}>ASN</label>
      <input
        name="asn"
        value={form.asn}
        onChange={handleChange}
        readOnly
        required
        style={styles.input}
      />

      <label style={styles.label}>Prefix</label>
      <input
        name="prefix"
        value={form.prefix}
        onChange={handleChange}
        readOnly
        required
        style={styles.input}
      />

      <label style={styles.label}>Select Path (ASN)</label>
      {ipLoading ? (
        <p>Loading ASN values...</p>
      ) : asnData && asnData.length > 0 ? (
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

      <button type="submit" disabled={ipLoading || companyLoading} style={styles.button}>
        {ipLoading ? 'Announcing...' : 'Announce Route'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 500,
    margin: '40px auto',
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
