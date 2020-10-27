import api from './api.js';
import db from './db.js';
import helper from './helper.js';

const muatSini = document.querySelector("#main-content");
const showAllMatch = data => {
    const dataMatch = data.matches;
    let matchDays = [];
    let tableDataMatches = "";
    let tableMatchesHtml = "";
    const unique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    if (dataMatch.length === 0) {
        muatSini.innerHTML = `<h5>Semua Pertandingan di Musim ini telah selesai</h5>`;
        return
    }

    for (let i = 0; i < dataMatch.length; i++) {
        matchDays.push(dataMatch[i].matchday);
    }
    // console.log(dataMatch);

    /* Separating matches by date(matchday) */
    let idx = 0;
    for (let i = 0; i < dataMatch.length; i++) {
        if (dataMatch[i].matchday === matchDays.filter(unique)[idx]) {
            // Tambah row
            tableDataMatches += `
                <tr>
                    <td> ${dataMatch[i].homeTeam.name} </td>
                    <td> (${new Date(dataMatch[i].utcDate).toLocaleTimeString()}) </td>
                    <td> ${dataMatch[i].awayTeam.name} </td>
                    <td> <a class="btn-detail-match" data-idnextmatch=${dataMatch[i].id}>Detail</a> </td>
                </tr>
            `;
        } else {
            // Tambah tabel
            tableMatchesHtml += `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${helper.dateToDMY(new Date(dataMatch[i-1].utcDate).toLocaleDateString())}</span>
                        <table class="responsive-table striped centered">
                            <thead>
                                <tr>
                                    <th>Home</th>
                                    <th>Kick Off</th>
                                    <th>Away</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ` + tableDataMatches + `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Kosongkan row
            tableDataMatches = "";

            // Tambah row
            tableDataMatches += `
                <tr>
                    <td> ${dataMatch[i].homeTeam.name} </td>
                    <td> (${new Date(dataMatch[i].utcDate).toLocaleTimeString()}) </td>
                    <td> ${dataMatch[i].awayTeam.name} </td>
                    <td> <a class="btn-detail-match" data-idnextmatch=${dataMatch[i].id}>Detail</a> </td>
                </tr>
            `;

            idx++;
        }
    }

    // Tambah tabel
    tableMatchesHtml += `
        <div class="card">
            <div class="card-content">
                <span class="card-title">${helper.dateToDMY(new Date(dataMatch[dataMatch.length-1].utcDate).toLocaleDateString())}</span>
                <table class="responsive-table striped centered">
                    <thead>
                        <tr>
                            <th>Home</th>
                            <th>Kick Off</th>
                            <th>Away</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ` + tableDataMatches + `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    muatSini.innerHTML = tableMatchesHtml;
    const btnDetailMatch = document.querySelectorAll('.btn-detail-match');
    btnDetailMatch.forEach(event => {
        event.addEventListener('click', e => {
            const idMatch = e.target.getAttribute('data-idnextmatch');
            console.log(idMatch);
            api.getdNextMatch(idMatch)
        })
    })
    helper.hideLoader();
}

const detailNextMatch = (data) => {
    // console.log(data);
    let htmlmatch = `
    <div class="row">
        <div class="col s12">
        <div class="row">
            <div class="col s12 m12">
            <div class="card detail-match">
                <div class="card-content">
                <span class="card-title">Head to Head</span>
                <h5 class="center-align">${data.head2head.homeTeam.name} Vs ${data.head2head.awayTeam.name}</h5>
                <p class="center-align"> <a>${helper.dateToDMY(new Date(data.match.utcDate).toLocaleDateString())}</a>
                <a>${new Date(data.match.utcDate).toLocaleTimeString()}</a><p>
                </div>
                <div class="card-action">
                    <a class="btn-save-match right-align waves-effect waves-light btn" data-idmatch="${data.match.id}">Save</a>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    `;

    htmlmatch += `
    <table class="responsive-table">
        <thead>
            <tr>
                <th>${data.head2head.homeTeam.name}</th>
                <th class="center-align">match : ${data.head2head.numberOfMatches}</th>
                <th class="right-align">${data.head2head.awayTeam.name}</th>
            </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.head2head.homeTeam.wins}</td>
            <td class="center-align">Menang</td>
            <td class="right-align">${data.head2head.awayTeam.wins}</td>
          </tr>
          <tr>
            <td>${data.head2head.homeTeam.draws}</td>
            <td class="center-align">Seri</td>
            <td class="right-align">${data.head2head.awayTeam.draws}</td>
          </tr>
          <tr>
            <td>${data.head2head.homeTeam.losses}</td>
            <td class="center-align">Kalah</td>
            <td class="right-align">${data.head2head.awayTeam.losses}</td>
          </tr>
        </tbody>
    </table>
    `;
    muatSini.innerHTML = htmlmatch;
    const btnSaveMatch = document.querySelector('.btn-save-match');
    const idMatch = btnSaveMatch.getAttribute('data-idmatch');
    btnSaveMatch.addEventListener('click', () => {
        db.saveMatch(data, idMatch);
        btnSaveMatch.style.opacity = 0;
        helper.notifikasi(`Pertandingan ${data.head2head.homeTeam.name} VS ${data.head2head.awayTeam.name}`)
    })

    helper.hideLoader();
}
const displayFavMatch = () => {
    const mathces = db.displayAllMatch();
    let htmlMatch = ``;
    mathces.then(match => {
        // console.log(match);
        if (match.length === 0) {
            muatSini.innerHTML = `<h5>Anda Belum Menyimpan Pertandingan Favorit</h5>`;
            return;
        } else {
            match.forEach(m => {
                console.log(m);
                htmlMatch += `
            <div class="col s12 m6 card-favorite">
                <div class="card">
                    <div class="card-content">
                    <h6 class="center-align">${m.head2head.homeTeam.name} Vs ${m.head2head.awayTeam.name}</h6>
                    <p class="center-align"> <a>${helper.dateToDMY(new Date(m.match.utcDate).toLocaleDateString())}</a>
                    <a>${new Date(m.match.utcDate).toLocaleTimeString()}</a><p>
                    </div>
                    <div class="card-action">
                        <a class="btn-detail-match waves-effect waves-light btn" data-idmatch="${m.match.id}">Detail</a>
                        <a class="btn-delete-match waves-effect waves-light red btn" data-idmatch="${m.match.id}">Hapus</a>
                    </div>
                </div>
            </div>
            `;
            })
            muatSini.innerHTML = htmlMatch;
            const btnDelete = document.querySelectorAll('.btn-delete-match');
            const btnDetail = document.querySelectorAll('.btn-detail-match');

            btnDelete.forEach(btmatch => {
                // console.log(btmatch);
                btmatch.addEventListener('click', e => {
                    const idClub = e.target.getAttribute('data-idmatch');
                    console.log(idClub);
                    db.deleteMatch(idClub);
                })
            })
            btnDetail.forEach(btmatch => {
                // console.log(btmatch);
                btmatch.addEventListener('click', e => {
                    const idClub = e.target.getAttribute('data-idmatch');
                    db.displayMatcByID(idClub);
                })
            })
        }
    })
}

const showMatchID =(data)=>{
    let htmlmatch = `
    <div class="row">
        <div class="col l12">
        <div class="row">
            <div class="col s12 m12">
            <div class="card detail-match">
                <div class="card-content">
                <span class="card-title">Head to Head</span>
                <h5 class="center-align">${data.head2head.homeTeam.name} Vs ${data.head2head.awayTeam.name}</h5>
                <p class="center-align"> <a>${helper.dateToDMY(new Date(data.match.utcDate).toLocaleDateString())}</a>
                <a>${new Date(data.match.utcDate).toLocaleTimeString()}</a><p>
                </div>
                <div class="card-action">
                    <a class="btn-delete-match right-align waves-effect waves-light red btn" data-idmatch="${data.match.id}">Delete</a>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    `;

    htmlmatch += `
    <table class="responsive-table">
        <thead>
            <tr>
                <th>${data.head2head.homeTeam.name}</th>
                <th class="center-align">match : ${data.head2head.numberOfMatches}</th>
                <th class="right-align">${data.head2head.awayTeam.name}</th>
            </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.head2head.homeTeam.wins}</td>
            <td class="center-align">Menang</td>
            <td class="right-align">${data.head2head.awayTeam.wins}</td>
          </tr>
          <tr>
            <td>${data.head2head.homeTeam.draws}</td>
            <td class="center-align">Seri</td>
            <td class="right-align">${data.head2head.awayTeam.draws}</td>
          </tr>
          <tr>
            <td>${data.head2head.homeTeam.losses}</td>
            <td class="center-align">Kalah</td>
            <td class="right-align">${data.head2head.awayTeam.losses}</td>
          </tr>
        </tbody>
    </table>
    `;
    muatSini.innerHTML = htmlmatch;
    const btnSaveMatch = document.querySelector('.btn-delete-match');
    const idMatch = btnSaveMatch.getAttribute('data-idmatch');
    btnSaveMatch.addEventListener('click', () => {
        db.deleteMatch(idMatch);
    })
    helper.hideLoader();
}

export default {
    showAllMatch,
    detailNextMatch,
    displayFavMatch,
    showMatchID
};
