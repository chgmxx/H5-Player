/*jslint browser: true */

var H5 = H5 || {};

H5.Player = function (parentElement) {

	"use strict";

	var parent = document.getElementById(parentElement) ||
		document.getElementsByTagName("body")[0],
		container = document.createElement("div"),
		video = document.createElement("video"),
		control = document.createElement("div"),
		slider = document.createElement("div"),
		playstop = document.createElement("div"),
		progressBg = document.createElement("div"),
		progress = document.createElement("div"),
		buffered = document.createElement("div"),
		time = document.createElement("div"),
		fullscreen = document.createElement("div"),
		playstopBig = document.createElement("div");

	function getTop(e) {
		var offset = e.offsetTop;
		if (e.offsetParent !== null) {
			offset += getTop(e.offsetParent);
		}
		return offset;
	}
    
    function getLeft(e) {
        var offset = e.offsetLeft;
        if (e.offsetParent !== null) {
            offset += getLeft(e.offsetParent);
        }
        return offset;
    }
    
	function secondToTime(seconds) {
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
    }
    
	function checkOperatingSystem() {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return "iOS";
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return "Android";
        } else {
            return "PC";
        }
    }
    
    function drawPosition() {
        playstopBig.style.left = parseInt(parent.offsetLeft, 10) + ((parseInt(parent.offsetWidth, 10) - 117) / 2) + "px";
        playstopBig.style.top = (video.height - 117) / 2 + parseInt(parent.offsetTop, 10) + "px";
    }
    
    function drawProgress(bufferedTime, current, total) {
        if (isNaN(bufferedTime + current + total)) {
            return;
        }
        progress.style.width = current / total * progressBg.offsetWidth + "px";
        buffered.style.width = bufferedTime / total * progressBg.offsetWidth + "px";
        time.innerHTML = secondToTime(parseInt(video.currentTime, 10)) +
            " / " + secondToTime(parseInt(video.duration, 10));
    }
    
    function drawSliderPosition(current, total) {
        slider.style.left = current / total * (progressBg.offsetWidth - 16) + "px";
        if (parseInt(slider.style.left, 10) < 0) {
            slider.style.left = "0px";
        } else if (parseInt(slider.style.left, 10) > progressBg.offsetWidth - 16) {
            slider.style.left = progressBg.offsetWidth - 16 + "px";
        }
    }

    function initUI() {
        container.className = "h5-player-container";
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
        drawPosition();
    }
    
    function initLogic() {
        var isDrag = false;
        
        function sliderMouseMove(e) {
            if (isDrag) {
                drawSliderPosition(e.clientX - getLeft(progressBg), progressBg.offsetWidth);
                drawProgress((video.buffered.end(0) / video.duration) * progressBg.offsetWidth, e.clientX - getLeft(progressBg), progressBg.offsetWidth);
            }
        }
        
        function sliderMoveUp(e) {
            document.removeEventListener("mouseup", sliderMoveUp, false);
            document.removeEventListener("mousemove", sliderMouseMove, false);
            isDrag = false;
            video.currentTime = slider.offsetLeft / (progressBg.offsetWidth - 16) * video.duration;
            video.play();
        }
        
        function sliderMouseOver(e) {
            slider.style.visibility = "visible";
        }
        
        function sliderMouseOut(e) {
            if (!isDrag) {
                slider.style.visibility = "hidden";
            }
        }
        
        function sliderMouseDown(e) {
            isDrag = true;
            slider.style.visibility = "visible";
            video.pause();
            document.addEventListener("mousemove", sliderMouseMove, false);
            document.addEventListener("mouseup", sliderMoveUp, false);
        }
        
        function videoDurationChange() {
            drawProgress(video.buffered.end(0), video.currentTime, video.duration);
        }
        
        function videoTimeUpdate() {
            if (!isDrag) {
                drawProgress(video.buffered.end(0), video.currentTime, video.duration);
            }
        }
        
        function videoProgress() {
            if (!isDrag) {
                drawProgress(video.buffered.end(0), video.currentTime, video.duration);
                drawSliderPosition(video.currentTime, video.duration);
            }
        }
        
        function videoPlay() {
            playstop.className = "h5-player-stop";
            playstopBig.className = "h5-player-stop-big";
        }
        
        function videoPause() {
            playstop.className = "h5-player-play";
            playstopBig.className = "h5-player-play-big";
        }
        
        function playStopClick() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
        
        function fullScreenClick(e) {
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
        
        function progressMouseOver(e) {
            slider.style.visibility = "visible";
        }
        
        function progressMouseOut(e) {
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
        playstopBig.addEventListener("click", playStopClick, false);

        fullscreen.addEventListener("click", fullScreenClick, false);

        progressBg.addEventListener("mouseover", progressMouseOver, false);
        progressBg.addEventListener("mouseout", progressMouseOut, false);

        slider.addEventListener("mouseover", sliderMouseOver, false);
        slider.addEventListener("mouseout", sliderMouseOut, false);
        slider.addEventListener("mousedown", sliderMouseDown, false);
    }
    
    function addUI() {
        progressBg.appendChild(buffered);
        progressBg.appendChild(progress);
        control.appendChild(progressBg);
        control.appendChild(slider);
        control.appendChild(playstop);
        control.appendChild(time);
        control.appendChild(fullscreen);
        container.appendChild(video);
        parent.appendChild(container);

        if (checkOperatingSystem() === "iOS") {
            video.controls = true;
        } else {
            video.controls = false;
            container.appendChild(control);
            container.appendChild(playstopBig);
        }
    }
	
	this.setSize = function setSize(w, h) {
		video.width = w;
		video.height = h;
        drawPosition();
		return this;
	};
		
	this.load = function load(src) {
		video.src = src;
		return this;
	};

    this.autobuffer = function autobuffer(bol) {
        if (bol) {
			video.autobuffer = "autobuffer";
		}
		return this;
    };
    
	this.autoPlay = function autoPlay(bol) {
		if (bol) {
			video.autoplay = "autoplay";
		}
		return this;
	};

	this.poster = function poster(src) {
		video.poster = src;
		return this;
	};
	
	initUI();
	initLogic();
	addUI();
};