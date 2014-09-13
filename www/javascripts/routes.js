var jsRoutes = {}; (function(_root){
var _nS = function(c,f,b){var e=c.split(f||"."),g=b||_root,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{}}return g}
var _qS = function(items){var qs = ''; for(var i=0;i<items.length;i++) {if(items[i]) qs += (qs ? '&' : '') + items[i]}; return qs ? ('?' + qs) : ''}
var _s = function(p,s){return p+((s===true||(s&&s.secure))?'s':'')+'://'}
var _wA = function(r){return {ajax:function(c){c=c||{};c.url=r.url;c.type=r.method;return jQuery.ajax(c)}, method:r.method,type:r.method,url:r.url,absoluteURL: function(s){return _s('http',s)+'localhost:9000'+r.url},webSocketURL: function(s){return _s('ws',s)+'localhost:9000'+r.url}}}
_nS('controllers.Application'); _root.controllers.Application.createSpot = 
      function() {
      return _wA({method:"POST", url:"/" + "i/s"})
      }
   
_nS('controllers.Application'); _root.controllers.Application.retrieveSpot = 
      function(id) {
      return _wA({method:"GET", url:"/" + "f/s/" + (function(k,v) {return v})("id", encodeURIComponent(id))})
      }
   
_nS('controllers.Application'); _root.controllers.Application.updateSpot = 
      function() {
      return _wA({method:"PUT", url:"/" + "u/s"})
      }
   
_nS('controllers.Application'); _root.controllers.Application.findNearby = 
      function(lat,lon,radius,offset) {
      return _wA({method:"GET", url:"/" + "f/" + (function(k,v) {return v})("lat", lat) + "/" + (function(k,v) {return v})("lon", lon) + "/" + (function(k,v) {return v})("radius", radius) + "/" + (function(k,v) {return v})("offset", offset)})
      }
   
_nS('controllers.Application'); _root.controllers.Application.findByCity = 
      function(city,offset) {
      return _wA({method:"GET", url:"/" + "f/" + (function(k,v) {return v})("city", encodeURIComponent(city)) + "/" + (function(k,v) {return v})("offset", offset)})
      }
   
})(jsRoutes)
          