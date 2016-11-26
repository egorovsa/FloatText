/*
 * floatText v1.1.0
 * Plugin for jquery
 * egorovsa2@gmail.com
 *
 * Floating text from block to block.
 * Creating for MediaDesc project.
 *
 * Перетекание текста из блока в блок, с сохранением минимального количества тегов
 * выделения жирности и курсива текста.
 * Для инициализации необходимо создать нужное количество блоков со своими размерами.
 * размеры у блоков должны быть указаны обязательно.
 *
 * Example:
 *
 * <!-- HTML -->
 * <div class="classForInit familyName">Put text here</div>
 * <div class="familyName"></div>
 * <div class="familyName"></div>
 * <div class="familyName"></div>
 * <div class="familyName"></div>
 *
 * //Javascript
 * $(function(){
 $('.classForInit').floatText({
 familyClassName: '.familyName'
 });
 });
 */
(function ($) {
    var methods = {
        //init of  application
        init: function (options) {
            var $this = this;
            //Set a default settings
            var settings = jQuery.extend({
                familyClassName: '.familyBlocks'
            }, options);
            // geting text from first block
            var text = $this.parent().find(settings.familyClassName + ':first').html();
            // run calculation
            methods.calculateFloat.call(jQuery(settings.familyClassName), text);
        },
        calculateFloat: function (text, callbackFunction) {
            var $this = this;
            var tags = [];
            var split = text.split(/\s|(<.*?>)/ig);
            var currentSplit = 0;
            var freeArea = false;
            var accum = '';
            var accumNum = '';
            var blockCount = $this.length;

            $this.each(function (k) {
                var $tb = jQuery(this);
                $tb.empty();
                var parentHeight = $tb.height();
                var checkHeight = parentHeight + 3;

                $tb.css('height', 'auto');

                freeArea = true;
                accum = methods.appendOpenTags(tags, true);
                accumNum = accum;

                for (var i = currentSplit; i < split.length; i++) {
                    var word = split[i];

                    if (word) {
                        accum += word + ' ';

                        $tb.html(accum);

                        //If not overflow
                        var curH = $tb.height();

                        if (curH <= checkHeight) {
                            methods.checkTags(tags, word);
                            accumNum += word + ' ';
                        }

                        //If  overflow
                        if (curH > checkHeight) {
                            if ((k + 1) !== blockCount) {
                                accumNum += methods.appendCloseTags(tags);
                                $tb.html(accumNum);
                                currentSplit = i;
                                freeArea = false;

                                break;
                            }

                            methods.checkOverflowText.call($this, k + 1, blockCount);
                        }
                    }
                }
                //returns begin height typeof(block )
                $tb.height(parentHeight);

                if (freeArea === true) {
                    currentSplit = split.length;
                }
            });

            if (callbackFunction) {
                callbackFunction();
            }
        },
        /*
         * function check overflow text in the last block
         * if overflow, set to block class "overflowText"
         *
         * фукнция  сверяет количество блоков всего и текущее количество при расчете
         * и если расчетное количество получилось  больше, значит текст не влез
         * в текущее количество...
         *
         *
         * methods.checkOverflowText.call($this, k + 1, blockCount);
         * $this objectjquery - family blocks
         * @counter int  - current calc count
         * count - count family blocks
         * return @;
         */
        checkOverflowText: function (counter, count) {
            var $this = this;

            if (counter === count) {
                $this.addClass('overflowText');
            }
        },
        /*  Check tags in word */
        checkTags: function (tags, word) {
            var resultOpen = word.match(/<[^\/].*?>/g);
            var resultClose = word.match(/<\/[^>]/g);

            if (resultOpen && resultOpen[0]) {
                tags.push(resultOpen[0]);
            }

            if (resultClose && resultClose[0]) {
                tags.pop();
            }
        },
        // return open tag, for add to block
        // Вернет открывающий тег, для добавления в блок
        appendOpenTags: function (tags) {
            var tagsString = '';

            tags.map(function (tag) {
                tagsString += tag;
            });

            return tagsString;
        },
        // return close tag for add to block
        // Вернет закрывающий тег, для добавления в блок
        appendCloseTags: function (tags) {
            var tagsString = '';
            tags.map(function (tag) {
                tag = tag.match(/<[\w\-]+/)[0] + '>';                
                tag = tag.replace('<', '</');
                tagsString = tag + tagsString;
            });

            return tagsString;
        }
    };

    //Init of jquery plugin
    $.fn.floatText = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);