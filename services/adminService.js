import axiosClient from "./AxiosClient";
const adminService = {
    Stat : ()=> axiosClient.get('/admin/stat'),
    faiblesMoyenne : ()=>axiosClient.get('/admin/liste-faible-moyenne'),
    fortesMoyenne : ()=>axiosClient.get('/admin/liste-forte-moyenne'),
    nombreElevesFaiblesByClasse : ()=> axiosClient.get('/admin/nombreElevesFaible'),
    nombreElevesFortByClasse : ()=> axiosClient.get('/admin/nombreElevesFort'),
    classeBest : ()=> axiosClient.get('/admin/cinq-meilleurByclasse'),
    mauvaisEleves : ()=> axiosClient.get('/admin/mauvais-eleves-classe'),
    postAdmin : (formData)=> axiosClient.post('/admin/register', formData,{
        headers : {
            "Content-Type":"multipart/form-data"
        }
    })
}
export default adminService