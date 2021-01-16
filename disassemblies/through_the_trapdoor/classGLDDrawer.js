// Constructor
function GLDDrawer() {

	this.dataXML = undefined;
	this.currentX = 0;
	this.currentY = 0;
	this.currentGraphicSetIndex = 0;
	this.callStack = [];
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.receiveDataXML = function(_dataXML) {

	this.dataXML = _dataXML;
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.moveTo = function(_x, _y) {

	this.currentX = _x;
	this.currentY = _y;
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.drawToBufferPair = function(_bufferPair, _address) {

	this.currentAttribute = 0;
	this.storedX = this.currentX;
	this.storedY = this.currentY;
	this.processCurrentInstruction(_bufferPair, _address);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.doDrawAndContinue = function(_bufferPair, _address) {
	var _graphicIndex;
	var _attribute;
	var _currentAddress;
	var _flags;
	var _inkAndPaper;
	var _attributeInBuffer;
	var _cursorShiftValue;

	_bufferPair.setGraphicSetIndexAt(this.currentX, this.currentY, this.currentGraphicSetIndex);
	_bufferPair.setGraphicIndexAt(this.currentX, this.currentY, this.dataXML.peek(_address));
	if (this.currentAttribute == 0) {
		_attribute = this.dataXML.peek(_address + 1);
		_currentAddress = _address + 1;
	} else {
		_currentAddress = _address;
		_attribute = this.currentAttribute;
	}

	// Check Override Attribute Flag
	_cursorShiftValue = this.dataXML.peek(_currentAddress + 1);
	if (_cursorShiftValue < 128) {
		if ((_attribute & 56) == 0) {
			_flags = (_attribute & 192);
			_inkAndPaper = (_attribute & 63);
			_attributeInBuffer = _bufferPair.getAttributeAt(this.currentX, this.currentY);
			if ((_attributeInBuffer & 64) != 0) {
				_attributeInBuffer = (_attributeInBuffer << 3);
			}
			_attributeInBuffer = (_attributeInBuffer & 56);
			_attributeInBuffer = (_attributeInBuffer | _flags | _inkAndPaper);
			_attribute = _attributeInBuffer;
		}
	}
	_bufferPair.setAttributeAt(this.currentX, this.currentY, _attribute);

	if (_cursorShiftValue == 255) {
		this.do255AndContinue(_bufferPair);
	} else {
		this.doCursorShift(_cursorShiftValue);
		this.processCurrentInstruction(_bufferPair, _currentAddress + 2);
	}
}

// -------------------------------------------------------------------------

// Update current position based upon cursor shift byte
//
// Read cursor shift byte. This byte controls where the pointer to write to Primary Screen Buffer is moved
// to after writing the current character block. 33 advances the pointer right by one character. A value,
// n, less than 33 moves the pointer down a character row, and left by (33-n-1) characters. A value
// greater than 33 moves the pointer right by (1+n-33) characters.
GLDDrawer.prototype.doCursorShift = function(_cursorShiftValue) {
	var _deltaX, _deltaY;
	var _cursorShiftActual;

	// Reset Override Attribute Flag
	_cursorShiftActual = (_cursorShiftValue & 127);

	if        (_cursorShiftActual == 33) {
		_deltaX = 1;
		_deltaY = 0;
	} else if (_cursorShiftActual < 33) {
		_deltaY = 1;
		_deltaX = _cursorShiftActual - 32;
	} else if (_cursorShiftActual > 33) {
		_deltaX = _cursorShiftActual - 32;
		_deltaY = 0;
	}

	this.currentX += _deltaX;
	this.currentY += _deltaY;
}

// -------------------------------------------------------------------------

// Pick random number from list, set as next instruction after list and jump to this instruction
GLDDrawer.prototype.do236AndContinue = function(_bufferPair, _address) {
	var _random;
	var _randomMax;
	var _selectedValue;
	var _nextAddress;

	_randomMax = this.dataXML.peek(_address + 1);
	_random = Math.floor(_randomMax * Math.random());
	_selectedValue = this.dataXML.peek(_address + _random + 2);
	_nextAddress = _address + _randomMax + 2;
	this.dataXML.poke(_nextAddress, _selectedValue);

	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Play a sound
GLDDrawer.prototype.do237AndContinue = function(_bufferPair, _address) {

	this.processCurrentInstruction(_bufferPair, _address + 2);
}

// -------------------------------------------------------------------------

// Start of a loop (1 / 2)
GLDDrawer.prototype.do238AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	this.repeatCount238 = this.dataXML.peek(_address + 1);
	_nextAddress = _address + 2;
	this.repeatAddress238 = _nextAddress;
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// End of a loop (1 / 2)
GLDDrawer.prototype.do239AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	this.repeatCount238--;
	if (this.repeatCount238 == 0) {
		_nextAddress = _address + 1;
	} else {
		_nextAddress = this.repeatAddress238;
	}

	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Start of a loop (2 / 2)
GLDDrawer.prototype.do240AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	this.repeatCount240 = this.dataXML.peek(_address + 1);
	_nextAddress = _address + 2;
	this.repeatAddress240 = _nextAddress;
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// End of a loop (2 / 2)
GLDDrawer.prototype.do241AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	this.repeatCount240--;
	if (this.repeatCount240 == 0) {
		_nextAddress = _address + 1;
	} else {
		_nextAddress = this.repeatAddress240;
	}

	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Set current attribute
GLDDrawer.prototype.do242AndContinue = function(_bufferPair, _address) {

	this.currentAttribute = this.dataXML.peek(_address + 1);
	this.processCurrentInstruction(_bufferPair, _address + 2);
}

// -------------------------------------------------------------------------

// Increase current state, n, (up to cap, resetting to zero if cap reached) and jump to n-th address in following data
GLDDrawer.prototype.do243AndContinue = function(_bufferPair, _address) {
	var _currentState;
	var _nextAddress;

	_currentState = this.dataXML.peek(_address + 1) + 1;
	if (_currentState >= this.dataXML.peek(_address + 2)) {
		_currentState = 0;
	}
	this.dataXML.poke(_address + 1, _currentState);
	_nextAddress = this.dataXML.getWordAt(_address + 3 + (2 * _currentState));

	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Set current Graphic Set Index
GLDDrawer.prototype.do244AndContinue = function(_bufferPair, _address) {

	this.currentGraphicSetIndex = this.dataXML.peek(_address + 1);
	this.processCurrentInstruction(_bufferPair, _address + 2);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do245AndContinue = function(_bufferPair, _address) {
	var _remainingTime;
	var _nextAddress;
	var _randomMax;
	var _random;
	var _selectedValue;

	_remainingTime = this.dataXML.peek(_address + 1) - 1;
	_randomMax = this.dataXML.peek(_address + 3);
	_nextAddress = _address + 4 + _randomMax;
	if (_remainingTime == 0) {
		_remainingTime = this.dataXML.peek(_address + 2);
		_random = Math.floor(_randomMax * Math.random());
		_selectedValue = this.dataXML.peek(_address + 4 + _random);
		this.dataXML.poke(_nextAddress, _selectedValue);
	}
	this.dataXML.poke(_address + 1, _remainingTime);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do246AndContinue = function(_bufferPair, _address) {
	var _remainingTime;
	var _nextAddress;
	var _randomMax;
	var _random;
	var _selectedValue;

	_remainingTime = this.dataXML.peek(_address + 1) - 1;
	_randomMax = this.dataXML.peek(_address + 3);
	_nextAddress = _address + 4 + _randomMax;
	if (_remainingTime == 0) {
		_remainingTime = this.dataXML.peek(_address + 2);
		_random = Math.floor(_randomMax * Math.random());
		_selectedValue = this.dataXML.peek(_address + 4 + _random);
		this.dataXML.poke(_nextAddress + 1, _selectedValue);
	}
	this.dataXML.poke(_address + 1, _remainingTime);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Generate random number m, 0 - n-1, read m-th WORD and jump to this address
GLDDrawer.prototype.do247AndContinue = function(_bufferPair, _address) {
	var _nextAddress;
	var _randomMax;
	var _random;

	_randomMax = this.dataXML.peek(_address + 1);
	_random = Math.floor(_randomMax * Math.random());
	_nextAddress = this.dataXML.getWordAt(_address + 2 + (2 * _random));
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

// Jump to another address containing graphic layout data
GLDDrawer.prototype.do248AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	_nextAddress = this.dataXML.getWordAt(_address + 1);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do249AndContinue = function(_bufferPair, _address) {
	var _currentState;
	var _stateDataAddress;
	var _remainingTime;
	var _randomStateMax;
	var _randomState;
	var _randomTimeMax;
	var _randomTime;
	var _nextAddress;

	_currentState = this.dataXML.peek(_address + 2);
	_stateDataAddress = _address + (4 * _currentState) + 3;
	_remainingTime = this.dataXML.peek(_stateDataAddress) - 1;
	this.dataXML.poke(_stateDataAddress, _remainingTime);
	if (_remainingTime == 0) {
		_randomStateMax = this.dataXML.peek(_address + 1);
		_randomState = Math.floor(_randomStateMax * Math.random());
		this.dataXML.poke(_address + 2, _randomState);
		_stateDataAddress = _address + (4 * _randomState) + 3;

		_randomTimeMax = this.dataXML.peek(_stateDataAddress + 1);
		_randomTime = Math.floor(_randomTimeMax * Math.random()) + 1;
		this.dataXML.poke(_stateDataAddress, _randomTime);
	}
	_nextAddress = this.dataXML.getWordAt(_stateDataAddress + 2);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do250AndContinue = function(_bufferPair, _address) {

	this.currentY += this.dataXML.getSignedByteAt(_address + 1);
	this.currentX += this.dataXML.getSignedByteAt(_address + 2);
	this.processCurrentInstruction(_bufferPair, _address + 3);
}

// -------------------------------------------------------------------------

// "Call" another block of graphic layout data and return when done
GLDDrawer.prototype.do251AndContinue = function(_bufferPair, _address) {
	var _nextAddress;

	this.callStack.push(_address + 3);
	_nextAddress = this.dataXML.getWordAt(_address + 1);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do252AndContinue = function(_bufferPair, _address) {

	alert('Instruction 252 is not used. Therefore it is not implemented here.');
}

// -------------------------------------------------------------------------

// Jump to n-th address, where n is the width of the entity currently held by Berk, minus one
GLDDrawer.prototype.do253AndContinue = function(_bufferPair, _address) {
	var _entityWidth;
	var _nextAddress;

	// Maximum allowed width is 4
	_entityWidth = Math.floor(4 * Math.random());
	_nextAddress = this.dataXML.getWordAt(_address + (2 * _entityWidth) + 1);
	this.processCurrentInstruction(_bufferPair, _nextAddress);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do254AndContinue = function(_bufferPair, _address) {

	this.currentY += this.dataXML.getSignedByteAt(_address + 1);
	this.storedY = this.currentY;
	this.currentX += this.dataXML.getSignedByteAt(_address + 2);
	this.storedX = this.currentX;
	this.processCurrentInstruction(_bufferPair, _address + 3);
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.do255AndContinue = function(_bufferPair) {
	var _nextAddress;

	if (this.callStack.length > 0) {
		_nextAddress = this.callStack.pop();
		this.currentX = this.storedX;
		this.currentY = this.storedY;
		this.currentAttribute = 0;
		this.processCurrentInstruction(_bufferPair, _nextAddress);
	}
}

// -------------------------------------------------------------------------

GLDDrawer.prototype.processCurrentInstruction = function(_bufferPair, _address) {
	var _instructionCode;

	_instructionCode = this.dataXML.peek(_address);
	if (_instructionCode < 236) {	// Draw a graphic
		this.doDrawAndContinue(_bufferPair, _address);
	} else if (_instructionCode == 236) {	// Pick random number from list, set as next instruction after list and jump to this instruction
		this.do236AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 237) {	// Play a sound
		this.do237AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 238) {	// Start of a loop (1 / 2)
		this.do238AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 239) {	// End of a loop (1 / 2)
		this.do239AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 240) {	// Start of a loop (2 / 2)
		this.do240AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 241) {	// End of a loop (2 / 2)
		this.do241AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 242) {	// Set current attribute
		this.do242AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 243) {	// Increase current state, n, (up to cap, resetting to zero if cap reached) and jump to n-th address in following data
		this.do243AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 244) {	// Set current Graphic Set Index
		this.do244AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 245) {
		this.do245AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 246) {
		this.do246AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 247) {	// Generate random number m, 0 - n-1, read m-th WORD and jump to this address
		this.do247AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 248) {
		this.do248AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 249) {
		this.do249AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 250) {
		this.do250AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 251) {	// "Call" another block of graphic layout data and return when done
		this.do251AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 252) {
		this.do252AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 253) {	// Jump to n-th address, where n is the width of the entity currently held by Berk, minus one
		this.do253AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 254) {
		this.do254AndContinue(_bufferPair, _address);
	} else if (_instructionCode == 255) {
		this.do255AndContinue(_bufferPair);
	}
}

// -------------------------------------------------------------------------
