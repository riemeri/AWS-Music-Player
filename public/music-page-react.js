
//Server URL
var Url = "http://3.88.49.153:3000";

var currentArtist = null;
var selectedAlbum = void 0;
var playingAlbum = void 0;
var currentMusicList = null;
var currentGenre = null;
var currentSong = null;
var currentSongs = [];
var songNumber = 0;
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
		updateCategoryTable();
	} else {
		// No user is signed in.
		window.location.href = "http://aws-web-hosting16.s3-website-us-east-1.amazonaws.com";
		//updateCategoryTable();
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

function updateCategoryTable() {
	getGenres().then(function (genres) {
		console.log(genres);
		var reactElement = genres.map(function (genre) {
			function doShowGenre() {
				currentGenre = genre;
				showGenre(genre);
			}

			return React.createElement(
				"li",
				{ className: "genre-item mdl-list__item", key: genre },
				React.createElement(
					"button",
					{ onClick: doShowGenre, className: "album-button mdl-button mdl-js-button mdl-js-ripple-effect" },
					genre
				)
			);
		});

		var genreList = document.getElementById('genre-list');
		ReactDOM.render(reactElement, genreList);
	});
}

function showGenre(genre) {
	getArtistOfGenre(genre).then(function (artists) {
		var artistList = artists.map(function (artist) {
			function getArtist() {
				currentArtist = artist;
				showArtist(artist);
			}

			return React.createElement(
				"li",
				{ className: "list-item mdl-list__item", key: artist },
				React.createElement(
					"button",
					{ onClick: getArtist, className: "song-button mdl-button mdl-js-button mdl-js-ripple-effect" },
					artist
				)
			);
		});

		var reactElement = React.createElement(
			"div",
			{ key: genre + "-page" },
			React.createElement(
				"span",
				{ className: "mdl-card__title-text" },
				genre + " Artists"
			),
			React.createElement(
				"ul",
				{ className: "song-list mdl-list mdl-card__actions mdl-card--border" },
				artistList
			)
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}

function showArtist(artist) {
	getAlbumsOfArtist(artist).then(function (albums) {
		var albumList = albums.map(function (album) {
			function getAlbum() {
				selectedAlbum = album;
				showAlbum(album, artist);
			}

			return React.createElement(
				"li",
				{ className: "list-item mdl-list__item", key: album },
				React.createElement(
					"button",
					{ onClick: getAlbum, className: "song-button mdl-button mdl-js-button mdl-js-ripple-effect" },
					album
				)
			);
		});

		function goBack() {
			showGenre(currentGenre);
		}

		var reactElement = React.createElement(
			"div",
			{ key: artist + "-page" },
			React.createElement(
				"button",
				{ onClick: goBack, className: "back-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" },
				React.createElement(
					"i",
					{ className: "material-icons" },
					"arrow_back"
				)
			),
			React.createElement(
				"span",
				{ className: "mdl-card__title-text" },
				artist + " Albums"
			),
			React.createElement(
				"ul",
				{ className: "song-list mdl-list mdl-card__actions mdl-card--border" },
				albumList
			)
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}

function showAlbum(album, artist) {
	getSongsOfAlbum(album).then(function (songs) {
		var songList = songs.map(function (song, index) {
			function playSong() {
				songNumber = index;
				currentSongs = songs;
				playSongFromAlbum(song, album);
			}

			return React.createElement(
				"li",
				{ className: "list-item mdl-list__item", key: song },
				React.createElement(
					"button",
					{ onClick: playSong, className: "song-button mdl-button mdl-js-button mdl-js-ripple-effect" },
					React.createElement(
						"i",
						{ className: "material-icons mdl-list__item-icon", style: { marginRight: '18px' } },
						"library_music"
					),
					song
				)
			);
			i += 1;
		});

		function goBack() {
			showArtist(currentArtist);
		}

		var reactElement = React.createElement(
			"div",
			{ key: album + "-page" },
			React.createElement(
				"button",
				{ onClick: goBack, className: "back-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" },
				React.createElement(
					"i",
					{ className: "material-icons" },
					"arrow_back"
				)
			),
			React.createElement(
				"span",
				{ className: "mdl-card__title-text" },
				album + " - " + artist
			),
			React.createElement(
				"ul",
				{ className: "song-list mdl-list mdl-card__actions mdl-card--border" },
				songList
			)
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}

function playSongFromAlbum(song, albumName) {
	getSongUrlInAlbum(song, albumName).then(function (url) {
		musicPlayer.src = url;
		musicPlayer.load();
		musicLabel.innerHTML = song;
		currentSong = song;
		playingAlbum = albumName;
		musicPlayer.play();
	}).catch(function (error) {
		snackbarToast("Couldn't load file");
		console.log(error);
	});
}

musicPlayer.onended = function () {
	if (currentSongs.length > songNumber + 1) {
		songNumber += 1;
		var nextSong = currentSongs[songNumber];
		playSongFromAlbum(nextSong, playingAlbum);
	}
};

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