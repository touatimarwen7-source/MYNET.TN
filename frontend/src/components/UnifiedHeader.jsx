import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Divider,
  Chip,
  Fade,
  Zoom,
  Tooltip,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import tokenManager from '../services/tokenManager';
import NotificationCenter from './NotificationCenter';
import institutionalTheme from '../theme/theme';

// Hide header on scroll down
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div>{children}</div>
    </Slide>
  );
}

export default function UnifiedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('Utilisateur');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = institutionalTheme;

  // Detect scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getAccessToken();
      const userData = tokenManager.getUser();

      setIsAuthenticated(!!token);
      setUserRole(userData?.role || null);
      setUserName(userData?.username || userData?.email || 'Utilisateur');
    };

    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  const isPublicPage = useMemo(
    () => ['/', '/about', '/features', '/pricing', '/contact'].includes(location.pathname),
    [location.pathname]
  );

  const publicLinks = useMemo(
    () => [
      { label: 'Accueil', href: '/', icon: '🏠' },
      { label: 'À Propos', href: '/about', icon: 'ℹ️' },
      { label: 'Solutions', href: '/features', icon: '⚡' },
      { label: 'Tarification', href: '/pricing', icon: '💰' },
      { label: 'Contact', href: '/contact', icon: '📧' },
    ],
    []
  );

  const authenticatedLinks = useMemo(
    () => [
      { label: "Appels d'Offres", href: '/tenders', icon: '📋' },
      { label: 'Tableau de Bord', href: '/dashboard', icon: '📊' },
    ],
    []
  );

  const shouldShowAuthLinks = isAuthenticated;
  const shouldShowPublicLinks = isPublicPage || !isAuthenticated;

  const handleSearch = useCallback(
    (e) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/tenders?search=${encodeURIComponent(searchQuery)}`);
        setMobileSearchOpen(false);
      }
    },
    [searchQuery, navigate]
  );

  const handleLogout = useCallback(() => {
    tokenManager.clearTokens();
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
    setAnchorEl(null);
  }, [navigate]);

  const handleProfileMenuOpen = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setMobileMenuOpen(false);
    },
    [navigate]
  );

  const getRoleBadge = useCallback(() => {
    const roleMap = {
      buyer: { label: 'Acheteur', color: '#1976d2', icon: '🏢' },
      supplier: { label: 'Fournisseur', color: '#2e7d32', icon: '🏭' },
      admin: { label: 'Admin', color: '#d32f2f', icon: '👨‍💼' },
      super_admin: { label: 'Super Admin', color: '#9c27b0', icon: '👑' },
    };
    return roleMap[userRole] || { label: 'Utilisateur', color: '#757575', icon: '👤' };
  }, [userRole]);

  const roleBadge = getRoleBadge();

  const renderNavLinks = useCallback(
    (links) => {
      return links.map((link) => (
        <Tooltip key={link.href} title={link.label} arrow TransitionComponent={Zoom}>
          <Button
            onClick={() => handleNavigate(link.href)}
            sx={{
              color:
                location.pathname === link.href
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              fontWeight: location.pathname === link.href ? 600 : 500,
              textTransform: 'none',
              fontSize: '15px',
              position: 'relative',
              padding: '10px 18px',
              minHeight: '44px',
              borderRadius: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(0, 86, 179, 0.04)',
                transform: 'translateY(-1px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: location.pathname === link.href ? '70%' : '0%',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '3px 3px 0 0',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: location.pathname === link.href ? '0 2px 8px rgba(0,86,179,0.3)' : 'none',
              },
              '&:hover::after': {
                width: '70%',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '8px',
                border: location.pathname === link.href ? '2px solid transparent' : '2px solid transparent',
                background: location.pathname === link.href 
                  ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #0056B3, #0d47a1) border-box'
                  : 'transparent',
                opacity: location.pathname === link.href ? 0.1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              component="span"
              sx={{
                marginRight: '8px',
                fontSize: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '.MuiButton-root:hover &': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
            >
              {link.icon}
            </Box>
            <Box
              component="span"
              sx={{
                letterSpacing: '0.3px',
                fontFamily: "'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {link.label}
            </Box>
          </Button>
        </Tooltip>
      ));
    },
    [handleNavigate, location.pathname, theme]
  );

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
          color: theme.palette.text.primary,
          borderBottom: scrolled 
            ? '2px solid #0056B3' 
            : '1px solid rgba(224, 224, 224, 0.8)',
          boxShadow: scrolled 
            ? '0 4px 24px rgba(0,86,179,0.12), 0 2px 8px rgba(0,86,179,0.08)' 
            : '0 1px 3px rgba(0,0,0,0.02)',
          backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            gap: '16px',
            minHeight: { xs: '64px', md: '70px' },
          }}
        >
          {/* Logo with Animation */}
          <Zoom in timeout={500}>
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                minWidth: '150px',
                fontSize: '24px',
                fontWeight: 700,
                color: theme.palette.primary.main,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  color: '#0d47a1',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: '32px',
                  animation: 'rotate 3s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                🌐
              </Box>
              <Box component="span" sx={{ letterSpacing: '0.5px' }}>
                MyNet<span style={{ color: '#d32f2f' }}>.tn</span>
              </Box>
            </Box>
          </Zoom>

          {/* Desktop Navigation */}
          <Fade in timeout={800}>
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: '6px', 
                flex: 1, 
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 16px',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1px',
                  height: '30px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1px',
                  height: '30px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              {shouldShowAuthLinks && renderNavLinks(authenticatedLinks)}
              {shouldShowPublicLinks && renderNavLinks(publicLinks)}
            </Box>
          </Fade>

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <Fade in timeout={1000}>
              <TextField
                size="small"
                placeholder="🔍 Rechercher des appels d'offres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                sx={{
                  width: '250px',
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(0,86,179,0.1)',
                    },
                    '&:hover fieldset': { borderColor: '#0056B3' },
                  },
                }}
                InputProps={{
                  endAdornment: <SearchIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />,
                }}
              />
            </Fade>
          )}

          {/* Right Actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                {/* Notification Center */}
                <NotificationCenter />

                {/* User Profile Menu */}
                <Tooltip title="Mon Profil" arrow>
                  <Box
                    onClick={handleProfileMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '24px',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: roleBadge.color,
                        fontSize: '16px',
                        fontWeight: 600,
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: '100px', maxWidth: '150px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {userName}
                      </Typography>
                      <Chip
                        label={roleBadge.label}
                        size="small"
                        icon={<span>{roleBadge.icon}</span>}
                        sx={{
                          height: '20px',
                          fontSize: '11px',
                          backgroundColor: roleBadge.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #e0e0e0',
                    },
                  }}
                  TransitionComponent={Fade}
                >
                  <MenuItem
                    onClick={() => {
                      navigate('/dashboard');
                      handleProfileMenuClose();
                    }}
                    sx={{ gap: 1.5, py: 1.5 }}
                  >
                    <DashboardIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">Tableau de Bord</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleProfileMenuClose();
                    }}
                    sx={{ gap: 1.5, py: 1.5 }}
                  >
                    <PersonIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">Mon Profil</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleProfileMenuClose();
                    }}
                    sx={{ gap: 1.5, py: 1.5 }}
                  >
                    <SettingsIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">Paramètres</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/mfa-setup');
                      handleProfileMenuClose();
                    }}
                    sx={{ gap: 1.5, py: 1.5 }}
                  >
                    <SecurityIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">Sécurité</Typography>
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      gap: 1.5,
                      py: 1.5,
                      color: '#d32f2f',
                      '&:hover': { backgroundColor: '#ffebee' },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Se Déconnecter
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" gap={1.5}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  startIcon={<PersonIcon />}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      borderColor: '#0d47a1',
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  Connexion
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    boxShadow: '0 4px 12px rgba(0,86,179,0.3)',
                    '&:hover': {
                      backgroundColor: '#0d47a1',
                      boxShadow: '0 6px 16px rgba(0,86,179,0.4)',
                    },
                  }}
                >
                  Inscription Gratuite
                </Button>
              </Stack>
            )}
          </Box>

          {/* Mobile Actions */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <>
                <IconButton
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
                <NotificationCenter />
              </>
            )}
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ color: theme.palette.text.primary }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isAuthenticated && mobileSearchOpen && (
          <Fade in>
            <Box sx={{ px: 2, pb: 2, display: { xs: 'block', sm: 'none' } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="🔍 Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                    borderRadius: '20px',
                  },
                }}
              />
            </Box>
          </Fade>
        )}
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '280px',
            backgroundColor: '#fafafa',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {isAuthenticated && (
            <>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    margin: '0 auto 12px',
                    backgroundColor: roleBadge.color,
                    fontSize: '24px',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  {userName}
                </Typography>
                <Chip
                  label={roleBadge.label}
                  size="small"
                  icon={<span>{roleBadge.icon}</span>}
                  sx={{
                    mt: 1,
                    backgroundColor: roleBadge.color,
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </>
          )}

          <List sx={{ p: 0 }}>
            {shouldShowAuthLinks &&
              authenticatedLinks.map((link) => (
                <ListItem
                  button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  sx={{
                    mb: 1.5,
                    borderRadius: '12px',
                    backgroundColor: location.pathname === link.href 
                      ? 'rgba(0, 86, 179, 0.08)' 
                      : 'transparent',
                    color:
                      location.pathname === link.href
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    fontWeight: location.pathname === link.href ? 600 : 400,
                    padding: '14px 16px',
                    border: location.pathname === link.href 
                      ? '2px solid rgba(0, 86, 179, 0.2)' 
                      : '2px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 86, 179, 0.06)',
                      transform: 'translateX(4px)',
                      borderColor: 'rgba(0, 86, 179, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: location.pathname === link.href ? '4px' : '0px',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'width 0.3s ease',
                      borderRadius: '0 4px 4px 0',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      marginRight: '14px',
                      fontSize: '22px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'transform 0.3s ease',
                      'li:hover &': {
                        transform: 'scale(1.15) rotate(5deg)',
                      },
                    }}
                  >
                    {link.icon}
                  </Box>
                  <ListItemText 
                    primary={link.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '15px',
                        letterSpacing: '0.3px',
                      }
                    }}
                  />
                </ListItem>
              ))}
            {shouldShowPublicLinks &&
              publicLinks.map((link) => (
                <ListItem
                  button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  sx={{
                    mb: 1.5,
                    borderRadius: '12px',
                    backgroundColor: location.pathname === link.href 
                      ? 'rgba(0, 86, 179, 0.08)' 
                      : 'transparent',
                    color:
                      location.pathname === link.href
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    fontWeight: location.pathname === link.href ? 600 : 400,
                    padding: '14px 16px',
                    border: location.pathname === link.href 
                      ? '2px solid rgba(0, 86, 179, 0.2)' 
                      : '2px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 86, 179, 0.06)',
                      transform: 'translateX(4px)',
                      borderColor: 'rgba(0, 86, 179, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: location.pathname === link.href ? '4px' : '0px',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'width 0.3s ease',
                      borderRadius: '0 4px 4px 0',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      marginRight: '14px',
                      fontSize: '22px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'transform 0.3s ease',
                      'li:hover &': {
                        transform: 'scale(1.15) rotate(5deg)',
                      },
                    }}
                  >
                    {link.icon}
                  </Box>
                  <ListItemText 
                    primary={link.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '15px',
                        letterSpacing: '0.3px',
                      }
                    }}
                  />
                </ListItem>
              ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {isAuthenticated ? (
            <Stack gap={1.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Mon Profil
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Se Déconnecter
              </Button>
            </Stack>
          ) : (
            <Stack gap={1.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Connexion
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  navigate('/register');
                  setMobileMenuOpen(false);
                }}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Inscription Gratuite
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </HideOnScroll>
  );
}