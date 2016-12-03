// A third party jQuery plugin that emits a custom event
(function ($) {
    $.fn.thirdPartyJQueryPlugin = function () {
        return this.each(function () {
            var $element = $(this);
            var template = "<div class='third-party-jquery-plugin'>Third party jQuery plugin. Click here to update count. Count: <span class='count'></span></div>";
            var count = 0;

            var api = {
                setCount: function (_count) {
                    count = _count;
                    updateHtmlCount(count);
                },
                getCount: function () {
                    return count;
                }
            };

            $element.append(template);

            $element.data("api", api);

            $element.on("click", function () {
                updateHtmlCount(++count);
                $element.trigger("countUpdate");
            });

            function updateHtmlCount(count) {
                $element.find(".count").text(count);
            }
        });
    };
})(jQuery);