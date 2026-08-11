import axiosClient from "./AxiosClient";

const trimestreService = {
    getTrimestres : (anneeAcademiqueId) => axiosClient.get('trimestres/', { params: anneeAcademiqueId ? { anneeAcademiqueId } : {} }),
    getTrimestresActive : (anneeAcademiqueId)=> axiosClient.get('trimestres/active', { params: anneeAcademiqueId ? { anneeAcademiqueId } : {} }),
    postTrimestre : (data) => axiosClient.post('/trimestres/create',data),
    activeTrimestre : (id) => axiosClient.patch(`/trimestres/actif/${id}`),
    deleteTrimestre : (id) => axiosClient.delete(`/trimestres/delete/${id}`)
}
export default trimestreService
