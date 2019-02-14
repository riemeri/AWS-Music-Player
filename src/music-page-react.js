
const Url = "http://3.88.49.153:3000";


let currentArtist = null;
let currentAlbum;
let currentMusicList = null;
let musicPlayer = document.getElementById("music-player");
let musicLabel = document.getElementById("music-label");
let playbackSlider = document.getElementById("playback-slider");
var clicked = false;


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

function manualUpdate() {
	getMusicList().then(function(musicList) {
		if (musicList != null) {
			currentMusicList = musicList;
			updateMusicTable(musicList);
		}
	})
	.catch(function(error) {
		console.log(error);
	});
}

function quickUpdate() {
	if (currentMusicList != null) {
		updateMusicTable(currentMusicList);
	}
	else {
		snackbarToast("No current music list");
	}
}

function updateMusicTable(artistObject) {
	var artistArray = Object.entries(artistObject);
	//console.log(artistArray);
	if (currentArtist == null) {
		currentArtist = artistArray[0][0];
	}
	const music = artistArray.map((artist) => {
		return <ArtistEntry artist={artist[0]} albumNames={artist[1].albumNames} albums={artist[1].albums}/>;
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

	const albumList = props.albumNames.map((album) => {
		function doShowAlbum() {
			currentAlbum = album;
			showAlbum(album, props.albums[album], props.artist);
		}
		return (
			<li className="list-item mdl-list__item" key={album}>
				<button onClick={doShowAlbum} className="album-button mdl-button mdl-js-button mdl-js-ripple-effect">
					{album}
				</button>
			</li> )
	});

	if (props.artist == currentArtist) {
		return (
			<div className="cat-card mdl-card mdl-shadow--2dp" key={props.artist}>
				<h5 style={{marginLeft: '14px'}}>{props.artist}</h5>
				<div className="mdl-card__actions mdl-card--border">
					<ul className="album-list">{albumList}</ul>
				</div>
			</div>
		);
	}
	else {
		return (
		<div onClick={selectArist} className="cat-card mdl-card mdl-shadow--2dp" style={{cursor: 'pointer'}} key={props.artist}>
			<h5 style={{margin:'19px 14px'}}>{props.artist}</h5>
		</div>
		);
	}
}

function showAlbum(albumName, album, artist) {
	const songList = album.map((song) => {
		function playSong() {
			getSongUrl(song.path).then(function(url) {
				musicPlayer.src = url;
				musicPlayer.load();
				musicLabel.innerHTML = song.title;
				musicPlayer.play();
			})
			.catch(function(error) {
				snackbarToast("Couldn't load file");
				console.log(error);
			});
		}

		return (
			<li className="list-item mdl-list__item" key={song.path}>
				<button onClick={playSong} className="song-button mdl-button mdl-js-button mdl-js-ripple-effect">
					<i className="material-icons mdl-list__item-icon" style={{marginRight: '18px'}}>library_music</i>
					{song.title}
				</button>
			</li>
		)
	});

	const albumElement = (
		<div key={albumName}>
			<span className="mdl-card__title-text">{albumName + " - " + artist}</span>
			<ul className="song-list mdl-list mdl-card__actions mdl-card--border">
				{songList}
			</ul>
		</div>
	);

	var songDisplay = document.getElementById('song-display');
	ReactDOM.render(albumElement, songDisplay);
}

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
