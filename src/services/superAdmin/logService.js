import axiosClient from '../../../services/AxiosClient';

const logService = {
  getLogs: () => axiosClient.get('/super-admin/logs')
};

export default logService;
