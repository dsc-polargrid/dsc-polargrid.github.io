$(function () {
    // Right now we only do this for SCIAPT pages
    if (window.location.pathname.indexOf('/sciapt') >= 0) {
        $('#panel-pti-left-col .pane-content > .menu .menu,#block-menu-menu-sciapt .content > .menu .menu').each(function (i, e) {
            var childAs = $(e).find('a');
            var childAsN = childAs.length;
            var aHref;
            var lDiff;
            for (var i = 0; i < childAsN; i++) {
                aHref = $(childAs[i]).attr('href');
                lDiff = aHref.length - window.location.pathname.length;
                if (lDiff >= 0 && aHref.lastIndexOf(window.location.pathname) === lDiff) return;
            }
            $(e).hide();
        });
        $('#panel-pti-left-col .pane-content > .menu > li > a,#block-menu-menu-sciapt .content > .menu > li > a').each(function (i, e) {
            var childMenus = $(e).parent().children('.menu');
            var siblingMenus = $(e).parent().siblings().children('.menu');
            if (childMenus.length) {
                $(e).click(function() {
                    childMenus.slideToggle('fast');
                    siblingMenus.slideUp('fast');
                    return false;
                });
            }
        });
    }
});
