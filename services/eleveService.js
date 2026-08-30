import axiosClient from "./AxiosClient"
const eleveService = {
    getEleve: (id)=> axiosClient.get(`eleves/${id}`),
    getMoyenneMat: (id) => axiosClient.get(`eleves/note-matiere/${id}`),
    getRang : ()=> axiosClient.get('eleves/rang'),
    getPeriodeActive: (id)=> axiosClient.get(`eleves/periode-active/${id}`),
    postAbsence: (data) => axiosClient.post('/eleves/absence',data),
    getEleveBulletin: (data) => axiosClient.post('eleves/bulletin', data),
    postEleves : (formData)=> axiosClient.post('/eleves/import', formData,{
        headers : {
            "Content-Type":"multipart/form-data"
        }
    }),
    getCertificat: ()=> axiosClient.get('eleves/certificat',{
        responseType:"blob"
    }),
}

export default eleveService