(function($) {

    $.fn.nslider = function(options) {

        var settings = $.extend({
            minVal: 0,
            maxVal: 10,
            values: [],
        }, options);

        var minLeft = this.offset().left;
        var maxRight = minLeft + this.width() - 12;
        var $this = $(this);

        //If it doesn't have the nslider class, add it.
        if (!this.hasClass('nslider')) {
            this.addClass('nslider');
        }

        //Check if settings.minVal and settings.maxVal are integers
        if (!(settings.minVal === parseInt(settings.minVal, 10)) || !(settings.maxVal === parseInt(settings.maxVal, 10))) return;

        // Calculate rate
        var rate = (maxRight - minLeft) / (settings.maxVal - settings.minVal);

        //Get init values 
        var values = settings.values;

        this.append('<div class="pointers"></div><span class="stretch"></span><div class="rangeline"></div>');

        //Create the actual steps and their value
        for (var i = 0; i < values.length; i++) {
            draggerCreate(values[i]);
        }

        //==================== DRAGGABLE ====================\\
        var lastLeftOffset = null;
        $this.on('mousedown', '.dragger', function(e) {
            e.stopPropagation();
            e.preventDefault();

            var dragger = $(this);
            $(document).on('mousemove.dragger', function(e) {
                e.stopPropagation();
                e.preventDefault();
                lastLeftOffset = e.pageX - dragger.outerWidth() / 2;

                if (lastLeftOffset < minLeft) lastLeftOffset = minLeft;
                if (lastLeftOffset > maxRight) lastLeftOffset = maxRight;

                dragger.offset({
                    left: lastLeftOffset
                });
                dragger.addClass('draggable');
            });
            $(document).one('mouseup.dragger', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (lastLeftOffset === null) lastLeftOffset = $(this).offset().left;
                $(document).off('mousemove.dragger mouseup.dragger');
                dragger.removeClass('draggable');
                $this.trigger('change', [getValues()]);

            });

        });

        function draggerCreate(value) {
            var $el = $("<div class='dragger'><div class='arrow'>&#8801;</div><div class='active'></div></div>");
            $el.offset({
                left: value * rate
            });
            $this.children('.pointers').append($el);
        }

        function getValues() {
            var _values = [];
            $this.find('.dragger').each(function() {
                _values.push(parseInt(($(this).offset().left - minLeft) / rate));
            });
            return _values;
        }



        // PUBLIC API

        this.val = function() {
            return getValues();
        };

        this.clear = function() {
            $this.children('.pointers').empty();
        };

        this.add = function(value) {
            draggerCreate(parseInt(value));
        };

        return this;
    };

}(jQuery));