// Constants
const GRAPHICLAYOUTDATAXMLPATH = "../images/udgs/graphiclayoutdata.xml";
const UDGPATHROOT = "../images/udgs/elements/";
const BLANKUDGPATH = UDGPATHROOT + "28462.png";
const PIXELS_PER_CHAR = 8;
const IMG_SCALE_FACTOR = 2;  // Skoolkit scales generated images by factor of two
const PIXELS_PER_UDG = PIXELS_PER_CHAR * IMG_SCALE_FACTOR;   // Number of canvas pixels in an image character block
const ZERO_BRIGHT     =   0;
const HALF_BRIGHT     = 192;
const FULL_BRIGHT     = 255;
const NORMAL_COLOURS = [(256 * 256 * ZERO_BRIGHT) + (256 * ZERO_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * ZERO_BRIGHT) + HALF_BRIGHT,
                        (256 * 256 * HALF_BRIGHT) + (256 * ZERO_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * HALF_BRIGHT) + (256 * ZERO_BRIGHT) + HALF_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * HALF_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * HALF_BRIGHT) + HALF_BRIGHT,
                        (256 * 256 * HALF_BRIGHT) + (256 * HALF_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * HALF_BRIGHT) + (256 * HALF_BRIGHT) + HALF_BRIGHT];
const BRIGHT_COLOURS = [(256 * 256 * ZERO_BRIGHT) + (256 * ZERO_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * ZERO_BRIGHT) + FULL_BRIGHT,
                        (256 * 256 * FULL_BRIGHT) + (256 * ZERO_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * FULL_BRIGHT) + (256 * ZERO_BRIGHT) + FULL_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * FULL_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * ZERO_BRIGHT) + (256 * FULL_BRIGHT) + FULL_BRIGHT,
                        (256 * 256 * FULL_BRIGHT) + (256 * FULL_BRIGHT) + ZERO_BRIGHT,
                        (256 * 256 * FULL_BRIGHT) + (256 * FULL_BRIGHT) + FULL_BRIGHT];
const TIMERINTERVAL = 250;
// Start addresses of bitmap data for each graphics set, taken from disassembly at address 27000
const GRAPHICSETSTARTADDRESSES = [    0,  // ; [00] Unused
                                   3850,  // ; [01] ?????
                                  32334,  // ; [02] Berk Graphic Blocks (?????)
                                  27278,  // ; [03] Architecture Graphic Blocks (Level 1) (?????)
                                  28070,  // ; [04] Timer figures & eyes?????
                                  27782,  // ; [05] ?????
                                  28838,  // ; [06] ?????
                                  28366,  // ; [07] Drutt, Worms and Timer Figures Graphic Blocks (?????)
                                  29718,  // ; [08] Architecture Graphic Blocks (Level 2) (?????)
                                  29350,  // ; [09] Creatures (level 2 only?) Graphic Blocks (?????)
                                  29990,  // ; [10] ?????
                                  30662,  // ; [11] ?????
                                  31246,  // ; [12] ?????
                                      0,  // ; [13] ?????
                                      0]; // ; [14] ?????
const BLANKGRAPHICKEY = "Blank-Graphic";	// Key in graphic lookup array for a blank graphic



// Variables
var graphicLayoutDataXML;
var snapshotData;
var canvasArray;
var bufferPairArray;
var dataXMLArray;
var imageLoaderObject;
var gldDrawer;

// -------------------------------------------------------------------------

function initialise() {
	var _canvasNode;
	var _canvasNodeArray;
	var _canvasIndex;
	var _canvasObject;
	var _bufferPair;

	// Create new ImageLoader object
	imageLoaderObject = new ImageLoader();

	// Read data from snapshot XML file
	dataXML = new DataXML();
	dataXML.receiveXML(loadGLDXML());

	// Create GLD drawer object
	gldDrawer = new GLDDrawer();

	// Get <canvas> nodes and inject them into wrapper objects. Also set up one buffer pair per canvas.
	canvasArray = [];
	bufferPairArray = [];
	dataXMLArray = [];
	_canvasNodeArray = document.getElementsByTagName("canvas");
	for (_canvasIndex = 0; _canvasIndex < _canvasNodeArray.length; _canvasIndex++) {
		_canvasNode = _canvasNodeArray[_canvasIndex];
		if (_canvasNode.hasAttribute("data-graphic-layout-data-address")) {
			_canvasObject = new GLDCanvas();
			_canvasObject.receiveImageLoader(imageLoaderObject);
			_canvasObject.receiveCanvas(_canvasNode);
			dataXMLArray.push(dataXML.clone());
			canvasArray.push(_canvasObject);
			_bufferPair = new BufferPair();
			bufferPairArray.push(_bufferPair);
		}
	}
}

// -------------------------------------------------------------------------

function loadGLDXML() {
	var _returnValue;
	var _xmlhttp;

	_xmlhttp = new XMLHttpRequest();
	_xmlhttp.open("GET", GRAPHICLAYOUTDATAXMLPATH, false);
	_xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	_xmlhttp.send("");
	_returnValue = _xmlhttp.responseXML;

	return _returnValue;
}

// -------------------------------------------------------------------------

function renderAllCanvases() {
	var _canvasIndex;
	var _canvasIndexMax;
	var _currentCanvas;
	var _currentBufferPair;
	var _currentDataXML;

	_canvasIndexMax = canvasArray.length;
	for (_canvasIndex = 0; _canvasIndex < _canvasIndexMax; _canvasIndex++) {
		_currentCanvas = canvasArray[_canvasIndex];
		_currentBufferPair = bufferPairArray[_canvasIndex];
		_currentDataXML = dataXMLArray[_canvasIndex];
		_currentBufferPair.exchangeBuffers();
		_currentBufferPair.clear();
		gldDrawer.receiveDataXML(_currentDataXML);
		gldDrawer.moveTo(0, 0);
		gldDrawer.drawToBufferPair(_currentBufferPair, parseInt(_currentCanvas.GLDAddress));
		_currentCanvas.render(_currentBufferPair);
	}
	setTimeout(renderAllCanvases, TIMERINTERVAL);
}

// -------------------------------------------------------------------------

function getImagePath(_graphicSetIndex, _graphicIndex) {
	var _returnValue;
	var _udgAddress;

	if ((_graphicSetIndex == 0) || (_graphicIndex == 0)) {
		_returnValue = BLANKUDGPATH;
	} else {
		_udgAddress = GRAPHICSETSTARTADDRESSES[_graphicSetIndex] + 8 * _graphicIndex;
		_returnValue = UDGPATHROOT;
		_returnValue += String(_udgAddress) + '.png';
	}

	return _returnValue;
}

// -------------------------------------------------------------------------

window.onload = function() {
	initialise();
	renderAllCanvases();
}
