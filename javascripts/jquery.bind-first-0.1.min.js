/*
 * jQuery.bind-first library v0.1
 * Copyright (c) 2012 Vladimir Zhuravlev
 * 
 * Released under MIT License
 * 
 * Date: Sun Jan 15 20:05:49 GST 2012
 **/(function(a){function e(b,c,e){var f=c.split(/\s+/);b.each(function(){for(var b=0;b<f.length;++b){var c=a.trim(f[b]).match(/[^\.]+/i)[0];d(a(this),c,e)}})}function d(a,d,e){var f=c(a),g=f[d];if(!b){var h=g.pop();g.splice(e?0:g.delegateCount||0,0,h)}else e?f.live.unshift(f.live.pop()):g.unshift(g.pop())}function c(c){return b?c.data("events"):a._data(c[0]).events}var b=parseFloat(a.fn.jquery)<1.7;a.fn.bindFirst=function(){var b=a(this),c=a.makeArray(arguments),d=c.shift();d&&(a.fn.bind.apply(b,arguments),e(b,d));return b},a.fn.delegateFirst=function(){var b=a(this),c=a.makeArray(arguments),d=c[1];d&&(c.splice(0,2),a.fn.delegate.apply(b,arguments),e(a(this),d,!0));return b},a.fn.liveFirst=function(){var b=a(this),c=a.makeArray(arguments);c.unshift(b.selector),a.fn.delegateFirst.apply(a(document),c);return b}})(jQuery)