const { execSync } = require("child_process");
const path = require("path");

module.exports = function globalSetup() {
  const projectRoot = path.resolve(__dirname, "..");

  execSync("npx dotenv -e .env.test -- npx prisma migrate reset --force", {
    cwd: projectRoot,
    stdio: "inherit",
  });
};
