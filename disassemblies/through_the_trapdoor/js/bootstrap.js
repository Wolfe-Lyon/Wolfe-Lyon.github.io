require.config({
    baseUrl: "../"
});

require(["js/domReady", "through_the_trap_door/main"], function(domReady, Main) {
    domReady(function() {
        Main.Main.initialise();
        Main.Main.render_all_canvases();
    });
});