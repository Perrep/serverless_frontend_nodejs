$(document).ready(function(){
    $('.ui.dropdown').dropdown();  
    refreshVoteCounts()
    document.getElementsByClassName("ui red button")[0].addEventListener("click", recordVote);
});

var vote_endpoint = "VOTEENTPOINT"
var get_votes_endpoint = "GETVOTEENTPOINT"

function setVotes(songName, voteCount) {
  // Get div containing vote count and set the new voteCount
  document.getElementsByName(songName)[0].innerHTML = voteCount;
}

async function refreshVoteCounts() {
    // Get the vote counts
    const response = await fetch(get_votes_endpoint);
    const songs = await response.json();
    // Iterate over all three songs and update the divs
    var i;
    for (i = 0; i < songs.length; i++){
      var featured_songs = ["coderitis", "stateless", "dynamo"];
      var song = songs[i]
      if (featured_songs.includes(song["songName"])){
        setVotes(song["songName"], song["songVote"])
      }
    }
}

async function voteForSong(songName) {
    const id_token = await auth0.getTokenSilently();
    console.log(id_token)
    const response = await fetch(vote_endpoint, {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + id_token
        },
        body: JSON.stringify({"songName": songName})
    })
    const result_json = await response.json()
    setVotes(songName, result_json["votes"])
}

function recordVote() {
  if (document.getElementsByClassName("item active selected")[0]) {
    var selectedSong = document.getElementsByClassName("item active selected")[0].getAttribute('data-value')
    if (selectedSong) {
      voteForSong(selectedSong)
      console.log("voted for " + selectedSong)
    }
  }
}