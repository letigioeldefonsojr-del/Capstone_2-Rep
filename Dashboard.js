// Dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sidebarContainer');
    const leftPanel  = document.getElementById('leftPanel');
    const logoutBtn  = document.querySelector('.logout');

    // Open drawer on hover
    leftPanel.addEventListener('mouseenter', () => {
        container.classList.add('drawer-open');
    });

    // Close drawer once the cursor leaves the sidebar area
    leftPanel.addEventListener('mouseleave', () => {
        container.classList.remove('drawer-open');
    });

    // Logout: send the user back to the login page
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'Index.html';
        });
    }
});