"use strict";
/* ********* INTERFACES ********* */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Liste
let employeesData = []; //Tous les employés affichés
document.addEventListener("DOMContentLoaded", () => {
    const listEmployees = document.querySelector('.list-employees');
    const infoEmployee = document.querySelector('.info-employee');
    const addEmployeeButton = document.getElementById("add-employee-button");
    getEmployeesFromServer();
    refreshEmployeeList();
    /*************** REQUETES SERVEURS ***************/
    //Récupérer les employés
    function getEmployeesFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            try {
                // Effectue une requête GET pour obtenir les données des employés depuis l'API
                const response = yield fetch('/voirTousEmployes');
                // Récupère les données des employés sous forme de JSON à partir de la réponse
                const employeesFromServer = yield response.json();
                // Efface le tableau employeesData existant avant de le remplir avec de nouvelles données
                employeesData.length = 0;
                // Remplit le tableau employeesData avec les données récupérées
                for (const employee of employeesFromServer) {
                    try {
                        // Effectue une requête GET pour obtenir les détails d'un employé spécifique depuis l'API
                        const fullEmployeeInfoResponse = yield fetch(`/voirInfosEmploye/${employee.id}`);
                        // Récupère les détails de l'employé sous forme de JSON à partir de la réponse
                        const employeeDetails = yield fullEmployeeInfoResponse.json();
                        // Extrait les informations de contact de l'employé
                        const tel = (_d = (_c = (_b = (_a = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.personne) === null || _a === void 0 ? void 0 : _a.partenaire) === null || _b === void 0 ? void 0 : _b.contact) === null || _c === void 0 ? void 0 : _c.tel) !== null && _d !== void 0 ? _d : '';
                        const email = (_h = (_g = (_f = (_e = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.personne) === null || _e === void 0 ? void 0 : _e.partenaire) === null || _f === void 0 ? void 0 : _f.contact) === null || _g === void 0 ? void 0 : _g.courriel) !== null && _h !== void 0 ? _h : '';
                        const adresse = (_m = (_l = (_k = (_j = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.personne) === null || _j === void 0 ? void 0 : _j.partenaire) === null || _k === void 0 ? void 0 : _k.contact) === null || _l === void 0 ? void 0 : _l.adresse) !== null && _m !== void 0 ? _m : '';
                        const codePostal = (_r = (_q = (_p = (_o = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.personne) === null || _o === void 0 ? void 0 : _o.partenaire) === null || _p === void 0 ? void 0 : _p.contact) === null || _q === void 0 ? void 0 : _q.codePostal) !== null && _r !== void 0 ? _r : '';
                        const pays = (_v = (_u = (_t = (_s = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.personne) === null || _s === void 0 ? void 0 : _s.partenaire) === null || _t === void 0 ? void 0 : _t.contact) === null || _u === void 0 ? void 0 : _u.pays) !== null && _v !== void 0 ? _v : '';
                        // Appelle la fonction getEmployeeSchedule pour récupérer les données de l'emploi du temps de l'employé
                        const emploiDuTemps = yield getEmployeeSchedule(employee.id);
                        // Ajoute un nouvel objet employé avec les détails récupérés au tableau employeesData
                        employeesData.push({
                            id: employee.id,
                            nom: (_x = (_w = employee.personne) === null || _w === void 0 ? void 0 : _w.nom) !== null && _x !== void 0 ? _x : '',
                            prenom: (_z = (_y = employee.personne) === null || _y === void 0 ? void 0 : _y.prenom) !== null && _z !== void 0 ? _z : '',
                            tel: tel,
                            email: email,
                            adresse: `${adresse}, ${codePostal}, ${pays}`,
                            poste: (_0 = employee.poste) !== null && _0 !== void 0 ? _0 : '',
                            rang: (_1 = employee.rang) !== null && _1 !== void 0 ? _1 : '',
                            permissions: [],
                            emploiDuTemps: emploiDuTemps // Assigne les données de l'emploi du temps récupérées
                        });
                    }
                    catch (error) {
                        // Gère les erreurs lors de la récupération des détails de l'employé
                        console.error(`Erreur lors de la récupération des détails pour l'employé avec l'ID ${employee.id}:`, error);
                    }
                }
                // Rafraîchit la liste des employés après avoir récupéré les données
                refreshEmployeeList();
            }
            catch (error) {
                // Gère les erreurs lors de la récupération des données des employés
                console.error('Erreur lors de la récupération des données des employés :', error);
            }
        });
    }
    //Récupérer les EDT
    function getEmployeeSchedule(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/voirEdt/${employeeId}`);
                const scheduleData = yield response.json();
                // Transforme scheduleData en format accepté par l'application
                const emploiDuTemps = scheduleData.map((item) => {
                    return {
                        employe_id: item.employe_id,
                        periode_id: item.periode_id,
                        intitule: item.intitule,
                        jour: new Date(item.periode.dateDebut).toLocaleDateString(),
                        heureDebut: new Date(item.periode.dateDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        heureFin: new Date(item.periode.dateFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                });
                return emploiDuTemps;
            }
            catch (error) {
                console.error('Error fetching employee schedule:', error);
                return [];
            }
        });
    }
    //Créer un employé
    function addEmployeeInServer(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            let parties = employee.adresse.split(', ');
            try {
                const response = yield fetch('/creerEmploye', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ alias: "", mdp: "", dep: "Planergy", poste: employee.poste, rang: employee.rang, nom: employee.nom, prenom: employee.prenom, id_partenaire: employee.id, courriel: employee.email, tel: employee.tel, adresse: parties[0], codePostal: parties[1], pays: parties[2] })
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la création du client : ' + response.statusText);
                }
                const responseData = yield response.json();
                console.log(responseData.message); // Affiche le message de la réponse
            }
            catch (error) {
                console.error('Une erreur est survenue : ', error);
            }
        });
    }
    //Supprimer un employé
    function removeEmployee(employeeElement, employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/supprimerEmploye/${employee.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    // Retirer l'élément de la liste des employés
                    const index = employeesData.findIndex(emp => emp.id === employee.id);
                    if (index !== -1) {
                        employeesData.splice(index, 1);
                        listEmployees === null || listEmployees === void 0 ? void 0 : listEmployees.removeChild(employeeElement);
                    }
                    console.log('Employee deleted successfully');
                }
                else {
                    console.error('Failed to delete employee:', response.status);
                }
            }
            catch (error) {
                console.error('Error deleting employee:', error);
            }
        });
    }
    //Modifier un employé
    function modifyEmployeeOnServer(employeeId, nouvellesInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parcourir chaque clé (information) dans nouvellesInfos
                for (const infoKey in nouvellesInfos) {
                    if (Object.prototype.hasOwnProperty.call(nouvellesInfos, infoKey)) {
                        const infoValue = nouvellesInfos[infoKey];
                        // Effectuer une requête PUT distincte pour mettre à jour chaque information
                        const response = yield fetch(`/modifierInfosEmploye/${employeeId}/${infoKey}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ value: infoValue })
                        });
                        if (!response.ok) {
                            console.error(`Failed to modify ${infoKey} for employee with ID ${employeeId}:`, response.status);
                            return false; // Si une seule modification échoue, arrêter et renvoyer false
                        }
                    }
                }
                console.log('Employee information modified successfully');
                return true; // Si toutes les modifications sont réussies, renvoyer true
            }
            catch (error) {
                console.error('Error modifying employee information:', error);
                return false;
            }
        });
    }
    //Modifier l'EDT
    function modifyEmployeeScheduleOnServer(employeeId, idPeriode, nouvellesValeurs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/modifierEdt', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idPeriode: idPeriode,
                        nouvellesValeurs: nouvellesValeurs
                    })
                });
                if (response.ok) {
                    const responseData = yield response.json();
                    console.log(responseData.message);
                    return true;
                }
                else {
                    console.error('Failed to modify employee schedule:', response.status);
                    return false;
                }
            }
            catch (error) {
                console.error('Error modifying employee schedule:', error);
                return false;
            }
        });
    }
    /*************** AFFICHAGES SUR LA PARTIE "list-employees" ***************/
    // Fonction pour supprimer et réafficher la liste des employés
    function refreshEmployeeList() {
        const listEmployees = document.getElementById('list-employees');
        if (!listEmployees)
            return;
        // Efface tout le contenu de list-employees
        listEmployees.innerHTML = '';
        // Réaffiche toute la liste
        employeesData.forEach(employee => {
            const employeeElement = createEmployeeElement(employee);
            listEmployees.appendChild(employeeElement);
        });
    }
    // Fonction pour créer un élément d'employé
    function createEmployeeElement(employee) {
        const employeeDiv = document.createElement('div');
        employeeDiv.classList.add('employee');
        // Informations de l'employé (à gauche)
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('employee-info');
        employeeDiv.appendChild(infoDiv);
        const img = document.createElement('img');
        img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000000\' stroke-width=\'1.25\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3\'/%3E%3Ccircle cx=\'12\' cy=\'10\' r=\'3\'/%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'/%3E%3C/svg%3E');
        img.setAttribute('alt', 'Employee Image');
        infoDiv.appendChild(img);
        const span = document.createElement('span');
        span.textContent = employee.nom + " " + employee.prenom + " " + employee.email + " " + employee.poste;
        infoDiv.appendChild(span);
        // Boutons (à droite)
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('employee-buttons');
        employeeDiv.appendChild(buttonsDiv);
        const voirButton = document.createElement('button');
        voirButton.textContent = "Voir l'EDT";
        voirButton.classList.add('employee-button');
        voirButton.addEventListener('click', () => {
            showEDTEmployee(employee);
        });
        buttonsDiv.appendChild(voirButton);
        const modifierButton = document.createElement('button');
        modifierButton.textContent = "Modifier l'employé";
        modifierButton.addEventListener('click', () => {
            showEmployeeInfo(employee);
        });
        modifierButton.classList.add('employee-button');
        buttonsDiv.appendChild(modifierButton);
        const supprimerButton = document.createElement('button');
        supprimerButton.textContent = "Supprimer l'employé";
        supprimerButton.addEventListener('click', () => {
            removeEmployee(employeeDiv, employee);
        });
        supprimerButton.classList.add('employee-button');
        buttonsDiv.appendChild(supprimerButton);
        return employeeDiv;
    }
    /*************** AFFICHAGES SUR LA PARTIE "info-employee" ***************/
    //Affiche la partie modification de l'employé
    function showEmployeeInfo(employee) {
        const employeeInfoHTML = `
            <h2>Modification Informations de l'employé : <span id="employee_id">${employee.id}</span>
                <button id="edt-permissions-button">Modifier l'EDT / Permissions</button>
            </h2>
            <form action="#" method="POST">
                <fieldset>
                    <legend>INFORMATIONS</legend>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="nom">Nom :</label>
                            <input type="text" id="nom" name="nom" value="${employee.nom}" required>
                        </div>
                        <div class="input-container">
                            <label for="prenom">Prénom :</label>
                            <input type="text" id="prenom" name="prenom" value="${employee.prenom}" required>
                        </div>
                    </div>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="tel">Numéro de téléphone :</label>
                            <input type="tel" id="tel" name="tel" value="${employee.tel}">
                        </div>
                        <div class="input-container">
                            <label for="email">Adresse email :</label>
                            <input type="email" id="email" name="email" value="${employee.email}">
                        </div>
                    </div>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="adresse">Adresse :</label>
                            <textarea id="adresse" name="adresse" rows="4">${employee.adresse}</textarea>
                        </div>
                    </div>
                    <br><br>
                </fieldset>
                <fieldset>
                    <legend>POSTE</legend>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="poste">Poste :</label>
                            <input type="text" id="poste" name="poste" value="${employee.poste}"><br><br>
                        </div>
                        <div class="input-container">
                            <label for="rang">Rang :</label>
                            <input type="text" id="rang" name="rang" value="${employee.rang}"><br><br>
                        </div>
                    </div>
                </fieldset>
                <input id="modif-submit-button" type="submit" value="Confirmer les modifications">
            </form>
        `;
        if (infoEmployee) {
            infoEmployee.innerHTML = employeeInfoHTML;
        }
        const edtPermissionsButton = document.getElementById('edt-permissions-button');
        if (edtPermissionsButton) {
            edtPermissionsButton.addEventListener('click', () => {
                showEDTPermissionsForm(employee);
            });
        }
        const modifSubmitButton = document.querySelector('form');
        if (modifSubmitButton) {
            modifSubmitButton.addEventListener("submit", (event) => {
                handleModifyEmployeeFormSubmit(event);
            });
        }
    }
    //Affiche la partie modification des permissions et de l'EDT de l'employé
    function showEDTPermissionsForm(employee) {
        const edtPermissionsFormHTML = `
            <h2>Modification des permissions ou de l'EDT de l'employé : <span id="employee_id">${employee.id}</span>
                <button id="modif-info-button">Modifier les informations</button>
            </h2>
                <form>
                    <fieldset>
                        <legend>PERMISSIONS</legend>
                        <div class="line-input">
                            <div class="input-container">
                                <label for="selected-perms">Permissions sélectionnées :</label>
                                <ul id="selected-perms"></ul>
                            </div>
                        </div>
                        <div class="line-input">
                            <div class="input-container">
                                <div class="perm-selector-container">
                                    <label for="perm">Permissions :</label>
                                    <select id="perm" name="perm">
                                        <option value="perm1">Perm 1</option>
                                        <option value="perm2">Perm 2</option>
                                        <option value="perm3">Perm 3</option>
                                    </select>
                                    <button type="button" id="add-perm-button">Ajouter</button>
                                    <button type="button" id="remove-perm-button">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>EDT</legend>
                        <div class="line-input">
                            <div class="input-container">
                                    <label for="activity">Label de l'activité :</label>
                                    <input type="text" id="activity" name="activity" required placeholder="Activité">
                            </div>
                            <div class="input-container">
                                <label for="date">Date :</label>
                                <input type="text" id="date" name="date" required placeholder="JJ/MM/AAAA">
                            </div>
                        </div>
                        <div class="line-input">
                            <div class="input-container">
                                <label for="starthour">Heure de début :</label>
                                <input type="text" id="starthour" name="starthour" required placeholder="hh:mm">
                            </div>
                            <div class="input-container">
                                <label for="endhour">Heure de fin :</label>
                                <input type="text" id="endhour" name="endhour" required placeholder="hh:mm">
                            </div>
                        </div>
                        <div class="line-input">
                            <div class="input-container">
                                <button type="button" id="add-activity-button">Ajouter</button>
                            </div>
                            <div class="input-container">
                                <button type="button" id="remove-activity-button">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            `;
        if (infoEmployee) {
            infoEmployee.innerHTML = edtPermissionsFormHTML;
        }
        const selectedPermissionsList = document.getElementById("selected-perms");
        if (selectedPermissionsList) {
            updateSelectedPermissionsList(selectedPermissionsList, employee.permissions);
        }
        // Ajouter les gestionnaires d'événements pour les boutons dans le formulaire
        const modifInfoButton = document.getElementById('modif-info-button');
        const addPermButton = document.getElementById('add-perm-button');
        const removePermButton = document.getElementById('remove-perm-button');
        const removeActivityButton = document.getElementById('remove-activity-button');
        if (addPermButton && removePermButton && removeActivityButton) {
            addPermButton.addEventListener('click', () => { handleAddPermissionClick(employee.permissions); });
            removePermButton.addEventListener('click', () => { handleRemovePermissionClick(employee.permissions); });
        }
        if (modifInfoButton) {
            modifInfoButton.addEventListener('click', () => {
                showEmployeeInfo(employee);
            });
        }
        const addActivityButton = document.getElementById('add-activity-button');
        if (addActivityButton) {
            addActivityButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const activityInput = document.getElementById('activity');
                const dateInput = document.getElementById('date');
                const startHourInput = document.getElementById('starthour');
                const endHourInput = document.getElementById('endhour');
                if (activityInput && dateInput && startHourInput && endHourInput) {
                    const activity = activityInput.value;
                    const date = dateInput.value;
                    const startHour = startHourInput.value;
                    const endHour = endHourInput.value;
                    // Créer un nouvel objet PeriodeEDT avec les nouvelles valeurs
                    const newPeriode = {
                        periode_id: -1, // ID temporaire, sera remplacé par le serveur
                        employe_id: employee.id,
                        intitule: activity,
                        jour: date,
                        heureDebut: startHour,
                        heureFin: endHour
                    };
                    // Appeler la fonction pour modifier la période de l'EDT
                    yield handleModifyPeriodButtonClick(employee.id, -1, newPeriode);
                }
            }));
        }
    }
    //Affiche l'EDT de l'employé
    function showEDTEmployee(employee) {
        // Mettre à jour le contenu de l'élément info-employee avec les informations de l'employé
        if (infoEmployee) {
            infoEmployee.innerHTML = `
                <div class="employee-info">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E" alt="Employee Image">
                    <h2>${employee.nom} ${employee.prenom}</h2>
                    <div class="white-square">
                        <!-- EDT periods will be displayed here -->
                    </div>
                    <p>Semaine du :</p>
                    <input type="text" id="week-input" placeholder="jj/mm/aaaa">
                </div>
            `;
            const whiteSquare = document.querySelector('.white-square');
            const weekInput = document.getElementById('week-input');
            if (whiteSquare) {
                displayScheduleDetails(employee, whiteSquare);
            }
        }
    }
    /*************** PERMISSIONS ***************/
    let selectedPermissions = [];
    // Fonction pour mettre à jour la liste des permissions sélectionnées
    function updateSelectedPermissionsList(selectedPermissionsList, permissions) {
        // Effacer la liste actuelle
        selectedPermissionsList.innerHTML = "";
        // Parcourir le tableau des permissions sélectionnées et les ajouter à la liste
        permissions.forEach((permission) => {
            const listItem = document.createElement("li");
            listItem.textContent = permission;
            selectedPermissionsList.appendChild(listItem);
        });
    }
    // Fonction pour gérer le clic sur le bouton "Ajouter" dans le formulaire de permissions
    function handleAddPermissionClick(permissions) {
        const permissionSelect = document.getElementById("perm");
        const selectedPermissionsList = document.getElementById("selected-perms");
        // Récupérer la permission sélectionnée
        const selectedPermission = permissionSelect.options[permissionSelect.selectedIndex].value;
        // Vérifier si la permission n'a pas déjà été sélectionnée
        if (!selectedPermissions.includes(selectedPermission)) {
            // Ajouter la permission à la liste des permissions sélectionnées
            permissions.push(selectedPermission);
            // Mettre à jour l'affichage de la liste des permissions sélectionnées
            if (selectedPermissionsList) {
                updateSelectedPermissionsList(selectedPermissionsList, permissions);
            }
        }
    }
    // Fonction pour gérer le clic sur le bouton "Supprimer" dans le formulaire de permissions
    function handleRemovePermissionClick(permissions) {
        const permissionSelect = document.getElementById("perm");
        const selectedPermissionsList = document.getElementById("selected-perms");
        // Récupérer la permission sélectionnée
        const selectedPermission = permissionSelect.options[permissionSelect.selectedIndex].value;
        const index = permissions.indexOf(selectedPermission);
        // Vérifier si la permission n'a pas déjà été sélectionnée pour cet employé
        if (index !== -1) {
            // Ajouter la permission à la liste des permissions de l'employé
            permissions.splice(index, 1);
            // Mettre à jour l'affichage de la liste des permissions sélectionnées
            if (selectedPermissionsList) {
                updateSelectedPermissionsList(selectedPermissionsList, permissions);
            }
        }
    }
    /*************** EDT ***************/
    //Récupère les infos sur la période et l'ajoute à la BD
    function handleModifyPeriodButtonClick(employeeId, idPeriode, nouvellesValeurs) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield modifyEmployeeScheduleOnServer(employeeId, idPeriode, nouvellesValeurs);
            if (success) {
                // Ajouter la nouvelle période à l'emploi du temps local de l'employé
                const employee = employeesData.find(emp => emp.id === employeeId);
                if (employee) {
                    const newPeriode = {
                        periode_id: idPeriode, // L'ID de la période modifiée
                        employe_id: employeeId,
                        intitule: nouvellesValeurs.intitule,
                        jour: nouvellesValeurs.jour,
                        heureDebut: nouvellesValeurs.heureDebut,
                        heureFin: nouvellesValeurs.heureFin
                    };
                    employee.emploiDuTemps.push(newPeriode);
                }
                // Rafraîchir la liste des employés
                refreshEmployeeList();
            }
        });
    }
    //Affichage d'une période
    function displayScheduleDetails(employee, container) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear any existing content
            container.innerHTML = '';
            // Loop through each period in employee's schedule and display details
            for (const periode of employee.emploiDuTemps) {
                const periodeDetails = document.createElement('div');
                periodeDetails.classList.add('periode-details');
                periodeDetails.innerHTML = `
                <p>Intitulé: ${periode.intitule}</p>
                <p>Date: ${periode.jour}</p>
                <p>Début: ${periode.heureDebut}</p>
                <p>Fin: ${periode.heureFin}</p>
            `;
                container.appendChild(periodeDetails);
            }
        });
    }
    // Fonction pour gérer la soumission du formulaire de modification d'employé
    function handleModifyEmployeeFormSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            event.preventDefault();
            const form = event.target;
            const employeeId = parseInt(((_a = document.getElementById("employee_id")) === null || _a === void 0 ? void 0 : _a.textContent) || "");
            const nom = form.elements.namedItem("nom").value;
            const prenom = form.elements.namedItem("prenom").value;
            const tel = form.elements.namedItem("tel").value;
            const email = form.elements.namedItem("email").value;
            const adresse = form.elements.namedItem("adresse").value;
            const poste = form.elements.namedItem("poste").value;
            const rang = form.elements.namedItem("rang").value;
            // Diviser l'adresse en utilisant les virgules comme séparateurs
            const adresseParts = adresse.split(',');
            // Extraire le code postal et le pays des parties de l'adresse
            const codePostal = (_c = (_b = adresseParts[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
            const pays = (_e = (_d = adresseParts[2]) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : '';
            const nouvellesInfos = {
                personne: {
                    nom: nom,
                    prenom: prenom,
                    partenaire: {
                        contact: {
                            tel: tel,
                            courriel: email,
                            adresse: (_g = (_f = adresseParts[0]) === null || _f === void 0 ? void 0 : _f.trim()) !== null && _g !== void 0 ? _g : '', // La première partie est l'adresse principale
                            codePostal: codePostal,
                            pays: pays
                        }
                    }
                },
                poste: poste,
                rang: rang
            };
            // Appel de la fonction pour modifier l'employé sur le serveur
            const success = yield modifyEmployeeOnServer(employeeId, nouvellesInfos);
            const updatedEmployee = employeesData.find(employee => employee.id === employeeId);
            if (updatedEmployee) {
                // Mettre à jour les propriétés nom, poste et rang
                updatedEmployee.nom = nom;
                updatedEmployee.prenom = prenom;
                updatedEmployee.tel = tel;
                updatedEmployee.email = email;
                updatedEmployee.adresse = adresse;
                updatedEmployee.poste = poste;
                updatedEmployee.rang = rang;
            }
            refreshEmployeeList();
            //POUR L'INSTANT CA MARCHE PAS DU COUP J'AI SORTIS LES MODIFS VISUELLES DE LA CONDITION
            if (success) {
                // Mettre à jour les données locales de l'employé modifié
                /*
                const updatedEmployee = employeesData.find(employee => employee.id === employeeId);
                if (updatedEmployee) {
                    // Mettre à jour les propriétés nom, poste et rang
                    updatedEmployee.nom = nom;
                    updatedEmployee.prenom = prenom;
                    updatedEmployee.tel = tel;
                    updatedEmployee.email = email;
                    updatedEmployee.adresse = adresse;
                    updatedEmployee.poste = poste;
                    updatedEmployee.rang = rang;
                }*/
                // Rafraîchir la liste des employés
                refreshEmployeeList();
            }
            else {
                // Gérer l'échec de la modification de l'employé
            }
        });
    }
    /*************** AJOUT D'UN NOUVEL EMPLOYE ***************/
    if (addEmployeeButton) {
        addEmployeeButton.addEventListener("click", handleAddEmployeeClick);
    }
    //Affiche le form pour y entrer les informations du nouvel employé
    function handleAddEmployeeClick(event) {
        event.preventDefault();
        // Construction du formulaire à afficher dans la section info-employee
        const formHTML = `
            <form action="#" method="POST">
                <h2>Ajouter un employé : 
                    <input type="submit" value="Confirmer l'ajout">
                </h2>
                <fieldset>
                    <legend>INFORMATIONS</legend>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="nom">Nom :</label>
                            <input type="text" id="nom" name="nom" required>
                        </div>
                    
                        <div class="input-container">
                            <label for="prenom">Prénom :</label>
                            <input type="text" id="prenom" name="prenom" required>
                        </div>
                    </div>
                    
                    <div class="line-input">
                        <div class="input-container">
                            <label for="tel">Numéro de téléphone :</label>
                            <input type="tel" id="tel" name="tel">
                        </div>
                    
                        <div class="input-container">
                            <label for="email">Adresse email :</label>
                            <input type="email" id="email" name="email">
                        </div>
                    </div>
                    
                    <div class="line-input">
                        <div class="input-container">
                            <label for="adresse">Adresse :</label>
                            <textarea id="adresse" name="adresse" rows="4"></textarea>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>POSTE</legend>
                    <div class="line-input">
                        <div class="input-container">
                            <label for="poste">Poste :</label>
                            <input type="text" id="poste" name="poste">
                        </div>
                    
                        <div class="input-container">
                            <label for="rang">Rang :</label>
                            <input type="text" id="rang" name="rang">
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>PERMISSIONS</legend>
                                        
                    <div class="line-input">
                        <div class="input-container">
                            <label for="selected-perms">Permissions sélectionnées :</label>
                            <ul id="selected-perms"></ul>
                        </div>
                    </div>
                    <div class="line-input">
                        <div class="input-container">
                            <div class="perms-selector-container">
                                <label for="perm">Permission :</label>
                                <select id="perm" name="perm">
                                    <option value="perm1">Perm 1</option>
                                    <option value="perm2">Perm 2</option>
                                    <option value="perm3">Perm 3</option>
                                </select>
                                <button type="button" id="add-role-button">Ajouter</button>
                                <button type="button" id="remove-role-button">Supprimer</button>
                            </div>
                        </div>
                    </div>
                    
                    <br><br>
                </fieldset>
            </form>
        `;
        // Affichage du formulaire dans la section info-employee
        if (infoEmployee) {
            infoEmployee.innerHTML = formHTML;
        }
        const permissionsList = [];
        const addRoleButton = document.getElementById("add-role-button");
        const removeRoleButton = document.getElementById("remove-role-button");
        if (addRoleButton && removeRoleButton) {
            addRoleButton.addEventListener("click", () => handleAddPermissionClick(permissionsList));
            removeRoleButton.addEventListener("click", () => handleRemovePermissionClick(permissionsList));
        }
        // Récupération du bouton de soumission et attachement du gestionnaire d'événements
        const submitButton = document.querySelector('form');
        if (submitButton) {
            submitButton.addEventListener("submit", (event) => {
                handleAddEmployeeFormSubmit(event);
            });
        }
        // Les fonctions handleAddRoleClick et handleRemoveRoleClick restent inchangées
        if (addEmployeeButton) {
            addEmployeeButton.addEventListener("click", handleAddEmployeeClick);
        }
    }
    //Valide l'ajout, récupère les informations, et l'ajoute à la BD
    function handleAddEmployeeFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        // Récupérez les valeurs du formulaire
        const nom = form.elements.namedItem("nom").value;
        const prenom = form.elements.namedItem("prenom").value;
        const tel = form.elements.namedItem("tel").value;
        const email = form.elements.namedItem("email").value;
        const adresse = form.elements.namedItem("adresse").value;
        const poste = form.elements.namedItem("poste").value;
        const rang = form.elements.namedItem("rang").value;
        // Créez un nouvel objet employé avec les valeurs du formulaire
        const newEmployee = {
            id: employeesData.length + 1, // Générez un nouvel identifiant unique
            nom: nom,
            prenom: prenom,
            tel: tel,
            email: email,
            adresse: adresse,
            poste: poste,
            rang: rang,
            permissions: [],
            emploiDuTemps: []
        };
        addEmployeeInServer(newEmployee);
        // Ajoutez le nouvel employé à la liste des employés
        employeesData.push(newEmployee);
        // Rafraîchissez la liste des employés
        refreshEmployeeList();
        // Effacez le contenu de la section info-employee
        if (infoEmployee) {
            infoEmployee.innerHTML = '';
        }
    }
    /*************** FILTRE ET RECHERCHE DANS LA LISTE ***************/
    // Récupérer les éléments de recherche par nom et par ID
    const searchByNameInput = document.getElementById('search-by-name');
    const searchByIdInput = document.getElementById('search-by-id');
    // Ajouter des écouteurs d'événements pour les champs de recherche
    searchByNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchText = searchByNameInput.value.trim().toLowerCase();
            if (searchText === '') {
                displayEmployees(employeesData);
            }
            else {
                filterEmployeesByName(searchText);
            }
        }
    });
    searchByIdInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchId = parseInt(searchByIdInput.value.trim());
            if (!isNaN(searchId)) {
                filterEmployeesById(searchId);
            }
            else {
                displayEmployees(employeesData);
            }
        }
    });
    // Fonction pour filtrer les employés par nom
    function filterEmployeesByName(name) {
        const filteredEmployees = employeesData.filter(employee => {
            const fullName = `${employee.nom} ${employee.prenom}`.toLowerCase();
            return fullName.includes(name);
        });
        displayEmployees(filteredEmployees);
    }
    // Fonction pour filtrer les employés par ID
    function filterEmployeesById(id) {
        const filteredEmployees = employeesData.filter(employee => employee.id === id);
        displayEmployees(filteredEmployees);
    }
    // Fonction pour afficher les employés
    function displayEmployees(employees) {
        const listEmployees = document.getElementById('list-employees');
        if (!listEmployees)
            return;
        // Effacer tout le contenu de list-employees
        listEmployees.innerHTML = '';
        // Réafficher les employés filtrés
        employees.forEach(employee => {
            const employeeElement = createEmployeeElement(employee);
            listEmployees.appendChild(employeeElement);
        });
    }
});
