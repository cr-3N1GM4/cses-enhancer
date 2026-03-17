// ==========================================
// FEATURE 1: Stats, Stars, Notes Modal, Sorting
// ==========================================
if (document.querySelectorAll('li.task').length > 0) {
    chrome.storage.local.get(['csesData'], function(result) {
        let data = result.csesData || {};
        let solved = 0; let wrong = 0;
        let tasks = document.querySelectorAll('li.task');
        let total = tasks.length;
        
        // --- 1. Setup the Rich Text Modal HTML ---
        // (This remains exactly the same as the previous version)
        let modalOverlay = document.createElement('div');
        modalOverlay.className = 'cses-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="cses-modal">
                <div class="cses-modal-header">
                    <span id="cses-modal-title">Notes</span>
                    <span class="cses-modal-close">&times;</span>
                </div>
                <div class="cses-modal-body">
                    <div class="cses-toolbar">
                        <button data-cmd="bold">B</button>
                        <button data-cmd="italic">I</button>
                        <button data-cmd="h1">H1</button>
                        <button data-cmd="h2">H2</button>
                        <button data-cmd="h3">H3</button>
                        <button data-cmd="insertUnorderedList">• List</button>
                        <button data-cmd="insertOrderedList">1. List</button>
                        <button data-cmd="formatBlock" data-val="PRE">{ } Code Block</button>
                    </div>
                    <div id="cses-note-editor" contenteditable="true" spellcheck="false"></div>
                </div>
                <div class="cses-modal-footer">
                    <button class="cses-btn-cancel">Cancel</button>
                    <button class="cses-btn-save">Save Notes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        let activeTaskId = null;
        let noteEditor = document.getElementById('cses-note-editor');
        
        function closeModal() { modalOverlay.classList.remove('active'); }
        document.querySelector('.cses-modal-close').onclick = closeModal;
        document.querySelector('.cses-btn-cancel').onclick = closeModal;
        
        document.querySelector('.cses-btn-save').onclick = () => {
            if (activeTaskId) {
                data[activeTaskId].note = noteEditor.innerHTML;
                chrome.storage.local.set({ csesData: data });
            }
            closeModal();
        };

        noteEditor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });

        document.querySelectorAll('.cses-toolbar button').forEach(btn => {
            btn.onmousedown = (e) => {
                e.preventDefault(); 
                let cmd = btn.getAttribute('data-cmd');
                let val = btn.getAttribute('data-val') || null;
                if (cmd === 'h1' || cmd === 'h2' || cmd === 'h3') {
                    document.execCommand('formatBlock', false, cmd.toUpperCase());
                } else {
                    document.execCommand(cmd, false, val);
                }
            };
        });

        // --- 2. Process Problem List (NEW LAYOUT & BULLETPROOF STATS) ---
        tasks.forEach(task => {
            // Bulletproof counting: Search the raw HTML for the success/fail keywords
            let rawHtml = task.innerHTML.toLowerCase();
            if (rawHtml.includes('valid') || rawHtml.includes('full')) solved++;
            else if (rawHtml.includes('fail') || rawHtml.includes('zero')) wrong++;
            
            let link = task.querySelector('a');
            if (!link) return;
            
            let taskId = link.href.split('/').pop();
            let taskTitle = link.innerText;
            if (!data[taskId]) data[taskId] = { star: false, note: '' };
            
            // Re-engineer the row layout
            task.style.display = 'flex'; 
            task.style.alignItems = 'center';
            
            link.style.display = 'flex'; 
            link.style.alignItems = 'center';
            link.style.flexGrow = '1'; // Forces the link to take up all middle space
            link.style.textDecoration = 'none';

            // Pen Icon Button
            let penBtn = document.createElement('span');
            penBtn.className = 'cses-edit-pen';
            penBtn.innerHTML = '✏️'; 
            penBtn.title = "Edit Notes";
            penBtn.onclick = (e) => {
                e.preventDefault();
                activeTaskId = taskId;
                document.getElementById('cses-modal-title').innerText = `Notes: ${taskTitle}`;
                noteEditor.innerHTML = data[taskId].note || '';
                modalOverlay.classList.add('active');
            };
            
            // Star Button
            let starBtn = document.createElement('span');
            starBtn.className = 'cses-star ' + (data[taskId].star ? 'starred' : '');
            starBtn.innerHTML = data[taskId].star ? '★' : '☆';
            starBtn.onclick = (e) => {
                e.preventDefault();
                data[taskId].star = !data[taskId].star;
                starBtn.innerHTML = data[taskId].star ? '★' : '☆';
                starBtn.className = 'cses-star ' + (data[taskId].star ? 'starred' : '');
                chrome.storage.local.set({ csesData: data });
            };

            // INJECT IN PROPER ORDER: Title -> Pen -> Detail
            let detailSpan = link.querySelector('.detail');
            if (detailSpan) {
                link.insertBefore(penBtn, detailSpan); // Put pen right before solvers
            } else {
                link.appendChild(penBtn);
            }

            // APPEND STAR AT VERY END OF THE ROW (After the checkmark)
            task.appendChild(starBtn);

            task.dataset.originalIndex = Array.from(task.parentNode.children).indexOf(task);
            let match = task.innerText.match(/(\d+)\s*\/\s*\d+/);
            task.dataset.solvedCount = match ? parseInt(match[1], 10) : 0;
        });

        // --- 3. Inject Stats into Navigation Bar ---
        let navBar = document.querySelector('.nav') || document.querySelector('.title-block');
        
        if (navBar) {
            let statsContainer = document.createElement('div');
            statsContainer.className = 'cses-nav-stats';
            statsContainer.innerHTML = `
                <div class="cses-mystats-box">MYSTATS:</div>
                <div class="cses-stats-stack">
                    <span style="color: #00b300;">SOLVED: ${solved}</span>
                    <span style="color: #ff0000;">WRONG: ${wrong}</span>
                    <span style="color: #0000ff;">TOTAL: ${total}</span>
                </div>
                <select id="cses-sort" style="margin-left: 20px; font-size: 13px; padding: 4px; cursor: pointer; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; outline: none;">
                    <option value="default">Sort: Default</option>
                    <option value="solved">Sort: By Solvers</option>
                </select>
            `;
            // If the nav bar is a flex/inline container, this slots right in at the end
            navBar.appendChild(statsContainer);
            navBar.style.display = 'flex';
            navBar.style.alignItems = 'center';
            navBar.style.flexWrap = 'wrap';
        }
        
        // --- 4. Sorting Logic ---
        document.getElementById('cses-sort').addEventListener('change', (e) => {
            let sortBy = e.target.value;
            document.querySelectorAll('ul').forEach(ul => {
                let taskArray = Array.from(ul.querySelectorAll('li.task'));
                if (taskArray.length === 0) return;
                taskArray.sort((a, b) => {
                    if (sortBy === 'solved') return parseInt(b.dataset.solvedCount) - parseInt(a.dataset.solvedCount);
                    return parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex);
                });
                taskArray.forEach(t => ul.appendChild(t)); 
            });
        });
    });
}

