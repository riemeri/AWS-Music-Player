
//Server URL
const Url = "http://3.88.49.153:3000";

let currentArtist = null;
let playingArtist = null;
let selectedAlbum;
let playingAlbum;
let currentMusicList = null;
let currentGenre = null;
let currentSong = null;
let currentSongs = [];
let songNumber = 0;
let musicPlayer = document.getElementById("music-player");
let musicLabel = document.getElementById("music-label");
let playbackSlider = document.getElementById("playback-slider");
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
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		curUser = user;
		updateCategoryTable();
	} else {
		// No user is signed in.
		window.location.href = "http://aws-web-hosting16.s3-website-us-east-1.amazonaws.com";
		//updateCategoryTable(); //for testing
	}
});

//Logout user (which triggers an auth state change, returning the user to the login page
let logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', (ev) => { 
	firebase.auth().signOut().then(() => {
	}).catch(err => {
		alert('Error: ' + err.message);
		console.log(error);
	});
}, false);

function getMusicList() {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url,
			type:"GET",
			success: function(result) {
				//console.log("GET Resonse: ")
				//console.log(result);
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function getGenres() {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/genres",
			type:"GET",
			data: {
				uid: curUser.uid
			},
			success: function(result) {
				resolve(result);
			},
			error: function(err){
				console.log(`GET Error:`);
				console.log(err);
				reject(error);
			}
		});
	});
	return promise1;
}

function getArtistOfGenre(genre) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/artists/for/genre?genre=" + genre,
			type:"GET",
			success: function(result) {
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function getAlbumsOfArtist(artist) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/albums/for/artist?artist=" + artist,
			type:"GET",
			success: function(result) {
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function getSongsOfAlbum(album) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/songs/for/album?album=" + album,
			type:"GET",
			success: function(result) {
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function getSong(song) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/song?song=" + song,
			type:"GET",
			data: {
				uid: curUser.uid
			},
			success: function(result) {
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function getSongUrlInAlbum(Song, Album) {
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url + "/song/in/album",
			type:"GET",
			data: {
				song: Song,
				album: Album,
				uid: curUser.uid
			},
			success: function(result) {
				//console.log("GET Resonse: ")
				//console.log(result);
				resolve(result);
			},
			error: function(error){
				console.log(`GET Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function postSongPlay(artist, album, song) {
	console.log("POST for song: " + song);
	$.ajax({
		type:"POST",
		url: "http://3.88.49.153:3000/play",
		data: {
			artist: artist,
			album: album,
			song: song
		},
		success: function(result) {
			console.log(result);
		},
		error: function(error){
			console.log(`POST Error ${error}`);
		}
	});
}

function updateCategoryTable() {
	getGenres().then(function(genres) {
		const reactElement = genres.map((genre) => {
			function doShowGenre() {
				currentGenre = genre;
				showGenre(genre);
			}
			
			return <li className="genre-item mdl-list__item" key={genre}>
				<button onClick={doShowGenre} className="album-button mdl-button mdl-js-button mdl-js-ripple-effect">
					{genre}
				</button>
			</li>
		});
		
		var genreList = document.getElementById('genre-list');
		ReactDOM.render(reactElement, genreList);
	});
}

function showGenre(genre) {
	getArtistOfGenre(genre).then(function(artists) {
		const artistList = artists.map((artist) => {
			function getArtist() {
				currentArtist = artist;
				showArtist(artist);
			}

			return (
				<li className="list-item mdl-list__item" key={artist}>
					<button onClick={getArtist} className="song-button mdl-button mdl-js-button mdl-js-ripple-effect">
						{artist}
					</button>
				</li>
			)
		});
		
		const reactElement = (
			<div key={genre + "-page"}>
				<span className="mdl-card__title-text">{genre + " Artists"}</span>
				<ul className="song-list mdl-list mdl-card__actions mdl-card--border">
					{artistList}
				</ul>
			</div>	
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}

function showArtist(artist) {
	getAlbumsOfArtist(artist).then(function(albums) {
		const albumList = albums.map((album) => {
			function getAlbum() {
				selectedAlbum = album;
				showAlbum(album, artist);
			}

			return (
				<li className="list-item mdl-list__item" key={album}>
					<button onClick={getAlbum} className="song-button mdl-button mdl-js-button mdl-js-ripple-effect">
						{album}
					</button>
				</li>
			)
		});

		function goBack() {
			showGenre(currentGenre);
		}
		
		const reactElement = (
			<div key={artist + "-page"}>
				<button onClick={goBack} className="back-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored">
					<i className="material-icons">arrow_back</i>
				</button>
				<span className="mdl-card__title-text">{artist + " Albums"}</span>
				<ul className="song-list mdl-list mdl-card__actions mdl-card--border">
					{albumList}
				</ul>
			</div>	
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}

function showAlbum(album, artist) {
	getSongsOfAlbum(album).then(function(songs) {
		const songList = songs.map((song, index) => {
			function playSong() {
				songNumber = index;
				currentSongs = songs;
				playSongFromAlbum(artist, album, song);
			}

			return (
				<li className="list-item mdl-list__item" key={song}>
					<button onClick={playSong} className="song-button mdl-button mdl-js-button mdl-js-ripple-effect">
						<i className="material-icons mdl-list__item-icon" style={{marginRight: '18px'}}>library_music</i>
						{song}
					</button>
				</li>
			)
			i += 1;
		});

		function goBack() {
			showArtist(currentArtist);
		}
		
		const reactElement = (
			<div key={album + "-page"}>
				<button onClick={goBack} className="back-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored">
					<i className="material-icons">arrow_back</i>
				</button>
				<span className="mdl-card__title-text">{album + " - " + artist}</span>
				<ul className="song-list mdl-list mdl-card__actions mdl-card--border">
					{songList}
				</ul>
			</div>	
		);

		var mainDisplay = document.getElementById('main-display');
		ReactDOM.render(reactElement, mainDisplay);
	});
}


function playSongFromAlbum(artist, albumName, song) {
	getSongUrlInAlbum(song, albumName).then((url) => {
		musicPlayer.src = url;
		musicPlayer.load();
		musicLabel.innerHTML = song;
		currentSong = song;
		playingArtist = artist;
		playingAlbum = albumName;
		musicPlayer.play();
		postSongPlay(artist, albumName, song);
	})
	.catch(function(error) {
		snackbarToast("Couldn't load file");
		console.log(error);
	});
}

musicPlayer.onended = function() {
	if (currentSongs.length > songNumber + 1) {
		songNumber += 1;
		var nextSong = currentSongs[songNumber];
		playSongFromAlbum(playingArtist, playingAlbum, nextSong);
	}
};

function getSongUrl(songPath) {
	var songUrl = Url + '/' + songPath;
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: songUrl,
			type:"GET",
			success: function(result) {
				if (typeof result == 'string' && result.includes("Error")) {
					snackbarToast(result);
					reject(result);
				}
				else {
					resolve(result);
				}
			},
			error: function(error){
				console.log(`Error ${error}`);
				reject(error);
			}
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
