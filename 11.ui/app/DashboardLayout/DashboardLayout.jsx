'use client';

import { useContext } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
// import { HealthContext } from '@/context/Health';

// Utility function to generate label from href
function generateLabel(href) {
  const parts = href.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.replace(/-/g, ' ').toLowerCase();
}

const navItems = {
  ip: [
    '/dashboard/ip/validate-path',
    '/dashboard/ip/assign-prefix',
    '/dashboard/ip/announce-route',
    '/dashboard/ip/revoke-route',
    '/dashboard/ip/get-prefix-assignment',
    '/dashboard/ip/trace-prefix'
  ],
  company: [
    '/dashboard/company/register-company-by-member',
    '/dashboard/company/get-company',
    '/dashboard/company/approve-member',
    '/dashboard/company/assign-resource',
    '/dashboard/company/request-resource',
    '/dashboard/company/review-request',
    '/dashboard/company/get-company-by-member-id'
  ],
  user: [
    '/dashboard/user/get-user',
    '/dashboard/user/register',
    '/dashboard/user/create-user',
    '/dashboard/user/login-user'
  ]
};
const ConnectedAccountUser = 'user'; // TODO: Replace with actual user type
function DashboardLayout({ children }) {
//   const { ConnectedAccountUser } = useContext(HealthContext);

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

                {(navItems[ConnectedAccountUser] || []).map((href) => (
                  <Link
                    key={href}
                    href={href}
                    className={styles.sidebarMenu__list__item__link}
                  >
                    <p>{generateLabel(href)}</p>
                  </Link>
                ))}
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
