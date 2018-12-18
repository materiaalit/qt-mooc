import ReduxActionAnalytics from 'redux-action-analytics';
import * as storejs from 'store';

window.loadYoutube = function() {
  var players = [];
  function onYouTubeIframeAPIReady() {
    console.log("Loading players...");
    document.querySelectorAll(".embedded-youtube-video").forEach(element => {
      var id = element.dataset.id;
      console.log(element, id);
      var newPlayer = new YT.Player(element, {
        height: "390",
        width: "640",
        videoId: id,
        events: {
          onStateChange: onPlayerStateChange,
          onPlaybackRateChange
        },
        playerVars: {
          modestbranding: true
        }
      });
      newPlayer.___youtube_identifier = id;
      players.push(newPlayer);
    });
  }
  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  initAnalytics();
  loadYoutubeLoader();
};
let analytics;
function initAnalytics() {
  analytics = new ReduxActionAnalytics(
    'https://usage.testmycode.io/api/v0/data',
    'youtube-watch-stats',
    'youtube-watch-stats',
    10000,
    () => {
      const user = storejs.get('tmc.user');
      if (user === undefined) {
        return {};
      }
      return {
        username: user.username,
      };
    });
}

function loadYoutubeLoader() {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


function onPlayerStateChange(event) {
  const player = event.target;
  const eventCode = event.data;
  const action = Object.entries(YT.PlayerState).find((o) => {
    return o[1] == eventCode
  })[0];
  logAction(action, player)
}


function onPlaybackRateChange(event) {
  const player = event.target;
  logAction("PLAYBACK_SPEED_CHANGED", player);
}

function logAction(action, player) {
  const happenedAt = new Date().getTime();
  const videoTime = player.getCurrentTime();
  const youtubeIdentifier = player.___youtube_identifier;
  const playBackRate = player.getPlaybackRate();
  const snapshot = {
    action: action,
    video_time: videoTime,
    youtube_identifier: youtubeIdentifier,
    happened_at_milliseconds: happenedAt,
    playback_speed: playBackRate,
  }
  analytics.saveAction(snapshot);
}
