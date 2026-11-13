
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router';

import {
  House,
  UtensilsCrossed,
  Info,
  Phone,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';

import './CustomerSidebar.css';

function CustomerSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  onClose,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Home',
      icon: House,
      path: '/',
      end: true,
    },
    {
      title: 'About',
      icon: Info,
      path: '/about',
    },
    {
      title: 'Contact',
      icon: Phone,
      path: '/contact',
    },
  ];

  function handleNavigation() {
    onClose?.();
  }

  // Navigate to the homepage and scroll to Popular Dishes
  function handleMenuClick() {
    onClose?.();

    navigate('/#menu');

    window.setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="customer-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`customer-sidebar ${
          isCollapsed ? 'collapsed' : ''
        } ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="customer-sidebar-header">
          <div className="customer-brand">
            <div className="customer-brand-icon">
              <UtensilsCrossed size={23} />
            </div>

            {!isCollapsed && (
              <div className="customer-brand-text">
                <h2>FoodHub</h2>
                <span>YOUR FOOD DESTINATION</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="customer-mobile-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            className="customer-collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={
              isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            title={
              isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {isCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>
        </div>

        <div className="customer-sidebar-content">
          {!isCollapsed && (
            <span className="customer-menu-label">
              EXPLORE FOODHUB
            </span>
          )}

          <nav className="customer-sidebar-navigation">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.end}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `customer-sidebar-link ${
                      isActive ? 'active' : ''
                    }`
                  }
                  title={isCollapsed ? item.title : ''}
                >
                  <Icon size={20} strokeWidth={1.9} />

                  {!isCollapsed && (
                    <span>{item.title}</span>
                  )}
                </NavLink>
              );
            })}

            {/* Menu navigation */}
            <button
              type="button"
              className={`customer-sidebar-link ${
                location.pathname === '/' && location.hash === '#menu'
                  ? 'active'
                  : ''
              }`}
              onClick={handleMenuClick}
              title={isCollapsed ? 'Menu' : ''}
            >
              <UtensilsCrossed size={20} strokeWidth={1.9} />

              {!isCollapsed && (
                <span>Menu</span>
              )}
            </button>

          </nav>
        </div>

        <div className="customer-sidebar-bottom">
          {!isCollapsed && (
            <>
              <div className="customer-sidebar-promo">
                <div className="promo-icon">
                  <UtensilsCrossed size={19} />
                </div>

                <strong>Hungry?</strong>

                <p>
                  Discover something delicious today.
                </p>
              </div>

              <div className="customer-sidebar-footer">
                <span>FoodHub Customer Portal</span>
                <span>© 2026 FoodHub</span>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default CustomerSidebar;
