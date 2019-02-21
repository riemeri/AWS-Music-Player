
//Server URL
var Url = "http://3.88.49.153:3000";

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
	getGenres().then(function (data) {
		console.log("Genres: " + data);
	});
	getArtistOfGenre('Rock').then(function (data) {
		console.log("Artists in genre 'Rock': ");
		console.log(data);
	});
	getAlbumsOfArtist('Van Halen').then(function (data) {
		console.log("Albums by 'Van Halen': ");
		console.log(data);
	});
	getSongsOfAlbum('The Best of Both Worlds').then(function (data) {
		console.log("Songs in 'The Best of Both Worlds': ");
		console.log(data);
	});
	return promise1;
}

function getGenres() {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/genres",
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error2) {
				console.log("GET Error " + _error2);
				reject(_error2);
			}
		});
	});
	return promise1;
}

function getArtistOfGenre(genre) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/artists/for/genre?genre=" + genre,
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error3) {
				console.log("GET Error " + _error3);
				reject(_error3);
			}
		});
	});
	return promise1;
}

function getAlbumsOfArtist(artist) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/albums/for/artist?artist=" + artist,
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error4) {
				console.log("GET Error " + _error4);
				reject(_error4);
			}
		});
	});
	return promise1;
}

function getSongsOfAlbum(album) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/songs/for/album?album=" + album,
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error5) {
				console.log("GET Error " + _error5);
				reject(_error5);
			}
		});
	});
	return promise1;
}

function getSong(song) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/song?song=" + song,
			type: "GET",
			success: function success(result) {
				resolve(result);
			},
			error: function error(_error6) {
				console.log("GET Error " + _error6);
				reject(_error6);
			}
		});
	});
	return promise1;
}

function getSongUrlInAlbum(Song, Album) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/song/in/album",
			type: "GET",
			data: {
				song: Song,
				album: Album
			},
			success: function success(result) {
				//console.log("GET Resonse: ")
				//console.log(result);
				resolve(result);
			},
			error: function error(_error7) {
				console.log("GET Error " + _error7);
				reject(_error7);
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
			getSongUrlInAlbum(song.title, albumName).then(function (url) {
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
				if (typeof result == 'string' && result.includes("Error")) {
					snackbarToast(result);
					reject(result);
				} else {
					resolve(result);
				}
			},
			error: function error(_error8) {
				console.log("Error " + _error8);
				reject(_error8);
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