import axiosClient from '../../../services/AxiosClient';

const parametreService = {
  getParametres: () => axiosClient.get('/super-admin/parametres'),
  updateParametres: (data) => axiosClient.put('/super-admin/parametres', data)
};

export default parametreService;
