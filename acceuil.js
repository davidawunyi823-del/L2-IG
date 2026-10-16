document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des données de l'utilisateur connecté
    const userDataJSON = localStorage.getItem('currentUser');
    const nomUtilisateurElement = document.getElementById('nom-utilisateur');
    const sidebarSubtitle = document.getElementById('sidebar-role-subtitle');
    
    let currentUser = { username: 'Invité', role: 'etudiant' };

    if (userDataJSON) {
        try {
            currentUser = JSON.parse(userDataJSON);
        } catch (e) {
            console.error("Erreur de lecture du localStorage :", e);
        }
    }

    // Affichage dynamique du nom de l'utilisateur dans l'en-tête
    if (nomUtilisateurElement) {
        nomUtilisateurElement.textContent = currentUser.username;
    }

    // 2. Reconnaissance intelligente du rôle (Admin vs Étudiant)
    if (currentUser.role === 'admin') {
        if (sidebarSubtitle) {
            sidebarSubtitle.textContent = "Espace Administrateur";
        }
    } else {
        if (sidebarSubtitle) {
            sidebarSubtitle.textContent = "Espace Étudiant";
        }
    }

    // 3. Calcul en temps réel des statistiques à partir du localStorage
    
    // A. Total Entrées (Somme des paiements)
    const listePaiements = JSON.parse(localStorage.getItem('listePaiements')) || [];
    let totalEntreesMontant = 0;
    listePaiements.forEach(p => {
        // Nettoyage de la chaîne de caractères (ex: "15 000 FC" -> 15000)
        let montantNumerique = parseInt(String(p.montant).replace(/\s/g, '').replace('FC', '')) || 0;
        totalEntreesMontant += montantNumerique;
    });

    // B. Total Sorties / Dépenses (Somme des dépenses)
    const listeDepenses = JSON.parse(localStorage.getItem('listeDepenses')) || [];
    let totalSortiesMontant = 0;
    listeDepenses.forEach(d => {
        let montantNumerique = parseInt(String(d.montant).replace(/\s/g, '').replace('FC', '')) || 0;
        totalSortiesMontant += montantNumerique;
    });

    // C. Solde en caisse (Entrées - Sorties)
    let soldeCaisseMontant = totalEntreesMontant - totalSortiesMontant;

    // D. Total Étudiants inscrits
    const listeEtudiants = JSON.parse(localStorage.getItem('listeEtudiants')) || [];
    let totalEtudiantsNombre = listeEtudiants.length;

    // 4. Injection des valeurs calculées dans les éléments HTML avec formatage (ex: 15 000 FC)
    const totalEntreesEl = document.getElementById('total-entrees');
    const totalSortiesEl = document.getElementById('total-sorties');
    const soldeCaisseEl = document.getElementById('solde-caisse');
    const totalEtudiantsEl = document.getElementById('total-etudiants');

    if (totalEntreesEl) {
        totalEntreesEl.textContent = totalEntreesMontant.toLocaleString('fr-FR') + " FC";
    }
    if (totalSortiesEl) {
        totalSortiesEl.textContent = totalSortiesMontant.toLocaleString('fr-FR') + " FC";
    }
    if (soldeCaisseEl) {
        soldeCaisseEl.textContent = soldeCaisseMontant.toLocaleString('fr-FR') + " FC";
        // Optionnel : colorer le solde en rouge s'il est négatif
        if (soldeCaisseMontant < 0) {
            soldeCaisseEl.style.color = "#ef4444";
        }
    }
    if (totalEtudiantsEl) {
        totalEtudiantsEl.textContent = totalEtudiantsNombre;
    }

    // 5. Gestion de la déconnexion
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
        });
    }
});