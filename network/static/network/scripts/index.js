import {submitPost} from "./post-handling.js";
import {setPageCounter, loadPosts, loadUserPosts, loadFollowingPosts} from "./loadingPosts.js";

//export {loadUserProfile}

document.addEventListener('DOMContentLoaded', () => {

    fetch('/get_current_user')
    .then(response => response.json())
    .then(data => {
        document.querySelector('#post-button').addEventListener('click', submitPost)
        document.querySelector("#user-profile").addEventListener('click', loadUserProfile(data.current_user_id))
        document.querySelector('#following').addEventListener('click', loadFollowing)
    }).catch(error => {
        console.log(error)
    })

    document.querySelector("#all-posts").addEventListener('click', loadIndex)

    // by default, load index page (all posts)
    loadIndex();
})

function loadIndex(){
    console.log('loadIndex')
    setPageCounter(1);
    document.querySelector('#profile').style.display = 'none'
    document.querySelector('#create-post').style.display = 'grid'
    document.querySelector('#posts').style.display = 'block'

    document.querySelector('#posts').innerHTML = ''

    loadPosts();
}

function loadFollowing(){
    setPageCounter(1);
    document.querySelector('#profile').style.display = 'none'
    document.querySelector('#create-post').style.display = 'none'
    document.querySelector('#posts').style.display = 'block'

    document.querySelector('#posts').innerHTML = '<h1>Following</h1>'

    loadFollowingPosts();
}

export function loadUserProfile(userID){
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
                <div id="profile-following">Following: ${userData.following_count}</div>
                <div id="profile-follow-button"></div>`
            })
            .then(() => {
                console.log('loadUserProfile')
                setPageCounter(1);
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
            .then(() => {
                fetch(`profile/${userID}/follow`)
                .then(response => response.json())
                .then(data => {
                    const followButton  = document.createElement('button')

                    if(data.following === 'It\'s your profile!'){
                        console.log('your profile!')
                    } else {
                        if(data.following === true){
                            followButton.className = 'btn btn-light'
                            followButton.innerHTML = 'unfollow'
                        } else if (data.following === false) {
                            followButton.className = 'btn btn-dark'
                            followButton.innerHTML = 'follow'
                        }
                        followButton.addEventListener('click', follow(userID))
                        document.querySelector('#profile-follow-button').append(followButton)
                    }
                })
            })
            .catch(error => {
                console.log(error)
                loadIndex()
            })
    }
}

function follow (userID){
    return function () {
        fetch(`/profile/${userID}/follow`, {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')}
        }).then(response => response.json())
        .then(data => {
            console.log(data)

            const button = document.querySelector('#profile-follow-button').querySelector('button')
            const followers = document.querySelector('#profile-followers')

            let number = parseInt(followers.innerHTML.match(/\d+/)[0])

            if (data.following){
                button.innerHTML = 'unfollow'
                button.className = 'btn btn-light'

                followers.innerHTML = `followers: ${number + 1}`
            } else {
                button.innerHTML = 'follow'
                button.className = 'btn btn-dark'

                followers.innerHTML = `followers: ${number - 1}`
            }
        })
    }
}

//django's function
export function getCookie(name) {
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