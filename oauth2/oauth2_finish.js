var url=decodeURIComponent(window.location.href.match(/&from=([^&]+)/)[1]),index=url.indexOf("?");index>-1&&(url=url.substring(0,index));var adapterName=OAuth2.lookupAdapterName(url),finisher=new OAuth2(adapterName,OAuth2.FINISH);