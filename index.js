#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

// ✅ 1. Generate llm.txt
if (args.includes("--llm-guide") || args.includes("-g")) {
  const targetFile = path.resolve(process.cwd(), "llm.txt");

  if (fs.existsSync(targetFile)) {
    console.log("⚠️  llm.txt already exists. Skipping.");
  } else {
    fs.writeFileSync(
      targetFile,
      `# LLM Guidelines

## Markup guides

~~~
<div className="block">
  <div className="block__element block__element--modifier">
</div>
~~~

## Styling Guide

### SCSS Module

~~~
.block {
  &__element {
    &--modifier {}
  }
}
~~~

### Styled Components

~~~
import styled from "styled-components";

export const FeatureBanner = styled.div\`
  &__element {
    &--modifier {}
  }
\`;
~~~
`,
      "utf8"
    );
    console.log("✅ Generated llm.txt");
  }
}

// ✅ 2. Run @oninross/create-component
else if (args.includes("--create-component") || args.includes("-c")) {
  try {
    execSync("npx @oninross/create-component", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Failed to run create-component:", error.message);
    process.exit(1);
  }
}

// ✅ 3. Scaffold Next.js + Storybook
else if (args.includes("--scaffold")) {
  const cmds = [
    "npx create-next-app@latest . --app --typescript --eslint",
    "npm install -D sass-embedded",
    "npx storybook@latest init",
  ];

  try {
    cmds.forEach((cmd) => {
      console.log(`▶ Running: ${cmd}`);
      execSync(cmd, { stdio: "inherit" });
    });
    console.log("✅ Scaffold complete!");
  } catch (error) {
    console.error("❌ Scaffold failed:", error.message);
    process.exit(1);
  }
}

// ✅ 4. Switch SSH key for GitHub
else if (args.includes("--switch") || args.includes("-s")) {
  const sshDir = path.join(process.env.HOME || process.env.USERPROFILE, ".ssh");
  let pubKeys = [];
  try {
    pubKeys = fs.readdirSync(sshDir).filter((f) => f.endsWith(".pub"));
    if (pubKeys.length === 0) {
      console.log("❌ No SSH public keys found in ~/.ssh");
      process.exit(1);
    }
  } catch (e) {
    console.error("❌ Could not read ~/.ssh directory");
    process.exit(1);
  }

  // Try to detect currently used key for github.com
  let currentKey = null;
  let currentKeyDisplay = null;
  try {
    const sshConfig = path.join(sshDir, "config");
    if (fs.existsSync(sshConfig)) {
      const configContent = fs.readFileSync(sshConfig, "utf8");
      const match = configContent.match(
        /Host github.com[\s\S]*?IdentityFile (.*)/
      );
      if (match) {
        currentKey = match[1].trim();
        currentKeyDisplay = path.basename(currentKey) + ".pub";
      }
    }
  } catch {}

  (async () => {
    if (currentKey) {
      console.log(`\n🔑 Currently used SSH key for GitHub: ${currentKey}`);
    } else {
      console.log(
        "\n🔑 No SSH key is currently set for GitHub in your ~/.ssh/config."
      );
    }

    console.log("\nAvailable SSH keys:");
    pubKeys.forEach((k, i) => {
      const keyPath = path.join(sshDir, k.replace(/\.pub$/, ""));
      const isCurrent = currentKey && keyPath === currentKey;
      console.log(`  [${i + 1}] ${k}${isCurrent ? " (current)" : ""}`);
    });

    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Which SSH key do you want to use for GitHub pushes?",
        choices: pubKeys.map((k) => ({
          name: k,
          value: k.replace(/\.pub$/, ""),
        })),
      },
    ]);

    const selectedKeyPath = path.join(sshDir, selected);
    // Update ~/.ssh/config for github.com
    let configContent = "";
    const sshConfig = path.join(sshDir, "config");
    if (fs.existsSync(sshConfig)) {
      configContent = fs.readFileSync(sshConfig, "utf8");
      // Remove existing github.com block
      configContent = configContent.replace(
        /Host github.com[\s\S]*?(?=Host |$)/g,
        ""
      );
    }
    configContent += `\nHost github.com\n  HostName github.com\n  User git\n  IdentityFile ${selectedKeyPath}\n  IdentitiesOnly yes\n`;
    fs.writeFileSync(sshConfig, configContent, "utf8");

    // Add key to ssh-agent
    try {
      execSync(`ssh-add ${selectedKeyPath}`);
      console.log(`\n✅ Switched GitHub SSH key to: ${selected}`);
    } catch (e) {
      console.log(
        "⚠️  Could not add key to ssh-agent. You may need to run 'eval $(ssh-agent)' and try again."
      );
    }
  })();
}

// ✅ 5. List all available commands
else if (args.includes("--help") || args.includes("-h")) {
  console.log(`\nAvailable commands in @oninross/toolbox:`);
  console.log(`  --llm-guide, -g         Generate llm.txt in the project root`);
  console.log(`  --create-component, -c  Run @oninross/create-component`);
  console.log(`  --scaffold              Scaffold Next.js + Storybook`);
  console.log(`  --switch, -s            Switch SSH key for GitHub pushes`);
  console.log(
    `  --clean-modules, -x     Remove node_modules and package-lock.json`
  );
  console.log(
    `  --help, -h              List all available commands in this package`
  );
}
// ✅ 7. Remove node_modules and package-lock.json
else if (args.includes("--clean-modules") || args.includes("-x")) {
  try {
    execSync("rm -rf node_modules package-lock.json", { stdio: "inherit" });
    console.log("✅ Removed node_modules and package-lock.json");
  } catch (error) {
    console.error("❌ Failed to clean modules:", error.message);
    process.exit(1);
  }
}

// ✅ 6. Remove node_modules and package-lock.json
else if (args.includes("--clean-modules") || args.includes("-x")) {
  try {
    execSync("rm -rf node_modules package-lock.json", { stdio: "inherit" });
    console.log("✅ Removed node_modules and package-lock.json");
  } catch (error) {
    console.error("❌ Failed to clean modules:", error.message);
    process.exit(1);
  }
}

// ✅ 7. Help text
else {
  console.log(`
Usage:
  npx @oninross/toolbox --llm-guide             Generate llm.txt in the project root
  npx @oninross/toolbox --create-component, -c  Run @oninross/create-component
  npx @oninross/toolbox --scaffold              Scaffold Next.js + Storybook
  npx @oninross/toolbox --switch                Switch SSH key for GitHub pushes
  npx @oninross/toolbox -s                      Switch SSH key for GitHub pushes (shorthand)
  npx @oninross/toolbox --clean-modules, -x     Remove node_modules and package-lock.json
  npx @oninross/toolbox --help, -h              List all available commands in this package

Examples:
  npx @oninross/toolbox --llm-guide
  npx @oninross/toolbox --create-component
  npx @oninross/toolbox -c
  npx @oninross/toolbox --scaffold
  npx @oninross/toolbox --clean-modules
  npx @oninross/toolbox -x
  npx @oninross/toolbox --help
  npx @oninross/toolbox -h
  `);
}
