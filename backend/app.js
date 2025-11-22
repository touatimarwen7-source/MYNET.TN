const express = require('express');
const authRoutes = require('./routes/authRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const messagingRoutes = require('./routes/messagingRoutes');
const stripeWebhookRoutes = require('./routes/webhooks/stripeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const featureFlagRoutes = require('./routes/featureFlagRoutes');
const supplierFeatureRoutes = require('./routes/supplierFeatureRoutes');
const companyProfileRoutes = require('./routes/companyProfileRoutes');
const { ipMiddleware } = require('./middleware/ipMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ipMiddleware);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Running',
        message: 'MyNet.tn Procurement & Tender Management System API',
        version: '1.2.0',
        endpoints: {
            auth: '/api/auth',
            procurement: '/api/procurement',
            admin: '/api/admin',
            search: '/api/search',
            messaging: '/api/messaging',
            documents: '/api/documents/pdf',
            features: '/api/admin/features'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/procurement/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/features', featureFlagRoutes);
app.use('/api/admin/supplier-features', supplierFeatureRoutes);
app.use('/api/company-profile', companyProfileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/documents/pdf', pdfRoutes);
app.use('/api/webhooks', stripeWebhookRoutes);

const ErrorHandler = require('./middleware/errorHandler');

app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

module.exports = app;