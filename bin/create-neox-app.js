#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const inquirer = require("inquirer");

console.log(chalk.blue("🚀 Welcome to NeoX.js!"));

async function createApp() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "What is your project name?",
      default: "my-neox-app",
    },
  ]);

  const appName = answers.appName;
  const projectPath = path.resolve(process.cwd(), appName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Directory ${appName} already exists!`));
    process.exit(1);
  }

  try {
    // Create project directory
    fs.mkdirSync(projectPath);

    // Get template files path
    const templatePath = path.join(__dirname, "../template_files");

    // Copy all template files
    await fs.copy(templatePath, projectPath);

    // Update package.json with app name
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = appName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green(`✅ Project ${appName} created successfully!`));
    console.log("\nNext steps:");
    console.log(chalk.cyan(`  cd ${appName}`));
    console.log(chalk.cyan("  npm install"));
    console.log(chalk.cyan("  npm start"));
    console.log("\nHappy coding! 🎉");
  } catch (error) {
    console.log(chalk.red("❌ Error creating project:"), error);
    process.exit(1);
  }
}

createApp();
