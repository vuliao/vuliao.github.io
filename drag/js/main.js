window.onload = function () {
    //获取屏幕宽度并动态赋值  
    var winWidth = 0;
    var winHeight = 0;

    window.DOM = {
        title: document.getElementsByTagName("title")[0],
        body: document.getElementsByTagName("body")[0],
        dropView: document.getElementById("drop_view"),
        imgBrower: document.getElementById("img_brower"),
        imgContent: document.getElementById("img_content"),
        videoBox: document.getElementById("video_box"),
        video: document.getElementById("video"),
        msg: document.getElementById("msg")
    }

    function main() {
        findDimensions();
        dropViewStyle();
        videoStyle();
        enventHandle();
        dropViewHandle(DOM.dropView, processfileObj);
    }

    function processfileObj(filesObj) {
        var videoArr = filesObj.getArryByFileType("video");
        var imgArr = filesObj.getArryByFileType("image");
        if (imgArr.length > 0) {
            DOM.imgBrower.style.display = "block";
            DOM.videoBox.style.display = "none";
            if (!DOM.video.paused) {
                DOM.video.pause();
            }
            DOM.imgContent.innerHTML = "";
            DOM.title.innerHTML = "imageBrower";
            scrollTopTo(0);
            appendImgs(imgArr);
        } else if (videoArr.length > 0) {
            DOM.imgBrower.style.display = "none";
            DOM.videoBox.style.display = "block";
            videoSet(videoArr[0]);
        }
    } //processfileObj
    function appendImgs(imgArr) {
        // console.log(imgArr)
        var spanNum = 20;
        var listFragment = document.createDocumentFragment();
        var imgTmpArr = imgArr.slice(0, spanNum);
        imgArr = imgArr.slice(spanNum);
        var promiseArr = [];
        imgTmpArr.forEach(function (item) {
            promiseArr.push(addimgDom(item, listFragment));
        });
        DOM.imgContent.appendChild(listFragment);
        return Promise.all(promiseArr).then(function () {
            if (imgArr.length === 0) return;
            return appendImgs(imgArr);
        })

        function addimgDom(file, fragment) {
            if (file.size < 20000) {
                return Promise.resolve();
            }
            var imgDom = document.createElement("img");
            return new Promise(function (resolve, reject) {
                imgDom.src = URL.createObjectURL(file);
                imgDom.title = file.name;
                fragment.appendChild(imgDom);
                imgDom.onload = function () {
                    if (this.height < 120) {
                        this.parentNode.removeChild(this);
                    };
                    URL.revokeObjectURL(this.src);
                    resolve();
                };
                imgDom.onerror = function () {
                    this.parentNode.removeChild(this);
                    URL.revokeObjectURL(this.src);
                    resolve();
                }
            })
        }
    } //appendImgs
    function videoSet(videofile) {
        var video = DOM.video;
        video.src = URL.createObjectURL(videofile);
        DOM.title.innerHTML = videofile.name;
        var singleClickTimeFlag = 0;


    }

    function setVideoSpeed(forward) {
        var video = DOM.video;
        var videoSpeed = video.playbackRate;
        if (forward == 1) {
            videoSpeed += 0.2;
        } else {
            videoSpeed -= 0.2;
        }
        videoSpeed = Math.round(videoSpeed * 10) / 10;
        video.playbackRate = videoSpeed;
        showSpeedMsg(video.playbackRate);
    }

    function showSpeedMsg(num) {
        var msg = DOM.msg;
        msg.innerHTML = num || 1;
        msg.style.display = "inline";
        setTimeout(() => {
            msg.style.display = "none";
        }, 2000);
    }
   
    function findDimensions() { //函数：获取尺寸

        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
            return;
        }
        if (window.innerWidth) //获取窗口宽度
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth;
        //获取窗口高度
        if (window.innerHeight)
            winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            winHeight = document.body.clientHeight;

    } //findDimensions
    function scrollTopTo(height) {
        if (document.documentElement.scrollTop == undefined) {
            document.body.scrollTop = height;
        } else {
            document.documentElement.scrollTop = height;
        }
    } //scrollTopTo
    function videoStyle() {
        DOM.videoBox.style.height = winHeight + "px";
    }

    function dropViewStyle() {
        var viewHeight = winHeight * 3 / 5;
        var viewWidth = winWidth * 4 / 5;
        DOM.dropView.style.height = viewHeight + "px";
        DOM.dropView.style.width = viewWidth + "px";
        DOM.dropView.style.left = winWidth / 10 + "px";
        DOM.dropView.style.top = winHeight / 5 + "px";
    }

    function enventHandle() {
        window.onresize = function () {
            findDimensions();
            dropViewStyle();
            videoStyle();
        };
        DOM.video.onclick = function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            if (isDbClick(this)) {
                if (screenfull.enabled) {
                    screenfull.toggle(video);
                }

            }

        } //video.onclick
        document.onkeydown = function (e) {
            var video = DOM.video;
            var currentTime = video.currentTime;
            e = e || window.event;
            var duration = video.duration;
            var ctrlKey = e.ctrlKey || e.metaKey;
            switch (e.keyCode) {
                case 37:
                    if (currentTime > 5 && ctrlKey != true) video.currentTime = currentTime - 5;
                    if (ctrlKey == true) setVideoSpeed(-1);
                    break;
                case 39:
                    if (currentTime + 5 < duration && ctrlKey != true) video.currentTime = currentTime + 5;
                    if (ctrlKey == true) setVideoSpeed(1);
                    break;
                case 32: //空格
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
            }
        }
        DOM.imgContent.onclick = function (e) {
            if (!isDbClick(this)) return;
            var img = e.target;
            if (screenfull.enabled) {
                screenfull.toggle(img);
            }

        }
        DOM.body.ondragover = function (e) {
            e.preventDefault();
            // e.dataTransfer.setData("drag","hello");
            DOM.dropView.style.display = "block";
        }
        DOM.body.ondrop = function (e) {
            e.preventDefault();
            DOM.dropView.style.display = "none";
        }

    }

    function isDbClick(ele) {
        "use strict"
        if (ele.isDbClick_dbFlag === 1) {
            clearTimeout(ele.isDbClick_timeFlag);
            ele.isDbClick_dbFlag = 0;
            return true;
        } else {
            ele.isDbClick_dbFlag = 1;
            ele.isDbClick_timeFlag = setTimeout(function () {
                ele.isDbClick_dbFlag = 0;
            }, 250);
        }
        return false;
    }
    main();

} //onload