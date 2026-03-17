// ==========================================
// FEATURE 1: Problem List (Stats, Stars, Notes, Sort)
// ==========================================
if (document.querySelectorAll('li.task').length > 0) {
    chrome.storage.local.get(['csesData'], function(result) {
        let data = result.csesData || {};
        
        let solved = 0;
        let wrong = 0;
        let tasks = document.querySelectorAll('li.task');
        let total = tasks.length;
        
        tasks.forEach(task => {
            // 1. Calculate Stats
            if (task.querySelector('.valid')) solved++;
            else if (task.querySelector('.fail')) wrong++;
            
            let link = task.querySelector('a');
            if (!link) return;
            
            let taskId = link.href.split('/').pop();
            let taskData = data[taskId] || { star: false, note: '' };
            
            // 2. Create Star Button
            let starBtn = document.createElement('span');
            starBtn.className = 'cses-star ' + (taskData.star ? 'starred' : '');
            starBtn.innerHTML = taskData.star ? '★' : '☆';
            starBtn.title = "Toggle Star";
            
            starBtn.onclick = (e) => {
                e.preventDefault();
                taskData.star = !taskData.star;
                starBtn.innerHTML = taskData.star ? '★' : '☆';
                starBtn.className = 'cses-star ' + (taskData.star ? 'starred' : '');
                saveData(taskId, taskData);
            };
            
            // 3. Create Note Input
            let noteInput = document.createElement('input');
            noteInput.type = 'text';
            noteInput.className = 'cses-note';
            noteInput.placeholder = 'Add a note... (e.g., segment tree, DP)';
            noteInput.value = taskData.note;
            
            noteInput.onchange = (e) => {
                taskData.note = e.target.value;
                saveData(taskId, taskData);
            };
            
            task.appendChild(starBtn);
            task.appendChild(noteInput);
            
            // 4. Prep Data for Sorting
            task.dataset.originalIndex = Array.from(task.parentNode.children).indexOf(task);
            let match = task.innerText.match(/(\d+)\s*\/\s*\d+/);
            task.dataset.solvedCount = match ? parseInt(match[1], 10) : 0;
        });

        function saveData(id, taskData) {
            data[id] = taskData;
            chrome.storage.local.set({ csesData: data });
        }

        // 5. Inject Stats Panel
        let panel = document.createElement('div');
        panel.className = 'cses-panel';
        panel.innerHTML = `
            <strong>Your Stats:</strong> 
            <span class="stat-ac">Solved: ${solved}</span> | 
            <span class="stat-wa">Wrong: ${wrong}</span> | 
            <span class="stat-total">Total: ${total}</span>
            
            <select id="cses-sort" style="margin-left: auto; padding: 5px; cursor: pointer;">
                <option value="default">Sort: Default Order</option>
                <option value="solved">Sort: By Solvers (Easiest to Hardest)</option>
            </select>
        `;
        
        let contentContainer = document.querySelector('.content') || document.body;
        contentContainer.insertBefore(panel, contentContainer.firstChild);
        
        // 6. Handle Sorting Logic
        document.getElementById('cses-sort').addEventListener('change', (e) => {
            let sortBy = e.target.value;
            
            document.querySelectorAll('ul').forEach(ul => {
                let taskArray = Array.from(ul.querySelectorAll('li.task'));
                if (taskArray.length === 0) return;
                
                taskArray.sort((a, b) => {
                    if (sortBy === 'solved') {
                        return parseInt(b.dataset.solvedCount) - parseInt(a.dataset.solvedCount);
                    } else {
                        return parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex);
                    }
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
                
                let file = new File([code], "solution" + ext, {
                    type: "text/plain",
                    lastModified: new Date().getTime()
                });
                
                let dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }
        });
    }
}