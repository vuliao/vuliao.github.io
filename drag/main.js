//todo promise 中的定时器若clearTimeout 后 是否内存泄露 
window.onload = function() {
  "use strict"
  function main() {
    EventHanlder();
  }

    var DOM = {
      dropArea: document.getElementById("addHandle"),
      playButten: document.getElementById("play"),
      CGButten: document.getElementById("CG"),
      imgContainer :document.getElementById("boxContainer")
    }
    var view = (function(){
          var _currentNum = 1;
          var _lastScrollTop = 0;
          var timeoutFlag = 0;
          var allImgs ;
          var scrollTop_IntervalFlag = 0;
          function scrollTopTo(height){
            if(document.documentElement.scrollTop==undefined){
              document.body.scrollTop = height;
            }else{
              document.documentElement.scrollTop = height;
            }
          }//scrollTopTo
          function scrollTop_slow(height,speed){
            speed = speed||10;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(height==scrollTop){
              return Promise.resolve();
            }
            var addNum = height>scrollTop?3:-3;
            return new Promise(function(resolve,reject){
                scrollTop_IntervalFlag = setInterval(function(){
                  if( (height-scrollTop)/addNum<=0 ){="" clearinterval(scrolltop_intervalflag);="" resolve();="" }="" scrolltop="" +="addNum;" scrolltopto(scrolltop);="" },speed);="" })="" new="" promise="" scrolltop_slow="" function="" removeimgs(){="" dom.imgcontainer.innerhtml="" ;="" removeimgs="" appendimg(resultarry)="" {="" var="" img,="" promisearry="[]," promise1;="" listfragment="document.createDocumentFragment();" resultarry.foreach(function(result)="" img="document.createElement("img");" img.src="result;" listfragment.appendchild(img);="" promise1="new" promise(function(resolve,="" reject)="" img.onload="function()" if="" (this.height="" <="" 120)="" this.parentnode.removechild(this);="" };="" url.revokeobjecturl(this.src);="" img.onerror="function()" promisearry.push(promise1);="" foreach="" dom.imgcontainer.appendchild(listfragment);="" return="" promise.all(promisearry)="" appendimg="" getcurrentimgnum()="" succimg="document.getElementsByTagName("img");" allimgs="succImg;" imgnum="succImg.length;" ||="" document.body.scrolltop;="" if(imgnum="=1||scrollTop==0){" [1,1];="" if(scrolltop="==_lastScrollTop){" return[_currentnum,imgnum];="" margintop="80;" lastimgoffheight="succImg[imgNum" -="" 1].offsettop;="" imgaverageheight="parseInt(lastImgOffHeight" (imgnum="" 1));="" viewheight="document.documentElement.clientHeight;" currentnum="Math.round((scrollTop+viewHeight" margintop)="" imgaverageheight);="">imgNum?imgNum:currentNum;
            var ImgOffHeight = succImg[currentNum-1].offsetTop + marginTop;
            var imgHeight = succImg[currentNum-1].offsetHeight;
            while (ImgOffHeight > scrollTop + viewHeight || ImgOffHeight + imgHeight < scrollTop) {
              currentNum += (ImgOffHeight > scrollTop + viewHeight) ? -1 : 1;
              ImgOffHeight = succImg[currentNum-1].offsetTop + marginTop;
              imgHeight = succImg[currentNum-1].offsetHeight;
            }
            if (ImgOffHeight >= scrollTop + viewHeight / 2) {
              currentNum--;
              ImgOffHeight = succImg[currentNum-1].offsetTop + marginTop;
            } else if (ImgOffHeight + imgHeight < scrollTop + viewHeight / 2) {
              currentNum++;
              ImgOffHeight = succImg[currentNum-1].offsetTop + marginTop;
            }

            _lastScrollTop = scrollTop;
            _currentNum = currentNum;
            return [currentNum,imgNum];
          }//getCurrentImgNum
          function playButtenChange(){
              var thisButten =  DOM.playButten;
              if(thisButten.innerHTML=='play'){
                thisButten.innerHTML = 'stop';
                thisButten.style.backgroundColor = '#955859';
                return 1;
              }else{
                thisButten.innerHTML = 'play';
                thisButten.style.backgroundColor = '#333633';
                return 0;
              }
          }//playButtenChange
          function CGButtenChange(){
              var thisButten =  DOM.CGButten;
              if(thisButten.innerHTML=='CG'){
                thisButten.innerHTML = 'img';
                thisButten.style.backgroundColor = '#955859';
                return 1;
              }else{
                thisButten.innerHTML = 'CG';
                thisButten.style.backgroundColor = '#333633';
                return 0;
              }
          }//playButtenChange
          function playImg(speed){
            speed = speed||2.5;
            var marginTop = 80;
              var flag = playButtenChange();
              if(flag==1){
                var imginfo = getCurrentImgNum();
                var currentNum = imginfo[0];
                var times = 0;
                function nextImg(){
                  _toImg(currentNum).then(function(){
                      if(currentNum!=allImgs.length){
                        currentNum++;
                        timeoutFlag = setTimeout(nextImg,times);
                      }
                  })
                  
                  
                }//nextImg
                timeoutFlag = setTimeout(nextImg,times);
              }else{
                clearTimeout(timeoutFlag);
                clearInterval(scrollTop_IntervalFlag);
              }
              function _toImg(currentNum){
                var times = 1000*speed;
                
                var ImgOffHeight = allImgs[currentNum-1].offsetTop + marginTop;
                var imgHeight = allImgs[currentNum-1].offsetHeight;
                var viewHeight = document.documentElement.clientHeight;
                // clearInterval(scrollTop_IntervalFlag);
                scrollTopTo(ImgOffHeight);
                  return new Promise(function(resolve,reject){
                    timeoutFlag = setTimeout(function(){
                      if(imgHeight>viewHeight){
                          scrollTop_slow(ImgOffHeight+imgHeight-viewHeight).then(function(){
                            timeoutFlag = setTimeout(resolve,times)
                          });
                      }else{
                        resolve();
                      }
                      
                    },times);
                  })//new Promise
                  


              }//_toImg
          }//playImg
          function setAsCG(){
            var flag =CGButtenChange();
            var currentNum;
            var marginTop = 80;
            currentNum = getCurrentImgNum()[0];
            for (var i = 0; i < allImgs.length; i++) {
              
              if(flag==1){
                allImgs[i].style.maxHeight =  document.documentElement.clientHeight-2+'px';
                allImgs[i].style.marginBottom = '0';
              }else{
                allImgs[i].style.maxHeight =  'inherit';
                 allImgs[i].style.marginBottom = '15px';
              }
            }
            var ImgOffHeight = allImgs[currentNum-1].offsetTop + marginTop;
              scrollTopTo(ImgOffHeight);
              playImg(1);
          }//setAsCG
          return {
            scrollTopTo :scrollTopTo,
            removeImgs :removeImgs,
            appendImg :appendImg,
            playImg :playImg,
            setAsCG :setAsCG,
            getCurrentImgNum :getCurrentImgNum
          }
        })();
    var model = (function(){
      
        var imgfiles = [];
        var appendNum = 0;
        function clearData(){
          imgfiles = [];
          appendNum = 0;
        }//
        function addfiles(files){
            files.forEach(function(file){
              if (!/image\/\w+/.test(file.type) || file.size < 20000) {

                return;
              } //if
              imgfiles.push(file);
            })
        }
        function getfiles(dataTransfer){
          clearData();
          var files = dataTransfer.files;
          var items = dataTransfer.items;

          if (files.length == 1) {

           return  addFilesFromItems(items).then(function(){
            imgfiles.sort(sortFunction);
           });
          } else {
            addfiles(toArray(files));
            imgfiles.sort(sortFunction);
            return Promise.resolve()
          }
        }//getfiles
        function addFilesFromItems(items){
            var item, entry, files, i;
            var promise;
            var promiseArr = [];
            files = [];
            for (i = 0; i < items.length; i++) {
              item = items[i];
              if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
                if (entry.isDirectory) {
                  promise = addFilesFromDirectory(entry, entry.name).then(function(_files) {
                    if(_files.length>0){
                       files = files.concat(_files);
                    }
                    return ;
                  })//addFilesFromDirectory
                  promiseArr.push(promise);
                } else if (entry.isFile) {
                  files.push(item.getAsFile());
                 
                }
              }
               
            }//for
            return Promise.all(promiseArr).then(function(){
              if (files.length > 0) {

                addfiles(files);
              }
            })
        }//addFilesFromItems
        function addFilesFromDirectory(directory, path){
              var dirReader = directory.createReader();
              
              var _entries = [];
              // var files = [];
              var promiseArry = [];
              var promise1, promise2, retPromise;
              promise1 = new Promise(function(resolve, reject) {
                  var readEntries = function() {
                    dirReader.readEntries(function(entries) {
                      if (entries.length > 0) {
                        _entries = _entries.concat(toArray(entries));
                        readEntries();
                      } else {
                        resolve();
                      }
                    }, err); // dirReader.readEntries
                  }; //readEntries
                  readEntries();
                }) //new Promise

              retPromise = promise1.then(function(){
                _entries.forEach(function(entry) {
                  if (entry.isDirectory) {
                    return;            //TODO 
                  }
                  if (entry.isFile) {
                    promise2 = new Promise(function(resolve, reject) {
                        entry.file(function(file) {
                            file.fullPath = "" + path + "/" + file.name;
                            resolve(file);

                          }) //entry.file
                      }) //new Promise
                    promiseArry.push(promise2);

                  } //if
                }); //forEach
                return Promise.all(promiseArry)
              })// retPromise;
               return retPromise;
        }//addFilesFromDirectory

        function getImgsSrc(){
                var filesLength = imgfiles.length;
                var start, end, i;
                var promiseArry = [];
                start = appendNum;
                if (filesLength - appendNum <= 0)="" {="" return="" promise.resolve(0);="" }="" else="" if="" (fileslength="" -="" appendnum="">= 5) {
                  end = start + 5 - 1;
                } else {
                  end = filesLength - 1;
                }
                appendNum = end + 1;
                for (i = start; i <= end;="" i++)="" {="" var="" tmppromis="Promise.resolve(URL.createObjectURL(imgfiles[i]));" promisearry.push(tmppromis);="" filereader="new" filereader();="" filereader.readasdataurl(imgfiles[i]);="" promise1="new" promise(function(resolve,="" reject)="" filereader.onload="function()" resolve(this.result);="" }="" })="" new="" promise="" promisearry.push(promise1);="" for="" return="" promise.all(promisearry);="" promise.all(promisearry).then(function(resultarry)="" _this.appendimg(resultarry).then(function()="" resultarry.foreach(function(objecturl){="" url.revokeobjecturl(objecturl)="" _this.appenddelay(function(){="" _this.appendprocess();="" });="" promise.all="" getimgssrc="" getfiles:getfiles,="" getimgssrc:getimgssrc="" })();="" controller="(function(){" function="" drophandle(datatransfer){="" view.scrolltopto(0);="" model.getfiles(datatransfer).then(function(){="" view.removeimgs();="" appendprocess();="" drophandle="" appendprocess(){="" repeat(){="" model.getimgssrc().then(function(srcarr){="" if(srcarr="=0)" 0;="" view.appendimg(srcarr).then(function(){="" delay="setDelayTime();" settimeout(repeat,delay);="" repeat="" repeat();="" appendprocess="" setdelaytime(){="" imginfo="view.getCurrentImgNum();" currentnum="imginfo[0];" imgsnum="imginfo[1];" timenum="0;" mnum="imgsNum" -="" currentnum;="" if="" (mnum=""> 10) {
            mNum = mNum < 50 ? mNum : 50;
            timeNum = 200 * (mNum);
          }
          return timeNum;
        }//setDelayTime
        function playButtenHandle(){
          view.playImg();
        }
        function CGButtenHandle(){
          view.setAsCG();
        }
        return {
          dropHandle:dropHandle,
          CGButtenHandle:CGButtenHandle,
          playButtenHandle:playButtenHandle
        }
    })();

  function EventHanlder() {
    DOM.dropArea.ondragover = function(e) {
      e.preventDefault();
      // console.log("test");
    }

    DOM.dropArea.ondrop = function(e) {
        e.preventDefault();
        
        Controller.dropHandle(e.dataTransfer);

      } //ondrop
    DOM.playButten.onclick = function(){
      
      Controller.playButtenHandle();
    }
    DOM.CGButten.onclick = function(){
      
      Controller.CGButtenHandle();
    }


  } //EventHanlder

  main();
}; //window.onload

var print = console.log.bind(console);
function err(str) {
  console.log(str);
}

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function sortFunction(name1, name2) { //sort

  var a = name1.name.match(/.*\.(?=\w*$)/)[0];
  var b = name2.name.match(/.*\.(?=\w*$)/)[0];

  var compare = a.length - b.length;

  var stringLength;
  if (compare < 0) {
    stringLength = a.length;
  } else {
    stringLength = b.length;
  }
  var store = 0;
  for (var i = 0; i < stringLength; i++) {
    if (a[i] == b[i]) {
      if (/\d/.test(a[i])) {
        store++;
      } else {
        store = 0;
      }
      continue;
    }
    if (/\d/.test(a[i])) {
      if (/\d/.test(b[i])) {
        var sliceLengthA = a.slice(i).search(/\D/) + i;
        var sliceLengthB = b.slice(i).search(/\D/) + i;
        var numSliceA = a.slice(i - store, sliceLengthA);
        var numSliceB = b.slice(i - store, sliceLengthB);
        var test = parseInt(numSliceA) - parseInt(numSliceB);
        return test;

      } else {
        return store == 0 ? -1 : 1;
      }
    } else {
      if (/\d/.test(b[i])) {
        return store != 0 ? -1 : 1;
      } else {
        if (i == stringLength - 1) {
          return compare;
        }
        return a[i] < b[i] ? -1 : 1;
      }
    }
  };

  return compare;

} //end sortFunction</=></=></=0>