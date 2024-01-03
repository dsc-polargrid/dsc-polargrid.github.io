/**
  * Overriding some functions in the ddblock module -- this code may
  * require updating if ddblock.js changes.
  */
Drupal.behaviors.ddblockImg = function (context) {
  for (var base in Drupal.settings.ddblockImages) {
    // get variables
    var ddblockSettings = Drupal.settings.ddblockImages[base];

    // if no template and CCS is used set the image dimensions here
    if (ddblockSettings.setDimensions == 'none') {
      if ((ddblockSettings.imageHeight > 0) && (ddblockSettings.imageWidth > 0 )) {
        $('#ddblock-'+ ddblockSettings.block +' .ddblock-container img:not(.ddblock-processed)', context)
        .css('height',ddblockSettings.imageHeight + 'px')
        .css('width',ddblockSettings.imageWidth + 'px')
        .addClass('ddblock-processed');
      }
    }
  }
};
