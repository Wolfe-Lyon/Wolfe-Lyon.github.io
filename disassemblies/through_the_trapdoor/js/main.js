var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("core/constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.IMG_SCALE_FACTOR = 2;
        Constants.PIXELS_PER_UDG = 8 * Constants.IMG_SCALE_FACTOR;
        return Constants;
    }());
    exports.Constants = Constants;
});
define("through_the_trap_door/constants_tttd", ["require", "exports", "core/constants"], function (require, exports, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConstantsTTTD = /** @class */ (function (_super) {
        __extends(ConstantsTTTD, _super);
        function ConstantsTTTD() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ConstantsTTTD.GRAPHIC_SET_ADDRESS_LOCATION = 27000;
        return ConstantsTTTD;
    }(constants_1.Constants));
    exports.ConstantsTTTD = ConstantsTTTD;
});
define("core/display_buffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayBuffer = /** @class */ (function () {
        function DisplayBuffer() {
            var tmpRowArray;
            // Create new "row" array for display buffer, and add in one single "null" entry (graphic set index,
            // graphic index, attribute)
            tmpRowArray = DisplayBuffer.create_new_display_buffer_entry();
            this.bufferData = [tmpRowArray];
            this.width = 1;
            this.height = 1;
        }
        DisplayBuffer.create_new_display_buffer_entry = function () {
            var returnValue;
            returnValue = [0, 0, 0];
            return returnValue;
        };
        // Get the index (in the bufferData array's rows) of the entry for graphic set index for given x coordinate
        DisplayBuffer.get_x_index_of_graphic_set_index = function (x) {
            return (3 * x);
        };
        // Get the index (in the bufferData array's rows) of the entry for graphic index for given x coordinate
        DisplayBuffer.get_x_index_of_graphic_index = function (x) {
            return (3 * x) + 1;
        };
        // Get the index (in the bufferData array's rows) of the entry for attribute for given x coordinate
        DisplayBuffer.get_x_index_of_attribute = function (x) {
            return (3 * x) + 2;
        };
        // Clear the display buffer (i.e. populate with zeroes)
        DisplayBuffer.prototype.clear = function () {
            var columnIndex;
            var columnIndexMax;
            var rowIndex;
            var currentRow;
            columnIndexMax = 3 * this.width;
            for (rowIndex = 0; rowIndex < this.height; rowIndex++) {
                currentRow = this.bufferData[rowIndex];
                for (columnIndex = 0; columnIndex < columnIndexMax; columnIndex++) {
                    currentRow[columnIndex] = 0;
                }
            }
        };
        DisplayBuffer.prototype.add_prefix_row = function () {
            var tmpEntryArray;
            var tmpRowArray;
            var columnIndex;
            // Increase height, create a new row array and add to the start of the array of rows.
            this.height++;
            tmpRowArray = [];
            for (columnIndex = 0; columnIndex < this.width; columnIndex++) {
                tmpEntryArray = DisplayBuffer.create_new_display_buffer_entry();
                tmpRowArray = tmpRowArray.concat(tmpEntryArray);
            }
            this.bufferData.unshift(tmpRowArray);
        };
        DisplayBuffer.prototype.add_suffix_row = function () {
            var tmpEntryArray;
            var tmpRowArray;
            var columnIndex;
            // Increase height, create a new row array and add to the end of the array of rows.
            this.height++;
            tmpRowArray = [];
            for (columnIndex = 0; columnIndex < this.width; columnIndex++) {
                tmpEntryArray = DisplayBuffer.create_new_display_buffer_entry();
                tmpRowArray = tmpRowArray.concat(tmpEntryArray);
            }
            this.bufferData.push(tmpRowArray);
        };
        DisplayBuffer.prototype.add_prefix_column = function () {
            var tmpEntryArray;
            var tmpRowArray;
            var rowIndex;
            // Increase width and add a new entry to the start of each row.
            this.width++;
            for (rowIndex = 0; rowIndex < this.height; rowIndex++) {
                tmpEntryArray = DisplayBuffer.create_new_display_buffer_entry();
                tmpRowArray = this.bufferData[rowIndex];
                tmpRowArray = tmpEntryArray.concat(tmpRowArray);
                this.bufferData[rowIndex] = tmpRowArray;
            }
        };
        DisplayBuffer.prototype.add_suffix_column = function () {
            var tmpEntryArray;
            var tmpRowArray;
            var rowIndex;
            // Increase width and add a new entry to the end of each row.
            this.width++;
            for (rowIndex = 0; rowIndex < this.height; rowIndex++) {
                tmpEntryArray = DisplayBuffer.create_new_display_buffer_entry();
                tmpRowArray = this.bufferData[rowIndex];
                tmpRowArray = tmpRowArray.concat(tmpEntryArray);
                this.bufferData[rowIndex] = tmpRowArray;
            }
        };
        DisplayBuffer.prototype.get_graphic_set_index_at = function (x, y) {
            return (this.bufferData[y][DisplayBuffer.get_x_index_of_graphic_set_index(x)]);
        };
        DisplayBuffer.prototype.set_graphic_set_index_at = function (x, y, gsIndex) {
            this.bufferData[y][DisplayBuffer.get_x_index_of_graphic_set_index(x)] = gsIndex;
        };
        DisplayBuffer.prototype.get_graphic_index_at = function (x, y) {
            return (this.bufferData[y][DisplayBuffer.get_x_index_of_graphic_index(x)]);
        };
        DisplayBuffer.prototype.set_graphic_index_at = function (x, y, gIndex) {
            this.bufferData[y][DisplayBuffer.get_x_index_of_graphic_index(x)] = gIndex;
        };
        DisplayBuffer.prototype.get_attribute_at = function (x, y) {
            return (this.bufferData[y][DisplayBuffer.get_x_index_of_attribute(x)]);
        };
        DisplayBuffer.prototype.set_attribute_at = function (x, y, attribute) {
            this.bufferData[y][DisplayBuffer.get_x_index_of_attribute(x)] = attribute;
        };
        return DisplayBuffer;
    }());
    exports.DisplayBuffer = DisplayBuffer;
});
define("core/buffer_pair", ["require", "exports", "core/display_buffer"], function (require, exports, display_buffer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BufferPair = /** @class */ (function () {
        function BufferPair() {
            this.primaryBuffer = new display_buffer_1.DisplayBuffer();
            this.secondaryBuffer = new display_buffer_1.DisplayBuffer();
            // Set starting point for drawing. Initially (0, 0), and updated when graphic layout data cursor
            // moves to negative x- or y-coordinate.
            this.minX = undefined;
            this.minY = undefined;
            this.maxX = undefined;
            this.maxY = undefined;
        }
        BufferPair.prototype.exchange_buffers = function () {
            var tmp;
            tmp = this.primaryBuffer;
            this.primaryBuffer = this.secondaryBuffer;
            this.secondaryBuffer = tmp;
        };
        BufferPair.prototype.clear = function () {
            this.primaryBuffer.clear();
        };
        BufferPair.prototype.set_graphic_set_index_at = function (x, y, gsIndex) {
            this.update_dimensions(x, y);
            this.primaryBuffer.set_graphic_set_index_at((x - this.minX), (y - this.minY), gsIndex);
        };
        BufferPair.prototype.set_graphic_index_at = function (x, y, gIndex) {
            this.update_dimensions(x, y);
            this.primaryBuffer.set_graphic_index_at((x - this.minX), (y - this.minY), gIndex);
        };
        BufferPair.prototype.get_attribute_at = function (x, y) {
            return (this.primaryBuffer.get_attribute_at((x - this.minX), (y - this.minY)));
        };
        BufferPair.prototype.set_attribute_at = function (x, y, attribute) {
            this.update_dimensions(x, y);
            this.primaryBuffer.set_attribute_at((x - this.minX), (y - this.minY), attribute);
        };
        // Get graphic index at absolute coordinates (for rendering)
        BufferPair.prototype.get_graphic_index_at_abs = function (x, y) {
            return (this.primaryBuffer.get_graphic_index_at(x, y));
        };
        // Get graphic set index at absolute coordinates (for rendering)
        BufferPair.prototype.get_graphic_set_index_at_abs = function (x, y) {
            return (this.primaryBuffer.get_graphic_set_index_at(x, y));
        };
        // Get attribute at absolute coordinates (for rendering)
        BufferPair.prototype.get_attribute_at_abs = function (x, y) {
            return (this.primaryBuffer.get_attribute_at(x, y));
        };
        // Get width (in characters)
        BufferPair.prototype.get_width = function () {
            return (this.maxX - this.minX) + 1;
        };
        // Get height (in characters)
        BufferPair.prototype.get_height = function () {
            return (this.maxY - this.minY) + 1;
        };
        BufferPair.prototype.update_dimensions = function (x, y) {
            var delta;
            var counter;
            // check against minimum X and add more columns if necessary
            if (this.minX === undefined) {
                this.minX = x;
            }
            else if (this.minX > x) {
                delta = (this.minX - x);
                for (counter = 0; counter < delta; counter++) {
                    this.primaryBuffer.add_prefix_column();
                    this.secondaryBuffer.add_prefix_column();
                }
                this.minX = x;
            }
            // check against maximum X and add more columns if necessary
            if (this.maxX === undefined) {
                this.maxX = x;
            }
            else if (this.maxX < x) {
                delta = (x - this.maxX);
                for (counter = 0; counter < delta; counter++) {
                    this.primaryBuffer.add_suffix_column();
                    this.secondaryBuffer.add_suffix_column();
                }
                this.maxX = x;
            }
            // check against minimum Y and add more rows if necessary
            if (this.minY === undefined) {
                this.minY = y;
            }
            else if (this.minY > y) {
                delta = (this.minY - y);
                for (counter = 0; counter < delta; counter++) {
                    this.primaryBuffer.add_prefix_row();
                    this.secondaryBuffer.add_prefix_row();
                }
                this.minY = y;
            }
            // check against maximum Y and add more rows if necessary
            if (this.maxY === undefined) {
                this.maxY = y;
            }
            else if (this.maxY < y) {
                delta = (y - this.maxY);
                for (counter = 0; counter < delta; counter++) {
                    this.primaryBuffer.add_suffix_row();
                    this.secondaryBuffer.add_suffix_row();
                }
                this.maxY = y;
            }
        };
        return BufferPair;
    }());
    exports.BufferPair = BufferPair;
});
define("core/snapshot", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Wrapper class for snapshot.
    var Snapshot = /** @class */ (function () {
        function Snapshot(snapshot) {
            var counter;
            var nBytesToCopy;
            nBytesToCopy = snapshot.length;
            if (nBytesToCopy > Snapshot.LENGTH) {
                nBytesToCopy = Snapshot.LENGTH;
            }
            this.bytes = [];
            for (counter = 0; counter < nBytesToCopy; counter++) {
                this.bytes.push(snapshot[counter]);
            }
            while (this.bytes.length < Snapshot.LENGTH) {
                this.bytes.push(0);
            }
        }
        Snapshot.unsigned_to_signed = function (unsignedByte) {
            var returnValue;
            returnValue = unsignedByte;
            while (returnValue > 127) {
                returnValue -= 256;
            }
            return returnValue;
        };
        // Return a deep copy so each canvas has its own local copy. This is to prevent operations that involve writing
        // to GLD data addresses on one canvas affecting the others
        Snapshot.prototype.clone = function () {
            var copiedBytes;
            var currentAddress;
            copiedBytes = [];
            for (currentAddress = 0; currentAddress < this.bytes.length; currentAddress++) {
                copiedBytes.push(this.bytes[currentAddress]);
            }
            return new Snapshot(copiedBytes);
        };
        // Enable write access to data
        Snapshot.prototype.poke = function (address, value) {
            if ((address >= 0) &&
                (address < Snapshot.LENGTH) &&
                (value >= 0) &&
                (value < Snapshot.BYTEMAX)) {
                this.bytes[address] = value;
            }
            else {
                alert("Error: Invalid address or value (" +
                    "address = " + String(address) + ", value = " + String(value) + ").");
            }
        };
        // Enable read access to data
        Snapshot.prototype.peek = function (address) {
            var returnValue;
            if ((address >= 0) &&
                (address < Snapshot.LENGTH)) {
                returnValue = this.bytes[address];
            }
            else {
                alert("Error: Invalid address (address = " + String(address) + "). Returning zero.");
                returnValue = 0;
            }
            return returnValue;
        };
        // Read two bytes as a word
        Snapshot.prototype.get_word_at = function (address) {
            var returnValue;
            if ((address >= 0) &&
                (address < Snapshot.LENGTH - 1)) {
                returnValue = this.bytes[address] + (256 * this.bytes[address + 1]);
            }
            else {
                alert("Error: Invalid address (address = " + String(address) + "). Returning zero.");
                returnValue = 0;
            }
            return returnValue;
        };
        // Read a signed byte
        Snapshot.prototype.get_signed_byte_at = function (address) {
            var returnValue;
            returnValue = this.peek(address);
            returnValue = Snapshot.unsigned_to_signed(returnValue);
            return returnValue;
        };
        Snapshot.LENGTH = 65536;
        Snapshot.BYTEMAX = 256;
        return Snapshot;
    }());
    exports.Snapshot = Snapshot;
});
define("core/gld_drawer_stub", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GLDDrawerStub = /** @class */ (function () {
        function GLDDrawerStub() {
            this.snapshot = undefined;
            this.currentX = 0;
            this.currentY = 0;
            this.currentGraphicSetIndex = 0;
            this.callStack = [];
        }
        GLDDrawerStub.prototype.receive_snapshot = function (snapshot) {
            this.snapshot = snapshot;
        };
        GLDDrawerStub.prototype.move_to = function (x, y) {
            this.currentX = x;
            this.currentY = y;
        };
        GLDDrawerStub.prototype.draw_to_buffer_pair = function (bufferPair, address) {
            this.currentAttribute = 0;
            this.storedX = this.currentX;
            this.storedY = this.currentY;
            this.process_current_instruction(bufferPair, address);
        };
        /**
         * Modify the following instruction to have a graphic index selected at random from the following list of n values
         *
         * See:
         * - Flunky routine at 39563 (236)
         * - Gregory Loses his Clock routine at 42570 (236)
         * - Popeye routine at 26720 (246)
         * - Through the Trap Door routine at 46317 (236)
         * - Trap Door routine at 59463 (245)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.pick_random_graphic_index_for_next_instruction = function (bufferPair, address) {
            var random;
            var randomMax;
            var selectedValue;
            var nextAddress;
            randomMax = this.snapshot.peek(address + 1);
            random = Math.floor(randomMax * Math.random());
            selectedValue = this.snapshot.peek(address + random + 2);
            nextAddress = address + randomMax + 2;
            this.snapshot.poke(nextAddress, selectedValue);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Set the sound with index given in the parameter as pending
         *
         * See:
         * - Flunky routine at 39530 (237)
         * - Through the Trap Door routine at 46284 (237)
         * - Trap Door routine at 59436 (240)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.set_pending_sound = function (bufferPair, address) {
            this.process_current_instruction(bufferPair, address + 2);
        };
        /**
         * Store graphic layout data address to mark start of Loop A and set Repeat Counter A to value in parameter
         *
         * See:
         * - Flunky routine at 39845 (238)
         * - Gregory Loses his Clock routine at 42914 (238)
         * - Popeye routine at 26630 (251)
         * - Through the Trap Door routine at 46611 (238)
         * - Trap Door routine at 59385 (238)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.start_loop_a = function (bufferPair, address) {
            var nextAddress;
            this.repeatCountLoopA = this.snapshot.peek(address + 1);
            nextAddress = address + 2;
            this.repeatAddressLoopA = nextAddress;
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Decrement Repeat Counter A and jump back to stored graphic layout data address for start of Loop A
         *
         * See:
         * - Flunky routine at 39862 (239)
         * - Gregory Loses his Clock routine at 42931 (239)
         * - Popeye routine at 26644 (252)
         * - Through the Trap Door routine at 46628 (239)
         * - Trap Door routine at 59400 (239)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.end_loop_a = function (bufferPair, address) {
            var nextAddress;
            this.repeatCountLoopA--;
            if (this.repeatCountLoopA === 0) {
                nextAddress = address + 1;
            }
            else {
                nextAddress = this.repeatAddressLoopA;
            }
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Store graphic layout data address to mark start of loop B and set repeat counter B to value in parameter
         *
         * See:
         * - Flunky routine at 39881 (240)
         * - Gregory Loses his Clock routine at 42950 (240)
         * - Through the Trap Door routine at 46647 (240)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.start_loop_b = function (bufferPair, address) {
            var nextAddress;
            this.repeatCountLoopB = this.snapshot.peek(address + 1);
            nextAddress = address + 2;
            this.repeatAddressLoopB = nextAddress;
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Decrement Repeat Counter B and jump back to stored graphic layout data address for start of Loop B
         *
         * See:
         * - Flunky routine at 39898 (241)
         * - Gregory Loses his Clock routine at 42967 (241)
         * - Through the Trap Door routine at 46664 (241)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.end_loop_b = function (bufferPair, address) {
            var nextAddress;
            this.repeatCountLoopB--;
            if (this.repeatCountLoopB === 0) {
                nextAddress = address + 1;
            }
            else {
                nextAddress = this.repeatAddressLoopB;
            }
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Set the Current Attribute to value in parameter
         *
         * See:
         * - Flunky routine at 39541 (242)
         * - Gregory Loses his Clock routine at 42548 (242)
         * - Popeye routine at 26661 (253)
         * - Through the Trap Door routine at 46295 (242)
         * - Trap Door routine at 59445 (242)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.set_current_attribute = function (bufferPair, address) {
            this.currentAttribute = this.snapshot.peek(address + 1);
            this.process_current_instruction(bufferPair, address + 2);
        };
        /**
         * Increment index, m, of address to jump to, resetting to zero if above maximum, then jump to m-th graphic layout
         * data address in following list of n addresses
         *
         * See:
         * - Flunky routine at 39805 (243)
         * - Gregory Loses his Clock routine at 42835 (243)
         * - Through the Trap Door routine at 46559 (243)
         * - Trap Door routine at 59624 (243)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.cycle_to_next_layout_address_and_jump = function (bufferPair, address) {
            var currentState;
            var nextAddress;
            currentState = this.snapshot.peek(address + 1) + 1;
            if (currentState >= this.snapshot.peek(address + 2)) {
                currentState = 0;
            }
            this.snapshot.poke(address + 1, currentState);
            nextAddress = this.snapshot.get_word_at(address + 3 + (2 * currentState));
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Set the Current Graphic Set Index to value in parameter
         *
         * See:
         * - Flunky routine at 39552 (244)
         * - Gregory Loses his Clock routine at 42559 (244)
         * - Popeye routine at 26670 (254)
         * - Through the Trap Door routine at 46306 (244)
         * - Trap Door routine at 59454 (244)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.set_current_graphic_set = function (bufferPair, address) {
            this.currentGraphicSetIndex = this.snapshot.peek(address + 1);
            this.process_current_instruction(bufferPair, address + 2);
        };
        /**
         * Decrement timer and if zero, reset to maximum and modify the following instruction to have a graphic index
         * selected at random from the following list of n values
         *
         * See:
         * - Flunky routine at 39593 (245)
         * - Through the Trap Door routine at 46347 (245)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.decrease_time_for_graphic_index_and_randomise_if_zero = function (bufferPair, address) {
            var remainingTime;
            var nextAddress;
            var randomMax;
            var random;
            var selectedValue;
            remainingTime = this.snapshot.peek(address + 1) - 1;
            randomMax = this.snapshot.peek(address + 3);
            nextAddress = address + 4 + randomMax;
            if (remainingTime === 0) {
                remainingTime = this.snapshot.peek(address + 2);
                random = Math.floor(randomMax * Math.random());
                selectedValue = this.snapshot.peek(address + 4 + random);
                this.snapshot.poke(nextAddress, selectedValue);
            }
            this.snapshot.poke(address + 1, remainingTime);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Decrement timer and if zero, reset to maximum and modify the following instruction to have an attribute selected
         * at random from the following list of n values
         *
         * See:
         * - Flunky routine at 39609 (246)
         * - Through the Trap Door routine at 46363 (246)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.decrease_time_for_attribute_and_randomise_if_zero = function (bufferPair, address) {
            var remainingTime;
            var nextAddress;
            var randomMax;
            var random;
            var selectedValue;
            remainingTime = this.snapshot.peek(address + 1) - 1;
            randomMax = this.snapshot.peek(address + 3);
            nextAddress = address + 4 + randomMax;
            if (remainingTime === 0) {
                remainingTime = this.snapshot.peek(address + 2);
                random = Math.floor(randomMax * Math.random());
                selectedValue = this.snapshot.peek(address + 4 + random);
                this.snapshot.poke(nextAddress + 1, selectedValue);
            }
            this.snapshot.poke(address + 1, remainingTime);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Jump to one of the following n graphic layout data addresses chosen at random
         *
         * See:
         * - Flunky routine at 39823 (247)
         * - Gregory Loses his Clock routine at 42853 (247)
         * - Popeye routine at 26751 (245)
         * - Through the Trap Door routine at 46577 (247)
         * - Trap Door routine at 59715 (246)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.pick_random_gld_address_and_jump = function (bufferPair, address) {
            var nextAddress;
            var randomMax;
            var random;
            randomMax = this.snapshot.peek(address + 1);
            random = Math.floor(randomMax * Math.random());
            nextAddress = this.snapshot.get_word_at(address + 2 + (2 * random));
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Jump to the given graphic layout data address
         *
         * See:
         * - Flunky routine at 39727 (248)
         * - Gregory Loses his Clock routine at 42728 (248)
         * - Popeye routine at 26618 (247)
         * - Through the Trap Door routine at 46481 (248)
         * - Trap Door routine at 59550 (248)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.jump_to_gld_address = function (bufferPair, address) {
            var nextAddress;
            nextAddress = this.snapshot.get_word_at(address + 1);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Jump to time-weighted, randomly selected graphic layout data address in list
         *
         * See:
         * - Flunky routine at 39741 (249)
         * - Gregory Loses his Clock routine at 42742 (249)
         * - Through the Trap Door routine at 46495 (249)
         * - Trap Door routine at 59562 (249)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.pick_time_weighted_gld_address_and_jump = function (bufferPair, address) {
            var currentState;
            var stateDataAddress;
            var remainingTime;
            var randomStateMax;
            var randomState;
            var randomTimeMax;
            var randomTime;
            var nextAddress;
            currentState = this.snapshot.peek(address + 2);
            stateDataAddress = address + (4 * currentState) + 3;
            remainingTime = this.snapshot.peek(stateDataAddress) - 1;
            this.snapshot.poke(stateDataAddress, remainingTime);
            if (remainingTime === 0) {
                randomStateMax = this.snapshot.peek(address + 1);
                randomState = Math.floor(randomStateMax * Math.random());
                this.snapshot.poke(address + 2, randomState);
                stateDataAddress = address + (4 * randomState) + 3;
                randomTimeMax = this.snapshot.peek(stateDataAddress + 1);
                randomTime = Math.floor(randomTimeMax * Math.random()) + 1;
                this.snapshot.poke(stateDataAddress, randomTime);
            }
            nextAddress = this.snapshot.get_word_at(stateDataAddress + 2);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Adjust current x- and y-coordinates for drawing without storing
         *
         * See:
         * - Flunky routine at 39673 (250)
         * - Gregory Loses his Clock routine at 42674 (250)
         * - Through the Trap Door routine at 46427 (250)
         * - Trap Door routine at 59502 (250)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.adjust_coordinates_without_store = function (bufferPair, address) {
            this.currentY += this.snapshot.get_signed_byte_at(address + 1);
            this.currentX += this.snapshot.get_signed_byte_at(address + 2);
            this.process_current_instruction(bufferPair, address + 3);
        };
        /**
         * Process graphic layout data at given address and return to current position when complete
         *
         * See:
         * - Flunky routine at 39706 (251)
         * - Gregory Loses his Clock routine at 42707 (251)
         * - Popeye routine at 26600 (250)
         * - Through the Trap Door routine at 46460 (251)
         * - Trap Door routine at 59531 (251)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.call_gld_address = function (bufferPair, address) {
            var nextAddress;
            this.callStack.push(address + 3);
            nextAddress = this.snapshot.get_word_at(address + 1);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * If character is holding nothing then jump to given graphic layout data address
         *
         * See:
         * - Through the Trap Door routine at 46599 (252)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.jump_if_nothing_held = function (bufferPair, address) {
            alert("Instruction 252 is not used. Therefore it is not implemented here.");
        };
        /**
         * Jump to graphic layout data address selected from list, based upon width of entity currently held by character
         *
         * See:
         * - Flunky routine at 39840 (253)
         * - Gregory Loses his Clock routine at 42870 (253)
         * - Through the Trap Door routine at 46594 (253)
         * - Trap Door routine at 59732 (253)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.jump_to_gld_address_based_on_held_object_width = function (bufferPair, address) {
            var entityWidth;
            var nextAddress;
            // Maximum allowed width is 4
            entityWidth = Math.floor(4 * Math.random());
            nextAddress = this.snapshot.get_word_at(address + (2 * entityWidth) + 1);
            this.process_current_instruction(bufferPair, nextAddress);
        };
        /**
         * Adjust x- and y-coordinates for drawing and store
         *
         * See:
         * - Flunky routine at 39688 (254)
         * - Gregory Loses his Clock routine at 42689 (254)
         * - Through the Trap Door routine at 46442 (254)
         * - Trap Door routine at 59515 (254)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.adjust_coordinates_with_store = function (bufferPair, address) {
            this.currentY += this.snapshot.get_signed_byte_at(address + 1);
            this.storedY = this.currentY;
            this.currentX += this.snapshot.get_signed_byte_at(address + 2);
            this.storedX = this.currentX;
            this.process_current_instruction(bufferPair, address + 3);
        };
        /**
         * Move cursor to stored coordinates and return from drawing
         *
         * See:
         * - Flunky routine at 39664 (255)
         * - Gregory Loses his Clock routine at 42665 (246, 255)
         * - Through the Trap Door routine at 46418 (255)
         * - Trap Door routine at 59494 (255)
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.move_to_stored_coordinates_and_return = function (bufferPair, address) {
            if (this.callStack.length > 0) {
                this.currentX = this.storedX;
                this.currentY = this.storedY;
                this.currentAttribute = 0;
                this.process_current_instruction(bufferPair, this.callStack.pop());
            }
        };
        /**
         * Display notification that an instruction is not implemented
         *
         * @param bufferPair
         * @param address
         */
        GLDDrawerStub.prototype.notify_not_implemented = function (bufferPair, address) {
            alert("Not implemented: instruction " + String(this.snapshot.peek(address)) + " at " + String(address));
        };
        GLDDrawerStub.prototype.process_current_instruction = function (bufferPair, address) {
            var instructionCode;
            instructionCode = this.snapshot.peek(address);
            if (instructionCode < this.lowestInstructionIndex) {
                this.do_draw_and_continue(bufferPair, address);
            }
            else {
                this.gldRoutineMapping[instructionCode](bufferPair, address);
            }
        };
        GLDDrawerStub.prototype.do_draw_and_continue = function (bufferPair, address) {
            var attribute;
            var currentAddress;
            var flags;
            var inkAndPaper;
            var attributeInBuffer;
            var cursorShiftValue;
            bufferPair.set_graphic_set_index_at(this.currentX, this.currentY, this.currentGraphicSetIndex);
            bufferPair.set_graphic_index_at(this.currentX, this.currentY, this.snapshot.peek(address));
            if (this.currentAttribute === 0) {
                attribute = this.snapshot.peek(address + 1);
                currentAddress = address + 1;
            }
            else {
                currentAddress = address;
                attribute = this.currentAttribute;
            }
            // Check Override Attribute Flag
            cursorShiftValue = this.snapshot.peek(currentAddress + 1);
            if (cursorShiftValue < 128) {
                if ((attribute & 56) === 0) {
                    flags = (attribute & 192);
                    inkAndPaper = (attribute & 63);
                    attributeInBuffer = bufferPair.get_attribute_at(this.currentX, this.currentY);
                    if ((attributeInBuffer & 64) !== 0) {
                        attributeInBuffer = (attributeInBuffer << 3);
                    }
                    attributeInBuffer = (attributeInBuffer & 56);
                    attributeInBuffer = (attributeInBuffer | flags | inkAndPaper);
                    attribute = attributeInBuffer;
                }
            }
            bufferPair.set_attribute_at(this.currentX, this.currentY, attribute);
            this.do_cursor_shift(cursorShiftValue);
            this.process_current_instruction(bufferPair, currentAddress + 2);
        };
        // Update current position based upon cursor shift byte
        //
        // Read cursor shift byte. This byte controls where the pointer to write to Primary Screen Buffer is moved
        // to after writing the current character block. 33 advances the pointer right by one character. A value,
        // n, less than 33 moves the pointer down a character row, and left by (33-n-1) characters. A value
        // greater than 33 moves the pointer right by (1+n-33) characters.
        GLDDrawerStub.prototype.do_cursor_shift = function (cursorShiftValue) {
            var deltaX;
            var deltaY;
            var cursorShiftActual;
            // Reset Override Attribute Flag
            cursorShiftActual = (cursorShiftValue & 127);
            if (cursorShiftActual === 33) {
                deltaX = 1;
                deltaY = 0;
            }
            else if (cursorShiftActual < 33) {
                deltaY = 1;
                deltaX = cursorShiftActual - 32;
            }
            else if (cursorShiftActual > 33) {
                deltaX = cursorShiftActual - 32;
                deltaY = 0;
            }
            this.currentX += deltaX;
            this.currentY += deltaY;
        };
        return GLDDrawerStub;
    }());
    exports.GLDDrawerStub = GLDDrawerStub;
});
define("through_the_trap_door/gld_drawer_tttd", ["require", "exports", "core/gld_drawer_stub"], function (require, exports, gld_drawer_stub_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GLDDrawerTTTD = /** @class */ (function (_super) {
        __extends(GLDDrawerTTTD, _super);
        function GLDDrawerTTTD() {
            var _this = _super.call(this) || this;
            _this.lowestInstructionIndex = 236;
            _this.gldRoutineMapping = {
                "236": _this.pick_random_graphic_index_for_next_instruction.bind(_this),
                "237": _this.set_pending_sound.bind(_this),
                "238": _this.start_loop_a.bind(_this),
                "239": _this.end_loop_a.bind(_this),
                "240": _this.start_loop_b.bind(_this),
                "241": _this.end_loop_b.bind(_this),
                "242": _this.set_current_attribute.bind(_this),
                "243": _this.cycle_to_next_layout_address_and_jump.bind(_this),
                "244": _this.set_current_graphic_set.bind(_this),
                "245": _this.decrease_time_for_graphic_index_and_randomise_if_zero.bind(_this),
                "246": _this.decrease_time_for_attribute_and_randomise_if_zero.bind(_this),
                "247": _this.pick_random_gld_address_and_jump.bind(_this),
                "248": _this.jump_to_gld_address.bind(_this),
                "249": _this.pick_time_weighted_gld_address_and_jump.bind(_this),
                "250": _this.adjust_coordinates_without_store.bind(_this),
                "251": _this.call_gld_address.bind(_this),
                "252": _this.jump_if_nothing_held.bind(_this),
                "253": _this.jump_to_gld_address_based_on_held_object_width.bind(_this),
                "254": _this.adjust_coordinates_with_store.bind(_this),
                "255": _this.move_to_stored_coordinates_and_return.bind(_this),
            };
            return _this;
        }
        return GLDDrawerTTTD;
    }(gld_drawer_stub_1.GLDDrawerStub));
    exports.GLDDrawerTTTD = GLDDrawerTTTD;
});
define("core/image_loader", ["require", "exports", "core/constants"], function (require, exports, constants_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageLoader = /** @class */ (function () {
        function ImageLoader(snapshot) {
            this.setAddressLocation = 0;
            this.snapshot = snapshot;
            this.imageCacheObject = {};
        }
        Object.defineProperty(ImageLoader.prototype, "graphicSetAddressLocation", {
            set: function (address) {
                this.setAddressLocation = address;
            },
            enumerable: true,
            configurable: true
        });
        ImageLoader.flip_image_data_lr = function (imgData) {
            // Flips the imagedata representing a single UDG left-right
            var xpSrc;
            var xpDst;
            var y;
            var dataIndexSrc;
            var dataIndexDst;
            var halfWidth;
            var swapBuffer;
            var channelCounter;
            halfWidth = constants_2.Constants.PIXELS_PER_UDG / 2;
            for (y = 0; y < constants_2.Constants.PIXELS_PER_UDG; y++) {
                for (xpSrc = 0; xpSrc < halfWidth; xpSrc++) {
                    dataIndexSrc = (4 * (xpSrc + y * constants_2.Constants.PIXELS_PER_UDG));
                    xpDst = constants_2.Constants.PIXELS_PER_UDG - (xpSrc + 1);
                    dataIndexDst = (4 * (xpDst + y * constants_2.Constants.PIXELS_PER_UDG));
                    for (channelCounter = 0; channelCounter < 4; channelCounter++) {
                        swapBuffer = imgData.data[dataIndexDst + channelCounter];
                        imgData.data[dataIndexDst + channelCounter] = imgData.data[dataIndexSrc + channelCounter];
                        imgData.data[dataIndexSrc + channelCounter] = swapBuffer;
                    }
                }
            }
        };
        ImageLoader.decode_attribute = function (attribute) {
            return {
                "mirror": ((attribute & 128) === 128),
                "bit6": ((attribute & 64) === 64),
                "inkBlue": (attribute & 1) * ImageLoader.FULL_BRIGHT,
                "inkRed": ((attribute & 2) >> 1) * ImageLoader.FULL_BRIGHT,
                "inkGreen": ((attribute & 4) >> 2) * ImageLoader.FULL_BRIGHT,
                "paperBlue": ((attribute & 8) >> 3) * ImageLoader.FULL_BRIGHT,
                "paperRed": ((attribute & 16) >> 4) * ImageLoader.FULL_BRIGHT,
                "paperGreen": ((attribute & 32) >> 5) * ImageLoader.FULL_BRIGHT,
            };
        };
        ImageLoader.prototype.get_image = function (index, setIndex, attribute) {
            var imageKey;
            var imageData;
            imageKey = this.build_image_key(index, setIndex, attribute);
            if (typeof this.imageCacheObject[imageKey] === "undefined") {
                imageData = this.generate_image_data(index, setIndex, attribute);
                this.imageCacheObject[imageKey] = imageData;
            }
            else {
                imageData = this.imageCacheObject[imageKey];
            }
            return imageData;
        };
        ImageLoader.prototype.build_image_key = function (index, setIndex, attribute) {
            return "s" + String(setIndex) + "i" + String(index) + "a" + String(attribute);
        };
        ImageLoader.prototype.get_graphic_set_address = function (setIndex) {
            return this.snapshot.get_word_at(this.setAddressLocation + 2 * setIndex);
        };
        ImageLoader.prototype.generate_image_data = function (index, setIndex, attribute) {
            var imageData;
            var bitmapCurrentAddress = this.get_graphic_set_address(setIndex) + 8 * index;
            var currentByte;
            var currentPower;
            var powerIndex;
            var attributeData;
            var colourRed;
            var colourGreen;
            var colourBlue;
            attributeData = ImageLoader.decode_attribute(attribute);
            imageData = document.createElement("canvas")
                .getContext("2d")
                .getImageData(0, 0, constants_2.Constants.PIXELS_PER_UDG, constants_2.Constants.PIXELS_PER_UDG);
            for (var y = 0; y < 8; y++) {
                currentByte = this.snapshot.peek(bitmapCurrentAddress);
                currentPower = 128;
                for (powerIndex = 0; powerIndex < 8; powerIndex++) {
                    if ((currentByte < currentPower) || (index === 0) || (setIndex === 0)) {
                        colourRed = attributeData.paperRed;
                        colourGreen = attributeData.paperGreen;
                        colourBlue = attributeData.paperBlue;
                    }
                    else {
                        colourRed = attributeData.inkRed;
                        colourGreen = attributeData.inkGreen;
                        colourBlue = attributeData.inkBlue;
                        currentByte -= currentPower;
                    }
                    for (var xOffset = 0; xOffset < constants_2.Constants.IMG_SCALE_FACTOR; xOffset++) {
                        for (var yOffset = 0; yOffset < constants_2.Constants.IMG_SCALE_FACTOR; yOffset++) {
                            var baseIndex = 4 * (constants_2.Constants.PIXELS_PER_UDG * constants_2.Constants.IMG_SCALE_FACTOR * y +
                                constants_2.Constants.PIXELS_PER_UDG * yOffset +
                                constants_2.Constants.IMG_SCALE_FACTOR * powerIndex +
                                xOffset);
                            imageData.data[baseIndex] = colourRed;
                            imageData.data[baseIndex + 1] = colourGreen;
                            imageData.data[baseIndex + 2] = colourBlue;
                            imageData.data[baseIndex + 3] = 255;
                        }
                    }
                    currentPower = Math.floor(currentPower / 2);
                }
                bitmapCurrentAddress++;
            }
            if (attributeData.mirror) {
                ImageLoader.flip_image_data_lr(imageData);
            }
            return imageData;
        };
        ImageLoader.FULL_BRIGHT = 255;
        return ImageLoader;
    }());
    exports.ImageLoader = ImageLoader;
});
define("core/gld_canvas", ["require", "exports", "core/constants"], function (require, exports, constants_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Class for <canvas> element that is capable of rendering graphic layout data from Don Priestley's graphics system.
    var GLDCanvas = /** @class */ (function () {
        function GLDCanvas() {
            this.GLDAddress = 0;
            this.canvas = undefined;
            this.context = undefined;
            this.defaultGraphicSetIndex = 0;
            this.imgLoader = undefined;
        }
        GLDCanvas.prototype.receive_image_loader = function (imgLoader) {
            this.imgLoader = imgLoader;
        };
        GLDCanvas.prototype.receive_canvas = function (canvas) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            if (this.canvas.hasAttribute("data-graphic-layout-data-address")) {
                this.GLDAddress = parseInt(this.canvas.getAttribute("data-graphic-layout-data-address"), 10);
            }
            if (this.canvas.hasAttribute("data-graphic-set-index")) {
                this.defaultGraphicSetIndex = parseInt(this.canvas.getAttribute("data-graphic-set-index"), 10);
            }
        };
        GLDCanvas.prototype.render = function (bufferPair) {
            var width;
            var height;
            var widthOld;
            var heightOld;
            var xp;
            var yp;
            var img;
            var graphicIndex;
            var graphicSetIndex;
            var attribute;
            var canvasResized;
            width = bufferPair.get_width();
            height = bufferPair.get_height();
            widthOld = parseInt(this.canvas.getAttribute("width"), 10);
            heightOld = parseInt(this.canvas.getAttribute("height"), 10);
            canvasResized = false;
            if ((width * constants_3.Constants.PIXELS_PER_UDG) !== widthOld) {
                this.canvas.setAttribute("width", String(width * constants_3.Constants.PIXELS_PER_UDG));
                canvasResized = true;
            }
            if ((height * constants_3.Constants.PIXELS_PER_UDG) !== heightOld) {
                this.canvas.setAttribute("height", String(height * constants_3.Constants.PIXELS_PER_UDG));
                canvasResized = true;
            }
            for (yp = 0; yp < height; yp++) {
                for (xp = 0; xp < width; xp++) {
                    graphicSetIndex = bufferPair.get_graphic_set_index_at_abs(xp, yp);
                    graphicIndex = bufferPair.get_graphic_index_at_abs(xp, yp);
                    attribute = bufferPair.get_attribute_at_abs(xp, yp);
                    img = this.imgLoader.get_image(graphicIndex, graphicSetIndex, attribute);
                    this.context.putImageData(img, constants_3.Constants.PIXELS_PER_UDG * xp, constants_3.Constants.PIXELS_PER_UDG * yp);
                }
            }
        };
        return GLDCanvas;
    }());
    exports.GLDCanvas = GLDCanvas;
});
define("through_the_trap_door/main", ["require", "exports", "core/buffer_pair", "core/gld_canvas", "core/image_loader", "core/snapshot", "through_the_trap_door/constants_tttd", "through_the_trap_door/gld_drawer_tttd"], function (require, exports, buffer_pair_1, gld_canvas_1, image_loader_1, snapshot_1, constants_tttd_1, gld_drawer_tttd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.initialise = function () {
            var canvasNode;
            var canvasNodeArray;
            var canvasIndex;
            var canvasObject;
            var bufferPair;
            // Read data from memory dump JSON file
            var snapshot = new snapshot_1.Snapshot(MEMORY_DUMP);
            // Create new ImageLoader object
            Main.IMAGE_LOADER_OBJECT = new image_loader_1.ImageLoader(snapshot.clone());
            Main.IMAGE_LOADER_OBJECT.graphicSetAddressLocation = constants_tttd_1.ConstantsTTTD.GRAPHIC_SET_ADDRESS_LOCATION;
            // Create GLD drawer object
            Main.GLD_DRAWER = new gld_drawer_tttd_1.GLDDrawerTTTD();
            // Get <canvas> nodes and inject them into wrapper objects. Also set up one buffer pair per canvas.
            Main.CANVAS_ARRAY = [];
            Main.BUFFER_PAIR_ARRAY = [];
            Main.SNAPSHOT_ARRAY = [];
            canvasNodeArray = document.getElementsByTagName("canvas");
            for (canvasIndex = 0; canvasIndex < canvasNodeArray.length; canvasIndex++) {
                canvasNode = canvasNodeArray[canvasIndex];
                if (canvasNode.hasAttribute("data-graphic-layout-data-address")) {
                    canvasObject = new gld_canvas_1.GLDCanvas();
                    canvasObject.receive_image_loader(Main.IMAGE_LOADER_OBJECT);
                    canvasObject.receive_canvas(canvasNode);
                    Main.SNAPSHOT_ARRAY.push(snapshot.clone());
                    Main.CANVAS_ARRAY.push(canvasObject);
                    bufferPair = new buffer_pair_1.BufferPair();
                    Main.BUFFER_PAIR_ARRAY.push(bufferPair);
                }
            }
        };
        Main.render_all_canvases = function () {
            var canvasIndex;
            var canvasIndexMax;
            var currentCanvas;
            var currentBufferPair;
            var currentSnapshot;
            canvasIndexMax = Main.CANVAS_ARRAY.length;
            for (canvasIndex = 0; canvasIndex < canvasIndexMax; canvasIndex++) {
                currentCanvas = Main.CANVAS_ARRAY[canvasIndex];
                currentBufferPair = Main.BUFFER_PAIR_ARRAY[canvasIndex];
                currentSnapshot = Main.SNAPSHOT_ARRAY[canvasIndex];
                currentBufferPair.exchange_buffers();
                currentBufferPair.clear();
                Main.GLD_DRAWER.receive_snapshot(currentSnapshot);
                Main.GLD_DRAWER.move_to(0, 0);
                Main.GLD_DRAWER.draw_to_buffer_pair(currentBufferPair, currentCanvas.GLDAddress);
                currentCanvas.render(currentBufferPair);
            }
            setTimeout(Main.render_all_canvases, Main.TIMER_INTERVAL);
        };
        Main.TIMER_INTERVAL = 250;
        return Main;
    }());
    exports.Main = Main;
});
