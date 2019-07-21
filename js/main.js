let player;

const requestURI = 'https://www.googleapis.com/youtube/v3/search'
const API_KEY = 'AIzaSyBYxccY1ZVsqPLxwGrYQlYp1Y2HCWwetAw'
const SEARCH_DELAY = 2000
let searchTerm = 'origami'
let maxResults = 5
let requestType = 'snippet' // 'id'
let request

const searchElem = document.getElementById('SearchElem')
const resultsElem = document.getElementById('ResultsElem')

let iframeAPIReady = false
let createdIframe = false

let lastRequestTime = 0
let requestComplited = true

function onYouTubeIframeAPIReady() {
  iframeAPIReady = true
  // player = new YT.Player('player', {
  //   height: '360',
  //   width: '640',
  //   videoId: 'M7lc1UVf-VE',
  //   playerVars: { 'autoplay': 1/*, 'controls': 0*/ },
  //   events: {
  //     'onReady': onPlayerReady,
  //     'onStateChange': onPlayerStateChange
  //   }
  // });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  console.log(player.getDuration())
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  console.log(event)
  console.log({duration: player.getDuration()})
  console.log({time: player.getCurrentTime()})
  if (event.data == YT.PlayerState.PLAYING) {
    // player.
  }
  if (event.data == YT.PlayerState.UNSTARTED) {
    setTimeout(()=>{console.log('play, please!');player.playVideo()}, 10000)
  }
}
function stopVideo() {
  player.stopVideo();
}

const checkAndFetchYoutube = function(){
  if(performance.now() - lastRequestTime < SEARCH_DELAY) {
    return
  }
  fetchYoutube()
}
const fetchYoutube = function() {
  requestComplited = true
  clearInterval(interval)
  request = `${requestURI}?part=${requestType}&maxResults=${maxResults}&q=${searchTerm}&key=${API_KEY}`
  console.log(request)
  fetch(request).then(response =>
    response.json().then(data => {
      resultsElem.innerHTML = ''
      data.items.filter(item => item.id.kind === 'youtube#video').map(displayResult)
    })
  )
}
const displayResult = function(item) {
  const li = document.createElement('li')
  resultsElem.appendChild(li)
  
  const header = document.createElement('h3')
  li.appendChild(header)
  header.textContent = item.snippet.title
  
  const select = document.createElement('button')
  header.appendChild(select)
  select.textContent = 'Выбрать'
  select.videoId = item.id.videoId
  
  const thumbnail = document.createElement('img')
  li.appendChild(thumbnail)
  thumbnail.src = item.snippet.thumbnails.default.url
  thumbnail.width = item.snippet.thumbnails.default.width
  thumbnail.height = item.snippet.thumbnails.default.height

  const channel = document.createElement('p')
  li.appendChild(channel)
  channel.textContent = item.snippet.channelTitle
  
  const description = document.createElement('p')
  li.appendChild(description)
  description.textContent = item.snippet.description

}

let interval
const onSearchInput = function(event) {
  searchTerm = event.target.value
  if(requestComplited) {
    requestComplited = false
    lastRequestTime = performance.now()
    interval = setInterval(checkAndFetchYoutube, 1000)
  }
  
}

const onSearchChange = function(event) {
  searchTerm = event.target.value
  fetchYoutube()
}

const onSelectResult = function(event) {
  if(event.target.nodeName === "BUTTON") {
    if(!createdIframe) {
      createdIframe = true
      player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: event.target.videoId,
        playerVars: { 'autoplay': 1/*, 'controls': 0*/ },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    } else {
      player.loadVideoById(event.target.videoId)
    }
    // console.log('videoId', target.videoId)
  }
}



searchElem.addEventListener('change', onSearchChange)
searchElem.addEventListener('input', onSearchInput)

resultsElem.addEventListener('click', onSelectResult)
