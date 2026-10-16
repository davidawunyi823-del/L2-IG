document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des informations de l'utilisateur connecté
    const userDataJSON = localStorage.getItem('currentUser');
    const userRoleLabel = document.getElementById('user-role-label');
    const sidebarSubtitle = document.getElementById('sidebar-role-subtitle');
    const formPaiementSection = document.getElementById('form-paiement-section');
    const thActions = document.getElementById('th-actions');

    let currentUser = { username: 'Invité', role: 'etudiant' };
    if (userDataJSON) {
        try {
            currentUser = JSON.parse(userDataJSON);
        } catch (e) {
            console.error("Erreur localStorage", e);
        }
    }

    // Affichage dynamique du rôle
    if (userRoleLabel) userRoleLabel.textContent = currentUser.username;

    // 2. Reconnaissance de rôle : Admin vs Étudiant
    const isAdmin = (currentUser.role === 'admin');

    if (isAdmin) {
        if (sidebarSubtitle) sidebarSubtitle.textContent = "Espace Administrateur";
        if (formPaiementSection) formPaiementSection.style.display = "block";
    } else {
        if (sidebarSubtitle) sidebarSubtitle.textContent = "Espace Étudiant";
        if (formPaiementSection) formPaiementSection.style.display = "none"; // L'étudiant ne peut pas enregistrer de paiement
        if (thActions) thActions.style.display = "none";
    }

    // 3. Remplissage dynamique des listes déroulantes (Étudiants et Contributions)
    const etudiantSelect = document.getElementById('etudiant-select');
    const contributionSelect = document.getElementById('contribution-select');

    // Récupération des étudiants depuis le localStorage (ou liste par défaut)
    const listeEtudiants = JSON.parse(localStorage.getItem('listeEtudiants')) || [
        { matricule: "L2IG001", nom: "Mukendi", prenom: "Christian" },
        { matricule: "L2IG002", nom: "Kankinda", prenom: "Sarah" }
    ];

    if (etudiantSelect) {
        listeEtudiants.forEach(etudiant => {
            const option = document.createElement('option');
            option.value = `${etudiant.nom} ${etudiant.prenom} (${etudiant.matricule})`;
            option.textContent = `${etudiant.nom} ${etudiant.prenom} - ${etudiant.matricule}`;
            etudiantSelect.appendChild(option);
        });
    }

    // Récupération des contributions depuis le localStorage (ou liste par défaut)
    const listeContributions = JSON.parse(localStorage.getItem('listeContributions')) || [
        { motif: "Cotisation Bancale", montant: "15000 FC" },
        { motif: "Frais Connexion Salle", montant: "10000 FC" }
    ];

    if (contributionSelect) {
        listeContributions.forEach(contrib => {
            const option = document.createElement('option');
            option.value = contrib.motif;
            option.textContent = `${contrib.motif} (${contrib.montant})`;
            contributionSelect.appendChild(option);
        });
    }

    // 4. Gestion de l'historique des paiements (Stockage local)
    const formPaiement = document.getElementById('form-paiement');
    const listePaiementsBody = document.getElementById('liste-paiements');
    const editIndexInput = document.getElementById('edit-index');
    const btnAnnuler = document.getElementById('btn-annuler');
    const btnSubmit = document.getElementById('btn-submit');
    const formTitle = document.getElementById('form-title');

    let paiements = JSON.parse(localStorage.getItem('listePaiements')) || [
        { matricule: "L2IG001", etudiant: "Mukendi Christian", motif: "Cotisation Bancale", montant: "15000 FC", date: "2026-06-01" },
        { matricule: "L2IG002", etudiant: "Kankinda Sarah", motif: "Frais Connexion Salle", montant: "10000 FC", date: "2026-06-02" }
    ];

    function sauvegarderPaiements() {
        localStorage.setItem('listePaiements', JSON.stringify(paiements));
    }

    function afficherPaiements() {
        if (!listePaiementsBody) return;
        listePaiementsBody.innerHTML = "";

        paiements.forEach((paiement, index) => {
            const tr = document.createElement('tr');
            
            let actionsHTML = '';
            if (isAdmin) {
                actionsHTML = `
                    <td>
                        <button class="btn-edit" onclick="editerPaiement(${index})">Modifier</button>
                        <button class="btn-delete" onclick="supprimerPaiement(${index})">Supprimer</button>
                    </td>
                `;
            }

            tr.innerHTML = `
                <td><strong>${paiement.matricule}</strong></td>
                <td>${paiement.etudiant}</td>
                <td>${paiement.motif}</td>
                <td><strong>${paiement.montant}</strong></td>
                <td>${paiement.date}</td>
                ${isAdmin ? actionsHTML : ''}
            `;
            listePaiementsBody.appendChild(tr);
        });
    }

    // Soumission du formulaire (Ajout ou Modification)
    if (formPaiement && isAdmin) {
        formPaiement.addEventListener('submit', (e) => {
            e.preventDefault();

            const etudiantComplet = etudiantSelect.value;
            const motif = contributionSelect.value;
            const montantBrut = document.getElementById('montant').value.trim();
            const montant = montantBrut + " FC";
            const date = document.getElementById('date-paiement').value;
            const editIndex = parseInt(editIndexInput.value);

            // Extraction du matricule et du nom depuis la valeur sélectionnée
            const matchMatricule = etudiantComplet.match(/\(([^)]+)\)/);
            const matricule = matchMatricule ? matchMatricule[1] : "N/A";
            const etudiantNom = etudiantComplet.replace(/\s*\([^)]*\)/, '');

            if (editIndex === -1) {
                // Ajout
                paiements.push({ matricule, etudiant: etudiantNom, motif, montant, date });
            } else {
                // Modification
                paiements[editIndex] = { matricule, etudiant: etudiantNom, motif, montant, date };
                editIndexInput.value = -1;
                formTitle.textContent = "Enregistrer un nouveau paiement";
                btnSubmit.textContent = "Valider le paiement";
                btnAnnuler.style.display = "none";
            }

            sauvegarderPaiements();
            afficherPaiements();
            formPaiement.reset();
        });
    }

    // Annuler la modification
    if (btnAnnuler) {
        btnAnnuler.addEventListener('click', () => {
            formPaiement.reset();
            editIndexInput.value = -1;
            formTitle.textContent = "Enregistrer un nouveau paiement";
            btnSubmit.textContent = "Valider le paiement";
            btnAnnuler.style.display = "none";
        });
    }

    // Fonctions globales d'édition et de suppression
    window.editerPaiement = function(index) {
        const paiement = paiements[index];
        // Recherche et sélection de l'étudiant dans le select
        for (let opt of etudiantSelect.options) {
            if (opt.value.includes(paiement.matricule)) {
                etudiantSelect.value = opt.value;
                break;
            }
        }
        contributionSelect.value = paiement.motif;
        document.getElementById('montant').value = parseInt(paiement.montant);
        document.getElementById('date-paiement').value = paiement.date;

        editIndexInput.value = index;
        formTitle.textContent = "Modifier le paiement";
        btnSubmit.textContent = "Mettre à jour";
        btnAnnuler.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.supprimerPaiement = function(index) {
        if (confirm("Voulez-vous vraiment supprimer ce paiement ?")) {
            paiements.splice(index, 1);
            sauvegarderPaiements();
            afficherPaiements();
        }
    };

    // Gestion de la déconnexion
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
        });
    }

    // Affichage initial de la table
    afficherPaiements();
});