'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
function generateLabel(href) {
  const parts = href.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.replace(/-/g, ' ').toLowerCase();
}

const navItems = {
  rono: [
    '/dashboard/rono/user-info',
     '/dashboard/rono/assign-ip-prefix',
    '/dashboard/rono/view-assigned-ip-prefix',
  
  ],
    rir: [
    '/dashboard/rir/user-info',
    '/dashboard/rir/view-assigned-ip-prefix',
    '/dashboard/rir/assign-resource',
    '/dashboard/rir/list-pending-requests',
    '/dashboard/rir/list-all-members',
  
  
  ],
  ip: [
    '/dashboard/ip/validate-path',
    '/dashboard/ip/assign-prefix',
    '/dashboard/ip/announce-route',
    '/dashboard/ip/revoke-route',
    '/dashboard/ip/get-prefix-assignment',
    '/dashboard/ip/trace-prefix'
  ],
  company: [
    
    '/dashboard/company/my-allocation',
    '/dashboard/company/request-resource',
    '/dashboard/company/my-resource-request',
    '/dashboard/company/get-company-by-member-id',
    '/dashboard/company/announce-route',
    '/dashboard/company/validate-path',
    "/dashboard/company/revoke-route"

  ],
  // user: [
  //   '/dashboard/user/get-user',
  //   '/dashboard/user/register',
  //   '/dashboard/user/create-user',
  //   '/dashboard/user/login-user'
  // ]
};
function DashboardLayout({ children }) {
const [loading, setLoading] = useState(true);
 const [userRole, setUserRole] = useState(null);
const router = useRouter();
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error('Invalid token or failed to decode', error);
    } finally {
      setLoading(false);
    }
  }, []);
   const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.replace('/login-user');

   };
  
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ClipLoader size={50} color="#123abc" />
      </div>
    );
  }
  return (
    <div className="dashboard">
      <aside id="mySidenav" className={styles.mySidenav}>
        <nav className={styles.dashboardNav}>
          <div className={styles.sidebarMenu}>
            <ul className={styles.sidebarMenu__list}>
              <li className={styles.sidebarMenu__list__item}>
                <Link href="/dashboard" className={styles.sidebarMenu__list__item__link}>
                  <p>Dashboard</p>
                </Link>

                {(navItems[userRole] || []).map((href) => (
                  <Link
                    key={href}
                    href={href}
                    className={styles.sidebarMenu__list__item__link}
                  >
                    <p>{generateLabel(href)}</p>
                  </Link>
                  
                ))}
                <button
                  onClick={handleLogout}
                   className={`${styles.sidebarMenu__list__item__link} ${styles.logoutButton}`}
                  
                >
                  <p> Logout</p>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main className={styles.content} id="dashboard-container__main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
