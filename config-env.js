require("dotenv").config();
const fs = require("fs");
const path = require("path");

function createEnvironmentFile(templatePath, targetPath) {
  if (!fs.existsSync(targetPath)) {
    const templateContent = fs.readFileSync(templatePath, "utf8");
    fs.writeFileSync(targetPath, templateContent);
  }
}

function updateEnvironmentFile(filePath, isProduction = false) {
  let content = fs.readFileSync(filePath, "utf8");

  // Set production flag
  content = content.replace(
    /production:\s*(true|false)/,
    `production: ${isProduction}`
  );

  const environmentVariables = [
    "API_KEY",
    "AUTH_DOMAIN",
    "PROJECT_ID",
    "STORAGE_BUCKET",
    "MESSAGING_SENDER_ID",
    "APP_ID",
    "MEASUREMENT_ID",
  ];

  environmentVariables.forEach((variable) => {
    const value = process.env[variable];
    if (value) {
      const regex = new RegExp(`'\\$\{${variable}\}'`, "g");
      content = content.replace(regex, `'${value}'`);
    } else {
      console.warn(`Warning: ${variable} is not set in the environment`);
    }
  });

  fs.writeFileSync(filePath, content);
}

const templatePath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.template.ts"
);
const envPath = path.join(__dirname, "src", "environments", "environment.ts");
const prodEnvPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.ts"
);

// Create and update both environment files
createEnvironmentFile(templatePath, envPath);
createEnvironmentFile(templatePath, prodEnvPath);
updateEnvironmentFile(envPath, false);
updateEnvironmentFile(prodEnvPath, true);

console.log("Environment configuration updated successfully");
