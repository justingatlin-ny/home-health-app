module.exports = {
  apps: [
    {
      name: "server",
      script: "build/server-bundle.js",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "/dev/null",
      instances: 1,
      autorestart: true,
      watch: ["build/server-bundle.js"],
      ignore_watch: ["node_modules", "logs"],
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    production: {
      user: "node",
      host: "212.83.163.1",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "/var/www/production",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
