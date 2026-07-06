document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const userIn = document.getElementById('username');
    const passIn = document.getElementById('password');
    const toggle = document.querySelector('.password-toggle');

    if (!form || !userIn || !passIn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const stored = JSON.parse(localStorage.getItem('almares328_credentials')) ||
                       { username: 'Almares 328', password: 'WholeSaleGroceryStore' };

        if (userIn.value.trim() === stored.username && passIn.value === stored.password) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Incorrect username or password.');
        }
    });

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isPass = passIn.type === 'password';
            passIn.type = isPass ? 'text' : 'password';
            toggle.querySelector('i').className = isPass ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
        });
    }
});