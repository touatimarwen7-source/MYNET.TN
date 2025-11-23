/**
 * 🕐 BACKUP SCHEDULER
 * Automatically runs backups on schedule (daily at 2 AM)
 */

const schedule = require('node-schedule');
const BackupService = require('./BackupService');

class BackupScheduler {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * Start scheduled backups
   * Runs daily at 2 AM UTC
   */
  start() {
    try {
      // Schedule daily backup at 2 AM UTC (configurable)
      const backupJob = schedule.scheduleJob('0 2 * * *', async () => {
        console.log('🔄 Scheduled backup job started');
        await this.performBackup();
      });

      this.jobs.push(backupJob);
      this.isRunning = true;

      console.log('✅ Backup scheduler started');
      console.log('   Schedule: Daily at 2:00 AM UTC');
      console.log('   Next backup:', backupJob.nextInvocation());
    } catch (error) {
      console.error('❌ Failed to start backup scheduler:', error.message);
    }
  }

  /**
   * Perform backup operation
   */
  async performBackup() {
    try {
      console.log('📦 Performing scheduled backup...');
      const result = await BackupService.createBackup();

      if (result.success) {
        console.log(`✅ Scheduled backup completed: ${result.filename} (${result.size}MB)`);
      } else {
        console.error(`❌ Scheduled backup failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Backup error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    this.jobs.forEach(job => job.cancel());
    this.jobs = [];
    this.isRunning = false;
    console.log('🛑 Backup scheduler stopped');
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      jobsCount: this.jobs.length,
      nextBackup: this.jobs.length > 0 ? this.jobs[0].nextInvocation() : null,
      schedule: 'Daily at 2:00 AM UTC'
    };
  }
}

module.exports = new BackupScheduler();
