// Constructor
function ImageLoader() {

	this.imageCacheObject = new Object();
}

// -------------------------------------------------------------------------

ImageLoader.prototype.getImage = function(_imgURL, _callback, _paramArray) {

	if (typeof this.imageCacheObject[_imgURL] == "undefined") {
		var _imgCache = this.imageCacheObject;   // Create new pointer to image cache to enable use within scope of nested function
		var _imageObj = new Image();
		_imageObj.onload = function() {
			_imgCache[_imgURL] = this;
			_paramArray.push(this);
			_callback(_paramArray);
		}
		_imageObj.src = _imgURL;
	} else {
		_paramArray.push(this.imageCacheObject[_imgURL]);
		_callback(_paramArray);
	}
}

// -------------------------------------------------------------------------
