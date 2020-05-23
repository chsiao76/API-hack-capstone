'use strict';

function watchForm() {
  $('form').submit(function(event) {
    console.log('Submit working') 
    event.preventDefault() ;
    $('#js-taskError-message').empty();
    $('#js-videoError-message').empty();
    getTask();
    });
  }

function getTask() {
  console.log('getTask');
  fetch('https://www.boredapi.com/api/activity/')
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => 
      displayTaskResults(responseJson))
    .catch(err => {
      console.dir(err);
      $('#js-taskError-message').text("Oh no something went wrong!! Looks like you'll be bored forever :(");
    });
  };

function displayTaskResults(responseJson) {
  //console.log(responseJson);
  $('.results-list').empty();
  $('.results-list').append(
    '<h3>'+responseJson.activity.toUpperCase()+'</h3>',
    '<li>Participants: '+responseJson.participants+'</li>',
    '<li>Type: '+responseJson.type.charAt(0).toUpperCase()+responseJson.type.slice(1)+'</li>',
    '<li>Accessibility: '+responseJson.accessibility+'</li>'
    );
  $('.results').removeClass('hidden');

  const searchPhrase = responseJson.activity ;
  console.log(searchPhrase);
  getVideos(searchPhrase);
};

function getVideos(searchPhrase) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchPhrase.replace(/ /g, '+')}&key=AIzaSyD8Ih1gae_PGKZLiDvhSILo2fEzsgzr1Uk`
  fetch(url)
    .then(response => {
      console.log(`Success hitting youtube api`);
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => 
      displayVideoResults(responseJson))
    .catch(err => {
      console.dir(err);
      $('#js-videoError-message').text("No videos available");
    });
};


function displayVideoResults(responseJson) {
  console.log(responseJson)
  $('.video-results-list').empty();
  for (let i = 0; i < 5; i++) {
    $('.video-results-list').append(
      '<li class="video-results"><a target="_blank" href=' + '"http://www.youtube.com/watch?v=' + responseJson.items[i].id.videoId + '">' + responseJson.items[i].snippet.title.toUpperCase() + '</a></li>',
      '<a class="thumbnail" target="_blank" href="http://www.youtube.com/watch?v=' + responseJson.items[i].id.videoId + '">' +
      '<img alt="Video Resource" src="'+responseJson.items[i].snippet.thumbnails.default.url+'">'+
      '</a>'
    ); 
  }
};



$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});
