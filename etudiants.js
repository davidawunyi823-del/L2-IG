document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des infos de l'utilisateur connecté
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
        if (adminFormSection) adminFormSection.style.display = "none"; // Cache le formulaire d'ajout
        if (thActions) thActions.style.display = "none"; // Cache la colonne Actions pour les étudiants
    }

    // 3. Gestion de la liste des étudiants (Stockage local)
    const formEtudiant = document.getElementById('form-etudiant');
    const listeEtudiantsBody = document.getElementById('liste-etudiants');
    const editIndexInput = document.getElementById('edit-index');
    const btnAnnuler = document.getElementById('btn-annuler');
    const btnSubmit = document.getElementById('btn-submit');
    const formTitle = document.getElementById('form-title');

    // Données initiales par défaut si le localStorage est vide
    let etudiants = JSON.parse(localStorage.getItem('listeEtudiants')) || [
        { matricule: "L2IG001", nom: "Mukendi", prenom: "Christian", sexe: "M" },
        { matricule: "L2IG002", nom: "Kankinda", prenom: "Sarah", sexe: "F" },
        { matricule: "L2IG003", nom: "Kasongo", prenom: "David", sexe: "M" }
    ];

    function sauvegarderEtudiants() {
        localStorage.setItem('listeEtudiants', JSON.stringify(etudiants));
    }

    function afficherEtudiants() {
        if (!listeEtudiantsBody) return;
        listeEtudiantsBody.innerHTML = "";

        etudiants.forEach((etudiant, index) => {
            const tr = document.createElement('tr');
            
            let actionsHTML = '';
            if (isAdmin) {
                actionsHTML = `
                    <td>
                        <button class="btn-edit" onclick="editerEtudiant(${index})">Modifier</button>
                        <button class="btn-delete" onclick="supprimerEtudiant(${index})">Supprimer</button>
                    </td>
                `;
            }

            tr.innerHTML = `
                <td><strong>${etudiant.matricule}</strong></td>
                <td>${etudiant.nom} ${etudiant.prenom}</td>
                <td>${etudiant.sexe}</td>
                ${isAdmin ? actionsHTML : ''}
            `;
            listeEtudiantsBody.appendChild(tr);
        });
    }

    // Soumission du formulaire (Ajout ou Modification)
    if (formEtudiant && isAdmin) {
        formEtudiant.addEventListener('submit', (e) => {
            e.preventDefault();

            const matricule = document.getElementById('matricule').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const prenom = document.getElementById('prenom').value.trim();
            const sexe = document.getElementById('sexe').value;
            const editIndex = parseInt(editIndexInput.value);

            if (editIndex === -1) {
                // Ajout
                etudiants.push({ matricule, nom, prenom, sexe });
            } else {
                // Modification
                etudiants[editIndex] = { matricule, nom, prenom, sexe };
                editIndexInput.value = -1;
                formTitle.textContent = "Ajouter un nouvel étudiant";
                btnSubmit.textContent = "Enregistrer l'étudiant";
                btnAnnuler.style.display = "none";
            }

            sauvegarderEtudiants();
            afficherEtudiants();
            formEtudiant.reset();
        });
    }

    // Annuler la modification
    if (btnAnnuler) {
        btnAnnuler.addEventListener('click', () => {
            formEtudiant.reset();
            editIndexInput.value = -1;
            formTitle.textContent = "Ajouter un nouvel étudiant";
            btnSubmit.textContent = "Enregistrer l'étudiant";
            btnAnnuler.style.display = "none";
        });
    }

    // Fonctions globales pour l'édition et la suppression
    window.editerEtudiant = function(index) {
        const etudiant = etudiants[index];
        document.getElementById('matricule').value = etudiant.matricule;
        document.getElementById('nom').value = etudiant.nom;
        document.getElementById('prenom').value = etudiant.prenom;
        document.getElementById('sexe').value = etudiant.sexe;

        editIndexInput.value = index;
        formTitle.textContent = "Modifier l'étudiant";
        btnSubmit.textContent = "Mettre à jour";
        btnAnnuler.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.supprimerEtudiant = function(index) {
        if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
            etudiants.splice(index, 1);
            sauvegarderEtudiants();
            afficherEtudiants();
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
    afficherEtudiants();
});

// Fonctions pour le modal (si besoin)
function fermerModal() {
    const modal = document.getElementById('modal-details');
    if (modal) modal.style.display = "none";
}