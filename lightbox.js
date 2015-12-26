
function startLightbox(items){
	var lightboxImageLink = event.target.src;
    var imgTitle = event.target.id;
    var items = items;
	window.startOverlay(lightboxImageLink, items, imgTitle);
}


function startOverlay(lightboxImageLink, items, imgTitle){
    //create overlay and container divs
	var overlayDiv = document.createElement("div");
	overlayDiv.className = "overlay";
    overlayDiv.id = "overlay";
	var containerDiv = document.createElement("div");
	containerDiv.id = "container";
	containerDiv.className = "container";
	document.body.appendChild(overlayDiv);
	document.body.appendChild(containerDiv);
	document.body.style.overflowy = "hidden";
    overlayDiv.style.opacity = 0.7;

	//add lightbox image to the DOM
	var image = document.createElement("img");
	image.src = lightboxImageLink;
    image.id = imgTitle+"lightbox";
	containerDiv.appendChild(image);
	image.style.cursor = "default";
    image.style.borderStyle = "solid";
    image.style.borderWidth = "6px";
    image.style.borderColor = "white";
    
    //add title to bottom
    var title = document.createElement("p");
    containerDiv.appendChild(title);
    title.id = "title";
    title.style.marginTop = -2;
    title.style.marginLeft = 2;
    title.style.height = 5;
    title.style.fontFamily = "Open sans";
    title.style.color = "white";
    title.textContent = imgTitle;

	//center image, disable scrolling on overlay
	var imgWidth = image.width;
	var imgHeight = image.height;
	container.style.visibility = "visible";
	container.style.top = "50%";
	container.style.left = "50%";
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	container.style.marginTop = -(image.height/2)+scrollTop;
	container.style.marginLeft = -(image.width/2);
    document.body.style.overflowX = "hidden";
    
    //add navigation arrows
    var firstImageTitle = items[0].title;
    var imgLightboxTitle = image.id;
    var leftArrow = document.createElement("img");
    leftArrow.src = "leftArrow.png";
    leftArrow.id = imgTitle+"arrow";
    leftArrow.className = "leftArrow";
    containerDiv.appendChild(leftArrow);
    leftArrow.style.marginTop = -(imgHeight+100)/2;
    leftArrow.style.marginLeft = 20;
    leftArrow.style.visibility = "hidden";
    var rightArrow = document.createElement("img");
    rightArrow.src = "rightArrow.png";
    rightArrow.className = "rightArrow";
    rightArrow.id = imgTitle+"arrow";
    containerDiv.appendChild(rightArrow);
    rightArrow.style.position = "absolute";
    rightArrow.style.marginTop = -(imgHeight+100)/2;
    rightArrow.style.marginLeft = imgWidth-80;
    rightArrow.style.visibility = "hidden";
    
    
    //only show arrows when mouseover image
    document.getElementById('container').onmousemove = function () {
        var x = event.clientX;     
        //only show left arrow if on left side of image and not at beg
        if(!reachedBeg && x<450){
            leftArrow.style.visibility = "visible";
            rightArrow.style.visibility = "hidden";
        }
        //only show right arrow if on right side and not at end
        if(!reachedEnd && x>450){
            rightArrow.style.visibility = "visible";
            leftArrow.style.visibility = "hidden";
        }
    }
    document.getElementById('container').onmouseout = function () {
        rightArrow.style.visibility = "hidden";
        leftArrow.style.visibility = "hidden";
    }

}



//adjusting the current image each time
var adj = 0
//flags to keep track of beg and end
var reachedBeg = false;
var reachedEnd = false;

function displayNext(e, items){
    
    if(e.target.id == items[items.length-1].title){
        reachedEnd = true;
    }
    if(e.target.className == "rightArrow" && reachedEnd==false){
        adj++;
        reachedBeg = false;
        for(var i=0; i<items.length; i++){
            var title = items[i].title;
            if(e.target.id == title+"arrow" && i!=items.length-1){
                var currItemIndex = i;
                var img = document.getElementById(items[i].title+"lightbox");
                var farm = items[currItemIndex+adj].farm;
                var server = items[currItemIndex+adj].server;
                var id = items[currItemIndex+adj].id;
                var secret = items[currItemIndex+adj].secret;
                var src = "http://farm" + farm + ".static.flickr.com/" + 
                                        server + "/" + id + "_" + secret +".jpg";
                img.src = src;
                var caption = document.getElementById("title");
                var prevCaption = items[currItemIndex+adj].title;
                caption.innerHTML = prevCaption;
                //update arrow
                var prev = document.getElementById(items[currItemIndex+adj].title);
                if(prev.id ==items[items.length-1].title){
                    reachedEnd = true;
                    
                }
            }
        }
    }
}

function displayPrev(e, items){
    var firstImageTitle = items[0].title;
    //user clicks the first image
    if(e.target.id == items[0].title){
        reachedBeg = true;
        var arrow = document.getElementById(items[0].title+"arrow");
        arrow.style.visibility="hidden";

    }
    if(e.target.className == "leftArrow" && reachedBeg==false){
        adj--;
        reachedEnd = false;
        for(var i=0; i<items.length; i++){
            var title = items[i].title;
            if(e.target.id == title+"arrow"){
                var currItemIndex = i;
                var img = document.getElementById(items[i].title+"lightbox");
                var farm = items[currItemIndex+adj].farm;
                var server = items[currItemIndex+adj].server;
                var id = items[currItemIndex+adj].id;
                var secret = items[currItemIndex+adj].secret;
                var src = "http://farm" + farm + ".static.flickr.com/" + 
                                        server + "/" + id + "_" + secret +".jpg";
                img.src = src;
                //update caption
                var caption = document.getElementById("title");
                var prevCaption = items[currItemIndex+adj].title;
                caption.innerHTML = prevCaption;
                //check for beg 
                var prev = document.getElementById(items[currItemIndex+adj].title);
                if(prev.id ==items[0].title){
                    reachedBeg = true;
                    var arrow = document.getElementById(prev.id+"arrow");
                }
            }
        }
    }
}


function getPosition(e, items){
    var imageId;
    var position;
    if(e.target.className == "rightArrow" || e.target.className == "leftArrow"){
        imageId = e.target.id;        
        for(var i=0; i<items.length; i++){
            if(items[i].title+"arrow" == imageId){
                position = i;
            }
        }
    }
    return position;
}


//remove overlay and container image when clicked
function overlayClicked(evt){
    if(evt.target.className == "overlay"){
    	evt.target.parentNode.removeChild(evt.target);
    	var container = document.getElementById("container");
    	container.parentNode.removeChild(container);
        document.body.style.overflow = "auto";
        //restore adjustment variable
        adj = 0;
        reachedEnd = false;
    }
}


//var leftKeyPressed = false;
//var rightKeyPressed = false;
////keyboard directions
//function checkKey(e, items) {
//
//    e = e || window.event;
//    if (e.keyCode == '37') {
//       // left arrow
//        leftKeyPressed = true;
//        displayPrev(e, items);
//
//
//    }
//    else if (e.keyCode == '39') {
//       // right arrow
//        rightKeyPressed = true;
//
//    }
//
//}

document.addEventListener("click", overlayClicked, false);

