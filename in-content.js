
setInterval(function(){
  const html = document.documentElement.outerHTML;
  
  chrome.runtime.sendMessage({
    type: 'html',
    data: html,
  }, response => {
    // console.log(response)
  });

  chrome.runtime.sendMessage({
    type: 'getHtml',
  }, response => {
    // console.log(response)
  });
}, 10000);
