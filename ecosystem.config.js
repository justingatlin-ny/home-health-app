module.exports = {
  apps: [
    {
      name: "dev",
      script: "htdocs/server-bundle.js",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "/dev/null",
      watch_delay: 1500,
      ignore_watch : ["node_modules", "conf", "logs", "examples", "package.json", "document*"],
      instances: 1,
      autorestart: true,
      watch: ['htdocs'],
      max_memory_restart: "1G",
      source_map_support: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "prod",
      script: "htdocs/server-bundle.js",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "/dev/null",
      instances: 1,
      autorestart: true,
      watch: false,
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
