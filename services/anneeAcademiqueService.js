import axiosClient from './AxiosClient';
export default {
  list: () => axiosClient.get('/annees-academiques'),
  create: data => axiosClient.post('/annees-academiques', data),
  update: (id, data) => axiosClient.patch(`/annees-academiques/${id}`, data),
  activate: id => axiosClient.patch(`/annees-academiques/${id}/active`)
};
