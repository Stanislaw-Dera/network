import {addPost} from "./post-handling.js";

export let counter = 0;
export const quantity = 10;

export let pageCounter = 0;
export let loading = false;

export function setPageCounter(num){
    counter = num;
}

export function load(){
     if(!loading){

        loading=true;
        pageCounter++;

        fetch(`/posts?page=${pageCounter}`)
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

export function loadUserPosts(userID){
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

export function loadFollowingPosts(){
    if(!loading){
        loading=true;
        const start = counter;
        const end = counter + quantity - 1;
        counter = end + 1;

        fetch(`/following?start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.forEach(addPost)
            loading = false;
        })
    }
}
