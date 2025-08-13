'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerUser } from '../../features/user/userSlice';

export default function EnrollUserPage() {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.user);

  const [userId, setUserId] = useState('');
  const [org, setOrg] = useState('Afrinic');
  const [affiliation, setAffiliation] = useState('Afrinic.department1');
  const [showDialog, setShowDialog] = useState(false);

  const orgOptions = ['Afrinic', 'Apnic', 'Arin', 'Ripencc', 'Lacnic', 'Rono'];

  const handleOrgChange = (e) => {
    const selectedOrg = e.target.value;
    setOrg(selectedOrg);
    setAffiliation(`${selectedOrg}.department1`);
  };

  const handleAffiliationChange = (e) => {
    setAffiliation(e.target.value);
  };

  const handleSubmit = () => {
    const OrgMSP = `${org}MSP`;
    dispatch(registerUser({ userId, org: OrgMSP, affiliation }));
  };

  useEffect(() => {
    if (success || error) {
      setShowDialog(true);
      const timer = setTimeout(() => setShowDialog(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#2c3e50' }}>Enroll User</h2>

      <input
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <select style={styles.select} value={org} onChange={handleOrgChange}>
        {orgOptions.map((orgName) => (
          <option key={orgName} value={orgName}>
            {orgName}
          </option>
        ))}
      </select>

      <select style={styles.select} value={affiliation} onChange={handleAffiliationChange}>
        <option value={`${org}.department1`}>{org}.department1</option>
        <option value={`${org}.department2`}>{org}.department2</option>
      </select>

      <button style={styles.button} onClick={handleSubmit} disabled={loading || !userId}>
        {loading ? 'Enrolling...' : 'Enroll'}
      </button>

      {showDialog && (
        <div
          style={{
            ...styles.dialog,
            backgroundColor: success ? '#2ecc71' : '#e74c3c',
          }}
        >
          <p style={styles.dialogText}>
            {success ? `✅ ${JSON.stringify(success)}` : `❌ ${error}`}
          </p>
        </div>
      )}
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
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  dialog: {
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    padding: '20px 30px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    minWidth: '300px',
  },
  dialogText: {
    margin: 0,
    fontSize: '16px',
  },
};
