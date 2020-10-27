import view from './view.js';
import matchview from './matchview.js';
import helper from './helper.js';
// Berisi Function buat Get data
const API_KEY = "42894823dcf445468e2d8c86cbf2faa6";
const base_url = "https://api.football-data.org/v2/";
const LEAGUE_ID = 2014;

// ep = endpoint
const stand_ep = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;
const matches_ep = `${base_url}competitions/${LEAGUE_ID}/matches?status=SCHEDULED`;
const teams_ep = `${base_url}teams/`;
const topskor_ep = `${base_url}competitions/${LEAGUE_ID}/scorers`;
const detail_match_ep = `${base_url}matches/`;

const fetchAPI = url_ep => {
    return fetch(url_ep, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

const getKlasmen = () => {
    helper.showLoader();
    if ("caches" in window) {
        caches.match(stand_ep).then(response => {
            if (response) {
                response.json().then(data => {
                    // console.log("Competition Data: " + data);
                    view.showStanding(data);
                })
            }
        })
    }

    fetchAPI(stand_ep)
        .then(data => {
            view.showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const getTeamDetail = (idTeam) => {
    helper.showLoader();
    if ("caches" in window) {
        caches.match(teams_ep + idTeam).then(response => {
            if (response) {
                response.json().then(data => {
                    // console.log("Competition Data: " + data);
                    view.showDetailTeam(data);
                })
            }
        })
    }

    fetchAPI(teams_ep + idTeam)
        .then(data => {
            view.showDetailTeam(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const getAllMatch = () => {
    helper.showLoader();
    if ("caches" in window) {
        caches.match(matches_ep).then(response => {
            if (response) {
                response.json().then(data => {
                    // console.log("Competition Data: " + data);
                    matchview.showAllMatch(data);
                })
            }
        })
    }

    fetchAPI(matches_ep)
        .then(data => {
            matchview.showAllMatch(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const getdNextMatch = (id) => {
    helper.showLoader();
    if ("caches" in window) {
        caches.match(detail_match_ep + id).then(response => {
            if (response) {
                response.json().then(data => {
                    matchview.detailNextMatch(data);
                })
            }
        })
    }

    fetchAPI(detail_match_ep + id)
        .then(data => {
            matchview.detailNextMatch(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const getTopSkor=()=> {
   
    if ("caches" in window) {
        caches.match(topskor_ep).then(response=>  {
            if (response) {
                response.json().then(data=> {
                    // console.log("Competition Data: " + data);
                    view.showTopSkor(data);
                })
            }
        })
    }

    fetchAPI(topskor_ep)
        .then(data => {
            view.showTopSkor(data);
        })
        .catch(error => {
            console.log(error)
     })
}
export default {
    getKlasmen,
    getTeamDetail,
    getAllMatch,
    getdNextMatch,
    getTopSkor
};
