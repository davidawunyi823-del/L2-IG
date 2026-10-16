document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des informations de l'utilisateur connecté
    const userDataJSON = localStorage.getItem('currentUser');
    const userRoleLabel = document.getElementById('user-role-label');
    const sidebarSubtitle = document.getElementById('sidebar-role-subtitle');
    const adminFormSection = document.getElementById('admin-form-section');
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
        if (adminFormSection) adminFormSection.style.display = "block"; // Affiche le formulaire
    } else {
        if (sidebarSubtitle) sidebarSubtitle.textContent = "Espace Étudiant";
        if (adminFormSection) adminFormSection.style.display = "none"; // Cache le formulaire
        if (thActions) thActions.style.display = "none"; // Cache la colonne Actions
    }

    // 3. Gestion de la liste des contributions (Stockage local en FC)
    const formContribution = document.getElementById('form-contribution');
    const listeContributionsBody = document.getElementById('liste-contributions');
    const editIndexInput = document.getElementById('edit-index');
    const btnAnnuler = document.getElementById('btn-annuler');
    const btnSubmit = document.getElementById('btn-submit');
    const formTitle = document.getElementById('form-title');

    // Données par défaut si le localStorage est vide
    let contributions = JSON.parse(localStorage.getItem('listeContributions')) || [
        { motif: "Cotisation Bancale", montant: "15 000 FC", date: "2026-06-30", type: "Obligatoire" },
        { motif: "Frais Connexion Salle", montant: "10 000 FC", date: "2026-07-15", type: "Volontaire" }
    ];

    function sauvegarderContributions() {
        localStorage.setItem('listeContributions', JSON.stringify(contributions));
    }

    function afficherContributions() {
        if (!listeContributionsBody) return;
        listeContributionsBody.innerHTML = "";

        contributions.forEach((contrib, index) => {
            const tr = document.createElement('tr');
            
            let actionsHTML = '';
            if (isAdmin) {
                actionsHTML = `
                    <td>
                        <button class="btn-edit" onclick="editerContribution(${index})">Modifier</button>
                        <button class="btn-delete" onclick="supprimerContribution(${index})">Supprimer</button>
                    </td>
                `;
            }

            const badgeClass = contrib.type === 'Obligatoire' ? 'badge-obligatoire' : 'badge-volontaire';

            tr.innerHTML = `
                <td><strong>${contrib.motif}</strong></td>
                <td><strong style="color: #22c55e;">${contrib.montant}</strong></td>
                <td>${contrib.date}</td>
                <td><span class="badge-type ${badgeClass}">${contrib.type}</span></td>
                ${isAdmin ? actionsHTML : ''}
            `;
            listeContributionsBody.appendChild(tr);
        });
    }

    // Soumission du formulaire (Ajout ou Modification)
    if (formContribution && isAdmin) {
        formContribution.addEventListener('submit', (e) => {
            e.preventDefault();

            const motif = document.getElementById('motif').value.trim();
            const montantBrut = document.getElementById('montant').value.trim();
            const montant = Number(montantBrut).toLocaleString('fr-FR') + " FC";
            const date = document.getElementById('date').value;
            const type = document.getElementById('type').value;
            const editIndex = parseInt(editIndexInput.value);

            if (editIndex === -1) {
                // Ajout
                contributions.push({ motif, montant, date, type });
            } else {
                // Modification
                contributions[editIndex] = { motif, montant, date, type };
                editIndexInput.value = -1;
                formTitle.textContent = "Ajouter une nouvelle contribution";
                btnSubmit.textContent = "Enregistrer la contribution";
                btnAnnuler.style.display = "none";
            }

            sauvegarderContributions();
            afficherContributions();
            formContribution.reset();
        });
    }

    // Annuler la modification
    if (btnAnnuler) {
        btnAnnuler.addEventListener('click', () => {
            formContribution.reset();
            editIndexInput.value = -1;
            formTitle.textContent = "Ajouter une nouvelle contribution";
            btnSubmit.textContent = "Enregistrer la contribution";
            btnAnnuler.style.display = "none";
        });
    }

    // Fonctions globales d'édition et de suppression
    window.editerContribution = function(index) {
        const contrib = contributions[index];
        document.getElementById('motif').value = contrib.motif;
        document.getElementById('montant').value = parseInt(contrib.montant.replace(/\s/g, ''));
        document.getElementById('date').value = contrib.date;
        document.getElementById('type').value = contrib.type;

        editIndexInput.value = index;
        formTitle.textContent = "Modifier la contribution";
        btnSubmit.textContent = "Mettre à jour";
        btnAnnuler.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.supprimerContribution = function(index) {
        if (confirm("Voulez-vous vraiment supprimer cette contribution ?")) {
            contributions.splice(index, 1);
            sauvegarderContributions();
            afficherContributions();
        }
    };

    // Gestion de la déconnexion
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
        });
    }

    // Affichage initial du tableau
    afficherContributions();
});