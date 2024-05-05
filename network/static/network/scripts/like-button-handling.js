export function handleLikeIMG(postID){

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
export function likeButtonOnClick(postID){
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