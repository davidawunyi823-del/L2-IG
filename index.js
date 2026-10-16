document.addEventListener('DOMContentLoaded', () => {
    const formConnexion = document.getElementById('form-connexion');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    formConnexion.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        let role = '';
        let redirectPage = '';

        // Vérification des identifiants et des mots de passe
        if (username === 'admin' && password === 'admin2') {
            role = 'admin';
            redirectPage = 'etudiants.html'; 
        } else if (username === 'etudiant' && password === '1234') {
            role = 'etudiant';
            redirectPage = 'etudiants.html'; 
        } else {
            // Alerte si le nom d'utilisateur ou le mot de passe est faux
            alert("Nom d'utilisateur ou mot de passe incorrect !");
            return; // Bloque la suite et évite la connexion
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
            window.location.href = redirectPage;
        }, 800);
    });
});