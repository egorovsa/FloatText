/*
 * floatText v1.2.0
 * jQuery Plagin
 * egorovsa2@gmail.com
 */
(function ($) {
    var methods = {
        init: function (options) {
            var $this = this;

            var settings = jQuery.extend({
                familyClassName: '.familyBlocks'
            }, options);

            var text = $this.parent().find(settings.familyClassName + ':first').html();

            methods.calculateFloat.call(jQuery(settings.familyClassName), text);
        },
        calculateFloat: function (text, callbackFunction) {
            var $this = this;
            var tags = [];
            var split = text.split(/\s|(<.*?>)/ig);
            var currentSplit = 0;
            var freeArea = false;
            var accum = '';
            var blockCount = $this.length;
            var wordLastParts = '';

            $this.each(function (k) {
                var $tb = $(this);
                $tb.empty();
                var parentHeight = $tb.height();
                var checkHeight = parentHeight + 3;

                $tb.css('height', 'auto');

                freeArea = true;
                accum = methods.appendOpenTags(tags, true);
                
                if (wordLastParts) {
                    accum += wordLastParts + ' ';
                    wordLastParts = '';
                }
                
                for (var i = currentSplit; i < split.length; i++) {
                    var word = split[i];

                    if (word) {
                        $tb.html(accum + word + '');

                        //If not overflow
                        var curH = $tb.height();

                        if (curH <= checkHeight) {
                            methods.checkTags(tags, word);
                            accum += word + ' ';
                        }

                        //If  overflow
                        if (curH > checkHeight) {
                            var checkHyphenResult = methods.checkForHyphen(word, accum, $tb, checkHeight);

                            if (checkHyphenResult) {
                                accum = checkHyphenResult.accum;
                                wordLastParts = checkHyphenResult.lastParts;
                                currentSplit = i + 1;
                            } else {
                                currentSplit = i;
                            }

                            accum += methods.appendCloseTags(tags);
                            $tb.html(accum);

                            if ((k + 1) !== blockCount) {
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
        checkForHyphen: function (word, accum, currentBlock, checkHeight) {
            var partsArray = word.split(/\u00AD/g);

            if (partsArray.length > 1) {
                for (var i = 0; i < partsArray.length; i++) {
                    currentBlock.html(accum + partsArray[i] + '-');

                    if (currentBlock.height() > checkHeight) {
                        return {
                            accum: accum + '-',
                            lastParts: methods.getLastParstOfWord(partsArray, i)
                        };
                    } else {
                        accum = accum + partsArray[i];
                    }
                }
            } else {
                return false;
            }
        },
        getLastParstOfWord: function (partsArray, beginIndex) {
            var concatParts = '';

            for (var i = beginIndex; i < partsArray.length; i++) {
                concatParts += partsArray[i] + (i + 1 === partsArray.length ? '' : '&shy;');
            }

            return concatParts;
        },
        checkOverflowText: function (counter, count) {
            var $this = this;

            if (counter === count) {
                $this.addClass('overflowText');
            }
        },
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

    $.fn.floatText = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);