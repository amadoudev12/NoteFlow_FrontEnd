import axiosClient from '../../../services/AxiosClient';

const statistiqueService = {
  getStatistiques: () => axiosClient.get('/super-admin/statistiques')
};

export default statistiqueService;
