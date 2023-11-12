var OAuth2=function(t,a){this.adapterName=t;var o=this;this.config=a,OAuth2.loadAdapter(t,function(){var e;o.adapter=OAuth2.adapters[t],a==OAuth2.FINISH?o.finishAuth():a&&(o.updateLocalStorage(),(e=o.get()).clientId=a.client_id,e.clientSecret=a.client_secret,e.apiScope=a.api_scope,o.setSource(e))})};OAuth2.FINISH="finish",OAuth2.adapters={},OAuth2.adapterReverse=localStorage.oauth2_adapterReverse&&JSON.parse(localStorage.oauth2_adapterReverse)||{},localStorage.adapterReverse&&(OAuth2.adapterReverse=JSON.parse(localStorage.adapterReverse),delete localStorage.adapterReverse),OAuth2.prototype.updateLocalStorage=function(){if(!this.getSource()){for(var e,t={},a=["accessToken","accessTokenDate","apiScope","clientId","clientSecret","expiresIn","refreshToken"],o=0;o<a.length;o++)e=this.adapterName+"_"+a[o],localStorage.hasOwnProperty(e)&&(t[a[o]]=localStorage[e],delete localStorage[e]);this.setSource(t)}},OAuth2.prototype.openAuthorizationCodePopup=function(e){window["oauth-callback"]=e;e=this.getConfig();!e.clientId&&this.config&&(e.clientId=this.config.client_id,e.clientSecret=this.config.client_secret,e.apiScope=this.config.api_scope),chrome.tabs.create({url:this.adapter.authorizationCodeURL(e)},function(e){})},OAuth2.prototype.getAccessAndRefreshTokens=function(e,t){var a=this,o=new XMLHttpRequest,r=(o.addEventListener("readystatechange",function(e){4==o.readyState&&200==o.status&&t(a.adapter.parseAccessToken(o.responseText))}),a.adapter.accessTokenMethod()),n=a.adapter.accessTokenParams(e,a.getConfig()),s=null;if("POST"==r){var c=new FormData;for(s in n)c.append(s,n[s]);o.open(r,a.adapter.accessTokenURL(),!0),o.send(c)}else{if("GET"!=r)throw r+" is an unknown method";var e=a.adapter.accessTokenURL(),i="?";for(s in n)i+=encodeURIComponent(s)+"="+encodeURIComponent(n[s])+"&";o.open(r,e+i,!0),o.send()}},OAuth2.prototype.refreshAccessToken=function(e,a){var o=new XMLHttpRequest,t=(o.onreadystatechange=function(e){var t;4==o.readyState&&200==o.status&&(console.log(o.responseText),t=JSON.parse(o.responseText),a(t.access_token,t.expires_in,t.refresh_token))},this.get()),r=new FormData;r.append("Content-Type","application/x-www-form-urlencoded; charset=utf-8"),r.append("client_id",t.clientId),r.append("client_secret",t.clientSecret),r.append("refresh_token",e),r.append("grant_type","refresh_token"),o.open("POST",this.adapter.accessTokenURL(),!0),o.send(r)},OAuth2.prototype.finishAuth=function(){var e=null,o=this;function r(e){for(var t,a=chrome.extension.getViews(),o=0;t=a[o];o++)t["oauth-callback"]&&t["oauth-callback"](e);window.open("","_self","");try{window.close()}catch(e){console.error(e)}}try{e=o.adapter.parseAuthorizationCode(window.location.href)}catch(e){console.error(e),r(e)}o.getAccessAndRefreshTokens(e,function(e){var t,a=o.get();for(t in a.accessTokenDate=(new Date).valueOf(),e)e.hasOwnProperty(t)&&e[t]&&(a[t]=e[t]);o.setSource(a),r()})},OAuth2.prototype.isAccessTokenExpired=function(){var e=this.get();return(new Date).valueOf()-e.accessTokenDate>1e3*e.expiresIn},OAuth2.prototype.get=function(e){var t=this.getSource(),t=t?JSON.parse(t):{};return e?t[e]:t},OAuth2.prototype.set=function(e,t){var a=this.get();a[e]=t,this.setSource(a)},OAuth2.prototype.clear=function(e){var t;e?(delete(t=this.get())[e],this.setSource(t)):delete localStorage["oauth2_"+this.adapterName]},OAuth2.prototype.getSource=function(){return localStorage["oauth2_"+this.adapterName]},OAuth2.prototype.setSource=function(e){e&&("string"!=typeof e&&(e=JSON.stringify(e)),localStorage["oauth2_"+this.adapterName]=e)},OAuth2.prototype.getConfig=function(){var e=this.get();return{clientId:e.clientId,clientSecret:e.clientSecret,apiScope:e.apiScope}},OAuth2.loadAdapter=function(e,t){var a,o;OAuth2.adapters[e]?t():(a=document.querySelector("head"),(o=document.createElement("script")).type="text/javascript",o.src="/oauth2/adapters/"+e+".js",o.addEventListener("load",function(){t()}),a.appendChild(o))},OAuth2.adapter=function(e,a){"authorizationCodeURL redirectURL accessTokenURL accessTokenMethod accessTokenParams accessToken".split(" ").forEach(function(e,t){if(!e in a)throw"Invalid adapter! Missing method: "+e}),OAuth2.adapters[e]=a,OAuth2.adapterReverse[a.redirectURL()]=e,localStorage.oauth2_adapterReverse=JSON.stringify(OAuth2.adapterReverse)},OAuth2.lookupAdapterName=function(e){return JSON.parse(localStorage.oauth2_adapterReverse)[e]},OAuth2.prototype.authorize=function(r){var n=this;OAuth2.loadAdapter(n.adapterName,function(){n.adapter=OAuth2.adapters[n.adapterName];var e=n.get();e.accessToken?n.isAccessTokenExpired()?e.refreshToken?n.refreshAccessToken(e.refreshToken,function(e,t,a){var o=n.get();o.accessTokenDate=(new Date).valueOf(),o.accessToken=e,o.expiresIn=t,o.refreshToken=a,n.setSource(o),r&&r()}):n.openAuthorizationCodePopup(r):r&&r():n.openAuthorizationCodePopup(r)})},OAuth2.prototype.getAccessToken=function(){return this.get("accessToken")},OAuth2.prototype.hasAccessToken=function(){return!!this.get("accessToken")},OAuth2.prototype.clearAccessToken=function(){this.clear("accessToken")};