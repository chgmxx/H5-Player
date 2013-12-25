/*jslint browser: true */

var H5 = H5 || {};

H5.Player = function (parentElement) {
    
    "use strict";
	
	var parent = document.getElementById(parentElement) ||
		document.getElementsByTagName("body")[0],
		video = document.createElement("video"),
		control = document.createElement("div"),
		slider = document.createElement("div"),
		playstop = document.createElement("div"),
		progress = document.createElement("canvas"),
		time = document.createElement("div"),
		fullscreen = document.createElement("div"),
		playstopBig = document.createElement("div"),
        secondToTime = function (seconds) {
            var hour = parseInt(seconds / 3600, 10) || 0,
                min = parseInt((seconds - hour * 3600) / 60, 10) || 0,
                sec = parseInt(seconds - hour * 3600 - min * 60, 10) || 0;
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
        },
        checkOperatingSystem = function () {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                return "iOS";
            } else if (/(Android)/i.test(navigator.userAgent)) {
                return "Android";
            } else {
                return "PC";
            }
        },
        drawProgress = function (canvas, buffered, current, total) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#777777";
            ctx.fillRect(0, 0, buffered / total * canvas.width, canvas.height);
            ctx.fillStyle = "#cc181e";
            ctx.fillRect(0, 0, current / total * canvas.width, canvas.height);
            time.innerHTML = secondToTime(parseInt(video.currentTime, 10)) +
                " / " + secondToTime(parseInt(video.duration, 10));
            slider.style.left = parseInt(current / total * canvas.width, 10) + "px";
        },
        initUI = function () {
            video.width = 640;
            video.height = 480;
            video.preload = "meta";
            control.className = "h5-player-control";
            playstop.className = "h5-player-play";
            progress.className = "h5-player-progress";
            progress.width = parent.offsetWidth;
            progress.height = 8;
            slider.className = "h5-player-slider";
            time.className = "h5-player-time";
            fullscreen.className = "h5-player-fullscreen";
            playstopBig.className = "h5-player-play-big";
            playstopBig.style.left = parseInt(parent.offsetLeft, 10) + ((parseInt(parent.offsetWidth, 10) - 117) / 2) + "px";
            playstopBig.style.top = (parseInt(parent.offsetHeight, 10) - 117) / 2 + "px";
        },
        initLogic = function () {
            var isDrag = false,
                sliderMouseMove = function (e) {
                    if (isDrag) {
                        slider.style.left = e.clientX - parent.offsetLeft + "px";
                        if (parseInt(slider.style.left, 10) + 16 > progress.width) {
                            slider.style.left = progress.width - 16 + "px";
                        } else if (parseInt(slider.style.left, 10) < 0) {
                            slider.style.left = "0px";
                        }
                        drawProgress(progress, video.buffered.end(0), parseInt(slider.style.left, 10), progress.width);
                    }
                },
                sliderMoveUp = function (e) {
                    document.removeEventListener("mouseup", sliderMoveUp, false);
                    document.removeEventListener("mousemove", sliderMouseMove, false);
                    isDrag = false;
                    video.currentTime = parseInt(slider.style.left, 10) / progress.width * video.duration;
                    video.play();
                },
                sliderMouseOver = function (e) {
                    slider.style.visibility = "visible";
                },
                sliderMouseOut = function (e) {
                    if (!isDrag) {
                        slider.style.visibility = "hidden";
                    }
                },
                sliderMouseDown = function (e) {
                    isDrag = true;
                    slider.style.visibility = "visible";
                    video.pause();
                    document.addEventListener("mousemove", sliderMouseMove, false);
                    document.addEventListener("mouseup", sliderMoveUp, false);
                },
                videoDurationChange = function () {
                    drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration);
                },
                videoTimeUpdate = function () {
                    if (!isDrag) {
                        drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration);
                    }
                },
                videoProgress = function () {
                    if (!isDrag) {
                        drawProgress(progress, video.buffered.end(0), video.currentTime, video.duration);
                    }
                },
                videoPlay = function () {
                    playstop.className = "h5-player-stop";
                    playstopBig.className = "h5-player-stop-big";
                },
                videoPause = function () {
                    playstop.className = "h5-player-play";
                    playstopBig.className = "h5-player-play-big";
                },
                playStopClick = function () {
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                },
                fullScreenClick = function (e) {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.msRequestFullscreen) {
                        video.msRequestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    }
                },
                progressMouseOver = function (e) {
                    slider.style.visibility = "visible";
                },
                progressMouseOut = function (e) {
                    if (!isDrag) {
                        slider.style.visibility = "hidden";
                    }
                };
    
            video.addEventListener("timeupdate", videoTimeUpdate, false);
            video.addEventListener("progress", videoProgress, false);
            video.addEventListener("play", videoPlay, false);
            video.addEventListener("pause", videoPause, false);
            video.addEventListener("durationchange", videoDurationChange, false);
    
            playstop.addEventListener("click", playStopClick, false);
            playstopBig.addEventListener("click", playStopClick, false);
    
            fullscreen.addEventListener("click", fullScreenClick, false);
    
            progress.addEventListener("mouseover", progressMouseOver, false);
            progress.addEventListener("mouseout", progressMouseOut, false);
    
            slider.addEventListener("mouseover", sliderMouseOver, false);
            slider.addEventListener("mouseout", sliderMouseOut, false);
            slider.addEventListener("mousedown", sliderMouseDown, false);
        };
    
    this.setSize = function (w, h) {
		video.width = w;
		video.height = h;
	};
		
	this.load = function (src) {
		video.src = src;
	};

	this.autoPlay = function (bol) {
		if (bol) {
			video.autoplay = "autoplay";
		}
	};

	this.poster = function (src) {
		video.poster = src;
	};
    
    initUI();
    initLogic();
	
	control.appendChild(progress);
	control.appendChild(slider);
	control.appendChild(playstop);
	control.appendChild(time);
	control.appendChild(fullscreen);
	parent.appendChild(video);

	if (checkOperatingSystem() === "iOS") {
		video.controls = true;
	} else {
		video.controls = false;
		parent.appendChild(playstopBig);
		parent.appendChild(control);
	}
};