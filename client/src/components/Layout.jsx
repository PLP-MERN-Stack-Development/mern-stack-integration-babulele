// Layout.jsx - Main layout wrapper component

import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

