'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import toast from 'react-hot-toast';
import { createOrgUser, registerUser } from '../../features/user/userSlice';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


export default function CreateOrgUserPage() {

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
const router = useRouter();
  const [form, setForm] = useState({
    userID: '',
    name: '',
    email: '',
    orgMSP: '',
    role: '',
    createdAt: new Date().toISOString(),
  });
const orgOptions = [
  { label: 'Select an organization', value: '' },
  { label: 'AFRINIC', value: 'AfrinicMSP' },
  { label: 'APNIC', value: 'ApnicMSP' },
  { label: 'ARIN', value: 'ArinMSP' },
  { label: 'RIPE NCC', value: 'RipenccMSP' },
  { label: 'LACNIC', value: 'LacnicMSP' },
  { label: 'RONO', value: 'RonoMSP' },
];
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  if (!form.orgMSP) {
    toast.error('❌ Please select an organization.');
    return;
  }

  const userID = uuidv4().slice(0, 8);
  const updatedForm = { ...form, userID };
  console.log("✅ Updated Form:", updatedForm);

  const registerRes = await dispatch(registerUser({
    userId: userID,
    org: "AfrinicMSP",
    affiliation: "apnic.lir1.technical"
  }));

  if (registerRes.meta.requestStatus === 'fulfilled') {
    const createRes = await dispatch(createOrgUser(updatedForm));
    if (createRes.meta.requestStatus === 'fulfilled') {
      toast.success('✅ Org user successfully created!');
    } else {
      toast.error('⚠️ Failed to create org user in DB.');
    }
  } else {
    toast.error('❌ Failed to register user on blockchain.');
  }
};



 const handleLoginRedirect = () => {
    router.push('/user/login-user');
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Org User</h2>

      <input
        name="name"
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

       <select
        name="orgMSP"
        style={styles.select}
        value={form.orgMSP}
        onChange={handleChange}
      >
        {orgOptions.map((org) => (
          <option key={org.value} value={org.value}>
            {org.label}
          </option>
        ))}
      </select>

      

      <select
        name="role"
        style={styles.select}
        value={form.role}
        onChange={handleChange}
      >
        <option value="">select type</option>
        <option value="rono">rono</option>
        <option value="rir">rir</option>
        <option value="company">company</option>
      </select>

      <button
        style={styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Org User'}
      </button>
              <button
          type="button"
          onClick={handleLoginRedirect}
          style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
        >
          Login 
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
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
