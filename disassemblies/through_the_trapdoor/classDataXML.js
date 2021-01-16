// Wrapper class for XML that contains data from snapshot.
const DATAXML_ADDRESSMAX = 65536;
const DATAXML_BYTEMAX = 256;

// Constructor
function DataXML() {

	// Set up clean snapshot
	this.bytes = [];
	for (_counter = 0; _counter < DATAXML_ADDRESSMAX; _counter++) {
		this.bytes.push(0);
	}
}

// -------------------------------------------------------------------------

DataXML.prototype.receiveXML = function(_XML) {
	var _blockNodes;
	var _blockNode;
	var _nodeCounter;
	var _nodeCounterMax;
	var _currentAddress;
	var _byteString;
	var _byteArray;
	var _byteCounter;
	var _byteCounterMax;

	_blockNodes = _XML.getElementsByTagName("Block");
	_nodeCounterMax = _blockNodes.length;
	for (_nodeCounter = 0; _nodeCounter < _nodeCounterMax; _nodeCounter++) {
		_blockNode = _blockNodes[_nodeCounter];
		_currentAddress = parseInt(_blockNode.getAttribute('address'));
		_byteString = _blockNode.getAttribute('data');
		_byteArray = _byteString.split(',');
		_byteCounterMax = _byteArray.length;
		for (_byteCounter = 0; _byteCounter < _byteCounterMax; _byteCounter++) {
			this.bytes[_currentAddress] = parseInt(_byteArray[_byteCounter]);
			_currentAddress++;
		}
	}
}

// -------------------------------------------------------------------------

// Return a deep copy so each canvas has its own local copy. This is to prevent operations that involve writing to GLD data addresses on one canvas affecting the others
DataXML.prototype.clone = function() {
	var _returnValue;
	var _currentAddress;

	_returnValue = new DataXML();
	for (_currentAddress = 0; _currentAddress < DATAXML_ADDRESSMAX; _currentAddress++) {
		_returnValue.bytes[_currentAddress] = this.bytes[_currentAddress];
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

// Enable write access to data
DataXML.prototype.poke = function(_address, _value) {

	if ((_address >= 0) &&
	    (_address < DATAXML_ADDRESSMAX) &&
	    (_value >= 0) &&
	    (_value < DATAXML_BYTEMAX)) {
		this.bytes[_address] = _value;
	} else {
		alert('Error: Invalid address or value (address = ' + String(_address) + ', value = ' + String(_value) + ').');
	}
}

// -------------------------------------------------------------------------

// Enable read access to data
DataXML.prototype.peek = function(_address) {
	var _returnValue;

	if ((_address >= 0) &&
	    (_address < DATAXML_ADDRESSMAX)) {
		_returnValue = this.bytes[_address];
	} else {
		alert('Error: Invalid address (address = ' + String(_address) + '). Returning zero.');
		_returnValue = 0;
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

// Read two bytes as a word
DataXML.prototype.getWordAt = function(_address) {
	var _returnValue;

	if ((_address >= 0) &&
	    (_address < DATAXML_ADDRESSMAX - 1)) {
		_returnValue = this.bytes[_address] + (256 * this.bytes[_address + 1]);
	} else {
		alert('Error: Invalid address (address = ' + String(_address) + '). Returning zero.');
		_returnValue = 0;
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

function signedToUnsigned(_signedByte) {
	var _returnValue;

	_returnValue = _signedByte;
	while (_returnValue < 0) {
		_returnValue += 256;
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

function unsignedToSigned(_unsignedByte) {
	var _returnValue;

	_returnValue = _unsignedByte;
	while (_returnValue > 127) {
		_returnValue -= 256;
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

// Read a signed byte
DataXML.prototype.getSignedByteAt = function(_address) {
	var _returnValue;

	_returnValue = this.peek(_address);
	_returnValue = unsignedToSigned(_returnValue);

	return _returnValue;
}

// -------------------------------------------------------------------------
