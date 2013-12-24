var H5 = H5 || {};

H5.Player = function (parentElement) {
	
	var parent = document.getElementById(parentElement) ||
		document.getElementsByTagName("body")[0],
		video = document.createElement("video"),
		control = document.createElement("div"),
		slider = document.createElement("div"),
		playstop = document.createElement("div"),
		progress = document.createElement("canvas"),
		time = document.createElement("div"),
		fullscreen = document.createElement("div");
		
	var initUI = function () {
		video.width = 640;
		video.height = 480;
		video.preload = "preload";
		control.className = "h5-player-control";
		playstop.className = "h5-player-play";
		progress.className = "h5-player-progress";
		progress.width = parent.offsetWidth;
		progress.height = 8;
		slider.className = "h5-player-slider";
		time.className = "h5-player-time";
		fullscreen.className = "h5-player-fullscreen";
	}();
		
	var initLogic = function () {
		var isDrag = false;
		var sliderMouseMove = function (e) {
			if (isDrag) {
				slider.style.left = e.clientX - parent.offsetLeft + "px";
				if (parseInt(slider.style.left) + 16 > progress.width) {
					slider.style.left = progress.width - 16 + "px";
				} else if (parseInt(slider.style.left) < 0) {
					slider.style.left = "0px";
				}
				drawProgress(progress, video.buffered.end(0), parseInt(slider.style.left), progress.width)
			}
		};
		var sliderMoveUp = function (e) {
			document.removeEventListener("mouseup", sliderMoveUp, false);
			document.removeEventListener("mousemove", sliderMouseMove, false);
			isDrag = false;
			video.currentTime = parseInt(slider.style.left) / progress.width * video.duration;
			video.play();
		}
		var sliderMouseOver = function (e) {
			slider.style.visibility = "visible";
		}
		var sliderMouseOut = function (e) {
			if (!isDrag) {
				slider.style.visibility = "hidden";
			}
		}
		var sliderMouseDown = function (e) {
			isDrag = true;
			slider.style.visibility = "visible";
			video.pause();
			document.addEventListener("mousemove", sliderMouseMove, false);
			document.addEventListener("mouseup", sliderMoveUp, false);
		}

		var videoDurationChange = function () {
			drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration);
		}
		var videoTimeUpdate = function () {
			if (!isDrag) {
				drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration)
			}
		}
		var videoProgress = function () {
			if (!isDrag) {
				drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration)
			}
		}
		var videoPlay = function () {
			playstop.className = "h5-player-stop";
		}
		var videoPause = function () {
			playstop.className = "h5-player-play";
		}

		var playStopClick = function () {
			if (playstop.className === "h5-player-play") {
				playstop.className = "h5-player-stop";
	 			video.play();
			} else if (playstop.className === "h5-player-stop") {
				playstop.className = "h5-player-play";
				video.pause();
			}
		}

		var fullScreenClick = function (e) {
			if (video.requestFullscreen) {
				video.requestFullscreen();
			} else if (video.msRequestFullscreen) {
				video.msRequestFullscreen();
			} else if (video.mozRequestFullScreen) {
				video.mozRequestFullScreen();
			} else if (video.webkitRequestFullscreen) {
				video.webkitRequestFullscreen();
			}
		}

		var progressMouseOver = function (e) {
			slider.style.visibility = "visible";
		}
		var progressMouseOut = function (e) {
			if (!isDrag) {
				slider.style.visibility = "hidden";
			}
		}

		video.addEventListener("timeupdate", videoTimeUpdate, false);
		video.addEventListener("progress", videoProgress, false);
		video.addEventListener("play", videoPlay, false);
		video.addEventListener("pause", videoPause, false);
		video.addEventListener("durationchange", videoDurationChange, false);

		playstop.addEventListener("click", playStopClick, false);

		fullscreen.addEventListener("click", fullScreenClick, false);

		progress.addEventListener("mouseover", progressMouseOver, false);
		progress.addEventListener("mouseout", progressMouseOut, false);

		slider.addEventListener("mouseover", sliderMouseOver, false);
		slider.addEventListener("mouseout", sliderMouseOut, false);
		slider.addEventListener("mousedown", sliderMouseDown, false);
	}();
	
		
	control.appendChild(progress);
	control.appendChild(slider);
	control.appendChild(playstop);
	control.appendChild(time);
	control.appendChild(fullscreen);
	parent.appendChild(video);
	parent.appendChild(control);
	
	function drawProgress(canvas, buffered, current, total) {
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#777777";
		ctx.fillRect(0, 0, buffered / total * canvas.width, canvas.height);
		ctx.fillStyle = "#cc181e";
		ctx.fillRect(0, 0, current / total * canvas.width, canvas.height);
		time.innerHTML = secondToTime(parseInt(video.currentTime)) +
			" / " + secondToTime(parseInt(video.duration));
		slider.style.left = parseInt(current / total * canvas.width) + "px";
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

	this.autoPlay = function (bol) {
		if (bol) {
			video.autoplay = "autoplay";
		}
	}

	this.poster = function (src) {
		video.poster = src;
	}
}