
/*** check if hasClass ***/

function hasClass(elem, klass) {
    return (" " + elem.className + " ").indexOf(" " + klass + " ") > -1;
}



/*** add or remove Class ***/

function addRemoveClass(who, andclass) {
    if (hasClass(who, andclass)) {
        who.classList.remove(andclass);
    } else {
        who.classList.add(andclass);
    }
}


/*** adds or removes loader Class ***/

function loader(div) {
    var loaderdiv = document.getElementById(div);
    addRemoveClass(loaderdiv, 'loader');
}



/*** remove siblings class and add it to this ***/

function siblingsAddRemoveClass(who, andclass) {
    var siblings = who.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].nodeType != 1) {
            continue;
        }
        // check if not spaces text
        siblings[i].classList.remove(andclass);
    }
    who.classList.add(andclass);
}



/*** menubutton click ***/

function mainMenu(elem) {
    addRemoveClass(elem, 'opened');
    return false;
}


/*** Uppercase first letter ***/

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



/*** simple append ***/

function append(what, to) {
    var appenddiv = document.getElementById(to);
    if (appenddiv.childNodes.length > 0) {
        var arr = [];
        for (var i = 0; i < appenddiv.childNodes.length; i++) {
            if (appenddiv.childNodes[i].nodeType == 1) { // check if text
                arr.push(appenddiv.childNodes[i]);
            }
        };
        arr[0].appendChild(what);
    } else {
        appenddiv.appendChild(what);
    }
}



/*** check if browser has localstorage ***/

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
if (!supports_html5_storage()) {
    alert('You can\'t use localstorage, please allow it or use another browser!');
}



/*** mainmenu click functions ***/

var viewlinks = document.querySelectorAll('#nav ul li a');
var viewlinksItems = [].slice.call(viewlinks);
viewlinksItems.forEach(function (item, i) {
    var linktext = item.getAttribute("href");
    item.addEventListener('click', function (event) {
        event.preventDefault();
        app.changeView(linktext);
    });
});



/*** input type file change ***/

function changeFile(elem) {
    var files = elem.files;
    var len = files.length;
    // we should read just one file
    if (len) {
        var checked = document.getElementById('checked');
        if (checked) {
            checked.parentNode.removeChild(checked);
        }
        var div = document.createElement('div');
        div.id = 'checked';
        div.className = "inline-block green margin10";
        div.innerHTML = '<i class="material-icons">check</i>';
        document.getElementById('filediv').appendChild(div);
    } else {
        var divtoremove = document.getElementById('checked');
        divtoremove.parentElement.removeChild(divtoremove);
    }
}



/***
    1) validate addForm
    2) create img or take it from webcam
    3) add photo to gallery & add photo to storage
***/

function formValidate(event) {
    event.preventDefault();
    var datatosend,
        photocat = addform.elements["category"].value,
        photoname = addform.elements["photoname"].value,
        photodesc = addform.elements["description"].value,
        photofile = addform.elements["file"].files[0]; // using HTML5 fileAPI
    if ((photocat == '') || (photoname == '')) { // test on html5 attr required
        alert('Fill in required fields');
    } else {
        loader('addform');
        if (localStorage.length) { // check if localstorage allready have item with "trying to added" name
            for (var i = 0; i < localStorage.length; i++) {
                var thiskey = localStorage.key(i);
                var parsed = JSON.parse(localStorage.getItem(thiskey));
                if (parsed.name === photoname) { //check if localStorage has items
                    alert('this photo allready exists!');
                    loader('addform');
                    return false;
                }
            }
        }
        datatosend = {
            cat: photocat,
            name: photoname,
            desc: photodesc
        }
        if (document.getElementById("file").value.length) {
            if (!photofile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                alert('please choose a image file');
                loader('addform');
                return false;
            } else {
                createImg(datatosend, app.addPhoto, app.addToStorage); //get data from fields and send to createImg function
                //clearForm();
            }
        } else {
            //var videoImage = document.getElementById("videoImage");
            //clearForm();
            datatosend.img = document.getElementById("videoImage").src;
            app.changeView('gallery',null,function(){
                app.addPhoto(datatosend);
                app.addToStorage(datatosend);
            });
        }
    }
}



/*** clear add Form (after submit) ***/

function clearForm() {
    addform.elements["category"].value = "";
    addform.elements["photoname"].value = "";
    addform.elements["description"].value = "";
    addform.elements["file"].value = "";
    var checked = document.getElementById('checked');
    checked.parentNode.removeChild(checked);
}



