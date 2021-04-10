require.config({
    baseUrl: "../"
});

require(["js/domReady", "spellbound/main"], function(domReady, Main) {
    domReady(function() {
        Main.Main.initialise();
    });
});
