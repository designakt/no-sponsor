// redact.js
var counter = 0;
var lastScroll = 0;
var hidden;

// Set the name of the hidden property and the change event for visibility
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
}

/**
 * Reomve parent box containing the word Sponsored
 * will also remove post of users if they use the word
 */
function hide(rect) {
  // get possible targets at position of rect (only works for things in viewport)
  var possibleTargets = document.elementsFromPoint(rect.left, rect.top-pageYOffset);
  if(possibleTargets.length > 0){
    var target;
    // search for best target (last element before height exceeds 1000px)
    for (candidate of possibleTargets) {
      if(candidate.offsetHeight > 1000) break;
      target = candidate;
    }
    if(target){
      // hide target
      // target.style.border = "6px solid red";
      target.parentElement.removeChild(target);
      counter++;
    }
  }
}

/**
 * Go through every rect, redacting them.
 */
function redactAll(rectData) {
  if(rectData.length > 0){
    for (match of rectData) {
      hide(match.rectsAndTexts.rectList[0]);
    }
  }
}

function notifyBackgroundPage(e) {
  if(!document[hidden]){
    // do nothing if last move was less than 1000 ms ago
    if(Date.now() - lastScroll > 800) {
      var sending = browser.runtime.sendMessage({
        count:counter
      });
      sending.then(handleResponse, handleError);
      lastScroll = Date.now();
    }
    return true;
  }
}

function handleResponse(message) {
  redactAll(message);
}

function handleError(error) {
  console.log(`Desponsoring: ${error}`);
}

// start
window.setTimeout(delayedStart, 1800);
function delayedStart(){
  console.log("Desponsoring started.");
  document.addEventListener('DOMNodeInserted', notifyBackgroundPage);
  window.addEventListener('scroll', notifyBackgroundPage);
}
