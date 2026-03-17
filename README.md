# CSES Enhancer 🚀

A lightweight, open-source browser extension for Chrome and Firefox that supercharges your workflow on the [CSES Problem Set](https://cses.fi/problemset/). Built for competitive programmers who want frictionless grinding without context-switching.

## ✨ Features

* **Direct Code Submission:** Bypasses the file explorer completely. Paste your C++, Python, or Java code directly into a native text area on the submit page.
* **Custom Problem Notes:** Add specific notes (e.g., "Segment Tree", "Topological Sort") to any problem directly on the list page.
* **Star/Bookmark Problems:** Mark good or difficult questions with a star to revisit them later.
* **Live Stats Panel:** Instantly see your total Solved, Wrong, and Remaining problems at the top of the page.
* **Custom Sorting:** Sort problems by the number of solvers (easiest to hardest) or keep the default CSES order.
* **Local Storage:** All your stars and notes are saved locally in your browser so they persist between sessions.

## 🛠️ Installation Guide

Because this extension is not yet in the official web stores, you can easily install it locally in "Developer Mode".

### For Google Chrome / Brave / Edge:
1. Download this repository by clicking the green **Code** button and selecting **Download ZIP**, then extract the folder.
2. Open your browser and go to `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`).
3. Turn on **Developer mode** using the toggle in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the extracted folder containing the `manifest.json` file.
6. Done! Navigate to the CSES Problem Set to see it in action.

### For Mozilla Firefox:
1. Download and extract the ZIP file from this repository.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click the **Load Temporary Add-on...** button.
4. Select the `manifest.json` file from the extracted folder.
5. *Note: Firefox removes temporary add-ons when you restart the browser. You will need to reload it for your next session.*

## 💻 Usage

* **On the Problem List:** Use the dropdown at the top to sort. Click the star icon next to a problem to bookmark it, and click the text box to type your notes. The extension automatically saves when you click away.
* **On the Submit Page:** You will see a new text area right above the "Choose File" button. Paste your code, select your language from the native CSES dropdown, and hit Submit.

## 📄 License
MIT License. Feel free to fork, modify, and improve!
