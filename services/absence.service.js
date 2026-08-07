import axiosClient from "./AxiosClient";
const absenceService = {
    getAbsenceByClasse : (id, data)=> axiosClient.get(`/absences/classe/${id}`,{
        params: data
    }),
    getMesAbsences : ()=> axiosClient.get('/absences/mes-absences'),
    postAbsence : (data)=> axiosClient.post('/absences/create', data)
}

export default absenceService