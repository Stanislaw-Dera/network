import {handleLikeIMG} from "./like-button-handling.js";

export function addPost(object){
    const post = document.createElement('div')
    post.className = 'post'

    post.innerHTML = `
        <div class="author" onclick="loadUserProfile(${object.author_id})()">By: ${object.author}</div> 
        <div class="body">${object.body}</div>
        <div class="footer-wrapper">
            <img id="post-like-img-${object.id}" src="../static/network/not_liked.svg" alt="like" class="like-image" height="30" width="30">
            <div id="post-like-count-${object.id}">${object.likes}</div>
            <div class="date">${object.date}</div>
        </div>
    `;

    document.querySelector('#posts').append(post)

    //check whether post is already liked by this user, handle like img
    handleLikeIMG(object.id)

    // dodać odnośnik do profilu autora, zaradź coś na niezalogowanego użytkownika
}

export function submitPost(event){
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