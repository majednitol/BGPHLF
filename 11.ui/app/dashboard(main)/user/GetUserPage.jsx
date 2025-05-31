'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

export default function GetUserPage() {
  const dispatch = useAppDispatch();
  const { userData, loading } = useAppSelector((state) => state.user);

  const [userId, setUserId] = useState('');
  const [org, setOrg] = useState('Org1');

  const handleGetUser = async () => {
    const res = await dispatch(getUser({ userId, org }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('User fetched!');
    } else {
      toast.error(res.payload || 'Failed to fetch user.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Get User Info</h2>

      <input
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <select style={styles.select} value={org} onChange={(e) => setOrg(e.target.value)}>
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <button style={styles.button} onClick={handleGetUser} disabled={loading}>
        {loading ? 'Fetching...' : 'Get User'}
      </button>

      {userData && (
        <div style={styles.userCard}>
          <h4>User Info:</h4>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {container: {
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
  userCard: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};
