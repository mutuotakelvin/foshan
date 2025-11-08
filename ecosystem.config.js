module.exports = {
  apps: [
    {
      name: 'foshan',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs', 'public', '.git'],
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      cwd: '/var/www/compressionsofa'
    }
  ]
};
