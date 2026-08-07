import axiosClient from '../../../services/AxiosClient';

const etablissementService = {
  getEtablissements: () => axiosClient.get('/super-admin/etablissements'),
  getEtablissement: (id) => axiosClient.get(`/super-admin/etablissements/${id}`),
  updateEtablissement: (id, data) => axiosClient.put(`/super-admin/etablissements/${id}`, data),
  updateStatus: (id, statut) => axiosClient.patch(`/super-admin/etablissements/${id}/status`, { statut })
};

export default etablissementService;
