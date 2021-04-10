require.config({
    baseUrl: "../"
});

require(["js/domReady", "knight_tyme/main"], function(domReady, Main) {
    domReady(function() {
        Main.Main.initialise();
    });
});
