import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import { WixDesignSystemProvider } from '@wix/design-system';
import "@wix/design-system/styles.global.css";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<WixDesignSystemProvider><Dashboard /></WixDesignSystemProvider>);