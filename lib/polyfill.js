// String
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function() {'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}


// Array
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}


// Promise
Promise.prototype.finally = function (callback) {
  var constructor = this.constructor;

  return this.then(function(value) {
    return constructor.resolve(callback()).then(function() {
      return value;
    });
  }, function(reason) {
    return constructor.resolve(callback()).then(function() {
      throw reason;
    });
  });
};


// Fetch
window.fetch = function fetch(url, o) {
  if (!url) {
    throw new TypeError("URL parameter is mandatory and cannot be " + url);
  }

  // Set defaults & fixup arguments
  //url = new URL(url, location); // Weixin Browser doesn't support URL, fuck
  o = o || {};
  o.data = o.data || '';
  o.method = o.method || 'GET';
  o.headers = o.headers || {};

  var xhr = new XMLHttpRequest();

  if (!_.isString(o.data)) {
    o.data = Object.keys(o.data).map(function(key){ return key + "=" + encodeURIComponent(o.data[key])}).join("&");
  }

  if (o.method === "GET" && o.data) {
    //url.search += o.data;
    url += ~url.indexOf('?')
        ? '&' + o.data
        : '?' + o.data;
  }

  document.body.setAttribute('data-loading', url);

  xhr.open(o.method, url, !o.sync);

  for (var property in o) {
    if (property in xhr) {
      try {
        xhr[property] = o[property];
      }
      catch (e) {
        self.console && console.error(e);
      }
    }
  }

  if (o.method !== 'GET' && !o.headers['Content-type'] && !o.headers['Content-Type']) {
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }

  for (var header in o.headers) {
    xhr.setRequestHeader(header, o.headers[header]);
  }

  return new Promise(function(resolve, reject){
    xhr.onload = function(){
      document.body.removeAttribute('data-loading');

      if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        // Success!
        resolve(xhr);
      }
      else {
        reject(xhr);
      }

    };

    xhr.onerror = function() {
      document.body.removeAttribute('data-loading');
      reject(Error("Network Error"));
    };

    xhr.send(o.method === 'GET'? null : o.data);
  });
};