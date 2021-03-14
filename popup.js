
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
};

function saveAsFile(data) {
  let blob = new Blob([data], {type: "text/html"});
  let url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: `${data.hashCode()}.html`
  });
}

function getSavedPages() {
  chrome.runtime.sendMessage({
    type: 'getHtml',
  }, response => {
    console.log('response', response)

    document.getElementById('savedPages').innerHTML = ''

    const { htmls } = response
    for (let url in htmls){
      const li = document.createElement('li');
      li.innerText = url;
      li.addEventListener('click', function() {
        saveAsFile(htmls[url]);
      });
      document.getElementById('savedPages').appendChild(li);
    }
  });
}

function clearSavedPages() {
  chrome.runtime.sendMessage({
    type: 'clearHtml',
  }, response => {
    console.log('response', response)
  });
}

function toggleAutosave(){
  chrome.runtime.sendMessage({
    type: 'toggleAutosave',
  }, response => {
    console.log('response', response)
    if(response){
      document.getElementById('autosave').checked = true;
    }else{
      document.getElementById('autosave').checked = false;
    }
  });
}

function getAutosaveStatus(){
  chrome.runtime.sendMessage({
    type: 'getAutosaveStatus',
  }, response => {
    console.log('response', response)
    if(response){
      document.getElementById('autosave').checked = true;
    }else{
      document.getElementById('autosave').checked = false;
    }
  });
}

const initPopupScript = () => {
  getSavedPages();
  getAutosaveStatus();

  document.getElementById('buttonRefreshSavedPages').addEventListener('click', function(){
    getSavedPages();
  })

  document.getElementById('buttonClearSavedPages').addEventListener('click', function(){
    clearSavedPages();
    getSavedPages();
  })

  document.getElementById('autosave').addEventListener('click', function(){
    toggleAutosave();
  })
};

document.addEventListener('DOMContentLoaded', initPopupScript);
