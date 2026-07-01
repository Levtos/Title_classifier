var kc = Object.defineProperty;
var Sc = (e, t, n) => t in e ? kc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var El = (e, t, n) => Sc(e, typeof t != "symbol" ? t + "" : t, n);
var ts = { exports: {} }, M = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qn = Symbol.for("react.element"), Ec = Symbol.for("react.portal"), _c = Symbol.for("react.fragment"), Nc = Symbol.for("react.strict_mode"), Cc = Symbol.for("react.profiler"), jc = Symbol.for("react.provider"), zc = Symbol.for("react.context"), Pc = Symbol.for("react.forward_ref"), Tc = Symbol.for("react.suspense"), Lc = Symbol.for("react.memo"), Dc = Symbol.for("react.lazy"), Vo = Symbol.iterator;
function Rc(e) {
  return e === null || typeof e != "object" ? null : (e = Vo && e[Vo] || e["@@iterator"], typeof e == "function" ? e : null);
}
var ns = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, rs = Object.assign, ls = {};
function dn(e, t, n) {
  this.props = e, this.context = t, this.refs = ls, this.updater = n || ns;
}
dn.prototype.isReactComponent = {};
dn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
dn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function is() {
}
is.prototype = dn.prototype;
function Wi(e, t, n) {
  this.props = e, this.context = t, this.refs = ls, this.updater = n || ns;
}
var Qi = Wi.prototype = new is();
Qi.constructor = Wi;
rs(Qi, dn.prototype);
Qi.isPureReactComponent = !0;
var Bo = Array.isArray, os = Object.prototype.hasOwnProperty, Ki = { current: null }, us = { key: !0, ref: !0, __self: !0, __source: !0 };
function ss(e, t, n) {
  var r, l = {}, i = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (i = "" + t.key), t) os.call(t, r) && !us.hasOwnProperty(r) && (l[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) l.children = n;
  else if (1 < u) {
    for (var s = Array(u), d = 0; d < u; d++) s[d] = arguments[d + 2];
    l.children = s;
  }
  if (e && e.defaultProps) for (r in u = e.defaultProps, u) l[r] === void 0 && (l[r] = u[r]);
  return { $$typeof: qn, type: e, key: i, ref: o, props: l, _owner: Ki.current };
}
function Mc(e, t) {
  return { $$typeof: qn, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Yi(e) {
  return typeof e == "object" && e !== null && e.$$typeof === qn;
}
function Ic(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Ho = /\/+/g;
function _l(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Ic("" + e.key) : t.toString(36);
}
function _r(e, t, n, r, l) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else switch (i) {
    case "string":
    case "number":
      o = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case qn:
        case Ec:
          o = !0;
      }
  }
  if (o) return o = e, l = l(o), e = r === "" ? "." + _l(o, 0) : r, Bo(l) ? (n = "", e != null && (n = e.replace(Ho, "$&/") + "/"), _r(l, t, n, "", function(d) {
    return d;
  })) : l != null && (Yi(l) && (l = Mc(l, n + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(Ho, "$&/") + "/") + e)), t.push(l)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", Bo(e)) for (var u = 0; u < e.length; u++) {
    i = e[u];
    var s = r + _l(i, u);
    o += _r(i, t, n, s, l);
  }
  else if (s = Rc(e), typeof s == "function") for (e = s.call(e), u = 0; !(i = e.next()).done; ) i = i.value, s = r + _l(i, u++), o += _r(i, t, n, s, l);
  else if (i === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function ir(e, t, n) {
  if (e == null) return e;
  var r = [], l = 0;
  return _r(e, r, "", "", function(i) {
    return t.call(n, i, l++);
  }), r;
}
function Oc(e) {
  if (e._status === -1) {
    var t = e._result;
    t = t(), t.then(function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n);
    }, function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n);
    }), e._status === -1 && (e._status = 0, e._result = t);
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var de = { current: null }, Nr = { transition: null }, Fc = { ReactCurrentDispatcher: de, ReactCurrentBatchConfig: Nr, ReactCurrentOwner: Ki };
function as() {
  throw Error("act(...) is not supported in production builds of React.");
}
M.Children = { map: ir, forEach: function(e, t, n) {
  ir(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return ir(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return ir(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!Yi(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
M.Component = dn;
M.Fragment = _c;
M.Profiler = Cc;
M.PureComponent = Wi;
M.StrictMode = Nc;
M.Suspense = Tc;
M.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Fc;
M.act = as;
M.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = rs({}, e.props), l = e.key, i = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (i = t.ref, o = Ki.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
    for (s in t) os.call(t, s) && !us.hasOwnProperty(s) && (r[s] = t[s] === void 0 && u !== void 0 ? u[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    u = Array(s);
    for (var d = 0; d < s; d++) u[d] = arguments[d + 2];
    r.children = u;
  }
  return { $$typeof: qn, type: e.type, key: l, ref: i, props: r, _owner: o };
};
M.createContext = function(e) {
  return e = { $$typeof: zc, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: jc, _context: e }, e.Consumer = e;
};
M.createElement = ss;
M.createFactory = function(e) {
  var t = ss.bind(null, e);
  return t.type = e, t;
};
M.createRef = function() {
  return { current: null };
};
M.forwardRef = function(e) {
  return { $$typeof: Pc, render: e };
};
M.isValidElement = Yi;
M.lazy = function(e) {
  return { $$typeof: Dc, _payload: { _status: -1, _result: e }, _init: Oc };
};
M.memo = function(e, t) {
  return { $$typeof: Lc, type: e, compare: t === void 0 ? null : t };
};
M.startTransition = function(e) {
  var t = Nr.transition;
  Nr.transition = {};
  try {
    e();
  } finally {
    Nr.transition = t;
  }
};
M.unstable_act = as;
M.useCallback = function(e, t) {
  return de.current.useCallback(e, t);
};
M.useContext = function(e) {
  return de.current.useContext(e);
};
M.useDebugValue = function() {
};
M.useDeferredValue = function(e) {
  return de.current.useDeferredValue(e);
};
M.useEffect = function(e, t) {
  return de.current.useEffect(e, t);
};
M.useId = function() {
  return de.current.useId();
};
M.useImperativeHandle = function(e, t, n) {
  return de.current.useImperativeHandle(e, t, n);
};
M.useInsertionEffect = function(e, t) {
  return de.current.useInsertionEffect(e, t);
};
M.useLayoutEffect = function(e, t) {
  return de.current.useLayoutEffect(e, t);
};
M.useMemo = function(e, t) {
  return de.current.useMemo(e, t);
};
M.useReducer = function(e, t, n) {
  return de.current.useReducer(e, t, n);
};
M.useRef = function(e) {
  return de.current.useRef(e);
};
M.useState = function(e) {
  return de.current.useState(e);
};
M.useSyncExternalStore = function(e, t, n) {
  return de.current.useSyncExternalStore(e, t, n);
};
M.useTransition = function() {
  return de.current.useTransition();
};
M.version = "18.3.1";
ts.exports = M;
var T = ts.exports, cs = { exports: {} }, Se = {}, ds = { exports: {} }, fs = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
  function t(C, D) {
    var R = C.length;
    C.push(D);
    e: for (; 0 < R; ) {
      var X = R - 1 >>> 1, b = C[X];
      if (0 < l(b, D)) C[X] = D, C[R] = b, R = X;
      else break e;
    }
  }
  function n(C) {
    return C.length === 0 ? null : C[0];
  }
  function r(C) {
    if (C.length === 0) return null;
    var D = C[0], R = C.pop();
    if (R !== D) {
      C[0] = R;
      e: for (var X = 0, b = C.length, rr = b >>> 1; X < rr; ) {
        var St = 2 * (X + 1) - 1, Sl = C[St], Et = St + 1, lr = C[Et];
        if (0 > l(Sl, R)) Et < b && 0 > l(lr, Sl) ? (C[X] = lr, C[Et] = R, X = Et) : (C[X] = Sl, C[St] = R, X = St);
        else if (Et < b && 0 > l(lr, R)) C[X] = lr, C[Et] = R, X = Et;
        else break e;
      }
    }
    return D;
  }
  function l(C, D) {
    var R = C.sortIndex - D.sortIndex;
    return R !== 0 ? R : C.id - D.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function() {
      return i.now();
    };
  } else {
    var o = Date, u = o.now();
    e.unstable_now = function() {
      return o.now() - u;
    };
  }
  var s = [], d = [], h = 1, v = null, m = 3, w = !1, S = !1, _ = !1, E = typeof setTimeout == "function" ? setTimeout : null, f = typeof clearTimeout == "function" ? clearTimeout : null, c = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function p(C) {
    for (var D = n(d); D !== null; ) {
      if (D.callback === null) r(d);
      else if (D.startTime <= C) r(d), D.sortIndex = D.expirationTime, t(s, D);
      else break;
      D = n(d);
    }
  }
  function g(C) {
    if (_ = !1, p(C), !S) if (n(s) !== null) S = !0, We(k);
    else {
      var D = n(d);
      D !== null && Qe(g, D.startTime - C);
    }
  }
  function k(C, D) {
    S = !1, _ && (_ = !1, f(P), P = -1), w = !0;
    var R = m;
    try {
      for (p(D), v = n(s); v !== null && (!(v.expirationTime > D) || C && !B()); ) {
        var X = v.callback;
        if (typeof X == "function") {
          v.callback = null, m = v.priorityLevel;
          var b = X(v.expirationTime <= D);
          D = e.unstable_now(), typeof b == "function" ? v.callback = b : v === n(s) && r(s), p(D);
        } else r(s);
        v = n(s);
      }
      if (v !== null) var rr = !0;
      else {
        var St = n(d);
        St !== null && Qe(g, St.startTime - D), rr = !1;
      }
      return rr;
    } finally {
      v = null, m = R, w = !1;
    }
  }
  var j = !1, z = null, P = -1, F = 5, y = -1;
  function B() {
    return !(e.unstable_now() - y < F);
  }
  function L() {
    if (z !== null) {
      var C = e.unstable_now();
      y = C;
      var D = !0;
      try {
        D = z(!0, C);
      } finally {
        D ? U() : (j = !1, z = null);
      }
    } else j = !1;
  }
  var U;
  if (typeof c == "function") U = function() {
    c(L);
  };
  else if (typeof MessageChannel < "u") {
    var _e = new MessageChannel(), $e = _e.port2;
    _e.port1.onmessage = L, U = function() {
      $e.postMessage(null);
    };
  } else U = function() {
    E(L, 0);
  };
  function We(C) {
    z = C, j || (j = !0, U());
  }
  function Qe(C, D) {
    P = E(function() {
      C(e.unstable_now());
    }, D);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(C) {
    C.callback = null;
  }, e.unstable_continueExecution = function() {
    S || w || (S = !0, We(k));
  }, e.unstable_forceFrameRate = function(C) {
    0 > C || 125 < C ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : F = 0 < C ? Math.floor(1e3 / C) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return m;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(s);
  }, e.unstable_next = function(C) {
    switch (m) {
      case 1:
      case 2:
      case 3:
        var D = 3;
        break;
      default:
        D = m;
    }
    var R = m;
    m = D;
    try {
      return C();
    } finally {
      m = R;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(C, D) {
    switch (C) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        C = 3;
    }
    var R = m;
    m = C;
    try {
      return D();
    } finally {
      m = R;
    }
  }, e.unstable_scheduleCallback = function(C, D, R) {
    var X = e.unstable_now();
    switch (typeof R == "object" && R !== null ? (R = R.delay, R = typeof R == "number" && 0 < R ? X + R : X) : R = X, C) {
      case 1:
        var b = -1;
        break;
      case 2:
        b = 250;
        break;
      case 5:
        b = 1073741823;
        break;
      case 4:
        b = 1e4;
        break;
      default:
        b = 5e3;
    }
    return b = R + b, C = { id: h++, callback: D, priorityLevel: C, startTime: R, expirationTime: b, sortIndex: -1 }, R > X ? (C.sortIndex = R, t(d, C), n(s) === null && C === n(d) && (_ ? (f(P), P = -1) : _ = !0, Qe(g, R - X))) : (C.sortIndex = b, t(s, C), S || w || (S = !0, We(k))), C;
  }, e.unstable_shouldYield = B, e.unstable_wrapCallback = function(C) {
    var D = m;
    return function() {
      var R = m;
      m = D;
      try {
        return C.apply(this, arguments);
      } finally {
        m = R;
      }
    };
  };
})(fs);
ds.exports = fs;
var $c = ds.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Uc = T, ke = $c;
function x(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var ps = /* @__PURE__ */ new Set(), In = {};
function Ot(e, t) {
  rn(e, t), rn(e + "Capture", t);
}
function rn(e, t) {
  for (In[e] = t, e = 0; e < t.length; e++) ps.add(t[e]);
}
var Je = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Jl = Object.prototype.hasOwnProperty, Ac = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Wo = {}, Qo = {};
function Vc(e) {
  return Jl.call(Qo, e) ? !0 : Jl.call(Wo, e) ? !1 : Ac.test(e) ? Qo[e] = !0 : (Wo[e] = !0, !1);
}
function Bc(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Hc(e, t, n, r) {
  if (t === null || typeof t > "u" || Bc(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === !1;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return !1;
}
function fe(e, t, n, r, l, i, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
}
var le = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  le[e] = new fe(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  le[t] = new fe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  le[e] = new fe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  le[e] = new fe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  le[e] = new fe(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  le[e] = new fe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  le[e] = new fe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  le[e] = new fe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  le[e] = new fe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Xi = /[\-:]([a-z])/g;
function Gi(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Xi,
    Gi
  );
  le[t] = new fe(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Xi, Gi);
  le[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Xi, Gi);
  le[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  le[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
le.xlinkHref = new fe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  le[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Zi(e, t, n, r) {
  var l = le.hasOwnProperty(t) ? le[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Hc(t, n, l, r) && (n = null), r || l === null ? Vc(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var tt = Uc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, or = Symbol.for("react.element"), Ut = Symbol.for("react.portal"), At = Symbol.for("react.fragment"), Ji = Symbol.for("react.strict_mode"), ql = Symbol.for("react.profiler"), ms = Symbol.for("react.provider"), hs = Symbol.for("react.context"), qi = Symbol.for("react.forward_ref"), bl = Symbol.for("react.suspense"), ei = Symbol.for("react.suspense_list"), bi = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), vs = Symbol.for("react.offscreen"), Ko = Symbol.iterator;
function mn(e) {
  return e === null || typeof e != "object" ? null : (e = Ko && e[Ko] || e["@@iterator"], typeof e == "function" ? e : null);
}
var K = Object.assign, Nl;
function Sn(e) {
  if (Nl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Nl = t && t[1] || "";
  }
  return `
` + Nl + e;
}
var Cl = !1;
function jl(e, t) {
  if (!e || Cl) return "";
  Cl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (d) {
        var r = d;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (d) {
        r = d;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (d) {
        r = d;
      }
      e();
    }
  } catch (d) {
    if (d && r && typeof d.stack == "string") {
      for (var l = d.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, u = i.length - 1; 1 <= o && 0 <= u && l[o] !== i[u]; ) u--;
      for (; 1 <= o && 0 <= u; o--, u--) if (l[o] !== i[u]) {
        if (o !== 1 || u !== 1)
          do
            if (o--, u--, 0 > u || l[o] !== i[u]) {
              var s = `
` + l[o].replace(" at new ", " at ");
              return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
            }
          while (1 <= o && 0 <= u);
        break;
      }
    }
  } finally {
    Cl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Sn(e) : "";
}
function Wc(e) {
  switch (e.tag) {
    case 5:
      return Sn(e.type);
    case 16:
      return Sn("Lazy");
    case 13:
      return Sn("Suspense");
    case 19:
      return Sn("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = jl(e.type, !1), e;
    case 11:
      return e = jl(e.type.render, !1), e;
    case 1:
      return e = jl(e.type, !0), e;
    default:
      return "";
  }
}
function ti(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case At:
      return "Fragment";
    case Ut:
      return "Portal";
    case ql:
      return "Profiler";
    case Ji:
      return "StrictMode";
    case bl:
      return "Suspense";
    case ei:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case hs:
      return (e.displayName || "Context") + ".Consumer";
    case ms:
      return (e._context.displayName || "Context") + ".Provider";
    case qi:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case bi:
      return t = e.displayName || null, t !== null ? t : ti(e.type) || "Memo";
    case rt:
      t = e._payload, e = e._init;
      try {
        return ti(e(t));
      } catch {
      }
  }
  return null;
}
function Qc(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return ti(t);
    case 8:
      return t === Ji ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function gt(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function gs(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Kc(e) {
  var t = gs(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var l = n.get, i = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return l.call(this);
    }, set: function(o) {
      r = "" + o, i.call(this, o);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(o) {
      r = "" + o;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function ur(e) {
  e._valueTracker || (e._valueTracker = Kc(e));
}
function ys(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = gs(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Or(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function ni(e, t) {
  var n = t.checked;
  return K({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Yo(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = gt(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function xs(e, t) {
  t = t.checked, t != null && Zi(e, "checked", t, !1);
}
function ri(e, t) {
  xs(e, t);
  var n = gt(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? li(e, t.type, n) : t.hasOwnProperty("defaultValue") && li(e, t.type, gt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Xo(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function li(e, t, n) {
  (t !== "number" || Or(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var En = Array.isArray;
function Jt(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + gt(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        e[l].selected = !0, r && (e[l].defaultSelected = !0);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function ii(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(x(91));
  return K({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Go(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(x(92));
      if (En(n)) {
        if (1 < n.length) throw Error(x(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: gt(n) };
}
function ws(e, t) {
  var n = gt(t.value), r = gt(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function Zo(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function ks(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function oi(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? ks(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var sr, Ss = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, l);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (sr = sr || document.createElement("div"), sr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = sr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function On(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Cn = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, Yc = ["Webkit", "ms", "Moz", "O"];
Object.keys(Cn).forEach(function(e) {
  Yc.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Cn[t] = Cn[e];
  });
});
function Es(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Cn.hasOwnProperty(e) && Cn[e] ? ("" + t).trim() : t + "px";
}
function _s(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = Es(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var Xc = K({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function ui(e, t) {
  if (t) {
    if (Xc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(x(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(x(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(x(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(x(62));
  }
}
function si(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var ai = null;
function eo(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var ci = null, qt = null, bt = null;
function Jo(e) {
  if (e = tr(e)) {
    if (typeof ci != "function") throw Error(x(280));
    var t = e.stateNode;
    t && (t = cl(t), ci(e.stateNode, e.type, t));
  }
}
function Ns(e) {
  qt ? bt ? bt.push(e) : bt = [e] : qt = e;
}
function Cs() {
  if (qt) {
    var e = qt, t = bt;
    if (bt = qt = null, Jo(e), t) for (e = 0; e < t.length; e++) Jo(t[e]);
  }
}
function js(e, t) {
  return e(t);
}
function zs() {
}
var zl = !1;
function Ps(e, t, n) {
  if (zl) return e(t, n);
  zl = !0;
  try {
    return js(e, t, n);
  } finally {
    zl = !1, (qt !== null || bt !== null) && (zs(), Cs());
  }
}
function Fn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = cl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(x(231, t, typeof n));
  return n;
}
var di = !1;
if (Je) try {
  var hn = {};
  Object.defineProperty(hn, "passive", { get: function() {
    di = !0;
  } }), window.addEventListener("test", hn, hn), window.removeEventListener("test", hn, hn);
} catch {
  di = !1;
}
function Gc(e, t, n, r, l, i, o, u, s) {
  var d = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, d);
  } catch (h) {
    this.onError(h);
  }
}
var jn = !1, Fr = null, $r = !1, fi = null, Zc = { onError: function(e) {
  jn = !0, Fr = e;
} };
function Jc(e, t, n, r, l, i, o, u, s) {
  jn = !1, Fr = null, Gc.apply(Zc, arguments);
}
function qc(e, t, n, r, l, i, o, u, s) {
  if (Jc.apply(this, arguments), jn) {
    if (jn) {
      var d = Fr;
      jn = !1, Fr = null;
    } else throw Error(x(198));
    $r || ($r = !0, fi = d);
  }
}
function Ft(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Ts(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function qo(e) {
  if (Ft(e) !== e) throw Error(x(188));
}
function bc(e) {
  var t = e.alternate;
  if (!t) {
    if (t = Ft(e), t === null) throw Error(x(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (r = l.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return qo(l), e;
        if (i === r) return qo(l), t;
        i = i.sibling;
      }
      throw Error(x(188));
    }
    if (n.return !== r.return) n = l, r = i;
    else {
      for (var o = !1, u = l.child; u; ) {
        if (u === n) {
          o = !0, n = l, r = i;
          break;
        }
        if (u === r) {
          o = !0, r = l, n = i;
          break;
        }
        u = u.sibling;
      }
      if (!o) {
        for (u = i.child; u; ) {
          if (u === n) {
            o = !0, n = i, r = l;
            break;
          }
          if (u === r) {
            o = !0, r = i, n = l;
            break;
          }
          u = u.sibling;
        }
        if (!o) throw Error(x(189));
      }
    }
    if (n.alternate !== r) throw Error(x(190));
  }
  if (n.tag !== 3) throw Error(x(188));
  return n.stateNode.current === n ? e : t;
}
function Ls(e) {
  return e = bc(e), e !== null ? Ds(e) : null;
}
function Ds(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Ds(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Rs = ke.unstable_scheduleCallback, bo = ke.unstable_cancelCallback, ed = ke.unstable_shouldYield, td = ke.unstable_requestPaint, G = ke.unstable_now, nd = ke.unstable_getCurrentPriorityLevel, to = ke.unstable_ImmediatePriority, Ms = ke.unstable_UserBlockingPriority, Ur = ke.unstable_NormalPriority, rd = ke.unstable_LowPriority, Is = ke.unstable_IdlePriority, ol = null, Be = null;
function ld(e) {
  if (Be && typeof Be.onCommitFiberRoot == "function") try {
    Be.onCommitFiberRoot(ol, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Ie = Math.clz32 ? Math.clz32 : ud, id = Math.log, od = Math.LN2;
function ud(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (id(e) / od | 0) | 0;
}
var ar = 64, cr = 4194304;
function _n(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Ar(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var u = o & ~l;
    u !== 0 ? r = _n(u) : (i &= o, i !== 0 && (r = _n(i)));
  } else o = n & ~l, o !== 0 ? r = _n(o) : i !== 0 && (r = _n(i));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & l) && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Ie(t), l = 1 << n, r |= e[n], t &= ~l;
  return r;
}
function sd(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function ad(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
    var o = 31 - Ie(i), u = 1 << o, s = l[o];
    s === -1 ? (!(u & n) || u & r) && (l[o] = sd(u, t)) : s <= t && (e.expiredLanes |= u), i &= ~u;
  }
}
function pi(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Os() {
  var e = ar;
  return ar <<= 1, !(ar & 4194240) && (ar = 64), e;
}
function Pl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function bn(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Ie(t), e[t] = n;
}
function cd(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Ie(n), i = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
  }
}
function no(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Ie(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var O = 0;
function Fs(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var $s, ro, Us, As, Vs, mi = !1, dr = [], at = null, ct = null, dt = null, $n = /* @__PURE__ */ new Map(), Un = /* @__PURE__ */ new Map(), it = [], dd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function eu(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      at = null;
      break;
    case "dragenter":
    case "dragleave":
      ct = null;
      break;
    case "mouseover":
    case "mouseout":
      dt = null;
      break;
    case "pointerover":
    case "pointerout":
      $n.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Un.delete(t.pointerId);
  }
}
function vn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = tr(t), t !== null && ro(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function fd(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return at = vn(at, e, t, n, r, l), !0;
    case "dragenter":
      return ct = vn(ct, e, t, n, r, l), !0;
    case "mouseover":
      return dt = vn(dt, e, t, n, r, l), !0;
    case "pointerover":
      var i = l.pointerId;
      return $n.set(i, vn($n.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return i = l.pointerId, Un.set(i, vn(Un.get(i) || null, e, t, n, r, l)), !0;
  }
  return !1;
}
function Bs(e) {
  var t = Ct(e.target);
  if (t !== null) {
    var n = Ft(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Ts(n), t !== null) {
          e.blockedOn = t, Vs(e.priority, function() {
            Us(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Cr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = hi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ai = r, n.target.dispatchEvent(r), ai = null;
    } else return t = tr(n), t !== null && ro(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function tu(e, t, n) {
  Cr(e) && n.delete(t);
}
function pd() {
  mi = !1, at !== null && Cr(at) && (at = null), ct !== null && Cr(ct) && (ct = null), dt !== null && Cr(dt) && (dt = null), $n.forEach(tu), Un.forEach(tu);
}
function gn(e, t) {
  e.blockedOn === t && (e.blockedOn = null, mi || (mi = !0, ke.unstable_scheduleCallback(ke.unstable_NormalPriority, pd)));
}
function An(e) {
  function t(l) {
    return gn(l, e);
  }
  if (0 < dr.length) {
    gn(dr[0], e);
    for (var n = 1; n < dr.length; n++) {
      var r = dr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (at !== null && gn(at, e), ct !== null && gn(ct, e), dt !== null && gn(dt, e), $n.forEach(t), Un.forEach(t), n = 0; n < it.length; n++) r = it[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < it.length && (n = it[0], n.blockedOn === null); ) Bs(n), n.blockedOn === null && it.shift();
}
var en = tt.ReactCurrentBatchConfig, Vr = !0;
function md(e, t, n, r) {
  var l = O, i = en.transition;
  en.transition = null;
  try {
    O = 1, lo(e, t, n, r);
  } finally {
    O = l, en.transition = i;
  }
}
function hd(e, t, n, r) {
  var l = O, i = en.transition;
  en.transition = null;
  try {
    O = 4, lo(e, t, n, r);
  } finally {
    O = l, en.transition = i;
  }
}
function lo(e, t, n, r) {
  if (Vr) {
    var l = hi(e, t, n, r);
    if (l === null) Ul(e, t, r, Br, n), eu(e, r);
    else if (fd(l, e, t, n, r)) r.stopPropagation();
    else if (eu(e, r), t & 4 && -1 < dd.indexOf(e)) {
      for (; l !== null; ) {
        var i = tr(l);
        if (i !== null && $s(i), i = hi(e, t, n, r), i === null && Ul(e, t, r, Br, n), i === l) break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else Ul(e, t, r, null, n);
  }
}
var Br = null;
function hi(e, t, n, r) {
  if (Br = null, e = eo(r), e = Ct(e), e !== null) if (t = Ft(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Ts(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Br = e, null;
}
function Hs(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (nd()) {
        case to:
          return 1;
        case Ms:
          return 4;
        case Ur:
        case rd:
          return 16;
        case Is:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var ut = null, io = null, jr = null;
function Ws() {
  if (jr) return jr;
  var e, t = io, n = t.length, r, l = "value" in ut ? ut.value : ut.textContent, i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
  return jr = l.slice(e, 1 < r ? 1 - r : void 0);
}
function zr(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function fr() {
  return !0;
}
function nu() {
  return !1;
}
function Ee(e) {
  function t(n, r, l, i, o) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? fr : nu, this.isPropagationStopped = nu, this;
  }
  return K(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = fr);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = fr);
  }, persist: function() {
  }, isPersistent: fr }), t;
}
var fn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, oo = Ee(fn), er = K({}, fn, { view: 0, detail: 0 }), vd = Ee(er), Tl, Ll, yn, ul = K({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: uo, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== yn && (yn && e.type === "mousemove" ? (Tl = e.screenX - yn.screenX, Ll = e.screenY - yn.screenY) : Ll = Tl = 0, yn = e), Tl);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : Ll;
} }), ru = Ee(ul), gd = K({}, ul, { dataTransfer: 0 }), yd = Ee(gd), xd = K({}, er, { relatedTarget: 0 }), Dl = Ee(xd), wd = K({}, fn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), kd = Ee(wd), Sd = K({}, fn, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), Ed = Ee(Sd), _d = K({}, fn, { data: 0 }), lu = Ee(_d), Nd = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Cd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, jd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function zd(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = jd[e]) ? !!t[e] : !1;
}
function uo() {
  return zd;
}
var Pd = K({}, er, { key: function(e) {
  if (e.key) {
    var t = Nd[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = zr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Cd[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: uo, charCode: function(e) {
  return e.type === "keypress" ? zr(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? zr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), Td = Ee(Pd), Ld = K({}, ul, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), iu = Ee(Ld), Dd = K({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: uo }), Rd = Ee(Dd), Md = K({}, fn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Id = Ee(Md), Od = K({}, ul, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Fd = Ee(Od), $d = [9, 13, 27, 32], so = Je && "CompositionEvent" in window, zn = null;
Je && "documentMode" in document && (zn = document.documentMode);
var Ud = Je && "TextEvent" in window && !zn, Qs = Je && (!so || zn && 8 < zn && 11 >= zn), ou = " ", uu = !1;
function Ks(e, t) {
  switch (e) {
    case "keyup":
      return $d.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Ys(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Vt = !1;
function Ad(e, t) {
  switch (e) {
    case "compositionend":
      return Ys(t);
    case "keypress":
      return t.which !== 32 ? null : (uu = !0, ou);
    case "textInput":
      return e = t.data, e === ou && uu ? null : e;
    default:
      return null;
  }
}
function Vd(e, t) {
  if (Vt) return e === "compositionend" || !so && Ks(e, t) ? (e = Ws(), jr = io = ut = null, Vt = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Qs && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Bd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function su(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Bd[e.type] : t === "textarea";
}
function Xs(e, t, n, r) {
  Ns(r), t = Hr(t, "onChange"), 0 < t.length && (n = new oo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Pn = null, Vn = null;
function Hd(e) {
  ia(e, 0);
}
function sl(e) {
  var t = Wt(e);
  if (ys(t)) return e;
}
function Wd(e, t) {
  if (e === "change") return t;
}
var Gs = !1;
if (Je) {
  var Rl;
  if (Je) {
    var Ml = "oninput" in document;
    if (!Ml) {
      var au = document.createElement("div");
      au.setAttribute("oninput", "return;"), Ml = typeof au.oninput == "function";
    }
    Rl = Ml;
  } else Rl = !1;
  Gs = Rl && (!document.documentMode || 9 < document.documentMode);
}
function cu() {
  Pn && (Pn.detachEvent("onpropertychange", Zs), Vn = Pn = null);
}
function Zs(e) {
  if (e.propertyName === "value" && sl(Vn)) {
    var t = [];
    Xs(t, Vn, e, eo(e)), Ps(Hd, t);
  }
}
function Qd(e, t, n) {
  e === "focusin" ? (cu(), Pn = t, Vn = n, Pn.attachEvent("onpropertychange", Zs)) : e === "focusout" && cu();
}
function Kd(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return sl(Vn);
}
function Yd(e, t) {
  if (e === "click") return sl(t);
}
function Xd(e, t) {
  if (e === "input" || e === "change") return sl(t);
}
function Gd(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Fe = typeof Object.is == "function" ? Object.is : Gd;
function Bn(e, t) {
  if (Fe(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!Jl.call(t, l) || !Fe(e[l], t[l])) return !1;
  }
  return !0;
}
function du(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function fu(e, t) {
  var n = du(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = du(n);
  }
}
function Js(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Js(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function qs() {
  for (var e = window, t = Or(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Or(e.document);
  }
  return t;
}
function ao(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Zd(e) {
  var t = qs(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Js(n.ownerDocument.documentElement, n)) {
    if (r !== null && ao(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = n.textContent.length, i = Math.min(r.start, l);
        r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = fu(n, i);
        var o = fu(
          n,
          r
        );
        l && o && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Jd = Je && "documentMode" in document && 11 >= document.documentMode, Bt = null, vi = null, Tn = null, gi = !1;
function pu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  gi || Bt == null || Bt !== Or(r) || (r = Bt, "selectionStart" in r && ao(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Tn && Bn(Tn, r) || (Tn = r, r = Hr(vi, "onSelect"), 0 < r.length && (t = new oo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Bt)));
}
function pr(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Ht = { animationend: pr("Animation", "AnimationEnd"), animationiteration: pr("Animation", "AnimationIteration"), animationstart: pr("Animation", "AnimationStart"), transitionend: pr("Transition", "TransitionEnd") }, Il = {}, bs = {};
Je && (bs = document.createElement("div").style, "AnimationEvent" in window || (delete Ht.animationend.animation, delete Ht.animationiteration.animation, delete Ht.animationstart.animation), "TransitionEvent" in window || delete Ht.transitionend.transition);
function al(e) {
  if (Il[e]) return Il[e];
  if (!Ht[e]) return e;
  var t = Ht[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in bs) return Il[e] = t[n];
  return e;
}
var ea = al("animationend"), ta = al("animationiteration"), na = al("animationstart"), ra = al("transitionend"), la = /* @__PURE__ */ new Map(), mu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function xt(e, t) {
  la.set(e, t), Ot(t, [e]);
}
for (var Ol = 0; Ol < mu.length; Ol++) {
  var Fl = mu[Ol], qd = Fl.toLowerCase(), bd = Fl[0].toUpperCase() + Fl.slice(1);
  xt(qd, "on" + bd);
}
xt(ea, "onAnimationEnd");
xt(ta, "onAnimationIteration");
xt(na, "onAnimationStart");
xt("dblclick", "onDoubleClick");
xt("focusin", "onFocus");
xt("focusout", "onBlur");
xt(ra, "onTransitionEnd");
rn("onMouseEnter", ["mouseout", "mouseover"]);
rn("onMouseLeave", ["mouseout", "mouseover"]);
rn("onPointerEnter", ["pointerout", "pointerover"]);
rn("onPointerLeave", ["pointerout", "pointerover"]);
Ot("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
Ot("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
Ot("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Ot("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
Ot("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
Ot("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Nn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ef = new Set("cancel close invalid load scroll toggle".split(" ").concat(Nn));
function hu(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, qc(r, t, void 0, e), e.currentTarget = null;
}
function ia(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var u = r[o], s = u.instance, d = u.currentTarget;
        if (u = u.listener, s !== i && l.isPropagationStopped()) break e;
        hu(l, u, d), i = s;
      }
      else for (o = 0; o < r.length; o++) {
        if (u = r[o], s = u.instance, d = u.currentTarget, u = u.listener, s !== i && l.isPropagationStopped()) break e;
        hu(l, u, d), i = s;
      }
    }
  }
  if ($r) throw e = fi, $r = !1, fi = null, e;
}
function A(e, t) {
  var n = t[Si];
  n === void 0 && (n = t[Si] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (oa(t, e, 2, !1), n.add(r));
}
function $l(e, t, n) {
  var r = 0;
  t && (r |= 4), oa(n, e, r, t);
}
var mr = "_reactListening" + Math.random().toString(36).slice(2);
function Hn(e) {
  if (!e[mr]) {
    e[mr] = !0, ps.forEach(function(n) {
      n !== "selectionchange" && (ef.has(n) || $l(n, !1, e), $l(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[mr] || (t[mr] = !0, $l("selectionchange", !1, t));
  }
}
function oa(e, t, n, r) {
  switch (Hs(t)) {
    case 1:
      var l = md;
      break;
    case 4:
      l = hd;
      break;
    default:
      l = lo;
  }
  n = l.bind(null, t, n, e), l = void 0, !di || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
}
function Ul(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var u = r.stateNode.containerInfo;
      if (u === l || u.nodeType === 8 && u.parentNode === l) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var s = o.tag;
        if ((s === 3 || s === 4) && (s = o.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l)) return;
        o = o.return;
      }
      for (; u !== null; ) {
        if (o = Ct(u), o === null) return;
        if (s = o.tag, s === 5 || s === 6) {
          r = i = o;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  Ps(function() {
    var d = i, h = eo(n), v = [];
    e: {
      var m = la.get(e);
      if (m !== void 0) {
        var w = oo, S = e;
        switch (e) {
          case "keypress":
            if (zr(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = Td;
            break;
          case "focusin":
            S = "focus", w = Dl;
            break;
          case "focusout":
            S = "blur", w = Dl;
            break;
          case "beforeblur":
          case "afterblur":
            w = Dl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = ru;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = yd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = Rd;
            break;
          case ea:
          case ta:
          case na:
            w = kd;
            break;
          case ra:
            w = Id;
            break;
          case "scroll":
            w = vd;
            break;
          case "wheel":
            w = Fd;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = Ed;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = iu;
        }
        var _ = (t & 4) !== 0, E = !_ && e === "scroll", f = _ ? m !== null ? m + "Capture" : null : m;
        _ = [];
        for (var c = d, p; c !== null; ) {
          p = c;
          var g = p.stateNode;
          if (p.tag === 5 && g !== null && (p = g, f !== null && (g = Fn(c, f), g != null && _.push(Wn(c, g, p)))), E) break;
          c = c.return;
        }
        0 < _.length && (m = new w(m, S, null, n, h), v.push({ event: m, listeners: _ }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (m = e === "mouseover" || e === "pointerover", w = e === "mouseout" || e === "pointerout", m && n !== ai && (S = n.relatedTarget || n.fromElement) && (Ct(S) || S[qe])) break e;
        if ((w || m) && (m = h.window === h ? h : (m = h.ownerDocument) ? m.defaultView || m.parentWindow : window, w ? (S = n.relatedTarget || n.toElement, w = d, S = S ? Ct(S) : null, S !== null && (E = Ft(S), S !== E || S.tag !== 5 && S.tag !== 6) && (S = null)) : (w = null, S = d), w !== S)) {
          if (_ = ru, g = "onMouseLeave", f = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (_ = iu, g = "onPointerLeave", f = "onPointerEnter", c = "pointer"), E = w == null ? m : Wt(w), p = S == null ? m : Wt(S), m = new _(g, c + "leave", w, n, h), m.target = E, m.relatedTarget = p, g = null, Ct(h) === d && (_ = new _(f, c + "enter", S, n, h), _.target = p, _.relatedTarget = E, g = _), E = g, w && S) t: {
            for (_ = w, f = S, c = 0, p = _; p; p = $t(p)) c++;
            for (p = 0, g = f; g; g = $t(g)) p++;
            for (; 0 < c - p; ) _ = $t(_), c--;
            for (; 0 < p - c; ) f = $t(f), p--;
            for (; c--; ) {
              if (_ === f || f !== null && _ === f.alternate) break t;
              _ = $t(_), f = $t(f);
            }
            _ = null;
          }
          else _ = null;
          w !== null && vu(v, m, w, _, !1), S !== null && E !== null && vu(v, E, S, _, !0);
        }
      }
      e: {
        if (m = d ? Wt(d) : window, w = m.nodeName && m.nodeName.toLowerCase(), w === "select" || w === "input" && m.type === "file") var k = Wd;
        else if (su(m)) if (Gs) k = Xd;
        else {
          k = Kd;
          var j = Qd;
        }
        else (w = m.nodeName) && w.toLowerCase() === "input" && (m.type === "checkbox" || m.type === "radio") && (k = Yd);
        if (k && (k = k(e, d))) {
          Xs(v, k, n, h);
          break e;
        }
        j && j(e, m, d), e === "focusout" && (j = m._wrapperState) && j.controlled && m.type === "number" && li(m, "number", m.value);
      }
      switch (j = d ? Wt(d) : window, e) {
        case "focusin":
          (su(j) || j.contentEditable === "true") && (Bt = j, vi = d, Tn = null);
          break;
        case "focusout":
          Tn = vi = Bt = null;
          break;
        case "mousedown":
          gi = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          gi = !1, pu(v, n, h);
          break;
        case "selectionchange":
          if (Jd) break;
        case "keydown":
        case "keyup":
          pu(v, n, h);
      }
      var z;
      if (so) e: {
        switch (e) {
          case "compositionstart":
            var P = "onCompositionStart";
            break e;
          case "compositionend":
            P = "onCompositionEnd";
            break e;
          case "compositionupdate":
            P = "onCompositionUpdate";
            break e;
        }
        P = void 0;
      }
      else Vt ? Ks(e, n) && (P = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (P = "onCompositionStart");
      P && (Qs && n.locale !== "ko" && (Vt || P !== "onCompositionStart" ? P === "onCompositionEnd" && Vt && (z = Ws()) : (ut = h, io = "value" in ut ? ut.value : ut.textContent, Vt = !0)), j = Hr(d, P), 0 < j.length && (P = new lu(P, e, null, n, h), v.push({ event: P, listeners: j }), z ? P.data = z : (z = Ys(n), z !== null && (P.data = z)))), (z = Ud ? Ad(e, n) : Vd(e, n)) && (d = Hr(d, "onBeforeInput"), 0 < d.length && (h = new lu("onBeforeInput", "beforeinput", null, n, h), v.push({ event: h, listeners: d }), h.data = z));
    }
    ia(v, t);
  });
}
function Wn(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Hr(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e, i = l.stateNode;
    l.tag === 5 && i !== null && (l = i, i = Fn(e, n), i != null && r.unshift(Wn(e, i, l)), i = Fn(e, t), i != null && r.push(Wn(e, i, l))), e = e.return;
  }
  return r;
}
function $t(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function vu(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n, s = u.alternate, d = u.stateNode;
    if (s !== null && s === r) break;
    u.tag === 5 && d !== null && (u = d, l ? (s = Fn(n, i), s != null && o.unshift(Wn(n, s, u))) : l || (s = Fn(n, i), s != null && o.push(Wn(n, s, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var tf = /\r\n?/g, nf = /\u0000|\uFFFD/g;
function gu(e) {
  return (typeof e == "string" ? e : "" + e).replace(tf, `
`).replace(nf, "");
}
function hr(e, t, n) {
  if (t = gu(t), gu(e) !== t && n) throw Error(x(425));
}
function Wr() {
}
var yi = null, xi = null;
function wi(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var ki = typeof setTimeout == "function" ? setTimeout : void 0, rf = typeof clearTimeout == "function" ? clearTimeout : void 0, yu = typeof Promise == "function" ? Promise : void 0, lf = typeof queueMicrotask == "function" ? queueMicrotask : typeof yu < "u" ? function(e) {
  return yu.resolve(null).then(e).catch(of);
} : ki;
function of(e) {
  setTimeout(function() {
    throw e;
  });
}
function Al(e, t) {
  var n = t, r = 0;
  do {
    var l = n.nextSibling;
    if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
      if (r === 0) {
        e.removeChild(l), An(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = l;
  } while (n);
  An(t);
}
function ft(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function xu(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var pn = Math.random().toString(36).slice(2), Ve = "__reactFiber$" + pn, Qn = "__reactProps$" + pn, qe = "__reactContainer$" + pn, Si = "__reactEvents$" + pn, uf = "__reactListeners$" + pn, sf = "__reactHandles$" + pn;
function Ct(e) {
  var t = e[Ve];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[qe] || n[Ve]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = xu(e); e !== null; ) {
        if (n = e[Ve]) return n;
        e = xu(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function tr(e) {
  return e = e[Ve] || e[qe], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Wt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(x(33));
}
function cl(e) {
  return e[Qn] || null;
}
var Ei = [], Qt = -1;
function wt(e) {
  return { current: e };
}
function V(e) {
  0 > Qt || (e.current = Ei[Qt], Ei[Qt] = null, Qt--);
}
function $(e, t) {
  Qt++, Ei[Qt] = e.current, e.current = t;
}
var yt = {}, se = wt(yt), he = wt(!1), Lt = yt;
function ln(e, t) {
  var n = e.type.contextTypes;
  if (!n) return yt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, i;
  for (i in n) l[i] = t[i];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function ve(e) {
  return e = e.childContextTypes, e != null;
}
function Qr() {
  V(he), V(se);
}
function wu(e, t, n) {
  if (se.current !== yt) throw Error(x(168));
  $(se, t), $(he, n);
}
function ua(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(x(108, Qc(e) || "Unknown", l));
  return K({}, n, r);
}
function Kr(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || yt, Lt = se.current, $(se, e), $(he, he.current), !0;
}
function ku(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(x(169));
  n ? (e = ua(e, t, Lt), r.__reactInternalMemoizedMergedChildContext = e, V(he), V(se), $(se, e)) : V(he), $(he, n);
}
var Ye = null, dl = !1, Vl = !1;
function sa(e) {
  Ye === null ? Ye = [e] : Ye.push(e);
}
function af(e) {
  dl = !0, sa(e);
}
function kt() {
  if (!Vl && Ye !== null) {
    Vl = !0;
    var e = 0, t = O;
    try {
      var n = Ye;
      for (O = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Ye = null, dl = !1;
    } catch (l) {
      throw Ye !== null && (Ye = Ye.slice(e + 1)), Rs(to, kt), l;
    } finally {
      O = t, Vl = !1;
    }
  }
  return null;
}
var Kt = [], Yt = 0, Yr = null, Xr = 0, Ne = [], Ce = 0, Dt = null, Xe = 1, Ge = "";
function _t(e, t) {
  Kt[Yt++] = Xr, Kt[Yt++] = Yr, Yr = e, Xr = t;
}
function aa(e, t, n) {
  Ne[Ce++] = Xe, Ne[Ce++] = Ge, Ne[Ce++] = Dt, Dt = e;
  var r = Xe;
  e = Ge;
  var l = 32 - Ie(r) - 1;
  r &= ~(1 << l), n += 1;
  var i = 32 - Ie(t) + l;
  if (30 < i) {
    var o = l - l % 5;
    i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, Xe = 1 << 32 - Ie(t) + l | n << l | r, Ge = i + e;
  } else Xe = 1 << i | n << l | r, Ge = e;
}
function co(e) {
  e.return !== null && (_t(e, 1), aa(e, 1, 0));
}
function fo(e) {
  for (; e === Yr; ) Yr = Kt[--Yt], Kt[Yt] = null, Xr = Kt[--Yt], Kt[Yt] = null;
  for (; e === Dt; ) Dt = Ne[--Ce], Ne[Ce] = null, Ge = Ne[--Ce], Ne[Ce] = null, Xe = Ne[--Ce], Ne[Ce] = null;
}
var we = null, xe = null, H = !1, Me = null;
function ca(e, t) {
  var n = je(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function Su(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, we = e, xe = ft(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, we = e, xe = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Dt !== null ? { id: Xe, overflow: Ge } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = je(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, we = e, xe = null, !0) : !1;
    default:
      return !1;
  }
}
function _i(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ni(e) {
  if (H) {
    var t = xe;
    if (t) {
      var n = t;
      if (!Su(e, t)) {
        if (_i(e)) throw Error(x(418));
        t = ft(n.nextSibling);
        var r = we;
        t && Su(e, t) ? ca(r, n) : (e.flags = e.flags & -4097 | 2, H = !1, we = e);
      }
    } else {
      if (_i(e)) throw Error(x(418));
      e.flags = e.flags & -4097 | 2, H = !1, we = e;
    }
  }
}
function Eu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  we = e;
}
function vr(e) {
  if (e !== we) return !1;
  if (!H) return Eu(e), H = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !wi(e.type, e.memoizedProps)), t && (t = xe)) {
    if (_i(e)) throw da(), Error(x(418));
    for (; t; ) ca(e, t), t = ft(t.nextSibling);
  }
  if (Eu(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(x(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              xe = ft(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      xe = null;
    }
  } else xe = we ? ft(e.stateNode.nextSibling) : null;
  return !0;
}
function da() {
  for (var e = xe; e; ) e = ft(e.nextSibling);
}
function on() {
  xe = we = null, H = !1;
}
function po(e) {
  Me === null ? Me = [e] : Me.push(e);
}
var cf = tt.ReactCurrentBatchConfig;
function xn(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(x(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(x(147, e));
      var l = r, i = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
        var u = l.refs;
        o === null ? delete u[i] : u[i] = o;
      }, t._stringRef = i, t);
    }
    if (typeof e != "string") throw Error(x(284));
    if (!n._owner) throw Error(x(290, e));
  }
  return e;
}
function gr(e, t) {
  throw e = Object.prototype.toString.call(t), Error(x(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function _u(e) {
  var t = e._init;
  return t(e._payload);
}
function fa(e) {
  function t(f, c) {
    if (e) {
      var p = f.deletions;
      p === null ? (f.deletions = [c], f.flags |= 16) : p.push(c);
    }
  }
  function n(f, c) {
    if (!e) return null;
    for (; c !== null; ) t(f, c), c = c.sibling;
    return null;
  }
  function r(f, c) {
    for (f = /* @__PURE__ */ new Map(); c !== null; ) c.key !== null ? f.set(c.key, c) : f.set(c.index, c), c = c.sibling;
    return f;
  }
  function l(f, c) {
    return f = vt(f, c), f.index = 0, f.sibling = null, f;
  }
  function i(f, c, p) {
    return f.index = p, e ? (p = f.alternate, p !== null ? (p = p.index, p < c ? (f.flags |= 2, c) : p) : (f.flags |= 2, c)) : (f.flags |= 1048576, c);
  }
  function o(f) {
    return e && f.alternate === null && (f.flags |= 2), f;
  }
  function u(f, c, p, g) {
    return c === null || c.tag !== 6 ? (c = Xl(p, f.mode, g), c.return = f, c) : (c = l(c, p), c.return = f, c);
  }
  function s(f, c, p, g) {
    var k = p.type;
    return k === At ? h(f, c, p.props.children, g, p.key) : c !== null && (c.elementType === k || typeof k == "object" && k !== null && k.$$typeof === rt && _u(k) === c.type) ? (g = l(c, p.props), g.ref = xn(f, c, p), g.return = f, g) : (g = Ir(p.type, p.key, p.props, null, f.mode, g), g.ref = xn(f, c, p), g.return = f, g);
  }
  function d(f, c, p, g) {
    return c === null || c.tag !== 4 || c.stateNode.containerInfo !== p.containerInfo || c.stateNode.implementation !== p.implementation ? (c = Gl(p, f.mode, g), c.return = f, c) : (c = l(c, p.children || []), c.return = f, c);
  }
  function h(f, c, p, g, k) {
    return c === null || c.tag !== 7 ? (c = Tt(p, f.mode, g, k), c.return = f, c) : (c = l(c, p), c.return = f, c);
  }
  function v(f, c, p) {
    if (typeof c == "string" && c !== "" || typeof c == "number") return c = Xl("" + c, f.mode, p), c.return = f, c;
    if (typeof c == "object" && c !== null) {
      switch (c.$$typeof) {
        case or:
          return p = Ir(c.type, c.key, c.props, null, f.mode, p), p.ref = xn(f, null, c), p.return = f, p;
        case Ut:
          return c = Gl(c, f.mode, p), c.return = f, c;
        case rt:
          var g = c._init;
          return v(f, g(c._payload), p);
      }
      if (En(c) || mn(c)) return c = Tt(c, f.mode, p, null), c.return = f, c;
      gr(f, c);
    }
    return null;
  }
  function m(f, c, p, g) {
    var k = c !== null ? c.key : null;
    if (typeof p == "string" && p !== "" || typeof p == "number") return k !== null ? null : u(f, c, "" + p, g);
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case or:
          return p.key === k ? s(f, c, p, g) : null;
        case Ut:
          return p.key === k ? d(f, c, p, g) : null;
        case rt:
          return k = p._init, m(
            f,
            c,
            k(p._payload),
            g
          );
      }
      if (En(p) || mn(p)) return k !== null ? null : h(f, c, p, g, null);
      gr(f, p);
    }
    return null;
  }
  function w(f, c, p, g, k) {
    if (typeof g == "string" && g !== "" || typeof g == "number") return f = f.get(p) || null, u(c, f, "" + g, k);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case or:
          return f = f.get(g.key === null ? p : g.key) || null, s(c, f, g, k);
        case Ut:
          return f = f.get(g.key === null ? p : g.key) || null, d(c, f, g, k);
        case rt:
          var j = g._init;
          return w(f, c, p, j(g._payload), k);
      }
      if (En(g) || mn(g)) return f = f.get(p) || null, h(c, f, g, k, null);
      gr(c, g);
    }
    return null;
  }
  function S(f, c, p, g) {
    for (var k = null, j = null, z = c, P = c = 0, F = null; z !== null && P < p.length; P++) {
      z.index > P ? (F = z, z = null) : F = z.sibling;
      var y = m(f, z, p[P], g);
      if (y === null) {
        z === null && (z = F);
        break;
      }
      e && z && y.alternate === null && t(f, z), c = i(y, c, P), j === null ? k = y : j.sibling = y, j = y, z = F;
    }
    if (P === p.length) return n(f, z), H && _t(f, P), k;
    if (z === null) {
      for (; P < p.length; P++) z = v(f, p[P], g), z !== null && (c = i(z, c, P), j === null ? k = z : j.sibling = z, j = z);
      return H && _t(f, P), k;
    }
    for (z = r(f, z); P < p.length; P++) F = w(z, f, P, p[P], g), F !== null && (e && F.alternate !== null && z.delete(F.key === null ? P : F.key), c = i(F, c, P), j === null ? k = F : j.sibling = F, j = F);
    return e && z.forEach(function(B) {
      return t(f, B);
    }), H && _t(f, P), k;
  }
  function _(f, c, p, g) {
    var k = mn(p);
    if (typeof k != "function") throw Error(x(150));
    if (p = k.call(p), p == null) throw Error(x(151));
    for (var j = k = null, z = c, P = c = 0, F = null, y = p.next(); z !== null && !y.done; P++, y = p.next()) {
      z.index > P ? (F = z, z = null) : F = z.sibling;
      var B = m(f, z, y.value, g);
      if (B === null) {
        z === null && (z = F);
        break;
      }
      e && z && B.alternate === null && t(f, z), c = i(B, c, P), j === null ? k = B : j.sibling = B, j = B, z = F;
    }
    if (y.done) return n(
      f,
      z
    ), H && _t(f, P), k;
    if (z === null) {
      for (; !y.done; P++, y = p.next()) y = v(f, y.value, g), y !== null && (c = i(y, c, P), j === null ? k = y : j.sibling = y, j = y);
      return H && _t(f, P), k;
    }
    for (z = r(f, z); !y.done; P++, y = p.next()) y = w(z, f, P, y.value, g), y !== null && (e && y.alternate !== null && z.delete(y.key === null ? P : y.key), c = i(y, c, P), j === null ? k = y : j.sibling = y, j = y);
    return e && z.forEach(function(L) {
      return t(f, L);
    }), H && _t(f, P), k;
  }
  function E(f, c, p, g) {
    if (typeof p == "object" && p !== null && p.type === At && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case or:
          e: {
            for (var k = p.key, j = c; j !== null; ) {
              if (j.key === k) {
                if (k = p.type, k === At) {
                  if (j.tag === 7) {
                    n(f, j.sibling), c = l(j, p.props.children), c.return = f, f = c;
                    break e;
                  }
                } else if (j.elementType === k || typeof k == "object" && k !== null && k.$$typeof === rt && _u(k) === j.type) {
                  n(f, j.sibling), c = l(j, p.props), c.ref = xn(f, j, p), c.return = f, f = c;
                  break e;
                }
                n(f, j);
                break;
              } else t(f, j);
              j = j.sibling;
            }
            p.type === At ? (c = Tt(p.props.children, f.mode, g, p.key), c.return = f, f = c) : (g = Ir(p.type, p.key, p.props, null, f.mode, g), g.ref = xn(f, c, p), g.return = f, f = g);
          }
          return o(f);
        case Ut:
          e: {
            for (j = p.key; c !== null; ) {
              if (c.key === j) if (c.tag === 4 && c.stateNode.containerInfo === p.containerInfo && c.stateNode.implementation === p.implementation) {
                n(f, c.sibling), c = l(c, p.children || []), c.return = f, f = c;
                break e;
              } else {
                n(f, c);
                break;
              }
              else t(f, c);
              c = c.sibling;
            }
            c = Gl(p, f.mode, g), c.return = f, f = c;
          }
          return o(f);
        case rt:
          return j = p._init, E(f, c, j(p._payload), g);
      }
      if (En(p)) return S(f, c, p, g);
      if (mn(p)) return _(f, c, p, g);
      gr(f, p);
    }
    return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, c !== null && c.tag === 6 ? (n(f, c.sibling), c = l(c, p), c.return = f, f = c) : (n(f, c), c = Xl(p, f.mode, g), c.return = f, f = c), o(f)) : n(f, c);
  }
  return E;
}
var un = fa(!0), pa = fa(!1), Gr = wt(null), Zr = null, Xt = null, mo = null;
function ho() {
  mo = Xt = Zr = null;
}
function vo(e) {
  var t = Gr.current;
  V(Gr), e._currentValue = t;
}
function Ci(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function tn(e, t) {
  Zr = e, mo = Xt = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (me = !0), e.firstContext = null);
}
function Pe(e) {
  var t = e._currentValue;
  if (mo !== e) if (e = { context: e, memoizedValue: t, next: null }, Xt === null) {
    if (Zr === null) throw Error(x(308));
    Xt = e, Zr.dependencies = { lanes: 0, firstContext: e };
  } else Xt = Xt.next = e;
  return t;
}
var jt = null;
function go(e) {
  jt === null ? jt = [e] : jt.push(e);
}
function ma(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, go(t)) : (n.next = l.next, l.next = n), t.interleaved = n, be(e, r);
}
function be(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var lt = !1;
function yo(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function ha(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Ze(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function pt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, I & 2) {
    var l = r.pending;
    return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, be(e, n);
  }
  return l = r.interleaved, l === null ? (t.next = t, go(r)) : (t.next = l.next, l.next = t), r.interleaved = t, be(e, n);
}
function Pr(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, no(e, n);
  }
}
function Nu(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var l = null, i = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        i === null ? l = i = o : i = i.next = o, n = n.next;
      } while (n !== null);
      i === null ? l = i = t : i = i.next = t;
    } else l = i = t;
    n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function Jr(e, t, n, r) {
  var l = e.updateQueue;
  lt = !1;
  var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
  if (u !== null) {
    l.shared.pending = null;
    var s = u, d = s.next;
    s.next = null, o === null ? i = d : o.next = d, o = s;
    var h = e.alternate;
    h !== null && (h = h.updateQueue, u = h.lastBaseUpdate, u !== o && (u === null ? h.firstBaseUpdate = d : u.next = d, h.lastBaseUpdate = s));
  }
  if (i !== null) {
    var v = l.baseState;
    o = 0, h = d = s = null, u = i;
    do {
      var m = u.lane, w = u.eventTime;
      if ((r & m) === m) {
        h !== null && (h = h.next = {
          eventTime: w,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var S = e, _ = u;
          switch (m = t, w = n, _.tag) {
            case 1:
              if (S = _.payload, typeof S == "function") {
                v = S.call(w, v, m);
                break e;
              }
              v = S;
              break e;
            case 3:
              S.flags = S.flags & -65537 | 128;
            case 0:
              if (S = _.payload, m = typeof S == "function" ? S.call(w, v, m) : S, m == null) break e;
              v = K({}, v, m);
              break e;
            case 2:
              lt = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, m = l.effects, m === null ? l.effects = [u] : m.push(u));
      } else w = { eventTime: w, lane: m, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, h === null ? (d = h = w, s = v) : h = h.next = w, o |= m;
      if (u = u.next, u === null) {
        if (u = l.shared.pending, u === null) break;
        m = u, u = m.next, m.next = null, l.lastBaseUpdate = m, l.shared.pending = null;
      }
    } while (!0);
    if (h === null && (s = v), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = h, t = l.shared.interleaved, t !== null) {
      l = t;
      do
        o |= l.lane, l = l.next;
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    Mt |= o, e.lanes = o, e.memoizedState = v;
  }
}
function Cu(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = n, typeof l != "function") throw Error(x(191, l));
      l.call(r);
    }
  }
}
var nr = {}, He = wt(nr), Kn = wt(nr), Yn = wt(nr);
function zt(e) {
  if (e === nr) throw Error(x(174));
  return e;
}
function xo(e, t) {
  switch ($(Yn, t), $(Kn, e), $(He, nr), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : oi(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = oi(t, e);
  }
  V(He), $(He, t);
}
function sn() {
  V(He), V(Kn), V(Yn);
}
function va(e) {
  zt(Yn.current);
  var t = zt(He.current), n = oi(t, e.type);
  t !== n && ($(Kn, e), $(He, n));
}
function wo(e) {
  Kn.current === e && (V(He), V(Kn));
}
var W = wt(0);
function qr(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
var Bl = [];
function ko() {
  for (var e = 0; e < Bl.length; e++) Bl[e]._workInProgressVersionPrimary = null;
  Bl.length = 0;
}
var Tr = tt.ReactCurrentDispatcher, Hl = tt.ReactCurrentBatchConfig, Rt = 0, Q = null, J = null, ee = null, br = !1, Ln = !1, Xn = 0, df = 0;
function ie() {
  throw Error(x(321));
}
function So(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Fe(e[n], t[n])) return !1;
  return !0;
}
function Eo(e, t, n, r, l, i) {
  if (Rt = i, Q = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Tr.current = e === null || e.memoizedState === null ? hf : vf, e = n(r, l), Ln) {
    i = 0;
    do {
      if (Ln = !1, Xn = 0, 25 <= i) throw Error(x(301));
      i += 1, ee = J = null, t.updateQueue = null, Tr.current = gf, e = n(r, l);
    } while (Ln);
  }
  if (Tr.current = el, t = J !== null && J.next !== null, Rt = 0, ee = J = Q = null, br = !1, t) throw Error(x(300));
  return e;
}
function _o() {
  var e = Xn !== 0;
  return Xn = 0, e;
}
function Ae() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return ee === null ? Q.memoizedState = ee = e : ee = ee.next = e, ee;
}
function Te() {
  if (J === null) {
    var e = Q.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = J.next;
  var t = ee === null ? Q.memoizedState : ee.next;
  if (t !== null) ee = t, J = e;
  else {
    if (e === null) throw Error(x(310));
    J = e, e = { memoizedState: J.memoizedState, baseState: J.baseState, baseQueue: J.baseQueue, queue: J.queue, next: null }, ee === null ? Q.memoizedState = ee = e : ee = ee.next = e;
  }
  return ee;
}
function Gn(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Wl(e) {
  var t = Te(), n = t.queue;
  if (n === null) throw Error(x(311));
  n.lastRenderedReducer = e;
  var r = J, l = r.baseQueue, i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var o = l.next;
      l.next = i.next, i.next = o;
    }
    r.baseQueue = l = i, n.pending = null;
  }
  if (l !== null) {
    i = l.next, r = r.baseState;
    var u = o = null, s = null, d = i;
    do {
      var h = d.lane;
      if ((Rt & h) === h) s !== null && (s = s.next = { lane: 0, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }), r = d.hasEagerState ? d.eagerState : e(r, d.action);
      else {
        var v = {
          lane: h,
          action: d.action,
          hasEagerState: d.hasEagerState,
          eagerState: d.eagerState,
          next: null
        };
        s === null ? (u = s = v, o = r) : s = s.next = v, Q.lanes |= h, Mt |= h;
      }
      d = d.next;
    } while (d !== null && d !== i);
    s === null ? o = r : s.next = u, Fe(r, t.memoizedState) || (me = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = s, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      i = l.lane, Q.lanes |= i, Mt |= i, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Ql(e) {
  var t = Te(), n = t.queue;
  if (n === null) throw Error(x(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, l = n.pending, i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = l = l.next;
    do
      i = e(i, o.action), o = o.next;
    while (o !== l);
    Fe(i, t.memoizedState) || (me = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function ga() {
}
function ya(e, t) {
  var n = Q, r = Te(), l = t(), i = !Fe(r.memoizedState, l);
  if (i && (r.memoizedState = l, me = !0), r = r.queue, No(ka.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || ee !== null && ee.memoizedState.tag & 1) {
    if (n.flags |= 2048, Zn(9, wa.bind(null, n, r, l, t), void 0, null), te === null) throw Error(x(349));
    Rt & 30 || xa(n, t, l);
  }
  return l;
}
function xa(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Q.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Q.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function wa(e, t, n, r) {
  t.value = n, t.getSnapshot = r, Sa(t) && Ea(e);
}
function ka(e, t, n) {
  return n(function() {
    Sa(t) && Ea(e);
  });
}
function Sa(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Fe(e, n);
  } catch {
    return !0;
  }
}
function Ea(e) {
  var t = be(e, 1);
  t !== null && Oe(t, e, 1, -1);
}
function ju(e) {
  var t = Ae();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Gn, lastRenderedState: e }, t.queue = e, e = e.dispatch = mf.bind(null, Q, e), [t.memoizedState, e];
}
function Zn(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Q.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Q.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function _a() {
  return Te().memoizedState;
}
function Lr(e, t, n, r) {
  var l = Ae();
  Q.flags |= e, l.memoizedState = Zn(1 | t, n, void 0, r === void 0 ? null : r);
}
function fl(e, t, n, r) {
  var l = Te();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (J !== null) {
    var o = J.memoizedState;
    if (i = o.destroy, r !== null && So(r, o.deps)) {
      l.memoizedState = Zn(t, n, i, r);
      return;
    }
  }
  Q.flags |= e, l.memoizedState = Zn(1 | t, n, i, r);
}
function zu(e, t) {
  return Lr(8390656, 8, e, t);
}
function No(e, t) {
  return fl(2048, 8, e, t);
}
function Na(e, t) {
  return fl(4, 2, e, t);
}
function Ca(e, t) {
  return fl(4, 4, e, t);
}
function ja(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function za(e, t, n) {
  return n = n != null ? n.concat([e]) : null, fl(4, 4, ja.bind(null, t, e), n);
}
function Co() {
}
function Pa(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && So(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Ta(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && So(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function La(e, t, n) {
  return Rt & 21 ? (Fe(n, t) || (n = Os(), Q.lanes |= n, Mt |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, me = !0), e.memoizedState = n);
}
function ff(e, t) {
  var n = O;
  O = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = Hl.transition;
  Hl.transition = {};
  try {
    e(!1), t();
  } finally {
    O = n, Hl.transition = r;
  }
}
function Da() {
  return Te().memoizedState;
}
function pf(e, t, n) {
  var r = ht(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ra(e)) Ma(t, n);
  else if (n = ma(e, t, n, r), n !== null) {
    var l = ce();
    Oe(n, e, r, l), Ia(n, t, r);
  }
}
function mf(e, t, n) {
  var r = ht(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Ra(e)) Ma(t, l);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var o = t.lastRenderedState, u = i(o, n);
      if (l.hasEagerState = !0, l.eagerState = u, Fe(u, o)) {
        var s = t.interleaved;
        s === null ? (l.next = l, go(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = ma(e, t, l, r), n !== null && (l = ce(), Oe(n, e, r, l), Ia(n, t, r));
  }
}
function Ra(e) {
  var t = e.alternate;
  return e === Q || t !== null && t === Q;
}
function Ma(e, t) {
  Ln = br = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function Ia(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, no(e, n);
  }
}
var el = { readContext: Pe, useCallback: ie, useContext: ie, useEffect: ie, useImperativeHandle: ie, useInsertionEffect: ie, useLayoutEffect: ie, useMemo: ie, useReducer: ie, useRef: ie, useState: ie, useDebugValue: ie, useDeferredValue: ie, useTransition: ie, useMutableSource: ie, useSyncExternalStore: ie, useId: ie, unstable_isNewReconciler: !1 }, hf = { readContext: Pe, useCallback: function(e, t) {
  return Ae().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: Pe, useEffect: zu, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Lr(
    4194308,
    4,
    ja.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return Lr(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return Lr(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = Ae();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = Ae();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = pf.bind(null, Q, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Ae();
  return e = { current: e }, t.memoizedState = e;
}, useState: ju, useDebugValue: Co, useDeferredValue: function(e) {
  return Ae().memoizedState = e;
}, useTransition: function() {
  var e = ju(!1), t = e[0];
  return e = ff.bind(null, e[1]), Ae().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = Q, l = Ae();
  if (H) {
    if (n === void 0) throw Error(x(407));
    n = n();
  } else {
    if (n = t(), te === null) throw Error(x(349));
    Rt & 30 || xa(r, t, n);
  }
  l.memoizedState = n;
  var i = { value: n, getSnapshot: t };
  return l.queue = i, zu(ka.bind(
    null,
    r,
    i,
    e
  ), [e]), r.flags |= 2048, Zn(9, wa.bind(null, r, i, n, t), void 0, null), n;
}, useId: function() {
  var e = Ae(), t = te.identifierPrefix;
  if (H) {
    var n = Ge, r = Xe;
    n = (r & ~(1 << 32 - Ie(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Xn++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = df++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, vf = {
  readContext: Pe,
  useCallback: Pa,
  useContext: Pe,
  useEffect: No,
  useImperativeHandle: za,
  useInsertionEffect: Na,
  useLayoutEffect: Ca,
  useMemo: Ta,
  useReducer: Wl,
  useRef: _a,
  useState: function() {
    return Wl(Gn);
  },
  useDebugValue: Co,
  useDeferredValue: function(e) {
    var t = Te();
    return La(t, J.memoizedState, e);
  },
  useTransition: function() {
    var e = Wl(Gn)[0], t = Te().memoizedState;
    return [e, t];
  },
  useMutableSource: ga,
  useSyncExternalStore: ya,
  useId: Da,
  unstable_isNewReconciler: !1
}, gf = { readContext: Pe, useCallback: Pa, useContext: Pe, useEffect: No, useImperativeHandle: za, useInsertionEffect: Na, useLayoutEffect: Ca, useMemo: Ta, useReducer: Ql, useRef: _a, useState: function() {
  return Ql(Gn);
}, useDebugValue: Co, useDeferredValue: function(e) {
  var t = Te();
  return J === null ? t.memoizedState = e : La(t, J.memoizedState, e);
}, useTransition: function() {
  var e = Ql(Gn)[0], t = Te().memoizedState;
  return [e, t];
}, useMutableSource: ga, useSyncExternalStore: ya, useId: Da, unstable_isNewReconciler: !1 };
function De(e, t) {
  if (e && e.defaultProps) {
    t = K({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function ji(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : K({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var pl = { isMounted: function(e) {
  return (e = e._reactInternals) ? Ft(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = ce(), l = ht(e), i = Ze(r, l);
  i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Oe(t, e, l, r), Pr(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = ce(), l = ht(e), i = Ze(r, l);
  i.tag = 1, i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Oe(t, e, l, r), Pr(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = ce(), r = ht(e), l = Ze(n, r);
  l.tag = 2, t != null && (l.callback = t), t = pt(e, l, r), t !== null && (Oe(t, e, r, n), Pr(t, e, r));
} };
function Pu(e, t, n, r, l, i, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Bn(n, r) || !Bn(l, i) : !0;
}
function Oa(e, t, n) {
  var r = !1, l = yt, i = t.contextType;
  return typeof i == "object" && i !== null ? i = Pe(i) : (l = ve(t) ? Lt : se.current, r = t.contextTypes, i = (r = r != null) ? ln(e, l) : yt), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = pl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function Tu(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && pl.enqueueReplaceState(t, t.state, null);
}
function zi(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, yo(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? l.context = Pe(i) : (i = ve(t) ? Lt : se.current, l.context = ln(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (ji(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && pl.enqueueReplaceState(l, l.state, null), Jr(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function an(e, t) {
  try {
    var n = "", r = t;
    do
      n += Wc(r), r = r.return;
    while (r);
    var l = n;
  } catch (i) {
    l = `
Error generating stack: ` + i.message + `
` + i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function Kl(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Pi(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var yf = typeof WeakMap == "function" ? WeakMap : Map;
function Fa(e, t, n) {
  n = Ze(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    nl || (nl = !0, Ui = r), Pi(e, t);
  }, n;
}
function $a(e, t, n) {
  n = Ze(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    n.payload = function() {
      return r(l);
    }, n.callback = function() {
      Pi(e, t);
    };
  }
  var i = e.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    Pi(e, t), typeof r != "function" && (mt === null ? mt = /* @__PURE__ */ new Set([this]) : mt.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function Lu(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new yf();
    var l = /* @__PURE__ */ new Set();
    r.set(t, l);
  } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
  l.has(n) || (l.add(n), e = Df.bind(null, e, t, n), t.then(e, e));
}
function Du(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Ru(e, t, n, r, l) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Ze(-1, 1), t.tag = 2, pt(n, t, 1))), n.lanes |= 1), e);
}
var xf = tt.ReactCurrentOwner, me = !1;
function ae(e, t, n, r) {
  t.child = e === null ? pa(t, null, n, r) : un(t, e.child, n, r);
}
function Mu(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return tn(t, l), r = Eo(e, t, n, r, i, l), n = _o(), e !== null && !me ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (H && n && co(t), t.flags |= 1, ae(e, t, r, l), t.child);
}
function Iu(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" && !Mo(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Ua(e, t, i, r, l)) : (e = Ir(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (i = e.child, !(e.lanes & l)) {
    var o = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Bn, n(o, r) && e.ref === t.ref) return et(e, t, l);
  }
  return t.flags |= 1, e = vt(i, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Ua(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (Bn(i, r) && e.ref === t.ref) if (me = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) e.flags & 131072 && (me = !0);
    else return t.lanes = e.lanes, et(e, t, l);
  }
  return Ti(e, t, n, r, l);
}
function Aa(e, t, n) {
  var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, $(Zt, ye), ye |= n;
  else {
    if (!(n & 1073741824)) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, $(Zt, ye), ye |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, $(Zt, ye), ye |= r;
  }
  else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, $(Zt, ye), ye |= r;
  return ae(e, t, l, n), t.child;
}
function Va(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Ti(e, t, n, r, l) {
  var i = ve(n) ? Lt : se.current;
  return i = ln(t, i), tn(t, l), n = Eo(e, t, n, r, i, l), r = _o(), e !== null && !me ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (H && r && co(t), t.flags |= 1, ae(e, t, n, l), t.child);
}
function Ou(e, t, n, r, l) {
  if (ve(n)) {
    var i = !0;
    Kr(t);
  } else i = !1;
  if (tn(t, l), t.stateNode === null) Dr(e, t), Oa(t, n, r), zi(t, n, r, l), r = !0;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var s = o.context, d = n.contextType;
    typeof d == "object" && d !== null ? d = Pe(d) : (d = ve(n) ? Lt : se.current, d = ln(t, d));
    var h = n.getDerivedStateFromProps, v = typeof h == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    v || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || s !== d) && Tu(t, o, r, d), lt = !1;
    var m = t.memoizedState;
    o.state = m, Jr(t, r, o, l), s = t.memoizedState, u !== r || m !== s || he.current || lt ? (typeof h == "function" && (ji(t, n, h, r), s = t.memoizedState), (u = lt || Pu(t, n, u, r, m, s, d)) ? (v || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), o.props = r, o.state = s, o.context = d, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, ha(e, t), u = t.memoizedProps, d = t.type === t.elementType ? u : De(t.type, u), o.props = d, v = t.pendingProps, m = o.context, s = n.contextType, typeof s == "object" && s !== null ? s = Pe(s) : (s = ve(n) ? Lt : se.current, s = ln(t, s));
    var w = n.getDerivedStateFromProps;
    (h = typeof w == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== v || m !== s) && Tu(t, o, r, s), lt = !1, m = t.memoizedState, o.state = m, Jr(t, r, o, l);
    var S = t.memoizedState;
    u !== v || m !== S || he.current || lt ? (typeof w == "function" && (ji(t, n, w, r), S = t.memoizedState), (d = lt || Pu(t, n, d, r, m, S, s) || !1) ? (h || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, S, s), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, S, s)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = S), o.props = r, o.state = S, o.context = s, r = d) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Li(e, t, n, r, i, l);
}
function Li(e, t, n, r, l, i) {
  Va(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && ku(t, n, !1), et(e, t, i);
  r = t.stateNode, xf.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = un(t, e.child, null, i), t.child = un(t, null, u, i)) : ae(e, t, u, i), t.memoizedState = r.state, l && ku(t, n, !0), t.child;
}
function Ba(e) {
  var t = e.stateNode;
  t.pendingContext ? wu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && wu(e, t.context, !1), xo(e, t.containerInfo);
}
function Fu(e, t, n, r, l) {
  return on(), po(l), t.flags |= 256, ae(e, t, n, r), t.child;
}
var Di = { dehydrated: null, treeContext: null, retryLane: 0 };
function Ri(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Ha(e, t, n) {
  var r = t.pendingProps, l = W.current, i = !1, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), $(W, l & 1), e === null)
    return Ni(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = vl(o, r, 0, null), e = Tt(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Ri(n), t.memoizedState = Di, e) : jo(t, o));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return wf(e, t, o, r, u, l, n);
  if (i) {
    i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
    var s = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = vt(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = vt(u, i) : (i = Tt(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? Ri(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = Di, r;
  }
  return i = e.child, e = i.sibling, r = vt(i, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function jo(e, t) {
  return t = vl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function yr(e, t, n, r) {
  return r !== null && po(r), un(t, e.child, null, n), e = jo(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function wf(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = Kl(Error(x(422))), yr(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = vl({ mode: "visible", children: r.children }, l, 0, null), i = Tt(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, t.mode & 1 && un(t, e.child, null, o), t.child.memoizedState = Ri(o), t.memoizedState = Di, i);
  if (!(t.mode & 1)) return yr(e, t, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, i = Error(x(419)), r = Kl(i, r, void 0), yr(e, t, o, r);
  }
  if (u = (o & e.childLanes) !== 0, me || u) {
    if (r = te, r !== null) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      l = l & (r.suspendedLanes | o) ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, be(e, l), Oe(r, e, l, -1));
    }
    return Ro(), r = Kl(Error(x(421))), yr(e, t, o, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Rf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, xe = ft(l.nextSibling), we = t, H = !0, Me = null, e !== null && (Ne[Ce++] = Xe, Ne[Ce++] = Ge, Ne[Ce++] = Dt, Xe = e.id, Ge = e.overflow, Dt = t), t = jo(t, r.children), t.flags |= 4096, t);
}
function $u(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Ci(e.return, t, n);
}
function Yl(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
}
function Wa(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, i = r.tail;
  if (ae(e, t, r.children, n), r = W.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && $u(e, n, t);
      else if (e.tag === 19) $u(e, n, t);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if ($(W, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && qr(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Yl(t, !1, l, n, i);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && qr(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Yl(t, !0, n, null, i);
      break;
    case "together":
      Yl(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function Dr(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function et(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), Mt |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(x(153));
  if (t.child !== null) {
    for (e = t.child, n = vt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = vt(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function kf(e, t, n) {
  switch (t.tag) {
    case 3:
      Ba(t), on();
      break;
    case 5:
      va(t);
      break;
    case 1:
      ve(t.type) && Kr(t);
      break;
    case 4:
      xo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      $(Gr, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? ($(W, W.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Ha(e, t, n) : ($(W, W.current & 1), e = et(e, t, n), e !== null ? e.sibling : null);
      $(W, W.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Wa(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), $(W, W.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Aa(e, t, n);
  }
  return et(e, t, n);
}
var Qa, Mi, Ka, Ya;
Qa = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
Mi = function() {
};
Ka = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, zt(He.current);
    var i = null;
    switch (n) {
      case "input":
        l = ni(e, l), r = ni(e, r), i = [];
        break;
      case "select":
        l = K({}, l, { value: void 0 }), r = K({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        l = ii(e, l), r = ii(e, r), i = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Wr);
    }
    ui(n, r);
    var o;
    n = null;
    for (d in l) if (!r.hasOwnProperty(d) && l.hasOwnProperty(d) && l[d] != null) if (d === "style") {
      var u = l[d];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else d !== "dangerouslySetInnerHTML" && d !== "children" && d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (In.hasOwnProperty(d) ? i || (i = []) : (i = i || []).push(d, null));
    for (d in r) {
      var s = r[d];
      if (u = l?.[d], r.hasOwnProperty(d) && s !== u && (s != null || u != null)) if (d === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in s) s.hasOwnProperty(o) && u[o] !== s[o] && (n || (n = {}), n[o] = s[o]);
      } else n || (i || (i = []), i.push(
        d,
        n
      )), n = s;
      else d === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (i = i || []).push(d, s)) : d === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(d, "" + s) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && (In.hasOwnProperty(d) ? (s != null && d === "onScroll" && A("scroll", e), i || u === s || (i = [])) : (i = i || []).push(d, s));
    }
    n && (i = i || []).push("style", n);
    var d = i;
    (t.updateQueue = d) && (t.flags |= 4);
  }
};
Ya = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function wn(e, t) {
  if (!H) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function oe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
  else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function Sf(e, t, n) {
  var r = t.pendingProps;
  switch (fo(t), t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return oe(t), null;
    case 1:
      return ve(t.type) && Qr(), oe(t), null;
    case 3:
      return r = t.stateNode, sn(), V(he), V(se), ko(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (vr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Me !== null && (Bi(Me), Me = null))), Mi(e, t), oe(t), null;
    case 5:
      wo(t);
      var l = zt(Yn.current);
      if (n = t.type, e !== null && t.stateNode != null) Ka(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(x(166));
          return oe(t), null;
        }
        if (e = zt(He.current), vr(t)) {
          r = t.stateNode, n = t.type;
          var i = t.memoizedProps;
          switch (r[Ve] = t, r[Qn] = i, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              A("cancel", r), A("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              A("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Nn.length; l++) A(Nn[l], r);
              break;
            case "source":
              A("error", r);
              break;
            case "img":
            case "image":
            case "link":
              A(
                "error",
                r
              ), A("load", r);
              break;
            case "details":
              A("toggle", r);
              break;
            case "input":
              Yo(r, i), A("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, A("invalid", r);
              break;
            case "textarea":
              Go(r, i), A("invalid", r);
          }
          ui(n, i), l = null;
          for (var o in i) if (i.hasOwnProperty(o)) {
            var u = i[o];
            o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && hr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && hr(
              r.textContent,
              u,
              e
            ), l = ["children", "" + u]) : In.hasOwnProperty(o) && u != null && o === "onScroll" && A("scroll", r);
          }
          switch (n) {
            case "input":
              ur(r), Xo(r, i, !0);
              break;
            case "textarea":
              ur(r), Zo(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Wr);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ks(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Ve] = t, e[Qn] = r, Qa(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = si(n, r), n) {
              case "dialog":
                A("cancel", e), A("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                A("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < Nn.length; l++) A(Nn[l], e);
                l = r;
                break;
              case "source":
                A("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                A(
                  "error",
                  e
                ), A("load", e), l = r;
                break;
              case "details":
                A("toggle", e), l = r;
                break;
              case "input":
                Yo(e, r), l = ni(e, r), A("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = K({}, r, { value: void 0 }), A("invalid", e);
                break;
              case "textarea":
                Go(e, r), l = ii(e, r), A("invalid", e);
                break;
              default:
                l = r;
            }
            ui(n, l), u = l;
            for (i in u) if (u.hasOwnProperty(i)) {
              var s = u[i];
              i === "style" ? _s(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Ss(e, s)) : i === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && On(e, s) : typeof s == "number" && On(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (In.hasOwnProperty(i) ? s != null && i === "onScroll" && A("scroll", e) : s != null && Zi(e, i, s, o));
            }
            switch (n) {
              case "input":
                ur(e), Xo(e, r, !1);
                break;
              case "textarea":
                ur(e), Zo(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + gt(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, i = r.value, i != null ? Jt(e, !!r.multiple, i, !1) : r.defaultValue != null && Jt(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = Wr);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return oe(t), null;
    case 6:
      if (e && t.stateNode != null) Ya(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(x(166));
        if (n = zt(Yn.current), zt(He.current), vr(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Ve] = t, (i = r.nodeValue !== n) && (e = we, e !== null)) switch (e.tag) {
            case 3:
              hr(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && hr(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          i && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Ve] = t, t.stateNode = r;
      }
      return oe(t), null;
    case 13:
      if (V(W), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (H && xe !== null && t.mode & 1 && !(t.flags & 128)) da(), on(), t.flags |= 98560, i = !1;
        else if (i = vr(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!i) throw Error(x(318));
            if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(x(317));
            i[Ve] = t;
          } else on(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          oe(t), i = !1;
        } else Me !== null && (Bi(Me), Me = null), i = !0;
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || W.current & 1 ? q === 0 && (q = 3) : Ro())), t.updateQueue !== null && (t.flags |= 4), oe(t), null);
    case 4:
      return sn(), Mi(e, t), e === null && Hn(t.stateNode.containerInfo), oe(t), null;
    case 10:
      return vo(t.type._context), oe(t), null;
    case 17:
      return ve(t.type) && Qr(), oe(t), null;
    case 19:
      if (V(W), i = t.memoizedState, i === null) return oe(t), null;
      if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wn(i, !1);
      else {
        if (q !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = qr(e), o !== null) {
            for (t.flags |= 128, wn(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return $(W, W.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        i.tail !== null && G() > cn && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = qr(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wn(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !H) return oe(t), null;
        } else 2 * G() - i.renderingStartTime > cn && n !== 1073741824 && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
        i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
      }
      return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = G(), t.sibling = null, n = W.current, $(W, r ? n & 1 | 2 : n & 1), t) : (oe(t), null);
    case 22:
    case 23:
      return Do(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? ye & 1073741824 && (oe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : oe(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(x(156, t.tag));
}
function Ef(e, t) {
  switch (fo(t), t.tag) {
    case 1:
      return ve(t.type) && Qr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return sn(), V(he), V(se), ko(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return wo(t), null;
    case 13:
      if (V(W), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(x(340));
        on();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return V(W), null;
    case 4:
      return sn(), null;
    case 10:
      return vo(t.type._context), null;
    case 22:
    case 23:
      return Do(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var xr = !1, ue = !1, _f = typeof WeakSet == "function" ? WeakSet : Set, N = null;
function Gt(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    Y(e, t, r);
  }
  else n.current = null;
}
function Ii(e, t, n) {
  try {
    n();
  } catch (r) {
    Y(e, t, r);
  }
}
var Uu = !1;
function Nf(e, t) {
  if (yi = Vr, e = qs(), ao(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var l = r.anchorOffset, i = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, i.nodeType;
        } catch {
          n = null;
          break e;
        }
        var o = 0, u = -1, s = -1, d = 0, h = 0, v = e, m = null;
        t: for (; ; ) {
          for (var w; v !== n || l !== 0 && v.nodeType !== 3 || (u = o + l), v !== i || r !== 0 && v.nodeType !== 3 || (s = o + r), v.nodeType === 3 && (o += v.nodeValue.length), (w = v.firstChild) !== null; )
            m = v, v = w;
          for (; ; ) {
            if (v === e) break t;
            if (m === n && ++d === l && (u = o), m === i && ++h === r && (s = o), (w = v.nextSibling) !== null) break;
            v = m, m = v.parentNode;
          }
          v = w;
        }
        n = u === -1 || s === -1 ? null : { start: u, end: s };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (xi = { focusedElem: e, selectionRange: n }, Vr = !1, N = t; N !== null; ) if (t = N, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, N = e;
  else for (; N !== null; ) {
    t = N;
    try {
      var S = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (S !== null) {
            var _ = S.memoizedProps, E = S.memoizedState, f = t.stateNode, c = f.getSnapshotBeforeUpdate(t.elementType === t.type ? _ : De(t.type, _), E);
            f.__reactInternalSnapshotBeforeUpdate = c;
          }
          break;
        case 3:
          var p = t.stateNode.containerInfo;
          p.nodeType === 1 ? p.textContent = "" : p.nodeType === 9 && p.documentElement && p.removeChild(p.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(x(163));
      }
    } catch (g) {
      Y(t, t.return, g);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, N = e;
      break;
    }
    N = t.return;
  }
  return S = Uu, Uu = !1, S;
}
function Dn(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        l.destroy = void 0, i !== void 0 && Ii(t, n, i);
      }
      l = l.next;
    } while (l !== r);
  }
}
function ml(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Oi(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function Xa(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Xa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ve], delete t[Qn], delete t[Si], delete t[uf], delete t[sf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Ga(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Au(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Ga(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Fi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Wr));
  else if (r !== 4 && (e = e.child, e !== null)) for (Fi(e, t, n), e = e.sibling; e !== null; ) Fi(e, t, n), e = e.sibling;
}
function $i(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for ($i(e, t, n), e = e.sibling; e !== null; ) $i(e, t, n), e = e.sibling;
}
var ne = null, Re = !1;
function nt(e, t, n) {
  for (n = n.child; n !== null; ) Za(e, t, n), n = n.sibling;
}
function Za(e, t, n) {
  if (Be && typeof Be.onCommitFiberUnmount == "function") try {
    Be.onCommitFiberUnmount(ol, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      ue || Gt(n, t);
    case 6:
      var r = ne, l = Re;
      ne = null, nt(e, t, n), ne = r, Re = l, ne !== null && (Re ? (e = ne, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ne.removeChild(n.stateNode));
      break;
    case 18:
      ne !== null && (Re ? (e = ne, n = n.stateNode, e.nodeType === 8 ? Al(e.parentNode, n) : e.nodeType === 1 && Al(e, n), An(e)) : Al(ne, n.stateNode));
      break;
    case 4:
      r = ne, l = Re, ne = n.stateNode.containerInfo, Re = !0, nt(e, t, n), ne = r, Re = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ue && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var i = l, o = i.destroy;
          i = i.tag, o !== void 0 && (i & 2 || i & 4) && Ii(n, t, o), l = l.next;
        } while (l !== r);
      }
      nt(e, t, n);
      break;
    case 1:
      if (!ue && (Gt(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        Y(n, t, u);
      }
      nt(e, t, n);
      break;
    case 21:
      nt(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (ue = (r = ue) || n.memoizedState !== null, nt(e, t, n), ue = r) : nt(e, t, n);
      break;
    default:
      nt(e, t, n);
  }
}
function Vu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new _f()), t.forEach(function(r) {
      var l = Mf.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(l, l));
    });
  }
}
function Le(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var l = n[r];
    try {
      var i = e, o = t, u = o;
      e: for (; u !== null; ) {
        switch (u.tag) {
          case 5:
            ne = u.stateNode, Re = !1;
            break e;
          case 3:
            ne = u.stateNode.containerInfo, Re = !0;
            break e;
          case 4:
            ne = u.stateNode.containerInfo, Re = !0;
            break e;
        }
        u = u.return;
      }
      if (ne === null) throw Error(x(160));
      Za(i, o, l), ne = null, Re = !1;
      var s = l.alternate;
      s !== null && (s.return = null), l.return = null;
    } catch (d) {
      Y(l, t, d);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ja(t, e), t = t.sibling;
}
function Ja(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Le(t, e), Ue(e), r & 4) {
        try {
          Dn(3, e, e.return), ml(3, e);
        } catch (_) {
          Y(e, e.return, _);
        }
        try {
          Dn(5, e, e.return);
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 1:
      Le(t, e), Ue(e), r & 512 && n !== null && Gt(n, n.return);
      break;
    case 5:
      if (Le(t, e), Ue(e), r & 512 && n !== null && Gt(n, n.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          On(l, "");
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, s = e.updateQueue;
        if (e.updateQueue = null, s !== null) try {
          u === "input" && i.type === "radio" && i.name != null && xs(l, i), si(u, o);
          var d = si(u, i);
          for (o = 0; o < s.length; o += 2) {
            var h = s[o], v = s[o + 1];
            h === "style" ? _s(l, v) : h === "dangerouslySetInnerHTML" ? Ss(l, v) : h === "children" ? On(l, v) : Zi(l, h, v, d);
          }
          switch (u) {
            case "input":
              ri(l, i);
              break;
            case "textarea":
              ws(l, i);
              break;
            case "select":
              var m = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!i.multiple;
              var w = i.value;
              w != null ? Jt(l, !!i.multiple, w, !1) : m !== !!i.multiple && (i.defaultValue != null ? Jt(
                l,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : Jt(l, !!i.multiple, i.multiple ? [] : "", !1));
          }
          l[Qn] = i;
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 6:
      if (Le(t, e), Ue(e), r & 4) {
        if (e.stateNode === null) throw Error(x(162));
        l = e.stateNode, i = e.memoizedProps;
        try {
          l.nodeValue = i;
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 3:
      if (Le(t, e), Ue(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        An(t.containerInfo);
      } catch (_) {
        Y(e, e.return, _);
      }
      break;
    case 4:
      Le(t, e), Ue(e);
      break;
    case 13:
      Le(t, e), Ue(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (To = G())), r & 4 && Vu(e);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (ue = (d = ue) || h, Le(t, e), ue = d) : Le(t, e), Ue(e), r & 8192) {
        if (d = e.memoizedState !== null, (e.stateNode.isHidden = d) && !h && e.mode & 1) for (N = e, h = e.child; h !== null; ) {
          for (v = N = h; N !== null; ) {
            switch (m = N, w = m.child, m.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Dn(4, m, m.return);
                break;
              case 1:
                Gt(m, m.return);
                var S = m.stateNode;
                if (typeof S.componentWillUnmount == "function") {
                  r = m, n = m.return;
                  try {
                    t = r, S.props = t.memoizedProps, S.state = t.memoizedState, S.componentWillUnmount();
                  } catch (_) {
                    Y(r, n, _);
                  }
                }
                break;
              case 5:
                Gt(m, m.return);
                break;
              case 22:
                if (m.memoizedState !== null) {
                  Hu(v);
                  continue;
                }
            }
            w !== null ? (w.return = m, N = w) : Hu(v);
          }
          h = h.sibling;
        }
        e: for (h = null, v = e; ; ) {
          if (v.tag === 5) {
            if (h === null) {
              h = v;
              try {
                l = v.stateNode, d ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = v.stateNode, s = v.memoizedProps.style, o = s != null && s.hasOwnProperty("display") ? s.display : null, u.style.display = Es("display", o));
              } catch (_) {
                Y(e, e.return, _);
              }
            }
          } else if (v.tag === 6) {
            if (h === null) try {
              v.stateNode.nodeValue = d ? "" : v.memoizedProps;
            } catch (_) {
              Y(e, e.return, _);
            }
          } else if ((v.tag !== 22 && v.tag !== 23 || v.memoizedState === null || v === e) && v.child !== null) {
            v.child.return = v, v = v.child;
            continue;
          }
          if (v === e) break e;
          for (; v.sibling === null; ) {
            if (v.return === null || v.return === e) break e;
            h === v && (h = null), v = v.return;
          }
          h === v && (h = null), v.sibling.return = v.return, v = v.sibling;
        }
      }
      break;
    case 19:
      Le(t, e), Ue(e), r & 4 && Vu(e);
      break;
    case 21:
      break;
    default:
      Le(
        t,
        e
      ), Ue(e);
  }
}
function Ue(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Ga(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(x(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (On(l, ""), r.flags &= -33);
          var i = Au(e);
          $i(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = Au(e);
          Fi(e, u, o);
          break;
        default:
          throw Error(x(161));
      }
    } catch (s) {
      Y(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Cf(e, t, n) {
  N = e, qa(e);
}
function qa(e, t, n) {
  for (var r = (e.mode & 1) !== 0; N !== null; ) {
    var l = N, i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || xr;
      if (!o) {
        var u = l.alternate, s = u !== null && u.memoizedState !== null || ue;
        u = xr;
        var d = ue;
        if (xr = o, (ue = s) && !d) for (N = l; N !== null; ) o = N, s = o.child, o.tag === 22 && o.memoizedState !== null ? Wu(l) : s !== null ? (s.return = o, N = s) : Wu(l);
        for (; i !== null; ) N = i, qa(i), i = i.sibling;
        N = l, xr = u, ue = d;
      }
      Bu(e);
    } else l.subtreeFlags & 8772 && i !== null ? (i.return = l, N = i) : Bu(e);
  }
}
function Bu(e) {
  for (; N !== null; ) {
    var t = N;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            ue || ml(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !ue) if (n === null) r.componentDidMount();
            else {
              var l = t.elementType === t.type ? n.memoizedProps : De(t.type, n.memoizedProps);
              r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var i = t.updateQueue;
            i !== null && Cu(t, i, r);
            break;
          case 3:
            var o = t.updateQueue;
            if (o !== null) {
              if (n = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  n = t.child.stateNode;
                  break;
                case 1:
                  n = t.child.stateNode;
              }
              Cu(t, o, n);
            }
            break;
          case 5:
            var u = t.stateNode;
            if (n === null && t.flags & 4) {
              n = u;
              var s = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s.autoFocus && n.focus();
                  break;
                case "img":
                  s.src && (n.src = s.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (t.memoizedState === null) {
              var d = t.alternate;
              if (d !== null) {
                var h = d.memoizedState;
                if (h !== null) {
                  var v = h.dehydrated;
                  v !== null && An(v);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(x(163));
        }
        ue || t.flags & 512 && Oi(t);
      } catch (m) {
        Y(t, t.return, m);
      }
    }
    if (t === e) {
      N = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, N = n;
      break;
    }
    N = t.return;
  }
}
function Hu(e) {
  for (; N !== null; ) {
    var t = N;
    if (t === e) {
      N = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, N = n;
      break;
    }
    N = t.return;
  }
}
function Wu(e) {
  for (; N !== null; ) {
    var t = N;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ml(4, t);
          } catch (s) {
            Y(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              Y(t, l, s);
            }
          }
          var i = t.return;
          try {
            Oi(t);
          } catch (s) {
            Y(t, i, s);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Oi(t);
          } catch (s) {
            Y(t, o, s);
          }
      }
    } catch (s) {
      Y(t, t.return, s);
    }
    if (t === e) {
      N = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, N = u;
      break;
    }
    N = t.return;
  }
}
var jf = Math.ceil, tl = tt.ReactCurrentDispatcher, zo = tt.ReactCurrentOwner, ze = tt.ReactCurrentBatchConfig, I = 0, te = null, Z = null, re = 0, ye = 0, Zt = wt(0), q = 0, Jn = null, Mt = 0, hl = 0, Po = 0, Rn = null, pe = null, To = 0, cn = 1 / 0, Ke = null, nl = !1, Ui = null, mt = null, wr = !1, st = null, rl = 0, Mn = 0, Ai = null, Rr = -1, Mr = 0;
function ce() {
  return I & 6 ? G() : Rr !== -1 ? Rr : Rr = G();
}
function ht(e) {
  return e.mode & 1 ? I & 2 && re !== 0 ? re & -re : cf.transition !== null ? (Mr === 0 && (Mr = Os()), Mr) : (e = O, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Hs(e.type)), e) : 1;
}
function Oe(e, t, n, r) {
  if (50 < Mn) throw Mn = 0, Ai = null, Error(x(185));
  bn(e, n, r), (!(I & 2) || e !== te) && (e === te && (!(I & 2) && (hl |= n), q === 4 && ot(e, re)), ge(e, r), n === 1 && I === 0 && !(t.mode & 1) && (cn = G() + 500, dl && kt()));
}
function ge(e, t) {
  var n = e.callbackNode;
  ad(e, t);
  var r = Ar(e, e === te ? re : 0);
  if (r === 0) n !== null && bo(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && bo(n), t === 1) e.tag === 0 ? af(Qu.bind(null, e)) : sa(Qu.bind(null, e)), lf(function() {
      !(I & 6) && kt();
    }), n = null;
    else {
      switch (Fs(r)) {
        case 1:
          n = to;
          break;
        case 4:
          n = Ms;
          break;
        case 16:
          n = Ur;
          break;
        case 536870912:
          n = Is;
          break;
        default:
          n = Ur;
      }
      n = oc(n, ba.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function ba(e, t) {
  if (Rr = -1, Mr = 0, I & 6) throw Error(x(327));
  var n = e.callbackNode;
  if (nn() && e.callbackNode !== n) return null;
  var r = Ar(e, e === te ? re : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = ll(e, r);
  else {
    t = r;
    var l = I;
    I |= 2;
    var i = tc();
    (te !== e || re !== t) && (Ke = null, cn = G() + 500, Pt(e, t));
    do
      try {
        Tf();
        break;
      } catch (u) {
        ec(e, u);
      }
    while (!0);
    ho(), tl.current = i, I = l, Z !== null ? t = 0 : (te = null, re = 0, t = q);
  }
  if (t !== 0) {
    if (t === 2 && (l = pi(e), l !== 0 && (r = l, t = Vi(e, l))), t === 1) throw n = Jn, Pt(e, 0), ot(e, r), ge(e, G()), n;
    if (t === 6) ot(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !zf(l) && (t = ll(e, r), t === 2 && (i = pi(e), i !== 0 && (r = i, t = Vi(e, i))), t === 1)) throw n = Jn, Pt(e, 0), ot(e, r), ge(e, G()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(x(345));
        case 2:
          Nt(e, pe, Ke);
          break;
        case 3:
          if (ot(e, r), (r & 130023424) === r && (t = To + 500 - G(), 10 < t)) {
            if (Ar(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              ce(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = ki(Nt.bind(null, e, pe, Ke), t);
            break;
          }
          Nt(e, pe, Ke);
          break;
        case 4:
          if (ot(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - Ie(r);
            i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
          }
          if (r = l, r = G() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * jf(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = ki(Nt.bind(null, e, pe, Ke), r);
            break;
          }
          Nt(e, pe, Ke);
          break;
        case 5:
          Nt(e, pe, Ke);
          break;
        default:
          throw Error(x(329));
      }
    }
  }
  return ge(e, G()), e.callbackNode === n ? ba.bind(null, e) : null;
}
function Vi(e, t) {
  var n = Rn;
  return e.current.memoizedState.isDehydrated && (Pt(e, t).flags |= 256), e = ll(e, t), e !== 2 && (t = pe, pe = n, t !== null && Bi(t)), e;
}
function Bi(e) {
  pe === null ? pe = e : pe.push.apply(pe, e);
}
function zf(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var l = n[r], i = l.getSnapshot;
        l = l.value;
        try {
          if (!Fe(i(), l)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return !0;
}
function ot(e, t) {
  for (t &= ~Po, t &= ~hl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Ie(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function Qu(e) {
  if (I & 6) throw Error(x(327));
  nn();
  var t = Ar(e, 0);
  if (!(t & 1)) return ge(e, G()), null;
  var n = ll(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = pi(e);
    r !== 0 && (t = r, n = Vi(e, r));
  }
  if (n === 1) throw n = Jn, Pt(e, 0), ot(e, t), ge(e, G()), n;
  if (n === 6) throw Error(x(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Nt(e, pe, Ke), ge(e, G()), null;
}
function Lo(e, t) {
  var n = I;
  I |= 1;
  try {
    return e(t);
  } finally {
    I = n, I === 0 && (cn = G() + 500, dl && kt());
  }
}
function It(e) {
  st !== null && st.tag === 0 && !(I & 6) && nn();
  var t = I;
  I |= 1;
  var n = ze.transition, r = O;
  try {
    if (ze.transition = null, O = 1, e) return e();
  } finally {
    O = r, ze.transition = n, I = t, !(I & 6) && kt();
  }
}
function Do() {
  ye = Zt.current, V(Zt);
}
function Pt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, rf(n)), Z !== null) for (n = Z.return; n !== null; ) {
    var r = n;
    switch (fo(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Qr();
        break;
      case 3:
        sn(), V(he), V(se), ko();
        break;
      case 5:
        wo(r);
        break;
      case 4:
        sn();
        break;
      case 13:
        V(W);
        break;
      case 19:
        V(W);
        break;
      case 10:
        vo(r.type._context);
        break;
      case 22:
      case 23:
        Do();
    }
    n = n.return;
  }
  if (te = e, Z = e = vt(e.current, null), re = ye = t, q = 0, Jn = null, Po = hl = Mt = 0, pe = Rn = null, jt !== null) {
    for (t = 0; t < jt.length; t++) if (n = jt[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var l = r.next, i = n.pending;
      if (i !== null) {
        var o = i.next;
        i.next = l, r.next = o;
      }
      n.pending = r;
    }
    jt = null;
  }
  return e;
}
function ec(e, t) {
  do {
    var n = Z;
    try {
      if (ho(), Tr.current = el, br) {
        for (var r = Q.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        br = !1;
      }
      if (Rt = 0, ee = J = Q = null, Ln = !1, Xn = 0, zo.current = null, n === null || n.return === null) {
        q = 1, Jn = t, Z = null;
        break;
      }
      e: {
        var i = e, o = n.return, u = n, s = t;
        if (t = re, u.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
          var d = s, h = u, v = h.tag;
          if (!(h.mode & 1) && (v === 0 || v === 11 || v === 15)) {
            var m = h.alternate;
            m ? (h.updateQueue = m.updateQueue, h.memoizedState = m.memoizedState, h.lanes = m.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var w = Du(o);
          if (w !== null) {
            w.flags &= -257, Ru(w, o, u, i, t), w.mode & 1 && Lu(i, d, t), t = w, s = d;
            var S = t.updateQueue;
            if (S === null) {
              var _ = /* @__PURE__ */ new Set();
              _.add(s), t.updateQueue = _;
            } else S.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              Lu(i, d, t), Ro();
              break e;
            }
            s = Error(x(426));
          }
        } else if (H && u.mode & 1) {
          var E = Du(o);
          if (E !== null) {
            !(E.flags & 65536) && (E.flags |= 256), Ru(E, o, u, i, t), po(an(s, u));
            break e;
          }
        }
        i = s = an(s, u), q !== 4 && (q = 2), Rn === null ? Rn = [i] : Rn.push(i), i = o;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, t &= -t, i.lanes |= t;
              var f = Fa(i, s, t);
              Nu(i, f);
              break e;
            case 1:
              u = s;
              var c = i.type, p = i.stateNode;
              if (!(i.flags & 128) && (typeof c.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (mt === null || !mt.has(p)))) {
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var g = $a(i, u, t);
                Nu(i, g);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      rc(n);
    } catch (k) {
      t = k, Z === n && n !== null && (Z = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function tc() {
  var e = tl.current;
  return tl.current = el, e === null ? el : e;
}
function Ro() {
  (q === 0 || q === 3 || q === 2) && (q = 4), te === null || !(Mt & 268435455) && !(hl & 268435455) || ot(te, re);
}
function ll(e, t) {
  var n = I;
  I |= 2;
  var r = tc();
  (te !== e || re !== t) && (Ke = null, Pt(e, t));
  do
    try {
      Pf();
      break;
    } catch (l) {
      ec(e, l);
    }
  while (!0);
  if (ho(), I = n, tl.current = r, Z !== null) throw Error(x(261));
  return te = null, re = 0, q;
}
function Pf() {
  for (; Z !== null; ) nc(Z);
}
function Tf() {
  for (; Z !== null && !ed(); ) nc(Z);
}
function nc(e) {
  var t = ic(e.alternate, e, ye);
  e.memoizedProps = e.pendingProps, t === null ? rc(e) : Z = t, zo.current = null;
}
function rc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = Ef(n, t), n !== null) {
        n.flags &= 32767, Z = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        q = 6, Z = null;
        return;
      }
    } else if (n = Sf(n, t, ye), n !== null) {
      Z = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      Z = t;
      return;
    }
    Z = t = e;
  } while (t !== null);
  q === 0 && (q = 5);
}
function Nt(e, t, n) {
  var r = O, l = ze.transition;
  try {
    ze.transition = null, O = 1, Lf(e, t, n, r);
  } finally {
    ze.transition = l, O = r;
  }
  return null;
}
function Lf(e, t, n, r) {
  do
    nn();
  while (st !== null);
  if (I & 6) throw Error(x(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(x(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (cd(e, i), e === te && (Z = te = null, re = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || wr || (wr = !0, oc(Ur, function() {
    return nn(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = ze.transition, ze.transition = null;
    var o = O;
    O = 1;
    var u = I;
    I |= 4, zo.current = null, Nf(e, n), Ja(n, e), Zd(xi), Vr = !!yi, xi = yi = null, e.current = n, Cf(n), td(), I = u, O = o, ze.transition = i;
  } else e.current = n;
  if (wr && (wr = !1, st = e, rl = l), i = e.pendingLanes, i === 0 && (mt = null), ld(n.stateNode), ge(e, G()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if (nl) throw nl = !1, e = Ui, Ui = null, e;
  return rl & 1 && e.tag !== 0 && nn(), i = e.pendingLanes, i & 1 ? e === Ai ? Mn++ : (Mn = 0, Ai = e) : Mn = 0, kt(), null;
}
function nn() {
  if (st !== null) {
    var e = Fs(rl), t = ze.transition, n = O;
    try {
      if (ze.transition = null, O = 16 > e ? 16 : e, st === null) var r = !1;
      else {
        if (e = st, st = null, rl = 0, I & 6) throw Error(x(331));
        var l = I;
        for (I |= 4, N = e.current; N !== null; ) {
          var i = N, o = i.child;
          if (N.flags & 16) {
            var u = i.deletions;
            if (u !== null) {
              for (var s = 0; s < u.length; s++) {
                var d = u[s];
                for (N = d; N !== null; ) {
                  var h = N;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Dn(8, h, i);
                  }
                  var v = h.child;
                  if (v !== null) v.return = h, N = v;
                  else for (; N !== null; ) {
                    h = N;
                    var m = h.sibling, w = h.return;
                    if (Xa(h), h === d) {
                      N = null;
                      break;
                    }
                    if (m !== null) {
                      m.return = w, N = m;
                      break;
                    }
                    N = w;
                  }
                }
              }
              var S = i.alternate;
              if (S !== null) {
                var _ = S.child;
                if (_ !== null) {
                  S.child = null;
                  do {
                    var E = _.sibling;
                    _.sibling = null, _ = E;
                  } while (_ !== null);
                }
              }
              N = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) o.return = i, N = o;
          else e: for (; N !== null; ) {
            if (i = N, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                Dn(9, i, i.return);
            }
            var f = i.sibling;
            if (f !== null) {
              f.return = i.return, N = f;
              break e;
            }
            N = i.return;
          }
        }
        var c = e.current;
        for (N = c; N !== null; ) {
          o = N;
          var p = o.child;
          if (o.subtreeFlags & 2064 && p !== null) p.return = o, N = p;
          else e: for (o = c; N !== null; ) {
            if (u = N, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  ml(9, u);
              }
            } catch (k) {
              Y(u, u.return, k);
            }
            if (u === o) {
              N = null;
              break e;
            }
            var g = u.sibling;
            if (g !== null) {
              g.return = u.return, N = g;
              break e;
            }
            N = u.return;
          }
        }
        if (I = l, kt(), Be && typeof Be.onPostCommitFiberRoot == "function") try {
          Be.onPostCommitFiberRoot(ol, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      O = n, ze.transition = t;
    }
  }
  return !1;
}
function Ku(e, t, n) {
  t = an(n, t), t = Fa(e, t, 1), e = pt(e, t, 1), t = ce(), e !== null && (bn(e, 1, t), ge(e, t));
}
function Y(e, t, n) {
  if (e.tag === 3) Ku(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Ku(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (mt === null || !mt.has(r))) {
        e = an(n, e), e = $a(t, e, 1), t = pt(t, e, 1), e = ce(), t !== null && (bn(t, 1, e), ge(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Df(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = ce(), e.pingedLanes |= e.suspendedLanes & n, te === e && (re & n) === n && (q === 4 || q === 3 && (re & 130023424) === re && 500 > G() - To ? Pt(e, 0) : Po |= n), ge(e, t);
}
function lc(e, t) {
  t === 0 && (e.mode & 1 ? (t = cr, cr <<= 1, !(cr & 130023424) && (cr = 4194304)) : t = 1);
  var n = ce();
  e = be(e, t), e !== null && (bn(e, t, n), ge(e, n));
}
function Rf(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), lc(e, n);
}
function Mf(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode, l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(x(314));
  }
  r !== null && r.delete(t), lc(e, n);
}
var ic;
ic = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || he.current) me = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return me = !1, kf(e, t, n);
    me = !!(e.flags & 131072);
  }
  else me = !1, H && t.flags & 1048576 && aa(t, Xr, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      Dr(e, t), e = t.pendingProps;
      var l = ln(t, se.current);
      tn(t, n), l = Eo(null, t, r, e, l, n);
      var i = _o();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, ve(r) ? (i = !0, Kr(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, yo(t), l.updater = pl, t.stateNode = l, l._reactInternals = t, zi(t, r, e, n), t = Li(null, t, r, !0, i, n)) : (t.tag = 0, H && i && co(t), ae(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (Dr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Of(r), e = De(r, e), l) {
          case 0:
            t = Ti(null, t, r, e, n);
            break e;
          case 1:
            t = Ou(null, t, r, e, n);
            break e;
          case 11:
            t = Mu(null, t, r, e, n);
            break e;
          case 14:
            t = Iu(null, t, r, De(r.type, e), n);
            break e;
        }
        throw Error(x(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Ti(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Ou(e, t, r, l, n);
    case 3:
      e: {
        if (Ba(t), e === null) throw Error(x(387));
        r = t.pendingProps, i = t.memoizedState, l = i.element, ha(e, t), Jr(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
          l = an(Error(x(423)), t), t = Fu(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = an(Error(x(424)), t), t = Fu(e, t, r, n, l);
          break e;
        } else for (xe = ft(t.stateNode.containerInfo.firstChild), we = t, H = !0, Me = null, n = pa(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (on(), r === l) {
            t = et(e, t, n);
            break e;
          }
          ae(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return va(t), e === null && Ni(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, wi(r, l) ? o = null : i !== null && wi(r, i) && (t.flags |= 32), Va(e, t), ae(e, t, o, n), t.child;
    case 6:
      return e === null && Ni(t), null;
    case 13:
      return Ha(e, t, n);
    case 4:
      return xo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = un(t, null, r, n) : ae(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Mu(e, t, r, l, n);
    case 7:
      return ae(e, t, t.pendingProps, n), t.child;
    case 8:
      return ae(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return ae(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, $(Gr, r._currentValue), r._currentValue = o, i !== null) if (Fe(i.value, o)) {
          if (i.children === l.children && !he.current) {
            t = et(e, t, n);
            break e;
          }
        } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
          var u = i.dependencies;
          if (u !== null) {
            o = i.child;
            for (var s = u.firstContext; s !== null; ) {
              if (s.context === r) {
                if (i.tag === 1) {
                  s = Ze(-1, n & -n), s.tag = 2;
                  var d = i.updateQueue;
                  if (d !== null) {
                    d = d.shared;
                    var h = d.pending;
                    h === null ? s.next = s : (s.next = h.next, h.next = s), d.pending = s;
                  }
                }
                i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), Ci(
                  i.return,
                  n,
                  t
                ), u.lanes |= n;
                break;
              }
              s = s.next;
            }
          } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
          else if (i.tag === 18) {
            if (o = i.return, o === null) throw Error(x(341));
            o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Ci(o, n, t), o = i.sibling;
          } else o = i.child;
          if (o !== null) o.return = i;
          else for (o = i; o !== null; ) {
            if (o === t) {
              o = null;
              break;
            }
            if (i = o.sibling, i !== null) {
              i.return = o.return, o = i;
              break;
            }
            o = o.return;
          }
          i = o;
        }
        ae(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, r = t.pendingProps.children, tn(t, n), l = Pe(l), r = r(l), t.flags |= 1, ae(e, t, r, n), t.child;
    case 14:
      return r = t.type, l = De(r, t.pendingProps), l = De(r.type, l), Iu(e, t, r, l, n);
    case 15:
      return Ua(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Dr(e, t), t.tag = 1, ve(r) ? (e = !0, Kr(t)) : e = !1, tn(t, n), Oa(t, r, l), zi(t, r, l, n), Li(null, t, r, !0, e, n);
    case 19:
      return Wa(e, t, n);
    case 22:
      return Aa(e, t, n);
  }
  throw Error(x(156, t.tag));
};
function oc(e, t) {
  return Rs(e, t);
}
function If(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function je(e, t, n, r) {
  return new If(e, t, n, r);
}
function Mo(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Of(e) {
  if (typeof e == "function") return Mo(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === qi) return 11;
    if (e === bi) return 14;
  }
  return 2;
}
function vt(e, t) {
  var n = e.alternate;
  return n === null ? (n = je(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Ir(e, t, n, r, l, i) {
  var o = 2;
  if (r = e, typeof e == "function") Mo(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case At:
      return Tt(n.children, l, i, t);
    case Ji:
      o = 8, l |= 8;
      break;
    case ql:
      return e = je(12, n, t, l | 2), e.elementType = ql, e.lanes = i, e;
    case bl:
      return e = je(13, n, t, l), e.elementType = bl, e.lanes = i, e;
    case ei:
      return e = je(19, n, t, l), e.elementType = ei, e.lanes = i, e;
    case vs:
      return vl(n, l, i, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case ms:
          o = 10;
          break e;
        case hs:
          o = 9;
          break e;
        case qi:
          o = 11;
          break e;
        case bi:
          o = 14;
          break e;
        case rt:
          o = 16, r = null;
          break e;
      }
      throw Error(x(130, e == null ? e : typeof e, ""));
  }
  return t = je(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
}
function Tt(e, t, n, r) {
  return e = je(7, e, r, t), e.lanes = n, e;
}
function vl(e, t, n, r) {
  return e = je(22, e, r, t), e.elementType = vs, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function Xl(e, t, n) {
  return e = je(6, e, null, t), e.lanes = n, e;
}
function Gl(e, t, n) {
  return t = je(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Ff(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Pl(0), this.expirationTimes = Pl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Pl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function Io(e, t, n, r, l, i, o, u, s) {
  return e = new Ff(e, t, n, u, s), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = je(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, yo(i), e;
}
function $f(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Ut, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function uc(e) {
  if (!e) return yt;
  e = e._reactInternals;
  e: {
    if (Ft(e) !== e || e.tag !== 1) throw Error(x(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (ve(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(x(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (ve(n)) return ua(e, n, t);
  }
  return t;
}
function sc(e, t, n, r, l, i, o, u, s) {
  return e = Io(n, r, !0, e, l, i, o, u, s), e.context = uc(null), n = e.current, r = ce(), l = ht(n), i = Ze(r, l), i.callback = t ?? null, pt(n, i, l), e.current.lanes = l, bn(e, l, r), ge(e, r), e;
}
function gl(e, t, n, r) {
  var l = t.current, i = ce(), o = ht(l);
  return n = uc(n), t.context === null ? t.context = n : t.pendingContext = n, t = Ze(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = pt(l, t, o), e !== null && (Oe(e, l, o, i), Pr(e, l, o)), o;
}
function il(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Yu(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Oo(e, t) {
  Yu(e, t), (e = e.alternate) && Yu(e, t);
}
function Uf() {
  return null;
}
var ac = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function Fo(e) {
  this._internalRoot = e;
}
yl.prototype.render = Fo.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(x(409));
  gl(e, t, null, null);
};
yl.prototype.unmount = Fo.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    It(function() {
      gl(null, e, null, null);
    }), t[qe] = null;
  }
};
function yl(e) {
  this._internalRoot = e;
}
yl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = As();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < it.length && t !== 0 && t < it[n].priority; n++) ;
    it.splice(n, 0, e), n === 0 && Bs(e);
  }
};
function $o(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function xl(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Xu() {
}
function Af(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var d = il(o);
        i.call(d);
      };
    }
    var o = sc(t, r, e, 0, null, !1, !1, "", Xu);
    return e._reactRootContainer = o, e[qe] = o.current, Hn(e.nodeType === 8 ? e.parentNode : e), It(), o;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var d = il(s);
      u.call(d);
    };
  }
  var s = Io(e, 0, !1, null, null, !1, !1, "", Xu);
  return e._reactRootContainer = s, e[qe] = s.current, Hn(e.nodeType === 8 ? e.parentNode : e), It(function() {
    gl(t, s, n, r);
  }), s;
}
function wl(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var u = l;
      l = function() {
        var s = il(o);
        u.call(s);
      };
    }
    gl(t, o, e, l);
  } else o = Af(n, t, e, l, r);
  return il(o);
}
$s = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = _n(t.pendingLanes);
        n !== 0 && (no(t, n | 1), ge(t, G()), !(I & 6) && (cn = G() + 500, kt()));
      }
      break;
    case 13:
      It(function() {
        var r = be(e, 1);
        if (r !== null) {
          var l = ce();
          Oe(r, e, 1, l);
        }
      }), Oo(e, 1);
  }
};
ro = function(e) {
  if (e.tag === 13) {
    var t = be(e, 134217728);
    if (t !== null) {
      var n = ce();
      Oe(t, e, 134217728, n);
    }
    Oo(e, 134217728);
  }
};
Us = function(e) {
  if (e.tag === 13) {
    var t = ht(e), n = be(e, t);
    if (n !== null) {
      var r = ce();
      Oe(n, e, t, r);
    }
    Oo(e, t);
  }
};
As = function() {
  return O;
};
Vs = function(e, t) {
  var n = O;
  try {
    return O = e, t();
  } finally {
    O = n;
  }
};
ci = function(e, t, n) {
  switch (t) {
    case "input":
      if (ri(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = cl(r);
            if (!l) throw Error(x(90));
            ys(r), ri(r, l);
          }
        }
      }
      break;
    case "textarea":
      ws(e, n);
      break;
    case "select":
      t = n.value, t != null && Jt(e, !!n.multiple, t, !1);
  }
};
js = Lo;
zs = It;
var Vf = { usingClientEntryPoint: !1, Events: [tr, Wt, cl, Ns, Cs, Lo] }, kn = { findFiberByHostInstance: Ct, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Bf = { bundleType: kn.bundleType, version: kn.version, rendererPackageName: kn.rendererPackageName, rendererConfig: kn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: tt.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Ls(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: kn.findFiberByHostInstance || Uf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var kr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!kr.isDisabled && kr.supportsFiber) try {
    ol = kr.inject(Bf), Be = kr;
  } catch {
  }
}
Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Vf;
Se.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!$o(t)) throw Error(x(200));
  return $f(e, t, null, n);
};
Se.createRoot = function(e, t) {
  if (!$o(e)) throw Error(x(299));
  var n = !1, r = "", l = ac;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[qe] = t.current, Hn(e.nodeType === 8 ? e.parentNode : e), new Fo(t);
};
Se.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(x(188)) : (e = Object.keys(e).join(","), Error(x(268, e)));
  return e = Ls(t), e = e === null ? null : e.stateNode, e;
};
Se.flushSync = function(e) {
  return It(e);
};
Se.hydrate = function(e, t, n) {
  if (!xl(t)) throw Error(x(200));
  return wl(null, e, t, !0, n);
};
Se.hydrateRoot = function(e, t, n) {
  if (!$o(e)) throw Error(x(405));
  var r = n != null && n.hydratedSources || null, l = !1, i = "", o = ac;
  if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = sc(t, null, e, 1, n ?? null, l, !1, i, o), e[qe] = t.current, Hn(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
    n,
    l
  );
  return new yl(t);
};
Se.render = function(e, t, n) {
  if (!xl(t)) throw Error(x(200));
  return wl(null, e, t, !1, n);
};
Se.unmountComponentAtNode = function(e) {
  if (!xl(e)) throw Error(x(40));
  return e._reactRootContainer ? (It(function() {
    wl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[qe] = null;
    });
  }), !0) : !1;
};
Se.unstable_batchedUpdates = Lo;
Se.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!xl(n)) throw Error(x(200));
  if (e == null || e._reactInternals === void 0) throw Error(x(38));
  return wl(e, t, n, !1, r);
};
Se.version = "18.3.1-next-f1338f8080-20240426";
function cc() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cc);
    } catch (e) {
      console.error(e);
    }
}
cc(), cs.exports = Se;
var Hf = cs.exports, dc, Gu = Hf;
dc = Gu.createRoot, Gu.hydrateRoot;
var fc = { exports: {} }, kl = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wf = T, Qf = Symbol.for("react.element"), Kf = Symbol.for("react.fragment"), Yf = Object.prototype.hasOwnProperty, Xf = Wf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Gf = { key: !0, ref: !0, __self: !0, __source: !0 };
function pc(e, t, n) {
  var r, l = {}, i = null, o = null;
  n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Yf.call(t, r) && !Gf.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
  return { $$typeof: Qf, type: e, key: i, ref: o, props: l, _owner: Xf.current };
}
kl.Fragment = Kf;
kl.jsx = pc;
kl.jsxs = pc;
fc.exports = kl;
var a = fc.exports;
const Zf = "title_classifier/v3";
function Hi(e) {
  const t = (n, r = {}) => e.callWS({ type: `${Zf}/${n}`, ...r });
  return {
    listSources: () => t("list_sources"),
    listEntries: (n = {}) => t("list_entries", n),
    entryDetail: (n) => t("entry_detail", { entry_id: n }),
    setEnum: (n, r) => t("set_enum", {
      entry_id: n,
      enum: r
    }),
    setHidden: (n, r) => t("set_hidden", { entry_id: n, hidden: r }),
    deleteEntry: (n) => t("delete_entry", { entry_id: n }),
    group: (n, r) => t("group", { child_id: n, parent_id: r }),
    ungroup: (n) => t("ungroup", { child_id: n }),
    rename: (n, r) => t("rename_entry", { entry_id: n, new_key: r }),
    setMediaType: (n, r) => t("set_media_type", {
      entry_id: n,
      media_type: r
    }),
    setContext: (n, r, l, i = "", o = "") => t("set_context", {
      entry_id: n,
      context: r,
      new_context: l,
      source_app: i,
      new_source_app: o
    }),
    setContextOverride: (n, r, l, i = "") => t("set_context_override", {
      entry_id: n,
      context: r,
      enum_override: l,
      source_app: i
    }),
    exportEntries: (n) => t("export_entries", {
      ...n ? { media_type: n } : {}
    }),
    importEntries: (n) => t("import_entries", { entries: n })
  };
}
function Jf(e, t, n) {
  const r = t !== void 0, l = r ? t.enum : e.enum;
  return {
    ...e,
    enum: l,
    serverEnum: e.enum,
    dirty: r && t.enum !== e.enum,
    saving: n?.saving ?? !1,
    saveError: n?.error ?? null
  };
}
function qf(e, t, n) {
  return e.map((r) => Jf(r, t[r.id], n[r.id]));
}
function bf(e, t, n) {
  return { ...e, [t]: { enum: n } };
}
function Zu(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function Ju(e, t, n) {
  return { ...e, [t]: n };
}
function Zl(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function ep(e, t, n) {
  return e.map((r) => r.id === t ? { ...r, enum: n } : r);
}
function tp(e, t, n) {
  const r = t[n];
  if (r === void 0) return !1;
  const l = e.find((i) => i.id === n);
  return l === void 0 || r.enum !== l.enum;
}
const np = 5e3;
function rp(e) {
  const [t, n] = T.useState([]), [r, l] = T.useState([]), [i, o] = T.useState({}), [u, s] = T.useState({}), [d, h] = T.useState(!1), [v, m] = T.useState(null), [w, S] = T.useState(null), [_, E] = T.useState(!1), f = T.useRef(e);
  f.current = e;
  const c = T.useRef(i);
  c.current = i;
  const p = T.useRef(!1), g = T.useRef(!1), k = T.useCallback(async () => {
    const L = f.current;
    if (!(!L || p.current)) {
      p.current = !0, E(!0);
      try {
        const U = Hi(L), [_e, $e] = await Promise.all([
          U.listSources(),
          U.listEntries({ include_hidden: !0, limit: 2e4 })
        ]);
        n(_e), l($e), h(!0), m(null), S((/* @__PURE__ */ new Date()).toLocaleTimeString());
      } catch (U) {
        h(!1), m(U instanceof Error ? U.message : String(U));
      } finally {
        E(!1), p.current = !1;
      }
    }
  }, []);
  T.useEffect(() => {
    k();
    const L = window.setInterval(k, np);
    return () => window.clearInterval(L);
  }, [k]), T.useEffect(() => {
    e && !g.current && (g.current = !0, k());
  }, [e, k]);
  const j = T.useCallback((L, U) => {
    o((_e) => bf(_e, L, U)), s((_e) => Zl(_e, L));
  }, []), z = T.useCallback((L) => {
    o((U) => Zu(U, L)), s((U) => Zl(U, L));
  }, []), P = T.useCallback(
    async (L) => {
      const U = f.current, _e = c.current[L];
      if (!(!U || _e === void 0)) {
        s(($e) => Ju($e, L, { saving: !0, error: null }));
        try {
          const We = await Hi(U).setEnum(L, _e.enum);
          if (!We || !We.ok) throw new Error("set_enum rejected");
          l((Qe) => ep(Qe, L, We.enum ?? _e.enum)), o((Qe) => Zu(Qe, L)), s((Qe) => Zl(Qe, L)), k();
        } catch ($e) {
          s(
            (We) => Ju(We, L, {
              saving: !1,
              error: $e instanceof Error ? $e.message : String($e)
            })
          );
        }
      }
    },
    [k]
  ), F = T.useMemo(
    () => qf(r, i, u),
    [r, i, u]
  ), y = T.useCallback(
    (L) => tp(r, i, L),
    [r, i]
  ), B = T.useCallback(
    (L) => F.find((U) => U.id === L),
    [F]
  );
  return {
    sources: t,
    entries: r,
    displayEntries: F,
    entryCount: d ? r.length : null,
    connected: d,
    error: v,
    lastSync: w,
    loading: _,
    refresh: k,
    setDraftEnum: j,
    resetDraft: z,
    applyDraft: P,
    isDirty: y,
    getDisplayEntry: B,
    dirtyCount: Object.keys(i).length
  };
}
const mc = [
  { id: "overview", label: "Übersicht", icon: "▦", desc: "Systemzustand & aktuelles Tagebuch" },
  { id: "inbox", label: "Inbox", icon: "✉", desc: "Unklassifizierte Einträge abarbeiten" },
  { id: "diary", label: "Tagebuch", icon: "⏱", desc: "Verlauf der Sichtungen" },
  { id: "catalog", label: "Katalog", icon: "▤", desc: "Bibliothek & Pflege" },
  { id: "io", label: "Import / Export", icon: "⇅", desc: "v3-JSON, bildfrei" },
  { id: "settings", label: "Einstellungen", icon: "⚙", desc: "Watcher, DB, Theme, Debug" }
];
function lp({ current: e, onSelect: t }) {
  return /* @__PURE__ */ a.jsxs("aside", { className: "tc-sidebar", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "tc-brand", children: [
      /* @__PURE__ */ a.jsx("div", { className: "logo", children: "TC" }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("div", { className: "title", children: "Title Classifier" }),
        /* @__PURE__ */ a.jsx("div", { className: "sub", children: "v3 · Verwaltung" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("nav", { className: "tc-nav", children: mc.map((n) => /* @__PURE__ */ a.jsxs(
      "button",
      {
        className: n.id === e ? "active" : "",
        onClick: () => t(n.id),
        title: n.desc,
        children: [
          /* @__PURE__ */ a.jsx("span", { className: "ico", children: n.icon }),
          /* @__PURE__ */ a.jsx("span", { children: n.label })
        ]
      },
      n.id
    )) }),
    /* @__PURE__ */ a.jsx("div", { className: "foot", children: "Title Classifier v3.1 · UX" })
  ] });
}
function ip(e) {
  e.dispatchEvent(
    new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 })
  );
}
function op({ title: e, desc: t, loading: n, onRefresh: r }) {
  const l = T.useRef(null);
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-cmdbar", children: [
    /* @__PURE__ */ a.jsx(
      "button",
      {
        ref: l,
        className: "tc-btn tc-menu-btn",
        title: "Menü",
        onClick: () => l.current && ip(l.current),
        children: "☰"
      }
    ),
    /* @__PURE__ */ a.jsxs("div", { children: [
      /* @__PURE__ */ a.jsx("h1", { children: e }),
      /* @__PURE__ */ a.jsx("div", { className: "desc", children: t })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "spacer" }),
    r ? /* @__PURE__ */ a.jsxs("button", { className: "tc-btn", onClick: r, disabled: n, children: [
      n ? "…" : "↻",
      " Aktualisieren"
    ] }) : null
  ] });
}
function up({
  connected: e,
  entryCount: t,
  selectedCount: n,
  lastSync: r,
  error: l,
  watcherCount: i
}) {
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-statusbar", children: [
    /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx("span", { className: `dot ${e ? "ok" : "bad"}` }),
      e ? "verbunden" : "getrennt"
    ] }),
    i !== void 0 ? /* @__PURE__ */ a.jsxs("span", { children: [
      "Watcher: ",
      i
    ] }) : null,
    /* @__PURE__ */ a.jsxs("span", { children: [
      "Einträge: ",
      t ?? "—"
    ] }),
    /* @__PURE__ */ a.jsxs("span", { children: [
      "Auswahl: ",
      n
    ] }),
    /* @__PURE__ */ a.jsxs("span", { children: [
      "Letzter Sync: ",
      r ?? "—"
    ] }),
    l ? /* @__PURE__ */ a.jsxs("span", { style: { color: "var(--tc-danger)" }, children: [
      "Fehler: ",
      l
    ] }) : null,
    /* @__PURE__ */ a.jsx("span", { className: "right", children: "Title Classifier v3" })
  ] });
}
function Uo(e) {
  return `media-type-${e}`;
}
const sp = {
  music: "Musik",
  game: "Spiel",
  video: "Video"
};
function ap({ s: e }) {
  const t = !!e.current_key;
  return /* @__PURE__ */ a.jsxs("div", { className: `tc-watcher ${Uo(e.media_type)}`, children: [
    e.current_artwork ? /* @__PURE__ */ a.jsx(
      "img",
      {
        className: "tc-art",
        src: e.current_artwork,
        alt: "",
        onError: (n) => n.currentTarget.style.display = "none"
      }
    ) : /* @__PURE__ */ a.jsx("div", { className: "tc-art tc-art-fallback", children: e.online ? "♪" : "·" }),
    /* @__PURE__ */ a.jsxs("div", { className: "tc-w-main", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "tc-w-head", children: [
        /* @__PURE__ */ a.jsx("span", { className: "tc-w-name", children: e.name }),
        /* @__PURE__ */ a.jsx("span", { className: `badge ${e.media_type}`, children: sp[e.media_type] }),
        /* @__PURE__ */ a.jsx("span", { className: "badge", children: e.context }),
        /* @__PURE__ */ a.jsx("span", { className: "badge", children: e.signal_type }),
        /* @__PURE__ */ a.jsx("span", { className: `badge ${e.online ? "ok" : "off"}`, children: e.online ? "online" : "offline" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: `tc-w-cur ${t ? "" : "muted"}`, children: t ? `▶ ${e.current_key}` : "— inaktiv —" }),
      /* @__PURE__ */ a.jsxs("div", { className: "tc-w-meta", children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          "Effective Enum: ",
          /* @__PURE__ */ a.jsx("b", { className: "tc-enum", children: e.current_enum ?? "—" })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          e.entry_count,
          " Einträge · ",
          e.unmapped_count,
          " offen"
        ] })
      ] })
    ] })
  ] });
}
function cp({ store: e }) {
  const { sources: t, entryCount: n, connected: r, error: l, lastSync: i } = e, o = t.filter((d) => d.online).length, u = t.reduce((d, h) => d + h.unmapped_count, 0), s = t.filter((d) => d.current_key);
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-page", children: [
    l ? /* @__PURE__ */ a.jsxs("div", { className: "tc-card tc-error", children: [
      "Verbindungsfehler: ",
      l,
      " — letzte bekannte Daten werden angezeigt."
    ] }) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "tc-stats", children: [
      /* @__PURE__ */ a.jsx(Sr, { label: "Watcher", value: t.length }),
      /* @__PURE__ */ a.jsx(Sr, { label: "Online", value: `${o}/${t.length}` }),
      /* @__PURE__ */ a.jsx(Sr, { label: "Einträge", value: n ?? "—" }),
      /* @__PURE__ */ a.jsx(Sr, { label: "Unklassifiziert", value: u })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Jetzt aktiv" }),
      s.length ? /* @__PURE__ */ a.jsx("div", { className: "tc-active", children: s.map((d) => /* @__PURE__ */ a.jsxs("div", { className: "tc-active-row", children: [
        /* @__PURE__ */ a.jsx("span", { className: "tc-active-name", children: d.name }),
        /* @__PURE__ */ a.jsx("span", { className: "tc-active-key", children: d.current_key }),
        /* @__PURE__ */ a.jsx("span", { className: "tc-enum", children: d.current_enum ?? "—" })
      ] }, d.entry_id)) }) : /* @__PURE__ */ a.jsx("div", { className: "tc-placeholder", children: "Aktuell spielt nichts." })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Watcher" }),
      t.length ? /* @__PURE__ */ a.jsx("div", { className: "tc-watchers", children: t.map((d) => /* @__PURE__ */ a.jsx(ap, { s: d }, d.entry_id)) }) : /* @__PURE__ */ a.jsx("div", { className: "tc-placeholder", children: r ? "Keine v3-Watcher konfiguriert." : "Verbinde mit Home Assistant …" })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "tc-syshint", children: [
      "System: WebSocket ",
      r ? "verbunden" : "getrennt",
      " · letzter Sync",
      " ",
      i ?? "—",
      ". (PostgreSQL-/DB-Status folgt mit den Einstellungen.)"
    ] })
  ] });
}
function Sr({ label: e, value: t }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-stat", children: [
    /* @__PURE__ */ a.jsx("div", { className: "tc-stat-val", children: t }),
    /* @__PURE__ */ a.jsx("div", { className: "tc-stat-label", children: e })
  ] });
}
const qu = { detail: null, loading: !1, error: null };
function hc(e, t) {
  const [n, r] = T.useState(qu), l = T.useRef(e);
  return l.current = e, T.useEffect(() => {
    const i = l.current;
    if (!t || !i) {
      r(qu);
      return;
    }
    let o = !1;
    return r((u) => ({
      detail: u.detail && u.detail.id === t ? u.detail : null,
      loading: !0,
      error: null
    })), Hi(i).entryDetail(t).then((u) => {
      o || r({ detail: u, loading: !1, error: null });
    }).catch((u) => {
      o || r({
        detail: null,
        loading: !1,
        error: u instanceof Error ? u.message : String(u)
      });
    }), () => {
      o = !0;
    };
  }, [t]), n;
}
function Er(e) {
  const t = new Date(e).getTime();
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function dp(e, t) {
  const n = Er(e.last_seen), r = Er(t.last_seen);
  if (n !== r) return r - n;
  const l = Er(e.first_seen), i = Er(t.first_seen);
  return l !== i ? i - l : e.key.localeCompare(t.key);
}
function fp(e) {
  return [...e].sort(dp);
}
const pp = /\s+(?:feat\.?|ft\.?|featuring)\s+/i;
function vc(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function mp(e) {
  const t = e.split(pp)[0].split(/\s*[&,]\s*/)[0];
  return vc(t).slice(0, 2).join(" ");
}
function hp(e) {
  const t = e.replace(/\([^)]*\)/g, " ");
  return vc(t).slice(0, 3).join(" ");
}
function vp(e) {
  const t = e.indexOf(" - "), n = t >= 0 ? e.slice(0, t) : "", r = t >= 0 ? e.slice(t + 3) : e;
  return `${mp(n)}|${hp(r)}`;
}
function gp(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const l of e) {
    if (l.hidden || l.parent_id !== null) continue;
    const i = vp(l.key);
    if (i === "|") continue;
    const o = `${l.media_type}|${l.signal_type}|${i}`, u = t.get(o) ?? [];
    u.push(l.id), t.set(o, u), n.set(l.id, o);
  }
  const r = /* @__PURE__ */ new Map();
  for (const l of e) {
    const i = n.get(l.id), o = i ? t.get(i)?.length ?? 0 : 0;
    r.set(l.id, { candidate: o >= 2, clusterSize: o });
  }
  return r;
}
const gc = ["music", "game", "video"], yp = [
  "homepod",
  "pc",
  "ps5",
  "switch",
  "stash",
  "apple_tv"
], yc = ["title", "app"], xp = Array.from({ length: 10 }, (e, t) => t);
function xc({ value: e, onChange: t, dirty: n, disabled: r }) {
  return /* @__PURE__ */ a.jsx(
    "select",
    {
      className: `tc-select tc-enum-select ${n ? "dirty" : ""}`,
      value: e,
      disabled: r,
      onChange: (l) => t(parseInt(l.target.value, 10)),
      onClick: (l) => l.stopPropagation(),
      children: xp.map((l) => /* @__PURE__ */ a.jsx("option", { value: l, children: l }, l))
    }
  );
}
function bu(e) {
  if (!e) return "—";
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function wc({
  entry: e,
  detail: t,
  artwork: n,
  onDraftEnum: r,
  onApply: l,
  onReset: i
}) {
  if (!e)
    return /* @__PURE__ */ a.jsx("aside", { className: "tc-detail", children: /* @__PURE__ */ a.jsx("div", { className: "tc-placeholder", children: "Eintrag auswählen, um Details zu sehen." }) });
  const o = t.detail && t.detail.id === e.id ? t.detail : null;
  return /* @__PURE__ */ a.jsxs("aside", { className: "tc-detail", children: [
    n ? /* @__PURE__ */ a.jsx(
      "img",
      {
        className: "tc-detail-art",
        src: n,
        alt: "",
        onError: (u) => u.currentTarget.style.display = "none"
      }
    ) : null,
    /* @__PURE__ */ a.jsx("h3", { className: "tc-detail-title", children: e.key }),
    /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-badges", children: [
      /* @__PURE__ */ a.jsx("span", { className: `badge ${e.media_type}`, children: e.media_type }),
      /* @__PURE__ */ a.jsx("span", { className: "badge", children: e.signal_type }),
      e.hidden ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "versteckt" }) : null,
      e.is_variant ? /* @__PURE__ */ a.jsx("span", { className: "badge", children: "Variante" }) : null,
      e.is_current ? /* @__PURE__ */ a.jsx("span", { className: "badge ok", children: "aktiv" }) : null
    ] }),
    /* @__PURE__ */ a.jsxs("dl", { className: "tc-detail-grid", children: [
      /* @__PURE__ */ a.jsx("dt", { children: "Enum" }),
      /* @__PURE__ */ a.jsx("dd", { children: /* @__PURE__ */ a.jsx(
        xc,
        {
          value: e.enum,
          onChange: (u) => r(e.id, u),
          dirty: e.dirty
        }
      ) }),
      /* @__PURE__ */ a.jsx("dt", { children: "Effective (live)" }),
      /* @__PURE__ */ a.jsx("dd", { children: e.is_current ? e.effective_enum ?? "—" : "—" }),
      /* @__PURE__ */ a.jsx("dt", { children: "Server-Enum" }),
      /* @__PURE__ */ a.jsx("dd", { children: e.serverEnum }),
      /* @__PURE__ */ a.jsx("dt", { children: "Sichtungen" }),
      /* @__PURE__ */ a.jsx("dd", { children: o ? o.seen_count : e.seen_count }),
      /* @__PURE__ */ a.jsx("dt", { children: "Zuletzt" }),
      /* @__PURE__ */ a.jsx("dd", { children: bu(o ? o.last_seen : e.last_seen) }),
      /* @__PURE__ */ a.jsx("dt", { children: "Erstmals" }),
      /* @__PURE__ */ a.jsx("dd", { children: bu(o ? o.first_seen : e.first_seen) })
    ] }),
    o?.parent ? /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-parent", children: [
      "Master: ",
      /* @__PURE__ */ a.jsx("b", { children: o.parent.key }),
      " (Enum ",
      o.parent.enum,
      ") — erbt Enum vom Master"
    ] }) : null,
    /* @__PURE__ */ a.jsxs("section", { className: "tc-detail-section", children: [
      /* @__PURE__ */ a.jsxs("h4", { children: [
        "Kontexte ",
        t.loading ? "…" : o ? `(${o.contexts.length})` : ""
      ] }),
      t.error ? /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-error", children: [
        "Detail-Fehler: ",
        t.error
      ] }) : null,
      o && o.contexts.length ? /* @__PURE__ */ a.jsxs("table", { className: "tc-ctx-table", children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "Kontext" }),
          /* @__PURE__ */ a.jsx("th", { children: "App" }),
          /* @__PURE__ */ a.jsx("th", { children: "Override" }),
          /* @__PURE__ */ a.jsx("th", { children: "Eff." }),
          /* @__PURE__ */ a.jsx("th", { children: "Sicht." })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: o.contexts.map((u) => /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("td", { children: u.context }),
          /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: u.source_app || "—" }),
          /* @__PURE__ */ a.jsx("td", { children: u.enum_override ?? "—" }),
          /* @__PURE__ */ a.jsx("td", { children: u.effective_preview }),
          /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: u.seen_count })
        ] }, `${u.context}/${u.source_app}`)) })
      ] }) : o ? /* @__PURE__ */ a.jsx("div", { className: "tc-muted", children: "Noch keine Kontexte beobachtet." }) : null
    ] }),
    o && o.variants.length ? /* @__PURE__ */ a.jsxs("section", { className: "tc-detail-section", children: [
      /* @__PURE__ */ a.jsxs("h4", { children: [
        "Varianten (",
        o.variants.length,
        ")"
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "tc-variants", children: o.variants.map((u) => /* @__PURE__ */ a.jsxs("li", { children: [
        u.key,
        " ",
        /* @__PURE__ */ a.jsxs("span", { className: "tc-muted", children: [
          "(Enum ",
          u.enum,
          ")"
        ] })
      ] }, u.id)) })
    ] }) : null,
    e.saveError ? /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-error", children: [
      "Fehler: ",
      e.saveError
    ] }) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-actions", children: [
      /* @__PURE__ */ a.jsx(
        "button",
        {
          className: "tc-btn primary",
          disabled: !e.dirty || e.saving,
          onClick: () => l(e.id),
          children: e.saving ? "…" : "Apply"
        }
      ),
      /* @__PURE__ */ a.jsx(
        "button",
        {
          className: "tc-btn",
          disabled: !e.dirty || e.saving,
          onClick: () => i(e.id),
          children: "Zurücksetzen"
        }
      )
    ] })
  ] });
}
function wp(e) {
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function kp({ store: e, hass: t }) {
  const [n, r] = T.useState(""), [l, i] = T.useState(""), [o, u] = T.useState(""), [s, d] = T.useState(""), [h, v] = T.useState(!1), [m, w] = T.useState(!1), [S, _] = T.useState(/* @__PURE__ */ new Set()), [E, f] = T.useState(null), c = T.useMemo(
    () => new Set(e.sources.flatMap((y) => y.inactive_keys ?? [])),
    [e.sources]
  ), p = T.useMemo(
    () => gp(e.displayEntries),
    [e.displayEntries]
  ), g = (y) => p.get(y)?.candidate ?? !1, k = T.useMemo(() => {
    const y = e.displayEntries.filter((L) => !(L.parent_id !== null || L.serverEnum !== 0 || !h && L.hidden || c.has(L.normalized_key) || l && L.media_type !== l || o && L.signal_type !== o || s && L.current_context !== s || n && !L.key.toLowerCase().includes(n.toLowerCase()))), B = fp(y);
    return m ? [...B].sort((L, U) => Number(g(U.id)) - Number(g(L.id))) : B;
  }, [
    e.displayEntries,
    h,
    l,
    o,
    s,
    n,
    c,
    p,
    m
  ]), j = (y) => _((B) => {
    const L = new Set(B);
    return L.has(y) ? L.delete(y) : L.add(y), L;
  }), z = E ? e.getDisplayEntry(E) : void 0, P = hc(t, E), F = E ? e.sources.find((y) => y.current_entry_id === E)?.current_artwork ?? null : null;
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox-main", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "tc-filters", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "tc-input",
            type: "search",
            placeholder: "Suche …",
            value: n,
            onChange: (y) => r(y.target.value)
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: l,
            onChange: (y) => i(y.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Medienart: Alle" }),
              gc.map((y) => /* @__PURE__ */ a.jsx("option", { value: y, children: y }, y))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: s,
            onChange: (y) => d(y.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Kontext: Alle" }),
              yp.map((y) => /* @__PURE__ */ a.jsx("option", { value: y, children: y }, y))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: o,
            onChange: (y) => u(y.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Signal: Alle" }),
              yc.map((y) => /* @__PURE__ */ a.jsx("option", { value: y, children: y }, y))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs("label", { className: "tc-check", children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: h,
              onChange: (y) => v(y.target.checked)
            }
          ),
          "versteckte"
        ] }),
        /* @__PURE__ */ a.jsxs("label", { className: "tc-check", children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: m,
              onChange: (y) => w(y.target.checked)
            }
          ),
          "mögliche Varianten zuerst"
        ] }),
        /* @__PURE__ */ a.jsxs("span", { className: "tc-filters-info", children: [
          k.length,
          " Einträge · Auswahl ",
          S.size,
          " · offen",
          " ",
          e.dirtyCount
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "tc-table-wrap", children: /* @__PURE__ */ a.jsxs("table", { className: "tc-table", children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", {}),
          /* @__PURE__ */ a.jsx("th", { children: "Key" }),
          /* @__PURE__ */ a.jsx("th", { children: "Art" }),
          /* @__PURE__ */ a.jsx("th", { children: "Kontext" }),
          /* @__PURE__ */ a.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ a.jsx("th", { children: "Enum" }),
          /* @__PURE__ */ a.jsx("th", { children: "Eff." }),
          /* @__PURE__ */ a.jsx("th", { children: "Status" }),
          /* @__PURE__ */ a.jsx("th", { children: "Zuletzt" }),
          /* @__PURE__ */ a.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: k.length === 0 ? /* @__PURE__ */ a.jsx("tr", { children: /* @__PURE__ */ a.jsx("td", { colSpan: 10, className: "tc-placeholder", children: "Keine unklassifizierten Einträge." }) }) : k.map((y) => /* @__PURE__ */ a.jsxs(
          "tr",
          {
            className: `${Uo(y.media_type)} ${y.id === E ? "focused" : ""} ${y.dirty ? "dirty" : ""}`,
            onClick: () => f(y.id),
            children: [
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: S.has(y.id),
                  onClick: (B) => B.stopPropagation(),
                  onChange: () => j(y.id)
                }
              ) }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-key", children: y.key }),
              /* @__PURE__ */ a.jsx("td", { children: y.media_type }),
              /* @__PURE__ */ a.jsx("td", { children: y.is_current ? y.current_context ?? "—" : "—" }),
              /* @__PURE__ */ a.jsx("td", { children: y.signal_type }),
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx(
                xc,
                {
                  value: y.enum,
                  dirty: y.dirty,
                  onChange: (B) => e.setDraftEnum(y.id, B)
                }
              ) }),
              /* @__PURE__ */ a.jsx("td", { children: y.is_current ? y.effective_enum ?? "—" : "—" }),
              /* @__PURE__ */ a.jsxs("td", { children: [
                y.saving ? /* @__PURE__ */ a.jsx("span", { className: "badge", children: "speichert…" }) : y.saveError ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "Fehler" }) : y.dirty ? /* @__PURE__ */ a.jsx("span", { className: "badge dirtybadge", children: "geändert" }) : y.hidden ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "versteckt" }) : /* @__PURE__ */ a.jsx("span", { className: "tc-muted", children: "—" }),
                g(y.id) ? /* @__PURE__ */ a.jsxs(
                  "span",
                  {
                    className: "badge var",
                    title: "Mögliche Variante — nicht automatisch gruppiert",
                    children: [
                      "⛓ ",
                      p.get(y.id)?.clusterSize
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: wp(y.last_seen) }),
              /* @__PURE__ */ a.jsx("td", { children: y.dirty ? /* @__PURE__ */ a.jsxs(
                "span",
                {
                  className: "tc-row-actions",
                  onClick: (B) => B.stopPropagation(),
                  children: [
                    /* @__PURE__ */ a.jsx(
                      "button",
                      {
                        className: "tc-btn primary tc-mini",
                        disabled: y.saving,
                        onClick: () => e.applyDraft(y.id),
                        children: "✓"
                      }
                    ),
                    /* @__PURE__ */ a.jsx(
                      "button",
                      {
                        className: "tc-btn tc-mini",
                        disabled: y.saving,
                        onClick: () => e.resetDraft(y.id),
                        children: "↺"
                      }
                    )
                  ]
                }
              ) : null })
            ]
          },
          y.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsx(
      wc,
      {
        entry: z,
        detail: P,
        artwork: F,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function Ao({ title: e, note: t }) {
  return /* @__PURE__ */ a.jsx("div", { className: "tc-page", children: /* @__PURE__ */ a.jsxs("div", { className: "tc-card tc-placeholder", children: [
    /* @__PURE__ */ a.jsx("h2", { children: e }),
    /* @__PURE__ */ a.jsx("p", { children: t })
  ] }) });
}
function Sp() {
  return /* @__PURE__ */ a.jsx(
    Ao,
    {
      title: "Tagebuch",
      note: "Verlauf der Sichtungen folgt in PR 9. TODO: eine echte Sighting-Timeline-Tabelle existiert in der DB noch nicht — der MVP zeigt nur verfügbare Daten."
    }
  );
}
function es(e, t) {
  return e.key.localeCompare(t.key);
}
function Ep(e) {
  const t = new Set(e.map((l) => l.id)), n = /* @__PURE__ */ new Map();
  for (const l of e)
    if (l.parent_id) {
      const i = n.get(l.parent_id) ?? [];
      i.push(l), n.set(l.parent_id, i);
    }
  const r = [];
  for (const l of e)
    l.parent_id === null ? r.push({
      entry: l,
      children: (n.get(l.id) ?? []).slice().sort(es),
      orphan: !1
    }) : t.has(l.parent_id) || r.push({ entry: l, children: [], orphan: !0 });
  return r.sort((l, i) => es(l.entry, i.entry));
}
function _p(e, t) {
  const n = new Set(
    e.filter((r) => r.parent_id).map((r) => r.parent_id)
  );
  switch (t) {
    case "unsorted":
      return e.filter((r) => r.parent_id === null && !n.has(r.id));
    case "groups": {
      const r = new Set(
        e.filter((l) => l.parent_id === null && n.has(l.id)).map((l) => l.id)
      );
      return e.filter(
        (l) => r.has(l.id) || l.parent_id !== null && r.has(l.parent_id)
      );
    }
    case "hidden":
      return e.filter((r) => r.hidden);
    case "all":
    default:
      return e;
  }
}
function Np(e, { search: t = "", media: n = "", signal: r = "" }) {
  const l = t.toLowerCase().trim();
  return e.filter((i) => !(n && i.media_type !== n || r && i.signal_type !== r || l && !i.key.toLowerCase().includes(l)));
}
const Cp = [
  { id: "all", label: "Alle" },
  { id: "unsorted", label: "Unsortiert" },
  { id: "groups", label: "Gruppen" },
  { id: "hidden", label: "Ausgeblendet" }
];
function jp({ store: e, hass: t }) {
  const [n, r] = T.useState("all"), [l, i] = T.useState(""), [o, u] = T.useState(""), [s, d] = T.useState(""), [h, v] = T.useState(null), m = T.useMemo(() => {
    const E = _p(e.displayEntries, n), f = Np(E, { search: l, media: o, signal: s }), c = Ep(f), p = [];
    for (const g of c) {
      const k = g.entry.variants.length;
      p.push({
        entry: g.entry,
        depth: 0,
        isMaster: k > 0,
        childCount: k,
        orphan: g.orphan
      });
      for (const j of g.children)
        p.push({
          entry: j,
          depth: 1,
          isMaster: !1,
          childCount: 0,
          orphan: !1
        });
    }
    return p;
  }, [e.displayEntries, n, l, o, s]), w = h ? e.getDisplayEntry(h) : void 0, S = hc(t, h), _ = h ? e.sources.find((E) => E.current_entry_id === h)?.current_artwork ?? null : null;
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox-main", children: [
      /* @__PURE__ */ a.jsx("div", { className: "tc-tabs", children: Cp.map((E) => /* @__PURE__ */ a.jsx(
        "button",
        {
          className: `tc-tab ${E.id === n ? "active" : ""}`,
          onClick: () => r(E.id),
          children: E.label
        },
        E.id
      )) }),
      /* @__PURE__ */ a.jsxs("div", { className: "tc-filters", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "tc-input",
            type: "search",
            placeholder: "Titel / Key suchen …",
            value: l,
            onChange: (E) => i(E.target.value)
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: o,
            onChange: (E) => u(E.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Medienart: Alle" }),
              gc.map((E) => /* @__PURE__ */ a.jsx("option", { value: E, children: E }, E))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: s,
            onChange: (E) => d(E.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Signal: Alle" }),
              yc.map((E) => /* @__PURE__ */ a.jsx("option", { value: E, children: E }, E))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs("span", { className: "tc-filters-info", children: [
          m.length,
          " Zeilen"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "tc-table-wrap", children: /* @__PURE__ */ a.jsxs("table", { className: "tc-table", children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "Titel / Key" }),
          /* @__PURE__ */ a.jsx("th", { children: "Art" }),
          /* @__PURE__ */ a.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ a.jsx("th", { children: "Enum" }),
          /* @__PURE__ */ a.jsx("th", { children: "Info" })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: m.length === 0 ? /* @__PURE__ */ a.jsx("tr", { children: /* @__PURE__ */ a.jsx("td", { colSpan: 5, className: "tc-placeholder", children: "Keine Einträge in dieser Ansicht." }) }) : m.map((E) => /* @__PURE__ */ a.jsxs(
          "tr",
          {
            className: `${Uo(E.entry.media_type)} ${E.entry.id === h ? "focused" : ""} ${E.depth > 0 ? "is-child" : ""}`,
            onClick: () => v(E.entry.id),
            children: [
              /* @__PURE__ */ a.jsxs(
                "td",
                {
                  className: "tc-key",
                  style: E.depth > 0 ? { paddingLeft: 26 } : void 0,
                  children: [
                    E.depth > 0 ? "↳ " : "",
                    E.entry.key
                  ]
                }
              ),
              /* @__PURE__ */ a.jsx("td", { children: E.entry.media_type }),
              /* @__PURE__ */ a.jsx("td", { children: E.entry.signal_type }),
              /* @__PURE__ */ a.jsx("td", { children: E.entry.enum }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: E.orphan ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "verwaiste Variante" }) : E.isMaster ? /* @__PURE__ */ a.jsxs("span", { className: "badge var", children: [
                E.childCount,
                " Varianten"
              ] }) : E.depth > 0 && (E.entry.media_type === "music" || E.entry.media_type === "video") ? "erbt Enum vom Master" : E.entry.hidden ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "versteckt" }) : "—" })
            ]
          },
          E.entry.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsx(
      wc,
      {
        entry: w,
        detail: S,
        artwork: _,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function zp() {
  return /* @__PURE__ */ a.jsx(
    Ao,
    {
      title: "Import / Export",
      note: "Bildfreies v3-JSON über die bestehende API mit Preview/Validierung und Konfliktanzeige folgt in PR 7."
    }
  );
}
function Pp() {
  return /* @__PURE__ */ a.jsx(
    Ao,
    {
      title: "Einstellungen",
      note: "Watcher-Status, PostgreSQL-Status (soweit verfügbar), v3-Konfiguration, Artwork-Fallbacks, Theme und Debug-Infos folgen in PR 8."
    }
  );
}
const Tp = {
  diary: Sp,
  io: zp,
  settings: Pp
};
function Lp({ hass: e }) {
  const [t, n] = T.useState("overview"), r = rp(e), l = mc.find((u) => u.id === t), i = Tp[t], o = () => t === "inbox" ? /* @__PURE__ */ a.jsx(kp, { store: r, hass: e }) : t === "catalog" ? /* @__PURE__ */ a.jsx(jp, { store: r, hass: e }) : t === "overview" || !i ? /* @__PURE__ */ a.jsx(cp, { store: r }) : /* @__PURE__ */ a.jsx(i, {});
  return /* @__PURE__ */ a.jsxs("div", { className: "tc3", children: [
    /* @__PURE__ */ a.jsx(lp, { current: t, onSelect: n }),
    /* @__PURE__ */ a.jsxs("div", { className: "tc3-body", children: [
      /* @__PURE__ */ a.jsx(
        op,
        {
          title: l.label,
          desc: l.desc,
          loading: r.loading,
          onRefresh: r.refresh
        }
      ),
      /* @__PURE__ */ a.jsx("main", { className: "tc3-main", children: o() }),
      /* @__PURE__ */ a.jsx(
        up,
        {
          connected: r.connected,
          entryCount: r.entryCount,
          selectedCount: 0,
          lastSync: r.lastSync,
          error: r.error,
          watcherCount: r.sources.length
        }
      )
    ] })
  ] });
}
const Dp = ':host{display:block;height:100%}:host,:root{--tc-bg: var(--primary-background-color, #1c1e2b);--tc-surface: #282a36;--tc-surface-raised: #343746;--tc-border: #44475a;--tc-text: var(--primary-text-color, #f8f8f2);--tc-text-muted: #9aa0bd;--tc-accent-purple: #bd93f9;--tc-accent-cyan: #8be9fd;--tc-accent-green: #50fa7b;--tc-accent-orange: #ffb86c;--tc-accent-pink: #ff79c6;--tc-danger: #ff5555;--tc-radius: 10px;--tc-gap: 14px}*{box-sizing:border-box}.tc3{display:grid;grid-template-columns:232px 1fr;height:100%;min-height:0;font-family:var(--paper-font-body1_-_font-family, "Segoe UI", system-ui, sans-serif);color:var(--tc-text);background:var(--tc-bg);font-size:14px}.tc3-body{display:grid;grid-template-rows:auto 1fr auto;min-width:0;min-height:0}.tc3-main{min-height:0;overflow:auto;padding:18px}.tc-sidebar{background:var(--tc-surface);border-right:1px solid var(--tc-border);display:flex;flex-direction:column;min-height:0}.tc-brand{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;border-bottom:1px solid var(--tc-border)}.tc-brand .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--tc-accent-purple),var(--tc-accent-pink));display:flex;align-items:center;justify-content:center;font-weight:700;color:#1c1e2b}.tc-brand .title{font-weight:700;line-height:1.1}.tc-brand .sub{color:var(--tc-text-muted);font-size:11px}.tc-nav{padding:10px 8px;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0;overflow:auto}.tc-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:1px solid transparent;color:var(--tc-text);padding:9px 12px;border-radius:8px;cursor:pointer;font:inherit}.tc-nav button:hover{background:var(--tc-surface-raised)}.tc-nav button.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-nav .ico{width:18px;text-align:center;opacity:.85}.tc-sidebar .foot{padding:10px 16px;border-top:1px solid var(--tc-border);color:var(--tc-text-muted);font-size:11px}.tc-cmdbar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--tc-border);background:color-mix(in srgb,var(--tc-surface) 60%,var(--tc-bg))}.tc-cmdbar h1{font-size:17px;margin:0}.tc-cmdbar .desc{color:var(--tc-text-muted);font-size:12px}.tc-cmdbar .spacer{flex:1}.tc-menu-btn{display:none}input,select,button{font:inherit;color:var(--tc-text)}.tc-input,.tc-select,.tc-btn{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:7px 10px;color:var(--tc-text)}.tc-btn{cursor:pointer}.tc-btn:hover:not(:disabled){border-color:var(--tc-accent-purple)}.tc-btn.primary{background:var(--tc-accent-purple);border-color:var(--tc-accent-purple);color:#1c1e2b;font-weight:600}.tc-btn:disabled{opacity:.45;cursor:default}.tc-statusbar{display:flex;align-items:center;gap:16px;padding:7px 18px;border-top:1px solid var(--tc-border);background:var(--tc-surface);color:var(--tc-text-muted);font-size:12px}.tc-statusbar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}.tc-statusbar .ok{background:var(--tc-accent-green)}.tc-statusbar .bad{background:var(--tc-danger)}.tc-statusbar .right{margin-left:auto}.tc-page{max-width:1200px}.tc-card{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:18px}.tc-placeholder{color:var(--tc-text-muted)}.tc-placeholder h2{color:var(--tc-text);margin:0 0 6px}.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;border:1px solid var(--tc-border)}.badge.music{color:var(--tc-accent-cyan);border-color:color-mix(in srgb,var(--tc-accent-cyan) 50%,transparent)}.badge.game{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 50%,transparent)}.badge.video{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-error{border-color:color-mix(in srgb,var(--tc-danger) 60%,transparent);color:var(--tc-danger);margin-bottom:var(--tc-gap)}.tc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--tc-gap);margin-bottom:20px}.tc-stat{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:14px 16px}.tc-stat-val{font-size:26px;font-weight:700}.tc-stat-label{color:var(--tc-text-muted);font-size:12px;margin-top:2px}.tc-section{margin-bottom:22px}.tc-section h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-enum{color:var(--tc-accent-purple);font-weight:700}.tc-active{display:flex;flex-direction:column;gap:6px}.tc-active-row{display:grid;grid-template-columns:160px 1fr auto;gap:12px;align-items:center;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:8px;padding:8px 12px}.tc-active-name{color:var(--tc-text-muted)}.tc-active-key{font-weight:500}.tc-watchers{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--tc-gap)}.tc-watcher{display:flex;gap:12px;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:12px 14px}.tc-art{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}.tc-art-fallback{display:flex;align-items:center;justify-content:center;background:var(--tc-surface-raised);color:var(--tc-text-muted);font-size:20px}.tc-w-main{min-width:0;flex:1}.tc-w-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tc-w-name{font-weight:600}.tc-w-cur{margin-top:6px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tc-w-cur.muted{color:var(--tc-text-muted)}.tc-w-meta{margin-top:6px;display:flex;gap:12px;flex-wrap:wrap;color:var(--tc-text-muted);font-size:12px}.badge.ok{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 45%,transparent)}.badge.off{color:var(--tc-text-muted)}.tc-syshint{color:var(--tc-text-muted);font-size:12px;margin-top:8px}.tc-inbox{display:grid;grid-template-columns:1fr 340px;gap:var(--tc-gap);height:100%;min-height:0}.tc-inbox-main{min-width:0;display:flex;flex-direction:column;min-height:0}.tc-filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tc-check{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--tc-text-muted)}.tc-filters-info{color:var(--tc-text-muted);font-size:12px;margin-left:auto}.tc-table-wrap{flex:1;min-height:0;overflow:auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius)}.tc-table{width:100%;border-collapse:collapse;font-size:13px}.tc-table th,.tc-table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--tc-border);white-space:nowrap}.tc-table thead th{position:sticky;top:0;background:var(--tc-surface);color:var(--tc-text-muted);font-weight:600;z-index:1}.tc-table tbody tr{cursor:pointer}.tc-table tbody tr:hover{background:var(--tc-surface-raised)}.tc-table tbody tr.focused{background:color-mix(in srgb,var(--tc-accent-purple) 18%,transparent)}.tc-table tbody tr.dirty td{border-bottom-color:color-mix(in srgb,var(--tc-accent-orange) 40%,transparent)}.tc-key{font-weight:500;max-width:320px;overflow:hidden;text-overflow:ellipsis}.tc-muted{color:var(--tc-text-muted)}.tc-enum-select.dirty{border-color:var(--tc-accent-orange);color:var(--tc-accent-orange)}.badge.dirtybadge{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-row-actions{display:inline-flex;gap:4px}.tc-mini{padding:3px 8px}.tc-tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}.tc-tab{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:6px 14px;color:var(--tc-text);cursor:pointer}.tc-tab:hover{border-color:var(--tc-accent-purple)}.tc-tab.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-table tbody tr.is-child td{background:color-mix(in srgb,var(--tc-accent-purple) 6%,transparent)}.badge.var{color:var(--tc-accent-purple);border-color:color-mix(in srgb,var(--tc-accent-purple) 50%,transparent)}.media-type-music{--mt-accent: var(--tc-accent-cyan)}.media-type-game{--mt-accent: var(--tc-accent-green)}.media-type-video{--mt-accent: var(--tc-accent-orange)}.tc-watcher[class*=media-type-]{border-left:3px solid var(--mt-accent)}.tc-table tbody tr[class*=media-type-] td:first-child{box-shadow:inset 4px 0 0 var(--mt-accent)}.tc-table tbody tr[class*=media-type-]{background:color-mix(in srgb,var(--mt-accent) 6%,transparent)}.tc-detail{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:16px;overflow:auto;min-height:0}.tc-detail-title{margin:0 0 8px;font-size:15px;word-break:break-word}.tc-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tc-detail-grid{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 14px}.tc-detail-grid dt{color:var(--tc-text-muted);font-size:12px}.tc-detail-grid dd{margin:0}.tc-detail-error{color:var(--tc-danger);font-size:12px;margin-bottom:10px}.tc-detail-actions{display:flex;gap:8px}.tc-detail-art{width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px}.tc-detail-parent{font-size:12px;color:var(--tc-text-muted);background:var(--tc-surface-raised);border-radius:8px;padding:8px 10px;margin-bottom:12px}.tc-detail-section{margin-bottom:14px}.tc-detail-section h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-ctx-table{width:100%;border-collapse:collapse;font-size:12px}.tc-ctx-table th,.tc-ctx-table td{text-align:left;padding:4px 6px;border-bottom:1px solid var(--tc-border)}.tc-ctx-table th{color:var(--tc-text-muted);font-weight:600}.tc-variants{margin:0;padding-left:18px;font-size:13px}.tc-variants li{margin-bottom:3px}@media (max-width: 870px){.tc3{grid-template-columns:1fr}.tc-sidebar{display:none}.tc-menu-btn{display:inline-flex}.tc-inbox{grid-template-columns:1fr}}';
class Rp extends HTMLElement {
  constructor() {
    super(...arguments);
    El(this, "_root", null);
    El(this, "_hass", null);
  }
  connectedCallback() {
    if (this._root) return;
    const n = this.attachShadow({ mode: "open" }), r = document.createElement("style");
    r.textContent = Dp, n.appendChild(r);
    const l = document.createElement("div");
    l.style.height = "100%", n.appendChild(l), this._root = dc(l), this._render();
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null;
  }
  set hass(n) {
    this._hass = n, this._render();
  }
  get hass() {
    return this._hass;
  }
  _render() {
    this._root?.render(T.createElement(Lp, { hass: this._hass }));
  }
}
customElements.get("title-classifier-v3-app") || customElements.define("title-classifier-v3-app", Rp);
