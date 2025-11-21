const healthMonitoring = require('../services/HealthMonitoringService');
const db = require('../config/db');

// لوحة تحكم الإدارة - الصحة والأداء
exports.getHealthDashboard = async (req, res) => {
  try {
    const healthStats = healthMonitoring.getHealthStats();
    const pathStats = healthMonitoring.getPathStats();
    const criticalAlerts = healthMonitoring.checkCriticalPaths();

    res.json({
      health: healthStats,
      paths: pathStats,
      alerts: criticalAlerts,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تصدير سجلات التدقيق
exports.exportAuditLogs = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND created_at >= $' + (params.length + 1);
      params.push(new Date(startDate));
    }
    if (endDate) {
      query += ' AND created_at <= $' + (params.length + 1);
      params.push(new Date(endDate));
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await db.query(query, params);

    if (format === 'csv') {
      // تحويل إلى CSV
      const csv = convertToCSV(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
      res.send(csv);
    } else {
      // تحويل إلى JSON-L (JSON Lines)
      const jsonl = rows.map(row => JSON.stringify(row)).join('\n');
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.jsonl"');
      res.send(jsonl);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحويل إلى CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csv.push(values.join(','));
  });
  
  return csv.join('\n');
}

// لوحة معلومات الإدارة الرئيسية
exports.getDashboard = async (req, res) => {
  try {
    // إحصائيات المستخدمين
    const usersRes = await db.query('SELECT COUNT(*) as total FROM users');
    const tenderRes = await db.query('SELECT COUNT(*) as total FROM tenders WHERE status = \'active\'');
    const offersRes = await db.query('SELECT COUNT(*) as total FROM offers WHERE status = \'pending\'');
    
    res.json({
      totalUsers: parseInt(usersRes.rows[0].total),
      activeTenders: parseInt(tenderRes.rows[0].total),
      pendingOffers: parseInt(offersRes.rows[0].total),
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
