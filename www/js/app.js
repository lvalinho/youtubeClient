var key;

$(document).ready(function(){
	key = 'AIzaSyB_LHe91InP-GBCZzSzkVrdHIUdcGPBCnM';
	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){
	
	var channel;

	if (localStorage.channel == undefined || localStorage.channel == null || localStorage.channel == ''){
		$('#popupDialog').popup();
		$('#popupDialog').popup('open');

	}
	else {
		channel = localStorage.channel;
		getPlaylist(channel);
	}

	$(document).on('click','#vidlist li', function(){
		showVideo($(this).attr('videoId'))
	});

	$('#channelBtnOK').click(function(){
		var channel = $('#channelName').val();
		$('#channelNameOptions').attr('value',channel);
		setChannel(channel);
		getPlaylist(channel);
	});

	$('#saveOptions').click(function(){
		saveOptions();
	});
	$('#clearChannel').click(function(){
		$('#channelName').attr('value','');
		document.getElementById('channelName').value = '';
		clearChannel();
	});
	$(document).on('pageinit', '#options', function(e){

		var channel =  localStorage.channel;
		var maxResult =  localStorage.maxResult;

		$('#channelNameOptions').attr('value',channel);
		$('#maxResultsOptions').attr('value',maxResult);
	});
}

function getPlaylist(channel){
	$('#vidlist').html('');
	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key: key
			},
			function(data){
				$.each(data.items, function(i, item){
					console.log(item);
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId, localStorage.maxResult);
				});
			}
		);
}

function getVideos(playlistId, maxResults){
	$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems",
			{
				part: 'snippet',
				maxResults: maxResults,
				playlistId: playlistId,
				key: key
			},
			function(data){
				console.log(data);
				var output;
				$.each(data.items, function(i, item){
					id = item.snippet.resourceId.videoId;
					title = item.snippet.title;
					thumb = item.snippet.thumbnails.default.url;
					$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'" /><h3>'+title+'</h3></li>');
					$('#vidlist').listview('refresh');
				})

			}
		);
}

function showVideo(id){
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showVideo').html(output);
}

function setChannel(channel){
	localStorage.setItem('channel', channel);
}
function setMaxResults(maxResult){
	localStorage.setItem('maxResult', maxResult);
}

function saveOptions(){
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResult = $('#maxResultsOptions').val();
	setMaxResults(maxResult);
	$('body').pagecontainer('change', '#main', (options));
	getPlaylist(channel);
}

function clearChannel(){
	localStorage.removeItem('channel');
	$('#channelNameOptions').attr('value','');
	$('#vidlist').html('');
	$('#popupDialog').popup();
	$('#popupDialog').popup('open');
}