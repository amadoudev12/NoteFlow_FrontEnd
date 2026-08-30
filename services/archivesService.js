import axiosClient from "./AxiosClient"

// Service dédié à la consultation (lecture seule) des archives académiques :
// années terminées, trimestres clôturés, résultats par classe et par élève.
// Utilise le même client Axios (intercepteur d'authentification inclus) que
// les autres services du projet.
const archivesService = {
    getAnneesAcademiques: () => axiosClient.get("/admin/archives/annees"),

    getTrimestres: (anneeId) =>
        axiosClient.get(`/admin/archives/annees/${anneeId}/trimestres`),

    getTrimestreDetails: (anneeId, trimestreId) =>
        axiosClient.get(`/admin/archives/annees/${anneeId}/trimestres/${trimestreId}`),

    getClasseResultats: (trimestreId, classeId) =>
        axiosClient.get(`/admin/archives/trimestres/${trimestreId}/classes/${classeId}`),

    getEleveTrimestre: (matricule, trimestreId) =>
        axiosClient.get(`/admin/archives/eleves/${matricule}/trimestres/${trimestreId}`),

    getEleveHistorique: (matricule) =>
        axiosClient.get(`/admin/archives/eleves/${matricule}`),
}

export default archivesService
