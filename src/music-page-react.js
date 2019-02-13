
const Url = "http://ec2-54-175-173-62.compute-1.amazonaws.com:3000";


let currentArtist;
let currentAlbum;

function getMusicList() {
	
	var promise1 = new Promise(function (resolve, reject) {
		$.ajax({
			url: Url,
			type:"GET",
			success: function(result) {
				console.log("GET Resonse: ")
				console.log(result);
				resolve(result);
			},
			error: function(error){
				console.log(`Error ${error}`);
				reject(error);
			}
		});
	});
	return promise1;
}

function manualUpdate() {
	getMusicList().then(function(musicList) {
		if (musicList != null) {
			updateMusicTable(musicList);
		}
	})
	.catch(function(error) {
		console.log(error);
	});
}

function updateMusicTable(artistObject) {
	var artistArray = Object.entries(artistObject);
	console.log(artistArray);

	for (var artist in artistObject) {
		console.log(artistObject[artist]);
	}
	
	const music = artistArray.map((artist) => {
		return <ArtistEntry artist={artist[0]} albumNames={artist[1].albumNames} albums={artist[1].albums}/>;
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

	const albumList = props.albumNames.map((album) => {
		function doShowAlbum() {
			currentAlbum = album;
			showAlbum(album, props.albums[album]);
		}
		return (
			<li key={album}>
				<a href="#" onClick={doShowAlbum}>{album}</a>
			</li> )
	});

	return (
		<div onClick={selectArist} className="cat-card mdl-card mdl-shadow--2dp" key={props.artist}>
			<h5 style={{marginLeft: '14px'}}>{props.artist}</h5>
			<ul>{albumList}</ul>
		</div>
	);
}

function showAlbum(albumName, album) {
	console.log('Album: ');
	console.log(album);
	const songList = album.map((song) => {
		console.log('Song: ' + song.title);
		return (
			<li className="mdl-list__item" key={song.path}>
				<span className="mdl-list__item-primary-content">
					<i className="material-icons mdl-list__item-icon" style={{marginRight: '18px'}}>library_music</i>
					{song.title}
				</span>
			</li>
		)
	});

	const albumElement = (
		<div key={albumName}>
			<span className="mdl-card__title-text">{albumName}</span>
			<ul className="song-list mdl-list">
				{songList}
			</ul>
		</div>
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