/*** create Img and callback addPhoto & add to storage ***/

function createImg(datatosend, callback, callback2) { // using fileAPI
    var input, file, fr, img;

    if (typeof window.FileReader !== 'function') {
        write("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('file');
    if (!input) {
        alert("Um, couldn't find the imgfile element.");
        loader('addform');
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
        loader('addform');
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Submit'");
        loader('addform');
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = function () {
            img = new Image();
            img.onload = function () {
                var canvas = document.getElementById("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                datatosend.img = canvas.toDataURL("image/png");
                app.changeView('gallery',null,function(){
                    callback(datatosend); //assets.addPhoto(created_image, data_from_fields)
                    callback2(datatosend);
                });
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(file);
    }
}



/*** check if empty div (needed for #items .row) ***/

function checkIfEmpty(div, callback) {
    var link = document.querySelector(div);
    if (link.children.length < 1) {
        if (callback) {
            callback();
            return;
        } else {
            return true;
        }
    } else {
        return false;
    }
}



/*** clear everything that get ***/

function cleardiv(div) {
    var itemsrow = document.querySelector(div);
    itemsrow.innerHTML = "";
}



/*** variable for overwriting it in future (needed for video) ***/

var mediaStream = null;



/*** start video (after clicking on popup button) ***/

function videoStart(event) {
    event.preventDefault();
    var div = document.getElementById('fader');
    addRemoveClass(div, 'active');
    var btn = document.getElementById('addToForm');
    btn.style.display = 'none';
    var takephoto = document.getElementById('takephoto');
    takephoto.setAttribute('onclick','takePhoto(this, event)');
    takephoto.innerHTML = 'take a photo <i class="material-icons">photo_camera</i>';
    videoRun(event);
    if (document.getElementById('camera').children.length > 1) {
        var ch = document.getElementById('camera').children[1];
        ch.parentNode.removeChild(ch);
    }
}



/*** run video and if not from popup - change button ***/

function videoRun(event, elem) {
    event.preventDefault();
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
                audio: false,
                video: {
                    width: 640,
                    height: 480
                }
            },
            function (stream) {
                var video = document.querySelector('video');
                var img = document.getElementById('videoImage');
                img.style.display = 'none';
                video.src = window.URL.createObjectURL(stream);
                video.style.display = 'block';
                video.onloadedmetadata = function (e) {
                    video.play();
                };
                mediaStream = stream;  // overwrite initialized variable to work with it in future
            },
            function (err) {
                alert("The following error occurred: " + err.name);
            }
        );
    } else {
        alert("getUserMedia not supported");
    }
    if (elem) {
        elem.innerHTML = 'take a photo <i class="material-icons">photo_camera</i>';
        elem.setAttribute('onclick','takePhoto(this, event)');
        var btn = document.getElementById('addToForm');
        btn.style.display = 'none';
    }
}



/*** stop video ***/

function videoStop(event) {
    event.preventDefault();
    var video = document.querySelector('video'),
        div = document.getElementById('fader'),
        btn = document.getElementById('addToForm');
    addRemoveClass(div, 'active');
    mediaStream.getVideoTracks()[0].stop();
    video.src="";
    video.style.display = 'none';
    btn.style.display = 'none';
}



/*** make photo and change button to start video ***/

function takePhoto(elem, event) {
    event.preventDefault();
    var video = document.querySelector('video'),
        canvas = document.getElementById('canvas2'),
        img = document.getElementById('videoImage'),
        btn = document.getElementById('addToForm');
    canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
    // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
    img.src = canvas.toDataURL('image/png');
    img.style.display = 'block';
    mediaStream.getVideoTracks()[0].stop();
    video.src="";
    video.style.display = 'none';
    btn.style.display = 'inline-block';
    elem.innerHTML = 'take another<i class="material-icons">videocam</i>';
    elem.setAttribute('onclick','videoRun(event, this)');
}



/*** add photo from camera to form and add check ***/

function addToForm(event){
    event.preventDefault();
    var fader = document.getElementById('fader');
    addRemoveClass(fader, 'active');

    document.getElementById("file").value = ""; // remove value from file
    var checked = document.getElementById('checked');
    if (checked) {
        checked.parentNode.removeChild(checked);
    } // end remove value from file

    var div = document.createElement('div');
    div.id = 'checked';
    div.className = "inline-block green";
    div.innerHTML = '<i class="material-icons">check</i>';
    document.getElementById('camera').appendChild(div);
}

