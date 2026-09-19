// login.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('bl_user')) {
        window.location.href = 'test.html';
        return;
    }

    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value;

        errorMsg.style.display = 'none';

        if ((user === 'student' && pass === 'student123') || (user === 'admin' && pass === 'admin123')) {
            localStorage.setItem('bl_user', JSON.stringify({ username: user }));
            window.location.href = 'test.html';
        } else {
            errorMsg.style.display = 'block';
        }
    });
});
