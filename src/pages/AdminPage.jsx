
import { useState } from 'react';
import { useFood } from '../context/food/useFood';
import FoodForm from '../components/admin/FoodForm';
import FoodList from '../components/admin/FoodList';
import './AdminPage.css';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ClipboardList,
  LogOut,
  Package,
  Tags,
  CheckCircle,
  ChefHat,
  UserRound,
} from 'lucide-react';

function AdminPage() {
  const { foods, addFood, updateFood, deleteFood } = useFood();

  const [editingFood, setEditingFood] = useState(null);

  const navigate = useNavigate();

  // Get the number of unique menu categories.
  const categories = new Set(
    foods.map((food) => food.category).filter(Boolean)
  );

  // Get the logged-in admin's email.
  const adminEmail =
    localStorage.getItem('foodhub_admin_email') || 'Admin account';

  // Log out the admin.
  function handleLogout() {
    localStorage.removeItem('foodhub_admin_logged_in');
    localStorage.removeItem('foodhub_admin_email');

    toast.success('Logged out successfully');

    navigate('/admin-login', { replace: true });
  }

  // Add a new food item or update an existing one.
  function handleSave(food) {
    if (editingFood) {
      updateFood(food);
      setEditingFood(null);
    } else {
      addFood(food);
    }
  }

  // Select a food item and show it in the form.
  function handleEdit(food) {
    setEditingFood(food);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Cancel editing and return to the add-food form.
  function handleCancelEdit() {
    setEditingFood(null);
  }

  // Delete a food item and cancel editing if that item is selected.
  function handleDelete(foodId) {
    deleteFood(foodId);

    if (editingFood?.id === foodId) {
      setEditingFood(null);
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-brand">
          <span className="admin-brand-icon">
            <UtensilsCrossed size={24} />
          </span>

          <span>
            Food<span className="brand-highlight">Hub</span>
          </span>
        </h2>

        <p className="sidebar-label">MANAGEMENT</p>

        <nav className="sidebar-navigation">
          <a className="sidebar-link active" href="#dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a className="sidebar-link" href="#food-form">
            <PlusCircle size={19} />
            <span>Add Food</span>
          </a>

          <a className="sidebar-link" href="#food-items">
            <ClipboardList size={19} />
            <span>Manage Menu</span>
          </a>
        </nav>

        <div className="sidebar-note">
          <ChefHat size={23} />
          <p>Good Food. Happy Customers.</p>
          <span>Manage your menu in one place.</span>
        </div>

        <div className="sidebar-account">
          <div className="admin-avatar">
            <UserRound size={21} />
          </div>

          <div className="admin-account-info">
            <span className="admin-account-label">
              SIGNED IN AS
            </span>

            <span
              className="admin-account-email"
              title={adminEmail}
            >
              {adminEmail}
            </span>
          </div>
        </div>

        <button
          className="admin-logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main" id="dashboard">
        <header className="admin-topbar">
          <div className="admin-page-heading">
            <p className="admin-eyebrow">
              RESTAURANT MANAGEMENT
            </p>
            <h1>Admin Dashboard</h1>
          </div>

          <span className="admin-status">
            <span className="status-indicator"></span>
            Menu Manager
          </span>
        </header>

        <section className="admin-welcome">
          <h2 className="admin-welcome-title">
            <ChefHat size={27} />
            <span>Welcome to FoodHub</span>
          </h2>

          <p>
            Manage your restaurant menu and keep your food
            offerings up to date.
          </p>
        </section>

        <section className="admin-stats">
          <article className="stat-card">
            <div className="stat-icon">
              <Package size={22} />
            </div>

            <div className="stat-details">
              <span>Total Food Items</span>
              <strong>{foods.length}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              <Tags size={22} />
            </div>

            <div className="stat-details">
              <span>Menu Categories</span>
              <strong>{categories.size}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={22} />
            </div>

            <div className="stat-details">
              <span>Menu Status</span>
              <strong className="status-text">Active</strong>
            </div>
          </article>
        </section>

        <div className="admin-content-grid">
          <section className="admin-form-panel" id="food-form">
            <FoodForm
              onSave={handleSave}
              editingFood={editingFood}
              onCancelEdit={handleCancelEdit}
            />
          </section>

          <aside className="admin-specials-panel">
            <div className="specials-heading">
              <span className="specials-label">
                FROM OUR KITCHEN
              </span>

              <h2>Restaurant Specials</h2>
              <p>Fresh favorites for every craving.</p>
            </div>

            <img
              className="restaurant-specials-image"
              src="/food-images/restaurant-specials.png"
              alt="A selection of delicious restaurant dishes"
            />

            <div className="specials-footer">
              <span className="specials-dot"></span>
              <span>Freshly prepared, served with care</span>
            </div>
          </aside>
        </div>

        <section className="admin-list-panel" id="food-items">
          <FoodList
            foods={foods}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
