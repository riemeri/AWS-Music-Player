
var Url = "http://ec2-54-175-173-62.compute-1.amazonaws.com:3000";

var currentArtist = null;
var currentAlbum = void 0;
var currentMusicList = null;
var musicPlayer = document.getElementById("music-player");
var musicLabel = document.getElementById("music-label");
var playbackSlider = document.getElementById("playback-slider");
var clicked = false;

function getMusicList() {

	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url,
			type: "GET",
			success: function success(result) {
				//console.log("GET Resonse: ")
				//console.log(result);
				resolve(result);
			},
			error: function error(_error) {
				console.log("GET Error " + _error);
				reject(_error);
			}
		});
	});
	return promise1;
}

function manualUpdate() {
	getMusicList().then(function (musicList) {
		if (musicList != null) {
			currentMusicList = musicList;
			updateMusicTable(musicList);
		}
	}).catch(function (error) {
		console.log(error);
	});
}

function quickUpdate() {
	if (currentMusicList != null) {
		updateMusicTable(currentMusicList);
	} else {
		snackbarToast("No current music list");
	}
}

function updateMusicTable(artistObject) {
	var artistArray = Object.entries(artistObject);
	//console.log(artistArray);
	if (currentArtist == null) {
		currentArtist = artistArray[0][0];
	}
	var music = artistArray.map(function (artist) {
		return React.createElement(ArtistEntry, { artist: artist[0], albumNames: artist[1].albumNames, albums: artist[1].albums });
	});

	var artistList = document.getElementById('artist-list');
	ReactDOM.render(music, artistList);
}

manualUpdate();

function ArtistEntry(props) {
	function selectArist() {
		currentArtist = props.artist;
		quickUpdate();
	}
	//console.log(props.albumNames);

	var albumList = props.albumNames.map(function (album) {
		function doShowAlbum() {
			currentAlbum = album;
			showAlbum(album, props.albums[album], props.artist);
		}
		return React.createElement(
			"li",
			{ className: "list-item mdl-list__item", key: album },
			React.createElement(
				"button",
				{ onClick: doShowAlbum, className: "album-button mdl-button mdl-js-button mdl-js-ripple-effect" },
				album
			)
		);
	});

	if (props.artist == currentArtist) {
		return React.createElement(
			"div",
			{ className: "cat-card mdl-card mdl-shadow--2dp", key: props.artist },
			React.createElement(
				"h5",
				{ style: { marginLeft: '14px' } },
				props.artist
			),
			React.createElement(
				"div",
				{ className: "mdl-card__actions mdl-card--border" },
				React.createElement(
					"ul",
					{ className: "album-list" },
					albumList
				)
			)
		);
	} else {
		return React.createElement(
			"div",
			{ onClick: selectArist, className: "cat-card mdl-card mdl-shadow--2dp", style: { cursor: 'pointer' }, key: props.artist },
			React.createElement(
				"h5",
				{ style: { margin: '19px 14px' } },
				props.artist
			)
		);
	}
}

function showAlbum(albumName, album, artist) {
	var songList = album.map(function (song) {
		function playSong() {
			getSongUrl(song.path).then(function (url) {
				musicPlayer.src = url;
				musicPlayer.load();
				musicLabel.innerHTML = song.title;
				musicPlayer.play();
			}).catch(function (error) {
				snackbarToast("Couldn't load file");
				console.log(error);
			});
		}

		return React.createElement(
			"li",
			{ className: "list-item mdl-list__item", key: song.path },
			React.createElement(
				"button",
				{ onClick: playSong, className: "song-button mdl-button mdl-js-button mdl-js-ripple-effect" },
				React.createElement(
					"i",
					{ className: "material-icons mdl-list__item-icon", style: { marginRight: '18px' } },
					"library_music"
				),
				song.title
			)
		);
	});

	var albumElement = React.createElement(
		"div",
		{ key: albumName },
		React.createElement(
			"span",
			{ className: "mdl-card__title-text" },
			albumName + " - " + artist
		),
		React.createElement(
			"ul",
			{ className: "song-list mdl-list mdl-card__actions mdl-card--border" },
			songList
		)
	);

	var songDisplay = document.getElementById('song-display');
	ReactDOM.render(albumElement, songDisplay);
}

function getSongUrl(songPath) {
	var songUrl = Url + '/' + songPath;
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: songUrl,
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error2) {
				console.log("Error " + _error2);
				reject(_error2);
			}
		});
	});
	return promise1;
}

//Custom playback slider stuff
/*musicPlayer.ontimeupdate = function() {updateSlider()};

function updateSlider() {
	if (clicked == false) {
		playbackSlider.MaterialSlider.change(musicPlayer.currentTime);
	}
}

musicPlayer.ondurationchange = function() {
	playbackSlider.max = musicPlayer.duration;
	snackbarToast("Duration: " + musicPlayer.duration);
};

playbackSlider.addEventListener('change', (ev) => {
	musicPlayer.currentTime = playbackSlider.value;
});

playbackSlider.addEventListener('seeking', (ev) => {
	musicPlayer.currentTime = playbackSlider.value;
});

playbackSlider.addEventListener('mousedown', (ev) => {
	clicked = true;
});
playbackSlider.addEventListener('mouseup', (ev) => {
	clicked = false;
});
*/

function snackbarToast(toast) {
	var snackbar = document.getElementById('music-snackbar');
	snackbar.MaterialSnackbar.showSnackbar({
		message: toast
	});
}

/*var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;
var db = firebase.database();
var storageRef = firebase.storage().ref();
var imgElements = [];*/