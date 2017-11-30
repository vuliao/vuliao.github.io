     var dropViewHandle = (function(){
         "use strict";
        
          function filesObj(name){
            this.name = name||null;
            this.dirsArr = [];
            this.filesArr = [];
            this.objParent = null;
          }
          filesObj.prototype.addFile = function(file){
            this.filesArr.push(file);
          };
          filesObj.prototype.addDir = function(name){
            var dirObj = new filesObj(name);
            dirObj.objParent = this;
            this.dirsArr.push(dirObj);
            return dirObj;
          }; 
          filesObj.prototype.getArryByFileType = function(type){
            var filesArr = this.filesArr;
            var dirsArr = this.dirsArr;
            var fileArry = [];
           
            if( filesArr.length > 0) {
              filesArr.forEach(function(file){
                if(file.type.indexOf(type)!==-1){
                  fileArry.push(file);
                }
              })
            }
            if(dirsArr.length > 0){
              
              dirsArr.forEach(function(dirObj){

                var temArr = dirObj.getArryByFileType(type);
                if(temArr.length>0){
                 fileArry = fileArry.concat(temArr);
                }
              });
            }
            return fileArry;
          };
           function dropViewHandle(ele, callback) {
            
             ele.ondragover = function(e) {
               e.preventDefault();
             };
             ele.ondrop = function(e) {
               e.preventDefault();
               getfiles(e.dataTransfer,function(filesObj) {
                 callback(filesObj);
               });
             };

           }//dropViewHandle

           
           function getfiles(dataTransfer,callback) {
             var files = dataTransfer.files;
             var items = dataTransfer.items;
             var isLocal = window.location.protocol === "file:";
             var topfilesObj = new filesObj();
             var promiseArr = [Promise.resolve()];
             for (var i = 0; i < files.length; i++) {
               if(!isDir(files[i]) ) {
                 topfilesObj.addFile(files[i]);
               } else {
                 if(isLocal) {
                   continue;
                 }else {
                   var entry = items[i].webkitGetAsEntry();
                   promiseArr.push(scanDir(entry,topfilesObj) );
                 }
               }
             }
             Promise.all(promiseArr).then(function(){
              topfilesObj.filesArr.sort(sortFunction);
              topfilesObj.dirsArr.sort(sortFunction);
               callback(topfilesObj);
             });
             function scanDir(entry,dirObj){
               var scanPromise;
               if(entry.isDirectory){
                 var newDirObj = dirObj.addDir(entry.name);
                 var dirReader = entry.createReader();
                 var _entries = [];
                 scanPromise = new Promise(function(resolve,reject){
                   readEntries(function(err){
                     if(err) {
                       console.log(err);
                       resolve();
                     }
                     var promiseArr = [];
                     _entries.sort(sortFunction);
                     _entries.forEach(function(entry){
                       promiseArr.push(scanDir(entry,newDirObj) );
                     });
                     Promise.all(promiseArr).then(function(){
                       resolve();
                     })
                   });
                 })//scanPromise

               } else {
                scanPromise = new Promise(function(resolve,reject){
                  entry.file(function(file){
                    dirObj.addFile(file);
                    resolve();
                  })
                });
                 
               }
               return scanPromise;
               function readEntries (callback) {
                 dirReader.readEntries(function(entries) {
                   if (entries.length > 0) {
                     _entries = _entries.concat(toArray(entries));
                     readEntries(callback);
                   } else {
                     callback();
                   }
                 }, callback); // dirReader.readEntries
               }; //readEntries
             }//scanDir
             function isDir(item) {
               if(item instanceof File){
                 if(item.type === "") return true;
               }
             }//isDir
           }//getfiles
           return dropViewHandle;
           function toArray(list) {
             return Array.prototype.slice.call(list || [], 0);
           }
          

           function sortFunction(name1, name2) { //sort

             var a = name1.name.match(/.*\.?(?=\w*$)/)[0];
             var b = name2.name.match(/.*\.?(?=\w*$)/)[0];
            
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

           } //end sortFunction
     })();
     

