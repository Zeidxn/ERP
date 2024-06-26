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
// Fonction de modification des informations de l'employé(e).
function modifierInfosEmploye(modification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/modifierInfosEmployeProfil', {
                method: 'PUT', // Utilisation de la méthode PUT pour la modification.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modification)
            });
            // Vérification de la réponse HTTP.
            if (!response.ok) {
                throw new Error('Erreur lors de la modification des informations de l\'employé');
            }
            // Récupération du résultat de la modification.
            const result = yield response.json();
            console.log(result.message);
        }
        catch (error) {
            console.error('Erreur lors de la modification des informations de l\'employé:', error);
            throw error;
        }
    });
}
// Déclenchement de l'évènement.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('conteneur-modifications');
    if (form) {
        form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault(); // Empêche le rechargement de la page.
            // Récupération de la nouvelle valeur depuis le champ du formulaire.
            const nouvelleValeurInput = document.getElementById('email');
            const nouvelleValeur = nouvelleValeurInput.value;
            // Modification des informations de l'employé(e).
            const modification = {
                idEmploye: 2,
                colonne: 'personne.partenaire.contact.courriel',
                nouvelleValeur: nouvelleValeur
            };
            // Appel de la fonction pour effectuer la modification.
            yield modifierInfosEmploye(modification);
        }));
    }
    else {
        console.error('Le formulaire de modification est introuvable.');
    }
});
