var player;
var tag = document.createElement('script');
tag.id = 'cd-youtube-tag';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('cd-youtube', {
        events: {
            'onReady': onPlayerReady,
            'onAutoplayBlocked ': onPlayerBlock,
            'onStateChange':(event) => {
                if (event.data == YT.PlayerState.ENDED) {
                    console.log('The video has ended');
                    toggleRotation();
                }
            }
        }
    });
}

function onPlayerReady(event) {
    console.log('The video is ready');
    event.target.playVideo();
}

function onPlayerBlock(event) {
    console.log('The video is blocked');
}

function toggleCD() {
    let state = player.getPlayerState();    
    if (state == 1) {
        console.log('Pause the video');
        player.pauseVideo();
    } else {
        console.log('Play the video');
        player.playVideo();        
    }
    toggleRotation();
}

// Function to toggle the rotation class
let isRotating = false;
var currentAngle = 0;
const cdImg = document.querySelector('.cd-img');

function toggleRotation() {    
    const rotateTime = 5
    if (isRotating) {
        console.log('Stop rotation');
        const computedStyle = window.getComputedStyle(cdImg);
        const matrix = new WebKitCSSMatrix(computedStyle.transform);
        currentAngle = Math.round(Math.atan2(matrix.m21, matrix.m11) * (-180 / Math.PI));
        cdImg.style.transform = `rotate(${currentAngle}deg)`;
        cdImg.style.animation = 'none';
        console.log('currentAngle', currentAngle);
        cdImg.style.setProperty('--start-deg', `0deg`);
    } else {        
        console.log('Start rotation');
        cdImg.style.animation = `rotate var(--rotation-duration, ${rotateTime}s) linear infinite`;
        cdImg.style.setProperty('--start-deg', `${currentAngle}deg`);
        const remainingDuration = ((360 - currentAngle) / 360) * rotateTime;
        cdImg.style.setProperty('--rotation-duration', `${remainingDuration}s`);
        console.log('currentAngle', currentAngle);        
    }
    isRotating = !isRotating;
}

function resetStartDeg() {    
    cdImg.style.setProperty('--start-deg', '');
    cdImg.style.setProperty('--rotation-duration', '');
}

// Add an event listener to reset the --start-deg variable when the animation completes
document.querySelector('.cd-img').addEventListener('animationiteration', resetStartDeg);