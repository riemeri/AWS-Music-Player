
//Server URL
var Url = "http://3.88.49.153:3000";

var currentArtist = null;
var currentAlbum = void 0;
var currentMusicList = null;
var musicPlayer = document.getElementById("music-player");
var musicLabel = document.getElementById("music-label");
var playbackSlider = document.getElementById("playback-slider");
var clicked = false;
var curUser = null;

var config = {
	apiKey: "AIzaSyCVaFP23xk3rYL8dtrNGgWbzwxONonXpX0",
	authDomain: "music-auth-87594.firebaseapp.com",
	databaseURL: "https://music-auth-87594.firebaseio.com",
	projectId: "music-auth-87594",
	storageBucket: "music-auth-87594.appspot.com",
	messagingSenderId: "194541755164"
};
firebase.initializeApp(config);

//On change of auth state, get user info or return home if no one is logged in
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		curUser = user;
		//console.log(user);
		manualUpdate();
	} else {
		// No user is signed in.
		window.location.href = "http://aws-web-hosting16.s3-website-us-east-1.amazonaws.com";
	}
});

//Logout user (which triggers an auth state change, returning the user to the login page
var logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', function (ev) {
	firebase.auth().signOut().then(function () {}).catch(function (err) {
		alert('Error: ' + err.message);
		console.log(error);
	});
}, false);

function validateUser(user) {
	return true;
}

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
			error: function (_error) {
				function error(_x) {
					return _error.apply(this, arguments);
				}

				error.toString = function () {
					return _error.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
		});
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
			error: function (_error2) {
				function error(_x2) {
					return _error2.apply(this, arguments);
				}

				error.toString = function () {
					return _error2.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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
			error: function (_error3) {
				function error(_x3) {
					return _error3.apply(this, arguments);
				}

				error.toString = function () {
					return _error3.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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
			error: function (_error4) {
				function error(_x4) {
					return _error4.apply(this, arguments);
				}

				error.toString = function () {
					return _error4.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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
			error: function (_error5) {
				function error(_x5) {
					return _error5.apply(this, arguments);
				}

				error.toString = function () {
					return _error5.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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
			error: function (_error6) {
				function error(_x6) {
					return _error6.apply(this, arguments);
				}

				error.toString = function () {
					return _error6.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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
			error: function (_error7) {
				function error(_x7) {
					return _error7.apply(this, arguments);
				}

				error.toString = function () {
					return _error7.toString();
				};

				return error;
			}(function (error) {
				console.log("GET Error " + error);
				reject(error);
			})
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

function playSongFromAlbum(song, albumName) {
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
			error: function (_error8) {
				function error(_x8) {
					return _error8.apply(this, arguments);
				}

				error.toString = function () {
					return _error8.toString();
				};

				return error;
			}(function (error) {
				console.log("Error " + error);
				reject(error);
			})
		});
	});
	return promise1;
}

function snackbarToast(toast) {
	var snackbar = document.getElementById('music-snackbar');
	snackbar.MaterialSnackbar.showSnackbar({
		message: toast
	});
}