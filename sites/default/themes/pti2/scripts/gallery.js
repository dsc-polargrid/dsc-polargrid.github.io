/* Scripts for multimedia gallery */

// Namespace
pti_gallery = {
    update_low_res_link: function (id, lowRes, videoPlayer) {
        if (lowRes) {
            $("#low-res-instructions").hide();
        } else {
            // Show low-res option if flash player.
            if (!videoPlayer.canPlaySource() || (videoPlayer.options.flashIsDominant && videoPlayer.flashVersionSupported())) {
                $("#low-res-link").click( function() { pti_gallery.load_video(id, true); return false; } );
                $("#low-res-instructions").show();
            } else {
                // No low-res option for HTML5 players at this time
                $("#low-res-instructions").hide();
            }
        }
    },

    load_video: function (id, lowRes, mobile) {
        // After setup, IE, FireFox, and Safari will all have different
        // hierarchies in the #video-js-box element.  So, rather than
        // code for these differences, we will just empty the element
        // and set it up again.
        var stored = $("body").data(id);
        var videoPath = lowRes ? stored.lowres : (mobile && stored.mobile ? stored.mobile : stored.video);

        // Short circuit if the video we are loading is already loaded....
        if ($("body").data("loaded-video") == videoPath) return;
        
        js_html = ['<video id="video-js-player" class="video-js" poster="', stored.poster, '" width="600" height="340" controls preload >\n',
                   '  <source src="', stored.video, '" />\n',
                   '</video>\n'];
        $("#video-js-box").empty().append(js_html.join(""));
        var videoPlayer = VideoJS.setup("video-js-player", {flashIsDominant: true});

        pti_gallery.update_low_res_link(id, lowRes, videoPlayer);

        // Save the currently-loaded video
        $("body").data("loaded-video", videoPath);

        // If id is not from the carousel, and the video is in the
        // carousel, move to it.
        var idFragments = id.split('-');
        if (idFragments[1] != "carousel") {
            idFragments[1] = "carousel";
            $("#" + idFragments.join('-')).click();
        }
    },

    is_mobile: function() {
        // This function purports to detect a mobile browser.
        // Currently detects only Apple or Android, based on the useragent value
        var iphone = "iphone";
        var ipod = "ipod";
        var ipad = "ipad";
        var webkit = "webkit"
        var android = "android"
        var useragent = navigator.userAgent.toLowerCase();

        var is_webkit = useragent.search(webkit) > -1;

        var is_iphone = useragent.search(iphone) > -1;
        var is_ipod = useragent.search(ipod) > -1;
        var is_ipad = useragent.search(ipad) > -1;
        var is_apple_mobile = is_iphone || is_ipod || is_ipad;

        var is_android = useragent.search(android) > -1;

        return is_webkit && (is_apple_mobile || is_android);
    },

    carousel_click: function (e) {
        pti_gallery.load_video(e.attr("id"), false, pti_gallery.is_mobile());
    },

    video_click: function (e) {
        // Scroll to the top as we might have scrolled down to find the video we want
        $('html, body').animate({scrollTop:0},
                                'slow',
                                'linear',
                                function () { pti_gallery.load_video(e.attr("id"), false, pti_gallery.is_mobile()); });
    },

    store_paths: function (e, remove) {
        // We store the data in the body element because waterwheel"
        // seems to interfere with storing it on the image element
        // (perhaps it stores its own data on that?)
        var videoPath = e.nextAll(".video-path:first");
        var posterPath = e.nextAll(".poster-path:first");
        var lowResURL = e.nextAll(".video-low-res:first");
        var mobileURL = e.nextAll(".video-mobile:first");
        var duration = e.nextAll(".video-duration:first");

        $("body").data(e.attr("id"), {video: videoPath.text(),
                                      poster: posterPath.text(),
                                      lowres: lowResURL.text(),
                                      mobile: mobileURL.text(),
                                      duration: duration.text()});

        if (remove) {
            videoPath.remove();
            posterPath.remove();
            lowResURL.remove();
            mobileURL.remove();
            duration.remove();
        }
    }
};

// Initialization
$(document).ready(function() {
    // Save video and poster paths as jquery data.  We also then
    // remove the path elements because their presence confounds
    // waterwheel.
    $("#waterwheelCarousel").children("img").each(function() {
        pti_gallery.store_paths($(this), true);
    });

    // Initialize carousel
    var imgCount = $("#waterwheelCarousel").children("img").length;
    var startingItem = imgCount > 2 ? Math.ceil(imgCount/2) : 1;
    $("#waterwheelCarousel").waterwheelCarousel("horizontal", {
        centerOffset: 30,
        startingItem: startingItem,
        startingItemSeparation: 100,
        startingWaveSeparation: 20,
        clickedCenter: pti_gallery.carousel_click,
    });

    // Add click handlers and collect paths for other videos.  Images are handled by the Lightbox module.
    $("#panel-pti-main-left").find("img")
        .click(function () { pti_gallery.video_click($(this)); })
        .each(function() { pti_gallery.store_paths($(this)); });
    $("#panel-pti-main-center").find("img")
        .click(function () { pti_gallery.video_click($(this)); })
        .each(function() { pti_gallery.store_paths($(this)); });

    // Setup player for first featured video
    startingSelector = "img:eq(" + (startingItem - 1) + ")";
    pti_gallery.load_video($("#waterwheelCarousel").children(startingSelector).attr("id"), false, pti_gallery.is_mobile());
});
