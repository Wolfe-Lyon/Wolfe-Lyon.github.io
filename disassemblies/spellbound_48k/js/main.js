define("core/flashing_element", ["require", "exports", "core/spectrum_display"], function (require, exports, spectrum_display_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlashingElement = /** @class */ (function () {
        function FlashingElement(element) {
            this.HTMLElement = element;
            this.inkValue = Number(this.HTMLElement["data-ink"]);
            this.paperValue = Number(this.HTMLElement["data-paper"]);
        }
        FlashingElement.prototype.invert = function () {
            var inkName;
            var paperName;
            var tmp;
            inkName = spectrum_display_1.SpectrumDisplay.COLOURS[this.inkValue];
            paperName = spectrum_display_1.SpectrumDisplay.COLOURS[this.paperValue];
            this.HTMLElement.classList.remove(inkName + "Ink");
            this.HTMLElement.classList.remove(paperName + "Paper");
            this.HTMLElement.classList.add(inkName + "Paper");
            this.HTMLElement.classList.add(paperName + "Ink");
            tmp = this.inkValue;
            this.inkValue = this.paperValue;
            this.paperValue = tmp;
        };
        return FlashingElement;
    }());
    exports.FlashingElement = FlashingElement;
});
define("core/spectrum_display", ["require", "exports", "core/flashing_element"], function (require, exports, flashing_element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpectrumDisplay = /** @class */ (function () {
        function SpectrumDisplay() {
            var elementsWithFlash;
            this.flashingElements = [];
            elementsWithFlash = document.getElementsByClassName("flash");
            for (var i = 0; i < elementsWithFlash.length; i++) {
                var inkClassCount = 0;
                var paperClassCount = 0;
                var elementClasses = elementsWithFlash[i].className.split(" ");
                var inkIndex = void 0;
                var paperIndex = void 0;
                for (var colourIndex = 0; colourIndex < SpectrumDisplay.COLOURS.length; colourIndex++) {
                    if (elementClasses.indexOf(SpectrumDisplay.COLOURS[colourIndex] + "Ink") !== -1) {
                        inkIndex = colourIndex;
                        inkClassCount++;
                    }
                    if (elementClasses.indexOf(SpectrumDisplay.COLOURS[colourIndex] + "Paper") !== -1) {
                        paperIndex = colourIndex;
                        paperClassCount++;
                    }
                }
                if ((inkClassCount === 1) && (paperClassCount === 1)) {
                    var flashingElement = new flashing_element_1.FlashingElement(elementsWithFlash[i]);
                    flashingElement.inkValue = inkIndex;
                    flashingElement.paperValue = paperIndex;
                    this.flashingElements.push(flashingElement);
                }
            }
            setInterval(this.invertAllElements.bind(this), SpectrumDisplay.FLASH_INTERVAL);
        }
        SpectrumDisplay.prototype.invertAllElements = function () {
            var i;
            for (i = 0; i < this.flashingElements.length; i++) {
                this.flashingElements[i].invert();
            }
        };
        SpectrumDisplay.COLOURS = ["black", "blue", "red", "magenta", "green", "cyan",
            "yellow", "white"];
        SpectrumDisplay.FLASH_INTERVAL = 320;
        return SpectrumDisplay;
    }());
    exports.SpectrumDisplay = SpectrumDisplay;
});
define("spellbound/main", ["require", "exports", "core/spectrum_display"], function (require, exports, spectrum_display_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.initialise = function () {
            Main.DISPLAY = new spectrum_display_2.SpectrumDisplay();
        };
        return Main;
    }());
    exports.Main = Main;
});
