# CSES Enhancer Pro 🚀

A high-performance browser extension designed to eliminate friction for competitive programmers on the [CSES Problem Set](https://cses.fi/problemset/). This "Pro" version transforms the standard CSES interface into a productivity powerhouse with rich-text notes, integrated stats, and seamless code submission.

## ✨ Key Features

### 📝 Rich-Text Notes Modal
* **WYSIWYG Editor:** Click the ✏️ icon next to any problem to open a beautiful dark-mode modal.
* **Formatting Toolbar:** Supports **Bold**, *Italics*, Headers (H1, H2, H3), and Lists.
* **IDE-Style Code Blocks:** Insert formatted code snippets directly into your notes.
* **Intelligent Tab Support:** Pressing `Tab` inside the editor inserts proper indentation instead of switching focus.
* **Live Dashboard:** Your **Solved**, **Wrong**, and **Total** counts are now elegantly stacked directly in the CSES navigation bar.

### ⚡ Frictionless Workflow
* **Direct Text Submission:** Skip the file explorer. Paste your solution directly into a text area on the submit page; the extension automatically packages it as a `.cpp`, `.py`, or `.java` file.
* **Custom Sorting:** Instantly reorder problems by the number of successful solvers to find the easiest questions first.
* **Star Bookmarks:** Mark high-quality problems with a gold star (★) to create a curated list of challenges to revisit.


## 🛠️ Installation Guide

1.  **Download:** Clone this repository or download the ZIP and extract it.
2.  **Chrome/Brave/Edge:**
    * Navigate to `chrome://extensions/`.
    * Enable **Developer mode** (top right).
    * Click **Load unpacked** and select the extension folder.
3.  **Firefox:**
    * Navigate to `about:debugging#/runtime/this-firefox`.
    * Click **Load Temporary Add-on...** and select the `manifest.json`.

## 💻 Tech Stack
* **JavaScript (ES6):** Custom DOM manipulation and event handling.
* **CSS3:** Dark-mode modal architecture and responsive navbar injection.
* **Chrome Storage API:** For high-speed local data persistence.

## 📄 License
MIT License - Open for use, modification, and contribution by the CP community.
