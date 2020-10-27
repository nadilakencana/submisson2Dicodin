import api from '/js/api.js';
import view from '/js/view.js';
import matchview from '/js/matchview.js';


function loadPage(page) {
    if (page === "")
        page === 'home';
    if (page === 'home') {
        api.getKlasmen();
        return;
    }
    if (page === 'favtim') {
        view.displayFavTeam();
        return;
    }
    if (page === 'matches') {
        api.getAllMatch();
        return;
    }
    if (page === 'favmatch') {
        matchview.displayFavMatch();
        return;
    } else {
        errorPage();
    }

}

export default {
    loadPage
};