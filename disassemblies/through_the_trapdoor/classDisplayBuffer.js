// Constructor
function DisplayBuffer() {
	var _tmpRowArray;

	// Create new "row" array for display buffer, and add in one single "null" entry (graphic set index, graphic index, attribute)
	_tmpRowArray = DisplayBufferCreateNewEntry();
	this.bufferData = [_tmpRowArray];
	this.width = 1;
	this.height = 1;
}

// -------------------------------------------------------------------------

function DisplayBufferCreateNewEntry() {
	var _returnValue;

	_returnValue = [0, 0, 0];

	return _returnValue;
}

// -------------------------------------------------------------------------

// Get the index (in the bufferData array's rows) of the entry for graphic set index for given x coordinate
function GetXIndexOfGraphicSetIndex(_x) {

	return (3 * _x);
}

// -------------------------------------------------------------------------

// Get the index (in the bufferData array's rows) of the entry for graphic index for given x coordinate
function GetXIndexOfGraphicIndex(_x) {

	return (3 * _x) + 1;
}

// -------------------------------------------------------------------------

// Get the index (in the bufferData array's rows) of the entry for attribute for given x coordinate
function GetXIndexOfAttribute(_x) {

	return (3 * _x) + 2;
}

// -------------------------------------------------------------------------

// Clear the display buffer (i.e. populate with zeroes)
DisplayBuffer.prototype.clear = function() {
	var _columnIndex;
	var _columnIndexMax;
	var _rowIndex;
	var _currentRow;

	_columnIndexMax = 3 * this.width;
	for (_rowIndex = 0; _rowIndex < this.height; _rowIndex++) {
		_currentRow = this.bufferData[_rowIndex];
		for (_columnIndex = 0; _columnIndex < _columnIndexMax; _columnIndex++) {
			_currentRow[_columnIndex] = 0;
		}
	}
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.addPrefixRow = function() {
	var _tmpEntryArray;
	var _tmpRowArray;
	var _columnIndex;

	// Increase height, create a new row array and add to the start of the array of rows.
	this.height++;
	_tmpRowArray = [];
	for (_columnIndex = 0; _columnIndex < this.width; _columnIndex++) {
		_tmpEntryArray = DisplayBufferCreateNewEntry();
		_tmpRowArray = _tmpRowArray.concat(_tmpEntryArray);
	}
	this.bufferData.unshift(_tmpRowArray);
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.addSuffixRow = function() {
	var _tmpEntryArray;
	var _tmpRowArray;
	var _columnIndex;

	// Increase height, create a new row array and add to the end of the array of rows.
	this.height++;
	_tmpRowArray = [];
	for (_columnIndex = 0; _columnIndex < this.width; _columnIndex++) {
		_tmpEntryArray = DisplayBufferCreateNewEntry();
		_tmpRowArray = _tmpRowArray.concat(_tmpEntryArray);
	}
	this.bufferData.push(_tmpRowArray);
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.addPrefixColumn = function() {
	var _tmpEntryArray;
	var _tmpRowArray;
	var _rowIndex;

	// Increase width and add a new entry to the start of each row.
	this.width++;
	for (_rowIndex = 0; _rowIndex < this.height; _rowIndex++) {
		_tmpEntryArray = DisplayBufferCreateNewEntry();
		_tmpRowArray = this.bufferData[_rowIndex];
		_tmpRowArray = _tmpEntryArray.concat(_tmpRowArray);
		this.bufferData[_rowIndex] = _tmpRowArray;
	}
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.addSuffixColumn = function() {
	var _tmpEntryArray;
	var _tmpRowArray;
	var _rowIndex;

	// Increase width and add a new entry to the end of each row.
	this.width++;
	for (_rowIndex = 0; _rowIndex < this.height; _rowIndex++) {
		_tmpEntryArray = DisplayBufferCreateNewEntry();
		_tmpRowArray = this.bufferData[_rowIndex];
		_tmpRowArray = _tmpRowArray.concat(_tmpEntryArray);
		this.bufferData[_rowIndex] = _tmpRowArray;
	}
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.getGraphicSetIndexAt = function(_x, _y) {

	return (this.bufferData[_y][GetXIndexOfGraphicSetIndex(_x)]);
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.setGraphicSetIndexAt = function(_x, _y, _gsIndex) {

	this.bufferData[_y][GetXIndexOfGraphicSetIndex(_x)] = _gsIndex;
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.getGraphicIndexAt = function(_x, _y) {

	return (this.bufferData[_y][GetXIndexOfGraphicIndex(_x)]);
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.setGraphicIndexAt = function(_x, _y, _gIndex) {

	this.bufferData[_y][GetXIndexOfGraphicIndex(_x)] = _gIndex;
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.getAttributeAt = function(_x, _y) {

	return (this.bufferData[_y][GetXIndexOfAttribute(_x)]);
}

// -------------------------------------------------------------------------

DisplayBuffer.prototype.setAttributeAt = function(_x, _y, _attribute) {

	this.bufferData[_y][GetXIndexOfAttribute(_x)] = _attribute;
}

// -------------------------------------------------------------------------
