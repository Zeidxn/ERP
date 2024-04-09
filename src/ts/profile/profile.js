"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let emploiDuTemps = [];
function getEmployeeSchedule() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employeeId = 2;
            const response = yield fetch(`/voirEdt/${employeeId}`);
            if (!response.ok) {
                throw new Error('Impossible de récupérer l\'emploi du temps de l\'employé');
            }
            const scheduleData = yield response.json(); // Typage temporaire, à remplacer par le type approprié
            // Transformez scheduleData en PeriodeEDT
            emploiDuTemps = scheduleData.map((item) => {
                return {
                    employe_id: item.employe_id,
                    periode_id: item.periode_id,
                    intitule: item.intitule,
                    jour: new Date(item.periode.dateDebut).toLocaleDateString(),
                    heureDebut: new Date(item.periode.dateDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    heureFin: new Date(item.periode.dateFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
            });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'emploi du temps de l\'employé:', error);
            throw error; // Propagez l'erreur pour qu'elle puisse être gérée en amont si nécessaire
        }
    });
}
function voirinfos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield getEmployeeSchedule(); // Récupérer l'emploi du temps au début
            // Utilisez l'ID de l'employé pour construire l'URL de la requête fetch
            const idEmploye = 2;
            const response = yield fetch(`/VoirInfosEmploye/${idEmploye}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de l\'employé');
            }
            const infosEmploye = yield response.json();
            // Récupération des éléments HTML où afficher les informations
            const prenomElement = document.getElementById('prenom');
            const nomElement = document.getElementById('nom');
            const rangElement = document.getElementById('rang');
            const emailElement = document.getElementById('email');
            const telephoneElement = document.getElementById('telephone');
            const adresseElement = document.getElementById('adresse');
            const edtElement = document.getElementById('edt');
            // Mise à jour des champs avec les informations obtenues
            if (prenomElement && nomElement && rangElement && emailElement && telephoneElement && adresseElement) {
                prenomElement.textContent = infosEmploye.personne.prenom;
                nomElement.textContent = infosEmploye.personne.nom;
                rangElement.textContent = infosEmploye.rang;
                emailElement.textContent = infosEmploye.personne.partenaire.contact.courriel;
                telephoneElement.textContent = infosEmploye.personne.partenaire.contact.tel;
                adresseElement.textContent = `${infosEmploye.personne.partenaire.contact.adresse}, ${infosEmploye.personne.partenaire.contact.codePostal}`;
                // Afficher l'emploi du temps depuis la liste
                if (edtElement) {
                    emploiDuTemps.forEach(periode => {
                        edtElement.innerHTML += `
                        <div>
                            <p>Intitulé: ${periode.intitule}</p>
                            <p>Jour: ${periode.jour}</p>
                            <p>Heure de début: ${periode.heureDebut}</p>
                            <p>Heure de fin: ${periode.heureFin}</p>
                        </div>
                    `;
                    });
                }
                else {
                    console.error('Élément HTML pour l\'emploi du temps introuvable.');
                }
            }
            else {
                console.error('Certains éléments HTML sont introuvables.');
            }
        }
        catch (error) { // Indiquer à TypeScript que 'error' peut être de type 'any'
            console.error(error.message);
        }
    });
}
document.addEventListener("DOMContentLoaded", voirinfos);
