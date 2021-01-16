require.config({
    baseUrl: "../"
});

require(["spellbound/main"], function(Main) {
    window.onload = function() {
        Main.Main.initialise();
    }
});