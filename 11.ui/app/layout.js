'use client';

import './globals.css';

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </Provider>
      </body>
    </html>
  );
}
