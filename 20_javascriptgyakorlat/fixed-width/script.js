(function(window, $) {
  'use strict';

  var fontSizes = [/*10, 12, 14,*/ 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

  $(function() {
    $('.fonts > li').each(function(listItemIndex, element) {
      var $li = $(element),
          $chamber = $li.find('.test-chamber'),
          $images = $chamber.find('img'),
          $results = $li.find('.results');

      // measure
      fontSizes.forEach(function(size, sizeIndex) {
        var data, width, ratio;

        // set font size
        $chamber.css({
          fontSize: size + 'px'
        });

        // get image positions
        data = $images.map(function(j, image) {
          var $image = $(image);

          return {
            x: $image.position().left,
            width: $image.width()
          };
        });

        // result
        width = data[1].x - (data[0].x + data[0].width);
        ratio = Math.round(width * 10000 / size) / 100;
        $results.append('<dt>' + size + 'px:</dt><dd>' + ratio + '%<!--' + data[0].x + ' ' + data[0].width + ' ' + data[1].x + '--></dd>');
      });

      // cleanup
      $chamber.remove();
    });
  });
})(window, this.jQuery);
