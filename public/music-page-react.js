
var Url = "http://ec2-54-175-173-62.compute-1.amazonaws.com:3000";

var currentArtist = void 0;
var currentAlbum = void 0;

function getMusicList() {

	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url,
			type: "GET",
			success: function success(result) {
				console.log("GET Resonse: ");
				console.log(result);
				resolve(result);
			},
			error: function error(_error) {
				console.log("Error " + _error);
				reject(_error);
			}
		});
	});
	return promise1;
}

function manualUpdate() {
	getMusicList().then(function (musicList) {
		if (musicList != null) {
			updateMusicTable(musicList);
		}
	}).catch(function (error) {
		console.log(error);
	});
}

function updateMusicTable(artistObject) {
	var artistArray = Object.entries(artistObject);
	console.log(artistArray);

	for (var artist in artistObject) {
		console.log(artistObject[artist]);
	}

	var music = artistArray.map(function (artist) {
		return React.createElement(ArtistEntry, { artist: artist[0], albumNames: artist[1].albumNames, albums: artist[1].albums });
	});

	ReactDOM.render(music, categoryList);
}

manualUpdate();

function ArtistEntry(props) {
	function selectArist() {
		currentArtist = props.artist;
		//manualUpdate();
	}
	console.log(props.albumNames);

	var albumList = props.albumNames.map(function (album) {
		function doShowAlbum() {
			currentAlbum = album;
			showAlbum(album, props.albums[album]);
		}
		return React.createElement(
			"li",
			{ key: album },
			React.createElement(
				"a",
				{ href: "#", onClick: doShowAlbum },
				album
			)
		);
	});

	return React.createElement(
		"div",
		{ onClick: selectArist, className: "cat-card mdl-card mdl-shadow--2dp", key: props.artist },
		React.createElement(
			"h5",
			{ style: { marginLeft: '14px' } },
			props.artist
		),
		React.createElement(
			"ul",
			null,
			albumList
		)
	);
}

function showAlbum(albumName, album) {
	console.log('Album: ');
	console.log(album);
	var songList = album.map(function (song) {
		console.log('Song: ' + song.title);
		return React.createElement(
			"li",
			{ className: "mdl-list__item", key: song.path },
			React.createElement(
				"span",
				{ className: "mdl-list__item-primary-content" },
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
			albumName
		),
		React.createElement(
			"ul",
			{ className: "song-list mdl-list" },
			songList
		)
	);

	var albumDisplay = document.getElementById('album-display');
	ReactDOM.render(albumElement, albumDisplay);
}

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