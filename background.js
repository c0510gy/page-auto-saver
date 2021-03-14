
let AUTOSAVE = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  const { type, data } = message
  const { url } = sender

  if(type === 'html'){
    sendResponse('received html data');

    if(AUTOSAVE){
      chrome.storage.local.get('htmls', function(items){
        if(typeof items.htmls === 'object' && items.htmls !== null){
          items.htmls[url] = data
        }else{
          items.htmls = {}
          items.htmls[url] = data
        }
        
        chrome.storage.local.set(items, function(){
          sendResponse('html data saved');
        });
      })
    }
    
  }else if(type === 'getHtml'){
    chrome.storage.local.get('htmls', function(items){
      console.log('items', items)
      sendResponse(items);
    })
    
  }else if(type === 'clearHtml'){
    chrome.storage.local.set({
      htmls: {}
    }, function(){
      sendResponse('html data cleared');
    });
  }else if(type === 'toggleAutosave'){
    AUTOSAVE = !AUTOSAVE
    sendResponse(AUTOSAVE);
  }else if(type === 'getAutosaveStatus'){
    sendResponse(AUTOSAVE);
  }

  return true;
});
