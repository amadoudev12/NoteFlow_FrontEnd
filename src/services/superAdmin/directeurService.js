import axiosClient from '../../../services/AxiosClient';

const directeurService = {
  getDirecteurs: () => axiosClient.get('/super-admin/directeurs')
};

export default directeurService;
