module.exports = {
    apps: [
      {
        name: "my-telegram-bot",
        script: "./src/bot.js",
        instances: 1,          // Adjust the number of instances as needed
        autorestart: true,     // Auto-restart on failure
        watch: false,          // Set to true if you want to watch for changes
        max_memory_restart: "200M",  // Auto-restart if memory exceeds 200MB
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production"
        },
        output: "./logs/output.log",  // Standard output
        error: "./logs/error.log"     // Error output
      }
    ]
};
  