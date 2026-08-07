import axiosClient from '../../../services/AxiosClient';

const anneeAcademiqueService = {
  getAnneesAcademiques: () => axiosClient.get('/super-admin/annees'),
  createAnnee: (data) => axiosClient.post('/super-admin/annees/create', data),
  activateAnnee: (id) => axiosClient.patch(`/super-admin/annees/${id}/active`)
};

export default anneeAcademiqueService;
