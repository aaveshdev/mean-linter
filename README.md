# 😈 Mean Linter

> Brutally honest Git pre-commit linter that roasts your code before anyone else can.

`mean-linter` is a command-line tool that scans your staged changes and throws sarcastic, judgmental messages if it finds bad patterns. Works great as a Husky pre-commit hook.

---

## 💡 Why?

Because you're tired of writing polite, overly technical linters. You want **truth**, **brutality**, and some tough love that makes you _actually_ fix bad code.

---

## 🔧 Installation

Add it to your project:

```bash
npm install mean-linter --save-dev
```

Then initialize it with:

```bash
npx mean-linter init
```

This will:

- Install [Husky](https://github.com/typicode/husky) if needed
- Add a `pre-commit` Git hook
- Automatically reject garbage code from entering your repo

---

## 🚀 Usage

Run manually:

```bash
npx mean-linter
```

Or let Git trigger it on every commit (after `init`).

---

## 🤬 What It Yells About

- `console.log()`, `var`, `alert()`? Yep, roasted.
- Empty `catch` blocks? Called out.
- `eval()`? Demonic.
- Long lines, single-letter vars, TODOs? Judged.
- Legacy code like `for`, `while(true)`? Shamed.

Example output:

```bash
🚨 MEAN LINTER REPORT 🚨

File: src/index.js
  Line 42: console.log("debugging stuff")
  ❌ Busted! Console statements left behind. Clean up your mess before going to prod.
     Found: "console.log"

😬 Nice try. But no. Clean your code and come back stronger. Commit rejected.
```

---

## 📂 Files Ignored

- Lockfiles (`package-lock.json`, `yarn.lock`, etc.)
- `.husky/` hooks
- You can tweak this later with your own logic

---

## 🧪 Local Dev

Want to try it on your own commits without installing globally?

```bash
npm link
npx mean-linter
```

---

## 📝 Scripts

After init, `mean-linter` adds this to your `package.json` (if missing):

```json
"scripts": {
  "prepare": "husky install"
}
```

---

## ⚙️ Custom Configuration (`.meanlintrc`)

You can fine-tune `mean-linter` by creating a `.meanlintrc` file in your project root. This lets you **disable specific linting rules** if you're feeling brave — or just want fewer judgmental comments for now.

### 📄 Example `.meanlintrc`

```json
{
  "disableRules": ["console", "long-lines", "eval"]
}
```

### 🔧 Available Rule IDs

| Rule ID              | What it catches                            |
| -------------------- | ------------------------------------------ |
| `console`            | Console statements like `console.log()`    |
| `var`                | Usage of `var` instead of `let` or `const` |
| `empty-catch`        | Empty `catch {}` blocks                    |
| `long-lines`         | Lines longer than 120 characters           |
| `single-letter-vars` | Variables like `x`, `y`, `a`               |
| `todo-comment`       | Comments with `TODO`, `FIXME`, or `HACK`   |
| `loose-eq`           | Use of `==` instead of `===`               |
| `eval`               | Any usage of `eval()`                      |
| `for-loop`           | Classic C-style `for` loops                |
| `while-true`         | `while(true)` loops                        |
| `alert`              | Use of `alert()`                           |
| `document-write`     | Use of `document.write()`                  |
| `new-array`          | `new Array()` instead of `[]`              |
| `new-object`         | `new Object()` instead of `{}`             |

### 🛠 When You Run `mean-linter init`

A default config is generated automatically:

```json
{
  "disableRules": []
}
```

No rules are disabled by default — because shame is a feature, not a bug.

---

## 📢 Coming Soon

- Roast level: `mild`, `mean`, `savage`
- GitHub Action integration

---

## 🧠 Philosophy

> "Linters tell you what’s wrong. This one tells you _why you should be ashamed._"

---

## ⚠️ Disclaimer

Meant to be fun and educational. If your team doesn't like brutal honesty, maybe stick with ESLint 😇

---

## 📃 License

MIT — because you're free to roast responsibly.
