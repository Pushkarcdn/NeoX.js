#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";

// Check if Node version is sufficient
const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];

if (major < 22) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n` +
        "NeoX.js requires Node 22 or higher.\n" +
        "Please update your Node version."
    )
  );
  process.exit(1);
}

// Get the version from package.json
import packageJson from "./package.json" with { type: "json" };
const neoxVersion = packageJson.version;

console.log(
  chalk.blue(`
╔═════════════════════════════════════════════╗
║                   NeoX.js                   ║
║    The Smartest Node Backend Framework!     ║
╚═════════════════════════════════════════════╝
`)
);

console.log(
  chalk.cyan(`📦 Installing NeoX.js version: ${chalk.bold(neoxVersion)}\n`)
);

async function createApp() {
  // Get app name from command line argument if provided
  const args = process.argv.slice(2);
  const appNameArg = args[0];

  const questions = [];

  // Only ask for app name if not provided as argument
  if (!appNameArg) {
    questions.push({
      type: "input",
      name: "appName",
      message: "What is your project name?",
      default: "my-neox-app",
      validate: (input) => {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        else
          return "Project name may only include letters, numbers, underscores and hyphens.";
      },
    });
  } else {
    // Validate the provided app name
    if (!/^([A-Za-z\-\_\d])+$/.test(appNameArg)) {
      console.log(
        chalk.red(
          "❌ Project name may only include letters, numbers, underscores and hyphens."
        )
      );
      process.exit(1);
    }
  }

  questions.push(
    {
      type: "input",
      name: "appDescription",
      message: "Project description:",
      default: "A NeoX.js backend application",
    },
    {
      type: "input",
      name: "appAuthor",
      message: "Author name:",
      default: "Your Name",
    }
  );

  const answers = await inquirer.prompt(questions);

  const appName = appNameArg || answers.appName;
  const appDescription = answers.appDescription;
  const appAuthor = answers.appAuthor;
  const projectPath = path.resolve(process.cwd(), appName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Directory "${appName}" already exists!`));
    process.exit(1);
  }

  try {
    console.log(chalk.blue(`Creating new NeoX.js app in ${projectPath}...`));

    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });

    // Get template files path
    const templatePath = path.join(__dirname, "./template");

    // Copy all template files
    await fs.copy(templatePath, projectPath);

    // Update package.json with app details
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = appName;
    packageJson.description = appDescription;
    packageJson.author = appAuthor;

    // Update repository URLs
    if (packageJson.repository && packageJson.repository.url) {
      packageJson.repository.url = packageJson.repository.url
        .replace("{{app-author}}", appAuthor)
        .replace("{{app-name}}", appName);
    }
    if (packageJson.bugs && packageJson.bugs.url) {
      packageJson.bugs.url = packageJson.bugs.url
        .replace("{{app-author}}", appAuthor)
        .replace("{{app-name}}", appName);
    }
    if (packageJson.homepage) {
      packageJson.homepage = packageJson.homepage
        .replace("{{app-author}}", appAuthor)
        .replace("{{app-name}}", appName);
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    // Update README.md with app name
    const readmePath = path.join(projectPath, "README.md");
    if (await fs.pathExists(readmePath)) {
      let readmeContent = await fs.readFile(readmePath, "utf8");
      readmeContent = readmeContent.replace(/\{\{app-name\}\}/g, appName);
      await fs.writeFile(readmePath, readmeContent, "utf8");
    }

    // Rename gitignore to .gitignore (npm doesn't publish dotfiles by default)
    const gitignorePath = path.join(projectPath, "gitignore");
    const dotGitignorePath = path.join(projectPath, ".gitignore");
    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(gitignorePath, dotGitignorePath);
    }

    console.log(chalk.green(`✅ Project "${appName}" created successfully!`));

    console.log(chalk.yellow("\n📦 Installing dependencies..."));

    // Change to project directory and install dependencies
    process.chdir(projectPath);

    try {
      execSync("npm install", { stdio: "inherit" });
      console.log(chalk.green("✅ Dependencies installed successfully!"));
    } catch (installError) {
      console.log(
        chalk.yellow(
          "⚠️  Dependencies installation failed. You can install them manually later."
        )
      );
    }

    // Initialize git repository
    console.log(chalk.yellow("\n📂 Initializing git repository..."));
    try {
      execSync("git --version", { stdio: "ignore" });
      execSync("git init", { stdio: "ignore" });
      execSync("git add -A", { stdio: "ignore" });
      execSync('git commit -m "Initial commit from create-neox-app"', {
        stdio: "ignore",
      });
      console.log(chalk.green("✅ Git repository initialized successfully!"));
    } catch (gitError) {
      console.log(
        chalk.yellow(
          "⚠️  Git initialization failed. You can initialize git manually later with 'git init'."
        )
      );
    }

    console.log(chalk.cyan("\n🎉 Next steps:"));
    console.log(chalk.cyan(`   1. cd ${appName}`));
    console.log(
      chalk.cyan(
        "   2. Copy .env.example to .env.local and configure your environment variables"
      )
    );
    console.log(chalk.cyan("   3. Set up your PostgreSQL database"));
    console.log(chalk.cyan("   4. npm run dev:local"));
    console.log(
      chalk.gray("\n📚 Documentation: https://github.com/pushkarcdn/neox.js")
    );
  } catch (error) {
    console.log(chalk.red("❌ Error creating project:"), error.message);
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\nInstallation cancelled."));
  process.exit(0);
});

createApp();
