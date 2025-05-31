'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

export default function LoginUserPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  const [userID, setUserID] = useState('');
  const [org, setOrg] = useState('Org1');
  const orgOptions = ['Org1', 'Org2', 'Org3', 'Org4', 'Org5', 'Org6'];

  const handleLogin = async () => {
    const res = await dispatch(loginUser({ userID, org }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!');
    } else {
      toast.error(res.payload || 'Login failed!');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Login User</h2>
      <input
        style={styles.input}
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />
      <select style={styles.select} value={org} onChange={(e) => setOrg(e.target.value)}>
        {orgOptions.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <button style={styles.button} onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}

const styles = {
  container: {
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
};
