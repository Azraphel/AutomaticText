var booSkipAutomatedText = false;

function skipAutomatedText() {
    booSkipAutomatedText = true;
}

function automatedText(selector, timeBetweenText, exclude, timeBeforeStart, breakWord, breakTime) {
    if (selector == null || selector.trim() == '')
        return;

    timeBetweenText = (timeBetweenText == null ? 0 : timeBetweenText);
    timeBeforeStart = (timeBeforeStart == null ? 0 : timeBeforeStart);
    var textInfo = {
        selector: selector,
        timeBetweenText: timeBetweenText,
        exclude: exclude,
        timeBeforeStart, timeBeforeStart
    }

    if (breakWord != null) {
        textInfo['breakWord'] = breakWord;
        textInfo['breakTime'] = (breakTime == null ? 0 : breakTime);
    }

    setTimeout(function () {
        automaticText(textInfo);
    }, textInfo.timeBeforeStart);

    function automaticText(objTextInfo) {
        var $lines = document.querySelectorAll(objTextInfo.selector),
            lineContents = new Array(),
            lineCount = $lines.length;

        var skip = 0;

        for (var i = 0; i < lineCount; i++) {
            lineContents[i] = $lines[i].textContent;
            $lines[i].textContent = '';
            $lines[i].style.display = 'block';
        }
        typeLine();

        function typeLine(idx) {
            idx == null && (idx = 0);
            var element = $lines[idx];
            var content = lineContents[idx];

            if (typeof content == "undefined") {
                var elClassSkip = document.getElementsByClassName('skip');
                var lengthClassSkip = elClassSkip.length;

                while (lengthClassSkip--) {
                    elClassSkip[lengthClassSkip].style.display = 'none';
                }
                return;
            }

            var booExclude = false;

            if (objTextInfo.exclude != null) {
                element.classList.forEach(function (elementClass) {
                    if (!booExclude) { booExclude = objTextInfo.exclude.includes(elementClass); }
                });

                booExclude = (booExclude || !booExclude && objTextInfo.exclude.includes(element.tagName.toLowerCase()));
            }

            var charIdx = 0;

            if (booExclude || booSkipAutomatedText) {
                element.textContent = content;
                typeLine(++idx);
            } else {
                content = '' + content + '';
                element.appendChild(document.createTextNode(' '));
                element.className += ' active';
                typeChar();
            }

            function typeChar() {

                var rand = (!booSkipAutomatedText ? Math.round(Math.random() * 50) + 25 : 0);

                setTimeout(function () {
                    var char = content[charIdx++],
                        booBreak = false;

                    if (objTextInfo.breakWord != null && char == objTextInfo.breakWord.charAt(0) && content.substring(charIdx - 1, charIdx + objTextInfo.breakWord.length - 1) == objTextInfo.breakWord) {
                        content = content.replace(objTextInfo.breakWord, '');
                        char = content[charIdx - 1];
                        booBreak = true;
                    }
                    setTimeout(function () {
                        if (typeof char !== "undefined") {
                            element.appendChild(document.createTextNode(char));
                            typeChar();
                        }
                        else {
                            element.classList.remove('active');
                            setTimeout(function () {
                                typeLine(++idx);
                            }, (!booSkipAutomatedText ? objTextInfo.timeBetweenText : 0));
                        }
                    }, (booBreak && !booSkipAutomatedText ? objTextInfo.breakTime : 0))
                }, rand);
            }
        }
    }
}