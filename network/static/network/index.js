let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', load)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#post-button').addEventListener('click', submit_post)
})

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};

let loading = false;

function load(){
     if(!loading){
         loading=true
        const start = counter;
        const end = counter + quantity - 1;
        counter = end + 1;

        fetch(`/posts?start=${start}&end=${end}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                data.forEach(add_post)
                loading = false;
            })
            .catch(error => {
                console.log(error)
                loading = false;
            })
    }
}

function add_post(object){
    const post = document.createElement('div')
    post.className = 'post'
    post.innerHTML = `
    <div class="author">By: ${object.author}</div> 
    <div class="body">${object.body}</div>
    <div class="footer-wrapper">
        <img src="../static/network/not_liked.svg" alt="like" height="30" width="30">
        <div>${object.likes}</div>
        <div class="date">${object.date}</div>
    </div>`;
    document.querySelector('#posts').append(post); //dodać odnośnik do profilu autora
}

function submit_post(event){
    const postBody = document.querySelector('#post-textarea').value

    if (postBody !== ''){
        document.querySelector('#post-error-box').innerHTML = '';

        const csrftoken = getCookie('csrftoken');
        console.log(csrftoken);

        const formData = new FormData();
        formData.append('body', postBody)

        fetch('/post', {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
    } else{
        event.preventDefault();
        document.querySelector('#post-error-box').innerHTML = "Post body can't be empty!"
    }


}

//django's function
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}