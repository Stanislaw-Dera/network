import {addPost} from "./post-handling.js";

export let pageCounter = 1;
export let loading = false;

export function setPageCounter(num){
    pageCounter = num;
}

function postsAndPagination(object){

    const posts = object.posts
    console.log(posts)

    document.querySelector('#posts').innerHTML = ''

    posts.forEach(addPost)



    const hasNext = object.hasNext
    const hasPrevious = object.hasPrevious

    const paginationElement = document.querySelector('#pagination')
    paginationElement.innerHTML = `<ul class="pagination">
        <li class="page-item ${hasPrevious ? '' : 'disabled'}"><a class="page-link" href="#" id="previous">Previous</a></li>
        <li class="page-item ${hasNext ? '' : 'disabled'}"><a class="page-link" href="#" id="next">Next</a></li>
    </ul>`
}

export function loadPosts(){
     if(!loading){

        loading=true;

        fetch(`/posts?page=${pageCounter}`)
            .then(response => response.json())
            .then(data => {
                postsAndPagination(data)

                document.querySelector('#previous').addEventListener('click', () => {
                    pageCounter--;
                    loadPosts();
                })
                document.querySelector('#next').addEventListener('click', () => {
                    pageCounter++;
                    loadPosts();
                })

                loading = false;
            })
            .catch(error => {
                console.log(error)
                loading = false;
            })
    }
}

export function loadUserPosts(userID){
    return function (){
        if(!loading){

            fetch(`/profile/${userID}/posts?page=${pageCounter}`)
                .then(response => response.json())
                .then(data => {
                    postsAndPagination(data)

                    document.querySelector('#previous').addEventListener('click', () => {
                        pageCounter--;
                        loadUserPosts(userID);
                    })
                    document.querySelector('#next').addEventListener('click', () => {
                        pageCounter++;
                        loadUserPosts(userID);
                    })
                    loading = false;
                })
                .catch(error => {
                    console.log(error)
                    loading = false;
                })
        }
    }
}

export function loadFollowingPosts(){
    if(!loading){
        loading=true;

        fetch(`/following?page=${pageCounter}`)
        .then(response => response.json())
        .then(data => {
            postsAndPagination(data)

            document.querySelector('#previous').addEventListener('click', () => {
                pageCounter--;
                loadFollowingPosts();
            })
            document.querySelector('#next').addEventListener('click', () => {
                pageCounter++;
                loadFollowingPosts();
            })
            loading = false;
        })
        .catch(error => {
            console.log(error)
            loading = false;
        })
    }
}
