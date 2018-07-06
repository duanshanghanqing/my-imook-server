module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "my-imook-server_dev",
      script: "bin/www",
      env: {
        STAGE_ENV: "dev",
        PORT: 9001
      },
      cwd: ".",
      instances: "max",
      exec_mode: "cluster"
    },
    {
      name: "my-imook-server_test",
      script: "bin/www",
      env: {
        STAGE_ENV: "test",
        PORT: 9002
      },
      cwd: ".",
      instances: "max",
      exec_mode: "cluster"
    },
    {
      name: "my-imook-server_sim",
      script: "bin/www",
      env: {
        STAGE_ENV: "sim",
        PORT: 9003
      },
      cwd: ".",
      instances: "max",
      exec_mode: "cluster"
    },
    {
      name: "my-imook-server_prod",
      script: "bin/www",
      env: {
        STAGE_ENV: "prod",
        PORT: 9004
      },
      cwd: ".",
      instances: "max",
      exec_mode: "cluster"
    }
  ]
}
