import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setPageTitle } from '../utils/pageTitle';
import UpgradeModal from './UpgradeModal';
import { useSubscriptionTier } from '../hooks/useSubscriptionTier';
import '../styles/sidebar.css';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { checkFeatureAccess, handleLockedFeatureClick, closeUpgradeModal, upgradeModal, currentTier } = useSubscriptionTier(user?.subscription);

  // Menus par rôle
  const buyerMenu = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: '📊',
      path: '/buyer-dashboard',
      featureKey: 'dashboard',
      subItems: []
    },
    {
      id: 'tenders',
      label: 'Appels d\'Offres',
      icon: '📋',
      subItems: [
        { label: 'Actifs', path: '/tenders?status=active', featureKey: 'browsetenders' },
        { label: 'Créer un Appel', path: '/create-tender', featureKey: 'createtender' },
        { label: 'Archivés', path: '/tenders?status=archived', featureKey: 'browsetenders' },
        { label: 'Évaluation', path: '/tender-analysis', featureKey: 'analytics' }
      ]
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: '💰',
      subItems: [
        { label: 'Factures', path: '/invoices', featureKey: 'invoices' },
        { label: 'Budgets', path: '/budgets', featureKey: 'budgets' },
        { label: 'Rapports', path: '/financial-reports', featureKey: 'customreports' }
      ]
    },
    {
      id: 'team',
      label: 'Équipe',
      icon: '👥',
      subItems: [
        { label: 'Gestion d\'équipe', path: '/team-management', featureKey: 'teammanagement' },
        { label: 'Permissions', path: '/team-permissions', featureKey: 'teammanagement' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      path: '/notifications',
      featureKey: 'notifications',
      subItems: []
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '⚙️',
      featureKey: 'profile',
      subItems: [
        { label: 'Paramètres', path: '/profile', featureKey: 'profile' },
        { label: 'Sécurité', path: '/security', featureKey: 'profile' },
        { label: 'Préférences', path: '/preferences', featureKey: 'profile' }
      ]
    }
  ];

  const supplierMenu = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: '📊',
      path: '/supplier-search',
      featureKey: 'dashboard',
      subItems: []
    },
    {
      id: 'tenders',
      label: 'Appels d\'Offres',
      icon: '📋',
      subItems: [
        { label: 'Parcourir', path: '/tenders', featureKey: 'browsetenders' },
        { label: 'Mes Offres', path: '/my-offers', featureKey: 'myoffers' },
        { label: 'Soumises', path: '/my-offers?status=submitted', featureKey: 'myoffers' },
        { label: 'Évaluées', path: '/my-offers?status=evaluated', featureKey: 'myoffers' }
      ]
    },
    {
      id: 'catalog',
      label: 'Catalogue',
      icon: '📦',
      subItems: [
        { label: 'Mon Catalogue', path: '/supplier-catalog', featureKey: 'catalog' },
        { label: 'Produits', path: '/supplier-products', featureKey: 'catalog' },
        { label: 'Services', path: '/supplier-services', featureKey: 'catalog' }
      ]
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: '💰',
      subItems: [
        { label: 'Factures', path: '/supplier-invoices', featureKey: 'invoices' },
        { label: 'Paiements', path: '/supplier-payments', featureKey: 'invoices' },
        { label: 'Rapports', path: '/supplier-reports', featureKey: 'customreports' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      path: '/notifications',
      featureKey: 'notifications',
      subItems: []
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '⚙️',
      featureKey: 'profile',
      subItems: [
        { label: 'Paramètres', path: '/profile', featureKey: 'profile' },
        { label: 'Sécurité', path: '/security', featureKey: 'profile' },
        { label: 'Entreprise', path: '/company-info', featureKey: 'profile' }
      ]
    }
  ];

  const adminMenu = [
    {
      id: 'dashboard',
      label: 'Tableau de Contrôle',
      icon: '🎛️',
      path: '/admin',
      subItems: []
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: '👥',
      subItems: [
        { label: 'Gestion', path: '/admin/users' },
        { label: 'Rôles', path: '/admin/roles' },
        { label: 'Autorisations', path: '/admin/permissions' }
      ]
    },
    {
      id: 'tenders',
      label: 'Appels d\'Offres',
      icon: '📋',
      subItems: [
        { label: 'Tous', path: '/admin/tenders' },
        { label: 'Modération', path: '/admin/tenders-moderation' },
        { label: 'Archivage', path: '/admin/archive-management' }
      ]
    },
    {
      id: 'system',
      label: 'Système',
      icon: '⚙️',
      subItems: [
        { label: 'Santé', path: '/health-monitoring' },
        { label: 'Audit', path: '/audit-log-viewer' },
        { label: 'Configurations', path: '/admin/settings' }
      ]
    },
    {
      id: 'billing',
      label: 'Facturation',
      icon: '💳',
      subItems: [
        { label: 'Abonnements', path: '/subscription-tiers' },
        { label: 'Factures', path: '/admin/invoices' },
        { label: 'Contrôle des Fonctionnalités', path: '/feature-control' }
      ]
    },
    {
      id: 'profile',
      label: 'Profil Admin',
      icon: '⚙️',
      subItems: [
        { label: 'Paramètres', path: '/profile' },
        { label: 'Sécurité', path: '/security' }
      ]
    }
  ];

  // Sélectionner le menu selon le rôle
  const getMenuForRole = () => {
    switch (user?.role) {
      case 'buyer': return buyerMenu;
      case 'supplier': return supplierMenu;
      case 'admin': return adminMenu;
      default: return [];
    }
  };

  const menu = getMenuForRole();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleNavigation = (path, label, featureKey) => {
    if (featureKey && !checkFeatureAccess(featureKey)) {
      handleLockedFeatureClick(featureKey);
      return;
    }
    setPageTitle(label);
    navigate(path);
  };

  const isMenuItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">MyNet</span>
          </div>
          <span className="role-badge">{user?.role?.toUpperCase()}</span>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
          <div className="user-details">
            <p className="user-name">{user?.email || 'Utilisateur'}</p>
            <p className="user-role">{user?.role === 'buyer' ? 'Acheteur' : user?.role === 'supplier' ? 'Fournisseur' : 'Admin'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menu.map(item => (
            <div key={item.id} className="menu-item-container">
              {item.subItems.length > 0 ? (
                <>
                  <button
                    className={`menu-item ${expandedMenus[item.id] ? 'expanded' : ''}`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                    <span className="menu-arrow">›</span>
                  </button>

                  {/* Submenu */}
                  {expandedMenus[item.id] && (
                    <div className="submenu">
                      {item.subItems.map((subItem, idx) => {
                        const isAvailable = checkFeatureAccess(subItem.featureKey);
                        return (
                          <button
                            key={idx}
                            className={`submenu-item ${isMenuItemActive(subItem.path) ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                            onClick={() => handleNavigation(subItem.path, subItem.label, subItem.featureKey)}
                            disabled={!isAvailable}
                          >
                            <span className="submenu-dot">•</span>
                            <span className="submenu-label">{subItem.label}</span>
                            {!isAvailable && <span className="upgrade-badge-sm">PRO</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <button
                  className={`menu-item ${isMenuItemActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path, item.label)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            className="btn-logout-sidebar"
            onClick={onLogout}
          >
            <span className="logout-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={closeUpgradeModal}
        currentTier={currentTier}
        featureKey={upgradeModal.featureKey}
      />
    </>
  );
}
