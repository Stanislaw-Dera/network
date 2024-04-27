let counter = 1;
const quantity = 10;

document.addEventListener('DOMContentLoaded', load)

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};

function load(){
    fetch('/posts')
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}