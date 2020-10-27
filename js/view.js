import api from './api.js';
import db from './db.js';
import helper from './helper.js';

const muatSini = document.querySelector("#main-content");
const showStanding = (dataStanding) => {
    api.getTopSkor();
    let standings = "";
    // console.log(dataStanding);
    let str = JSON.stringify(dataStanding).replace(/http:/g, 'https:');
    let dataTemp = JSON.parse(str);
    // console.log(dataTemp);
    dataTemp.standings[0].table.forEach(result => {
        // console.log(result);
        standings += `
        <tr class="baris-tabel ">
            <td class='r-${result.position} center-align'>${result.position}</td>
            <td class="standing-team center"><img alt='Logo Club' class="icon-club" src="${ result.team.crestUrl || 'img/empty_badge.svg'}"></td><td> <a class="detail-club" data-idteam=${result.team.id}>${result.team.name}</a></td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.goalsFor}</td>
            <td>${result.goalsAgainst}</td>
            <td>${result.goalDifference}</td>
            <td>${result.points}</td>
        </tr>
        `;
    });
    muatSini.innerHTML = `
        <div class="title-standing valign-wrapper">
          <h5>Klasmen</h5> <a data-target="modal1" class="modal-trigger waves-effect waves-light btn blue-grey darken-4 " type="submit" name="action">Top Skor</a>
        </div>
        <ul id="keterangan-warna">
            <li>
                <span class='hide-on-small-only box-keterangan light-blue darken-4'></span> <h6 class='hide-on-small-only'>Champions &nbsp;</h6> 
            </li>
            <li>
                <span class='hide-on-small-only box-keterangan orange accent-3'></span> <h6 class='hide-on-small-only'>Europa League &nbsp</h6>
            </li>
            <li>
                <span class='hide-on-small-only box-keterangan red accent-2'></span> <h6 class='hide-on-small-only'>Degradasi</h6>
            <li>
        </ul>
        <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

        <table class="striped responsive-table">
            <thead>
                <tr>
                    <th>R</th>
                    <th class="center">Tim</th>
                    <th></th>
                  
                    <th>Ma</th>
                    <th>Me</th>
                    <th>S</th>
                    <th>K</th>
                    <th>GM</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Poin</th>
                </tr>
                </thead>
            <tbody id="standings">
                ${standings}
            </tbody>
        </table>
        
        </div>
    `;

    const clubs = document.querySelectorAll('.detail-club');
    // console.log(clubs);
    clubs.forEach(club => {
        club.addEventListener('click', e => {
            const idClub = e.target.getAttribute('data-idteam');
            console.log(idClub);
            api.getTeamDetail(idClub);
            helper.hideLoader();
        })
    })

    const elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal);
    helper.hideLoader();
}

const showDetailTeam = (detail) => {
    let tempDetail = JSON.stringify(detail).replace(/http:/g, 'https:');
    let detailTeam = JSON.parse(tempDetail);
    // console.log(detailTeam);
    let htmlTim = `
    <ul id="tabs-swipe" class="tabs">
        <li class="tab col s6"><a href="#detail-tim">Detail Tim</a></li>
        <li class="tab col s6"><a href="#squad-team">Squad Tim</a></li>
    </ul>
    <div id="detail-tim" class="col s12">
        <div class="header-team">
            <a class="btn-save-team waves-effect waves-light btn" data-idteam="${detailTeam.id}">Simpan</a>
            <img src="${detailTeam.crestUrl || './img/empty_badge.svg'}" alt="Logo Club">
        </div>
        <table class="responsive-table">
            <tbody>
                <tr>
                    <td>Nama</td>
                    <td>${detailTeam.name || '-'}</td>
                </tr>
                <tr>
                    <td>Nama Pendek</td>
                    <td>${detailTeam.shortName || '-'}</td>
                </tr>
                <tr>
                    <td>TLA</td>
                    <td>${detailTeam.tla || '-'}</td>
                </tr>
                <tr>
                    <td>Tahun Berdiri</td>
                    <td>${detailTeam.founded || '-'}</td>
                </tr>
                <tr>
                    <td>Stadion</td>
                    <td>${detailTeam.venue || '-'}</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>${detailTeam.address || '-'}</td>
                </tr>
                <tr>
                    <td>Website</td>
                    <td>${detailTeam.website.replace(/http/g,'https') || '-'}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${detailTeam.email || '-'}</td>
                </tr>
            </tbody>
        </table>
    </div>
   
    `;
    let squads = detailTeam.squad;
    let htmlsquad = ``;
    squads.forEach(squad => {
        if (squad.role === "PLAYER") {
            htmlsquad += `
            <tr>
                <td>${squad.name || '-'}</td>
                <td>${squad.position || '-'}</td>
                <td>${squad.nationality || '-'}</td>
                <td>${helper.dateToDMY(new Date(squad.dateOfBirth)) || '-'}</td>
            </tr>
            `;
        }
    })

    let tableSquad = `
    <div id="squad-team" class="col s12">
    <table class="responsive-table">
        <thead>
            <tr>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Kewarganegaraan</th>
                <th>Tanggal Lahir</th>
            </tr>
        </thead>
        <tbody>
            ${htmlsquad}
        </tbody>
    </table>
  </div>

    `;

    muatSini.innerHTML = htmlTim + tableSquad;
    const elemTabs = document.querySelector('.tabs');
    M.Tabs.init(elemTabs);
    const btnSave = document.querySelector('.btn-save-team');

    btnSave.addEventListener('click', () => {
        const idTeam = btnSave.getAttribute('data-idteam');
        db.saveTeam(detailTeam, idTeam);
        btnSave.style.opacity = 0;
        helper.notifikasi(`Tim  ${detailTeam.shortName || '-'} Sudah disimpan`)
    })

    helper.hideLoader();
}