// ==========================================
// FEATURE 2: Direct Text Submission
// ==========================================
if (window.location.href.includes('/submit/')) {
    let form = document.querySelector('form');
    let fileInput = document.querySelector('input[type="file"]');
    
    if (form && fileInput) {
        let textSubmitContainer = document.createElement('div');
        textSubmitContainer.className = 'cses-text-submit';
        
        let label = document.createElement('h3');
        label.innerText = 'Or paste your code directly:';
        
        let textarea = document.createElement('textarea');
        textarea.id = 'cses-code-textarea';
        textarea.placeholder = '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Paste your code here\n    return 0;\n}';
        textarea.rows = 20;
        
        textSubmitContainer.appendChild(label);
        textSubmitContainer.appendChild(textarea);
        form.insertBefore(textSubmitContainer, fileInput.parentNode);
        
        form.addEventListener('submit', (e) => {
            let code = textarea.value.trim();
            if (code) {
                let langSelect = document.querySelector('select[name="lang"]');
                let ext = ".cpp"; 
                if (langSelect) {
                    let langText = langSelect.options[langSelect.selectedIndex].text.toLowerCase();
                    if (langText.includes('python')) ext = ".py";
                    else if (langText.includes('java')) ext = ".java";
                }
                let file = new File([code], "solution" + ext, { type: "text/plain", lastModified: new Date().getTime() });
                let dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }
        });
    }
}