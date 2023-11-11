export default () => ({
  config: {
    port: parseInt(process.env.PORT, 10) || 3000,
    cronExpression: process.env.CRON_EXPRESSION,
    backupPlan: JSON.parse(process.env.BACKUP_PLAN),
  },
});
