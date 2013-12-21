var H5 = H5 || {};

H5.Player = function (parentElement) {
	
	var parent = document.getElementById(parentElement) ||
		document.getElementsByTagName("body")[0],
		video = document.createElement("video"),
		control = document.createElement("div"),
		playstop = document.createElement("div"),
		slider = document.createElement("canvas"),
		time = document.createElement("div");
		
	var initUI = function () {
		video.width = 640;
		video.height = 480;
		video.preload = "preload";
		control.className = "h5-player-control";
		playstop.className = "h5-player-play";
		slider.className = "h5-player-slider";
		slider.width = parent.offsetWidth;
		slider.height = 4;
		time.className = "h5-player-time";
		time.innerHTML = "00:00:00 / 00:00:00";
	}();
	
	var initLogic = function () {
		video.addEventListener("timeupdate", function () {
			drawProgress(slider, video.buffered.end(0), video.currentTime, video.duration)
		}, false);
		video.addEventListener("progress", function () {
			drawProgress(slider, video.buffered.end(0), video.currentTime, video.duration)
		}, false);
		playstop.addEventListener("click", function () {
			if (playstop.className === "h5-player-play") {
				playstop.className = "h5-player-stop";
	 			video.play();
			} else if (playstop.className === "h5-player-stop") {
				playstop.className = "h5-player-play";
				video.pause();
			}
		}, false);
	}();
	
		
	control.appendChild(slider);
	control.appendChild(playstop);
	control.appendChild(time);
	parent.appendChild(video);
	parent.appendChild(control);
	
	function drawProgress(canvas, buffered, current, total) {
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#777777";
		ctx.fillRect(0, 0, buffered / total * canvas.width, canvas.height);
		ctx.fillStyle = "#cc181e";
		ctx.fillRect(0, 0, current / total * canvas.width, canvas.height);
		time.innerHTML = secondToTime(Math.round(video.currentTime)) +
			" / " + secondToTime(Math.round(video.duration));
	}
	
	function secondToTime(seconds) {
		var hour = parseInt(seconds / 3600) || 0;
		var min = parseInt((seconds - hour * 3600) / 60) || 0;
		var sec = parseInt(seconds - hour * 3600 - min * 60) || 0;
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		return hour + ":" + min + ":" + sec;
	}
	
	this.setSize = function (w, h) {
		video.width = w;
		video.height = h;
	}
		
	this.load = function (src) {
		video.src = src;
	}
}