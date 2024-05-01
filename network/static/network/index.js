let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#post-button').addEventListener('click', submitPost)
    document.querySelector("#user-profile").addEventListener('click', loadUserProfile(2))
    document.querySelector("#all-posts").addEventListener('click', loadIndex)

    console.log('hash:', window.location.hash)

    // by default, load index page (all posts)
    loadIndex();
})

function loadIndex(){
    console.log('loadIndex')
    counter = 0;
    document.querySelector('#profile').style.display = 'none'
    document.querySelector('#create-post').style.display = 'grid'
    document.querySelector('#posts').style.display = 'block'

    document.querySelector('#posts').innerHTML = ''

    load();
    // event.preventDefault();

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            load();
        }
    };
}

function loadUserProfile(userID){
    return function () {

        fetch(`profile/${userID}`)
            .then(response => response.json())
            .then(userData => {
                userData = userData.user_data;

                const profileElement = document.querySelector('#profile')
                console.log(userData)
                profileElement.innerHTML = `
                <div id="profile-username">${userData.username}</div>
                <div id="profile-followers">Followers: ${userData.followers_count}</div>
                <div id="profile-following">Following: ${userData.following_count}</div>`
            })
            .then(() => {
                console.log('loadUserProfile')
                counter = 0;
                document.querySelector('#profile').style.display = 'grid'
                document.querySelector('#create-post').style.display = 'none'
                document.querySelector('#posts').style.display = 'block'

                document.querySelector('#posts').innerHTML = ''


               loadUserPosts(userID)()
                
                window.onscroll = () => {
                    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                        loadUserPosts(userID);
                    }
                };
            })
            .catch(error => {
                console.log(error)
                loadIndex()
            })


    }
}

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
                data.forEach(addPost)
                loading = false;
            })
            .catch(error => {
                console.log(error)
                loading = false;
            })
    }
}

function loadUserPosts(userID){
    return function (){
        if(!loading){

            loading=true
            const start = counter;
            const end = counter + quantity - 1;
            counter = end + 1;

            fetch(`/profile/${userID}/posts?start=${start}&end=${end}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    data.forEach(addPost)
                    loading = false;
                })
                .catch(error => {
                    console.log(error)
                    loading = false;
                })
        }
    }
}

function addPost(object){
    const post = document.createElement('div')
    post.className = 'post'

    post.innerHTML = `
        <div class="author">By: ${object.author}</div> 
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

function submitPost(event){
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

//auto-resize textarea (https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize)
document.addEventListener('DOMContentLoaded', () =>{
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
    }
})

function OnInput() {
    this.style.resize = 'vertical';
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
    this.style.resize = 'none';
}

function handleLikeIMG(postID){

    fetch(`posts/${postID}/like`)
    .then(response => response.json())
    .then(isLiked => {
        const likeIMG = isLiked.liked ? 'liked.svg' : 'not_liked.svg';

        console.log('likeIMG:', likeIMG)

        const likeImageElement = document.querySelector(`#post-like-img-${postID}`);
        likeImageElement.src = `../static/network/${likeIMG}`;

        console.log('adding event listener to img from post', postID)

        // likeImageElement.removeEventListener('click', likeButtonOnClick)

        likeImageElement.addEventListener('click', likeButtonOnClick(postID))

        console.log('added event listener to img from post', postID)
    })
}
function likeButtonOnClick(postID){
    return function(){
        console.log('you click the like button for post', postID)

        fetch(`posts/${postID}/like`, {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')}
        })
        .then(response => response.json())
        .then(likedStatus => {
            console.log(likedStatus)

            const numField = document.querySelector(`#post-like-count-${postID}`)
            let likes;
            let likeIMG;
            if(likedStatus.liked){
                likeIMG = 'liked.svg'
                likes = 1;
            } else{
                likeIMG = 'not_liked.svg'
                likes = -1;
            }

            const likeImageElement = document.querySelector(`#post-like-img-${postID}`);
            likeImageElement.src = `../static/network/${likeIMG}`;

            numField.innerHTML = parseInt(numField.innerHTML) + likes;
        })
    }
}