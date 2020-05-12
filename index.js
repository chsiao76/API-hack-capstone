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
  fetch('http://www.boredapi.com/api/activity/')
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
    })

    .then(responseJson => 
      displayTaskResults(responseJson))
    .catch(err => {
      $('#js-taskError-message').text("Oh no something went wrong!! Looks like you'll be bored forever :(");
    });
  };

function displayTaskResults(responseJson) {
  console.log(responseJson);
  $('.results-list').empty();
  $('.results-list').append(
    '<h3>'+responseJson.activity+'</h3>',
    '<li>Participants: '+responseJson.participants+'</li>',
    '<li>Type: '+responseJson.type+'</li>',
    '<li>Price: '+responseJson.price+'</li>',
    '<li>Accessibility: '+responseJson.accessibility+'</li>'
    );
  $('.results').removeClass('hidden');

  const searchPhrase = responseJson.activity ;
  console.log(searchPhrase);
  getVideos(searchPhrase);
};

/*function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => '${encodeURIComponent(key)}=${encodeURIComponent(params[key])}')
  return queryItems.join('&');
} ;

function getVideos(searchPhrase) {
  const params = {
    part: snippet,
    api_key: AIzaSyBcXbNUU1Q8RmBsUGBaUlVoHCXpp00p2Qo,
    q: searchPhrase,
    maxResults: 5,
  };
  const queryString = formatQueryParams(params) ;
  console.log(queryString) ;
  const url = 'https://www.googleapis.com/youtube/v3/search'+ '?' + queryString;
  console.log(url);
};
*/

function getVideos(searchPhrase) {
  const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + searchPhrase.split(' ').join('') + '&key=AIzaSyBcXbNUU1Q8RmBsUGBaUlVoHCXpp00p2Qo' ;
  console.log(url) ;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => 
      displayVideoResults(responseJson))
    .catch(err => {
      $('#js-videoError-message').text("No videos available");
    });
};


function displayVideoResults(responseJson) {
  console.log(responseJson) ;
  console.log(responseJson.items[0].id.videoId);
  $('.video-results-list').empty();
  for (i = 0; i < 6; i++) {
    $('.video-results-list').append(
      '<li><a href=' + '"http://www.youtube.com/watch?v=' + responseJson.items[i].id.videoId + '">Video</a></li>,'
    )}; 
};



$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});


