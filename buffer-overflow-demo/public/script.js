const BUFFER_SIZE = 8;
let hasAlertedForOverflow = false;

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navDemo = document.getElementById('nav-demo');
    const navDebugging = document.getElementById('nav-debugging');
    const navLogout = document.getElementById('nav-logout');
    
    // Buttons
    const btnOpenDemo = document.getElementById('btn-open-demo');
    const btnRunTest = document.getElementById('btn-run-test');
    
    // Inputs
    const bufferInput = document.getElementById('buffer-input');
    
    // Forms
    const loginForm = document.getElementById('login-form');
    
    // Event Listeners for Navigation
    navDashboard.addEventListener('click', (e) => { e.preventDefault(); showView('dashboard-page'); });
    navDemo.addEventListener('click', (e) => { e.preventDefault(); showView('demo-page'); renderMemoryBlocks(bufferInput.value); });
    navDebugging.addEventListener('click', (e) => { e.preventDefault(); showView('debugging-page'); });
    navLogout.addEventListener('click', (e) => { e.preventDefault(); doLogout(); });
    
    btnOpenDemo.addEventListener('click', () => { showView('demo-page'); renderMemoryBlocks(bufferInput.value); });
    
    // Login Handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('login-error');
        
        if (user === 'admin' && pass === 'admin123') {
            document.getElementById('navbar').classList.remove('hidden');
            showView('dashboard-page');
            errorMsg.classList.add('hidden');
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    // Buffer Overflow Real-time Typing Event
    bufferInput.addEventListener('input', (e) => {
        const inputVal = e.target.value;
        
        // Handle Real-time Alert
        if (inputVal.length > BUFFER_SIZE) {
            if (!hasAlertedForOverflow) {
                alert(
                    "⚠️ SEGMENTATION FAULT\n\n" +
                    "BUFFER OVERFLOW DETECTED\n\n" +
                    "Buffer Size: 8 bytes\n" +
                    "Input Length: " + inputVal.length + " characters\n\n" +
                    "Memory boundary exceeded."
                );
                hasAlertedForOverflow = true;
            }
            updateStatusUI(true, inputVal.length);
        } else {
            hasAlertedForOverflow = false; // Reset if user deletes back to safe length
            updateStatusUI(false, inputVal.length);
        }
        
        renderMemoryBlocks(inputVal);
    });

    // Run Test (Backend API Call)
    btnRunTest.addEventListener('click', async () => {
        const inputVal = bufferInput.value;
        try {
            const response = await fetch('/api/check-buffer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: inputVal })
            });
            const data = await response.json();
            
            // Re-render UI based on backend response as well (though it should match frontend)
            updateStatusUI(data.overflow, data.inputLength);
            renderMemoryBlocks(inputVal);
            
            // Only alert if we somehow bypassed the typing alert
            if (data.overflow && !hasAlertedForOverflow) {
                alert(
                    "⚠️ SEGMENTATION FAULT\n\n" +
                    "BUFFER OVERFLOW DETECTED\n\n" +
                    "Buffer Size: 8 bytes\n" +
                    "Input Length: " + data.inputLength + " characters\n\n" +
                    "Memory boundary exceeded."
                );
                hasAlertedForOverflow = true;
            }
        } catch (error) {
            console.error("Error calling backend:", error);
            alert("Backend unreachable or error occurred.");
        }
    });
});

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function doLogout() {
    document.getElementById('login-form').reset();
    document.getElementById('navbar').classList.add('hidden');
    showView('login-page');
    
    // Reset state
    document.getElementById('buffer-input').value = "";
    updateStatusUI(false, 0);
    renderMemoryBlocks("");
    hasAlertedForOverflow = false;
}

function updateStatusUI(isOverflow, length) {
    const statusPanel = document.getElementById('status-panel');
    const statusText = document.getElementById('status-text');
    const faultDetails = document.getElementById('fault-details');
    const outLength = document.getElementById('out-length');
    const outExcess = document.getElementById('out-excess');
    const lblOverflow = document.getElementById('label-overflow');
    
    if (isOverflow) {
        statusPanel.classList.remove('safe');
        statusPanel.classList.add('fault');
        statusText.innerText = '⚠️ SEGMENTATION FAULT\nBUFFER OVERFLOW DETECTED';
        statusText.style.whiteSpace = 'pre-line';
        faultDetails.classList.remove('hidden');
        outLength.innerText = length;
        document.getElementById('out-length-label').innerText = length === 1 ? 'character' : 'characters';
        const excess = length - BUFFER_SIZE;
        outExcess.innerText = excess;
        document.getElementById('out-excess-label').innerText = excess === 1 ? 'character' : 'characters';
        lblOverflow.classList.remove('hidden');
    } else {
        statusPanel.classList.remove('fault');
        statusPanel.classList.add('safe');
        statusText.innerText = 'Buffer Status: SAFE';
        statusText.style.whiteSpace = 'normal';
        faultDetails.classList.add('hidden');
        lblOverflow.classList.add('hidden');
    }
}

function renderMemoryBlocks(input) {
    const blocksContainer = document.getElementById('memory-blocks');
    blocksContainer.innerHTML = ''; // clear
    
    let renderArray = Array.from(input);
    
    // Always render at least 8 blocks for the safe area
    for (let i = 0; i < Math.max(BUFFER_SIZE, renderArray.length); i++) {
        
        if (i === BUFFER_SIZE && renderArray.length > BUFFER_SIZE) {
            // Insert boundary marker
            const marker = document.createElement('div');
            marker.className = 'boundary-marker';
            marker.innerHTML = 'BUFFER LIMIT<br>↓';
            blocksContainer.appendChild(marker);
        }

        const char = renderArray[i] || ''; // empty string if nothing typed yet
        const block = document.createElement('div');
        block.className = 'mem-cell';
        block.innerText = char ? `[ ${char} ]` : '[  ]';
        
        if (i >= BUFFER_SIZE) {
            block.classList.add('overflow');
        }
        
        blocksContainer.appendChild(block);
    }
}
