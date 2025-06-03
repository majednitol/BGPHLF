'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  announceRoute,
  resetState as resetIpPrefixState,
} from '../../features/ipPrefix/ipPrefixSlice';
import {
  getAllocationsByMember,
  resetState as resetCompanyState,
} from '../../features/company/companySlice';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac001',
};

const AnnounceRoute = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);
  const { companyData, loading: companyLoading, error } = useAppSelector((state) => state.company);

  const [form, setForm] = useState({
    org: decodedUser.org,
    memberID: decodedUser.memberID,
    asn: '',
    prefix: '',
    pathJSON: '',
  });

  useEffect(() => {
    dispatch(getAllocationsByMember({ org: decodedUser.org, memberID: decodedUser.memberID }));
    return () => {
      dispatch(resetCompanyState());
      dispatch(resetIpPrefixState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    console.log(companyData?.length)
    const selectedIndex = e.target.value;
    const selected = companyData[selectedIndex];
    if (selected && selected.asn && selected.prefix) {
      setForm((prev) => ({
        ...prev,
        asn: selected.asn,
        prefix: typeof selected.prefix === 'object' ? selected.prefix.prefix : selected.prefix,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedPath = JSON.parse(form.pathJSON);
      await dispatch(announceRoute({ ...form, pathJSON: parsedPath })).unwrap();
      toast.success('Route announced successfully');
      setForm((prev) => ({ ...prev, pathJSON: '' }));
    } catch (err) {
      toast.error(`Announcement failed: ${err.message || err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>📡 Announce Route</h2>


      <label style={styles.label}>member ID</label>
      <input
        name="memberID"
        value={form.memberID}
        style={styles.input}
        disabled
      />

      <label style={styles.label}>Select Allocation</label>
      <select onChange={handleAllocationChange} style={styles.input}>
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
        placeholder="e.g. 65001"
        required
        style={styles.input}
      />

      <label style={styles.label}>Prefix</label>
      <input
        name="prefix"
        value={form.prefix}
        onChange={handleChange}
        readOnly
        placeholder="e.g. 192.0.2.0/24"
        required
        style={styles.input}
      />

      <label style={styles.label}>Path JSON</label>
      <textarea
        name="pathJSON"
        value={form.pathJSON}
        onChange={handleChange}
        placeholder='e.g. ["AS1", "AS2", "AS3"]'
        required
        rows={4}
        style={styles.textarea}
      />

      <button type="submit" disabled={loading || companyLoading} style={styles.button}>
        {loading ? 'Announcing...' : 'Announce Route'}
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
