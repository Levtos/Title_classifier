var mc = Object.defineProperty;
var hc = (e, t, n) => t in e ? mc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var _l = (e, t, n) => hc(e, typeof t != "symbol" ? t + "" : t, n);
var bu = { exports: {} }, D = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qn = Symbol.for("react.element"), vc = Symbol.for("react.portal"), gc = Symbol.for("react.fragment"), yc = Symbol.for("react.strict_mode"), xc = Symbol.for("react.profiler"), wc = Symbol.for("react.provider"), kc = Symbol.for("react.context"), Sc = Symbol.for("react.forward_ref"), Ec = Symbol.for("react.suspense"), _c = Symbol.for("react.memo"), Cc = Symbol.for("react.lazy"), Ao = Symbol.iterator;
function Nc(e) {
  return e === null || typeof e != "object" ? null : (e = Ao && e[Ao] || e["@@iterator"], typeof e == "function" ? e : null);
}
var es = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, ts = Object.assign, ns = {};
function fn(e, t, n) {
  this.props = e, this.context = t, this.refs = ns, this.updater = n || es;
}
fn.prototype.isReactComponent = {};
fn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
fn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function rs() {
}
rs.prototype = fn.prototype;
function Qi(e, t, n) {
  this.props = e, this.context = t, this.refs = ns, this.updater = n || es;
}
var Ki = Qi.prototype = new rs();
Ki.constructor = Qi;
ts(Ki, fn.prototype);
Ki.isPureReactComponent = !0;
var Vo = Array.isArray, ls = Object.prototype.hasOwnProperty, Yi = { current: null }, is = { key: !0, ref: !0, __self: !0, __source: !0 };
function os(e, t, n) {
  var r, l = {}, i = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (i = "" + t.key), t) ls.call(t, r) && !is.hasOwnProperty(r) && (l[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) l.children = n;
  else if (1 < u) {
    for (var s = Array(u), f = 0; f < u; f++) s[f] = arguments[f + 2];
    l.children = s;
  }
  if (e && e.defaultProps) for (r in u = e.defaultProps, u) l[r] === void 0 && (l[r] = u[r]);
  return { $$typeof: qn, type: e, key: i, ref: o, props: l, _owner: Yi.current };
}
function jc(e, t) {
  return { $$typeof: qn, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Xi(e) {
  return typeof e == "object" && e !== null && e.$$typeof === qn;
}
function zc(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Bo = /\/+/g;
function Cl(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? zc("" + e.key) : t.toString(36);
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
        case vc:
          o = !0;
      }
  }
  if (o) return o = e, l = l(o), e = r === "" ? "." + Cl(o, 0) : r, Vo(l) ? (n = "", e != null && (n = e.replace(Bo, "$&/") + "/"), _r(l, t, n, "", function(f) {
    return f;
  })) : l != null && (Xi(l) && (l = jc(l, n + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(Bo, "$&/") + "/") + e)), t.push(l)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", Vo(e)) for (var u = 0; u < e.length; u++) {
    i = e[u];
    var s = r + Cl(i, u);
    o += _r(i, t, n, s, l);
  }
  else if (s = Nc(e), typeof s == "function") for (e = s.call(e), u = 0; !(i = e.next()).done; ) i = i.value, s = r + Cl(i, u++), o += _r(i, t, n, s, l);
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
function Pc(e) {
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
var ce = { current: null }, Cr = { transition: null }, Tc = { ReactCurrentDispatcher: ce, ReactCurrentBatchConfig: Cr, ReactCurrentOwner: Yi };
function us() {
  throw Error("act(...) is not supported in production builds of React.");
}
D.Children = { map: ir, forEach: function(e, t, n) {
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
  if (!Xi(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
D.Component = fn;
D.Fragment = gc;
D.Profiler = xc;
D.PureComponent = Qi;
D.StrictMode = yc;
D.Suspense = Ec;
D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Tc;
D.act = us;
D.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = ts({}, e.props), l = e.key, i = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (i = t.ref, o = Yi.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
    for (s in t) ls.call(t, s) && !is.hasOwnProperty(s) && (r[s] = t[s] === void 0 && u !== void 0 ? u[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    u = Array(s);
    for (var f = 0; f < s; f++) u[f] = arguments[f + 2];
    r.children = u;
  }
  return { $$typeof: qn, type: e.type, key: l, ref: i, props: r, _owner: o };
};
D.createContext = function(e) {
  return e = { $$typeof: kc, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: wc, _context: e }, e.Consumer = e;
};
D.createElement = os;
D.createFactory = function(e) {
  var t = os.bind(null, e);
  return t.type = e, t;
};
D.createRef = function() {
  return { current: null };
};
D.forwardRef = function(e) {
  return { $$typeof: Sc, render: e };
};
D.isValidElement = Xi;
D.lazy = function(e) {
  return { $$typeof: Cc, _payload: { _status: -1, _result: e }, _init: Pc };
};
D.memo = function(e, t) {
  return { $$typeof: _c, type: e, compare: t === void 0 ? null : t };
};
D.startTransition = function(e) {
  var t = Cr.transition;
  Cr.transition = {};
  try {
    e();
  } finally {
    Cr.transition = t;
  }
};
D.unstable_act = us;
D.useCallback = function(e, t) {
  return ce.current.useCallback(e, t);
};
D.useContext = function(e) {
  return ce.current.useContext(e);
};
D.useDebugValue = function() {
};
D.useDeferredValue = function(e) {
  return ce.current.useDeferredValue(e);
};
D.useEffect = function(e, t) {
  return ce.current.useEffect(e, t);
};
D.useId = function() {
  return ce.current.useId();
};
D.useImperativeHandle = function(e, t, n) {
  return ce.current.useImperativeHandle(e, t, n);
};
D.useInsertionEffect = function(e, t) {
  return ce.current.useInsertionEffect(e, t);
};
D.useLayoutEffect = function(e, t) {
  return ce.current.useLayoutEffect(e, t);
};
D.useMemo = function(e, t) {
  return ce.current.useMemo(e, t);
};
D.useReducer = function(e, t, n) {
  return ce.current.useReducer(e, t, n);
};
D.useRef = function(e) {
  return ce.current.useRef(e);
};
D.useState = function(e) {
  return ce.current.useState(e);
};
D.useSyncExternalStore = function(e, t, n) {
  return ce.current.useSyncExternalStore(e, t, n);
};
D.useTransition = function() {
  return ce.current.useTransition();
};
D.version = "18.3.1";
bu.exports = D;
var L = bu.exports, ss = { exports: {} }, Se = {}, as = { exports: {} }, cs = {};
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
  function t(N, z) {
    var P = N.length;
    N.push(z);
    e: for (; 0 < P; ) {
      var Y = P - 1 >>> 1, q = N[Y];
      if (0 < l(q, z)) N[Y] = z, N[P] = q, P = Y;
      else break e;
    }
  }
  function n(N) {
    return N.length === 0 ? null : N[0];
  }
  function r(N) {
    if (N.length === 0) return null;
    var z = N[0], P = N.pop();
    if (P !== z) {
      N[0] = P;
      e: for (var Y = 0, q = N.length, rr = q >>> 1; Y < rr; ) {
        var St = 2 * (Y + 1) - 1, El = N[St], Et = St + 1, lr = N[Et];
        if (0 > l(El, P)) Et < q && 0 > l(lr, El) ? (N[Y] = lr, N[Et] = P, Y = Et) : (N[Y] = El, N[St] = P, Y = St);
        else if (Et < q && 0 > l(lr, P)) N[Y] = lr, N[Et] = P, Y = Et;
        else break e;
      }
    }
    return z;
  }
  function l(N, z) {
    var P = N.sortIndex - z.sortIndex;
    return P !== 0 ? P : N.id - z.id;
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
  var s = [], f = [], g = 1, v = null, h = 3, k = !1, w = !1, S = !1, O = typeof setTimeout == "function" ? setTimeout : null, d = typeof clearTimeout == "function" ? clearTimeout : null, a = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function p(N) {
    for (var z = n(f); z !== null; ) {
      if (z.callback === null) r(f);
      else if (z.startTime <= N) r(f), z.sortIndex = z.expirationTime, t(s, z);
      else break;
      z = n(f);
    }
  }
  function y(N) {
    if (S = !1, p(N), !w) if (n(s) !== null) w = !0, We(m);
    else {
      var z = n(f);
      z !== null && Qe(y, z.startTime - N);
    }
  }
  function m(N, z) {
    w = !1, S && (S = !1, d(j), j = -1), k = !0;
    var P = h;
    try {
      for (p(z), v = n(s); v !== null && (!(v.expirationTime > z) || N && !ge()); ) {
        var Y = v.callback;
        if (typeof Y == "function") {
          v.callback = null, h = v.priorityLevel;
          var q = Y(v.expirationTime <= z);
          z = e.unstable_now(), typeof q == "function" ? v.callback = q : v === n(s) && r(s), p(z);
        } else r(s);
        v = n(s);
      }
      if (v !== null) var rr = !0;
      else {
        var St = n(f);
        St !== null && Qe(y, St.startTime - z), rr = !1;
      }
      return rr;
    } finally {
      v = null, h = P, k = !1;
    }
  }
  var E = !1, C = null, j = -1, U = 5, T = -1;
  function ge() {
    return !(e.unstable_now() - T < U);
  }
  function I() {
    if (C !== null) {
      var N = e.unstable_now();
      T = N;
      var z = !0;
      try {
        z = C(!0, N);
      } finally {
        z ? B() : (E = !1, C = null);
      }
    } else E = !1;
  }
  var B;
  if (typeof a == "function") B = function() {
    a(I);
  };
  else if (typeof MessageChannel < "u") {
    var _e = new MessageChannel(), Ue = _e.port2;
    _e.port1.onmessage = I, B = function() {
      Ue.postMessage(null);
    };
  } else B = function() {
    O(I, 0);
  };
  function We(N) {
    C = N, E || (E = !0, B());
  }
  function Qe(N, z) {
    j = O(function() {
      N(e.unstable_now());
    }, z);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(N) {
    N.callback = null;
  }, e.unstable_continueExecution = function() {
    w || k || (w = !0, We(m));
  }, e.unstable_forceFrameRate = function(N) {
    0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : U = 0 < N ? Math.floor(1e3 / N) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return h;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(s);
  }, e.unstable_next = function(N) {
    switch (h) {
      case 1:
      case 2:
      case 3:
        var z = 3;
        break;
      default:
        z = h;
    }
    var P = h;
    h = z;
    try {
      return N();
    } finally {
      h = P;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(N, z) {
    switch (N) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        N = 3;
    }
    var P = h;
    h = N;
    try {
      return z();
    } finally {
      h = P;
    }
  }, e.unstable_scheduleCallback = function(N, z, P) {
    var Y = e.unstable_now();
    switch (typeof P == "object" && P !== null ? (P = P.delay, P = typeof P == "number" && 0 < P ? Y + P : Y) : P = Y, N) {
      case 1:
        var q = -1;
        break;
      case 2:
        q = 250;
        break;
      case 5:
        q = 1073741823;
        break;
      case 4:
        q = 1e4;
        break;
      default:
        q = 5e3;
    }
    return q = P + q, N = { id: g++, callback: z, priorityLevel: N, startTime: P, expirationTime: q, sortIndex: -1 }, P > Y ? (N.sortIndex = P, t(f, N), n(s) === null && N === n(f) && (S ? (d(j), j = -1) : S = !0, Qe(y, P - Y))) : (N.sortIndex = q, t(s, N), w || k || (w = !0, We(m))), N;
  }, e.unstable_shouldYield = ge, e.unstable_wrapCallback = function(N) {
    var z = h;
    return function() {
      var P = h;
      h = z;
      try {
        return N.apply(this, arguments);
      } finally {
        h = P;
      }
    };
  };
})(cs);
as.exports = cs;
var Lc = as.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dc = L, ke = Lc;
function x(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var fs = /* @__PURE__ */ new Set(), Mn = {};
function It(e, t) {
  rn(e, t), rn(e + "Capture", t);
}
function rn(e, t) {
  for (Mn[e] = t, e = 0; e < t.length; e++) fs.add(t[e]);
}
var Je = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ql = Object.prototype.hasOwnProperty, Rc = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ho = {}, Wo = {};
function Oc(e) {
  return ql.call(Wo, e) ? !0 : ql.call(Ho, e) ? !1 : Rc.test(e) ? Wo[e] = !0 : (Ho[e] = !0, !1);
}
function Mc(e, t, n, r) {
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
function Ic(e, t, n, r) {
  if (t === null || typeof t > "u" || Mc(e, t, n, r)) return !0;
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
var re = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  re[e] = new fe(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  re[t] = new fe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  re[e] = new fe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  re[e] = new fe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  re[e] = new fe(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  re[e] = new fe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  re[e] = new fe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  re[e] = new fe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  re[e] = new fe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Gi = /[\-:]([a-z])/g;
function Zi(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Gi,
    Zi
  );
  re[t] = new fe(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Gi, Zi);
  re[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Gi, Zi);
  re[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  re[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
re.xlinkHref = new fe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  re[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Ji(e, t, n, r) {
  var l = re.hasOwnProperty(t) ? re[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Ic(t, n, l, r) && (n = null), r || l === null ? Oc(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var tt = Dc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, or = Symbol.for("react.element"), $t = Symbol.for("react.portal"), At = Symbol.for("react.fragment"), qi = Symbol.for("react.strict_mode"), bl = Symbol.for("react.profiler"), ds = Symbol.for("react.provider"), ps = Symbol.for("react.context"), bi = Symbol.for("react.forward_ref"), ei = Symbol.for("react.suspense"), ti = Symbol.for("react.suspense_list"), eo = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), ms = Symbol.for("react.offscreen"), Qo = Symbol.iterator;
function mn(e) {
  return e === null || typeof e != "object" ? null : (e = Qo && e[Qo] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Q = Object.assign, Nl;
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
var jl = !1;
function zl(e, t) {
  if (!e || jl) return "";
  jl = !0;
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
      } catch (f) {
        var r = f;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (f) {
        r = f;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (f) {
        r = f;
      }
      e();
    }
  } catch (f) {
    if (f && r && typeof f.stack == "string") {
      for (var l = f.stack.split(`
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
    jl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Sn(e) : "";
}
function Fc(e) {
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
      return e = zl(e.type, !1), e;
    case 11:
      return e = zl(e.type.render, !1), e;
    case 1:
      return e = zl(e.type, !0), e;
    default:
      return "";
  }
}
function ni(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case At:
      return "Fragment";
    case $t:
      return "Portal";
    case bl:
      return "Profiler";
    case qi:
      return "StrictMode";
    case ei:
      return "Suspense";
    case ti:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case ps:
      return (e.displayName || "Context") + ".Consumer";
    case ds:
      return (e._context.displayName || "Context") + ".Provider";
    case bi:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case eo:
      return t = e.displayName || null, t !== null ? t : ni(e.type) || "Memo";
    case rt:
      t = e._payload, e = e._init;
      try {
        return ni(e(t));
      } catch {
      }
  }
  return null;
}
function Uc(e) {
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
      return ni(t);
    case 8:
      return t === qi ? "StrictMode" : "Mode";
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
function hs(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function $c(e) {
  var t = hs(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  e._valueTracker || (e._valueTracker = $c(e));
}
function vs(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = hs(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Ir(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function ri(e, t) {
  var n = t.checked;
  return Q({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Ko(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = gt(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function gs(e, t) {
  t = t.checked, t != null && Ji(e, "checked", t, !1);
}
function li(e, t) {
  gs(e, t);
  var n = gt(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? ii(e, t.type, n) : t.hasOwnProperty("defaultValue") && ii(e, t.type, gt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Yo(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function ii(e, t, n) {
  (t !== "number" || Ir(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
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
function oi(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(x(91));
  return Q({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Xo(e, t) {
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
function ys(e, t) {
  var n = gt(t.value), r = gt(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function Go(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function xs(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function ui(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? xs(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var sr, ws = function(e) {
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
function In(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Nn = {
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
}, Ac = ["Webkit", "ms", "Moz", "O"];
Object.keys(Nn).forEach(function(e) {
  Ac.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Nn[t] = Nn[e];
  });
});
function ks(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Nn.hasOwnProperty(e) && Nn[e] ? ("" + t).trim() : t + "px";
}
function Ss(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = ks(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var Vc = Q({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function si(e, t) {
  if (t) {
    if (Vc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(x(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(x(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(x(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(x(62));
  }
}
function ai(e, t) {
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
var ci = null;
function to(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var fi = null, qt = null, bt = null;
function Zo(e) {
  if (e = tr(e)) {
    if (typeof fi != "function") throw Error(x(280));
    var t = e.stateNode;
    t && (t = cl(t), fi(e.stateNode, e.type, t));
  }
}
function Es(e) {
  qt ? bt ? bt.push(e) : bt = [e] : qt = e;
}
function _s() {
  if (qt) {
    var e = qt, t = bt;
    if (bt = qt = null, Zo(e), t) for (e = 0; e < t.length; e++) Zo(t[e]);
  }
}
function Cs(e, t) {
  return e(t);
}
function Ns() {
}
var Pl = !1;
function js(e, t, n) {
  if (Pl) return e(t, n);
  Pl = !0;
  try {
    return Cs(e, t, n);
  } finally {
    Pl = !1, (qt !== null || bt !== null) && (Ns(), _s());
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
function Bc(e, t, n, r, l, i, o, u, s) {
  var f = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, f);
  } catch (g) {
    this.onError(g);
  }
}
var jn = !1, Fr = null, Ur = !1, pi = null, Hc = { onError: function(e) {
  jn = !0, Fr = e;
} };
function Wc(e, t, n, r, l, i, o, u, s) {
  jn = !1, Fr = null, Bc.apply(Hc, arguments);
}
function Qc(e, t, n, r, l, i, o, u, s) {
  if (Wc.apply(this, arguments), jn) {
    if (jn) {
      var f = Fr;
      jn = !1, Fr = null;
    } else throw Error(x(198));
    Ur || (Ur = !0, pi = f);
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
function zs(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Jo(e) {
  if (Ft(e) !== e) throw Error(x(188));
}
function Kc(e) {
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
        if (i === n) return Jo(l), e;
        if (i === r) return Jo(l), t;
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
function Ps(e) {
  return e = Kc(e), e !== null ? Ts(e) : null;
}
function Ts(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Ts(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Ls = ke.unstable_scheduleCallback, qo = ke.unstable_cancelCallback, Yc = ke.unstable_shouldYield, Xc = ke.unstable_requestPaint, X = ke.unstable_now, Gc = ke.unstable_getCurrentPriorityLevel, no = ke.unstable_ImmediatePriority, Ds = ke.unstable_UserBlockingPriority, $r = ke.unstable_NormalPriority, Zc = ke.unstable_LowPriority, Rs = ke.unstable_IdlePriority, ol = null, Be = null;
function Jc(e) {
  if (Be && typeof Be.onCommitFiberRoot == "function") try {
    Be.onCommitFiberRoot(ol, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Me = Math.clz32 ? Math.clz32 : ef, qc = Math.log, bc = Math.LN2;
function ef(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (qc(e) / bc | 0) | 0;
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
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Me(t), l = 1 << n, r |= e[n], t &= ~l;
  return r;
}
function tf(e, t) {
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
function nf(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
    var o = 31 - Me(i), u = 1 << o, s = l[o];
    s === -1 ? (!(u & n) || u & r) && (l[o] = tf(u, t)) : s <= t && (e.expiredLanes |= u), i &= ~u;
  }
}
function mi(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Os() {
  var e = ar;
  return ar <<= 1, !(ar & 4194240) && (ar = 64), e;
}
function Tl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function bn(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Me(t), e[t] = n;
}
function rf(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Me(n), i = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
  }
}
function ro(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Me(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var M = 0;
function Ms(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Is, lo, Fs, Us, $s, hi = !1, fr = [], at = null, ct = null, ft = null, Un = /* @__PURE__ */ new Map(), $n = /* @__PURE__ */ new Map(), it = [], lf = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function bo(e, t) {
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
      ft = null;
      break;
    case "pointerover":
    case "pointerout":
      Un.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      $n.delete(t.pointerId);
  }
}
function vn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = tr(t), t !== null && lo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function of(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return at = vn(at, e, t, n, r, l), !0;
    case "dragenter":
      return ct = vn(ct, e, t, n, r, l), !0;
    case "mouseover":
      return ft = vn(ft, e, t, n, r, l), !0;
    case "pointerover":
      var i = l.pointerId;
      return Un.set(i, vn(Un.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return i = l.pointerId, $n.set(i, vn($n.get(i) || null, e, t, n, r, l)), !0;
  }
  return !1;
}
function As(e) {
  var t = Nt(e.target);
  if (t !== null) {
    var n = Ft(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = zs(n), t !== null) {
          e.blockedOn = t, $s(e.priority, function() {
            Fs(n);
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
function Nr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = vi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ci = r, n.target.dispatchEvent(r), ci = null;
    } else return t = tr(n), t !== null && lo(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function eu(e, t, n) {
  Nr(e) && n.delete(t);
}
function uf() {
  hi = !1, at !== null && Nr(at) && (at = null), ct !== null && Nr(ct) && (ct = null), ft !== null && Nr(ft) && (ft = null), Un.forEach(eu), $n.forEach(eu);
}
function gn(e, t) {
  e.blockedOn === t && (e.blockedOn = null, hi || (hi = !0, ke.unstable_scheduleCallback(ke.unstable_NormalPriority, uf)));
}
function An(e) {
  function t(l) {
    return gn(l, e);
  }
  if (0 < fr.length) {
    gn(fr[0], e);
    for (var n = 1; n < fr.length; n++) {
      var r = fr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (at !== null && gn(at, e), ct !== null && gn(ct, e), ft !== null && gn(ft, e), Un.forEach(t), $n.forEach(t), n = 0; n < it.length; n++) r = it[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < it.length && (n = it[0], n.blockedOn === null); ) As(n), n.blockedOn === null && it.shift();
}
var en = tt.ReactCurrentBatchConfig, Vr = !0;
function sf(e, t, n, r) {
  var l = M, i = en.transition;
  en.transition = null;
  try {
    M = 1, io(e, t, n, r);
  } finally {
    M = l, en.transition = i;
  }
}
function af(e, t, n, r) {
  var l = M, i = en.transition;
  en.transition = null;
  try {
    M = 4, io(e, t, n, r);
  } finally {
    M = l, en.transition = i;
  }
}
function io(e, t, n, r) {
  if (Vr) {
    var l = vi(e, t, n, r);
    if (l === null) Al(e, t, r, Br, n), bo(e, r);
    else if (of(l, e, t, n, r)) r.stopPropagation();
    else if (bo(e, r), t & 4 && -1 < lf.indexOf(e)) {
      for (; l !== null; ) {
        var i = tr(l);
        if (i !== null && Is(i), i = vi(e, t, n, r), i === null && Al(e, t, r, Br, n), i === l) break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else Al(e, t, r, null, n);
  }
}
var Br = null;
function vi(e, t, n, r) {
  if (Br = null, e = to(r), e = Nt(e), e !== null) if (t = Ft(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = zs(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Br = e, null;
}
function Vs(e) {
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
      switch (Gc()) {
        case no:
          return 1;
        case Ds:
          return 4;
        case $r:
        case Zc:
          return 16;
        case Rs:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var ut = null, oo = null, jr = null;
function Bs() {
  if (jr) return jr;
  var e, t = oo, n = t.length, r, l = "value" in ut ? ut.value : ut.textContent, i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
  return jr = l.slice(e, 1 < r ? 1 - r : void 0);
}
function zr(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function dr() {
  return !0;
}
function tu() {
  return !1;
}
function Ee(e) {
  function t(n, r, l, i, o) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? dr : tu, this.isPropagationStopped = tu, this;
  }
  return Q(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = dr);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = dr);
  }, persist: function() {
  }, isPersistent: dr }), t;
}
var dn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, uo = Ee(dn), er = Q({}, dn, { view: 0, detail: 0 }), cf = Ee(er), Ll, Dl, yn, ul = Q({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: so, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== yn && (yn && e.type === "mousemove" ? (Ll = e.screenX - yn.screenX, Dl = e.screenY - yn.screenY) : Dl = Ll = 0, yn = e), Ll);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : Dl;
} }), nu = Ee(ul), ff = Q({}, ul, { dataTransfer: 0 }), df = Ee(ff), pf = Q({}, er, { relatedTarget: 0 }), Rl = Ee(pf), mf = Q({}, dn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), hf = Ee(mf), vf = Q({}, dn, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), gf = Ee(vf), yf = Q({}, dn, { data: 0 }), ru = Ee(yf), xf = {
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
}, wf = {
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
}, kf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Sf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = kf[e]) ? !!t[e] : !1;
}
function so() {
  return Sf;
}
var Ef = Q({}, er, { key: function(e) {
  if (e.key) {
    var t = xf[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = zr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wf[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: so, charCode: function(e) {
  return e.type === "keypress" ? zr(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? zr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), _f = Ee(Ef), Cf = Q({}, ul, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), lu = Ee(Cf), Nf = Q({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: so }), jf = Ee(Nf), zf = Q({}, dn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Pf = Ee(zf), Tf = Q({}, ul, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Lf = Ee(Tf), Df = [9, 13, 27, 32], ao = Je && "CompositionEvent" in window, zn = null;
Je && "documentMode" in document && (zn = document.documentMode);
var Rf = Je && "TextEvent" in window && !zn, Hs = Je && (!ao || zn && 8 < zn && 11 >= zn), iu = " ", ou = !1;
function Ws(e, t) {
  switch (e) {
    case "keyup":
      return Df.indexOf(t.keyCode) !== -1;
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
function Qs(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Vt = !1;
function Of(e, t) {
  switch (e) {
    case "compositionend":
      return Qs(t);
    case "keypress":
      return t.which !== 32 ? null : (ou = !0, iu);
    case "textInput":
      return e = t.data, e === iu && ou ? null : e;
    default:
      return null;
  }
}
function Mf(e, t) {
  if (Vt) return e === "compositionend" || !ao && Ws(e, t) ? (e = Bs(), jr = oo = ut = null, Vt = !1, e) : null;
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
      return Hs && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var If = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function uu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!If[e.type] : t === "textarea";
}
function Ks(e, t, n, r) {
  Es(r), t = Hr(t, "onChange"), 0 < t.length && (n = new uo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Pn = null, Vn = null;
function Ff(e) {
  ra(e, 0);
}
function sl(e) {
  var t = Wt(e);
  if (vs(t)) return e;
}
function Uf(e, t) {
  if (e === "change") return t;
}
var Ys = !1;
if (Je) {
  var Ol;
  if (Je) {
    var Ml = "oninput" in document;
    if (!Ml) {
      var su = document.createElement("div");
      su.setAttribute("oninput", "return;"), Ml = typeof su.oninput == "function";
    }
    Ol = Ml;
  } else Ol = !1;
  Ys = Ol && (!document.documentMode || 9 < document.documentMode);
}
function au() {
  Pn && (Pn.detachEvent("onpropertychange", Xs), Vn = Pn = null);
}
function Xs(e) {
  if (e.propertyName === "value" && sl(Vn)) {
    var t = [];
    Ks(t, Vn, e, to(e)), js(Ff, t);
  }
}
function $f(e, t, n) {
  e === "focusin" ? (au(), Pn = t, Vn = n, Pn.attachEvent("onpropertychange", Xs)) : e === "focusout" && au();
}
function Af(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return sl(Vn);
}
function Vf(e, t) {
  if (e === "click") return sl(t);
}
function Bf(e, t) {
  if (e === "input" || e === "change") return sl(t);
}
function Hf(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Fe = typeof Object.is == "function" ? Object.is : Hf;
function Bn(e, t) {
  if (Fe(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!ql.call(t, l) || !Fe(e[l], t[l])) return !1;
  }
  return !0;
}
function cu(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function fu(e, t) {
  var n = cu(e);
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
    n = cu(n);
  }
}
function Gs(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Gs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function Zs() {
  for (var e = window, t = Ir(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Ir(e.document);
  }
  return t;
}
function co(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Wf(e) {
  var t = Zs(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Gs(n.ownerDocument.documentElement, n)) {
    if (r !== null && co(n)) {
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
var Qf = Je && "documentMode" in document && 11 >= document.documentMode, Bt = null, gi = null, Tn = null, yi = !1;
function du(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  yi || Bt == null || Bt !== Ir(r) || (r = Bt, "selectionStart" in r && co(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Tn && Bn(Tn, r) || (Tn = r, r = Hr(gi, "onSelect"), 0 < r.length && (t = new uo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Bt)));
}
function pr(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Ht = { animationend: pr("Animation", "AnimationEnd"), animationiteration: pr("Animation", "AnimationIteration"), animationstart: pr("Animation", "AnimationStart"), transitionend: pr("Transition", "TransitionEnd") }, Il = {}, Js = {};
Je && (Js = document.createElement("div").style, "AnimationEvent" in window || (delete Ht.animationend.animation, delete Ht.animationiteration.animation, delete Ht.animationstart.animation), "TransitionEvent" in window || delete Ht.transitionend.transition);
function al(e) {
  if (Il[e]) return Il[e];
  if (!Ht[e]) return e;
  var t = Ht[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in Js) return Il[e] = t[n];
  return e;
}
var qs = al("animationend"), bs = al("animationiteration"), ea = al("animationstart"), ta = al("transitionend"), na = /* @__PURE__ */ new Map(), pu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function xt(e, t) {
  na.set(e, t), It(t, [e]);
}
for (var Fl = 0; Fl < pu.length; Fl++) {
  var Ul = pu[Fl], Kf = Ul.toLowerCase(), Yf = Ul[0].toUpperCase() + Ul.slice(1);
  xt(Kf, "on" + Yf);
}
xt(qs, "onAnimationEnd");
xt(bs, "onAnimationIteration");
xt(ea, "onAnimationStart");
xt("dblclick", "onDoubleClick");
xt("focusin", "onFocus");
xt("focusout", "onBlur");
xt(ta, "onTransitionEnd");
rn("onMouseEnter", ["mouseout", "mouseover"]);
rn("onMouseLeave", ["mouseout", "mouseover"]);
rn("onPointerEnter", ["pointerout", "pointerover"]);
rn("onPointerLeave", ["pointerout", "pointerover"]);
It("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
It("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
It("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
It("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
It("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
It("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Cn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Xf = new Set("cancel close invalid load scroll toggle".split(" ").concat(Cn));
function mu(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, Qc(r, t, void 0, e), e.currentTarget = null;
}
function ra(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var u = r[o], s = u.instance, f = u.currentTarget;
        if (u = u.listener, s !== i && l.isPropagationStopped()) break e;
        mu(l, u, f), i = s;
      }
      else for (o = 0; o < r.length; o++) {
        if (u = r[o], s = u.instance, f = u.currentTarget, u = u.listener, s !== i && l.isPropagationStopped()) break e;
        mu(l, u, f), i = s;
      }
    }
  }
  if (Ur) throw e = pi, Ur = !1, pi = null, e;
}
function $(e, t) {
  var n = t[Ei];
  n === void 0 && (n = t[Ei] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (la(t, e, 2, !1), n.add(r));
}
function $l(e, t, n) {
  var r = 0;
  t && (r |= 4), la(n, e, r, t);
}
var mr = "_reactListening" + Math.random().toString(36).slice(2);
function Hn(e) {
  if (!e[mr]) {
    e[mr] = !0, fs.forEach(function(n) {
      n !== "selectionchange" && (Xf.has(n) || $l(n, !1, e), $l(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[mr] || (t[mr] = !0, $l("selectionchange", !1, t));
  }
}
function la(e, t, n, r) {
  switch (Vs(t)) {
    case 1:
      var l = sf;
      break;
    case 4:
      l = af;
      break;
    default:
      l = io;
  }
  n = l.bind(null, t, n, e), l = void 0, !di || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
}
function Al(e, t, n, r, l) {
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
        if (o = Nt(u), o === null) return;
        if (s = o.tag, s === 5 || s === 6) {
          r = i = o;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  js(function() {
    var f = i, g = to(n), v = [];
    e: {
      var h = na.get(e);
      if (h !== void 0) {
        var k = uo, w = e;
        switch (e) {
          case "keypress":
            if (zr(n) === 0) break e;
          case "keydown":
          case "keyup":
            k = _f;
            break;
          case "focusin":
            w = "focus", k = Rl;
            break;
          case "focusout":
            w = "blur", k = Rl;
            break;
          case "beforeblur":
          case "afterblur":
            k = Rl;
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
            k = nu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k = df;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k = jf;
            break;
          case qs:
          case bs:
          case ea:
            k = hf;
            break;
          case ta:
            k = Pf;
            break;
          case "scroll":
            k = cf;
            break;
          case "wheel":
            k = Lf;
            break;
          case "copy":
          case "cut":
          case "paste":
            k = gf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k = lu;
        }
        var S = (t & 4) !== 0, O = !S && e === "scroll", d = S ? h !== null ? h + "Capture" : null : h;
        S = [];
        for (var a = f, p; a !== null; ) {
          p = a;
          var y = p.stateNode;
          if (p.tag === 5 && y !== null && (p = y, d !== null && (y = Fn(a, d), y != null && S.push(Wn(a, y, p)))), O) break;
          a = a.return;
        }
        0 < S.length && (h = new k(h, w, null, n, g), v.push({ event: h, listeners: S }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (h = e === "mouseover" || e === "pointerover", k = e === "mouseout" || e === "pointerout", h && n !== ci && (w = n.relatedTarget || n.fromElement) && (Nt(w) || w[qe])) break e;
        if ((k || h) && (h = g.window === g ? g : (h = g.ownerDocument) ? h.defaultView || h.parentWindow : window, k ? (w = n.relatedTarget || n.toElement, k = f, w = w ? Nt(w) : null, w !== null && (O = Ft(w), w !== O || w.tag !== 5 && w.tag !== 6) && (w = null)) : (k = null, w = f), k !== w)) {
          if (S = nu, y = "onMouseLeave", d = "onMouseEnter", a = "mouse", (e === "pointerout" || e === "pointerover") && (S = lu, y = "onPointerLeave", d = "onPointerEnter", a = "pointer"), O = k == null ? h : Wt(k), p = w == null ? h : Wt(w), h = new S(y, a + "leave", k, n, g), h.target = O, h.relatedTarget = p, y = null, Nt(g) === f && (S = new S(d, a + "enter", w, n, g), S.target = p, S.relatedTarget = O, y = S), O = y, k && w) t: {
            for (S = k, d = w, a = 0, p = S; p; p = Ut(p)) a++;
            for (p = 0, y = d; y; y = Ut(y)) p++;
            for (; 0 < a - p; ) S = Ut(S), a--;
            for (; 0 < p - a; ) d = Ut(d), p--;
            for (; a--; ) {
              if (S === d || d !== null && S === d.alternate) break t;
              S = Ut(S), d = Ut(d);
            }
            S = null;
          }
          else S = null;
          k !== null && hu(v, h, k, S, !1), w !== null && O !== null && hu(v, O, w, S, !0);
        }
      }
      e: {
        if (h = f ? Wt(f) : window, k = h.nodeName && h.nodeName.toLowerCase(), k === "select" || k === "input" && h.type === "file") var m = Uf;
        else if (uu(h)) if (Ys) m = Bf;
        else {
          m = Af;
          var E = $f;
        }
        else (k = h.nodeName) && k.toLowerCase() === "input" && (h.type === "checkbox" || h.type === "radio") && (m = Vf);
        if (m && (m = m(e, f))) {
          Ks(v, m, n, g);
          break e;
        }
        E && E(e, h, f), e === "focusout" && (E = h._wrapperState) && E.controlled && h.type === "number" && ii(h, "number", h.value);
      }
      switch (E = f ? Wt(f) : window, e) {
        case "focusin":
          (uu(E) || E.contentEditable === "true") && (Bt = E, gi = f, Tn = null);
          break;
        case "focusout":
          Tn = gi = Bt = null;
          break;
        case "mousedown":
          yi = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          yi = !1, du(v, n, g);
          break;
        case "selectionchange":
          if (Qf) break;
        case "keydown":
        case "keyup":
          du(v, n, g);
      }
      var C;
      if (ao) e: {
        switch (e) {
          case "compositionstart":
            var j = "onCompositionStart";
            break e;
          case "compositionend":
            j = "onCompositionEnd";
            break e;
          case "compositionupdate":
            j = "onCompositionUpdate";
            break e;
        }
        j = void 0;
      }
      else Vt ? Ws(e, n) && (j = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (j = "onCompositionStart");
      j && (Hs && n.locale !== "ko" && (Vt || j !== "onCompositionStart" ? j === "onCompositionEnd" && Vt && (C = Bs()) : (ut = g, oo = "value" in ut ? ut.value : ut.textContent, Vt = !0)), E = Hr(f, j), 0 < E.length && (j = new ru(j, e, null, n, g), v.push({ event: j, listeners: E }), C ? j.data = C : (C = Qs(n), C !== null && (j.data = C)))), (C = Rf ? Of(e, n) : Mf(e, n)) && (f = Hr(f, "onBeforeInput"), 0 < f.length && (g = new ru("onBeforeInput", "beforeinput", null, n, g), v.push({ event: g, listeners: f }), g.data = C));
    }
    ra(v, t);
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
function Ut(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function hu(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n, s = u.alternate, f = u.stateNode;
    if (s !== null && s === r) break;
    u.tag === 5 && f !== null && (u = f, l ? (s = Fn(n, i), s != null && o.unshift(Wn(n, s, u))) : l || (s = Fn(n, i), s != null && o.push(Wn(n, s, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Gf = /\r\n?/g, Zf = /\u0000|\uFFFD/g;
function vu(e) {
  return (typeof e == "string" ? e : "" + e).replace(Gf, `
`).replace(Zf, "");
}
function hr(e, t, n) {
  if (t = vu(t), vu(e) !== t && n) throw Error(x(425));
}
function Wr() {
}
var xi = null, wi = null;
function ki(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var Si = typeof setTimeout == "function" ? setTimeout : void 0, Jf = typeof clearTimeout == "function" ? clearTimeout : void 0, gu = typeof Promise == "function" ? Promise : void 0, qf = typeof queueMicrotask == "function" ? queueMicrotask : typeof gu < "u" ? function(e) {
  return gu.resolve(null).then(e).catch(bf);
} : Si;
function bf(e) {
  setTimeout(function() {
    throw e;
  });
}
function Vl(e, t) {
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
function dt(e) {
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
function yu(e) {
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
var pn = Math.random().toString(36).slice(2), Ve = "__reactFiber$" + pn, Qn = "__reactProps$" + pn, qe = "__reactContainer$" + pn, Ei = "__reactEvents$" + pn, ed = "__reactListeners$" + pn, td = "__reactHandles$" + pn;
function Nt(e) {
  var t = e[Ve];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[qe] || n[Ve]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = yu(e); e !== null; ) {
        if (n = e[Ve]) return n;
        e = yu(e);
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
var _i = [], Qt = -1;
function wt(e) {
  return { current: e };
}
function A(e) {
  0 > Qt || (e.current = _i[Qt], _i[Qt] = null, Qt--);
}
function F(e, t) {
  Qt++, _i[Qt] = e.current, e.current = t;
}
var yt = {}, ue = wt(yt), me = wt(!1), Lt = yt;
function ln(e, t) {
  var n = e.type.contextTypes;
  if (!n) return yt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, i;
  for (i in n) l[i] = t[i];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function he(e) {
  return e = e.childContextTypes, e != null;
}
function Qr() {
  A(me), A(ue);
}
function xu(e, t, n) {
  if (ue.current !== yt) throw Error(x(168));
  F(ue, t), F(me, n);
}
function ia(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(x(108, Uc(e) || "Unknown", l));
  return Q({}, n, r);
}
function Kr(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || yt, Lt = ue.current, F(ue, e), F(me, me.current), !0;
}
function wu(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(x(169));
  n ? (e = ia(e, t, Lt), r.__reactInternalMemoizedMergedChildContext = e, A(me), A(ue), F(ue, e)) : A(me), F(me, n);
}
var Ye = null, fl = !1, Bl = !1;
function oa(e) {
  Ye === null ? Ye = [e] : Ye.push(e);
}
function nd(e) {
  fl = !0, oa(e);
}
function kt() {
  if (!Bl && Ye !== null) {
    Bl = !0;
    var e = 0, t = M;
    try {
      var n = Ye;
      for (M = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Ye = null, fl = !1;
    } catch (l) {
      throw Ye !== null && (Ye = Ye.slice(e + 1)), Ls(no, kt), l;
    } finally {
      M = t, Bl = !1;
    }
  }
  return null;
}
var Kt = [], Yt = 0, Yr = null, Xr = 0, Ce = [], Ne = 0, Dt = null, Xe = 1, Ge = "";
function _t(e, t) {
  Kt[Yt++] = Xr, Kt[Yt++] = Yr, Yr = e, Xr = t;
}
function ua(e, t, n) {
  Ce[Ne++] = Xe, Ce[Ne++] = Ge, Ce[Ne++] = Dt, Dt = e;
  var r = Xe;
  e = Ge;
  var l = 32 - Me(r) - 1;
  r &= ~(1 << l), n += 1;
  var i = 32 - Me(t) + l;
  if (30 < i) {
    var o = l - l % 5;
    i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, Xe = 1 << 32 - Me(t) + l | n << l | r, Ge = i + e;
  } else Xe = 1 << i | n << l | r, Ge = e;
}
function fo(e) {
  e.return !== null && (_t(e, 1), ua(e, 1, 0));
}
function po(e) {
  for (; e === Yr; ) Yr = Kt[--Yt], Kt[Yt] = null, Xr = Kt[--Yt], Kt[Yt] = null;
  for (; e === Dt; ) Dt = Ce[--Ne], Ce[Ne] = null, Ge = Ce[--Ne], Ce[Ne] = null, Xe = Ce[--Ne], Ce[Ne] = null;
}
var we = null, xe = null, V = !1, Oe = null;
function sa(e, t) {
  var n = je(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function ku(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, we = e, xe = dt(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, we = e, xe = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Dt !== null ? { id: Xe, overflow: Ge } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = je(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, we = e, xe = null, !0) : !1;
    default:
      return !1;
  }
}
function Ci(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ni(e) {
  if (V) {
    var t = xe;
    if (t) {
      var n = t;
      if (!ku(e, t)) {
        if (Ci(e)) throw Error(x(418));
        t = dt(n.nextSibling);
        var r = we;
        t && ku(e, t) ? sa(r, n) : (e.flags = e.flags & -4097 | 2, V = !1, we = e);
      }
    } else {
      if (Ci(e)) throw Error(x(418));
      e.flags = e.flags & -4097 | 2, V = !1, we = e;
    }
  }
}
function Su(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  we = e;
}
function vr(e) {
  if (e !== we) return !1;
  if (!V) return Su(e), V = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ki(e.type, e.memoizedProps)), t && (t = xe)) {
    if (Ci(e)) throw aa(), Error(x(418));
    for (; t; ) sa(e, t), t = dt(t.nextSibling);
  }
  if (Su(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(x(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              xe = dt(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      xe = null;
    }
  } else xe = we ? dt(e.stateNode.nextSibling) : null;
  return !0;
}
function aa() {
  for (var e = xe; e; ) e = dt(e.nextSibling);
}
function on() {
  xe = we = null, V = !1;
}
function mo(e) {
  Oe === null ? Oe = [e] : Oe.push(e);
}
var rd = tt.ReactCurrentBatchConfig;
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
function Eu(e) {
  var t = e._init;
  return t(e._payload);
}
function ca(e) {
  function t(d, a) {
    if (e) {
      var p = d.deletions;
      p === null ? (d.deletions = [a], d.flags |= 16) : p.push(a);
    }
  }
  function n(d, a) {
    if (!e) return null;
    for (; a !== null; ) t(d, a), a = a.sibling;
    return null;
  }
  function r(d, a) {
    for (d = /* @__PURE__ */ new Map(); a !== null; ) a.key !== null ? d.set(a.key, a) : d.set(a.index, a), a = a.sibling;
    return d;
  }
  function l(d, a) {
    return d = vt(d, a), d.index = 0, d.sibling = null, d;
  }
  function i(d, a, p) {
    return d.index = p, e ? (p = d.alternate, p !== null ? (p = p.index, p < a ? (d.flags |= 2, a) : p) : (d.flags |= 2, a)) : (d.flags |= 1048576, a);
  }
  function o(d) {
    return e && d.alternate === null && (d.flags |= 2), d;
  }
  function u(d, a, p, y) {
    return a === null || a.tag !== 6 ? (a = Gl(p, d.mode, y), a.return = d, a) : (a = l(a, p), a.return = d, a);
  }
  function s(d, a, p, y) {
    var m = p.type;
    return m === At ? g(d, a, p.props.children, y, p.key) : a !== null && (a.elementType === m || typeof m == "object" && m !== null && m.$$typeof === rt && Eu(m) === a.type) ? (y = l(a, p.props), y.ref = xn(d, a, p), y.return = d, y) : (y = Mr(p.type, p.key, p.props, null, d.mode, y), y.ref = xn(d, a, p), y.return = d, y);
  }
  function f(d, a, p, y) {
    return a === null || a.tag !== 4 || a.stateNode.containerInfo !== p.containerInfo || a.stateNode.implementation !== p.implementation ? (a = Zl(p, d.mode, y), a.return = d, a) : (a = l(a, p.children || []), a.return = d, a);
  }
  function g(d, a, p, y, m) {
    return a === null || a.tag !== 7 ? (a = Tt(p, d.mode, y, m), a.return = d, a) : (a = l(a, p), a.return = d, a);
  }
  function v(d, a, p) {
    if (typeof a == "string" && a !== "" || typeof a == "number") return a = Gl("" + a, d.mode, p), a.return = d, a;
    if (typeof a == "object" && a !== null) {
      switch (a.$$typeof) {
        case or:
          return p = Mr(a.type, a.key, a.props, null, d.mode, p), p.ref = xn(d, null, a), p.return = d, p;
        case $t:
          return a = Zl(a, d.mode, p), a.return = d, a;
        case rt:
          var y = a._init;
          return v(d, y(a._payload), p);
      }
      if (En(a) || mn(a)) return a = Tt(a, d.mode, p, null), a.return = d, a;
      gr(d, a);
    }
    return null;
  }
  function h(d, a, p, y) {
    var m = a !== null ? a.key : null;
    if (typeof p == "string" && p !== "" || typeof p == "number") return m !== null ? null : u(d, a, "" + p, y);
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case or:
          return p.key === m ? s(d, a, p, y) : null;
        case $t:
          return p.key === m ? f(d, a, p, y) : null;
        case rt:
          return m = p._init, h(
            d,
            a,
            m(p._payload),
            y
          );
      }
      if (En(p) || mn(p)) return m !== null ? null : g(d, a, p, y, null);
      gr(d, p);
    }
    return null;
  }
  function k(d, a, p, y, m) {
    if (typeof y == "string" && y !== "" || typeof y == "number") return d = d.get(p) || null, u(a, d, "" + y, m);
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case or:
          return d = d.get(y.key === null ? p : y.key) || null, s(a, d, y, m);
        case $t:
          return d = d.get(y.key === null ? p : y.key) || null, f(a, d, y, m);
        case rt:
          var E = y._init;
          return k(d, a, p, E(y._payload), m);
      }
      if (En(y) || mn(y)) return d = d.get(p) || null, g(a, d, y, m, null);
      gr(a, y);
    }
    return null;
  }
  function w(d, a, p, y) {
    for (var m = null, E = null, C = a, j = a = 0, U = null; C !== null && j < p.length; j++) {
      C.index > j ? (U = C, C = null) : U = C.sibling;
      var T = h(d, C, p[j], y);
      if (T === null) {
        C === null && (C = U);
        break;
      }
      e && C && T.alternate === null && t(d, C), a = i(T, a, j), E === null ? m = T : E.sibling = T, E = T, C = U;
    }
    if (j === p.length) return n(d, C), V && _t(d, j), m;
    if (C === null) {
      for (; j < p.length; j++) C = v(d, p[j], y), C !== null && (a = i(C, a, j), E === null ? m = C : E.sibling = C, E = C);
      return V && _t(d, j), m;
    }
    for (C = r(d, C); j < p.length; j++) U = k(C, d, j, p[j], y), U !== null && (e && U.alternate !== null && C.delete(U.key === null ? j : U.key), a = i(U, a, j), E === null ? m = U : E.sibling = U, E = U);
    return e && C.forEach(function(ge) {
      return t(d, ge);
    }), V && _t(d, j), m;
  }
  function S(d, a, p, y) {
    var m = mn(p);
    if (typeof m != "function") throw Error(x(150));
    if (p = m.call(p), p == null) throw Error(x(151));
    for (var E = m = null, C = a, j = a = 0, U = null, T = p.next(); C !== null && !T.done; j++, T = p.next()) {
      C.index > j ? (U = C, C = null) : U = C.sibling;
      var ge = h(d, C, T.value, y);
      if (ge === null) {
        C === null && (C = U);
        break;
      }
      e && C && ge.alternate === null && t(d, C), a = i(ge, a, j), E === null ? m = ge : E.sibling = ge, E = ge, C = U;
    }
    if (T.done) return n(
      d,
      C
    ), V && _t(d, j), m;
    if (C === null) {
      for (; !T.done; j++, T = p.next()) T = v(d, T.value, y), T !== null && (a = i(T, a, j), E === null ? m = T : E.sibling = T, E = T);
      return V && _t(d, j), m;
    }
    for (C = r(d, C); !T.done; j++, T = p.next()) T = k(C, d, j, T.value, y), T !== null && (e && T.alternate !== null && C.delete(T.key === null ? j : T.key), a = i(T, a, j), E === null ? m = T : E.sibling = T, E = T);
    return e && C.forEach(function(I) {
      return t(d, I);
    }), V && _t(d, j), m;
  }
  function O(d, a, p, y) {
    if (typeof p == "object" && p !== null && p.type === At && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case or:
          e: {
            for (var m = p.key, E = a; E !== null; ) {
              if (E.key === m) {
                if (m = p.type, m === At) {
                  if (E.tag === 7) {
                    n(d, E.sibling), a = l(E, p.props.children), a.return = d, d = a;
                    break e;
                  }
                } else if (E.elementType === m || typeof m == "object" && m !== null && m.$$typeof === rt && Eu(m) === E.type) {
                  n(d, E.sibling), a = l(E, p.props), a.ref = xn(d, E, p), a.return = d, d = a;
                  break e;
                }
                n(d, E);
                break;
              } else t(d, E);
              E = E.sibling;
            }
            p.type === At ? (a = Tt(p.props.children, d.mode, y, p.key), a.return = d, d = a) : (y = Mr(p.type, p.key, p.props, null, d.mode, y), y.ref = xn(d, a, p), y.return = d, d = y);
          }
          return o(d);
        case $t:
          e: {
            for (E = p.key; a !== null; ) {
              if (a.key === E) if (a.tag === 4 && a.stateNode.containerInfo === p.containerInfo && a.stateNode.implementation === p.implementation) {
                n(d, a.sibling), a = l(a, p.children || []), a.return = d, d = a;
                break e;
              } else {
                n(d, a);
                break;
              }
              else t(d, a);
              a = a.sibling;
            }
            a = Zl(p, d.mode, y), a.return = d, d = a;
          }
          return o(d);
        case rt:
          return E = p._init, O(d, a, E(p._payload), y);
      }
      if (En(p)) return w(d, a, p, y);
      if (mn(p)) return S(d, a, p, y);
      gr(d, p);
    }
    return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, a !== null && a.tag === 6 ? (n(d, a.sibling), a = l(a, p), a.return = d, d = a) : (n(d, a), a = Gl(p, d.mode, y), a.return = d, d = a), o(d)) : n(d, a);
  }
  return O;
}
var un = ca(!0), fa = ca(!1), Gr = wt(null), Zr = null, Xt = null, ho = null;
function vo() {
  ho = Xt = Zr = null;
}
function go(e) {
  var t = Gr.current;
  A(Gr), e._currentValue = t;
}
function ji(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function tn(e, t) {
  Zr = e, ho = Xt = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (pe = !0), e.firstContext = null);
}
function Pe(e) {
  var t = e._currentValue;
  if (ho !== e) if (e = { context: e, memoizedValue: t, next: null }, Xt === null) {
    if (Zr === null) throw Error(x(308));
    Xt = e, Zr.dependencies = { lanes: 0, firstContext: e };
  } else Xt = Xt.next = e;
  return t;
}
var jt = null;
function yo(e) {
  jt === null ? jt = [e] : jt.push(e);
}
function da(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, yo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, be(e, r);
}
function be(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var lt = !1;
function xo(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function pa(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Ze(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function pt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, R & 2) {
    var l = r.pending;
    return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, be(e, n);
  }
  return l = r.interleaved, l === null ? (t.next = t, yo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, be(e, n);
}
function Pr(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, ro(e, n);
  }
}
function _u(e, t) {
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
    var s = u, f = s.next;
    s.next = null, o === null ? i = f : o.next = f, o = s;
    var g = e.alternate;
    g !== null && (g = g.updateQueue, u = g.lastBaseUpdate, u !== o && (u === null ? g.firstBaseUpdate = f : u.next = f, g.lastBaseUpdate = s));
  }
  if (i !== null) {
    var v = l.baseState;
    o = 0, g = f = s = null, u = i;
    do {
      var h = u.lane, k = u.eventTime;
      if ((r & h) === h) {
        g !== null && (g = g.next = {
          eventTime: k,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var w = e, S = u;
          switch (h = t, k = n, S.tag) {
            case 1:
              if (w = S.payload, typeof w == "function") {
                v = w.call(k, v, h);
                break e;
              }
              v = w;
              break e;
            case 3:
              w.flags = w.flags & -65537 | 128;
            case 0:
              if (w = S.payload, h = typeof w == "function" ? w.call(k, v, h) : w, h == null) break e;
              v = Q({}, v, h);
              break e;
            case 2:
              lt = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, h = l.effects, h === null ? l.effects = [u] : h.push(u));
      } else k = { eventTime: k, lane: h, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, g === null ? (f = g = k, s = v) : g = g.next = k, o |= h;
      if (u = u.next, u === null) {
        if (u = l.shared.pending, u === null) break;
        h = u, u = h.next, h.next = null, l.lastBaseUpdate = h, l.shared.pending = null;
      }
    } while (!0);
    if (g === null && (s = v), l.baseState = s, l.firstBaseUpdate = f, l.lastBaseUpdate = g, t = l.shared.interleaved, t !== null) {
      l = t;
      do
        o |= l.lane, l = l.next;
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    Ot |= o, e.lanes = o, e.memoizedState = v;
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
function wo(e, t) {
  switch (F(Yn, t), F(Kn, e), F(He, nr), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ui(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = ui(t, e);
  }
  A(He), F(He, t);
}
function sn() {
  A(He), A(Kn), A(Yn);
}
function ma(e) {
  zt(Yn.current);
  var t = zt(He.current), n = ui(t, e.type);
  t !== n && (F(Kn, e), F(He, n));
}
function ko(e) {
  Kn.current === e && (A(He), A(Kn));
}
var H = wt(0);
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
var Hl = [];
function So() {
  for (var e = 0; e < Hl.length; e++) Hl[e]._workInProgressVersionPrimary = null;
  Hl.length = 0;
}
var Tr = tt.ReactCurrentDispatcher, Wl = tt.ReactCurrentBatchConfig, Rt = 0, W = null, Z = null, b = null, br = !1, Ln = !1, Xn = 0, ld = 0;
function le() {
  throw Error(x(321));
}
function Eo(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Fe(e[n], t[n])) return !1;
  return !0;
}
function _o(e, t, n, r, l, i) {
  if (Rt = i, W = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Tr.current = e === null || e.memoizedState === null ? sd : ad, e = n(r, l), Ln) {
    i = 0;
    do {
      if (Ln = !1, Xn = 0, 25 <= i) throw Error(x(301));
      i += 1, b = Z = null, t.updateQueue = null, Tr.current = cd, e = n(r, l);
    } while (Ln);
  }
  if (Tr.current = el, t = Z !== null && Z.next !== null, Rt = 0, b = Z = W = null, br = !1, t) throw Error(x(300));
  return e;
}
function Co() {
  var e = Xn !== 0;
  return Xn = 0, e;
}
function Ae() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return b === null ? W.memoizedState = b = e : b = b.next = e, b;
}
function Te() {
  if (Z === null) {
    var e = W.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Z.next;
  var t = b === null ? W.memoizedState : b.next;
  if (t !== null) b = t, Z = e;
  else {
    if (e === null) throw Error(x(310));
    Z = e, e = { memoizedState: Z.memoizedState, baseState: Z.baseState, baseQueue: Z.baseQueue, queue: Z.queue, next: null }, b === null ? W.memoizedState = b = e : b = b.next = e;
  }
  return b;
}
function Gn(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Ql(e) {
  var t = Te(), n = t.queue;
  if (n === null) throw Error(x(311));
  n.lastRenderedReducer = e;
  var r = Z, l = r.baseQueue, i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var o = l.next;
      l.next = i.next, i.next = o;
    }
    r.baseQueue = l = i, n.pending = null;
  }
  if (l !== null) {
    i = l.next, r = r.baseState;
    var u = o = null, s = null, f = i;
    do {
      var g = f.lane;
      if ((Rt & g) === g) s !== null && (s = s.next = { lane: 0, action: f.action, hasEagerState: f.hasEagerState, eagerState: f.eagerState, next: null }), r = f.hasEagerState ? f.eagerState : e(r, f.action);
      else {
        var v = {
          lane: g,
          action: f.action,
          hasEagerState: f.hasEagerState,
          eagerState: f.eagerState,
          next: null
        };
        s === null ? (u = s = v, o = r) : s = s.next = v, W.lanes |= g, Ot |= g;
      }
      f = f.next;
    } while (f !== null && f !== i);
    s === null ? o = r : s.next = u, Fe(r, t.memoizedState) || (pe = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = s, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      i = l.lane, W.lanes |= i, Ot |= i, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Kl(e) {
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
    Fe(i, t.memoizedState) || (pe = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function ha() {
}
function va(e, t) {
  var n = W, r = Te(), l = t(), i = !Fe(r.memoizedState, l);
  if (i && (r.memoizedState = l, pe = !0), r = r.queue, No(xa.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || b !== null && b.memoizedState.tag & 1) {
    if (n.flags |= 2048, Zn(9, ya.bind(null, n, r, l, t), void 0, null), ee === null) throw Error(x(349));
    Rt & 30 || ga(n, t, l);
  }
  return l;
}
function ga(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = W.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, W.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function ya(e, t, n, r) {
  t.value = n, t.getSnapshot = r, wa(t) && ka(e);
}
function xa(e, t, n) {
  return n(function() {
    wa(t) && ka(e);
  });
}
function wa(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Fe(e, n);
  } catch {
    return !0;
  }
}
function ka(e) {
  var t = be(e, 1);
  t !== null && Ie(t, e, 1, -1);
}
function Nu(e) {
  var t = Ae();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Gn, lastRenderedState: e }, t.queue = e, e = e.dispatch = ud.bind(null, W, e), [t.memoizedState, e];
}
function Zn(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = W.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, W.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function Sa() {
  return Te().memoizedState;
}
function Lr(e, t, n, r) {
  var l = Ae();
  W.flags |= e, l.memoizedState = Zn(1 | t, n, void 0, r === void 0 ? null : r);
}
function dl(e, t, n, r) {
  var l = Te();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Z !== null) {
    var o = Z.memoizedState;
    if (i = o.destroy, r !== null && Eo(r, o.deps)) {
      l.memoizedState = Zn(t, n, i, r);
      return;
    }
  }
  W.flags |= e, l.memoizedState = Zn(1 | t, n, i, r);
}
function ju(e, t) {
  return Lr(8390656, 8, e, t);
}
function No(e, t) {
  return dl(2048, 8, e, t);
}
function Ea(e, t) {
  return dl(4, 2, e, t);
}
function _a(e, t) {
  return dl(4, 4, e, t);
}
function Ca(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function Na(e, t, n) {
  return n = n != null ? n.concat([e]) : null, dl(4, 4, Ca.bind(null, t, e), n);
}
function jo() {
}
function ja(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Eo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function za(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Eo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Pa(e, t, n) {
  return Rt & 21 ? (Fe(n, t) || (n = Os(), W.lanes |= n, Ot |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, pe = !0), e.memoizedState = n);
}
function id(e, t) {
  var n = M;
  M = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = Wl.transition;
  Wl.transition = {};
  try {
    e(!1), t();
  } finally {
    M = n, Wl.transition = r;
  }
}
function Ta() {
  return Te().memoizedState;
}
function od(e, t, n) {
  var r = ht(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, La(e)) Da(t, n);
  else if (n = da(e, t, n, r), n !== null) {
    var l = ae();
    Ie(n, e, r, l), Ra(n, t, r);
  }
}
function ud(e, t, n) {
  var r = ht(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (La(e)) Da(t, l);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var o = t.lastRenderedState, u = i(o, n);
      if (l.hasEagerState = !0, l.eagerState = u, Fe(u, o)) {
        var s = t.interleaved;
        s === null ? (l.next = l, yo(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = da(e, t, l, r), n !== null && (l = ae(), Ie(n, e, r, l), Ra(n, t, r));
  }
}
function La(e) {
  var t = e.alternate;
  return e === W || t !== null && t === W;
}
function Da(e, t) {
  Ln = br = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function Ra(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, ro(e, n);
  }
}
var el = { readContext: Pe, useCallback: le, useContext: le, useEffect: le, useImperativeHandle: le, useInsertionEffect: le, useLayoutEffect: le, useMemo: le, useReducer: le, useRef: le, useState: le, useDebugValue: le, useDeferredValue: le, useTransition: le, useMutableSource: le, useSyncExternalStore: le, useId: le, unstable_isNewReconciler: !1 }, sd = { readContext: Pe, useCallback: function(e, t) {
  return Ae().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: Pe, useEffect: ju, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Lr(
    4194308,
    4,
    Ca.bind(null, t, e),
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
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = od.bind(null, W, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Ae();
  return e = { current: e }, t.memoizedState = e;
}, useState: Nu, useDebugValue: jo, useDeferredValue: function(e) {
  return Ae().memoizedState = e;
}, useTransition: function() {
  var e = Nu(!1), t = e[0];
  return e = id.bind(null, e[1]), Ae().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = W, l = Ae();
  if (V) {
    if (n === void 0) throw Error(x(407));
    n = n();
  } else {
    if (n = t(), ee === null) throw Error(x(349));
    Rt & 30 || ga(r, t, n);
  }
  l.memoizedState = n;
  var i = { value: n, getSnapshot: t };
  return l.queue = i, ju(xa.bind(
    null,
    r,
    i,
    e
  ), [e]), r.flags |= 2048, Zn(9, ya.bind(null, r, i, n, t), void 0, null), n;
}, useId: function() {
  var e = Ae(), t = ee.identifierPrefix;
  if (V) {
    var n = Ge, r = Xe;
    n = (r & ~(1 << 32 - Me(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Xn++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = ld++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, ad = {
  readContext: Pe,
  useCallback: ja,
  useContext: Pe,
  useEffect: No,
  useImperativeHandle: Na,
  useInsertionEffect: Ea,
  useLayoutEffect: _a,
  useMemo: za,
  useReducer: Ql,
  useRef: Sa,
  useState: function() {
    return Ql(Gn);
  },
  useDebugValue: jo,
  useDeferredValue: function(e) {
    var t = Te();
    return Pa(t, Z.memoizedState, e);
  },
  useTransition: function() {
    var e = Ql(Gn)[0], t = Te().memoizedState;
    return [e, t];
  },
  useMutableSource: ha,
  useSyncExternalStore: va,
  useId: Ta,
  unstable_isNewReconciler: !1
}, cd = { readContext: Pe, useCallback: ja, useContext: Pe, useEffect: No, useImperativeHandle: Na, useInsertionEffect: Ea, useLayoutEffect: _a, useMemo: za, useReducer: Kl, useRef: Sa, useState: function() {
  return Kl(Gn);
}, useDebugValue: jo, useDeferredValue: function(e) {
  var t = Te();
  return Z === null ? t.memoizedState = e : Pa(t, Z.memoizedState, e);
}, useTransition: function() {
  var e = Kl(Gn)[0], t = Te().memoizedState;
  return [e, t];
}, useMutableSource: ha, useSyncExternalStore: va, useId: Ta, unstable_isNewReconciler: !1 };
function De(e, t) {
  if (e && e.defaultProps) {
    t = Q({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function zi(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : Q({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var pl = { isMounted: function(e) {
  return (e = e._reactInternals) ? Ft(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = ae(), l = ht(e), i = Ze(r, l);
  i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Ie(t, e, l, r), Pr(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = ae(), l = ht(e), i = Ze(r, l);
  i.tag = 1, i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Ie(t, e, l, r), Pr(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = ae(), r = ht(e), l = Ze(n, r);
  l.tag = 2, t != null && (l.callback = t), t = pt(e, l, r), t !== null && (Ie(t, e, r, n), Pr(t, e, r));
} };
function zu(e, t, n, r, l, i, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Bn(n, r) || !Bn(l, i) : !0;
}
function Oa(e, t, n) {
  var r = !1, l = yt, i = t.contextType;
  return typeof i == "object" && i !== null ? i = Pe(i) : (l = he(t) ? Lt : ue.current, r = t.contextTypes, i = (r = r != null) ? ln(e, l) : yt), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = pl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function Pu(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && pl.enqueueReplaceState(t, t.state, null);
}
function Pi(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, xo(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? l.context = Pe(i) : (i = he(t) ? Lt : ue.current, l.context = ln(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (zi(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && pl.enqueueReplaceState(l, l.state, null), Jr(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function an(e, t) {
  try {
    var n = "", r = t;
    do
      n += Fc(r), r = r.return;
    while (r);
    var l = n;
  } catch (i) {
    l = `
Error generating stack: ` + i.message + `
` + i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function Yl(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Ti(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var fd = typeof WeakMap == "function" ? WeakMap : Map;
function Ma(e, t, n) {
  n = Ze(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    nl || (nl = !0, Ai = r), Ti(e, t);
  }, n;
}
function Ia(e, t, n) {
  n = Ze(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    n.payload = function() {
      return r(l);
    }, n.callback = function() {
      Ti(e, t);
    };
  }
  var i = e.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    Ti(e, t), typeof r != "function" && (mt === null ? mt = /* @__PURE__ */ new Set([this]) : mt.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function Tu(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new fd();
    var l = /* @__PURE__ */ new Set();
    r.set(t, l);
  } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
  l.has(n) || (l.add(n), e = Cd.bind(null, e, t, n), t.then(e, e));
}
function Lu(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Du(e, t, n, r, l) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Ze(-1, 1), t.tag = 2, pt(n, t, 1))), n.lanes |= 1), e);
}
var dd = tt.ReactCurrentOwner, pe = !1;
function se(e, t, n, r) {
  t.child = e === null ? fa(t, null, n, r) : un(t, e.child, n, r);
}
function Ru(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return tn(t, l), r = _o(e, t, n, r, i, l), n = Co(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (V && n && fo(t), t.flags |= 1, se(e, t, r, l), t.child);
}
function Ou(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" && !Mo(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Fa(e, t, i, r, l)) : (e = Mr(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (i = e.child, !(e.lanes & l)) {
    var o = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Bn, n(o, r) && e.ref === t.ref) return et(e, t, l);
  }
  return t.flags |= 1, e = vt(i, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Fa(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (Bn(i, r) && e.ref === t.ref) if (pe = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) e.flags & 131072 && (pe = !0);
    else return t.lanes = e.lanes, et(e, t, l);
  }
  return Li(e, t, n, r, l);
}
function Ua(e, t, n) {
  var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, F(Zt, ye), ye |= n;
  else {
    if (!(n & 1073741824)) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, F(Zt, ye), ye |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, F(Zt, ye), ye |= r;
  }
  else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, F(Zt, ye), ye |= r;
  return se(e, t, l, n), t.child;
}
function $a(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Li(e, t, n, r, l) {
  var i = he(n) ? Lt : ue.current;
  return i = ln(t, i), tn(t, l), n = _o(e, t, n, r, i, l), r = Co(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (V && r && fo(t), t.flags |= 1, se(e, t, n, l), t.child);
}
function Mu(e, t, n, r, l) {
  if (he(n)) {
    var i = !0;
    Kr(t);
  } else i = !1;
  if (tn(t, l), t.stateNode === null) Dr(e, t), Oa(t, n, r), Pi(t, n, r, l), r = !0;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var s = o.context, f = n.contextType;
    typeof f == "object" && f !== null ? f = Pe(f) : (f = he(n) ? Lt : ue.current, f = ln(t, f));
    var g = n.getDerivedStateFromProps, v = typeof g == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    v || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || s !== f) && Pu(t, o, r, f), lt = !1;
    var h = t.memoizedState;
    o.state = h, Jr(t, r, o, l), s = t.memoizedState, u !== r || h !== s || me.current || lt ? (typeof g == "function" && (zi(t, n, g, r), s = t.memoizedState), (u = lt || zu(t, n, u, r, h, s, f)) ? (v || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), o.props = r, o.state = s, o.context = f, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, pa(e, t), u = t.memoizedProps, f = t.type === t.elementType ? u : De(t.type, u), o.props = f, v = t.pendingProps, h = o.context, s = n.contextType, typeof s == "object" && s !== null ? s = Pe(s) : (s = he(n) ? Lt : ue.current, s = ln(t, s));
    var k = n.getDerivedStateFromProps;
    (g = typeof k == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== v || h !== s) && Pu(t, o, r, s), lt = !1, h = t.memoizedState, o.state = h, Jr(t, r, o, l);
    var w = t.memoizedState;
    u !== v || h !== w || me.current || lt ? (typeof k == "function" && (zi(t, n, k, r), w = t.memoizedState), (f = lt || zu(t, n, f, r, h, w, s) || !1) ? (g || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, w, s), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, w, s)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = w), o.props = r, o.state = w, o.context = s, r = f) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Di(e, t, n, r, i, l);
}
function Di(e, t, n, r, l, i) {
  $a(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && wu(t, n, !1), et(e, t, i);
  r = t.stateNode, dd.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = un(t, e.child, null, i), t.child = un(t, null, u, i)) : se(e, t, u, i), t.memoizedState = r.state, l && wu(t, n, !0), t.child;
}
function Aa(e) {
  var t = e.stateNode;
  t.pendingContext ? xu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && xu(e, t.context, !1), wo(e, t.containerInfo);
}
function Iu(e, t, n, r, l) {
  return on(), mo(l), t.flags |= 256, se(e, t, n, r), t.child;
}
var Ri = { dehydrated: null, treeContext: null, retryLane: 0 };
function Oi(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Va(e, t, n) {
  var r = t.pendingProps, l = H.current, i = !1, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), F(H, l & 1), e === null)
    return Ni(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = vl(o, r, 0, null), e = Tt(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Oi(n), t.memoizedState = Ri, e) : zo(t, o));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return pd(e, t, o, r, u, l, n);
  if (i) {
    i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
    var s = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = vt(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = vt(u, i) : (i = Tt(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? Oi(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = Ri, r;
  }
  return i = e.child, e = i.sibling, r = vt(i, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function zo(e, t) {
  return t = vl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function yr(e, t, n, r) {
  return r !== null && mo(r), un(t, e.child, null, n), e = zo(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function pd(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = Yl(Error(x(422))), yr(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = vl({ mode: "visible", children: r.children }, l, 0, null), i = Tt(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, t.mode & 1 && un(t, e.child, null, o), t.child.memoizedState = Oi(o), t.memoizedState = Ri, i);
  if (!(t.mode & 1)) return yr(e, t, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, i = Error(x(419)), r = Yl(i, r, void 0), yr(e, t, o, r);
  }
  if (u = (o & e.childLanes) !== 0, pe || u) {
    if (r = ee, r !== null) {
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
      l = l & (r.suspendedLanes | o) ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, be(e, l), Ie(r, e, l, -1));
    }
    return Oo(), r = Yl(Error(x(421))), yr(e, t, o, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Nd.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, xe = dt(l.nextSibling), we = t, V = !0, Oe = null, e !== null && (Ce[Ne++] = Xe, Ce[Ne++] = Ge, Ce[Ne++] = Dt, Xe = e.id, Ge = e.overflow, Dt = t), t = zo(t, r.children), t.flags |= 4096, t);
}
function Fu(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), ji(e.return, t, n);
}
function Xl(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
}
function Ba(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, i = r.tail;
  if (se(e, t, r.children, n), r = H.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && Fu(e, n, t);
      else if (e.tag === 19) Fu(e, n, t);
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
  if (F(H, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && qr(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Xl(t, !1, l, n, i);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && qr(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Xl(t, !0, n, null, i);
      break;
    case "together":
      Xl(t, !1, null, null, void 0);
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
  if (e !== null && (t.dependencies = e.dependencies), Ot |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(x(153));
  if (t.child !== null) {
    for (e = t.child, n = vt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = vt(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function md(e, t, n) {
  switch (t.tag) {
    case 3:
      Aa(t), on();
      break;
    case 5:
      ma(t);
      break;
    case 1:
      he(t.type) && Kr(t);
      break;
    case 4:
      wo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      F(Gr, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (F(H, H.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Va(e, t, n) : (F(H, H.current & 1), e = et(e, t, n), e !== null ? e.sibling : null);
      F(H, H.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Ba(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), F(H, H.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Ua(e, t, n);
  }
  return et(e, t, n);
}
var Ha, Mi, Wa, Qa;
Ha = function(e, t) {
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
Wa = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, zt(He.current);
    var i = null;
    switch (n) {
      case "input":
        l = ri(e, l), r = ri(e, r), i = [];
        break;
      case "select":
        l = Q({}, l, { value: void 0 }), r = Q({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        l = oi(e, l), r = oi(e, r), i = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Wr);
    }
    si(n, r);
    var o;
    n = null;
    for (f in l) if (!r.hasOwnProperty(f) && l.hasOwnProperty(f) && l[f] != null) if (f === "style") {
      var u = l[f];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else f !== "dangerouslySetInnerHTML" && f !== "children" && f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning" && f !== "autoFocus" && (Mn.hasOwnProperty(f) ? i || (i = []) : (i = i || []).push(f, null));
    for (f in r) {
      var s = r[f];
      if (u = l?.[f], r.hasOwnProperty(f) && s !== u && (s != null || u != null)) if (f === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in s) s.hasOwnProperty(o) && u[o] !== s[o] && (n || (n = {}), n[o] = s[o]);
      } else n || (i || (i = []), i.push(
        f,
        n
      )), n = s;
      else f === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (i = i || []).push(f, s)) : f === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(f, "" + s) : f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning" && (Mn.hasOwnProperty(f) ? (s != null && f === "onScroll" && $("scroll", e), i || u === s || (i = [])) : (i = i || []).push(f, s));
    }
    n && (i = i || []).push("style", n);
    var f = i;
    (t.updateQueue = f) && (t.flags |= 4);
  }
};
Qa = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function wn(e, t) {
  if (!V) switch (e.tailMode) {
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
function ie(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
  else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function hd(e, t, n) {
  var r = t.pendingProps;
  switch (po(t), t.tag) {
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
      return ie(t), null;
    case 1:
      return he(t.type) && Qr(), ie(t), null;
    case 3:
      return r = t.stateNode, sn(), A(me), A(ue), So(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (vr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Oe !== null && (Hi(Oe), Oe = null))), Mi(e, t), ie(t), null;
    case 5:
      ko(t);
      var l = zt(Yn.current);
      if (n = t.type, e !== null && t.stateNode != null) Wa(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(x(166));
          return ie(t), null;
        }
        if (e = zt(He.current), vr(t)) {
          r = t.stateNode, n = t.type;
          var i = t.memoizedProps;
          switch (r[Ve] = t, r[Qn] = i, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              $("cancel", r), $("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              $("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Cn.length; l++) $(Cn[l], r);
              break;
            case "source":
              $("error", r);
              break;
            case "img":
            case "image":
            case "link":
              $(
                "error",
                r
              ), $("load", r);
              break;
            case "details":
              $("toggle", r);
              break;
            case "input":
              Ko(r, i), $("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, $("invalid", r);
              break;
            case "textarea":
              Xo(r, i), $("invalid", r);
          }
          si(n, i), l = null;
          for (var o in i) if (i.hasOwnProperty(o)) {
            var u = i[o];
            o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && hr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && hr(
              r.textContent,
              u,
              e
            ), l = ["children", "" + u]) : Mn.hasOwnProperty(o) && u != null && o === "onScroll" && $("scroll", r);
          }
          switch (n) {
            case "input":
              ur(r), Yo(r, i, !0);
              break;
            case "textarea":
              ur(r), Go(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Wr);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = xs(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Ve] = t, e[Qn] = r, Ha(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = ai(n, r), n) {
              case "dialog":
                $("cancel", e), $("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                $("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < Cn.length; l++) $(Cn[l], e);
                l = r;
                break;
              case "source":
                $("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                $(
                  "error",
                  e
                ), $("load", e), l = r;
                break;
              case "details":
                $("toggle", e), l = r;
                break;
              case "input":
                Ko(e, r), l = ri(e, r), $("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = Q({}, r, { value: void 0 }), $("invalid", e);
                break;
              case "textarea":
                Xo(e, r), l = oi(e, r), $("invalid", e);
                break;
              default:
                l = r;
            }
            si(n, l), u = l;
            for (i in u) if (u.hasOwnProperty(i)) {
              var s = u[i];
              i === "style" ? Ss(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && ws(e, s)) : i === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && In(e, s) : typeof s == "number" && In(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (Mn.hasOwnProperty(i) ? s != null && i === "onScroll" && $("scroll", e) : s != null && Ji(e, i, s, o));
            }
            switch (n) {
              case "input":
                ur(e), Yo(e, r, !1);
                break;
              case "textarea":
                ur(e), Go(e);
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
      return ie(t), null;
    case 6:
      if (e && t.stateNode != null) Qa(e, t, e.memoizedProps, r);
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
      return ie(t), null;
    case 13:
      if (A(H), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (V && xe !== null && t.mode & 1 && !(t.flags & 128)) aa(), on(), t.flags |= 98560, i = !1;
        else if (i = vr(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!i) throw Error(x(318));
            if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(x(317));
            i[Ve] = t;
          } else on(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          ie(t), i = !1;
        } else Oe !== null && (Hi(Oe), Oe = null), i = !0;
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || H.current & 1 ? J === 0 && (J = 3) : Oo())), t.updateQueue !== null && (t.flags |= 4), ie(t), null);
    case 4:
      return sn(), Mi(e, t), e === null && Hn(t.stateNode.containerInfo), ie(t), null;
    case 10:
      return go(t.type._context), ie(t), null;
    case 17:
      return he(t.type) && Qr(), ie(t), null;
    case 19:
      if (A(H), i = t.memoizedState, i === null) return ie(t), null;
      if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wn(i, !1);
      else {
        if (J !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = qr(e), o !== null) {
            for (t.flags |= 128, wn(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return F(H, H.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        i.tail !== null && X() > cn && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = qr(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wn(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !V) return ie(t), null;
        } else 2 * X() - i.renderingStartTime > cn && n !== 1073741824 && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
        i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
      }
      return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = X(), t.sibling = null, n = H.current, F(H, r ? n & 1 | 2 : n & 1), t) : (ie(t), null);
    case 22:
    case 23:
      return Ro(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? ye & 1073741824 && (ie(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ie(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(x(156, t.tag));
}
function vd(e, t) {
  switch (po(t), t.tag) {
    case 1:
      return he(t.type) && Qr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return sn(), A(me), A(ue), So(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return ko(t), null;
    case 13:
      if (A(H), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(x(340));
        on();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return A(H), null;
    case 4:
      return sn(), null;
    case 10:
      return go(t.type._context), null;
    case 22:
    case 23:
      return Ro(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var xr = !1, oe = !1, gd = typeof WeakSet == "function" ? WeakSet : Set, _ = null;
function Gt(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    K(e, t, r);
  }
  else n.current = null;
}
function Ii(e, t, n) {
  try {
    n();
  } catch (r) {
    K(e, t, r);
  }
}
var Uu = !1;
function yd(e, t) {
  if (xi = Vr, e = Zs(), co(e)) {
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
        var o = 0, u = -1, s = -1, f = 0, g = 0, v = e, h = null;
        t: for (; ; ) {
          for (var k; v !== n || l !== 0 && v.nodeType !== 3 || (u = o + l), v !== i || r !== 0 && v.nodeType !== 3 || (s = o + r), v.nodeType === 3 && (o += v.nodeValue.length), (k = v.firstChild) !== null; )
            h = v, v = k;
          for (; ; ) {
            if (v === e) break t;
            if (h === n && ++f === l && (u = o), h === i && ++g === r && (s = o), (k = v.nextSibling) !== null) break;
            v = h, h = v.parentNode;
          }
          v = k;
        }
        n = u === -1 || s === -1 ? null : { start: u, end: s };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (wi = { focusedElem: e, selectionRange: n }, Vr = !1, _ = t; _ !== null; ) if (t = _, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, _ = e;
  else for (; _ !== null; ) {
    t = _;
    try {
      var w = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (w !== null) {
            var S = w.memoizedProps, O = w.memoizedState, d = t.stateNode, a = d.getSnapshotBeforeUpdate(t.elementType === t.type ? S : De(t.type, S), O);
            d.__reactInternalSnapshotBeforeUpdate = a;
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
    } catch (y) {
      K(t, t.return, y);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, _ = e;
      break;
    }
    _ = t.return;
  }
  return w = Uu, Uu = !1, w;
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
function Fi(e) {
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
function Ka(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Ka(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ve], delete t[Qn], delete t[Ei], delete t[ed], delete t[td])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Ya(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function $u(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Ya(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Ui(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Wr));
  else if (r !== 4 && (e = e.child, e !== null)) for (Ui(e, t, n), e = e.sibling; e !== null; ) Ui(e, t, n), e = e.sibling;
}
function $i(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for ($i(e, t, n), e = e.sibling; e !== null; ) $i(e, t, n), e = e.sibling;
}
var te = null, Re = !1;
function nt(e, t, n) {
  for (n = n.child; n !== null; ) Xa(e, t, n), n = n.sibling;
}
function Xa(e, t, n) {
  if (Be && typeof Be.onCommitFiberUnmount == "function") try {
    Be.onCommitFiberUnmount(ol, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      oe || Gt(n, t);
    case 6:
      var r = te, l = Re;
      te = null, nt(e, t, n), te = r, Re = l, te !== null && (Re ? (e = te, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : te.removeChild(n.stateNode));
      break;
    case 18:
      te !== null && (Re ? (e = te, n = n.stateNode, e.nodeType === 8 ? Vl(e.parentNode, n) : e.nodeType === 1 && Vl(e, n), An(e)) : Vl(te, n.stateNode));
      break;
    case 4:
      r = te, l = Re, te = n.stateNode.containerInfo, Re = !0, nt(e, t, n), te = r, Re = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!oe && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var i = l, o = i.destroy;
          i = i.tag, o !== void 0 && (i & 2 || i & 4) && Ii(n, t, o), l = l.next;
        } while (l !== r);
      }
      nt(e, t, n);
      break;
    case 1:
      if (!oe && (Gt(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        K(n, t, u);
      }
      nt(e, t, n);
      break;
    case 21:
      nt(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (oe = (r = oe) || n.memoizedState !== null, nt(e, t, n), oe = r) : nt(e, t, n);
      break;
    default:
      nt(e, t, n);
  }
}
function Au(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new gd()), t.forEach(function(r) {
      var l = jd.bind(null, e, r);
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
            te = u.stateNode, Re = !1;
            break e;
          case 3:
            te = u.stateNode.containerInfo, Re = !0;
            break e;
          case 4:
            te = u.stateNode.containerInfo, Re = !0;
            break e;
        }
        u = u.return;
      }
      if (te === null) throw Error(x(160));
      Xa(i, o, l), te = null, Re = !1;
      var s = l.alternate;
      s !== null && (s.return = null), l.return = null;
    } catch (f) {
      K(l, t, f);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ga(t, e), t = t.sibling;
}
function Ga(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Le(t, e), $e(e), r & 4) {
        try {
          Dn(3, e, e.return), ml(3, e);
        } catch (S) {
          K(e, e.return, S);
        }
        try {
          Dn(5, e, e.return);
        } catch (S) {
          K(e, e.return, S);
        }
      }
      break;
    case 1:
      Le(t, e), $e(e), r & 512 && n !== null && Gt(n, n.return);
      break;
    case 5:
      if (Le(t, e), $e(e), r & 512 && n !== null && Gt(n, n.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          In(l, "");
        } catch (S) {
          K(e, e.return, S);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, s = e.updateQueue;
        if (e.updateQueue = null, s !== null) try {
          u === "input" && i.type === "radio" && i.name != null && gs(l, i), ai(u, o);
          var f = ai(u, i);
          for (o = 0; o < s.length; o += 2) {
            var g = s[o], v = s[o + 1];
            g === "style" ? Ss(l, v) : g === "dangerouslySetInnerHTML" ? ws(l, v) : g === "children" ? In(l, v) : Ji(l, g, v, f);
          }
          switch (u) {
            case "input":
              li(l, i);
              break;
            case "textarea":
              ys(l, i);
              break;
            case "select":
              var h = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!i.multiple;
              var k = i.value;
              k != null ? Jt(l, !!i.multiple, k, !1) : h !== !!i.multiple && (i.defaultValue != null ? Jt(
                l,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : Jt(l, !!i.multiple, i.multiple ? [] : "", !1));
          }
          l[Qn] = i;
        } catch (S) {
          K(e, e.return, S);
        }
      }
      break;
    case 6:
      if (Le(t, e), $e(e), r & 4) {
        if (e.stateNode === null) throw Error(x(162));
        l = e.stateNode, i = e.memoizedProps;
        try {
          l.nodeValue = i;
        } catch (S) {
          K(e, e.return, S);
        }
      }
      break;
    case 3:
      if (Le(t, e), $e(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        An(t.containerInfo);
      } catch (S) {
        K(e, e.return, S);
      }
      break;
    case 4:
      Le(t, e), $e(e);
      break;
    case 13:
      Le(t, e), $e(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Lo = X())), r & 4 && Au(e);
      break;
    case 22:
      if (g = n !== null && n.memoizedState !== null, e.mode & 1 ? (oe = (f = oe) || g, Le(t, e), oe = f) : Le(t, e), $e(e), r & 8192) {
        if (f = e.memoizedState !== null, (e.stateNode.isHidden = f) && !g && e.mode & 1) for (_ = e, g = e.child; g !== null; ) {
          for (v = _ = g; _ !== null; ) {
            switch (h = _, k = h.child, h.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Dn(4, h, h.return);
                break;
              case 1:
                Gt(h, h.return);
                var w = h.stateNode;
                if (typeof w.componentWillUnmount == "function") {
                  r = h, n = h.return;
                  try {
                    t = r, w.props = t.memoizedProps, w.state = t.memoizedState, w.componentWillUnmount();
                  } catch (S) {
                    K(r, n, S);
                  }
                }
                break;
              case 5:
                Gt(h, h.return);
                break;
              case 22:
                if (h.memoizedState !== null) {
                  Bu(v);
                  continue;
                }
            }
            k !== null ? (k.return = h, _ = k) : Bu(v);
          }
          g = g.sibling;
        }
        e: for (g = null, v = e; ; ) {
          if (v.tag === 5) {
            if (g === null) {
              g = v;
              try {
                l = v.stateNode, f ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = v.stateNode, s = v.memoizedProps.style, o = s != null && s.hasOwnProperty("display") ? s.display : null, u.style.display = ks("display", o));
              } catch (S) {
                K(e, e.return, S);
              }
            }
          } else if (v.tag === 6) {
            if (g === null) try {
              v.stateNode.nodeValue = f ? "" : v.memoizedProps;
            } catch (S) {
              K(e, e.return, S);
            }
          } else if ((v.tag !== 22 && v.tag !== 23 || v.memoizedState === null || v === e) && v.child !== null) {
            v.child.return = v, v = v.child;
            continue;
          }
          if (v === e) break e;
          for (; v.sibling === null; ) {
            if (v.return === null || v.return === e) break e;
            g === v && (g = null), v = v.return;
          }
          g === v && (g = null), v.sibling.return = v.return, v = v.sibling;
        }
      }
      break;
    case 19:
      Le(t, e), $e(e), r & 4 && Au(e);
      break;
    case 21:
      break;
    default:
      Le(
        t,
        e
      ), $e(e);
  }
}
function $e(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Ya(n)) {
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
          r.flags & 32 && (In(l, ""), r.flags &= -33);
          var i = $u(e);
          $i(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = $u(e);
          Ui(e, u, o);
          break;
        default:
          throw Error(x(161));
      }
    } catch (s) {
      K(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function xd(e, t, n) {
  _ = e, Za(e);
}
function Za(e, t, n) {
  for (var r = (e.mode & 1) !== 0; _ !== null; ) {
    var l = _, i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || xr;
      if (!o) {
        var u = l.alternate, s = u !== null && u.memoizedState !== null || oe;
        u = xr;
        var f = oe;
        if (xr = o, (oe = s) && !f) for (_ = l; _ !== null; ) o = _, s = o.child, o.tag === 22 && o.memoizedState !== null ? Hu(l) : s !== null ? (s.return = o, _ = s) : Hu(l);
        for (; i !== null; ) _ = i, Za(i), i = i.sibling;
        _ = l, xr = u, oe = f;
      }
      Vu(e);
    } else l.subtreeFlags & 8772 && i !== null ? (i.return = l, _ = i) : Vu(e);
  }
}
function Vu(e) {
  for (; _ !== null; ) {
    var t = _;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            oe || ml(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !oe) if (n === null) r.componentDidMount();
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
              var f = t.alternate;
              if (f !== null) {
                var g = f.memoizedState;
                if (g !== null) {
                  var v = g.dehydrated;
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
        oe || t.flags & 512 && Fi(t);
      } catch (h) {
        K(t, t.return, h);
      }
    }
    if (t === e) {
      _ = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, _ = n;
      break;
    }
    _ = t.return;
  }
}
function Bu(e) {
  for (; _ !== null; ) {
    var t = _;
    if (t === e) {
      _ = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, _ = n;
      break;
    }
    _ = t.return;
  }
}
function Hu(e) {
  for (; _ !== null; ) {
    var t = _;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ml(4, t);
          } catch (s) {
            K(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              K(t, l, s);
            }
          }
          var i = t.return;
          try {
            Fi(t);
          } catch (s) {
            K(t, i, s);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Fi(t);
          } catch (s) {
            K(t, o, s);
          }
      }
    } catch (s) {
      K(t, t.return, s);
    }
    if (t === e) {
      _ = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, _ = u;
      break;
    }
    _ = t.return;
  }
}
var wd = Math.ceil, tl = tt.ReactCurrentDispatcher, Po = tt.ReactCurrentOwner, ze = tt.ReactCurrentBatchConfig, R = 0, ee = null, G = null, ne = 0, ye = 0, Zt = wt(0), J = 0, Jn = null, Ot = 0, hl = 0, To = 0, Rn = null, de = null, Lo = 0, cn = 1 / 0, Ke = null, nl = !1, Ai = null, mt = null, wr = !1, st = null, rl = 0, On = 0, Vi = null, Rr = -1, Or = 0;
function ae() {
  return R & 6 ? X() : Rr !== -1 ? Rr : Rr = X();
}
function ht(e) {
  return e.mode & 1 ? R & 2 && ne !== 0 ? ne & -ne : rd.transition !== null ? (Or === 0 && (Or = Os()), Or) : (e = M, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Vs(e.type)), e) : 1;
}
function Ie(e, t, n, r) {
  if (50 < On) throw On = 0, Vi = null, Error(x(185));
  bn(e, n, r), (!(R & 2) || e !== ee) && (e === ee && (!(R & 2) && (hl |= n), J === 4 && ot(e, ne)), ve(e, r), n === 1 && R === 0 && !(t.mode & 1) && (cn = X() + 500, fl && kt()));
}
function ve(e, t) {
  var n = e.callbackNode;
  nf(e, t);
  var r = Ar(e, e === ee ? ne : 0);
  if (r === 0) n !== null && qo(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && qo(n), t === 1) e.tag === 0 ? nd(Wu.bind(null, e)) : oa(Wu.bind(null, e)), qf(function() {
      !(R & 6) && kt();
    }), n = null;
    else {
      switch (Ms(r)) {
        case 1:
          n = no;
          break;
        case 4:
          n = Ds;
          break;
        case 16:
          n = $r;
          break;
        case 536870912:
          n = Rs;
          break;
        default:
          n = $r;
      }
      n = lc(n, Ja.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function Ja(e, t) {
  if (Rr = -1, Or = 0, R & 6) throw Error(x(327));
  var n = e.callbackNode;
  if (nn() && e.callbackNode !== n) return null;
  var r = Ar(e, e === ee ? ne : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = ll(e, r);
  else {
    t = r;
    var l = R;
    R |= 2;
    var i = ba();
    (ee !== e || ne !== t) && (Ke = null, cn = X() + 500, Pt(e, t));
    do
      try {
        Ed();
        break;
      } catch (u) {
        qa(e, u);
      }
    while (!0);
    vo(), tl.current = i, R = l, G !== null ? t = 0 : (ee = null, ne = 0, t = J);
  }
  if (t !== 0) {
    if (t === 2 && (l = mi(e), l !== 0 && (r = l, t = Bi(e, l))), t === 1) throw n = Jn, Pt(e, 0), ot(e, r), ve(e, X()), n;
    if (t === 6) ot(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !kd(l) && (t = ll(e, r), t === 2 && (i = mi(e), i !== 0 && (r = i, t = Bi(e, i))), t === 1)) throw n = Jn, Pt(e, 0), ot(e, r), ve(e, X()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(x(345));
        case 2:
          Ct(e, de, Ke);
          break;
        case 3:
          if (ot(e, r), (r & 130023424) === r && (t = Lo + 500 - X(), 10 < t)) {
            if (Ar(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              ae(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = Si(Ct.bind(null, e, de, Ke), t);
            break;
          }
          Ct(e, de, Ke);
          break;
        case 4:
          if (ot(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - Me(r);
            i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
          }
          if (r = l, r = X() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * wd(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = Si(Ct.bind(null, e, de, Ke), r);
            break;
          }
          Ct(e, de, Ke);
          break;
        case 5:
          Ct(e, de, Ke);
          break;
        default:
          throw Error(x(329));
      }
    }
  }
  return ve(e, X()), e.callbackNode === n ? Ja.bind(null, e) : null;
}
function Bi(e, t) {
  var n = Rn;
  return e.current.memoizedState.isDehydrated && (Pt(e, t).flags |= 256), e = ll(e, t), e !== 2 && (t = de, de = n, t !== null && Hi(t)), e;
}
function Hi(e) {
  de === null ? de = e : de.push.apply(de, e);
}
function kd(e) {
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
  for (t &= ~To, t &= ~hl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Me(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function Wu(e) {
  if (R & 6) throw Error(x(327));
  nn();
  var t = Ar(e, 0);
  if (!(t & 1)) return ve(e, X()), null;
  var n = ll(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = mi(e);
    r !== 0 && (t = r, n = Bi(e, r));
  }
  if (n === 1) throw n = Jn, Pt(e, 0), ot(e, t), ve(e, X()), n;
  if (n === 6) throw Error(x(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Ct(e, de, Ke), ve(e, X()), null;
}
function Do(e, t) {
  var n = R;
  R |= 1;
  try {
    return e(t);
  } finally {
    R = n, R === 0 && (cn = X() + 500, fl && kt());
  }
}
function Mt(e) {
  st !== null && st.tag === 0 && !(R & 6) && nn();
  var t = R;
  R |= 1;
  var n = ze.transition, r = M;
  try {
    if (ze.transition = null, M = 1, e) return e();
  } finally {
    M = r, ze.transition = n, R = t, !(R & 6) && kt();
  }
}
function Ro() {
  ye = Zt.current, A(Zt);
}
function Pt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, Jf(n)), G !== null) for (n = G.return; n !== null; ) {
    var r = n;
    switch (po(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Qr();
        break;
      case 3:
        sn(), A(me), A(ue), So();
        break;
      case 5:
        ko(r);
        break;
      case 4:
        sn();
        break;
      case 13:
        A(H);
        break;
      case 19:
        A(H);
        break;
      case 10:
        go(r.type._context);
        break;
      case 22:
      case 23:
        Ro();
    }
    n = n.return;
  }
  if (ee = e, G = e = vt(e.current, null), ne = ye = t, J = 0, Jn = null, To = hl = Ot = 0, de = Rn = null, jt !== null) {
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
function qa(e, t) {
  do {
    var n = G;
    try {
      if (vo(), Tr.current = el, br) {
        for (var r = W.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        br = !1;
      }
      if (Rt = 0, b = Z = W = null, Ln = !1, Xn = 0, Po.current = null, n === null || n.return === null) {
        J = 1, Jn = t, G = null;
        break;
      }
      e: {
        var i = e, o = n.return, u = n, s = t;
        if (t = ne, u.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
          var f = s, g = u, v = g.tag;
          if (!(g.mode & 1) && (v === 0 || v === 11 || v === 15)) {
            var h = g.alternate;
            h ? (g.updateQueue = h.updateQueue, g.memoizedState = h.memoizedState, g.lanes = h.lanes) : (g.updateQueue = null, g.memoizedState = null);
          }
          var k = Lu(o);
          if (k !== null) {
            k.flags &= -257, Du(k, o, u, i, t), k.mode & 1 && Tu(i, f, t), t = k, s = f;
            var w = t.updateQueue;
            if (w === null) {
              var S = /* @__PURE__ */ new Set();
              S.add(s), t.updateQueue = S;
            } else w.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              Tu(i, f, t), Oo();
              break e;
            }
            s = Error(x(426));
          }
        } else if (V && u.mode & 1) {
          var O = Lu(o);
          if (O !== null) {
            !(O.flags & 65536) && (O.flags |= 256), Du(O, o, u, i, t), mo(an(s, u));
            break e;
          }
        }
        i = s = an(s, u), J !== 4 && (J = 2), Rn === null ? Rn = [i] : Rn.push(i), i = o;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, t &= -t, i.lanes |= t;
              var d = Ma(i, s, t);
              _u(i, d);
              break e;
            case 1:
              u = s;
              var a = i.type, p = i.stateNode;
              if (!(i.flags & 128) && (typeof a.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (mt === null || !mt.has(p)))) {
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var y = Ia(i, u, t);
                _u(i, y);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      tc(n);
    } catch (m) {
      t = m, G === n && n !== null && (G = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function ba() {
  var e = tl.current;
  return tl.current = el, e === null ? el : e;
}
function Oo() {
  (J === 0 || J === 3 || J === 2) && (J = 4), ee === null || !(Ot & 268435455) && !(hl & 268435455) || ot(ee, ne);
}
function ll(e, t) {
  var n = R;
  R |= 2;
  var r = ba();
  (ee !== e || ne !== t) && (Ke = null, Pt(e, t));
  do
    try {
      Sd();
      break;
    } catch (l) {
      qa(e, l);
    }
  while (!0);
  if (vo(), R = n, tl.current = r, G !== null) throw Error(x(261));
  return ee = null, ne = 0, J;
}
function Sd() {
  for (; G !== null; ) ec(G);
}
function Ed() {
  for (; G !== null && !Yc(); ) ec(G);
}
function ec(e) {
  var t = rc(e.alternate, e, ye);
  e.memoizedProps = e.pendingProps, t === null ? tc(e) : G = t, Po.current = null;
}
function tc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = vd(n, t), n !== null) {
        n.flags &= 32767, G = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        J = 6, G = null;
        return;
      }
    } else if (n = hd(n, t, ye), n !== null) {
      G = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      G = t;
      return;
    }
    G = t = e;
  } while (t !== null);
  J === 0 && (J = 5);
}
function Ct(e, t, n) {
  var r = M, l = ze.transition;
  try {
    ze.transition = null, M = 1, _d(e, t, n, r);
  } finally {
    ze.transition = l, M = r;
  }
  return null;
}
function _d(e, t, n, r) {
  do
    nn();
  while (st !== null);
  if (R & 6) throw Error(x(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(x(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (rf(e, i), e === ee && (G = ee = null, ne = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || wr || (wr = !0, lc($r, function() {
    return nn(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = ze.transition, ze.transition = null;
    var o = M;
    M = 1;
    var u = R;
    R |= 4, Po.current = null, yd(e, n), Ga(n, e), Wf(wi), Vr = !!xi, wi = xi = null, e.current = n, xd(n), Xc(), R = u, M = o, ze.transition = i;
  } else e.current = n;
  if (wr && (wr = !1, st = e, rl = l), i = e.pendingLanes, i === 0 && (mt = null), Jc(n.stateNode), ve(e, X()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if (nl) throw nl = !1, e = Ai, Ai = null, e;
  return rl & 1 && e.tag !== 0 && nn(), i = e.pendingLanes, i & 1 ? e === Vi ? On++ : (On = 0, Vi = e) : On = 0, kt(), null;
}
function nn() {
  if (st !== null) {
    var e = Ms(rl), t = ze.transition, n = M;
    try {
      if (ze.transition = null, M = 16 > e ? 16 : e, st === null) var r = !1;
      else {
        if (e = st, st = null, rl = 0, R & 6) throw Error(x(331));
        var l = R;
        for (R |= 4, _ = e.current; _ !== null; ) {
          var i = _, o = i.child;
          if (_.flags & 16) {
            var u = i.deletions;
            if (u !== null) {
              for (var s = 0; s < u.length; s++) {
                var f = u[s];
                for (_ = f; _ !== null; ) {
                  var g = _;
                  switch (g.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Dn(8, g, i);
                  }
                  var v = g.child;
                  if (v !== null) v.return = g, _ = v;
                  else for (; _ !== null; ) {
                    g = _;
                    var h = g.sibling, k = g.return;
                    if (Ka(g), g === f) {
                      _ = null;
                      break;
                    }
                    if (h !== null) {
                      h.return = k, _ = h;
                      break;
                    }
                    _ = k;
                  }
                }
              }
              var w = i.alternate;
              if (w !== null) {
                var S = w.child;
                if (S !== null) {
                  w.child = null;
                  do {
                    var O = S.sibling;
                    S.sibling = null, S = O;
                  } while (S !== null);
                }
              }
              _ = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) o.return = i, _ = o;
          else e: for (; _ !== null; ) {
            if (i = _, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                Dn(9, i, i.return);
            }
            var d = i.sibling;
            if (d !== null) {
              d.return = i.return, _ = d;
              break e;
            }
            _ = i.return;
          }
        }
        var a = e.current;
        for (_ = a; _ !== null; ) {
          o = _;
          var p = o.child;
          if (o.subtreeFlags & 2064 && p !== null) p.return = o, _ = p;
          else e: for (o = a; _ !== null; ) {
            if (u = _, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  ml(9, u);
              }
            } catch (m) {
              K(u, u.return, m);
            }
            if (u === o) {
              _ = null;
              break e;
            }
            var y = u.sibling;
            if (y !== null) {
              y.return = u.return, _ = y;
              break e;
            }
            _ = u.return;
          }
        }
        if (R = l, kt(), Be && typeof Be.onPostCommitFiberRoot == "function") try {
          Be.onPostCommitFiberRoot(ol, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      M = n, ze.transition = t;
    }
  }
  return !1;
}
function Qu(e, t, n) {
  t = an(n, t), t = Ma(e, t, 1), e = pt(e, t, 1), t = ae(), e !== null && (bn(e, 1, t), ve(e, t));
}
function K(e, t, n) {
  if (e.tag === 3) Qu(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Qu(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (mt === null || !mt.has(r))) {
        e = an(n, e), e = Ia(t, e, 1), t = pt(t, e, 1), e = ae(), t !== null && (bn(t, 1, e), ve(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Cd(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = ae(), e.pingedLanes |= e.suspendedLanes & n, ee === e && (ne & n) === n && (J === 4 || J === 3 && (ne & 130023424) === ne && 500 > X() - Lo ? Pt(e, 0) : To |= n), ve(e, t);
}
function nc(e, t) {
  t === 0 && (e.mode & 1 ? (t = cr, cr <<= 1, !(cr & 130023424) && (cr = 4194304)) : t = 1);
  var n = ae();
  e = be(e, t), e !== null && (bn(e, t, n), ve(e, n));
}
function Nd(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), nc(e, n);
}
function jd(e, t) {
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
  r !== null && r.delete(t), nc(e, n);
}
var rc;
rc = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || me.current) pe = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return pe = !1, md(e, t, n);
    pe = !!(e.flags & 131072);
  }
  else pe = !1, V && t.flags & 1048576 && ua(t, Xr, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      Dr(e, t), e = t.pendingProps;
      var l = ln(t, ue.current);
      tn(t, n), l = _o(null, t, r, e, l, n);
      var i = Co();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, he(r) ? (i = !0, Kr(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, xo(t), l.updater = pl, t.stateNode = l, l._reactInternals = t, Pi(t, r, e, n), t = Di(null, t, r, !0, i, n)) : (t.tag = 0, V && i && fo(t), se(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (Dr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Pd(r), e = De(r, e), l) {
          case 0:
            t = Li(null, t, r, e, n);
            break e;
          case 1:
            t = Mu(null, t, r, e, n);
            break e;
          case 11:
            t = Ru(null, t, r, e, n);
            break e;
          case 14:
            t = Ou(null, t, r, De(r.type, e), n);
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
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Li(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Mu(e, t, r, l, n);
    case 3:
      e: {
        if (Aa(t), e === null) throw Error(x(387));
        r = t.pendingProps, i = t.memoizedState, l = i.element, pa(e, t), Jr(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
          l = an(Error(x(423)), t), t = Iu(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = an(Error(x(424)), t), t = Iu(e, t, r, n, l);
          break e;
        } else for (xe = dt(t.stateNode.containerInfo.firstChild), we = t, V = !0, Oe = null, n = fa(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (on(), r === l) {
            t = et(e, t, n);
            break e;
          }
          se(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return ma(t), e === null && Ni(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, ki(r, l) ? o = null : i !== null && ki(r, i) && (t.flags |= 32), $a(e, t), se(e, t, o, n), t.child;
    case 6:
      return e === null && Ni(t), null;
    case 13:
      return Va(e, t, n);
    case 4:
      return wo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = un(t, null, r, n) : se(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Ru(e, t, r, l, n);
    case 7:
      return se(e, t, t.pendingProps, n), t.child;
    case 8:
      return se(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return se(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, F(Gr, r._currentValue), r._currentValue = o, i !== null) if (Fe(i.value, o)) {
          if (i.children === l.children && !me.current) {
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
                  var f = i.updateQueue;
                  if (f !== null) {
                    f = f.shared;
                    var g = f.pending;
                    g === null ? s.next = s : (s.next = g.next, g.next = s), f.pending = s;
                  }
                }
                i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), ji(
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
            o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), ji(o, n, t), o = i.sibling;
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
        se(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, r = t.pendingProps.children, tn(t, n), l = Pe(l), r = r(l), t.flags |= 1, se(e, t, r, n), t.child;
    case 14:
      return r = t.type, l = De(r, t.pendingProps), l = De(r.type, l), Ou(e, t, r, l, n);
    case 15:
      return Fa(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Dr(e, t), t.tag = 1, he(r) ? (e = !0, Kr(t)) : e = !1, tn(t, n), Oa(t, r, l), Pi(t, r, l, n), Di(null, t, r, !0, e, n);
    case 19:
      return Ba(e, t, n);
    case 22:
      return Ua(e, t, n);
  }
  throw Error(x(156, t.tag));
};
function lc(e, t) {
  return Ls(e, t);
}
function zd(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function je(e, t, n, r) {
  return new zd(e, t, n, r);
}
function Mo(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Pd(e) {
  if (typeof e == "function") return Mo(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === bi) return 11;
    if (e === eo) return 14;
  }
  return 2;
}
function vt(e, t) {
  var n = e.alternate;
  return n === null ? (n = je(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Mr(e, t, n, r, l, i) {
  var o = 2;
  if (r = e, typeof e == "function") Mo(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case At:
      return Tt(n.children, l, i, t);
    case qi:
      o = 8, l |= 8;
      break;
    case bl:
      return e = je(12, n, t, l | 2), e.elementType = bl, e.lanes = i, e;
    case ei:
      return e = je(13, n, t, l), e.elementType = ei, e.lanes = i, e;
    case ti:
      return e = je(19, n, t, l), e.elementType = ti, e.lanes = i, e;
    case ms:
      return vl(n, l, i, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case ds:
          o = 10;
          break e;
        case ps:
          o = 9;
          break e;
        case bi:
          o = 11;
          break e;
        case eo:
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
  return e = je(22, e, r, t), e.elementType = ms, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function Gl(e, t, n) {
  return e = je(6, e, null, t), e.lanes = n, e;
}
function Zl(e, t, n) {
  return t = je(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Td(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Tl(0), this.expirationTimes = Tl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Tl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function Io(e, t, n, r, l, i, o, u, s) {
  return e = new Td(e, t, n, u, s), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = je(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xo(i), e;
}
function Ld(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: $t, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function ic(e) {
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
          if (he(t.type)) {
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
    if (he(n)) return ia(e, n, t);
  }
  return t;
}
function oc(e, t, n, r, l, i, o, u, s) {
  return e = Io(n, r, !0, e, l, i, o, u, s), e.context = ic(null), n = e.current, r = ae(), l = ht(n), i = Ze(r, l), i.callback = t ?? null, pt(n, i, l), e.current.lanes = l, bn(e, l, r), ve(e, r), e;
}
function gl(e, t, n, r) {
  var l = t.current, i = ae(), o = ht(l);
  return n = ic(n), t.context === null ? t.context = n : t.pendingContext = n, t = Ze(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = pt(l, t, o), e !== null && (Ie(e, l, o, i), Pr(e, l, o)), o;
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
function Ku(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Fo(e, t) {
  Ku(e, t), (e = e.alternate) && Ku(e, t);
}
function Dd() {
  return null;
}
var uc = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function Uo(e) {
  this._internalRoot = e;
}
yl.prototype.render = Uo.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(x(409));
  gl(e, t, null, null);
};
yl.prototype.unmount = Uo.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Mt(function() {
      gl(null, e, null, null);
    }), t[qe] = null;
  }
};
function yl(e) {
  this._internalRoot = e;
}
yl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = Us();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < it.length && t !== 0 && t < it[n].priority; n++) ;
    it.splice(n, 0, e), n === 0 && As(e);
  }
};
function $o(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function xl(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Yu() {
}
function Rd(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var f = il(o);
        i.call(f);
      };
    }
    var o = oc(t, r, e, 0, null, !1, !1, "", Yu);
    return e._reactRootContainer = o, e[qe] = o.current, Hn(e.nodeType === 8 ? e.parentNode : e), Mt(), o;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var f = il(s);
      u.call(f);
    };
  }
  var s = Io(e, 0, !1, null, null, !1, !1, "", Yu);
  return e._reactRootContainer = s, e[qe] = s.current, Hn(e.nodeType === 8 ? e.parentNode : e), Mt(function() {
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
  } else o = Rd(n, t, e, l, r);
  return il(o);
}
Is = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = _n(t.pendingLanes);
        n !== 0 && (ro(t, n | 1), ve(t, X()), !(R & 6) && (cn = X() + 500, kt()));
      }
      break;
    case 13:
      Mt(function() {
        var r = be(e, 1);
        if (r !== null) {
          var l = ae();
          Ie(r, e, 1, l);
        }
      }), Fo(e, 1);
  }
};
lo = function(e) {
  if (e.tag === 13) {
    var t = be(e, 134217728);
    if (t !== null) {
      var n = ae();
      Ie(t, e, 134217728, n);
    }
    Fo(e, 134217728);
  }
};
Fs = function(e) {
  if (e.tag === 13) {
    var t = ht(e), n = be(e, t);
    if (n !== null) {
      var r = ae();
      Ie(n, e, t, r);
    }
    Fo(e, t);
  }
};
Us = function() {
  return M;
};
$s = function(e, t) {
  var n = M;
  try {
    return M = e, t();
  } finally {
    M = n;
  }
};
fi = function(e, t, n) {
  switch (t) {
    case "input":
      if (li(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = cl(r);
            if (!l) throw Error(x(90));
            vs(r), li(r, l);
          }
        }
      }
      break;
    case "textarea":
      ys(e, n);
      break;
    case "select":
      t = n.value, t != null && Jt(e, !!n.multiple, t, !1);
  }
};
Cs = Do;
Ns = Mt;
var Od = { usingClientEntryPoint: !1, Events: [tr, Wt, cl, Es, _s, Do] }, kn = { findFiberByHostInstance: Nt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Md = { bundleType: kn.bundleType, version: kn.version, rendererPackageName: kn.rendererPackageName, rendererConfig: kn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: tt.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Ps(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: kn.findFiberByHostInstance || Dd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var kr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!kr.isDisabled && kr.supportsFiber) try {
    ol = kr.inject(Md), Be = kr;
  } catch {
  }
}
Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Od;
Se.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!$o(t)) throw Error(x(200));
  return Ld(e, t, null, n);
};
Se.createRoot = function(e, t) {
  if (!$o(e)) throw Error(x(299));
  var n = !1, r = "", l = uc;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[qe] = t.current, Hn(e.nodeType === 8 ? e.parentNode : e), new Uo(t);
};
Se.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(x(188)) : (e = Object.keys(e).join(","), Error(x(268, e)));
  return e = Ps(t), e = e === null ? null : e.stateNode, e;
};
Se.flushSync = function(e) {
  return Mt(e);
};
Se.hydrate = function(e, t, n) {
  if (!xl(t)) throw Error(x(200));
  return wl(null, e, t, !0, n);
};
Se.hydrateRoot = function(e, t, n) {
  if (!$o(e)) throw Error(x(405));
  var r = n != null && n.hydratedSources || null, l = !1, i = "", o = uc;
  if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = oc(t, null, e, 1, n ?? null, l, !1, i, o), e[qe] = t.current, Hn(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
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
  return e._reactRootContainer ? (Mt(function() {
    wl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[qe] = null;
    });
  }), !0) : !1;
};
Se.unstable_batchedUpdates = Do;
Se.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!xl(n)) throw Error(x(200));
  if (e == null || e._reactInternals === void 0) throw Error(x(38));
  return wl(e, t, n, !1, r);
};
Se.version = "18.3.1-next-f1338f8080-20240426";
function sc() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(sc);
    } catch (e) {
      console.error(e);
    }
}
sc(), ss.exports = Se;
var Id = ss.exports, ac, Xu = Id;
ac = Xu.createRoot, Xu.hydrateRoot;
var cc = { exports: {} }, kl = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fd = L, Ud = Symbol.for("react.element"), $d = Symbol.for("react.fragment"), Ad = Object.prototype.hasOwnProperty, Vd = Fd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Bd = { key: !0, ref: !0, __self: !0, __source: !0 };
function fc(e, t, n) {
  var r, l = {}, i = null, o = null;
  n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Ad.call(t, r) && !Bd.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
  return { $$typeof: Ud, type: e, key: i, ref: o, props: l, _owner: Vd.current };
}
kl.Fragment = $d;
kl.jsx = fc;
kl.jsxs = fc;
cc.exports = kl;
var c = cc.exports;
const Hd = "title_classifier/v3";
function Wi(e) {
  const t = (n, r = {}) => e.callWS({ type: `${Hd}/${n}`, ...r });
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
function Wd(e, t, n) {
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
function Qd(e, t, n) {
  return e.map((r) => Wd(r, t[r.id], n[r.id]));
}
function Kd(e, t, n) {
  return { ...e, [t]: { enum: n } };
}
function Gu(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function Zu(e, t, n) {
  return { ...e, [t]: n };
}
function Jl(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function Yd(e, t, n) {
  return e.map((r) => r.id === t ? { ...r, enum: n } : r);
}
function Xd(e, t, n) {
  const r = t[n];
  if (r === void 0) return !1;
  const l = e.find((i) => i.id === n);
  return l === void 0 || r.enum !== l.enum;
}
const Gd = 5e3;
function Zd(e) {
  const [t, n] = L.useState([]), [r, l] = L.useState([]), [i, o] = L.useState({}), [u, s] = L.useState({}), [f, g] = L.useState(!1), [v, h] = L.useState(null), [k, w] = L.useState(null), [S, O] = L.useState(!1), d = L.useRef(e);
  d.current = e;
  const a = L.useRef(i);
  a.current = i;
  const p = L.useRef(!1), y = L.useRef(!1), m = L.useCallback(async () => {
    const I = d.current;
    if (!(!I || p.current)) {
      p.current = !0, O(!0);
      try {
        const B = Wi(I), [_e, Ue] = await Promise.all([
          B.listSources(),
          B.listEntries({ include_hidden: !0, limit: 2e4 })
        ]);
        n(_e), l(Ue), g(!0), h(null), w((/* @__PURE__ */ new Date()).toLocaleTimeString());
      } catch (B) {
        g(!1), h(B instanceof Error ? B.message : String(B));
      } finally {
        O(!1), p.current = !1;
      }
    }
  }, []);
  L.useEffect(() => {
    m();
    const I = window.setInterval(m, Gd);
    return () => window.clearInterval(I);
  }, [m]), L.useEffect(() => {
    e && !y.current && (y.current = !0, m());
  }, [e, m]);
  const E = L.useCallback((I, B) => {
    o((_e) => Kd(_e, I, B)), s((_e) => Jl(_e, I));
  }, []), C = L.useCallback((I) => {
    o((B) => Gu(B, I)), s((B) => Jl(B, I));
  }, []), j = L.useCallback(
    async (I) => {
      const B = d.current, _e = a.current[I];
      if (!(!B || _e === void 0)) {
        s((Ue) => Zu(Ue, I, { saving: !0, error: null }));
        try {
          const We = await Wi(B).setEnum(I, _e.enum);
          if (!We || !We.ok) throw new Error("set_enum rejected");
          l((Qe) => Yd(Qe, I, We.enum ?? _e.enum)), o((Qe) => Gu(Qe, I)), s((Qe) => Jl(Qe, I)), m();
        } catch (Ue) {
          s(
            (We) => Zu(We, I, {
              saving: !1,
              error: Ue instanceof Error ? Ue.message : String(Ue)
            })
          );
        }
      }
    },
    [m]
  ), U = L.useMemo(
    () => Qd(r, i, u),
    [r, i, u]
  ), T = L.useCallback(
    (I) => Xd(r, i, I),
    [r, i]
  ), ge = L.useCallback(
    (I) => U.find((B) => B.id === I),
    [U]
  );
  return {
    sources: t,
    entries: r,
    displayEntries: U,
    entryCount: f ? r.length : null,
    connected: f,
    error: v,
    lastSync: k,
    loading: S,
    refresh: m,
    setDraftEnum: E,
    resetDraft: C,
    applyDraft: j,
    isDirty: T,
    getDisplayEntry: ge,
    dirtyCount: Object.keys(i).length
  };
}
const dc = [
  { id: "overview", label: "Übersicht", icon: "▦", desc: "Systemzustand & aktuelles Tagebuch" },
  { id: "inbox", label: "Inbox", icon: "✉", desc: "Unklassifizierte Einträge abarbeiten" },
  { id: "diary", label: "Tagebuch", icon: "⏱", desc: "Verlauf der Sichtungen" },
  { id: "catalog", label: "Katalog", icon: "▤", desc: "Bibliothek & Pflege" },
  { id: "io", label: "Import / Export", icon: "⇅", desc: "v3-JSON, bildfrei" },
  { id: "settings", label: "Einstellungen", icon: "⚙", desc: "Watcher, DB, Theme, Debug" }
];
function Jd({ current: e, onSelect: t }) {
  return /* @__PURE__ */ c.jsxs("aside", { className: "tc-sidebar", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "tc-brand", children: [
      /* @__PURE__ */ c.jsx("div", { className: "logo", children: "TC" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("div", { className: "title", children: "Title Classifier" }),
        /* @__PURE__ */ c.jsx("div", { className: "sub", children: "v3 · Verwaltung" })
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("nav", { className: "tc-nav", children: dc.map((n) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        className: n.id === e ? "active" : "",
        onClick: () => t(n.id),
        title: n.desc,
        children: [
          /* @__PURE__ */ c.jsx("span", { className: "ico", children: n.icon }),
          /* @__PURE__ */ c.jsx("span", { children: n.label })
        ]
      },
      n.id
    )) }),
    /* @__PURE__ */ c.jsx("div", { className: "foot", children: "Title Classifier v3.1 · UX" })
  ] });
}
function qd(e) {
  e.dispatchEvent(
    new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 })
  );
}
function bd({ title: e, desc: t, loading: n, onRefresh: r }) {
  const l = L.useRef(null);
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-cmdbar", children: [
    /* @__PURE__ */ c.jsx(
      "button",
      {
        ref: l,
        className: "tc-btn tc-menu-btn",
        title: "Menü",
        onClick: () => l.current && qd(l.current),
        children: "☰"
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h1", { children: e }),
      /* @__PURE__ */ c.jsx("div", { className: "desc", children: t })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "spacer" }),
    r ? /* @__PURE__ */ c.jsxs("button", { className: "tc-btn", onClick: r, disabled: n, children: [
      n ? "…" : "↻",
      " Aktualisieren"
    ] }) : null
  ] });
}
function ep({
  connected: e,
  entryCount: t,
  selectedCount: n,
  lastSync: r,
  error: l,
  watcherCount: i
}) {
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-statusbar", children: [
    /* @__PURE__ */ c.jsxs("span", { children: [
      /* @__PURE__ */ c.jsx("span", { className: `dot ${e ? "ok" : "bad"}` }),
      e ? "verbunden" : "getrennt"
    ] }),
    i !== void 0 ? /* @__PURE__ */ c.jsxs("span", { children: [
      "Watcher: ",
      i
    ] }) : null,
    /* @__PURE__ */ c.jsxs("span", { children: [
      "Einträge: ",
      t ?? "—"
    ] }),
    /* @__PURE__ */ c.jsxs("span", { children: [
      "Auswahl: ",
      n
    ] }),
    /* @__PURE__ */ c.jsxs("span", { children: [
      "Letzter Sync: ",
      r ?? "—"
    ] }),
    l ? /* @__PURE__ */ c.jsxs("span", { style: { color: "var(--tc-danger)" }, children: [
      "Fehler: ",
      l
    ] }) : null,
    /* @__PURE__ */ c.jsx("span", { className: "right", children: "Title Classifier v3" })
  ] });
}
const tp = {
  music: "Musik",
  game: "Spiel",
  video: "Video"
};
function np({ s: e }) {
  const t = !!e.current_key;
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-watcher", children: [
    e.current_artwork ? /* @__PURE__ */ c.jsx(
      "img",
      {
        className: "tc-art",
        src: e.current_artwork,
        alt: "",
        onError: (n) => n.currentTarget.style.display = "none"
      }
    ) : /* @__PURE__ */ c.jsx("div", { className: "tc-art tc-art-fallback", children: e.online ? "♪" : "·" }),
    /* @__PURE__ */ c.jsxs("div", { className: "tc-w-main", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "tc-w-head", children: [
        /* @__PURE__ */ c.jsx("span", { className: "tc-w-name", children: e.name }),
        /* @__PURE__ */ c.jsx("span", { className: `badge ${e.media_type}`, children: tp[e.media_type] }),
        /* @__PURE__ */ c.jsx("span", { className: "badge", children: e.context }),
        /* @__PURE__ */ c.jsx("span", { className: "badge", children: e.signal_type }),
        /* @__PURE__ */ c.jsx("span", { className: `badge ${e.online ? "ok" : "off"}`, children: e.online ? "online" : "offline" })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: `tc-w-cur ${t ? "" : "muted"}`, children: t ? `▶ ${e.current_key}` : "— inaktiv —" }),
      /* @__PURE__ */ c.jsxs("div", { className: "tc-w-meta", children: [
        /* @__PURE__ */ c.jsxs("span", { children: [
          "Effective Enum: ",
          /* @__PURE__ */ c.jsx("b", { className: "tc-enum", children: e.current_enum ?? "—" })
        ] }),
        /* @__PURE__ */ c.jsxs("span", { children: [
          e.entry_count,
          " Einträge · ",
          e.unmapped_count,
          " offen"
        ] })
      ] })
    ] })
  ] });
}
function rp({ store: e }) {
  const { sources: t, entryCount: n, connected: r, error: l, lastSync: i } = e, o = t.filter((f) => f.online).length, u = t.reduce((f, g) => f + g.unmapped_count, 0), s = t.filter((f) => f.current_key);
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-page", children: [
    l ? /* @__PURE__ */ c.jsxs("div", { className: "tc-card tc-error", children: [
      "Verbindungsfehler: ",
      l,
      " — letzte bekannte Daten werden angezeigt."
    ] }) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "tc-stats", children: [
      /* @__PURE__ */ c.jsx(Sr, { label: "Watcher", value: t.length }),
      /* @__PURE__ */ c.jsx(Sr, { label: "Online", value: `${o}/${t.length}` }),
      /* @__PURE__ */ c.jsx(Sr, { label: "Einträge", value: n ?? "—" }),
      /* @__PURE__ */ c.jsx(Sr, { label: "Unklassifiziert", value: u })
    ] }),
    /* @__PURE__ */ c.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Jetzt aktiv" }),
      s.length ? /* @__PURE__ */ c.jsx("div", { className: "tc-active", children: s.map((f) => /* @__PURE__ */ c.jsxs("div", { className: "tc-active-row", children: [
        /* @__PURE__ */ c.jsx("span", { className: "tc-active-name", children: f.name }),
        /* @__PURE__ */ c.jsx("span", { className: "tc-active-key", children: f.current_key }),
        /* @__PURE__ */ c.jsx("span", { className: "tc-enum", children: f.current_enum ?? "—" })
      ] }, f.entry_id)) }) : /* @__PURE__ */ c.jsx("div", { className: "tc-placeholder", children: "Aktuell spielt nichts." })
    ] }),
    /* @__PURE__ */ c.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Watcher" }),
      t.length ? /* @__PURE__ */ c.jsx("div", { className: "tc-watchers", children: t.map((f) => /* @__PURE__ */ c.jsx(np, { s: f }, f.entry_id)) }) : /* @__PURE__ */ c.jsx("div", { className: "tc-placeholder", children: r ? "Keine v3-Watcher konfiguriert." : "Verbinde mit Home Assistant …" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "tc-syshint", children: [
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
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-stat", children: [
    /* @__PURE__ */ c.jsx("div", { className: "tc-stat-val", children: t }),
    /* @__PURE__ */ c.jsx("div", { className: "tc-stat-label", children: e })
  ] });
}
const Ju = { detail: null, loading: !1, error: null };
function lp(e, t) {
  const [n, r] = L.useState(Ju), l = L.useRef(e);
  return l.current = e, L.useEffect(() => {
    const i = l.current;
    if (!t || !i) {
      r(Ju);
      return;
    }
    let o = !1;
    return r((u) => ({
      detail: u.detail && u.detail.id === t ? u.detail : null,
      loading: !0,
      error: null
    })), Wi(i).entryDetail(t).then((u) => {
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
function ip(e, t) {
  const n = Er(e.last_seen), r = Er(t.last_seen);
  if (n !== r) return r - n;
  const l = Er(e.first_seen), i = Er(t.first_seen);
  return l !== i ? i - l : e.key.localeCompare(t.key);
}
function op(e) {
  return [...e].sort(ip);
}
const up = ["music", "game", "video"], sp = [
  "homepod",
  "pc",
  "ps5",
  "switch",
  "stash",
  "apple_tv"
], ap = ["title", "app"], cp = Array.from({ length: 10 }, (e, t) => t);
function pc({ value: e, onChange: t, dirty: n, disabled: r }) {
  return /* @__PURE__ */ c.jsx(
    "select",
    {
      className: `tc-select tc-enum-select ${n ? "dirty" : ""}`,
      value: e,
      disabled: r,
      onChange: (l) => t(parseInt(l.target.value, 10)),
      onClick: (l) => l.stopPropagation(),
      children: cp.map((l) => /* @__PURE__ */ c.jsx("option", { value: l, children: l }, l))
    }
  );
}
function qu(e) {
  if (!e) return "—";
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function fp({
  entry: e,
  detail: t,
  artwork: n,
  onDraftEnum: r,
  onApply: l,
  onReset: i
}) {
  if (!e)
    return /* @__PURE__ */ c.jsx("aside", { className: "tc-detail", children: /* @__PURE__ */ c.jsx("div", { className: "tc-placeholder", children: "Eintrag auswählen, um Details zu sehen." }) });
  const o = t.detail && t.detail.id === e.id ? t.detail : null;
  return /* @__PURE__ */ c.jsxs("aside", { className: "tc-detail", children: [
    n ? /* @__PURE__ */ c.jsx(
      "img",
      {
        className: "tc-detail-art",
        src: n,
        alt: "",
        onError: (u) => u.currentTarget.style.display = "none"
      }
    ) : null,
    /* @__PURE__ */ c.jsx("h3", { className: "tc-detail-title", children: e.key }),
    /* @__PURE__ */ c.jsxs("div", { className: "tc-detail-badges", children: [
      /* @__PURE__ */ c.jsx("span", { className: `badge ${e.media_type}`, children: e.media_type }),
      /* @__PURE__ */ c.jsx("span", { className: "badge", children: e.signal_type }),
      e.hidden ? /* @__PURE__ */ c.jsx("span", { className: "badge off", children: "versteckt" }) : null,
      e.is_variant ? /* @__PURE__ */ c.jsx("span", { className: "badge", children: "Variante" }) : null,
      e.is_current ? /* @__PURE__ */ c.jsx("span", { className: "badge ok", children: "aktiv" }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("dl", { className: "tc-detail-grid", children: [
      /* @__PURE__ */ c.jsx("dt", { children: "Enum" }),
      /* @__PURE__ */ c.jsx("dd", { children: /* @__PURE__ */ c.jsx(
        pc,
        {
          value: e.enum,
          onChange: (u) => r(e.id, u),
          dirty: e.dirty
        }
      ) }),
      /* @__PURE__ */ c.jsx("dt", { children: "Effective (live)" }),
      /* @__PURE__ */ c.jsx("dd", { children: e.is_current ? e.effective_enum ?? "—" : "—" }),
      /* @__PURE__ */ c.jsx("dt", { children: "Server-Enum" }),
      /* @__PURE__ */ c.jsx("dd", { children: e.serverEnum }),
      /* @__PURE__ */ c.jsx("dt", { children: "Sichtungen" }),
      /* @__PURE__ */ c.jsx("dd", { children: o ? o.seen_count : e.seen_count }),
      /* @__PURE__ */ c.jsx("dt", { children: "Zuletzt" }),
      /* @__PURE__ */ c.jsx("dd", { children: qu(o ? o.last_seen : e.last_seen) }),
      /* @__PURE__ */ c.jsx("dt", { children: "Erstmals" }),
      /* @__PURE__ */ c.jsx("dd", { children: qu(o ? o.first_seen : e.first_seen) })
    ] }),
    o?.parent ? /* @__PURE__ */ c.jsxs("div", { className: "tc-detail-parent", children: [
      "Master: ",
      /* @__PURE__ */ c.jsx("b", { children: o.parent.key }),
      " (Enum ",
      o.parent.enum,
      ") — erbt Enum vom Master"
    ] }) : null,
    /* @__PURE__ */ c.jsxs("section", { className: "tc-detail-section", children: [
      /* @__PURE__ */ c.jsxs("h4", { children: [
        "Kontexte ",
        t.loading ? "…" : o ? `(${o.contexts.length})` : ""
      ] }),
      t.error ? /* @__PURE__ */ c.jsxs("div", { className: "tc-detail-error", children: [
        "Detail-Fehler: ",
        t.error
      ] }) : null,
      o && o.contexts.length ? /* @__PURE__ */ c.jsxs("table", { className: "tc-ctx-table", children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("th", { children: "Kontext" }),
          /* @__PURE__ */ c.jsx("th", { children: "App" }),
          /* @__PURE__ */ c.jsx("th", { children: "Override" }),
          /* @__PURE__ */ c.jsx("th", { children: "Eff." }),
          /* @__PURE__ */ c.jsx("th", { children: "Sicht." })
        ] }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: o.contexts.map((u) => /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("td", { children: u.context }),
          /* @__PURE__ */ c.jsx("td", { className: "tc-muted", children: u.source_app || "—" }),
          /* @__PURE__ */ c.jsx("td", { children: u.enum_override ?? "—" }),
          /* @__PURE__ */ c.jsx("td", { children: u.effective_preview }),
          /* @__PURE__ */ c.jsx("td", { className: "tc-muted", children: u.seen_count })
        ] }, `${u.context}/${u.source_app}`)) })
      ] }) : o ? /* @__PURE__ */ c.jsx("div", { className: "tc-muted", children: "Noch keine Kontexte beobachtet." }) : null
    ] }),
    o && o.variants.length ? /* @__PURE__ */ c.jsxs("section", { className: "tc-detail-section", children: [
      /* @__PURE__ */ c.jsxs("h4", { children: [
        "Varianten (",
        o.variants.length,
        ")"
      ] }),
      /* @__PURE__ */ c.jsx("ul", { className: "tc-variants", children: o.variants.map((u) => /* @__PURE__ */ c.jsxs("li", { children: [
        u.key,
        " ",
        /* @__PURE__ */ c.jsxs("span", { className: "tc-muted", children: [
          "(Enum ",
          u.enum,
          ")"
        ] })
      ] }, u.id)) })
    ] }) : null,
    e.saveError ? /* @__PURE__ */ c.jsxs("div", { className: "tc-detail-error", children: [
      "Fehler: ",
      e.saveError
    ] }) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "tc-detail-actions", children: [
      /* @__PURE__ */ c.jsx(
        "button",
        {
          className: "tc-btn primary",
          disabled: !e.dirty || e.saving,
          onClick: () => l(e.id),
          children: e.saving ? "…" : "Apply"
        }
      ),
      /* @__PURE__ */ c.jsx(
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
function dp(e) {
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function pp({ store: e, hass: t }) {
  const [n, r] = L.useState(""), [l, i] = L.useState(""), [o, u] = L.useState(""), [s, f] = L.useState(""), [g, v] = L.useState(!1), [h, k] = L.useState(/* @__PURE__ */ new Set()), [w, S] = L.useState(null), O = L.useMemo(
    () => op(
      e.displayEntries.filter((m) => !(m.parent_id !== null || m.serverEnum !== 0 || !g && m.hidden || l && m.media_type !== l || o && m.signal_type !== o || s && m.current_context !== s || n && !m.key.toLowerCase().includes(n.toLowerCase())))
    ),
    [e.displayEntries, g, l, o, s, n]
  ), d = (m) => k((E) => {
    const C = new Set(E);
    return C.has(m) ? C.delete(m) : C.add(m), C;
  }), a = w ? e.getDisplayEntry(w) : void 0, p = lp(t, w), y = w ? e.sources.find((m) => m.current_entry_id === w)?.current_artwork ?? null : null;
  return /* @__PURE__ */ c.jsxs("div", { className: "tc-inbox", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "tc-inbox-main", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "tc-filters", children: [
        /* @__PURE__ */ c.jsx(
          "input",
          {
            className: "tc-input",
            type: "search",
            placeholder: "Suche …",
            value: n,
            onChange: (m) => r(m.target.value)
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "select",
          {
            className: "tc-select",
            value: l,
            onChange: (m) => i(m.target.value),
            children: [
              /* @__PURE__ */ c.jsx("option", { value: "", children: "Medienart: Alle" }),
              up.map((m) => /* @__PURE__ */ c.jsx("option", { value: m, children: m }, m))
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "select",
          {
            className: "tc-select",
            value: s,
            onChange: (m) => f(m.target.value),
            children: [
              /* @__PURE__ */ c.jsx("option", { value: "", children: "Kontext: Alle" }),
              sp.map((m) => /* @__PURE__ */ c.jsx("option", { value: m, children: m }, m))
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "select",
          {
            className: "tc-select",
            value: o,
            onChange: (m) => u(m.target.value),
            children: [
              /* @__PURE__ */ c.jsx("option", { value: "", children: "Signal: Alle" }),
              ap.map((m) => /* @__PURE__ */ c.jsx("option", { value: m, children: m }, m))
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("label", { className: "tc-check", children: [
          /* @__PURE__ */ c.jsx(
            "input",
            {
              type: "checkbox",
              checked: g,
              onChange: (m) => v(m.target.checked)
            }
          ),
          "versteckte"
        ] }),
        /* @__PURE__ */ c.jsxs("span", { className: "tc-filters-info", children: [
          O.length,
          " Einträge · Auswahl ",
          h.size,
          " · offen",
          " ",
          e.dirtyCount
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "tc-table-wrap", children: /* @__PURE__ */ c.jsxs("table", { className: "tc-table", children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("th", {}),
          /* @__PURE__ */ c.jsx("th", { children: "Key" }),
          /* @__PURE__ */ c.jsx("th", { children: "Art" }),
          /* @__PURE__ */ c.jsx("th", { children: "Kontext" }),
          /* @__PURE__ */ c.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ c.jsx("th", { children: "Enum" }),
          /* @__PURE__ */ c.jsx("th", { children: "Eff." }),
          /* @__PURE__ */ c.jsx("th", { children: "Status" }),
          /* @__PURE__ */ c.jsx("th", { children: "Zuletzt" }),
          /* @__PURE__ */ c.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: O.length === 0 ? /* @__PURE__ */ c.jsx("tr", { children: /* @__PURE__ */ c.jsx("td", { colSpan: 10, className: "tc-placeholder", children: "Keine unklassifizierten Einträge." }) }) : O.map((m) => /* @__PURE__ */ c.jsxs(
          "tr",
          {
            className: `${m.id === w ? "focused" : ""} ${m.dirty ? "dirty" : ""}`,
            onClick: () => S(m.id),
            children: [
              /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: h.has(m.id),
                  onClick: (E) => E.stopPropagation(),
                  onChange: () => d(m.id)
                }
              ) }),
              /* @__PURE__ */ c.jsx("td", { className: "tc-key", children: m.key }),
              /* @__PURE__ */ c.jsx("td", { children: m.media_type }),
              /* @__PURE__ */ c.jsx("td", { children: m.is_current ? m.current_context ?? "—" : "—" }),
              /* @__PURE__ */ c.jsx("td", { children: m.signal_type }),
              /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(
                pc,
                {
                  value: m.enum,
                  dirty: m.dirty,
                  onChange: (E) => e.setDraftEnum(m.id, E)
                }
              ) }),
              /* @__PURE__ */ c.jsx("td", { children: m.is_current ? m.effective_enum ?? "—" : "—" }),
              /* @__PURE__ */ c.jsx("td", { children: m.saving ? /* @__PURE__ */ c.jsx("span", { className: "badge", children: "speichert…" }) : m.saveError ? /* @__PURE__ */ c.jsx("span", { className: "badge off", children: "Fehler" }) : m.dirty ? /* @__PURE__ */ c.jsx("span", { className: "badge dirtybadge", children: "geändert" }) : m.hidden ? /* @__PURE__ */ c.jsx("span", { className: "badge off", children: "versteckt" }) : /* @__PURE__ */ c.jsx("span", { className: "tc-muted", children: "—" }) }),
              /* @__PURE__ */ c.jsx("td", { className: "tc-muted", children: dp(m.last_seen) }),
              /* @__PURE__ */ c.jsx("td", { children: m.dirty ? /* @__PURE__ */ c.jsxs(
                "span",
                {
                  className: "tc-row-actions",
                  onClick: (E) => E.stopPropagation(),
                  children: [
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        className: "tc-btn primary tc-mini",
                        disabled: m.saving,
                        onClick: () => e.applyDraft(m.id),
                        children: "✓"
                      }
                    ),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        className: "tc-btn tc-mini",
                        disabled: m.saving,
                        onClick: () => e.resetDraft(m.id),
                        children: "↺"
                      }
                    )
                  ]
                }
              ) : null })
            ]
          },
          m.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      fp,
      {
        entry: a,
        detail: p,
        artwork: y,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function Sl({ title: e, note: t }) {
  return /* @__PURE__ */ c.jsx("div", { className: "tc-page", children: /* @__PURE__ */ c.jsxs("div", { className: "tc-card tc-placeholder", children: [
    /* @__PURE__ */ c.jsx("h2", { children: e }),
    /* @__PURE__ */ c.jsx("p", { children: t })
  ] }) });
}
function mp() {
  return /* @__PURE__ */ c.jsx(
    Sl,
    {
      title: "Tagebuch",
      note: "Verlauf der Sichtungen folgt in PR 9. TODO: eine echte Sighting-Timeline-Tabelle existiert in der DB noch nicht — der MVP zeigt nur verfügbare Daten."
    }
  );
}
function hp() {
  return /* @__PURE__ */ c.jsx(
    Sl,
    {
      title: "Katalog",
      note: "Bibliothek mit Master/Kinder-Baum, Kontext-/Override-Anzeige (über v3/entry_detail) und den Tabs Alle/Unsortiert/Gruppen/Ausgeblendet folgen in PR 4–5."
    }
  );
}
function vp() {
  return /* @__PURE__ */ c.jsx(
    Sl,
    {
      title: "Import / Export",
      note: "Bildfreies v3-JSON über die bestehende API mit Preview/Validierung und Konfliktanzeige folgt in PR 7."
    }
  );
}
function gp() {
  return /* @__PURE__ */ c.jsx(
    Sl,
    {
      title: "Einstellungen",
      note: "Watcher-Status, PostgreSQL-Status (soweit verfügbar), v3-Konfiguration, Artwork-Fallbacks, Theme und Debug-Infos folgen in PR 8."
    }
  );
}
const yp = {
  diary: mp,
  catalog: hp,
  io: vp,
  settings: gp
};
function xp({ hass: e }) {
  const [t, n] = L.useState("overview"), r = Zd(e), l = dc.find((u) => u.id === t), i = yp[t], o = () => t === "inbox" ? /* @__PURE__ */ c.jsx(pp, { store: r, hass: e }) : t === "overview" || !i ? /* @__PURE__ */ c.jsx(rp, { store: r }) : /* @__PURE__ */ c.jsx(i, {});
  return /* @__PURE__ */ c.jsxs("div", { className: "tc3", children: [
    /* @__PURE__ */ c.jsx(Jd, { current: t, onSelect: n }),
    /* @__PURE__ */ c.jsxs("div", { className: "tc3-body", children: [
      /* @__PURE__ */ c.jsx(
        bd,
        {
          title: l.label,
          desc: l.desc,
          loading: r.loading,
          onRefresh: r.refresh
        }
      ),
      /* @__PURE__ */ c.jsx("main", { className: "tc3-main", children: o() }),
      /* @__PURE__ */ c.jsx(
        ep,
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
const wp = ':host{display:block;height:100%}:host,:root{--tc-bg: var(--primary-background-color, #1c1e2b);--tc-surface: #282a36;--tc-surface-raised: #343746;--tc-border: #44475a;--tc-text: var(--primary-text-color, #f8f8f2);--tc-text-muted: #9aa0bd;--tc-accent-purple: #bd93f9;--tc-accent-cyan: #8be9fd;--tc-accent-green: #50fa7b;--tc-accent-orange: #ffb86c;--tc-accent-pink: #ff79c6;--tc-danger: #ff5555;--tc-radius: 10px;--tc-gap: 14px}*{box-sizing:border-box}.tc3{display:grid;grid-template-columns:232px 1fr;height:100%;min-height:0;font-family:var(--paper-font-body1_-_font-family, "Segoe UI", system-ui, sans-serif);color:var(--tc-text);background:var(--tc-bg);font-size:14px}.tc3-body{display:grid;grid-template-rows:auto 1fr auto;min-width:0;min-height:0}.tc3-main{min-height:0;overflow:auto;padding:18px}.tc-sidebar{background:var(--tc-surface);border-right:1px solid var(--tc-border);display:flex;flex-direction:column;min-height:0}.tc-brand{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;border-bottom:1px solid var(--tc-border)}.tc-brand .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--tc-accent-purple),var(--tc-accent-pink));display:flex;align-items:center;justify-content:center;font-weight:700;color:#1c1e2b}.tc-brand .title{font-weight:700;line-height:1.1}.tc-brand .sub{color:var(--tc-text-muted);font-size:11px}.tc-nav{padding:10px 8px;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0;overflow:auto}.tc-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:1px solid transparent;color:var(--tc-text);padding:9px 12px;border-radius:8px;cursor:pointer;font:inherit}.tc-nav button:hover{background:var(--tc-surface-raised)}.tc-nav button.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-nav .ico{width:18px;text-align:center;opacity:.85}.tc-sidebar .foot{padding:10px 16px;border-top:1px solid var(--tc-border);color:var(--tc-text-muted);font-size:11px}.tc-cmdbar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--tc-border);background:color-mix(in srgb,var(--tc-surface) 60%,var(--tc-bg))}.tc-cmdbar h1{font-size:17px;margin:0}.tc-cmdbar .desc{color:var(--tc-text-muted);font-size:12px}.tc-cmdbar .spacer{flex:1}.tc-menu-btn{display:none}input,select,button{font:inherit;color:var(--tc-text)}.tc-input,.tc-select,.tc-btn{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:7px 10px;color:var(--tc-text)}.tc-btn{cursor:pointer}.tc-btn:hover:not(:disabled){border-color:var(--tc-accent-purple)}.tc-btn.primary{background:var(--tc-accent-purple);border-color:var(--tc-accent-purple);color:#1c1e2b;font-weight:600}.tc-btn:disabled{opacity:.45;cursor:default}.tc-statusbar{display:flex;align-items:center;gap:16px;padding:7px 18px;border-top:1px solid var(--tc-border);background:var(--tc-surface);color:var(--tc-text-muted);font-size:12px}.tc-statusbar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}.tc-statusbar .ok{background:var(--tc-accent-green)}.tc-statusbar .bad{background:var(--tc-danger)}.tc-statusbar .right{margin-left:auto}.tc-page{max-width:1200px}.tc-card{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:18px}.tc-placeholder{color:var(--tc-text-muted)}.tc-placeholder h2{color:var(--tc-text);margin:0 0 6px}.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;border:1px solid var(--tc-border)}.badge.music{color:var(--tc-accent-cyan);border-color:color-mix(in srgb,var(--tc-accent-cyan) 50%,transparent)}.badge.game{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 50%,transparent)}.badge.video{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-error{border-color:color-mix(in srgb,var(--tc-danger) 60%,transparent);color:var(--tc-danger);margin-bottom:var(--tc-gap)}.tc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--tc-gap);margin-bottom:20px}.tc-stat{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:14px 16px}.tc-stat-val{font-size:26px;font-weight:700}.tc-stat-label{color:var(--tc-text-muted);font-size:12px;margin-top:2px}.tc-section{margin-bottom:22px}.tc-section h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-enum{color:var(--tc-accent-purple);font-weight:700}.tc-active{display:flex;flex-direction:column;gap:6px}.tc-active-row{display:grid;grid-template-columns:160px 1fr auto;gap:12px;align-items:center;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:8px;padding:8px 12px}.tc-active-name{color:var(--tc-text-muted)}.tc-active-key{font-weight:500}.tc-watchers{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--tc-gap)}.tc-watcher{display:flex;gap:12px;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:12px 14px}.tc-art{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}.tc-art-fallback{display:flex;align-items:center;justify-content:center;background:var(--tc-surface-raised);color:var(--tc-text-muted);font-size:20px}.tc-w-main{min-width:0;flex:1}.tc-w-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tc-w-name{font-weight:600}.tc-w-cur{margin-top:6px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tc-w-cur.muted{color:var(--tc-text-muted)}.tc-w-meta{margin-top:6px;display:flex;gap:12px;flex-wrap:wrap;color:var(--tc-text-muted);font-size:12px}.badge.ok{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 45%,transparent)}.badge.off{color:var(--tc-text-muted)}.tc-syshint{color:var(--tc-text-muted);font-size:12px;margin-top:8px}.tc-inbox{display:grid;grid-template-columns:1fr 340px;gap:var(--tc-gap);height:100%;min-height:0}.tc-inbox-main{min-width:0;display:flex;flex-direction:column;min-height:0}.tc-filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tc-check{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--tc-text-muted)}.tc-filters-info{color:var(--tc-text-muted);font-size:12px;margin-left:auto}.tc-table-wrap{flex:1;min-height:0;overflow:auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius)}.tc-table{width:100%;border-collapse:collapse;font-size:13px}.tc-table th,.tc-table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--tc-border);white-space:nowrap}.tc-table thead th{position:sticky;top:0;background:var(--tc-surface);color:var(--tc-text-muted);font-weight:600;z-index:1}.tc-table tbody tr{cursor:pointer}.tc-table tbody tr:hover{background:var(--tc-surface-raised)}.tc-table tbody tr.focused{background:color-mix(in srgb,var(--tc-accent-purple) 18%,transparent)}.tc-table tbody tr.dirty td{border-bottom-color:color-mix(in srgb,var(--tc-accent-orange) 40%,transparent)}.tc-key{font-weight:500;max-width:320px;overflow:hidden;text-overflow:ellipsis}.tc-muted{color:var(--tc-text-muted)}.tc-enum-select.dirty{border-color:var(--tc-accent-orange);color:var(--tc-accent-orange)}.badge.dirtybadge{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-row-actions{display:inline-flex;gap:4px}.tc-mini{padding:3px 8px}.tc-detail{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:16px;overflow:auto;min-height:0}.tc-detail-title{margin:0 0 8px;font-size:15px;word-break:break-word}.tc-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tc-detail-grid{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 14px}.tc-detail-grid dt{color:var(--tc-text-muted);font-size:12px}.tc-detail-grid dd{margin:0}.tc-detail-error{color:var(--tc-danger);font-size:12px;margin-bottom:10px}.tc-detail-actions{display:flex;gap:8px}.tc-detail-art{width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px}.tc-detail-parent{font-size:12px;color:var(--tc-text-muted);background:var(--tc-surface-raised);border-radius:8px;padding:8px 10px;margin-bottom:12px}.tc-detail-section{margin-bottom:14px}.tc-detail-section h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-ctx-table{width:100%;border-collapse:collapse;font-size:12px}.tc-ctx-table th,.tc-ctx-table td{text-align:left;padding:4px 6px;border-bottom:1px solid var(--tc-border)}.tc-ctx-table th{color:var(--tc-text-muted);font-weight:600}.tc-variants{margin:0;padding-left:18px;font-size:13px}.tc-variants li{margin-bottom:3px}@media (max-width: 870px){.tc3{grid-template-columns:1fr}.tc-sidebar{display:none}.tc-menu-btn{display:inline-flex}.tc-inbox{grid-template-columns:1fr}}';
class kp extends HTMLElement {
  constructor() {
    super(...arguments);
    _l(this, "_root", null);
    _l(this, "_hass", null);
  }
  connectedCallback() {
    if (this._root) return;
    const n = this.attachShadow({ mode: "open" }), r = document.createElement("style");
    r.textContent = wp, n.appendChild(r);
    const l = document.createElement("div");
    l.style.height = "100%", n.appendChild(l), this._root = ac(l), this._render();
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
    this._root?.render(L.createElement(xp, { hass: this._hass }));
  }
}
customElements.get("title-classifier-v3-app") || customElements.define("title-classifier-v3-app", kp);
