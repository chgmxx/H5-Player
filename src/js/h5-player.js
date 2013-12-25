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
		progressBg = document.createElement("div"),
        progress = document.createElement("div"),
        buffered = document.createElement("div"),
		time = document.createElement("div"),
		fullscreen = document.createElement("div"),
		playstopBig = document.createElement("div"),
        getTop = function (e) {
            var offset = e.offsetTop;
            if (e.offsetParent !== null) {
                offset += getTop(e.offsetParent);
            }
            return offset;
        },
        getLeft = function (e) {
            var offset = e.offsetLeft;
            if (e.offsetParent !== null) {
                offset += getLeft(e.offsetParent);
            }
            return offset;
        },
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
        drawProgress = function (bufferedTime, current, total) {
            if (isNaN(bufferedTime + current + total)) {
                return;
            }
            progress.style.width = current / total * progressBg.offsetWidth + "px";
            buffered.style.width = bufferedTime / total * progressBg.offsetWidth + "px";
            time.innerHTML = secondToTime(parseInt(video.currentTime, 10)) +
                " / " + secondToTime(parseInt(video.duration, 10));
        },
        drawSliderPosition = function (current, total) {
            slider.style.left = current / total * (progressBg.offsetWidth - 16) + "px";
            if (parseInt(slider.style.left, 10) < 0) {
                slider.style.left = "0px";
            } else if (parseInt(slider.style.left, 10) > progressBg.offsetWidth - 16) {
                slider.style.left = progressBg.offsetWidth - 16 + "px";
            }
        },
        initUI = function () {
            video.width = 640;
            video.height = 480;
            video.preload = "meta";
            control.className = "h5-player-control";
            playstop.className = "h5-player-play";
            progressBg.className = "h5-player-progress-bg";
            progress.className = "h5-player-progress";
            buffered.className = "h5-player-buffered";
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
                        drawSliderPosition(e.clientX - getLeft(progressBg), progressBg.offsetWidth);
                        drawProgress((video.buffered.end(0) / video.duration) * progressBg.offsetWidth, e.clientX - getLeft(progressBg), progressBg.offsetWidth);
                    }
                },
                sliderMoveUp = function (e) {
                    document.removeEventListener("mouseup", sliderMoveUp, false);
                    document.removeEventListener("mousemove", sliderMouseMove, false);
                    isDrag = false;
                    video.currentTime = slider.offsetLeft / (progressBg.offsetWidth - 16) * video.duration;
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
                    drawProgress(video.buffered.end(0), video.currentTime, video.duration);
                },
                videoTimeUpdate = function () {
                    if (!isDrag) {
                        drawProgress(video.buffered.end(0), video.currentTime, video.duration);
                    }
                },
                videoProgress = function () {
                    if (!isDrag) {
                        drawProgress(video.buffered.end(0), video.currentTime, video.duration);
                        drawSliderPosition(video.currentTime, video.duration);
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
    
            progressBg.addEventListener("mouseover", progressMouseOver, false);
            progressBg.addEventListener("mouseout", progressMouseOut, false);
    
            slider.addEventListener("mouseover", sliderMouseOver, false);
            slider.addEventListener("mouseout", sliderMouseOut, false);
            slider.addEventListener("mousedown", sliderMouseDown, false);
        },
        addUI = function () {
            progressBg.appendChild(buffered);
            progressBg.appendChild(progress);
            control.appendChild(progressBg);
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
    addUI();
};