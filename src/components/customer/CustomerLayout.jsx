
import { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';

import CustomerSidebar from './CustomerSidebar';
import './CustomerLayout.css';

function CustomerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className={`customer-layout ${
        isCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <CustomerSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <main className="customer-main">
        <button
          type="button"
          className="customer-mobile-menu"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open customer navigation"
        >
          <Menu size={21} />
        </button>

        <section className="customer-page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default CustomerLayout;
