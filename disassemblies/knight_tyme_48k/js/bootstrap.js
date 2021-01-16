require.config({
    baseUrl: "../"
});

require(["knight_tyme/main"], function(Main) {
    window.onload = function() {
        Main.Main.initialise();
    }
});