import axiosClient from '../../../services/AxiosClient';

const trimestreService = {
  getTrimestres: () => axiosClient.get('/super-admin/trimestres'),
  createTrimestre: (data) => axiosClient.post('/super-admin/trimestres/create', data),
  updateTrimestre: (id, data) => axiosClient.put(`/super-admin/trimestres/${id}`, data)
};

export default trimestreService;
