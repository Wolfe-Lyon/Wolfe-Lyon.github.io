require.config({
    baseUrl: "../"
});

require(["stormbringer/main"], function(Main) {
    window.onload = function() {
        Main.Main.initialise();
    }
});