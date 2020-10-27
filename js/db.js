import view from './view.js';
import matchview from './matchview.js';

let dbproses = idb.open('football_laliga', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('matches')
      upgradeDb.createObjectStore('teams')
  }
});

const saveTeam = (team, id) => {
  dbproses.then(db => {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    //   team.createdAt = new Date().getTime()
    store.put(team, id);
    return tx.complete;
  }).then(() => {
    M.toast({
      html: `${team.name} berhasil disimpan!`
    })
    console.log('Pertandingan berhasil disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

const displayAllTeam = () => {
  return dbproses.then(db => {
    let tx = db.transaction('teams', 'readonly');
    let store = tx.objectStore('teams');
    return store.getAll();
  })
}

const deleteTeam = id => {
  //   console.log(idteam);
  let c = confirm("Anda yakin ingin ?");
  if (c === true) {
    // console.log('Ya');
    dbproses
      .then(db => {
        let tx = db.transaction('teams', 'readwrite')
        let store = tx.objectStore('teams')
        store.delete(id)
        return tx.complete
      })
      .then(() => view.displayFavTeam())
  }
}

const displayTeamByID = idTeam => {
  return dbproses.then(db => {
      let tx = db.transaction('teams', 'readonly');
      let store = tx.objectStore('teams');
      // console.log(idTeam);
      return store.get(idTeam);
    })
    .then((team) => {
      view.showTeambyID(team);
    })
}

const saveMatch = (match, id) => {
  // console.log(match);
  dbproses.then(db => {
    let tx = db.transaction('matches', 'readwrite');
    let store = tx.objectStore('matches');
    store.put(match, id);
    return tx.complete;
  }).then(() => {
    M.toast({
      html: `${match.head2head.homeTeam.name} VS ${match.head2head.awayTeam.name} berhasil disimpan!`
    })
    console.log('Pertandingan berhasil disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

const displayAllMatch = () => {
  return dbproses.then(db => {
    let tx = db.transaction('matches', 'readonly');
    let store = tx.objectStore('matches');
    return store.getAll();
  })
}

const deleteMatch = id => {
  //   console.log(idteam);
  let c = confirm("Apakah yakin anda akan menghapus data ?");
  if (c === true) {
    // console.log('Ya');
    dbproses
      .then(db => {
        let tx = db.transaction('matches', 'readwrite')
        let store = tx.objectStore('matches')
        store.delete(id)
        return tx.complete
      })
      .then(() => matchview.displayFavMatch())
  }
}

const displayMatcByID = id => {
  return dbproses.then(db => {
      let tx = db.transaction('matches', 'readonly');
      let store = tx.objectStore('matches');
      // console.log(idTeam);
      return store.get(id);
    })
    .then((match) => {
      matchview.showMatchID(match);
    })
}



export default {
  saveTeam,
  displayAllTeam,
  deleteTeam,
  displayTeamByID,
  saveMatch,
  displayAllMatch,
  displayMatcByID,
  deleteMatch
};