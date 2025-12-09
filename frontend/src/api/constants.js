
// API Configuration for Replit Environment
const isDevelopment = import.meta.env.DEV;
const replitDomain = window.location.hostname;

// في Replit، استخدم نفس الـ domain مع port 3000
export const API_BASE_URL = isDevelopment && replitDomain.includes('replit')
  ? `https://${replitDomain.replace('-00-', '-01-').replace('.replit.dev', '-3000.proxy.replit.dev')}/api`
  : 'http://0.0.0.0:3000/api';

export const API_TIMEOUT = 30000;

console.log('🔧 API Configuration:', {
  environment: isDevelopment ? 'development' : 'production',
  apiBaseUrl: API_BASE_URL,
  domain: replitDomain
});
