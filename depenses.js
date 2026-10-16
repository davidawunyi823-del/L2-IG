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

    // Affichage dynamique du nom/rôle
    if (userRoleLabel) userRoleLabel.textContent = currentUser.username;

    // 2. Reconnaissance de rôle : Admin vs Étudiant
    const isAdmin = (currentUser.role === 'admin');

    if (isAdmin) {
        if (sidebarSubtitle) sidebarSubtitle.textContent = "Espace Administrateur";
        if (adminFormSection) adminFormSection.style.display = "block"; // Affiche le formulaire
    } else {
        if (sidebarSubtitle) sidebarSubtitle.textContent = "Espace Étudiant";
        if (adminFormSection) adminFormSection.style.display = "none"; // Cache le formulaire pour l'étudiant
        if (thActions) thActions.style.display = "none"; // Cache la colonne Actions
    }

    // 3. Gestion de l'historique des dépenses (Stockage local)
    const formDepense = document.getElementById('form-depense');
    const listeDepensesBody = document.getElementById('liste-depenses');
    const editIndexInput = document.getElementById('edit-index');
    const btnAnnuler = document.getElementById('btn-annuler');
    const btnSubmit = document.getElementById('btn-submit');
    const formTitle = document.getElementById('form-title');

    // Données par défaut si le localStorage est vide
    let depenses = JSON.parse(localStorage.getItem('listeDepenses')) || [
        { motif: "Achat craies et marqueurs", montant: "15 000 FC", date: "2026-06-03", beneficiaire: "Librairie Centrale" },
        { motif: "Maintenance sonorisation", montant: "25 000 FC", date: "2026-06-05", beneficiaire: "Technicien Son" }
    ];

    function sauvegarderDepenses() {
        localStorage.setItem('listeDepenses', JSON.stringify(depenses));
    }

    function afficherDepenses() {
        if (!listeDepensesBody) return;
        listeDepensesBody.innerHTML = "";

        depenses.forEach((depense, index) => {
            const tr = document.createElement('tr');
            
            let actionsHTML = '';
            if (isAdmin) {
                actionsHTML = `
                    <td>
                        <button class="btn-edit" onclick="editerDepense(${index})">Modifier</button>
                        <button class="btn-delete" onclick="supprimerDepense(${index})">Supprimer</button>
                    </td>
                `;
            }

            tr.innerHTML = `
                <td><strong>${depense.motif}</strong></td>
                <td><strong style="color: #ef4444;">${depense.montant}</strong></td>
                <td>${depense.date}</td>
                <td>${depense.beneficiaire}</td>
                ${isAdmin ? actionsHTML : ''}
            `;
            listeDepensesBody.appendChild(tr);
        });
    }

    // Soumission du formulaire (Ajout ou Modification)
    if (formDepense && isAdmin) {
        formDepense.addEventListener('submit', (e) => {
            e.preventDefault();

            const motif = document.getElementById('motif').value.trim();
            const montantBrut = document.getElementById('montant').value.trim();
            const montant = Number(montantBrut).toLocaleString('fr-FR') + " FC";
            const date = document.getElementById('date').value;
            const beneficiaire = document.getElementById('beneficiaire').value.trim();
            const editIndex = parseInt(editIndexInput.value);

            if (editIndex === -1) {
                // Ajout
                depenses.push({ motif, montant, date, beneficiaire });
            } else {
                // Modification
                depenses[editIndex] = { motif, montant, date, beneficiaire };
                editIndexInput.value = -1;
                formTitle.textContent = "Enregistrer une nouvelle dépense";
                btnSubmit.textContent = "Enregistrer la dépense";
                btnAnnuler.style.display = "none";
            }

            sauvegarderDepenses();
            afficherDepenses();
            formDepense.reset();
        });
    }

    // Annuler la modification
    if (btnAnnuler) {
        btnAnnuler.addEventListener('click', () => {
            formDepense.reset();
            editIndexInput.value = -1;
            formTitle.textContent = "Enregistrer une nouvelle dépense";
            btnSubmit.textContent = "Enregistrer la dépense";
            btnAnnuler.style.display = "none";
        });
    }

    // Fonctions globales d'édition et de suppression
    window.editerDepense = function(index) {
        const depense = depenses[index];
        document.getElementById('motif').value = depense.motif;
        document.getElementById('montant').value = parseInt(depense.montant.replace(/\s/g, ''));
        document.getElementById('date').value = depense.date;
        document.getElementById('beneficiaire').value = depense.beneficiaire;

        editIndexInput.value = index;
        formTitle.textContent = "Modifier la dépense";
        btnSubmit.textContent = "Mettre à jour";
        btnAnnuler.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.supprimerDepense = function(index) {
        if (confirm("Voulez-vous vraiment supprimer cette dépense ?")) {
            depenses.splice(index, 1);
            sauvegarderDepenses();
            afficherDepenses();
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
    afficherDepenses();
});