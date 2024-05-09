import {handleLikeIMG} from "./like-button-handling.js";
import {loadUserProfile, getCookie, OnInput} from './index.js'

export function addPost(object){
    const post = document.createElement('div')
    post.className = 'post'
    post.id = `post-id-${object.id}`

    post.innerHTML = `
        <span>
            <div id="post-author-${object.id}" class="author">By: ${object.author}</div>
            <div id="edit-post-${object.id}" class="edit"></div>
        </span>
        <div class="body">${object.body}</div>
        <div class="footer-wrapper">
            <img id="post-like-img-${object.id}" src="../static/network/not_liked.svg" alt="like" class="like-image" height="30" width="30">
            <div id="post-like-count-${object.id}">${object.likes}</div>
            <div class="date">${object.date}</div>
        </div>
    `;

    document.querySelector('#posts').append(post)

    fetch('/get_current_user')
        .then(response => response.json())
        .then(data => {
            if(data.current_user_id === object.author_id){
                const editField = document.querySelector(`#edit-post-${object.id}`)
                editField.innerHTML = 'edit'
                editField.addEventListener('click', () => {
                    const textarea = document.createElement('textarea')
                    textarea.innerHTML = object.body;
                    textarea.className = 'form-control edit-textarea'
                    textarea.addEventListener("input", OnInput, false)

                    const submitDiv = document.createElement('div')
                    submitDiv.innerHTML = 'Edit'
                    submitDiv.className = 'btn btn-dark'

                    const bodyField = editField.parentNode.parentNode.querySelector(`.body`)

                    bodyField.innerHTML = ''
                    bodyField.appendChild(textarea)
                    bodyField.append(submitDiv)

                    //submitDiv.addEventListener('click', editPost(object.id, textarea.value))
                    submitDiv.addEventListener('click', () => {
                        console.log('success!')
                    })
                })
            }
        })

    document.querySelector(`#post-author-${object.id}`).addEventListener('click', loadUserProfile(object.author_id))

    //check whether post is already liked by this user, handle like img
    handleLikeIMG(object.id)


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

function editPost(postID, body){
    fetch(`posts/${postID}/edit`, {
        method: 'POST',
        headers: {'X-CSRFToken': getCookie('csrftoken')},
        body: {
            'body': body
        }
    })
        .then(response => response.json())
        .then(data =>{
            console.log(data)
        })
}