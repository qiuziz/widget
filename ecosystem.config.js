const packageInfo = require('./package.json');
const name = packageInfo.name;
const clusterName = packageInfo['cluster-name'];
module.exports = {
  apps: [
    {
      name: name,
      cwd: '/opt/web/' + clusterName + '/dist/',
      script: 'server.js',
      exec_mode: 'cluster',
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      out_file: '/opt/log/pm2.log',
      error_file: '/opt/log/pm2-error.log',
      merge_logs: true,
      combine_logs: true
    }
  ]
};
