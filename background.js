
var sponsorString = "Sponsored · ";

browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  console.log("->"+request.count);
  if(request.count > 0) browser.browserAction.setBadgeText({text: (request.count).toString()});
  // process search for Sponsored Content on request of content script and return
  return browser.find.find(
    sponsorString, {includeRectData: true})
    .then(function(results) {
    return results.rectData;
  });
}
