#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import supportsColor from "supports-color";

chalk.level = supportsColor.stdout ? supportsColor.stdout.level : 1;

export function runMeanLinter(diffText) {
    const config = loadConfig();
  const disabledRules = new Set(config.disableRules || []);
  const badPatterns = [
    { id: "console", regex: /console\.(log|warn|error|info|debug)\(/, message: "Busted! Console statements left behind. Clean up your mess before going to prod." },
    { id: "var", regex: /var\s+/, message: "'var'? Really? It's 2025. Use 'let' or 'const' like a grown-up." },
    {
      id: "empty-catch", regex: /catch\s*\([^)]*\)\s*{\s*(?:\/\/[^\n]*\n*|\/\*[\s\S]*?\*\/|\s*)*}/g,
      message: "Empty catch block spotted. Just ignoring errors, huh? Bold strategy."
    },
    { id: "long-lines", regex: /[^\n]{120,}/, message: "Whoa there! Line's too long. Code isn't a bedtime story — break it up." },
    { id: "single-letter-vars", regex: /\b(?:let|const|var)\s+(a|b|c|x|y|z)\b/g, message: "Single-letter variables? What is this, algebra class? Be descriptive." },
    { id: "todo-comment", regex: /\/\/\s*(TODO|FIXME|HACK)/i, message: "Found a TODO/FIXME. Future you is judging you already." },
    { id: "loose-eq", regex: /(?<![=!])==(?![=])/, message: "Loose equality? That’s how bugs sneak in. Use `===` and stay sharp." },
    { id: "eval", regex: /eval\(/, message: "`eval()`? Are you trying to summon demons? Don’t." },
    { id: "for-loop", regex: /[^\w]for\([^;]*;[^;]*;[^)]*\)/, message: "Classic for-loop detected. Are we stuck in 2009? Use modern methods." },
    { id: "while-true", regex: /[^\w]while\(true\)/, message: "Infinite loop? Better have snacks. Or better yet, a break condition." },
    { id: "alert", regex: /[^\w]alert\(/, message: "alert() detected. This isn't 1999." },
    { id: "document-write", regex: /[^\w]document\.write\(/, message: "document.write() detected. This is considered harmful." },
    { id: "new-array", regex: /\bnew\s+Array\(\)/, message: "`new Array()`? Nah. Use `[]` and move on with your life" },
    { id: "new-object", regex: /\bnew\s+Object\(\)/, message: "`new Object()` spotted. Use `{}` like everyone else." },
  ].filter(rule => !disabledRules.has(rule.id));

  const skipFiles = [
    /package\.json$/,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    /\.husky\//,
  ];

  const lines = diffText.split("\n");
  let issues = [];
  let currentFile = null;
  let lineNumber = 0;
  let shouldSkipFile = false;

  for (let line of lines) {
    if (line.startsWith("+++ b/")) {
      currentFile = line.substring(6); 
      shouldSkipFile = skipFiles.some(pattern => pattern.test(currentFile));
      continue;
    }
    
    if (shouldSkipFile) continue;
    
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)/);
      if (match) lineNumber = parseInt(match[1], 10);
      continue;
    }
    
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    
    const code = line.substring(1);
    badPatterns.forEach(({ regex, message }) => {
      const matches = code.match(regex);
      if (matches) {
        issues.push({
          file: currentFile,
          code: code.trim(),
          message,
          lineNumber,
          match: matches[0].trim()
        });
      }
    });
    
    if (line.startsWith("+")) lineNumber++;
  }

  if (issues.length > 0) {
    console.log(chalk.bold.red("\n🚨 MEAN LINTER REPORT 🚨\n"));
    
    const issuesByFile = issues.reduce((acc, issue) => {
      if (!acc[issue.file]) acc[issue.file] = [];
      acc[issue.file].push(issue);
      return acc;
    }, {});

    for (const [file, fileIssues] of Object.entries(issuesByFile)) {
      console.log(chalk.bold.yellow(`\nFile: ${file}`));
      fileIssues.forEach(({ lineNumber, code, message, match }) => {
        console.log(chalk.gray(`  Line ${lineNumber}: ${code}`));
        console.log(chalk.red(`  ❌ ${message}`));
        if (match) console.log(chalk.red(`     Found: "${match}"`));
        console.log();
      });
    }

    console.log(chalk.red.bold("\n😬 Nice try. But no. Clean your code and come back stronger. Commit rejected.\n"));
    return { ok: false, issues };
  } else {
    console.log(chalk.green("\n✅ Your code passed the mean-linter... this time. 😈\n"));
    return { ok: true };
  }
}

export function initMeanLinter() {
  try {
    console.log(chalk.cyan("\n🛠 Setting up mean-linter pre-commit hook using Husky..."));
    
    if (!fs.existsSync('package.json')) {
      console.error(chalk.red("❌ No package.json found. Please run this in a Node.js project directory."));
      process.exit(1);
    }

    try {
      execSync("npm pkg get devDependencies.husky", { stdio: 'pipe' });
    } catch {
      execSync("npm install husky --save-dev", { stdio: "inherit" });
    }

    execSync("npx husky install", { stdio: "inherit" });


    const huskyDir = path.join(process.cwd(), ".husky");
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }

    const hookContent = `npx mean-linter
`;
    const hookPath = path.join(huskyDir, "pre-commit");
    fs.writeFileSync(hookPath, hookContent);
    fs.chmodSync(hookPath, 0o755);

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!pkg.scripts) pkg.scripts = {};
    if (!pkg.scripts.prepare) {
      pkg.scripts.prepare = "husky install";
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    }

     const configPath = path.join(process.cwd(), '.meanlintrc');
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        disableRules: []
      };
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      console.log(chalk.green("✅ Created default .meanlintrc config file."));
    } else {
      console.log(chalk.yellow("⚠️ .meanlintrc already exists. Skipping config creation."));
    }

    console.log(chalk.green("\n✅ mean-linter hook installed successfully!"));
    console.log(chalk.blue("\nFrom now on, your commits will be checked by the mean-linter."));
  } catch (err) {
    console.error(chalk.red("❌ Failed to set up Husky hook:"));
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

function loadConfig() {
  const configPath = path.join(process.cwd(), '.meanlintrc');
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn(chalk.yellow("⚠️ Could not parse .meanlintrc, using defaults."));
    }
  }
  return {};
}


const args = process.argv.slice(2);
if (args[0] === "init") {
  initMeanLinter();
} else {
  try {
    const diff = execSync("git diff --cached --unified=0", { encoding: "utf8" });
    const result = runMeanLinter(diff);
    if (!result.ok) process.exit(1);
  } catch (err) {
    console.error(chalk.red("❌ Error running mean-linter:"));
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}