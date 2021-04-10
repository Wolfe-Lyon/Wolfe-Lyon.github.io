require.config({
    baseUrl: "../"
});

require(["js/domReady", "stormbringer/main"], function(domReady, Main) {
    domReady(function() {
        Main.Main.initialise();
    });
});
