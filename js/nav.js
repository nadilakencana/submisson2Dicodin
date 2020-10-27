import page from './page.js';
import view from './view.js';


let pages = window.location.hash.substr(1);
if (pages === "") pages = "home";
page.loadPage(pages);



const loadNav = () => {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    fetch('./nav.html')
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            } else {
                console.log('Error : ' + response.statusText)
                return Promise.reject(new Error(response.statusText));
            }
        })
        .then(response => response.text())
        .then(response => {
            let a = document.querySelectorAll(".topnav, .sidenav");
            a.forEach(elm => {
                elm.innerHTML = response;
            })
            const regLink = document.querySelectorAll(".sidenav a, .topnav a");
            regLink.forEach(elm => {
                elm.addEventListener('click', event => {
                    const sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();
                    pages = event.target.getAttribute("href").substr(1);
                    page.loadPage(pages);
                    console.log(pages);
                })
            })
        })
        .catch(error => {
            console.log('error : ' + error);
        })
}

export default {
    loadNav
};