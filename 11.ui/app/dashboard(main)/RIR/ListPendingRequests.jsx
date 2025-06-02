'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { listPendingRequests, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';
import './styles/tableStyles.css';

const ListPendingRequests = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);

  const [org, setOrg] = useState('Org1MSP');
  const [userID, setUserID] = useState('');

  const handleFetch = async () => {
    if (!userID.trim()) {
      toast.error('User ID is required!');
      return;
    }

    try {
      await dispatch(listPendingRequests({ org, userID })).unwrap();
    } catch (err) {
      toast.error('Failed to fetch pending requests');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <div className="form-container">
      <h2>List Pending Requests</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />
        <select value={org} onChange={(e) => setOrg(e.target.value)}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, i) => (
                  <td key={i}>{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPendingRequests;
