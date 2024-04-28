let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', load)

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};

function load(){
    const start = counter;
    const end = counter + quantity - 1;
    counter = end + 1;

    fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(add_post)
        // add_post(data[0].title)
    })
}

function add_post(object){
    const post = document.createElement('div')
    post.className = 'post'
    post.innerHTML = `
    <div class="author">By: ${object.author}</div> 
    <div class="title">${object.title}</div>
    <div class="body">${object.body}</div>
    <div class="footer-wrapper">
        <img src="../static/network/not_liked.svg" alt="like" height="30" width="30">
        <div>${object.likes}</div>
        <div class="date">${object.date}</div>
    </div>`;
    document.querySelector('#posts').append(post); //dodać odnośnik do profilu autora
}