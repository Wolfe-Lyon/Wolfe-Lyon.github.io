// Constructor
function BufferPair() {

	this.primaryBuffer = new DisplayBuffer();
	this.secondaryBuffer = new DisplayBuffer();

	// Set starting point for drawing. Initially (0, 0), and updated when graphic layout data cursor
	// moves to negative x- or y-coordinate.
	this.minX = undefined;
	this.minY = undefined;
	this.maxX = undefined;
	this.maxY = undefined;
}

// -------------------------------------------------------------------------

// Determine whether or not a cell in the Primary Buffer is different to the corresponding cell in the
// Secondary Buffer (i.e. needs to be redrawn).
BufferPair.prototype.cellRedrawRequired = function(_x, _y) {
	var _returnValue;

	if ((this.primaryBuffer.getGraphicSetIndexAt(_x, _y) == 0) || (this.primaryBuffer.getGraphicIndexAt(_x, _y) == 0)) {
		_returnValue = true;
	} else {
		if ((this.primaryBuffer.getGraphicSetIndexAt(_x, _y) == this.secondaryBuffer.getGraphicSetIndexAt(_x, _y)) &&
		    (this.primaryBuffer.getGraphicIndexAt(_x, _y) == this.secondaryBuffer.getGraphicIndexAt(_x, _y)) &&
		    (this.primaryBuffer.getAttributeAt(_x, _y) == this.secondaryBuffer.getAttributeAt(_x, _y))) {
			_returnValue = false;
		} else {
			_returnValue = true;
		}
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

BufferPair.prototype.exchangeBuffers = function() {
	var _tmp;

	_tmp = this.primaryBuffer;
	this.primaryBuffer = this.secondaryBuffer;
	this.secondaryBuffer = _tmp;
}

// -------------------------------------------------------------------------

BufferPair.prototype.clear = function() {

	this.primaryBuffer.clear();
}

// -------------------------------------------------------------------------

BufferPair.prototype.addPrefixRow = function() {

	this.primaryBuffer.addPrefixRow();
	this.secondaryBuffer.addPrefixRow();
	this.yOffset++;
}

// -------------------------------------------------------------------------

BufferPair.prototype.addSuffixRow = function() {

	this.primaryBuffer.addSuffixRow();
	this.secondaryBuffer.addSuffixRow();
}

// -------------------------------------------------------------------------

BufferPair.prototype.addPrefixColumn = function() {

	this.primaryBuffer.addPrefixColumn();
	this.secondaryBuffer.addPrefixColumn();
	this.xOffset++;
}

// -------------------------------------------------------------------------

BufferPair.prototype.addSuffixColumn = function() {

	this.primaryBuffer.addSuffixColumn();
	this.secondaryBuffer.addSuffixColumn();
}

// -------------------------------------------------------------------------

BufferPair.prototype.updateDimensions = function(_x, _y) {
	var _delta;
	var _counter;

	// check against minimum X and add more columns if necessary
	if (this.minX == undefined) {
		this.minX = _x;
	} else if (this.minX > _x) {
		_delta = (this.minX - _x);
		for (_counter = 0; _counter < _delta; _counter++) {
			this.primaryBuffer.addPrefixColumn();
			this.secondaryBuffer.addPrefixColumn();
		}
		this.minX = _x;
	}

	// check against maximum X and add more columns if necessary
	if (this.maxX == undefined) {
		this.maxX = _x;
	} else if (this.maxX < _x) {
		_delta = (_x - this.maxX);
		for (_counter = 0; _counter < _delta; _counter++) {
			this.primaryBuffer.addSuffixColumn();
			this.secondaryBuffer.addSuffixColumn();
		}
		this.maxX = _x;
	}

	// check against minimum Y and add more rows if necessary
	if (this.minY == undefined) {
		this.minY = _y;
	} else if (this.minY > _y) {
		_delta = (this.minY - _y);
		for (_counter = 0; _counter < _delta; _counter++) {
			this.primaryBuffer.addPrefixRow();
			this.secondaryBuffer.addPrefixRow();
		}
		this.minY = _y;
	}

	// check against maximum Y and add more columns if necessary
	if (this.maxY == undefined) {
		this.maxY = _y;
	} else if (this.maxY < _y) {
		_delta = (_y - this.maxY);
		for (_counter = 0; _counter < _delta; _counter++) {
			this.primaryBuffer.addSuffixRow();
			this.secondaryBuffer.addSuffixRow();
		}
		this.maxY = _y;
	}
}

// -------------------------------------------------------------------------

BufferPair.prototype.getGraphicSetIndexAt = function(_x, _y) {

	return (this.primaryBuffer.getGraphicSetIndexAt(_x, _y));
}

// -------------------------------------------------------------------------

BufferPair.prototype.setGraphicSetIndexAt = function(_x, _y, _gsIndex) {

	this.updateDimensions(_x, _y);
	this.primaryBuffer.setGraphicSetIndexAt((_x - this.minX), (_y - this.minY), _gsIndex);
}

// -------------------------------------------------------------------------

BufferPair.prototype.getGraphicIndexAt = function(_x, _y) {

	return (this.primaryBuffer.getGraphicIndexAt((_x - this.minX), (_y - this.minY)));
}

// -------------------------------------------------------------------------

BufferPair.prototype.setGraphicIndexAt = function(_x, _y, _gIndex) {

	this.updateDimensions(_x, _y);
	this.primaryBuffer.setGraphicIndexAt((_x - this.minX), (_y - this.minY), _gIndex);
}

// -------------------------------------------------------------------------

BufferPair.prototype.getAttributeAt = function(_x, _y) {

	return (this.primaryBuffer.getAttributeAt((_x - this.minX), (_y - this.minY)));
}

// -------------------------------------------------------------------------

BufferPair.prototype.setAttributeAt = function(_x, _y, _attribute) {

	this.updateDimensions(_x, _y);
	this.primaryBuffer.setAttributeAt((_x - this.minX), (_y - this.minY), _attribute);
}

// -------------------------------------------------------------------------

// Get graphic index at absolute coordinates (for rendering)
BufferPair.prototype.getGraphicIndexAtAbs = function(_x, _y) {

	return (this.primaryBuffer.getGraphicIndexAt(_x, _y));
}

// -------------------------------------------------------------------------

// Get graphic set index at absolute coordinates (for rendering)
BufferPair.prototype.getGraphicSetIndexAtAbs = function(_x, _y) {

	return (this.primaryBuffer.getGraphicSetIndexAt(_x, _y));
}

// -------------------------------------------------------------------------

// Get attribute at absolute coordinates (for rendering)
BufferPair.prototype.getAttributeAtAbs = function(_x, _y) {

	return (this.primaryBuffer.getAttributeAt(_x, _y));
}

// -------------------------------------------------------------------------

// Get width (in characters)
BufferPair.prototype.getWidth = function() {

	return (this.maxX - this.minX) + 1;
}

// -------------------------------------------------------------------------

// Get height (in characters)
BufferPair.prototype.getHeight = function() {

	return (this.maxY - this.minY) + 1;
}

// -------------------------------------------------------------------------
