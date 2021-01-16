// Class for <canvas> element that is capable of rendering graphic layout data from Don Priestley's graphics system.

// Constructor
function GLDCanvas() {

	this.GLDAddress = 0;
	this.canvas = undefined;
	this.context = undefined;
	this.defaultGraphicSetIndex = 0;
	this.imgLoader = undefined;
	this.currWidth;
	this.currHeight;
	this.currXP;
	this.currYP;
}

// -------------------------------------------------------------------------

GLDCanvas.prototype.receiveImageLoader = function(_imgLoader) {

	this.imgLoader = _imgLoader;
}

// -------------------------------------------------------------------------

GLDCanvas.prototype.receiveCanvas = function(_canvas) {

	this.canvas = _canvas;
	this.context = this.canvas.getContext("2d");
	if (this.canvas.hasAttribute("data-graphic-layout-data-address") == true) {
		this.GLDAddress = parseInt(this.canvas.getAttribute("data-graphic-layout-data-address"));
	}

	if (this.canvas.hasAttribute("data-graphic-set-index")) {
		this.defaultGraphicSetIndex = parseInt(this.canvas.getAttribute("data-graphic-set-index"));
	}
}

// -------------------------------------------------------------------------

// "this" variable name has different meaning in a callback. We therefore need to pass back to this method
// a reference to the current classGLDCanvas instance.
GLDCanvas.prototype.drawUDG = function(_paramArray) {
	var _img;
	var _gldCanvasInstance;
	var _xp;
	var _yp;
	var _attribute;
	var _imgData;
	var _data;
	var _paperIndex, _inkIndex;
	var _paperR, _paperG, _paperB;
	var _inkR, _inkG, _inkB;
	var _i;

	_img = _paramArray.pop();
	_gldCanvasInstance = _paramArray.pop();
	_xp = _paramArray[0];
	_yp = _paramArray[1];
	_attribute = _paramArray[2];
	_gldCanvasInstance.context.drawImage(_img, PIXELS_PER_UDG * _xp, PIXELS_PER_UDG * _yp);
	_imgData = _gldCanvasInstance.context.getImageData(_xp * PIXELS_PER_UDG, _yp * PIXELS_PER_UDG, PIXELS_PER_UDG, PIXELS_PER_UDG);
	_data = _imgData.data;

	if ((_attribute & 128) != 0) {
		flipImageDataLR(_imgData);
		_attribute &= 127;
	}

	// Check unknown (BRIGHT) Flag
	if ((_attribute & 64) != 0) {
		_attribute &= 63;
	}
	_intensity = FULL_BRIGHT;	// Always BRIGHT (BRIGHT flag in attribute data represents something else?????)

	_inkIndex = _attribute & 7;
	_paperIndex = (_attribute & 56) >> 3;
	if ((_paperIndex == 0) || (_paperIndex == 2) || (_paperIndex == 4) || (_paperIndex == 6)) {_paperB == 0;} else {_paperB = _intensity;}
	if ((_paperIndex == 0) || (_paperIndex == 1) || (_paperIndex == 2) || (_paperIndex == 3)) {_paperG == 0;} else {_paperG = _intensity;}
	if ((_paperIndex == 0) || (_paperIndex == 1) || (_paperIndex == 4) || (_paperIndex == 5)) {_paperR == 0;} else {_paperR = _intensity;}
	if ((_inkIndex == 0) || (_inkIndex == 2) || (_inkIndex == 4) || (_inkIndex == 6)) {_inkB == 0;} else {_inkB = _intensity;}
	if ((_inkIndex == 0) || (_inkIndex == 1) || (_inkIndex == 2) || (_inkIndex == 3)) {_inkG == 0;} else {_inkG = _intensity;}
	if ((_inkIndex == 0) || (_inkIndex == 1) || (_inkIndex == 4) || (_inkIndex == 5)) {_inkR == 0;} else {_inkR = _intensity;}
	for (_i = 0; _i < _data.length; _i += 4) {
		_currentPixelColour = _data[_i];
		if (_currentPixelColour == 0) {
			_imgData.data[_i    ] = _paperR;
			_imgData.data[_i + 1] = _paperG;
			_imgData.data[_i + 2] = _paperB;
		} else if (_currentPixelColour == 255) {
			_imgData.data[_i    ] = _inkR;
			_imgData.data[_i + 1] = _inkG;
			_imgData.data[_i + 2] = _inkB;
		}
	}

	_gldCanvasInstance.context.putImageData(_imgData, _xp * PIXELS_PER_UDG, _yp * PIXELS_PER_UDG);
}

// -------------------------------------------------------------------------

function flipImageDataLR(_imgData) {
	// Flips the imagedata representing a single UDG left-right
	var _xpSrc, _xpDst, _yp;
	var _dataIndexSrc, _dataIndexDst;
	var _halfWidth;
	var _swapBuffer;
	var _channelCounter;

	_halfWidth = PIXELS_PER_UDG / 2;
	for (_yp = 0; _yp < PIXELS_PER_UDG; _yp++) {
		for (_xpSrc = 0; _xpSrc < _halfWidth; _xpSrc++) {
			_dataIndexSrc = (4 * (_xpSrc + _yp * PIXELS_PER_UDG));
			_xpDst = PIXELS_PER_UDG - (_xpSrc + 1);
			_dataIndexDst = (4 * (_xpDst + _yp * PIXELS_PER_UDG));
			for (_channelCounter = 0; _channelCounter < 4; _channelCounter++) {
				_swapBuffer = _imgData.data[_dataIndexDst + _channelCounter];
				_imgData.data[_dataIndexDst + _channelCounter] = _imgData.data[_dataIndexSrc + _channelCounter];
				_imgData.data[_dataIndexSrc + _channelCounter] = _swapBuffer;
			}
		}
	}
}

// -------------------------------------------------------------------------

GLDCanvas.prototype.render = function(_bufferPair) {
	var _width;
	var _height;
	var _widthOld;
	var _heightOld;
	var _xp;
	var _yp;
	var _img;
	var _imgPath;
	var _graphicIndex;
	var _graphicSetIndex;
	var _attribute;
	var _canvasResized;

	_width = _bufferPair.getWidth();
	_height = _bufferPair.getHeight();
	_widthOld = this.canvas.getAttribute('width');
	_heightOld = this.canvas.getAttribute('height');

	_canvasResized = false;
	if ((_width * PIXELS_PER_UDG)  != _widthOld)  {
		this.canvas.setAttribute('width', (_width * PIXELS_PER_UDG));
		_canvasResized = true;
	}
	if ((_height * PIXELS_PER_UDG) != _heightOld) {
		this.canvas.setAttribute('height', (_height * PIXELS_PER_UDG));
		_canvasResized = true;
	}

	for (_yp = 0; _yp < _height; _yp++) {
		for (_xp = 0; _xp < _width; _xp++) {
//			if ((_canvasResized == true) || (_bufferPair.cellRedrawRequired(_xp, _yp) == true)) {
				_graphicSetIndex = _bufferPair.getGraphicSetIndexAtAbs(_xp, _yp);
				_graphicIndex = _bufferPair.getGraphicIndexAtAbs(_xp, _yp);
				_attribute = _bufferPair.getAttributeAtAbs(_xp, _yp);
				_imgPath = getImagePath(_graphicSetIndex, _graphicIndex);
// "this" variable name has different meaning in a callback. We therefore need to pass a reference to the
// current classGLDCanvas instance.
				_img = this.imgLoader.getImage(_imgPath, this.drawUDG, [_xp, _yp, _attribute, this]);
//			}
		}
	}
}

// -------------------------------------------------------------------------
