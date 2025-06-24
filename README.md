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

## 📢 Coming Soon

- Custom `.meanlintrc` config
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
