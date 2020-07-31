import axios from "axios";
const backendBaseUrl = process.env.VUE_APP_BACKEND_IP + "/api";

export class ApiService {

    static insertTeammate(newTeammate) {
        return axios.post(backendBaseUrl + '/teammates/new', newTeammate);
    }

    static updateTeammate(id, teammate) {
        return axios.put(backendBaseUrl + '/teammates/update/' + id, teammate);
    }

    static getSkills() {
        return axios.get(backendBaseUrl + '/skills');
    }

    static getAllTeammates() {
        return axios.get(backendBaseUrl + "/teammates");
    }

    static deleteTeammate(id) {
        const url = backendBaseUrl + "/teammates/delete/" + id;

        return axios.delete(url);
    }
}

export default ApiService
