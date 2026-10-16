document.addEventListener('DOMContentLoaded', () => {
    const formConnexion = document.getElementById('form-connexion');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    formConnexion.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        // Simulation de reconnaissance des rôles
        let role = '';
        let redirectPage = '';

        // Règle de reconnaissance (tu pourras adapter selon tes besoins)
        if (username === 'admin' || username.includes('administrateur')) {
            role = 'admin';
            redirectPage = 'etudiants.html'; // Nom de la page admin à venir
        } else {
            role = 'etudiant';
            redirectPage = 'etudiants.html'; // Nom de la page étudiant à venir
        }

        // Sauvegarde des informations de l'utilisateur connecté dans le localStorage
        const userData = {
            username: usernameInput.value.trim(),
            role: role,
            connectedAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Petit effet visuel avant la redirection
        const btn = document.querySelector('.btn-connexion');
        btn.textContent = "Connexion réussie...";
        btn.style.background = "#10b981";

        // Redirection après une courte pause pour apprécier l'animation
        setTimeout(() => {
            // Pour l'instant, si les fichiers n'existent pas encore, 
            // cela affichera une alerte ou tu pourras créer les pages suivantes.
            window.location.href = redirectPage;
        }, 800);
    });
});