const displayFavTeam = () => {
    const teams = db.displayAllTeam();
    let htmlTim = ``;
    teams.then(team => {
        if (team.length === 0) {
            muatSini.innerHTML = `<h5>Anda Belum Menyimpan tim Favorit</h5>`;
            return;
        } else {
            team.forEach(tim => {
                // console.log(tim);
                htmlTim += `
                <div class="col s12 m6 card-favorite">
                    <div class="card">
                        <div class="card-image center">
                        <img src="${tim.crestUrl}" alt="logo Club">
                        </div>
                        <div class="card-content">
                        <h6 class="center">${tim.name}</h6>
                        </div>
                        <div class="card-action">
                            <a class="btn-detail-team waves-effect waves-light btn" data-idteam="${tim.id}">Detail</a>
                            <a class="btn-delete-team waves-effect waves-light red btn" data-idteam="${tim.id}">Hapus</a>
                        </div>
                    </div>
                </div>
                `;
            })

            muatSini.innerHTML = htmlTim;
            const btnDelete = document.querySelectorAll('.btn-delete-team');
            const btnDetail = document.querySelectorAll('.btn-detail-team');

            btnDelete.forEach(club => {
                club.addEventListener('click', e => {
                    const idClub = e.target.getAttribute('data-idteam');
                    // console.log(idClub);
                    db.deleteTeam(idClub);
                })
            })
            btnDetail.forEach(club => {
                club.addEventListener('click', e => {
                    const idClub = e.target.getAttribute('data-idteam');
                    // console.log(idClub);
                    db.displayTeamByID(idClub);
                })
            })
        }

    })

    helper.hideLoader();
}
// display Team dari indexdb
const showTeambyID = (detailTeam) => {
    
    // console.log(detailTeam);
    let htmlTim = `
    <ul id="tabs-swipe" class="tabs">
        <li class="tab col s6"><a href="#detail-tim">Detail Tim</a></li>
        <li class="tab col s6"><a href="#squad-team">Squad Tim</a></li>
    </ul>
    <div id="detail-tim" class="col s12">
        <div class="header-team">
            <a class="btn-delete-team waves-effect waves-light red btn" data-idteam="${detailTeam.id}">Hapus dari Favorit</a>
            <img src="${detailTeam.crestUrl || './img/empty_badge.svg'}" alt="Logo Club">
        </div>
        <table class="responsive-table">
            <tbody>
                <tr>
                    <td>Nama</td>
                    <td>${detailTeam.name || '-'}</td>
                </tr>
                <tr>
                    <td>Nama Pendek</td>
                    <td>${detailTeam.shortName || '-'}</td>
                </tr>
                <tr>
                    <td>TLA</td>
                    <td>${detailTeam.tla || '-'}</td>
                </tr>
                <tr>
                    <td>Tahun Berdiri</td>
                    <td>${detailTeam.founded || '-'}</td>
                </tr>
                <tr>
                    <td>Stadion</td>
                    <td>${detailTeam.venue || '-'}</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>${detailTeam.address || '-'}</td>
                </tr>
                <tr>
                    <td>Website</td>
                    <td>${detailTeam.website.replace(/http/g,'https') || '-'}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${detailTeam.email || '-'}</td>
                </tr>
            </tbody>
        </table>
    </div>
   
    `;
    let squads = detailTeam.squad;
    let htmlsquad = ``;
    squads.forEach(squad => {
        if (squad.role === "PLAYER") {
            htmlsquad += `
            <tr>
                <td>${squad.name || '-'}</td>
                <td>${squad.position || '-'}</td>
                <td>${squad.nationality || '-'}</td>
                <td>${helper.dateToDMY(new Date(squad.dateOfBirth)) || '-'}</td>
            </tr>
            `;
        }
    })

    let tableSquad = `
    <div id="squad-team" class="col s12">
    <table class="responsive-table">
        <thead>
            <tr>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Kewarganegaraan</th>
                <th>Tanggal Lahir</th>
            </tr>
        </thead>
        <tbody>
            ${htmlsquad}
        </tbody>
    </table>
  </div>

    `;

    muatSini.innerHTML = htmlTim + tableSquad;
    const elemTabs = document.querySelector('.tabs');
    M.Tabs.init(elemTabs);
    const btnDelete = document.querySelector('.btn-delete-team');

    btnDelete.addEventListener('click', () => {
        const idTeam = btnDelete.getAttribute('data-idteam');
        db.deleteTeam(idTeam);
    })

    helper.hideLoader();

}

const showTopSkor = (datagol) => {
    // console.log(datagol);   
    const isiModal = document.querySelector('#isi-modal')

    let html = '';
    datagol.scorers.forEach(data => {
        html +=
            `<tr>
          <td>${data.player.name}</td>
          <td>${data.team.name}</td>
          <td>${data.numberOfGoals}</td>
      </tr>`;
    });

    isiModal.innerHTML = `
    <table >
    <thead>
      <tr>
          <th>Nama</th>
          <th>Club</th>
          <th>Gol</th>
      </tr>
    </thead>
    <tbody>
    ${html}
    </tbody>
    `;
}

export default {
    showStanding,
    showDetailTeam,
    displayFavTeam,
    showTeambyID,
    showTopSkor
};