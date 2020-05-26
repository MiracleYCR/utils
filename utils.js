class Jsonp {
  createScript (url) { // 创建 script 标签
    const dom = document.createElement('script');
    dom.setAttribute('type', 'text/javascript');
    dom.setAttribute('src', url);
    dom.async = true;
    return dom;
  }
  
  createCbName (prefixe) { // 随机获取函数名
    return prefixe + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  }
  
  jsonp (url) { // jsonp 调用方法
    return new Promise((resolve, reject) => {
      const cbName = this.createCbName('jsonp_');
      url += url.indexOf('?') === -1 ? `?callback=${cbName}` : `&callback=${cbName}`;
      const script = this.createScript(url);

      window[cbName] = function () {
        resolve(arguments[0])
      }

      // 加载完成事件
      if (script.readyState) { // IE
        script.onreadystatechange = function () {
          if( script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null; // 同时检查两种状态，只要有一种触发就删除事件处理器，避免触发两次
            if (script.parentNode) {
              script.parentNode.removeChild(script); // 移除该script的 DOM 对象
            }
            window[cbName] = null; // 删除函数或变量
          }
        }
      } else {
        script.onload = function () {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          window[cbName] = null;
        }
      }
      script.onerror = function (msg, url, line) { // 错误事件
        reject(new Error(`msg: ${msg}; url: ${url}; line: ${line}`))
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }
}

class Funcs {
  memoize (func, hasher) { // 缓存函数
    const _memoize = function (key) {
      const _cache = _memoize.cache;
      const _key = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_cache[_key]) {
        _cache[_key] = func.apply(this, arguments);
      }
      return _cache[_key];
    }
    _memoize.cache = {};
    return _memoize;
  }
}

class Optimize {
  debounce (fn, delay) { // 防抖
    let timer = null;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args)
      }, delay);
    }
  }

  throttle (fn, delay) { // 节流
    let flag = true;
    return function (...args) {
      if (!flag) return;
      flag = false;
      setTimeout(() => {
        fn(...args);
        flag = true;
      }, delay);
    }
  }
}

function Utils (type) {
  return Utils.components[type];
}

Utils.components = {
  jsonp: new Jsonp(),
  funcs: new Funcs(),
  optimize: new Optimize()
}

export default Utils;


