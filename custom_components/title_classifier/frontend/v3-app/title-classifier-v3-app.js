var kc = Object.defineProperty;
var Sc = (e, t, n) => t in e ? kc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var _l = (e, t, n) => Sc(e, typeof t != "symbol" ? t + "" : t, n);
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
var tr = Symbol.for("react.element"), Ec = Symbol.for("react.portal"), _c = Symbol.for("react.fragment"), Nc = Symbol.for("react.strict_mode"), Cc = Symbol.for("react.profiler"), jc = Symbol.for("react.provider"), zc = Symbol.for("react.context"), Pc = Symbol.for("react.forward_ref"), Tc = Symbol.for("react.suspense"), Lc = Symbol.for("react.memo"), Dc = Symbol.for("react.lazy"), Vo = Symbol.iterator;
function Rc(e) {
  return e === null || typeof e != "object" ? null : (e = Vo && e[Vo] || e["@@iterator"], typeof e == "function" ? e : null);
}
var ns = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, rs = Object.assign, ls = {};
function mn(e, t, n) {
  this.props = e, this.context = t, this.refs = ls, this.updater = n || ns;
}
mn.prototype.isReactComponent = {};
mn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
mn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function is() {
}
is.prototype = mn.prototype;
function Wi(e, t, n) {
  this.props = e, this.context = t, this.refs = ls, this.updater = n || ns;
}
var Qi = Wi.prototype = new is();
Qi.constructor = Wi;
rs(Qi, mn.prototype);
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
  return { $$typeof: tr, type: e, key: i, ref: o, props: l, _owner: Ki.current };
}
function Mc(e, t) {
  return { $$typeof: tr, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Yi(e) {
  return typeof e == "object" && e !== null && e.$$typeof === tr;
}
function Ic(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Ho = /\/+/g;
function Nl(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Ic("" + e.key) : t.toString(36);
}
function Nr(e, t, n, r, l) {
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
        case tr:
        case Ec:
          o = !0;
      }
  }
  if (o) return o = e, l = l(o), e = r === "" ? "." + Nl(o, 0) : r, Bo(l) ? (n = "", e != null && (n = e.replace(Ho, "$&/") + "/"), Nr(l, t, n, "", function(d) {
    return d;
  })) : l != null && (Yi(l) && (l = Mc(l, n + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(Ho, "$&/") + "/") + e)), t.push(l)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", Bo(e)) for (var u = 0; u < e.length; u++) {
    i = e[u];
    var s = r + Nl(i, u);
    o += Nr(i, t, n, s, l);
  }
  else if (s = Rc(e), typeof s == "function") for (e = s.call(e), u = 0; !(i = e.next()).done; ) i = i.value, s = r + Nl(i, u++), o += Nr(i, t, n, s, l);
  else if (i === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function or(e, t, n) {
  if (e == null) return e;
  var r = [], l = 0;
  return Nr(e, r, "", "", function(i) {
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
var ge = { current: null }, Cr = { transition: null }, Fc = { ReactCurrentDispatcher: ge, ReactCurrentBatchConfig: Cr, ReactCurrentOwner: Ki };
function as() {
  throw Error("act(...) is not supported in production builds of React.");
}
M.Children = { map: or, forEach: function(e, t, n) {
  or(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return or(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return or(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!Yi(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
M.Component = mn;
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
  return { $$typeof: tr, type: e.type, key: l, ref: i, props: r, _owner: o };
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
  var t = Cr.transition;
  Cr.transition = {};
  try {
    e();
  } finally {
    Cr.transition = t;
  }
};
M.unstable_act = as;
M.useCallback = function(e, t) {
  return ge.current.useCallback(e, t);
};
M.useContext = function(e) {
  return ge.current.useContext(e);
};
M.useDebugValue = function() {
};
M.useDeferredValue = function(e) {
  return ge.current.useDeferredValue(e);
};
M.useEffect = function(e, t) {
  return ge.current.useEffect(e, t);
};
M.useId = function() {
  return ge.current.useId();
};
M.useImperativeHandle = function(e, t, n) {
  return ge.current.useImperativeHandle(e, t, n);
};
M.useInsertionEffect = function(e, t) {
  return ge.current.useInsertionEffect(e, t);
};
M.useLayoutEffect = function(e, t) {
  return ge.current.useLayoutEffect(e, t);
};
M.useMemo = function(e, t) {
  return ge.current.useMemo(e, t);
};
M.useReducer = function(e, t, n) {
  return ge.current.useReducer(e, t, n);
};
M.useRef = function(e) {
  return ge.current.useRef(e);
};
M.useState = function(e) {
  return ge.current.useState(e);
};
M.useSyncExternalStore = function(e, t, n) {
  return ge.current.useSyncExternalStore(e, t, n);
};
M.useTransition = function() {
  return ge.current.useTransition();
};
M.version = "18.3.1";
ts.exports = M;
var T = ts.exports, cs = { exports: {} }, ze = {}, ds = { exports: {} }, fs = {};
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
  function t(N, L) {
    var R = N.length;
    N.push(L);
    e: for (; 0 < R; ) {
      var Q = R - 1 >>> 1, q = N[Q];
      if (0 < l(q, L)) N[Q] = L, N[R] = q, R = Q;
      else break e;
    }
  }
  function n(N) {
    return N.length === 0 ? null : N[0];
  }
  function r(N) {
    if (N.length === 0) return null;
    var L = N[0], R = N.pop();
    if (R !== L) {
      N[0] = R;
      e: for (var Q = 0, q = N.length, Ut = q >>> 1; Q < Ut; ) {
        var x = 2 * (Q + 1) - 1, X = N[x], V = x + 1, Te = N[V];
        if (0 > l(X, R)) V < q && 0 > l(Te, X) ? (N[Q] = Te, N[V] = R, Q = V) : (N[Q] = X, N[x] = R, Q = x);
        else if (V < q && 0 > l(Te, R)) N[Q] = Te, N[V] = R, Q = V;
        else break e;
      }
    }
    return L;
  }
  function l(N, L) {
    var R = N.sortIndex - L.sortIndex;
    return R !== 0 ? R : N.id - L.id;
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
  var s = [], d = [], h = 1, v = null, m = 3, S = !1, w = !1, E = !1, _ = typeof setTimeout == "function" ? setTimeout : null, f = typeof clearTimeout == "function" ? clearTimeout : null, c = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function p(N) {
    for (var L = n(d); L !== null; ) {
      if (L.callback === null) r(d);
      else if (L.startTime <= N) r(d), L.sortIndex = L.expirationTime, t(s, L);
      else break;
      L = n(d);
    }
  }
  function g(N) {
    if (E = !1, p(N), !w) if (n(s) !== null) w = !0, Fe(k);
    else {
      var L = n(d);
      L !== null && te(g, L.startTime - N);
    }
  }
  function k(N, L) {
    w = !1, E && (E = !1, f(P), P = -1), S = !0;
    var R = m;
    try {
      for (p(L), v = n(s); v !== null && (!(v.expirationTime > L) || N && !ee()); ) {
        var Q = v.callback;
        if (typeof Q == "function") {
          v.callback = null, m = v.priorityLevel;
          var q = Q(v.expirationTime <= L);
          L = e.unstable_now(), typeof q == "function" ? v.callback = q : v === n(s) && r(s), p(L);
        } else r(s);
        v = n(s);
      }
      if (v !== null) var Ut = !0;
      else {
        var x = n(d);
        x !== null && te(g, x.startTime - L), Ut = !1;
      }
      return Ut;
    } finally {
      v = null, m = R, S = !1;
    }
  }
  var j = !1, z = null, P = -1, $ = 5, D = -1;
  function ee() {
    return !(e.unstable_now() - D < $);
  }
  function O() {
    if (z !== null) {
      var N = e.unstable_now();
      D = N;
      var L = !0;
      try {
        L = z(!0, N);
      } finally {
        L ? A() : (j = !1, z = null);
      }
    } else j = !1;
  }
  var A;
  if (typeof c == "function") A = function() {
    c(O);
  };
  else if (typeof MessageChannel < "u") {
    var ae = new MessageChannel(), ce = ae.port2;
    ae.port1.onmessage = O, A = function() {
      ce.postMessage(null);
    };
  } else A = function() {
    _(O, 0);
  };
  function Fe(N) {
    z = N, j || (j = !0, A());
  }
  function te(N, L) {
    P = _(function() {
      N(e.unstable_now());
    }, L);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(N) {
    N.callback = null;
  }, e.unstable_continueExecution = function() {
    w || S || (w = !0, Fe(k));
  }, e.unstable_forceFrameRate = function(N) {
    0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : $ = 0 < N ? Math.floor(1e3 / N) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return m;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(s);
  }, e.unstable_next = function(N) {
    switch (m) {
      case 1:
      case 2:
      case 3:
        var L = 3;
        break;
      default:
        L = m;
    }
    var R = m;
    m = L;
    try {
      return N();
    } finally {
      m = R;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(N, L) {
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
    var R = m;
    m = N;
    try {
      return L();
    } finally {
      m = R;
    }
  }, e.unstable_scheduleCallback = function(N, L, R) {
    var Q = e.unstable_now();
    switch (typeof R == "object" && R !== null ? (R = R.delay, R = typeof R == "number" && 0 < R ? Q + R : Q) : R = Q, N) {
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
    return q = R + q, N = { id: h++, callback: L, priorityLevel: N, startTime: R, expirationTime: q, sortIndex: -1 }, R > Q ? (N.sortIndex = R, t(d, N), n(s) === null && N === n(d) && (E ? (f(P), P = -1) : E = !0, te(g, R - Q))) : (N.sortIndex = q, t(s, N), w || S || (w = !0, Fe(k))), N;
  }, e.unstable_shouldYield = ee, e.unstable_wrapCallback = function(N) {
    var L = m;
    return function() {
      var R = m;
      m = L;
      try {
        return N.apply(this, arguments);
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
var Ac = T, je = $c;
function y(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var ps = /* @__PURE__ */ new Set(), $n = {};
function $t(e, t) {
  un(e, t), un(e + "Capture", t);
}
function un(e, t) {
  for ($n[e] = t, e = 0; e < t.length; e++) ps.add(t[e]);
}
var tt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ql = Object.prototype.hasOwnProperty, Uc = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Wo = {}, Qo = {};
function Vc(e) {
  return ql.call(Qo, e) ? !0 : ql.call(Wo, e) ? !1 : Uc.test(e) ? Qo[e] = !0 : (Wo[e] = !0, !1);
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
function ye(e, t, n, r, l, i, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
}
var se = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  se[e] = new ye(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  se[t] = new ye(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  se[e] = new ye(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  se[e] = new ye(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  se[e] = new ye(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  se[e] = new ye(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  se[e] = new ye(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  se[e] = new ye(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  se[e] = new ye(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Gi = /[\-:]([a-z])/g;
function Xi(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Gi,
    Xi
  );
  se[t] = new ye(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Gi, Xi);
  se[t] = new ye(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Gi, Xi);
  se[t] = new ye(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  se[e] = new ye(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
se.xlinkHref = new ye("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  se[e] = new ye(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Zi(e, t, n, r) {
  var l = se.hasOwnProperty(t) ? se[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Hc(t, n, l, r) && (n = null), r || l === null ? Vc(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var it = Ac.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ur = Symbol.for("react.element"), Bt = Symbol.for("react.portal"), Ht = Symbol.for("react.fragment"), Ji = Symbol.for("react.strict_mode"), bl = Symbol.for("react.profiler"), ms = Symbol.for("react.provider"), hs = Symbol.for("react.context"), qi = Symbol.for("react.forward_ref"), ei = Symbol.for("react.suspense"), ti = Symbol.for("react.suspense_list"), bi = Symbol.for("react.memo"), ut = Symbol.for("react.lazy"), vs = Symbol.for("react.offscreen"), Ko = Symbol.iterator;
function gn(e) {
  return e === null || typeof e != "object" ? null : (e = Ko && e[Ko] || e["@@iterator"], typeof e == "function" ? e : null);
}
var G = Object.assign, Cl;
function Nn(e) {
  if (Cl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Cl = t && t[1] || "";
  }
  return `
` + Cl + e;
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
    jl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Nn(e) : "";
}
function Wc(e) {
  switch (e.tag) {
    case 5:
      return Nn(e.type);
    case 16:
      return Nn("Lazy");
    case 13:
      return Nn("Suspense");
    case 19:
      return Nn("SuspenseList");
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
    case Ht:
      return "Fragment";
    case Bt:
      return "Portal";
    case bl:
      return "Profiler";
    case Ji:
      return "StrictMode";
    case ei:
      return "Suspense";
    case ti:
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
      return t = e.displayName || null, t !== null ? t : ni(e.type) || "Memo";
    case ut:
      t = e._payload, e = e._init;
      try {
        return ni(e(t));
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
      return ni(t);
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
function kt(e) {
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
function sr(e) {
  e._valueTracker || (e._valueTracker = Kc(e));
}
function ys(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = gs(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Fr(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function ri(e, t) {
  var n = t.checked;
  return G({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Yo(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = kt(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function xs(e, t) {
  t = t.checked, t != null && Zi(e, "checked", t, !1);
}
function li(e, t) {
  xs(e, t);
  var n = kt(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? ii(e, t.type, n) : t.hasOwnProperty("defaultValue") && ii(e, t.type, kt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Go(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function ii(e, t, n) {
  (t !== "number" || Fr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Cn = Array.isArray;
function en(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + kt(n), t = null, l = 0; l < e.length; l++) {
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
  if (t.dangerouslySetInnerHTML != null) throw Error(y(91));
  return G({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Xo(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(y(92));
      if (Cn(n)) {
        if (1 < n.length) throw Error(y(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: kt(n) };
}
function ws(e, t) {
  var n = kt(t.value), r = kt(t.defaultValue);
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
function ui(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? ks(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var ar, Ss = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, l);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (ar = ar || document.createElement("div"), ar.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = ar.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function An(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Pn = {
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
Object.keys(Pn).forEach(function(e) {
  Yc.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Pn[t] = Pn[e];
  });
});
function Es(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Pn.hasOwnProperty(e) && Pn[e] ? ("" + t).trim() : t + "px";
}
function _s(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = Es(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var Gc = G({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function si(e, t) {
  if (t) {
    if (Gc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(y(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(y(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(y(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(y(62));
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
function eo(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var di = null, tn = null, nn = null;
function Jo(e) {
  if (e = lr(e)) {
    if (typeof di != "function") throw Error(y(280));
    var t = e.stateNode;
    t && (t = fl(t), di(e.stateNode, e.type, t));
  }
}
function Ns(e) {
  tn ? nn ? nn.push(e) : nn = [e] : tn = e;
}
function Cs() {
  if (tn) {
    var e = tn, t = nn;
    if (nn = tn = null, Jo(e), t) for (e = 0; e < t.length; e++) Jo(t[e]);
  }
}
function js(e, t) {
  return e(t);
}
function zs() {
}
var Pl = !1;
function Ps(e, t, n) {
  if (Pl) return e(t, n);
  Pl = !0;
  try {
    return js(e, t, n);
  } finally {
    Pl = !1, (tn !== null || nn !== null) && (zs(), Cs());
  }
}
function Un(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = fl(n);
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
  if (n && typeof n != "function") throw Error(y(231, t, typeof n));
  return n;
}
var fi = !1;
if (tt) try {
  var yn = {};
  Object.defineProperty(yn, "passive", { get: function() {
    fi = !0;
  } }), window.addEventListener("test", yn, yn), window.removeEventListener("test", yn, yn);
} catch {
  fi = !1;
}
function Xc(e, t, n, r, l, i, o, u, s) {
  var d = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, d);
  } catch (h) {
    this.onError(h);
  }
}
var Tn = !1, $r = null, Ar = !1, pi = null, Zc = { onError: function(e) {
  Tn = !0, $r = e;
} };
function Jc(e, t, n, r, l, i, o, u, s) {
  Tn = !1, $r = null, Xc.apply(Zc, arguments);
}
function qc(e, t, n, r, l, i, o, u, s) {
  if (Jc.apply(this, arguments), Tn) {
    if (Tn) {
      var d = $r;
      Tn = !1, $r = null;
    } else throw Error(y(198));
    Ar || (Ar = !0, pi = d);
  }
}
function At(e) {
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
  if (At(e) !== e) throw Error(y(188));
}
function bc(e) {
  var t = e.alternate;
  if (!t) {
    if (t = At(e), t === null) throw Error(y(188));
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
      throw Error(y(188));
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
        if (!o) throw Error(y(189));
      }
    }
    if (n.alternate !== r) throw Error(y(190));
  }
  if (n.tag !== 3) throw Error(y(188));
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
var Rs = je.unstable_scheduleCallback, bo = je.unstable_cancelCallback, ed = je.unstable_shouldYield, td = je.unstable_requestPaint, J = je.unstable_now, nd = je.unstable_getCurrentPriorityLevel, to = je.unstable_ImmediatePriority, Ms = je.unstable_UserBlockingPriority, Ur = je.unstable_NormalPriority, rd = je.unstable_LowPriority, Is = je.unstable_IdlePriority, sl = null, Ge = null;
function ld(e) {
  if (Ge && typeof Ge.onCommitFiberRoot == "function") try {
    Ge.onCommitFiberRoot(sl, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Be = Math.clz32 ? Math.clz32 : ud, id = Math.log, od = Math.LN2;
function ud(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (id(e) / od | 0) | 0;
}
var cr = 64, dr = 4194304;
function jn(e) {
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
function Vr(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var u = o & ~l;
    u !== 0 ? r = jn(u) : (i &= o, i !== 0 && (r = jn(i)));
  } else o = n & ~l, o !== 0 ? r = jn(o) : i !== 0 && (r = jn(i));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & l) && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Be(t), l = 1 << n, r |= e[n], t &= ~l;
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
    var o = 31 - Be(i), u = 1 << o, s = l[o];
    s === -1 ? (!(u & n) || u & r) && (l[o] = sd(u, t)) : s <= t && (e.expiredLanes |= u), i &= ~u;
  }
}
function mi(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Os() {
  var e = cr;
  return cr <<= 1, !(cr & 4194240) && (cr = 64), e;
}
function Tl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function nr(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Be(t), e[t] = n;
}
function cd(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Be(n), i = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
  }
}
function no(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Be(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var F = 0;
function Fs(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var $s, ro, As, Us, Vs, hi = !1, fr = [], pt = null, mt = null, ht = null, Vn = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Map(), at = [], dd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function eu(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      pt = null;
      break;
    case "dragenter":
    case "dragleave":
      mt = null;
      break;
    case "mouseover":
    case "mouseout":
      ht = null;
      break;
    case "pointerover":
    case "pointerout":
      Vn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Bn.delete(t.pointerId);
  }
}
function xn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = lr(t), t !== null && ro(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function fd(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return pt = xn(pt, e, t, n, r, l), !0;
    case "dragenter":
      return mt = xn(mt, e, t, n, r, l), !0;
    case "mouseover":
      return ht = xn(ht, e, t, n, r, l), !0;
    case "pointerover":
      var i = l.pointerId;
      return Vn.set(i, xn(Vn.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return i = l.pointerId, Bn.set(i, xn(Bn.get(i) || null, e, t, n, r, l)), !0;
  }
  return !1;
}
function Bs(e) {
  var t = zt(e.target);
  if (t !== null) {
    var n = At(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Ts(n), t !== null) {
          e.blockedOn = t, Vs(e.priority, function() {
            As(n);
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
function jr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = vi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ci = r, n.target.dispatchEvent(r), ci = null;
    } else return t = lr(n), t !== null && ro(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function tu(e, t, n) {
  jr(e) && n.delete(t);
}
function pd() {
  hi = !1, pt !== null && jr(pt) && (pt = null), mt !== null && jr(mt) && (mt = null), ht !== null && jr(ht) && (ht = null), Vn.forEach(tu), Bn.forEach(tu);
}
function wn(e, t) {
  e.blockedOn === t && (e.blockedOn = null, hi || (hi = !0, je.unstable_scheduleCallback(je.unstable_NormalPriority, pd)));
}
function Hn(e) {
  function t(l) {
    return wn(l, e);
  }
  if (0 < fr.length) {
    wn(fr[0], e);
    for (var n = 1; n < fr.length; n++) {
      var r = fr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (pt !== null && wn(pt, e), mt !== null && wn(mt, e), ht !== null && wn(ht, e), Vn.forEach(t), Bn.forEach(t), n = 0; n < at.length; n++) r = at[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < at.length && (n = at[0], n.blockedOn === null); ) Bs(n), n.blockedOn === null && at.shift();
}
var rn = it.ReactCurrentBatchConfig, Br = !0;
function md(e, t, n, r) {
  var l = F, i = rn.transition;
  rn.transition = null;
  try {
    F = 1, lo(e, t, n, r);
  } finally {
    F = l, rn.transition = i;
  }
}
function hd(e, t, n, r) {
  var l = F, i = rn.transition;
  rn.transition = null;
  try {
    F = 4, lo(e, t, n, r);
  } finally {
    F = l, rn.transition = i;
  }
}
function lo(e, t, n, r) {
  if (Br) {
    var l = vi(e, t, n, r);
    if (l === null) Ul(e, t, r, Hr, n), eu(e, r);
    else if (fd(l, e, t, n, r)) r.stopPropagation();
    else if (eu(e, r), t & 4 && -1 < dd.indexOf(e)) {
      for (; l !== null; ) {
        var i = lr(l);
        if (i !== null && $s(i), i = vi(e, t, n, r), i === null && Ul(e, t, r, Hr, n), i === l) break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else Ul(e, t, r, null, n);
  }
}
var Hr = null;
function vi(e, t, n, r) {
  if (Hr = null, e = eo(r), e = zt(e), e !== null) if (t = At(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Ts(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Hr = e, null;
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
var dt = null, io = null, zr = null;
function Ws() {
  if (zr) return zr;
  var e, t = io, n = t.length, r, l = "value" in dt ? dt.value : dt.textContent, i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
  return zr = l.slice(e, 1 < r ? 1 - r : void 0);
}
function Pr(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function pr() {
  return !0;
}
function nu() {
  return !1;
}
function Pe(e) {
  function t(n, r, l, i, o) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? pr : nu, this.isPropagationStopped = nu, this;
  }
  return G(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = pr);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = pr);
  }, persist: function() {
  }, isPersistent: pr }), t;
}
var hn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, oo = Pe(hn), rr = G({}, hn, { view: 0, detail: 0 }), vd = Pe(rr), Ll, Dl, kn, al = G({}, rr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: uo, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== kn && (kn && e.type === "mousemove" ? (Ll = e.screenX - kn.screenX, Dl = e.screenY - kn.screenY) : Dl = Ll = 0, kn = e), Ll);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : Dl;
} }), ru = Pe(al), gd = G({}, al, { dataTransfer: 0 }), yd = Pe(gd), xd = G({}, rr, { relatedTarget: 0 }), Rl = Pe(xd), wd = G({}, hn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), kd = Pe(wd), Sd = G({}, hn, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), Ed = Pe(Sd), _d = G({}, hn, { data: 0 }), lu = Pe(_d), Nd = {
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
var Pd = G({}, rr, { key: function(e) {
  if (e.key) {
    var t = Nd[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = Pr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Cd[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: uo, charCode: function(e) {
  return e.type === "keypress" ? Pr(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? Pr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), Td = Pe(Pd), Ld = G({}, al, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), iu = Pe(Ld), Dd = G({}, rr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: uo }), Rd = Pe(Dd), Md = G({}, hn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Id = Pe(Md), Od = G({}, al, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Fd = Pe(Od), $d = [9, 13, 27, 32], so = tt && "CompositionEvent" in window, Ln = null;
tt && "documentMode" in document && (Ln = document.documentMode);
var Ad = tt && "TextEvent" in window && !Ln, Qs = tt && (!so || Ln && 8 < Ln && 11 >= Ln), ou = " ", uu = !1;
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
var Wt = !1;
function Ud(e, t) {
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
  if (Wt) return e === "compositionend" || !so && Ks(e, t) ? (e = Ws(), zr = io = dt = null, Wt = !1, e) : null;
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
function Gs(e, t, n, r) {
  Ns(r), t = Wr(t, "onChange"), 0 < t.length && (n = new oo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Dn = null, Wn = null;
function Hd(e) {
  ia(e, 0);
}
function cl(e) {
  var t = Yt(e);
  if (ys(t)) return e;
}
function Wd(e, t) {
  if (e === "change") return t;
}
var Xs = !1;
if (tt) {
  var Ml;
  if (tt) {
    var Il = "oninput" in document;
    if (!Il) {
      var au = document.createElement("div");
      au.setAttribute("oninput", "return;"), Il = typeof au.oninput == "function";
    }
    Ml = Il;
  } else Ml = !1;
  Xs = Ml && (!document.documentMode || 9 < document.documentMode);
}
function cu() {
  Dn && (Dn.detachEvent("onpropertychange", Zs), Wn = Dn = null);
}
function Zs(e) {
  if (e.propertyName === "value" && cl(Wn)) {
    var t = [];
    Gs(t, Wn, e, eo(e)), Ps(Hd, t);
  }
}
function Qd(e, t, n) {
  e === "focusin" ? (cu(), Dn = t, Wn = n, Dn.attachEvent("onpropertychange", Zs)) : e === "focusout" && cu();
}
function Kd(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return cl(Wn);
}
function Yd(e, t) {
  if (e === "click") return cl(t);
}
function Gd(e, t) {
  if (e === "input" || e === "change") return cl(t);
}
function Xd(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var We = typeof Object.is == "function" ? Object.is : Xd;
function Qn(e, t) {
  if (We(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!ql.call(t, l) || !We(e[l], t[l])) return !1;
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
  for (var e = window, t = Fr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Fr(e.document);
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
var Jd = tt && "documentMode" in document && 11 >= document.documentMode, Qt = null, gi = null, Rn = null, yi = !1;
function pu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  yi || Qt == null || Qt !== Fr(r) || (r = Qt, "selectionStart" in r && ao(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Rn && Qn(Rn, r) || (Rn = r, r = Wr(gi, "onSelect"), 0 < r.length && (t = new oo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Qt)));
}
function mr(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Kt = { animationend: mr("Animation", "AnimationEnd"), animationiteration: mr("Animation", "AnimationIteration"), animationstart: mr("Animation", "AnimationStart"), transitionend: mr("Transition", "TransitionEnd") }, Ol = {}, bs = {};
tt && (bs = document.createElement("div").style, "AnimationEvent" in window || (delete Kt.animationend.animation, delete Kt.animationiteration.animation, delete Kt.animationstart.animation), "TransitionEvent" in window || delete Kt.transitionend.transition);
function dl(e) {
  if (Ol[e]) return Ol[e];
  if (!Kt[e]) return e;
  var t = Kt[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in bs) return Ol[e] = t[n];
  return e;
}
var ea = dl("animationend"), ta = dl("animationiteration"), na = dl("animationstart"), ra = dl("transitionend"), la = /* @__PURE__ */ new Map(), mu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Et(e, t) {
  la.set(e, t), $t(t, [e]);
}
for (var Fl = 0; Fl < mu.length; Fl++) {
  var $l = mu[Fl], qd = $l.toLowerCase(), bd = $l[0].toUpperCase() + $l.slice(1);
  Et(qd, "on" + bd);
}
Et(ea, "onAnimationEnd");
Et(ta, "onAnimationIteration");
Et(na, "onAnimationStart");
Et("dblclick", "onDoubleClick");
Et("focusin", "onFocus");
Et("focusout", "onBlur");
Et(ra, "onTransitionEnd");
un("onMouseEnter", ["mouseout", "mouseover"]);
un("onMouseLeave", ["mouseout", "mouseover"]);
un("onPointerEnter", ["pointerout", "pointerover"]);
un("onPointerLeave", ["pointerout", "pointerover"]);
$t("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
$t("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
$t("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
$t("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
$t("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
$t("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var zn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ef = new Set("cancel close invalid load scroll toggle".split(" ").concat(zn));
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
  if (Ar) throw e = pi, Ar = !1, pi = null, e;
}
function B(e, t) {
  var n = t[Ei];
  n === void 0 && (n = t[Ei] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (oa(t, e, 2, !1), n.add(r));
}
function Al(e, t, n) {
  var r = 0;
  t && (r |= 4), oa(n, e, r, t);
}
var hr = "_reactListening" + Math.random().toString(36).slice(2);
function Kn(e) {
  if (!e[hr]) {
    e[hr] = !0, ps.forEach(function(n) {
      n !== "selectionchange" && (ef.has(n) || Al(n, !1, e), Al(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[hr] || (t[hr] = !0, Al("selectionchange", !1, t));
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
  n = l.bind(null, t, n, e), l = void 0, !fi || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
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
        if (o = zt(u), o === null) return;
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
        var S = oo, w = e;
        switch (e) {
          case "keypress":
            if (Pr(n) === 0) break e;
          case "keydown":
          case "keyup":
            S = Td;
            break;
          case "focusin":
            w = "focus", S = Rl;
            break;
          case "focusout":
            w = "blur", S = Rl;
            break;
          case "beforeblur":
          case "afterblur":
            S = Rl;
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
            S = ru;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            S = yd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            S = Rd;
            break;
          case ea:
          case ta:
          case na:
            S = kd;
            break;
          case ra:
            S = Id;
            break;
          case "scroll":
            S = vd;
            break;
          case "wheel":
            S = Fd;
            break;
          case "copy":
          case "cut":
          case "paste":
            S = Ed;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            S = iu;
        }
        var E = (t & 4) !== 0, _ = !E && e === "scroll", f = E ? m !== null ? m + "Capture" : null : m;
        E = [];
        for (var c = d, p; c !== null; ) {
          p = c;
          var g = p.stateNode;
          if (p.tag === 5 && g !== null && (p = g, f !== null && (g = Un(c, f), g != null && E.push(Yn(c, g, p)))), _) break;
          c = c.return;
        }
        0 < E.length && (m = new S(m, w, null, n, h), v.push({ event: m, listeners: E }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (m = e === "mouseover" || e === "pointerover", S = e === "mouseout" || e === "pointerout", m && n !== ci && (w = n.relatedTarget || n.fromElement) && (zt(w) || w[nt])) break e;
        if ((S || m) && (m = h.window === h ? h : (m = h.ownerDocument) ? m.defaultView || m.parentWindow : window, S ? (w = n.relatedTarget || n.toElement, S = d, w = w ? zt(w) : null, w !== null && (_ = At(w), w !== _ || w.tag !== 5 && w.tag !== 6) && (w = null)) : (S = null, w = d), S !== w)) {
          if (E = ru, g = "onMouseLeave", f = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (E = iu, g = "onPointerLeave", f = "onPointerEnter", c = "pointer"), _ = S == null ? m : Yt(S), p = w == null ? m : Yt(w), m = new E(g, c + "leave", S, n, h), m.target = _, m.relatedTarget = p, g = null, zt(h) === d && (E = new E(f, c + "enter", w, n, h), E.target = p, E.relatedTarget = _, g = E), _ = g, S && w) t: {
            for (E = S, f = w, c = 0, p = E; p; p = Vt(p)) c++;
            for (p = 0, g = f; g; g = Vt(g)) p++;
            for (; 0 < c - p; ) E = Vt(E), c--;
            for (; 0 < p - c; ) f = Vt(f), p--;
            for (; c--; ) {
              if (E === f || f !== null && E === f.alternate) break t;
              E = Vt(E), f = Vt(f);
            }
            E = null;
          }
          else E = null;
          S !== null && vu(v, m, S, E, !1), w !== null && _ !== null && vu(v, _, w, E, !0);
        }
      }
      e: {
        if (m = d ? Yt(d) : window, S = m.nodeName && m.nodeName.toLowerCase(), S === "select" || S === "input" && m.type === "file") var k = Wd;
        else if (su(m)) if (Xs) k = Gd;
        else {
          k = Kd;
          var j = Qd;
        }
        else (S = m.nodeName) && S.toLowerCase() === "input" && (m.type === "checkbox" || m.type === "radio") && (k = Yd);
        if (k && (k = k(e, d))) {
          Gs(v, k, n, h);
          break e;
        }
        j && j(e, m, d), e === "focusout" && (j = m._wrapperState) && j.controlled && m.type === "number" && ii(m, "number", m.value);
      }
      switch (j = d ? Yt(d) : window, e) {
        case "focusin":
          (su(j) || j.contentEditable === "true") && (Qt = j, gi = d, Rn = null);
          break;
        case "focusout":
          Rn = gi = Qt = null;
          break;
        case "mousedown":
          yi = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          yi = !1, pu(v, n, h);
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
      else Wt ? Ks(e, n) && (P = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (P = "onCompositionStart");
      P && (Qs && n.locale !== "ko" && (Wt || P !== "onCompositionStart" ? P === "onCompositionEnd" && Wt && (z = Ws()) : (dt = h, io = "value" in dt ? dt.value : dt.textContent, Wt = !0)), j = Wr(d, P), 0 < j.length && (P = new lu(P, e, null, n, h), v.push({ event: P, listeners: j }), z ? P.data = z : (z = Ys(n), z !== null && (P.data = z)))), (z = Ad ? Ud(e, n) : Vd(e, n)) && (d = Wr(d, "onBeforeInput"), 0 < d.length && (h = new lu("onBeforeInput", "beforeinput", null, n, h), v.push({ event: h, listeners: d }), h.data = z));
    }
    ia(v, t);
  });
}
function Yn(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Wr(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e, i = l.stateNode;
    l.tag === 5 && i !== null && (l = i, i = Un(e, n), i != null && r.unshift(Yn(e, i, l)), i = Un(e, t), i != null && r.push(Yn(e, i, l))), e = e.return;
  }
  return r;
}
function Vt(e) {
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
    u.tag === 5 && d !== null && (u = d, l ? (s = Un(n, i), s != null && o.unshift(Yn(n, s, u))) : l || (s = Un(n, i), s != null && o.push(Yn(n, s, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var tf = /\r\n?/g, nf = /\u0000|\uFFFD/g;
function gu(e) {
  return (typeof e == "string" ? e : "" + e).replace(tf, `
`).replace(nf, "");
}
function vr(e, t, n) {
  if (t = gu(t), gu(e) !== t && n) throw Error(y(425));
}
function Qr() {
}
var xi = null, wi = null;
function ki(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var Si = typeof setTimeout == "function" ? setTimeout : void 0, rf = typeof clearTimeout == "function" ? clearTimeout : void 0, yu = typeof Promise == "function" ? Promise : void 0, lf = typeof queueMicrotask == "function" ? queueMicrotask : typeof yu < "u" ? function(e) {
  return yu.resolve(null).then(e).catch(of);
} : Si;
function of(e) {
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
        e.removeChild(l), Hn(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = l;
  } while (n);
  Hn(t);
}
function vt(e) {
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
var vn = Math.random().toString(36).slice(2), Ye = "__reactFiber$" + vn, Gn = "__reactProps$" + vn, nt = "__reactContainer$" + vn, Ei = "__reactEvents$" + vn, uf = "__reactListeners$" + vn, sf = "__reactHandles$" + vn;
function zt(e) {
  var t = e[Ye];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[nt] || n[Ye]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = xu(e); e !== null; ) {
        if (n = e[Ye]) return n;
        e = xu(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function lr(e) {
  return e = e[Ye] || e[nt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Yt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(y(33));
}
function fl(e) {
  return e[Gn] || null;
}
var _i = [], Gt = -1;
function _t(e) {
  return { current: e };
}
function H(e) {
  0 > Gt || (e.current = _i[Gt], _i[Gt] = null, Gt--);
}
function U(e, t) {
  Gt++, _i[Gt] = e.current, e.current = t;
}
var St = {}, me = _t(St), ke = _t(!1), Rt = St;
function sn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return St;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, i;
  for (i in n) l[i] = t[i];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function Se(e) {
  return e = e.childContextTypes, e != null;
}
function Kr() {
  H(ke), H(me);
}
function wu(e, t, n) {
  if (me.current !== St) throw Error(y(168));
  U(me, t), U(ke, n);
}
function ua(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(y(108, Qc(e) || "Unknown", l));
  return G({}, n, r);
}
function Yr(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || St, Rt = me.current, U(me, e), U(ke, ke.current), !0;
}
function ku(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(y(169));
  n ? (e = ua(e, t, Rt), r.__reactInternalMemoizedMergedChildContext = e, H(ke), H(me), U(me, e)) : H(ke), U(ke, n);
}
var Je = null, pl = !1, Bl = !1;
function sa(e) {
  Je === null ? Je = [e] : Je.push(e);
}
function af(e) {
  pl = !0, sa(e);
}
function Nt() {
  if (!Bl && Je !== null) {
    Bl = !0;
    var e = 0, t = F;
    try {
      var n = Je;
      for (F = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Je = null, pl = !1;
    } catch (l) {
      throw Je !== null && (Je = Je.slice(e + 1)), Rs(to, Nt), l;
    } finally {
      F = t, Bl = !1;
    }
  }
  return null;
}
var Xt = [], Zt = 0, Gr = null, Xr = 0, Le = [], De = 0, Mt = null, qe = 1, be = "";
function Ct(e, t) {
  Xt[Zt++] = Xr, Xt[Zt++] = Gr, Gr = e, Xr = t;
}
function aa(e, t, n) {
  Le[De++] = qe, Le[De++] = be, Le[De++] = Mt, Mt = e;
  var r = qe;
  e = be;
  var l = 32 - Be(r) - 1;
  r &= ~(1 << l), n += 1;
  var i = 32 - Be(t) + l;
  if (30 < i) {
    var o = l - l % 5;
    i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, qe = 1 << 32 - Be(t) + l | n << l | r, be = i + e;
  } else qe = 1 << i | n << l | r, be = e;
}
function co(e) {
  e.return !== null && (Ct(e, 1), aa(e, 1, 0));
}
function fo(e) {
  for (; e === Gr; ) Gr = Xt[--Zt], Xt[Zt] = null, Xr = Xt[--Zt], Xt[Zt] = null;
  for (; e === Mt; ) Mt = Le[--De], Le[De] = null, be = Le[--De], Le[De] = null, qe = Le[--De], Le[De] = null;
}
var Ce = null, Ne = null, W = !1, Ve = null;
function ca(e, t) {
  var n = Re(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function Su(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ce = e, Ne = vt(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ce = e, Ne = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Mt !== null ? { id: qe, overflow: be } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Re(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ce = e, Ne = null, !0) : !1;
    default:
      return !1;
  }
}
function Ni(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ci(e) {
  if (W) {
    var t = Ne;
    if (t) {
      var n = t;
      if (!Su(e, t)) {
        if (Ni(e)) throw Error(y(418));
        t = vt(n.nextSibling);
        var r = Ce;
        t && Su(e, t) ? ca(r, n) : (e.flags = e.flags & -4097 | 2, W = !1, Ce = e);
      }
    } else {
      if (Ni(e)) throw Error(y(418));
      e.flags = e.flags & -4097 | 2, W = !1, Ce = e;
    }
  }
}
function Eu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Ce = e;
}
function gr(e) {
  if (e !== Ce) return !1;
  if (!W) return Eu(e), W = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ki(e.type, e.memoizedProps)), t && (t = Ne)) {
    if (Ni(e)) throw da(), Error(y(418));
    for (; t; ) ca(e, t), t = vt(t.nextSibling);
  }
  if (Eu(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(y(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Ne = vt(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      Ne = null;
    }
  } else Ne = Ce ? vt(e.stateNode.nextSibling) : null;
  return !0;
}
function da() {
  for (var e = Ne; e; ) e = vt(e.nextSibling);
}
function an() {
  Ne = Ce = null, W = !1;
}
function po(e) {
  Ve === null ? Ve = [e] : Ve.push(e);
}
var cf = it.ReactCurrentBatchConfig;
function Sn(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(y(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(y(147, e));
      var l = r, i = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
        var u = l.refs;
        o === null ? delete u[i] : u[i] = o;
      }, t._stringRef = i, t);
    }
    if (typeof e != "string") throw Error(y(284));
    if (!n._owner) throw Error(y(290, e));
  }
  return e;
}
function yr(e, t) {
  throw e = Object.prototype.toString.call(t), Error(y(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
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
    return f = wt(f, c), f.index = 0, f.sibling = null, f;
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
    return k === Ht ? h(f, c, p.props.children, g, p.key) : c !== null && (c.elementType === k || typeof k == "object" && k !== null && k.$$typeof === ut && _u(k) === c.type) ? (g = l(c, p.props), g.ref = Sn(f, c, p), g.return = f, g) : (g = Or(p.type, p.key, p.props, null, f.mode, g), g.ref = Sn(f, c, p), g.return = f, g);
  }
  function d(f, c, p, g) {
    return c === null || c.tag !== 4 || c.stateNode.containerInfo !== p.containerInfo || c.stateNode.implementation !== p.implementation ? (c = Zl(p, f.mode, g), c.return = f, c) : (c = l(c, p.children || []), c.return = f, c);
  }
  function h(f, c, p, g, k) {
    return c === null || c.tag !== 7 ? (c = Dt(p, f.mode, g, k), c.return = f, c) : (c = l(c, p), c.return = f, c);
  }
  function v(f, c, p) {
    if (typeof c == "string" && c !== "" || typeof c == "number") return c = Xl("" + c, f.mode, p), c.return = f, c;
    if (typeof c == "object" && c !== null) {
      switch (c.$$typeof) {
        case ur:
          return p = Or(c.type, c.key, c.props, null, f.mode, p), p.ref = Sn(f, null, c), p.return = f, p;
        case Bt:
          return c = Zl(c, f.mode, p), c.return = f, c;
        case ut:
          var g = c._init;
          return v(f, g(c._payload), p);
      }
      if (Cn(c) || gn(c)) return c = Dt(c, f.mode, p, null), c.return = f, c;
      yr(f, c);
    }
    return null;
  }
  function m(f, c, p, g) {
    var k = c !== null ? c.key : null;
    if (typeof p == "string" && p !== "" || typeof p == "number") return k !== null ? null : u(f, c, "" + p, g);
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case ur:
          return p.key === k ? s(f, c, p, g) : null;
        case Bt:
          return p.key === k ? d(f, c, p, g) : null;
        case ut:
          return k = p._init, m(
            f,
            c,
            k(p._payload),
            g
          );
      }
      if (Cn(p) || gn(p)) return k !== null ? null : h(f, c, p, g, null);
      yr(f, p);
    }
    return null;
  }
  function S(f, c, p, g, k) {
    if (typeof g == "string" && g !== "" || typeof g == "number") return f = f.get(p) || null, u(c, f, "" + g, k);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case ur:
          return f = f.get(g.key === null ? p : g.key) || null, s(c, f, g, k);
        case Bt:
          return f = f.get(g.key === null ? p : g.key) || null, d(c, f, g, k);
        case ut:
          var j = g._init;
          return S(f, c, p, j(g._payload), k);
      }
      if (Cn(g) || gn(g)) return f = f.get(p) || null, h(c, f, g, k, null);
      yr(c, g);
    }
    return null;
  }
  function w(f, c, p, g) {
    for (var k = null, j = null, z = c, P = c = 0, $ = null; z !== null && P < p.length; P++) {
      z.index > P ? ($ = z, z = null) : $ = z.sibling;
      var D = m(f, z, p[P], g);
      if (D === null) {
        z === null && (z = $);
        break;
      }
      e && z && D.alternate === null && t(f, z), c = i(D, c, P), j === null ? k = D : j.sibling = D, j = D, z = $;
    }
    if (P === p.length) return n(f, z), W && Ct(f, P), k;
    if (z === null) {
      for (; P < p.length; P++) z = v(f, p[P], g), z !== null && (c = i(z, c, P), j === null ? k = z : j.sibling = z, j = z);
      return W && Ct(f, P), k;
    }
    for (z = r(f, z); P < p.length; P++) $ = S(z, f, P, p[P], g), $ !== null && (e && $.alternate !== null && z.delete($.key === null ? P : $.key), c = i($, c, P), j === null ? k = $ : j.sibling = $, j = $);
    return e && z.forEach(function(ee) {
      return t(f, ee);
    }), W && Ct(f, P), k;
  }
  function E(f, c, p, g) {
    var k = gn(p);
    if (typeof k != "function") throw Error(y(150));
    if (p = k.call(p), p == null) throw Error(y(151));
    for (var j = k = null, z = c, P = c = 0, $ = null, D = p.next(); z !== null && !D.done; P++, D = p.next()) {
      z.index > P ? ($ = z, z = null) : $ = z.sibling;
      var ee = m(f, z, D.value, g);
      if (ee === null) {
        z === null && (z = $);
        break;
      }
      e && z && ee.alternate === null && t(f, z), c = i(ee, c, P), j === null ? k = ee : j.sibling = ee, j = ee, z = $;
    }
    if (D.done) return n(
      f,
      z
    ), W && Ct(f, P), k;
    if (z === null) {
      for (; !D.done; P++, D = p.next()) D = v(f, D.value, g), D !== null && (c = i(D, c, P), j === null ? k = D : j.sibling = D, j = D);
      return W && Ct(f, P), k;
    }
    for (z = r(f, z); !D.done; P++, D = p.next()) D = S(z, f, P, D.value, g), D !== null && (e && D.alternate !== null && z.delete(D.key === null ? P : D.key), c = i(D, c, P), j === null ? k = D : j.sibling = D, j = D);
    return e && z.forEach(function(O) {
      return t(f, O);
    }), W && Ct(f, P), k;
  }
  function _(f, c, p, g) {
    if (typeof p == "object" && p !== null && p.type === Ht && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case ur:
          e: {
            for (var k = p.key, j = c; j !== null; ) {
              if (j.key === k) {
                if (k = p.type, k === Ht) {
                  if (j.tag === 7) {
                    n(f, j.sibling), c = l(j, p.props.children), c.return = f, f = c;
                    break e;
                  }
                } else if (j.elementType === k || typeof k == "object" && k !== null && k.$$typeof === ut && _u(k) === j.type) {
                  n(f, j.sibling), c = l(j, p.props), c.ref = Sn(f, j, p), c.return = f, f = c;
                  break e;
                }
                n(f, j);
                break;
              } else t(f, j);
              j = j.sibling;
            }
            p.type === Ht ? (c = Dt(p.props.children, f.mode, g, p.key), c.return = f, f = c) : (g = Or(p.type, p.key, p.props, null, f.mode, g), g.ref = Sn(f, c, p), g.return = f, f = g);
          }
          return o(f);
        case Bt:
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
            c = Zl(p, f.mode, g), c.return = f, f = c;
          }
          return o(f);
        case ut:
          return j = p._init, _(f, c, j(p._payload), g);
      }
      if (Cn(p)) return w(f, c, p, g);
      if (gn(p)) return E(f, c, p, g);
      yr(f, p);
    }
    return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, c !== null && c.tag === 6 ? (n(f, c.sibling), c = l(c, p), c.return = f, f = c) : (n(f, c), c = Xl(p, f.mode, g), c.return = f, f = c), o(f)) : n(f, c);
  }
  return _;
}
var cn = fa(!0), pa = fa(!1), Zr = _t(null), Jr = null, Jt = null, mo = null;
function ho() {
  mo = Jt = Jr = null;
}
function vo(e) {
  var t = Zr.current;
  H(Zr), e._currentValue = t;
}
function ji(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function ln(e, t) {
  Jr = e, mo = Jt = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (we = !0), e.firstContext = null);
}
function Ie(e) {
  var t = e._currentValue;
  if (mo !== e) if (e = { context: e, memoizedValue: t, next: null }, Jt === null) {
    if (Jr === null) throw Error(y(308));
    Jt = e, Jr.dependencies = { lanes: 0, firstContext: e };
  } else Jt = Jt.next = e;
  return t;
}
var Pt = null;
function go(e) {
  Pt === null ? Pt = [e] : Pt.push(e);
}
function ma(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, go(t)) : (n.next = l.next, l.next = n), t.interleaved = n, rt(e, r);
}
function rt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var st = !1;
function yo(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function ha(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function et(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function gt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, I & 2) {
    var l = r.pending;
    return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, rt(e, n);
  }
  return l = r.interleaved, l === null ? (t.next = t, go(r)) : (t.next = l.next, l.next = t), r.interleaved = t, rt(e, n);
}
function Tr(e, t, n) {
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
function qr(e, t, n, r) {
  var l = e.updateQueue;
  st = !1;
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
      var m = u.lane, S = u.eventTime;
      if ((r & m) === m) {
        h !== null && (h = h.next = {
          eventTime: S,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var w = e, E = u;
          switch (m = t, S = n, E.tag) {
            case 1:
              if (w = E.payload, typeof w == "function") {
                v = w.call(S, v, m);
                break e;
              }
              v = w;
              break e;
            case 3:
              w.flags = w.flags & -65537 | 128;
            case 0:
              if (w = E.payload, m = typeof w == "function" ? w.call(S, v, m) : w, m == null) break e;
              v = G({}, v, m);
              break e;
            case 2:
              st = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, m = l.effects, m === null ? l.effects = [u] : m.push(u));
      } else S = { eventTime: S, lane: m, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, h === null ? (d = h = S, s = v) : h = h.next = S, o |= m;
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
    Ot |= o, e.lanes = o, e.memoizedState = v;
  }
}
function Cu(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = n, typeof l != "function") throw Error(y(191, l));
      l.call(r);
    }
  }
}
var ir = {}, Xe = _t(ir), Xn = _t(ir), Zn = _t(ir);
function Tt(e) {
  if (e === ir) throw Error(y(174));
  return e;
}
function xo(e, t) {
  switch (U(Zn, t), U(Xn, e), U(Xe, ir), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ui(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = ui(t, e);
  }
  H(Xe), U(Xe, t);
}
function dn() {
  H(Xe), H(Xn), H(Zn);
}
function va(e) {
  Tt(Zn.current);
  var t = Tt(Xe.current), n = ui(t, e.type);
  t !== n && (U(Xn, e), U(Xe, n));
}
function wo(e) {
  Xn.current === e && (H(Xe), H(Xn));
}
var K = _t(0);
function br(e) {
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
function ko() {
  for (var e = 0; e < Hl.length; e++) Hl[e]._workInProgressVersionPrimary = null;
  Hl.length = 0;
}
var Lr = it.ReactCurrentDispatcher, Wl = it.ReactCurrentBatchConfig, It = 0, Y = null, ne = null, le = null, el = !1, Mn = !1, Jn = 0, df = 0;
function de() {
  throw Error(y(321));
}
function So(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!We(e[n], t[n])) return !1;
  return !0;
}
function Eo(e, t, n, r, l, i) {
  if (It = i, Y = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Lr.current = e === null || e.memoizedState === null ? hf : vf, e = n(r, l), Mn) {
    i = 0;
    do {
      if (Mn = !1, Jn = 0, 25 <= i) throw Error(y(301));
      i += 1, le = ne = null, t.updateQueue = null, Lr.current = gf, e = n(r, l);
    } while (Mn);
  }
  if (Lr.current = tl, t = ne !== null && ne.next !== null, It = 0, le = ne = Y = null, el = !1, t) throw Error(y(300));
  return e;
}
function _o() {
  var e = Jn !== 0;
  return Jn = 0, e;
}
function Ke() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return le === null ? Y.memoizedState = le = e : le = le.next = e, le;
}
function Oe() {
  if (ne === null) {
    var e = Y.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = ne.next;
  var t = le === null ? Y.memoizedState : le.next;
  if (t !== null) le = t, ne = e;
  else {
    if (e === null) throw Error(y(310));
    ne = e, e = { memoizedState: ne.memoizedState, baseState: ne.baseState, baseQueue: ne.baseQueue, queue: ne.queue, next: null }, le === null ? Y.memoizedState = le = e : le = le.next = e;
  }
  return le;
}
function qn(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Ql(e) {
  var t = Oe(), n = t.queue;
  if (n === null) throw Error(y(311));
  n.lastRenderedReducer = e;
  var r = ne, l = r.baseQueue, i = n.pending;
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
      if ((It & h) === h) s !== null && (s = s.next = { lane: 0, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }), r = d.hasEagerState ? d.eagerState : e(r, d.action);
      else {
        var v = {
          lane: h,
          action: d.action,
          hasEagerState: d.hasEagerState,
          eagerState: d.eagerState,
          next: null
        };
        s === null ? (u = s = v, o = r) : s = s.next = v, Y.lanes |= h, Ot |= h;
      }
      d = d.next;
    } while (d !== null && d !== i);
    s === null ? o = r : s.next = u, We(r, t.memoizedState) || (we = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = s, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      i = l.lane, Y.lanes |= i, Ot |= i, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Kl(e) {
  var t = Oe(), n = t.queue;
  if (n === null) throw Error(y(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, l = n.pending, i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = l = l.next;
    do
      i = e(i, o.action), o = o.next;
    while (o !== l);
    We(i, t.memoizedState) || (we = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function ga() {
}
function ya(e, t) {
  var n = Y, r = Oe(), l = t(), i = !We(r.memoizedState, l);
  if (i && (r.memoizedState = l, we = !0), r = r.queue, No(ka.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || le !== null && le.memoizedState.tag & 1) {
    if (n.flags |= 2048, bn(9, wa.bind(null, n, r, l, t), void 0, null), ie === null) throw Error(y(349));
    It & 30 || xa(n, t, l);
  }
  return l;
}
function xa(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Y.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Y.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
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
    return !We(e, n);
  } catch {
    return !0;
  }
}
function Ea(e) {
  var t = rt(e, 1);
  t !== null && He(t, e, 1, -1);
}
function ju(e) {
  var t = Ke();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: qn, lastRenderedState: e }, t.queue = e, e = e.dispatch = mf.bind(null, Y, e), [t.memoizedState, e];
}
function bn(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Y.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Y.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function _a() {
  return Oe().memoizedState;
}
function Dr(e, t, n, r) {
  var l = Ke();
  Y.flags |= e, l.memoizedState = bn(1 | t, n, void 0, r === void 0 ? null : r);
}
function ml(e, t, n, r) {
  var l = Oe();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (ne !== null) {
    var o = ne.memoizedState;
    if (i = o.destroy, r !== null && So(r, o.deps)) {
      l.memoizedState = bn(t, n, i, r);
      return;
    }
  }
  Y.flags |= e, l.memoizedState = bn(1 | t, n, i, r);
}
function zu(e, t) {
  return Dr(8390656, 8, e, t);
}
function No(e, t) {
  return ml(2048, 8, e, t);
}
function Na(e, t) {
  return ml(4, 2, e, t);
}
function Ca(e, t) {
  return ml(4, 4, e, t);
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
  return n = n != null ? n.concat([e]) : null, ml(4, 4, ja.bind(null, t, e), n);
}
function Co() {
}
function Pa(e, t) {
  var n = Oe();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && So(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Ta(e, t) {
  var n = Oe();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && So(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function La(e, t, n) {
  return It & 21 ? (We(n, t) || (n = Os(), Y.lanes |= n, Ot |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, we = !0), e.memoizedState = n);
}
function ff(e, t) {
  var n = F;
  F = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = Wl.transition;
  Wl.transition = {};
  try {
    e(!1), t();
  } finally {
    F = n, Wl.transition = r;
  }
}
function Da() {
  return Oe().memoizedState;
}
function pf(e, t, n) {
  var r = xt(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ra(e)) Ma(t, n);
  else if (n = ma(e, t, n, r), n !== null) {
    var l = ve();
    He(n, e, r, l), Ia(n, t, r);
  }
}
function mf(e, t, n) {
  var r = xt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Ra(e)) Ma(t, l);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var o = t.lastRenderedState, u = i(o, n);
      if (l.hasEagerState = !0, l.eagerState = u, We(u, o)) {
        var s = t.interleaved;
        s === null ? (l.next = l, go(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = ma(e, t, l, r), n !== null && (l = ve(), He(n, e, r, l), Ia(n, t, r));
  }
}
function Ra(e) {
  var t = e.alternate;
  return e === Y || t !== null && t === Y;
}
function Ma(e, t) {
  Mn = el = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function Ia(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, no(e, n);
  }
}
var tl = { readContext: Ie, useCallback: de, useContext: de, useEffect: de, useImperativeHandle: de, useInsertionEffect: de, useLayoutEffect: de, useMemo: de, useReducer: de, useRef: de, useState: de, useDebugValue: de, useDeferredValue: de, useTransition: de, useMutableSource: de, useSyncExternalStore: de, useId: de, unstable_isNewReconciler: !1 }, hf = { readContext: Ie, useCallback: function(e, t) {
  return Ke().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: Ie, useEffect: zu, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Dr(
    4194308,
    4,
    ja.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return Dr(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return Dr(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = Ke();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = Ke();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = pf.bind(null, Y, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Ke();
  return e = { current: e }, t.memoizedState = e;
}, useState: ju, useDebugValue: Co, useDeferredValue: function(e) {
  return Ke().memoizedState = e;
}, useTransition: function() {
  var e = ju(!1), t = e[0];
  return e = ff.bind(null, e[1]), Ke().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = Y, l = Ke();
  if (W) {
    if (n === void 0) throw Error(y(407));
    n = n();
  } else {
    if (n = t(), ie === null) throw Error(y(349));
    It & 30 || xa(r, t, n);
  }
  l.memoizedState = n;
  var i = { value: n, getSnapshot: t };
  return l.queue = i, zu(ka.bind(
    null,
    r,
    i,
    e
  ), [e]), r.flags |= 2048, bn(9, wa.bind(null, r, i, n, t), void 0, null), n;
}, useId: function() {
  var e = Ke(), t = ie.identifierPrefix;
  if (W) {
    var n = be, r = qe;
    n = (r & ~(1 << 32 - Be(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Jn++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = df++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, vf = {
  readContext: Ie,
  useCallback: Pa,
  useContext: Ie,
  useEffect: No,
  useImperativeHandle: za,
  useInsertionEffect: Na,
  useLayoutEffect: Ca,
  useMemo: Ta,
  useReducer: Ql,
  useRef: _a,
  useState: function() {
    return Ql(qn);
  },
  useDebugValue: Co,
  useDeferredValue: function(e) {
    var t = Oe();
    return La(t, ne.memoizedState, e);
  },
  useTransition: function() {
    var e = Ql(qn)[0], t = Oe().memoizedState;
    return [e, t];
  },
  useMutableSource: ga,
  useSyncExternalStore: ya,
  useId: Da,
  unstable_isNewReconciler: !1
}, gf = { readContext: Ie, useCallback: Pa, useContext: Ie, useEffect: No, useImperativeHandle: za, useInsertionEffect: Na, useLayoutEffect: Ca, useMemo: Ta, useReducer: Kl, useRef: _a, useState: function() {
  return Kl(qn);
}, useDebugValue: Co, useDeferredValue: function(e) {
  var t = Oe();
  return ne === null ? t.memoizedState = e : La(t, ne.memoizedState, e);
}, useTransition: function() {
  var e = Kl(qn)[0], t = Oe().memoizedState;
  return [e, t];
}, useMutableSource: ga, useSyncExternalStore: ya, useId: Da, unstable_isNewReconciler: !1 };
function Ae(e, t) {
  if (e && e.defaultProps) {
    t = G({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function zi(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : G({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var hl = { isMounted: function(e) {
  return (e = e._reactInternals) ? At(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = ve(), l = xt(e), i = et(r, l);
  i.payload = t, n != null && (i.callback = n), t = gt(e, i, l), t !== null && (He(t, e, l, r), Tr(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = ve(), l = xt(e), i = et(r, l);
  i.tag = 1, i.payload = t, n != null && (i.callback = n), t = gt(e, i, l), t !== null && (He(t, e, l, r), Tr(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = ve(), r = xt(e), l = et(n, r);
  l.tag = 2, t != null && (l.callback = t), t = gt(e, l, r), t !== null && (He(t, e, r, n), Tr(t, e, r));
} };
function Pu(e, t, n, r, l, i, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Qn(n, r) || !Qn(l, i) : !0;
}
function Oa(e, t, n) {
  var r = !1, l = St, i = t.contextType;
  return typeof i == "object" && i !== null ? i = Ie(i) : (l = Se(t) ? Rt : me.current, r = t.contextTypes, i = (r = r != null) ? sn(e, l) : St), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = hl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function Tu(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && hl.enqueueReplaceState(t, t.state, null);
}
function Pi(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, yo(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? l.context = Ie(i) : (i = Se(t) ? Rt : me.current, l.context = sn(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (zi(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && hl.enqueueReplaceState(l, l.state, null), qr(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function fn(e, t) {
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
var yf = typeof WeakMap == "function" ? WeakMap : Map;
function Fa(e, t, n) {
  n = et(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    rl || (rl = !0, Ui = r), Ti(e, t);
  }, n;
}
function $a(e, t, n) {
  n = et(-1, n), n.tag = 3;
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
    Ti(e, t), typeof r != "function" && (yt === null ? yt = /* @__PURE__ */ new Set([this]) : yt.add(this));
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
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = et(-1, 1), t.tag = 2, gt(n, t, 1))), n.lanes |= 1), e);
}
var xf = it.ReactCurrentOwner, we = !1;
function he(e, t, n, r) {
  t.child = e === null ? pa(t, null, n, r) : cn(t, e.child, n, r);
}
function Mu(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return ln(t, l), r = Eo(e, t, n, r, i, l), n = _o(), e !== null && !we ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, lt(e, t, l)) : (W && n && co(t), t.flags |= 1, he(e, t, r, l), t.child);
}
function Iu(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" && !Mo(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Aa(e, t, i, r, l)) : (e = Or(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (i = e.child, !(e.lanes & l)) {
    var o = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Qn, n(o, r) && e.ref === t.ref) return lt(e, t, l);
  }
  return t.flags |= 1, e = wt(i, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Aa(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (Qn(i, r) && e.ref === t.ref) if (we = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) e.flags & 131072 && (we = !0);
    else return t.lanes = e.lanes, lt(e, t, l);
  }
  return Li(e, t, n, r, l);
}
function Ua(e, t, n) {
  var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, U(bt, _e), _e |= n;
  else {
    if (!(n & 1073741824)) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, U(bt, _e), _e |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, U(bt, _e), _e |= r;
  }
  else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, U(bt, _e), _e |= r;
  return he(e, t, l, n), t.child;
}
function Va(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Li(e, t, n, r, l) {
  var i = Se(n) ? Rt : me.current;
  return i = sn(t, i), ln(t, l), n = Eo(e, t, n, r, i, l), r = _o(), e !== null && !we ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, lt(e, t, l)) : (W && r && co(t), t.flags |= 1, he(e, t, n, l), t.child);
}
function Ou(e, t, n, r, l) {
  if (Se(n)) {
    var i = !0;
    Yr(t);
  } else i = !1;
  if (ln(t, l), t.stateNode === null) Rr(e, t), Oa(t, n, r), Pi(t, n, r, l), r = !0;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var s = o.context, d = n.contextType;
    typeof d == "object" && d !== null ? d = Ie(d) : (d = Se(n) ? Rt : me.current, d = sn(t, d));
    var h = n.getDerivedStateFromProps, v = typeof h == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    v || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || s !== d) && Tu(t, o, r, d), st = !1;
    var m = t.memoizedState;
    o.state = m, qr(t, r, o, l), s = t.memoizedState, u !== r || m !== s || ke.current || st ? (typeof h == "function" && (zi(t, n, h, r), s = t.memoizedState), (u = st || Pu(t, n, u, r, m, s, d)) ? (v || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), o.props = r, o.state = s, o.context = d, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, ha(e, t), u = t.memoizedProps, d = t.type === t.elementType ? u : Ae(t.type, u), o.props = d, v = t.pendingProps, m = o.context, s = n.contextType, typeof s == "object" && s !== null ? s = Ie(s) : (s = Se(n) ? Rt : me.current, s = sn(t, s));
    var S = n.getDerivedStateFromProps;
    (h = typeof S == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== v || m !== s) && Tu(t, o, r, s), st = !1, m = t.memoizedState, o.state = m, qr(t, r, o, l);
    var w = t.memoizedState;
    u !== v || m !== w || ke.current || st ? (typeof S == "function" && (zi(t, n, S, r), w = t.memoizedState), (d = st || Pu(t, n, d, r, m, w, s) || !1) ? (h || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, w, s), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, w, s)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = w), o.props = r, o.state = w, o.context = s, r = d) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Di(e, t, n, r, i, l);
}
function Di(e, t, n, r, l, i) {
  Va(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && ku(t, n, !1), lt(e, t, i);
  r = t.stateNode, xf.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = cn(t, e.child, null, i), t.child = cn(t, null, u, i)) : he(e, t, u, i), t.memoizedState = r.state, l && ku(t, n, !0), t.child;
}
function Ba(e) {
  var t = e.stateNode;
  t.pendingContext ? wu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && wu(e, t.context, !1), xo(e, t.containerInfo);
}
function Fu(e, t, n, r, l) {
  return an(), po(l), t.flags |= 256, he(e, t, n, r), t.child;
}
var Ri = { dehydrated: null, treeContext: null, retryLane: 0 };
function Mi(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Ha(e, t, n) {
  var r = t.pendingProps, l = K.current, i = !1, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), U(K, l & 1), e === null)
    return Ci(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = yl(o, r, 0, null), e = Dt(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Mi(n), t.memoizedState = Ri, e) : jo(t, o));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return wf(e, t, o, r, u, l, n);
  if (i) {
    i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
    var s = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = wt(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = wt(u, i) : (i = Dt(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? Mi(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = Ri, r;
  }
  return i = e.child, e = i.sibling, r = wt(i, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function jo(e, t) {
  return t = yl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function xr(e, t, n, r) {
  return r !== null && po(r), cn(t, e.child, null, n), e = jo(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function wf(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = Yl(Error(y(422))), xr(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = yl({ mode: "visible", children: r.children }, l, 0, null), i = Dt(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, t.mode & 1 && cn(t, e.child, null, o), t.child.memoizedState = Mi(o), t.memoizedState = Ri, i);
  if (!(t.mode & 1)) return xr(e, t, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, i = Error(y(419)), r = Yl(i, r, void 0), xr(e, t, o, r);
  }
  if (u = (o & e.childLanes) !== 0, we || u) {
    if (r = ie, r !== null) {
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
      l = l & (r.suspendedLanes | o) ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, rt(e, l), He(r, e, l, -1));
    }
    return Ro(), r = Yl(Error(y(421))), xr(e, t, o, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Rf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, Ne = vt(l.nextSibling), Ce = t, W = !0, Ve = null, e !== null && (Le[De++] = qe, Le[De++] = be, Le[De++] = Mt, qe = e.id, be = e.overflow, Mt = t), t = jo(t, r.children), t.flags |= 4096, t);
}
function $u(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), ji(e.return, t, n);
}
function Gl(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
}
function Wa(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, i = r.tail;
  if (he(e, t, r.children, n), r = K.current, r & 2) r = r & 1 | 2, t.flags |= 128;
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
  if (U(K, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && br(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Gl(t, !1, l, n, i);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && br(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Gl(t, !0, n, null, i);
      break;
    case "together":
      Gl(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function Rr(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function lt(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), Ot |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(y(153));
  if (t.child !== null) {
    for (e = t.child, n = wt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = wt(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function kf(e, t, n) {
  switch (t.tag) {
    case 3:
      Ba(t), an();
      break;
    case 5:
      va(t);
      break;
    case 1:
      Se(t.type) && Yr(t);
      break;
    case 4:
      xo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      U(Zr, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (U(K, K.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Ha(e, t, n) : (U(K, K.current & 1), e = lt(e, t, n), e !== null ? e.sibling : null);
      U(K, K.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Wa(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), U(K, K.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Ua(e, t, n);
  }
  return lt(e, t, n);
}
var Qa, Ii, Ka, Ya;
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
Ii = function() {
};
Ka = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, Tt(Xe.current);
    var i = null;
    switch (n) {
      case "input":
        l = ri(e, l), r = ri(e, r), i = [];
        break;
      case "select":
        l = G({}, l, { value: void 0 }), r = G({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        l = oi(e, l), r = oi(e, r), i = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Qr);
    }
    si(n, r);
    var o;
    n = null;
    for (d in l) if (!r.hasOwnProperty(d) && l.hasOwnProperty(d) && l[d] != null) if (d === "style") {
      var u = l[d];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else d !== "dangerouslySetInnerHTML" && d !== "children" && d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && ($n.hasOwnProperty(d) ? i || (i = []) : (i = i || []).push(d, null));
    for (d in r) {
      var s = r[d];
      if (u = l?.[d], r.hasOwnProperty(d) && s !== u && (s != null || u != null)) if (d === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in s) s.hasOwnProperty(o) && u[o] !== s[o] && (n || (n = {}), n[o] = s[o]);
      } else n || (i || (i = []), i.push(
        d,
        n
      )), n = s;
      else d === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (i = i || []).push(d, s)) : d === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(d, "" + s) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && ($n.hasOwnProperty(d) ? (s != null && d === "onScroll" && B("scroll", e), i || u === s || (i = [])) : (i = i || []).push(d, s));
    }
    n && (i = i || []).push("style", n);
    var d = i;
    (t.updateQueue = d) && (t.flags |= 4);
  }
};
Ya = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function En(e, t) {
  if (!W) switch (e.tailMode) {
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
function fe(e) {
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
      return fe(t), null;
    case 1:
      return Se(t.type) && Kr(), fe(t), null;
    case 3:
      return r = t.stateNode, dn(), H(ke), H(me), ko(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (gr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ve !== null && (Hi(Ve), Ve = null))), Ii(e, t), fe(t), null;
    case 5:
      wo(t);
      var l = Tt(Zn.current);
      if (n = t.type, e !== null && t.stateNode != null) Ka(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(y(166));
          return fe(t), null;
        }
        if (e = Tt(Xe.current), gr(t)) {
          r = t.stateNode, n = t.type;
          var i = t.memoizedProps;
          switch (r[Ye] = t, r[Gn] = i, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              B("cancel", r), B("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              B("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < zn.length; l++) B(zn[l], r);
              break;
            case "source":
              B("error", r);
              break;
            case "img":
            case "image":
            case "link":
              B(
                "error",
                r
              ), B("load", r);
              break;
            case "details":
              B("toggle", r);
              break;
            case "input":
              Yo(r, i), B("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, B("invalid", r);
              break;
            case "textarea":
              Xo(r, i), B("invalid", r);
          }
          si(n, i), l = null;
          for (var o in i) if (i.hasOwnProperty(o)) {
            var u = i[o];
            o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && vr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && vr(
              r.textContent,
              u,
              e
            ), l = ["children", "" + u]) : $n.hasOwnProperty(o) && u != null && o === "onScroll" && B("scroll", r);
          }
          switch (n) {
            case "input":
              sr(r), Go(r, i, !0);
              break;
            case "textarea":
              sr(r), Zo(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Qr);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ks(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Ye] = t, e[Gn] = r, Qa(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = ai(n, r), n) {
              case "dialog":
                B("cancel", e), B("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                B("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < zn.length; l++) B(zn[l], e);
                l = r;
                break;
              case "source":
                B("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                B(
                  "error",
                  e
                ), B("load", e), l = r;
                break;
              case "details":
                B("toggle", e), l = r;
                break;
              case "input":
                Yo(e, r), l = ri(e, r), B("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = G({}, r, { value: void 0 }), B("invalid", e);
                break;
              case "textarea":
                Xo(e, r), l = oi(e, r), B("invalid", e);
                break;
              default:
                l = r;
            }
            si(n, l), u = l;
            for (i in u) if (u.hasOwnProperty(i)) {
              var s = u[i];
              i === "style" ? _s(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Ss(e, s)) : i === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && An(e, s) : typeof s == "number" && An(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && ($n.hasOwnProperty(i) ? s != null && i === "onScroll" && B("scroll", e) : s != null && Zi(e, i, s, o));
            }
            switch (n) {
              case "input":
                sr(e), Go(e, r, !1);
                break;
              case "textarea":
                sr(e), Zo(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + kt(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, i = r.value, i != null ? en(e, !!r.multiple, i, !1) : r.defaultValue != null && en(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = Qr);
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
      return fe(t), null;
    case 6:
      if (e && t.stateNode != null) Ya(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(y(166));
        if (n = Tt(Zn.current), Tt(Xe.current), gr(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Ye] = t, (i = r.nodeValue !== n) && (e = Ce, e !== null)) switch (e.tag) {
            case 3:
              vr(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && vr(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          i && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Ye] = t, t.stateNode = r;
      }
      return fe(t), null;
    case 13:
      if (H(K), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (W && Ne !== null && t.mode & 1 && !(t.flags & 128)) da(), an(), t.flags |= 98560, i = !1;
        else if (i = gr(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!i) throw Error(y(318));
            if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(y(317));
            i[Ye] = t;
          } else an(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          fe(t), i = !1;
        } else Ve !== null && (Hi(Ve), Ve = null), i = !0;
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || K.current & 1 ? re === 0 && (re = 3) : Ro())), t.updateQueue !== null && (t.flags |= 4), fe(t), null);
    case 4:
      return dn(), Ii(e, t), e === null && Kn(t.stateNode.containerInfo), fe(t), null;
    case 10:
      return vo(t.type._context), fe(t), null;
    case 17:
      return Se(t.type) && Kr(), fe(t), null;
    case 19:
      if (H(K), i = t.memoizedState, i === null) return fe(t), null;
      if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) En(i, !1);
      else {
        if (re !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = br(e), o !== null) {
            for (t.flags |= 128, En(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return U(K, K.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        i.tail !== null && J() > pn && (t.flags |= 128, r = !0, En(i, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = br(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), En(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !W) return fe(t), null;
        } else 2 * J() - i.renderingStartTime > pn && n !== 1073741824 && (t.flags |= 128, r = !0, En(i, !1), t.lanes = 4194304);
        i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
      }
      return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = J(), t.sibling = null, n = K.current, U(K, r ? n & 1 | 2 : n & 1), t) : (fe(t), null);
    case 22:
    case 23:
      return Do(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? _e & 1073741824 && (fe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : fe(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(y(156, t.tag));
}
function Ef(e, t) {
  switch (fo(t), t.tag) {
    case 1:
      return Se(t.type) && Kr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return dn(), H(ke), H(me), ko(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return wo(t), null;
    case 13:
      if (H(K), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(y(340));
        an();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return H(K), null;
    case 4:
      return dn(), null;
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
var wr = !1, pe = !1, _f = typeof WeakSet == "function" ? WeakSet : Set, C = null;
function qt(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    Z(e, t, r);
  }
  else n.current = null;
}
function Oi(e, t, n) {
  try {
    n();
  } catch (r) {
    Z(e, t, r);
  }
}
var Au = !1;
function Nf(e, t) {
  if (xi = Br, e = qs(), ao(e)) {
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
          for (var S; v !== n || l !== 0 && v.nodeType !== 3 || (u = o + l), v !== i || r !== 0 && v.nodeType !== 3 || (s = o + r), v.nodeType === 3 && (o += v.nodeValue.length), (S = v.firstChild) !== null; )
            m = v, v = S;
          for (; ; ) {
            if (v === e) break t;
            if (m === n && ++d === l && (u = o), m === i && ++h === r && (s = o), (S = v.nextSibling) !== null) break;
            v = m, m = v.parentNode;
          }
          v = S;
        }
        n = u === -1 || s === -1 ? null : { start: u, end: s };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (wi = { focusedElem: e, selectionRange: n }, Br = !1, C = t; C !== null; ) if (t = C, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, C = e;
  else for (; C !== null; ) {
    t = C;
    try {
      var w = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (w !== null) {
            var E = w.memoizedProps, _ = w.memoizedState, f = t.stateNode, c = f.getSnapshotBeforeUpdate(t.elementType === t.type ? E : Ae(t.type, E), _);
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
          throw Error(y(163));
      }
    } catch (g) {
      Z(t, t.return, g);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, C = e;
      break;
    }
    C = t.return;
  }
  return w = Au, Au = !1, w;
}
function In(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        l.destroy = void 0, i !== void 0 && Oi(t, n, i);
      }
      l = l.next;
    } while (l !== r);
  }
}
function vl(e, t) {
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
function Ga(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Ga(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ye], delete t[Gn], delete t[Ei], delete t[uf], delete t[sf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Xa(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Uu(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Xa(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function $i(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Qr));
  else if (r !== 4 && (e = e.child, e !== null)) for ($i(e, t, n), e = e.sibling; e !== null; ) $i(e, t, n), e = e.sibling;
}
function Ai(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Ai(e, t, n), e = e.sibling; e !== null; ) Ai(e, t, n), e = e.sibling;
}
var oe = null, Ue = !1;
function ot(e, t, n) {
  for (n = n.child; n !== null; ) Za(e, t, n), n = n.sibling;
}
function Za(e, t, n) {
  if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
    Ge.onCommitFiberUnmount(sl, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      pe || qt(n, t);
    case 6:
      var r = oe, l = Ue;
      oe = null, ot(e, t, n), oe = r, Ue = l, oe !== null && (Ue ? (e = oe, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : oe.removeChild(n.stateNode));
      break;
    case 18:
      oe !== null && (Ue ? (e = oe, n = n.stateNode, e.nodeType === 8 ? Vl(e.parentNode, n) : e.nodeType === 1 && Vl(e, n), Hn(e)) : Vl(oe, n.stateNode));
      break;
    case 4:
      r = oe, l = Ue, oe = n.stateNode.containerInfo, Ue = !0, ot(e, t, n), oe = r, Ue = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!pe && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var i = l, o = i.destroy;
          i = i.tag, o !== void 0 && (i & 2 || i & 4) && Oi(n, t, o), l = l.next;
        } while (l !== r);
      }
      ot(e, t, n);
      break;
    case 1:
      if (!pe && (qt(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        Z(n, t, u);
      }
      ot(e, t, n);
      break;
    case 21:
      ot(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (pe = (r = pe) || n.memoizedState !== null, ot(e, t, n), pe = r) : ot(e, t, n);
      break;
    default:
      ot(e, t, n);
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
function $e(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var l = n[r];
    try {
      var i = e, o = t, u = o;
      e: for (; u !== null; ) {
        switch (u.tag) {
          case 5:
            oe = u.stateNode, Ue = !1;
            break e;
          case 3:
            oe = u.stateNode.containerInfo, Ue = !0;
            break e;
          case 4:
            oe = u.stateNode.containerInfo, Ue = !0;
            break e;
        }
        u = u.return;
      }
      if (oe === null) throw Error(y(160));
      Za(i, o, l), oe = null, Ue = !1;
      var s = l.alternate;
      s !== null && (s.return = null), l.return = null;
    } catch (d) {
      Z(l, t, d);
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
      if ($e(t, e), Qe(e), r & 4) {
        try {
          In(3, e, e.return), vl(3, e);
        } catch (E) {
          Z(e, e.return, E);
        }
        try {
          In(5, e, e.return);
        } catch (E) {
          Z(e, e.return, E);
        }
      }
      break;
    case 1:
      $e(t, e), Qe(e), r & 512 && n !== null && qt(n, n.return);
      break;
    case 5:
      if ($e(t, e), Qe(e), r & 512 && n !== null && qt(n, n.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          An(l, "");
        } catch (E) {
          Z(e, e.return, E);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, s = e.updateQueue;
        if (e.updateQueue = null, s !== null) try {
          u === "input" && i.type === "radio" && i.name != null && xs(l, i), ai(u, o);
          var d = ai(u, i);
          for (o = 0; o < s.length; o += 2) {
            var h = s[o], v = s[o + 1];
            h === "style" ? _s(l, v) : h === "dangerouslySetInnerHTML" ? Ss(l, v) : h === "children" ? An(l, v) : Zi(l, h, v, d);
          }
          switch (u) {
            case "input":
              li(l, i);
              break;
            case "textarea":
              ws(l, i);
              break;
            case "select":
              var m = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!i.multiple;
              var S = i.value;
              S != null ? en(l, !!i.multiple, S, !1) : m !== !!i.multiple && (i.defaultValue != null ? en(
                l,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : en(l, !!i.multiple, i.multiple ? [] : "", !1));
          }
          l[Gn] = i;
        } catch (E) {
          Z(e, e.return, E);
        }
      }
      break;
    case 6:
      if ($e(t, e), Qe(e), r & 4) {
        if (e.stateNode === null) throw Error(y(162));
        l = e.stateNode, i = e.memoizedProps;
        try {
          l.nodeValue = i;
        } catch (E) {
          Z(e, e.return, E);
        }
      }
      break;
    case 3:
      if ($e(t, e), Qe(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Hn(t.containerInfo);
      } catch (E) {
        Z(e, e.return, E);
      }
      break;
    case 4:
      $e(t, e), Qe(e);
      break;
    case 13:
      $e(t, e), Qe(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (To = J())), r & 4 && Vu(e);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (pe = (d = pe) || h, $e(t, e), pe = d) : $e(t, e), Qe(e), r & 8192) {
        if (d = e.memoizedState !== null, (e.stateNode.isHidden = d) && !h && e.mode & 1) for (C = e, h = e.child; h !== null; ) {
          for (v = C = h; C !== null; ) {
            switch (m = C, S = m.child, m.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                In(4, m, m.return);
                break;
              case 1:
                qt(m, m.return);
                var w = m.stateNode;
                if (typeof w.componentWillUnmount == "function") {
                  r = m, n = m.return;
                  try {
                    t = r, w.props = t.memoizedProps, w.state = t.memoizedState, w.componentWillUnmount();
                  } catch (E) {
                    Z(r, n, E);
                  }
                }
                break;
              case 5:
                qt(m, m.return);
                break;
              case 22:
                if (m.memoizedState !== null) {
                  Hu(v);
                  continue;
                }
            }
            S !== null ? (S.return = m, C = S) : Hu(v);
          }
          h = h.sibling;
        }
        e: for (h = null, v = e; ; ) {
          if (v.tag === 5) {
            if (h === null) {
              h = v;
              try {
                l = v.stateNode, d ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = v.stateNode, s = v.memoizedProps.style, o = s != null && s.hasOwnProperty("display") ? s.display : null, u.style.display = Es("display", o));
              } catch (E) {
                Z(e, e.return, E);
              }
            }
          } else if (v.tag === 6) {
            if (h === null) try {
              v.stateNode.nodeValue = d ? "" : v.memoizedProps;
            } catch (E) {
              Z(e, e.return, E);
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
      $e(t, e), Qe(e), r & 4 && Vu(e);
      break;
    case 21:
      break;
    default:
      $e(
        t,
        e
      ), Qe(e);
  }
}
function Qe(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Xa(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(y(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (An(l, ""), r.flags &= -33);
          var i = Uu(e);
          Ai(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = Uu(e);
          $i(e, u, o);
          break;
        default:
          throw Error(y(161));
      }
    } catch (s) {
      Z(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Cf(e, t, n) {
  C = e, qa(e);
}
function qa(e, t, n) {
  for (var r = (e.mode & 1) !== 0; C !== null; ) {
    var l = C, i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || wr;
      if (!o) {
        var u = l.alternate, s = u !== null && u.memoizedState !== null || pe;
        u = wr;
        var d = pe;
        if (wr = o, (pe = s) && !d) for (C = l; C !== null; ) o = C, s = o.child, o.tag === 22 && o.memoizedState !== null ? Wu(l) : s !== null ? (s.return = o, C = s) : Wu(l);
        for (; i !== null; ) C = i, qa(i), i = i.sibling;
        C = l, wr = u, pe = d;
      }
      Bu(e);
    } else l.subtreeFlags & 8772 && i !== null ? (i.return = l, C = i) : Bu(e);
  }
}
function Bu(e) {
  for (; C !== null; ) {
    var t = C;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            pe || vl(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !pe) if (n === null) r.componentDidMount();
            else {
              var l = t.elementType === t.type ? n.memoizedProps : Ae(t.type, n.memoizedProps);
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
                  v !== null && Hn(v);
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
            throw Error(y(163));
        }
        pe || t.flags & 512 && Fi(t);
      } catch (m) {
        Z(t, t.return, m);
      }
    }
    if (t === e) {
      C = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, C = n;
      break;
    }
    C = t.return;
  }
}
function Hu(e) {
  for (; C !== null; ) {
    var t = C;
    if (t === e) {
      C = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, C = n;
      break;
    }
    C = t.return;
  }
}
function Wu(e) {
  for (; C !== null; ) {
    var t = C;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            vl(4, t);
          } catch (s) {
            Z(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              Z(t, l, s);
            }
          }
          var i = t.return;
          try {
            Fi(t);
          } catch (s) {
            Z(t, i, s);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Fi(t);
          } catch (s) {
            Z(t, o, s);
          }
      }
    } catch (s) {
      Z(t, t.return, s);
    }
    if (t === e) {
      C = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, C = u;
      break;
    }
    C = t.return;
  }
}
var jf = Math.ceil, nl = it.ReactCurrentDispatcher, zo = it.ReactCurrentOwner, Me = it.ReactCurrentBatchConfig, I = 0, ie = null, b = null, ue = 0, _e = 0, bt = _t(0), re = 0, er = null, Ot = 0, gl = 0, Po = 0, On = null, xe = null, To = 0, pn = 1 / 0, Ze = null, rl = !1, Ui = null, yt = null, kr = !1, ft = null, ll = 0, Fn = 0, Vi = null, Mr = -1, Ir = 0;
function ve() {
  return I & 6 ? J() : Mr !== -1 ? Mr : Mr = J();
}
function xt(e) {
  return e.mode & 1 ? I & 2 && ue !== 0 ? ue & -ue : cf.transition !== null ? (Ir === 0 && (Ir = Os()), Ir) : (e = F, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Hs(e.type)), e) : 1;
}
function He(e, t, n, r) {
  if (50 < Fn) throw Fn = 0, Vi = null, Error(y(185));
  nr(e, n, r), (!(I & 2) || e !== ie) && (e === ie && (!(I & 2) && (gl |= n), re === 4 && ct(e, ue)), Ee(e, r), n === 1 && I === 0 && !(t.mode & 1) && (pn = J() + 500, pl && Nt()));
}
function Ee(e, t) {
  var n = e.callbackNode;
  ad(e, t);
  var r = Vr(e, e === ie ? ue : 0);
  if (r === 0) n !== null && bo(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && bo(n), t === 1) e.tag === 0 ? af(Qu.bind(null, e)) : sa(Qu.bind(null, e)), lf(function() {
      !(I & 6) && Nt();
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
  if (Mr = -1, Ir = 0, I & 6) throw Error(y(327));
  var n = e.callbackNode;
  if (on() && e.callbackNode !== n) return null;
  var r = Vr(e, e === ie ? ue : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = il(e, r);
  else {
    t = r;
    var l = I;
    I |= 2;
    var i = tc();
    (ie !== e || ue !== t) && (Ze = null, pn = J() + 500, Lt(e, t));
    do
      try {
        Tf();
        break;
      } catch (u) {
        ec(e, u);
      }
    while (!0);
    ho(), nl.current = i, I = l, b !== null ? t = 0 : (ie = null, ue = 0, t = re);
  }
  if (t !== 0) {
    if (t === 2 && (l = mi(e), l !== 0 && (r = l, t = Bi(e, l))), t === 1) throw n = er, Lt(e, 0), ct(e, r), Ee(e, J()), n;
    if (t === 6) ct(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !zf(l) && (t = il(e, r), t === 2 && (i = mi(e), i !== 0 && (r = i, t = Bi(e, i))), t === 1)) throw n = er, Lt(e, 0), ct(e, r), Ee(e, J()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(y(345));
        case 2:
          jt(e, xe, Ze);
          break;
        case 3:
          if (ct(e, r), (r & 130023424) === r && (t = To + 500 - J(), 10 < t)) {
            if (Vr(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              ve(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = Si(jt.bind(null, e, xe, Ze), t);
            break;
          }
          jt(e, xe, Ze);
          break;
        case 4:
          if (ct(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - Be(r);
            i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
          }
          if (r = l, r = J() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * jf(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = Si(jt.bind(null, e, xe, Ze), r);
            break;
          }
          jt(e, xe, Ze);
          break;
        case 5:
          jt(e, xe, Ze);
          break;
        default:
          throw Error(y(329));
      }
    }
  }
  return Ee(e, J()), e.callbackNode === n ? ba.bind(null, e) : null;
}
function Bi(e, t) {
  var n = On;
  return e.current.memoizedState.isDehydrated && (Lt(e, t).flags |= 256), e = il(e, t), e !== 2 && (t = xe, xe = n, t !== null && Hi(t)), e;
}
function Hi(e) {
  xe === null ? xe = e : xe.push.apply(xe, e);
}
function zf(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var l = n[r], i = l.getSnapshot;
        l = l.value;
        try {
          if (!We(i(), l)) return !1;
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
function ct(e, t) {
  for (t &= ~Po, t &= ~gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Be(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function Qu(e) {
  if (I & 6) throw Error(y(327));
  on();
  var t = Vr(e, 0);
  if (!(t & 1)) return Ee(e, J()), null;
  var n = il(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = mi(e);
    r !== 0 && (t = r, n = Bi(e, r));
  }
  if (n === 1) throw n = er, Lt(e, 0), ct(e, t), Ee(e, J()), n;
  if (n === 6) throw Error(y(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, jt(e, xe, Ze), Ee(e, J()), null;
}
function Lo(e, t) {
  var n = I;
  I |= 1;
  try {
    return e(t);
  } finally {
    I = n, I === 0 && (pn = J() + 500, pl && Nt());
  }
}
function Ft(e) {
  ft !== null && ft.tag === 0 && !(I & 6) && on();
  var t = I;
  I |= 1;
  var n = Me.transition, r = F;
  try {
    if (Me.transition = null, F = 1, e) return e();
  } finally {
    F = r, Me.transition = n, I = t, !(I & 6) && Nt();
  }
}
function Do() {
  _e = bt.current, H(bt);
}
function Lt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, rf(n)), b !== null) for (n = b.return; n !== null; ) {
    var r = n;
    switch (fo(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Kr();
        break;
      case 3:
        dn(), H(ke), H(me), ko();
        break;
      case 5:
        wo(r);
        break;
      case 4:
        dn();
        break;
      case 13:
        H(K);
        break;
      case 19:
        H(K);
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
  if (ie = e, b = e = wt(e.current, null), ue = _e = t, re = 0, er = null, Po = gl = Ot = 0, xe = On = null, Pt !== null) {
    for (t = 0; t < Pt.length; t++) if (n = Pt[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var l = r.next, i = n.pending;
      if (i !== null) {
        var o = i.next;
        i.next = l, r.next = o;
      }
      n.pending = r;
    }
    Pt = null;
  }
  return e;
}
function ec(e, t) {
  do {
    var n = b;
    try {
      if (ho(), Lr.current = tl, el) {
        for (var r = Y.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        el = !1;
      }
      if (It = 0, le = ne = Y = null, Mn = !1, Jn = 0, zo.current = null, n === null || n.return === null) {
        re = 1, er = t, b = null;
        break;
      }
      e: {
        var i = e, o = n.return, u = n, s = t;
        if (t = ue, u.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
          var d = s, h = u, v = h.tag;
          if (!(h.mode & 1) && (v === 0 || v === 11 || v === 15)) {
            var m = h.alternate;
            m ? (h.updateQueue = m.updateQueue, h.memoizedState = m.memoizedState, h.lanes = m.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var S = Du(o);
          if (S !== null) {
            S.flags &= -257, Ru(S, o, u, i, t), S.mode & 1 && Lu(i, d, t), t = S, s = d;
            var w = t.updateQueue;
            if (w === null) {
              var E = /* @__PURE__ */ new Set();
              E.add(s), t.updateQueue = E;
            } else w.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              Lu(i, d, t), Ro();
              break e;
            }
            s = Error(y(426));
          }
        } else if (W && u.mode & 1) {
          var _ = Du(o);
          if (_ !== null) {
            !(_.flags & 65536) && (_.flags |= 256), Ru(_, o, u, i, t), po(fn(s, u));
            break e;
          }
        }
        i = s = fn(s, u), re !== 4 && (re = 2), On === null ? On = [i] : On.push(i), i = o;
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
              if (!(i.flags & 128) && (typeof c.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (yt === null || !yt.has(p)))) {
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
      t = k, b === n && n !== null && (b = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function tc() {
  var e = nl.current;
  return nl.current = tl, e === null ? tl : e;
}
function Ro() {
  (re === 0 || re === 3 || re === 2) && (re = 4), ie === null || !(Ot & 268435455) && !(gl & 268435455) || ct(ie, ue);
}
function il(e, t) {
  var n = I;
  I |= 2;
  var r = tc();
  (ie !== e || ue !== t) && (Ze = null, Lt(e, t));
  do
    try {
      Pf();
      break;
    } catch (l) {
      ec(e, l);
    }
  while (!0);
  if (ho(), I = n, nl.current = r, b !== null) throw Error(y(261));
  return ie = null, ue = 0, re;
}
function Pf() {
  for (; b !== null; ) nc(b);
}
function Tf() {
  for (; b !== null && !ed(); ) nc(b);
}
function nc(e) {
  var t = ic(e.alternate, e, _e);
  e.memoizedProps = e.pendingProps, t === null ? rc(e) : b = t, zo.current = null;
}
function rc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = Ef(n, t), n !== null) {
        n.flags &= 32767, b = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        re = 6, b = null;
        return;
      }
    } else if (n = Sf(n, t, _e), n !== null) {
      b = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      b = t;
      return;
    }
    b = t = e;
  } while (t !== null);
  re === 0 && (re = 5);
}
function jt(e, t, n) {
  var r = F, l = Me.transition;
  try {
    Me.transition = null, F = 1, Lf(e, t, n, r);
  } finally {
    Me.transition = l, F = r;
  }
  return null;
}
function Lf(e, t, n, r) {
  do
    on();
  while (ft !== null);
  if (I & 6) throw Error(y(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(y(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (cd(e, i), e === ie && (b = ie = null, ue = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || kr || (kr = !0, oc(Ur, function() {
    return on(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = Me.transition, Me.transition = null;
    var o = F;
    F = 1;
    var u = I;
    I |= 4, zo.current = null, Nf(e, n), Ja(n, e), Zd(wi), Br = !!xi, wi = xi = null, e.current = n, Cf(n), td(), I = u, F = o, Me.transition = i;
  } else e.current = n;
  if (kr && (kr = !1, ft = e, ll = l), i = e.pendingLanes, i === 0 && (yt = null), ld(n.stateNode), Ee(e, J()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if (rl) throw rl = !1, e = Ui, Ui = null, e;
  return ll & 1 && e.tag !== 0 && on(), i = e.pendingLanes, i & 1 ? e === Vi ? Fn++ : (Fn = 0, Vi = e) : Fn = 0, Nt(), null;
}
function on() {
  if (ft !== null) {
    var e = Fs(ll), t = Me.transition, n = F;
    try {
      if (Me.transition = null, F = 16 > e ? 16 : e, ft === null) var r = !1;
      else {
        if (e = ft, ft = null, ll = 0, I & 6) throw Error(y(331));
        var l = I;
        for (I |= 4, C = e.current; C !== null; ) {
          var i = C, o = i.child;
          if (C.flags & 16) {
            var u = i.deletions;
            if (u !== null) {
              for (var s = 0; s < u.length; s++) {
                var d = u[s];
                for (C = d; C !== null; ) {
                  var h = C;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      In(8, h, i);
                  }
                  var v = h.child;
                  if (v !== null) v.return = h, C = v;
                  else for (; C !== null; ) {
                    h = C;
                    var m = h.sibling, S = h.return;
                    if (Ga(h), h === d) {
                      C = null;
                      break;
                    }
                    if (m !== null) {
                      m.return = S, C = m;
                      break;
                    }
                    C = S;
                  }
                }
              }
              var w = i.alternate;
              if (w !== null) {
                var E = w.child;
                if (E !== null) {
                  w.child = null;
                  do {
                    var _ = E.sibling;
                    E.sibling = null, E = _;
                  } while (E !== null);
                }
              }
              C = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) o.return = i, C = o;
          else e: for (; C !== null; ) {
            if (i = C, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                In(9, i, i.return);
            }
            var f = i.sibling;
            if (f !== null) {
              f.return = i.return, C = f;
              break e;
            }
            C = i.return;
          }
        }
        var c = e.current;
        for (C = c; C !== null; ) {
          o = C;
          var p = o.child;
          if (o.subtreeFlags & 2064 && p !== null) p.return = o, C = p;
          else e: for (o = c; C !== null; ) {
            if (u = C, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  vl(9, u);
              }
            } catch (k) {
              Z(u, u.return, k);
            }
            if (u === o) {
              C = null;
              break e;
            }
            var g = u.sibling;
            if (g !== null) {
              g.return = u.return, C = g;
              break e;
            }
            C = u.return;
          }
        }
        if (I = l, Nt(), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
          Ge.onPostCommitFiberRoot(sl, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      F = n, Me.transition = t;
    }
  }
  return !1;
}
function Ku(e, t, n) {
  t = fn(n, t), t = Fa(e, t, 1), e = gt(e, t, 1), t = ve(), e !== null && (nr(e, 1, t), Ee(e, t));
}
function Z(e, t, n) {
  if (e.tag === 3) Ku(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Ku(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (yt === null || !yt.has(r))) {
        e = fn(n, e), e = $a(t, e, 1), t = gt(t, e, 1), e = ve(), t !== null && (nr(t, 1, e), Ee(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Df(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = ve(), e.pingedLanes |= e.suspendedLanes & n, ie === e && (ue & n) === n && (re === 4 || re === 3 && (ue & 130023424) === ue && 500 > J() - To ? Lt(e, 0) : Po |= n), Ee(e, t);
}
function lc(e, t) {
  t === 0 && (e.mode & 1 ? (t = dr, dr <<= 1, !(dr & 130023424) && (dr = 4194304)) : t = 1);
  var n = ve();
  e = rt(e, t), e !== null && (nr(e, t, n), Ee(e, n));
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
      throw Error(y(314));
  }
  r !== null && r.delete(t), lc(e, n);
}
var ic;
ic = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || ke.current) we = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return we = !1, kf(e, t, n);
    we = !!(e.flags & 131072);
  }
  else we = !1, W && t.flags & 1048576 && aa(t, Xr, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      Rr(e, t), e = t.pendingProps;
      var l = sn(t, me.current);
      ln(t, n), l = Eo(null, t, r, e, l, n);
      var i = _o();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Se(r) ? (i = !0, Yr(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, yo(t), l.updater = hl, t.stateNode = l, l._reactInternals = t, Pi(t, r, e, n), t = Di(null, t, r, !0, i, n)) : (t.tag = 0, W && i && co(t), he(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (Rr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Of(r), e = Ae(r, e), l) {
          case 0:
            t = Li(null, t, r, e, n);
            break e;
          case 1:
            t = Ou(null, t, r, e, n);
            break e;
          case 11:
            t = Mu(null, t, r, e, n);
            break e;
          case 14:
            t = Iu(null, t, r, Ae(r.type, e), n);
            break e;
        }
        throw Error(y(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Ae(r, l), Li(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Ae(r, l), Ou(e, t, r, l, n);
    case 3:
      e: {
        if (Ba(t), e === null) throw Error(y(387));
        r = t.pendingProps, i = t.memoizedState, l = i.element, ha(e, t), qr(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
          l = fn(Error(y(423)), t), t = Fu(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = fn(Error(y(424)), t), t = Fu(e, t, r, n, l);
          break e;
        } else for (Ne = vt(t.stateNode.containerInfo.firstChild), Ce = t, W = !0, Ve = null, n = pa(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (an(), r === l) {
            t = lt(e, t, n);
            break e;
          }
          he(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return va(t), e === null && Ci(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, ki(r, l) ? o = null : i !== null && ki(r, i) && (t.flags |= 32), Va(e, t), he(e, t, o, n), t.child;
    case 6:
      return e === null && Ci(t), null;
    case 13:
      return Ha(e, t, n);
    case 4:
      return xo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = cn(t, null, r, n) : he(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Ae(r, l), Mu(e, t, r, l, n);
    case 7:
      return he(e, t, t.pendingProps, n), t.child;
    case 8:
      return he(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return he(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, U(Zr, r._currentValue), r._currentValue = o, i !== null) if (We(i.value, o)) {
          if (i.children === l.children && !ke.current) {
            t = lt(e, t, n);
            break e;
          }
        } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
          var u = i.dependencies;
          if (u !== null) {
            o = i.child;
            for (var s = u.firstContext; s !== null; ) {
              if (s.context === r) {
                if (i.tag === 1) {
                  s = et(-1, n & -n), s.tag = 2;
                  var d = i.updateQueue;
                  if (d !== null) {
                    d = d.shared;
                    var h = d.pending;
                    h === null ? s.next = s : (s.next = h.next, h.next = s), d.pending = s;
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
            if (o = i.return, o === null) throw Error(y(341));
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
        he(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, r = t.pendingProps.children, ln(t, n), l = Ie(l), r = r(l), t.flags |= 1, he(e, t, r, n), t.child;
    case 14:
      return r = t.type, l = Ae(r, t.pendingProps), l = Ae(r.type, l), Iu(e, t, r, l, n);
    case 15:
      return Aa(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Ae(r, l), Rr(e, t), t.tag = 1, Se(r) ? (e = !0, Yr(t)) : e = !1, ln(t, n), Oa(t, r, l), Pi(t, r, l, n), Di(null, t, r, !0, e, n);
    case 19:
      return Wa(e, t, n);
    case 22:
      return Ua(e, t, n);
  }
  throw Error(y(156, t.tag));
};
function oc(e, t) {
  return Rs(e, t);
}
function If(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Re(e, t, n, r) {
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
function wt(e, t) {
  var n = e.alternate;
  return n === null ? (n = Re(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Or(e, t, n, r, l, i) {
  var o = 2;
  if (r = e, typeof e == "function") Mo(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case Ht:
      return Dt(n.children, l, i, t);
    case Ji:
      o = 8, l |= 8;
      break;
    case bl:
      return e = Re(12, n, t, l | 2), e.elementType = bl, e.lanes = i, e;
    case ei:
      return e = Re(13, n, t, l), e.elementType = ei, e.lanes = i, e;
    case ti:
      return e = Re(19, n, t, l), e.elementType = ti, e.lanes = i, e;
    case vs:
      return yl(n, l, i, t);
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
        case ut:
          o = 16, r = null;
          break e;
      }
      throw Error(y(130, e == null ? e : typeof e, ""));
  }
  return t = Re(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
}
function Dt(e, t, n, r) {
  return e = Re(7, e, r, t), e.lanes = n, e;
}
function yl(e, t, n, r) {
  return e = Re(22, e, r, t), e.elementType = vs, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function Xl(e, t, n) {
  return e = Re(6, e, null, t), e.lanes = n, e;
}
function Zl(e, t, n) {
  return t = Re(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Ff(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Tl(0), this.expirationTimes = Tl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Tl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function Io(e, t, n, r, l, i, o, u, s) {
  return e = new Ff(e, t, n, u, s), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Re(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, yo(i), e;
}
function $f(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Bt, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function uc(e) {
  if (!e) return St;
  e = e._reactInternals;
  e: {
    if (At(e) !== e || e.tag !== 1) throw Error(y(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Se(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(y(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Se(n)) return ua(e, n, t);
  }
  return t;
}
function sc(e, t, n, r, l, i, o, u, s) {
  return e = Io(n, r, !0, e, l, i, o, u, s), e.context = uc(null), n = e.current, r = ve(), l = xt(n), i = et(r, l), i.callback = t ?? null, gt(n, i, l), e.current.lanes = l, nr(e, l, r), Ee(e, r), e;
}
function xl(e, t, n, r) {
  var l = t.current, i = ve(), o = xt(l);
  return n = uc(n), t.context === null ? t.context = n : t.pendingContext = n, t = et(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = gt(l, t, o), e !== null && (He(e, l, o, i), Tr(e, l, o)), o;
}
function ol(e) {
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
function Af() {
  return null;
}
var ac = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function Fo(e) {
  this._internalRoot = e;
}
wl.prototype.render = Fo.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(y(409));
  xl(e, t, null, null);
};
wl.prototype.unmount = Fo.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Ft(function() {
      xl(null, e, null, null);
    }), t[nt] = null;
  }
};
function wl(e) {
  this._internalRoot = e;
}
wl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = Us();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < at.length && t !== 0 && t < at[n].priority; n++) ;
    at.splice(n, 0, e), n === 0 && Bs(e);
  }
};
function $o(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function kl(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Gu() {
}
function Uf(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var d = ol(o);
        i.call(d);
      };
    }
    var o = sc(t, r, e, 0, null, !1, !1, "", Gu);
    return e._reactRootContainer = o, e[nt] = o.current, Kn(e.nodeType === 8 ? e.parentNode : e), Ft(), o;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var d = ol(s);
      u.call(d);
    };
  }
  var s = Io(e, 0, !1, null, null, !1, !1, "", Gu);
  return e._reactRootContainer = s, e[nt] = s.current, Kn(e.nodeType === 8 ? e.parentNode : e), Ft(function() {
    xl(t, s, n, r);
  }), s;
}
function Sl(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var u = l;
      l = function() {
        var s = ol(o);
        u.call(s);
      };
    }
    xl(t, o, e, l);
  } else o = Uf(n, t, e, l, r);
  return ol(o);
}
$s = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = jn(t.pendingLanes);
        n !== 0 && (no(t, n | 1), Ee(t, J()), !(I & 6) && (pn = J() + 500, Nt()));
      }
      break;
    case 13:
      Ft(function() {
        var r = rt(e, 1);
        if (r !== null) {
          var l = ve();
          He(r, e, 1, l);
        }
      }), Oo(e, 1);
  }
};
ro = function(e) {
  if (e.tag === 13) {
    var t = rt(e, 134217728);
    if (t !== null) {
      var n = ve();
      He(t, e, 134217728, n);
    }
    Oo(e, 134217728);
  }
};
As = function(e) {
  if (e.tag === 13) {
    var t = xt(e), n = rt(e, t);
    if (n !== null) {
      var r = ve();
      He(n, e, t, r);
    }
    Oo(e, t);
  }
};
Us = function() {
  return F;
};
Vs = function(e, t) {
  var n = F;
  try {
    return F = e, t();
  } finally {
    F = n;
  }
};
di = function(e, t, n) {
  switch (t) {
    case "input":
      if (li(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = fl(r);
            if (!l) throw Error(y(90));
            ys(r), li(r, l);
          }
        }
      }
      break;
    case "textarea":
      ws(e, n);
      break;
    case "select":
      t = n.value, t != null && en(e, !!n.multiple, t, !1);
  }
};
js = Lo;
zs = Ft;
var Vf = { usingClientEntryPoint: !1, Events: [lr, Yt, fl, Ns, Cs, Lo] }, _n = { findFiberByHostInstance: zt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Bf = { bundleType: _n.bundleType, version: _n.version, rendererPackageName: _n.rendererPackageName, rendererConfig: _n.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: it.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Ls(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: _n.findFiberByHostInstance || Af, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Sr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Sr.isDisabled && Sr.supportsFiber) try {
    sl = Sr.inject(Bf), Ge = Sr;
  } catch {
  }
}
ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Vf;
ze.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!$o(t)) throw Error(y(200));
  return $f(e, t, null, n);
};
ze.createRoot = function(e, t) {
  if (!$o(e)) throw Error(y(299));
  var n = !1, r = "", l = ac;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[nt] = t.current, Kn(e.nodeType === 8 ? e.parentNode : e), new Fo(t);
};
ze.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(y(188)) : (e = Object.keys(e).join(","), Error(y(268, e)));
  return e = Ls(t), e = e === null ? null : e.stateNode, e;
};
ze.flushSync = function(e) {
  return Ft(e);
};
ze.hydrate = function(e, t, n) {
  if (!kl(t)) throw Error(y(200));
  return Sl(null, e, t, !0, n);
};
ze.hydrateRoot = function(e, t, n) {
  if (!$o(e)) throw Error(y(405));
  var r = n != null && n.hydratedSources || null, l = !1, i = "", o = ac;
  if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = sc(t, null, e, 1, n ?? null, l, !1, i, o), e[nt] = t.current, Kn(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
    n,
    l
  );
  return new wl(t);
};
ze.render = function(e, t, n) {
  if (!kl(t)) throw Error(y(200));
  return Sl(null, e, t, !1, n);
};
ze.unmountComponentAtNode = function(e) {
  if (!kl(e)) throw Error(y(40));
  return e._reactRootContainer ? (Ft(function() {
    Sl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[nt] = null;
    });
  }), !0) : !1;
};
ze.unstable_batchedUpdates = Lo;
ze.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!kl(n)) throw Error(y(200));
  if (e == null || e._reactInternals === void 0) throw Error(y(38));
  return Sl(e, t, n, !1, r);
};
ze.version = "18.3.1-next-f1338f8080-20240426";
function cc() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cc);
    } catch (e) {
      console.error(e);
    }
}
cc(), cs.exports = ze;
var Hf = cs.exports, dc, Xu = Hf;
dc = Xu.createRoot, Xu.hydrateRoot;
var fc = { exports: {} }, El = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wf = T, Qf = Symbol.for("react.element"), Kf = Symbol.for("react.fragment"), Yf = Object.prototype.hasOwnProperty, Gf = Wf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Xf = { key: !0, ref: !0, __self: !0, __source: !0 };
function pc(e, t, n) {
  var r, l = {}, i = null, o = null;
  n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Yf.call(t, r) && !Xf.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
  return { $$typeof: Qf, type: e, key: i, ref: o, props: l, _owner: Gf.current };
}
El.Fragment = Kf;
El.jsx = pc;
El.jsxs = pc;
fc.exports = El;
var a = fc.exports;
const Zf = "title_classifier/v3";
function ul(e) {
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
function Jl(e, t) {
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
  const [t, n] = T.useState([]), [r, l] = T.useState([]), [i, o] = T.useState({}), [u, s] = T.useState({}), [d, h] = T.useState(!1), [v, m] = T.useState(null), [S, w] = T.useState(null), [E, _] = T.useState(!1), f = T.useRef(e);
  f.current = e;
  const c = T.useRef(i);
  c.current = i;
  const p = T.useRef(!1), g = T.useRef(!1), k = T.useCallback(async () => {
    const O = f.current;
    if (!(!O || p.current)) {
      p.current = !0, _(!0);
      try {
        const A = ul(O), [ae, ce] = await Promise.all([
          A.listSources(),
          A.listEntries({ include_hidden: !0, limit: 2e4 })
        ]);
        n(ae), l(ce), h(!0), m(null), w((/* @__PURE__ */ new Date()).toLocaleTimeString());
      } catch (A) {
        h(!1), m(A instanceof Error ? A.message : String(A));
      } finally {
        _(!1), p.current = !1;
      }
    }
  }, []);
  T.useEffect(() => {
    k();
    const O = window.setInterval(k, np);
    return () => window.clearInterval(O);
  }, [k]), T.useEffect(() => {
    e && !g.current && (g.current = !0, k());
  }, [e, k]);
  const j = T.useCallback((O, A) => {
    o((ae) => bf(ae, O, A)), s((ae) => Jl(ae, O));
  }, []), z = T.useCallback((O) => {
    o((A) => Zu(A, O)), s((A) => Jl(A, O));
  }, []), P = T.useCallback(
    async (O) => {
      const A = f.current, ae = c.current[O];
      if (!(!A || ae === void 0)) {
        s((ce) => Ju(ce, O, { saving: !0, error: null }));
        try {
          const Fe = await ul(A).setEnum(O, ae.enum);
          if (!Fe || !Fe.ok) throw new Error("set_enum rejected");
          l((te) => ep(te, O, Fe.enum ?? ae.enum)), o((te) => Zu(te, O)), s((te) => Jl(te, O)), k();
        } catch (ce) {
          s(
            (Fe) => Ju(Fe, O, {
              saving: !1,
              error: ce instanceof Error ? ce.message : String(ce)
            })
          );
        }
      }
    },
    [k]
  ), $ = T.useMemo(
    () => qf(r, i, u),
    [r, i, u]
  ), D = T.useCallback(
    (O) => tp(r, i, O),
    [r, i]
  ), ee = T.useCallback(
    (O) => $.find((A) => A.id === O),
    [$]
  );
  return {
    sources: t,
    entries: r,
    displayEntries: $,
    entryCount: d ? r.length : null,
    connected: d,
    error: v,
    lastSync: S,
    loading: E,
    refresh: k,
    setDraftEnum: j,
    resetDraft: z,
    applyDraft: P,
    isDirty: D,
    getDisplayEntry: ee,
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
function Ao(e) {
  return `media-type-${e}`;
}
const sp = {
  music: "Musik",
  game: "Spiel",
  video: "Video"
};
function ap({ s: e }) {
  const t = !!e.current_key;
  return /* @__PURE__ */ a.jsxs("div", { className: `tc-watcher ${Ao(e.media_type)}`, children: [
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
      /* @__PURE__ */ a.jsx(Er, { label: "Watcher", value: t.length }),
      /* @__PURE__ */ a.jsx(Er, { label: "Online", value: `${o}/${t.length}` }),
      /* @__PURE__ */ a.jsx(Er, { label: "Einträge", value: n ?? "—" }),
      /* @__PURE__ */ a.jsx(Er, { label: "Unklassifiziert", value: u })
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
function Er({ label: e, value: t }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-stat", children: [
    /* @__PURE__ */ a.jsx("div", { className: "tc-stat-val", children: t }),
    /* @__PURE__ */ a.jsx("div", { className: "tc-stat-label", children: e })
  ] });
}
const qu = { detail: null, loading: !1, error: null };
function hc(e, t, n = 0) {
  const [r, l] = T.useState(qu), i = T.useRef(e);
  return i.current = e, T.useEffect(() => {
    const o = i.current;
    if (!t || !o) {
      l(qu);
      return;
    }
    let u = !1;
    return l((s) => ({
      detail: s.detail && s.detail.id === t ? s.detail : null,
      loading: !0,
      error: null
    })), ul(o).entryDetail(t).then((s) => {
      u || l({ detail: s, loading: !1, error: null });
    }).catch((s) => {
      u || l({
        detail: null,
        loading: !1,
        error: s instanceof Error ? s.message : String(s)
      });
    }), () => {
      u = !0;
    };
  }, [t, n]), r;
}
function dp(e, t) {
  const n = Array.from(new Set(Array.from(e).filter(Boolean)));
  if (n.length < 2)
    throw new Error("at least two entries are required");
  if (!n.includes(t))
    throw new Error("master must be part of the selection");
  const r = n.filter((l) => l !== t);
  if (r.length === 0)
    throw new Error("at least one child entry is required");
  return { parent_id: t, child_ids: r };
}
function _r(e) {
  const t = new Date(e).getTime();
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function fp(e, t) {
  const n = _r(e.last_seen), r = _r(t.last_seen);
  if (n !== r) return r - n;
  const l = _r(e.first_seen), i = _r(t.first_seen);
  return l !== i ? i - l : e.key.localeCompare(t.key);
}
function pp(e) {
  return [...e].sort(fp);
}
const mp = /\s+(?:feat\.?|ft\.?|featuring)\s+/i;
function vc(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function hp(e) {
  const t = e.split(mp)[0].split(/\s*[&,]\s*/)[0];
  return vc(t).slice(0, 2).join(" ");
}
function vp(e) {
  const t = e.replace(/\([^)]*\)/g, " ");
  return vc(t).slice(0, 3).join(" ");
}
function gp(e) {
  const t = e.indexOf(" - "), n = t >= 0 ? e.slice(0, t) : "", r = t >= 0 ? e.slice(t + 3) : e;
  return `${hp(n)}|${vp(r)}`;
}
function yp(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const l of e) {
    if (l.hidden || l.parent_id !== null) continue;
    const i = gp(l.key);
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
const gc = ["music", "game", "video"], xp = [
  "homepod",
  "pc",
  "ps5",
  "switch",
  "stash",
  "apple_tv"
], yc = ["title", "app"], wp = Array.from({ length: 10 }, (e, t) => t);
function xc({ value: e, onChange: t, dirty: n, disabled: r }) {
  return /* @__PURE__ */ a.jsx(
    "select",
    {
      className: `tc-select tc-enum-select ${n ? "dirty" : ""}`,
      value: e,
      disabled: r,
      onChange: (l) => t(parseInt(l.target.value, 10)),
      onClick: (l) => l.stopPropagation(),
      children: wp.map((l) => /* @__PURE__ */ a.jsx("option", { value: l, children: l }, l))
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
function kp(e) {
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function Sp({ store: e, hass: t }) {
  const [n, r] = T.useState(""), [l, i] = T.useState(""), [o, u] = T.useState(""), [s, d] = T.useState(""), [h, v] = T.useState(!1), [m, S] = T.useState(!1), [w, E] = T.useState(/* @__PURE__ */ new Set()), [_, f] = T.useState(null), [c, p] = T.useState(0), [g, k] = T.useState(!1), [j, z] = T.useState(null), [P, $] = T.useState(!1), [D, ee] = T.useState(null), O = T.useMemo(
    () => new Set(e.sources.flatMap((x) => x.inactive_keys ?? [])),
    [e.sources]
  ), A = T.useMemo(
    () => yp(e.displayEntries),
    [e.displayEntries]
  ), ae = (x) => A.get(x)?.candidate ?? !1, ce = T.useMemo(() => {
    const x = e.displayEntries.filter((V) => !(V.parent_id !== null || V.serverEnum !== 0 || !h && V.hidden || O.has(V.normalized_key) || l && V.media_type !== l || o && V.signal_type !== o || s && V.current_context !== s || n && !V.key.toLowerCase().includes(n.toLowerCase()))), X = pp(x);
    return m ? [...X].sort((V, Te) => Number(ae(Te.id)) - Number(ae(V.id))) : X;
  }, [
    e.displayEntries,
    h,
    l,
    o,
    s,
    n,
    O,
    A,
    m
  ]), Fe = (x) => E((X) => {
    const V = new Set(X);
    return V.has(x) ? V.delete(x) : V.add(x), V;
  }), te = T.useMemo(
    () => ce.filter((x) => w.has(x.id)),
    [ce, w]
  ), N = () => {
    E(/* @__PURE__ */ new Set()), k(!1), z(null), ee(null);
  }, L = () => {
    te.length < 2 || (z(te[0].id), ee(null), k(!0));
  }, R = async () => {
    if (!t) {
      ee("Home Assistant ist nicht verbunden.");
      return;
    }
    const x = j ?? te[0]?.id;
    if (x) {
      $(!0), ee(null);
      try {
        const X = dp(
          te.map((Te) => Te.id),
          x
        ), V = ul(t);
        for (const Te of X.child_ids)
          if (!(await V.group(Te, X.parent_id))?.ok) throw new Error("group rejected");
        E(/* @__PURE__ */ new Set()), k(!1), z(null), f(X.parent_id), p((Te) => Te + 1), e.refresh();
      } catch (X) {
        ee(X instanceof Error ? X.message : String(X)), e.refresh();
      } finally {
        $(!1);
      }
    }
  }, Q = _ ? e.getDisplayEntry(_) : void 0, q = hc(t, _, c), Ut = _ ? e.sources.find((x) => x.current_entry_id === _)?.current_artwork ?? null : null;
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
            onChange: (x) => r(x.target.value)
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: l,
            onChange: (x) => i(x.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Medienart: Alle" }),
              gc.map((x) => /* @__PURE__ */ a.jsx("option", { value: x, children: x }, x))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: s,
            onChange: (x) => d(x.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Kontext: Alle" }),
              xp.map((x) => /* @__PURE__ */ a.jsx("option", { value: x, children: x }, x))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: o,
            onChange: (x) => u(x.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Signal: Alle" }),
              yc.map((x) => /* @__PURE__ */ a.jsx("option", { value: x, children: x }, x))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs("label", { className: "tc-check", children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: h,
              onChange: (x) => v(x.target.checked)
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
              onChange: (x) => S(x.target.checked)
            }
          ),
          "mögliche Varianten zuerst"
        ] }),
        /* @__PURE__ */ a.jsxs("span", { className: "tc-filters-info", children: [
          ce.length,
          " Einträge · Auswahl ",
          w.size,
          " · offen",
          " ",
          e.dirtyCount
        ] }),
        te.length >= 2 ? /* @__PURE__ */ a.jsxs(
          "button",
          {
            className: "tc-btn primary",
            type: "button",
            disabled: !t || P,
            onClick: L,
            children: [
              "Gruppieren (",
              te.length,
              ")"
            ]
          }
        ) : null,
        w.size > 0 ? /* @__PURE__ */ a.jsx(
          "button",
          {
            className: "tc-btn",
            type: "button",
            disabled: P,
            onClick: N,
            children: "Auswahl aufheben"
          }
        ) : null
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
        /* @__PURE__ */ a.jsx("tbody", { children: ce.length === 0 ? /* @__PURE__ */ a.jsx("tr", { children: /* @__PURE__ */ a.jsx("td", { colSpan: 10, className: "tc-placeholder", children: "Keine unklassifizierten Einträge." }) }) : ce.map((x) => /* @__PURE__ */ a.jsxs(
          "tr",
          {
            className: `${Ao(x.media_type)} ${x.id === _ ? "focused" : ""} ${x.dirty ? "dirty" : ""}`,
            onClick: () => f(x.id),
            children: [
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: w.has(x.id),
                  onClick: (X) => X.stopPropagation(),
                  onChange: () => Fe(x.id)
                }
              ) }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-key", children: x.key }),
              /* @__PURE__ */ a.jsx("td", { children: x.media_type }),
              /* @__PURE__ */ a.jsx("td", { children: x.is_current ? x.current_context ?? "—" : "—" }),
              /* @__PURE__ */ a.jsx("td", { children: x.signal_type }),
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx(
                xc,
                {
                  value: x.enum,
                  dirty: x.dirty,
                  onChange: (X) => e.setDraftEnum(x.id, X)
                }
              ) }),
              /* @__PURE__ */ a.jsx("td", { children: x.is_current ? x.effective_enum ?? "—" : "—" }),
              /* @__PURE__ */ a.jsxs("td", { children: [
                x.saving ? /* @__PURE__ */ a.jsx("span", { className: "badge", children: "speichert…" }) : x.saveError ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "Fehler" }) : x.dirty ? /* @__PURE__ */ a.jsx("span", { className: "badge dirtybadge", children: "geändert" }) : x.hidden ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "versteckt" }) : /* @__PURE__ */ a.jsx("span", { className: "tc-muted", children: "—" }),
                ae(x.id) ? /* @__PURE__ */ a.jsxs(
                  "span",
                  {
                    className: "badge var",
                    title: "Mögliche Variante — nicht automatisch gruppiert",
                    children: [
                      "⛓ ",
                      A.get(x.id)?.clusterSize
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: kp(x.last_seen) }),
              /* @__PURE__ */ a.jsx("td", { children: x.dirty ? /* @__PURE__ */ a.jsxs(
                "span",
                {
                  className: "tc-row-actions",
                  onClick: (X) => X.stopPropagation(),
                  children: [
                    /* @__PURE__ */ a.jsx(
                      "button",
                      {
                        className: "tc-btn primary tc-mini",
                        disabled: x.saving,
                        onClick: () => e.applyDraft(x.id),
                        children: "✓"
                      }
                    ),
                    /* @__PURE__ */ a.jsx(
                      "button",
                      {
                        className: "tc-btn tc-mini",
                        disabled: x.saving,
                        onClick: () => e.resetDraft(x.id),
                        children: "↺"
                      }
                    )
                  ]
                }
              ) : null })
            ]
          },
          x.id
        )) })
      ] }) })
    ] }),
    g ? /* @__PURE__ */ a.jsx(
      "div",
      {
        className: "tc-modal-backdrop",
        role: "presentation",
        onClick: () => {
          P || k(!1);
        },
        children: /* @__PURE__ */ a.jsxs(
          "div",
          {
            className: "tc-modal",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "tc-group-title",
            onClick: (x) => x.stopPropagation(),
            children: [
              /* @__PURE__ */ a.jsx("h3", { id: "tc-group-title", children: "Einträge gruppieren" }),
              /* @__PURE__ */ a.jsx("div", { className: "tc-group-list", children: te.map((x) => /* @__PURE__ */ a.jsxs("label", { className: "tc-group-option", children: [
                /* @__PURE__ */ a.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "tc-group-master",
                    checked: (j ?? te[0]?.id) === x.id,
                    disabled: P,
                    onChange: () => z(x.id)
                  }
                ),
                /* @__PURE__ */ a.jsxs("span", { children: [
                  /* @__PURE__ */ a.jsx("b", { children: x.key }),
                  /* @__PURE__ */ a.jsxs("small", { children: [
                    x.media_type,
                    " · ",
                    x.signal_type
                  ] })
                ] })
              ] }, x.id)) }),
              D ? /* @__PURE__ */ a.jsxs("div", { className: "tc-detail-error", children: [
                "Gruppieren fehlgeschlagen: ",
                D
              ] }) : null,
              /* @__PURE__ */ a.jsxs("div", { className: "tc-modal-actions", children: [
                /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    className: "tc-btn",
                    type: "button",
                    disabled: P,
                    onClick: () => k(!1),
                    children: "Abbrechen"
                  }
                ),
                /* @__PURE__ */ a.jsx(
                  "button",
                  {
                    className: "tc-btn primary",
                    type: "button",
                    disabled: P || te.length < 2,
                    onClick: R,
                    children: P ? "Speichert…" : "Speichern"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) : null,
    /* @__PURE__ */ a.jsx(
      wc,
      {
        entry: Q,
        detail: q,
        artwork: Ut,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function Uo({ title: e, note: t }) {
  return /* @__PURE__ */ a.jsx("div", { className: "tc-page", children: /* @__PURE__ */ a.jsxs("div", { className: "tc-card tc-placeholder", children: [
    /* @__PURE__ */ a.jsx("h2", { children: e }),
    /* @__PURE__ */ a.jsx("p", { children: t })
  ] }) });
}
function Ep() {
  return /* @__PURE__ */ a.jsx(
    Uo,
    {
      title: "Tagebuch",
      note: "Verlauf der Sichtungen folgt in PR 9. TODO: eine echte Sighting-Timeline-Tabelle existiert in der DB noch nicht — der MVP zeigt nur verfügbare Daten."
    }
  );
}
function es(e, t) {
  return e.key.localeCompare(t.key);
}
function _p(e) {
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
function Np(e, t) {
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
function Cp(e, { search: t = "", media: n = "", signal: r = "" }) {
  const l = t.toLowerCase().trim();
  return e.filter((i) => !(n && i.media_type !== n || r && i.signal_type !== r || l && !i.key.toLowerCase().includes(l)));
}
const jp = [
  { id: "all", label: "Alle" },
  { id: "unsorted", label: "Unsortiert" },
  { id: "groups", label: "Gruppen" },
  { id: "hidden", label: "Ausgeblendet" }
];
function zp({ store: e, hass: t }) {
  const [n, r] = T.useState("all"), [l, i] = T.useState(""), [o, u] = T.useState(""), [s, d] = T.useState(""), [h, v] = T.useState(null), m = T.useMemo(() => {
    const _ = Np(e.displayEntries, n), f = Cp(_, { search: l, media: o, signal: s }), c = _p(f), p = [];
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
  }, [e.displayEntries, n, l, o, s]), S = h ? e.getDisplayEntry(h) : void 0, w = hc(t, h), E = h ? e.sources.find((_) => _.current_entry_id === h)?.current_artwork ?? null : null;
  return /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "tc-inbox-main", children: [
      /* @__PURE__ */ a.jsx("div", { className: "tc-tabs", children: jp.map((_) => /* @__PURE__ */ a.jsx(
        "button",
        {
          className: `tc-tab ${_.id === n ? "active" : ""}`,
          onClick: () => r(_.id),
          children: _.label
        },
        _.id
      )) }),
      /* @__PURE__ */ a.jsxs("div", { className: "tc-filters", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "tc-input",
            type: "search",
            placeholder: "Titel / Key suchen …",
            value: l,
            onChange: (_) => i(_.target.value)
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: o,
            onChange: (_) => u(_.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Medienart: Alle" }),
              gc.map((_) => /* @__PURE__ */ a.jsx("option", { value: _, children: _ }, _))
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "tc-select",
            value: s,
            onChange: (_) => d(_.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "Signal: Alle" }),
              yc.map((_) => /* @__PURE__ */ a.jsx("option", { value: _, children: _ }, _))
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
        /* @__PURE__ */ a.jsx("tbody", { children: m.length === 0 ? /* @__PURE__ */ a.jsx("tr", { children: /* @__PURE__ */ a.jsx("td", { colSpan: 5, className: "tc-placeholder", children: "Keine Einträge in dieser Ansicht." }) }) : m.map((_) => /* @__PURE__ */ a.jsxs(
          "tr",
          {
            className: `${Ao(_.entry.media_type)} ${_.entry.id === h ? "focused" : ""} ${_.depth > 0 ? "is-child" : ""}`,
            onClick: () => v(_.entry.id),
            children: [
              /* @__PURE__ */ a.jsxs(
                "td",
                {
                  className: "tc-key",
                  style: _.depth > 0 ? { paddingLeft: 26 } : void 0,
                  children: [
                    _.depth > 0 ? "↳ " : "",
                    _.entry.key
                  ]
                }
              ),
              /* @__PURE__ */ a.jsx("td", { children: _.entry.media_type }),
              /* @__PURE__ */ a.jsx("td", { children: _.entry.signal_type }),
              /* @__PURE__ */ a.jsx("td", { children: _.entry.enum }),
              /* @__PURE__ */ a.jsx("td", { className: "tc-muted", children: _.orphan ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "verwaiste Variante" }) : _.isMaster ? /* @__PURE__ */ a.jsxs("span", { className: "badge var", children: [
                _.childCount,
                " Varianten"
              ] }) : _.depth > 0 && (_.entry.media_type === "music" || _.entry.media_type === "video") ? "erbt Enum vom Master" : _.entry.hidden ? /* @__PURE__ */ a.jsx("span", { className: "badge off", children: "versteckt" }) : "—" })
            ]
          },
          _.entry.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsx(
      wc,
      {
        entry: S,
        detail: w,
        artwork: E,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function Pp() {
  return /* @__PURE__ */ a.jsx(
    Uo,
    {
      title: "Import / Export",
      note: "Bildfreies v3-JSON über die bestehende API mit Preview/Validierung und Konfliktanzeige folgt in PR 7."
    }
  );
}
function Tp() {
  return /* @__PURE__ */ a.jsx(
    Uo,
    {
      title: "Einstellungen",
      note: "Watcher-Status, PostgreSQL-Status (soweit verfügbar), v3-Konfiguration, Artwork-Fallbacks, Theme und Debug-Infos folgen in PR 8."
    }
  );
}
const Lp = {
  diary: Ep,
  io: Pp,
  settings: Tp
};
function Dp({ hass: e }) {
  const [t, n] = T.useState("overview"), r = rp(e), l = mc.find((u) => u.id === t), i = Lp[t], o = () => t === "inbox" ? /* @__PURE__ */ a.jsx(Sp, { store: r, hass: e }) : t === "catalog" ? /* @__PURE__ */ a.jsx(zp, { store: r, hass: e }) : t === "overview" || !i ? /* @__PURE__ */ a.jsx(cp, { store: r }) : /* @__PURE__ */ a.jsx(i, {});
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
const Rp = ':host{display:block;height:100%}:host,:root{--tc-bg: var(--primary-background-color, #1c1e2b);--tc-surface: #282a36;--tc-surface-raised: #343746;--tc-border: #44475a;--tc-text: var(--primary-text-color, #f8f8f2);--tc-text-muted: #9aa0bd;--tc-accent-purple: #bd93f9;--tc-accent-cyan: #8be9fd;--tc-accent-green: #50fa7b;--tc-accent-orange: #ffb86c;--tc-accent-pink: #ff79c6;--tc-danger: #ff5555;--tc-radius: 10px;--tc-gap: 14px}*{box-sizing:border-box}.tc3{display:grid;grid-template-columns:232px 1fr;height:100%;min-height:0;font-family:var(--paper-font-body1_-_font-family, "Segoe UI", system-ui, sans-serif);color:var(--tc-text);background:var(--tc-bg);font-size:14px}.tc3-body{display:grid;grid-template-rows:auto 1fr auto;min-width:0;min-height:0}.tc3-main{min-height:0;overflow:auto;padding:18px}.tc-sidebar{background:var(--tc-surface);border-right:1px solid var(--tc-border);display:flex;flex-direction:column;min-height:0}.tc-brand{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;border-bottom:1px solid var(--tc-border)}.tc-brand .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--tc-accent-purple),var(--tc-accent-pink));display:flex;align-items:center;justify-content:center;font-weight:700;color:#1c1e2b}.tc-brand .title{font-weight:700;line-height:1.1}.tc-brand .sub{color:var(--tc-text-muted);font-size:11px}.tc-nav{padding:10px 8px;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0;overflow:auto}.tc-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:1px solid transparent;color:var(--tc-text);padding:9px 12px;border-radius:8px;cursor:pointer;font:inherit}.tc-nav button:hover{background:var(--tc-surface-raised)}.tc-nav button.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-nav .ico{width:18px;text-align:center;opacity:.85}.tc-sidebar .foot{padding:10px 16px;border-top:1px solid var(--tc-border);color:var(--tc-text-muted);font-size:11px}.tc-cmdbar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--tc-border);background:color-mix(in srgb,var(--tc-surface) 60%,var(--tc-bg))}.tc-cmdbar h1{font-size:17px;margin:0}.tc-cmdbar .desc{color:var(--tc-text-muted);font-size:12px}.tc-cmdbar .spacer{flex:1}.tc-menu-btn{display:none}input,select,button{font:inherit;color:var(--tc-text)}.tc-input,.tc-select,.tc-btn{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:7px 10px;color:var(--tc-text)}.tc-btn{cursor:pointer}.tc-btn:hover:not(:disabled){border-color:var(--tc-accent-purple)}.tc-btn.primary{background:var(--tc-accent-purple);border-color:var(--tc-accent-purple);color:#1c1e2b;font-weight:600}.tc-btn:disabled{opacity:.45;cursor:default}.tc-statusbar{display:flex;align-items:center;gap:16px;padding:7px 18px;border-top:1px solid var(--tc-border);background:var(--tc-surface);color:var(--tc-text-muted);font-size:12px}.tc-statusbar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}.tc-statusbar .ok{background:var(--tc-accent-green)}.tc-statusbar .bad{background:var(--tc-danger)}.tc-statusbar .right{margin-left:auto}.tc-page{max-width:1200px}.tc-card{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:18px}.tc-placeholder{color:var(--tc-text-muted)}.tc-placeholder h2{color:var(--tc-text);margin:0 0 6px}.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;border:1px solid var(--tc-border)}.badge.music{color:var(--tc-accent-cyan);border-color:color-mix(in srgb,var(--tc-accent-cyan) 50%,transparent)}.badge.game{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 50%,transparent)}.badge.video{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-error{border-color:color-mix(in srgb,var(--tc-danger) 60%,transparent);color:var(--tc-danger);margin-bottom:var(--tc-gap)}.tc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--tc-gap);margin-bottom:20px}.tc-stat{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:14px 16px}.tc-stat-val{font-size:26px;font-weight:700}.tc-stat-label{color:var(--tc-text-muted);font-size:12px;margin-top:2px}.tc-section{margin-bottom:22px}.tc-section h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-enum{color:var(--tc-accent-purple);font-weight:700}.tc-active{display:flex;flex-direction:column;gap:6px}.tc-active-row{display:grid;grid-template-columns:160px 1fr auto;gap:12px;align-items:center;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:8px;padding:8px 12px}.tc-active-name{color:var(--tc-text-muted)}.tc-active-key{font-weight:500}.tc-watchers{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--tc-gap)}.tc-watcher{display:flex;gap:12px;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:12px 14px}.tc-art{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}.tc-art-fallback{display:flex;align-items:center;justify-content:center;background:var(--tc-surface-raised);color:var(--tc-text-muted);font-size:20px}.tc-w-main{min-width:0;flex:1}.tc-w-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tc-w-name{font-weight:600}.tc-w-cur{margin-top:6px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tc-w-cur.muted{color:var(--tc-text-muted)}.tc-w-meta{margin-top:6px;display:flex;gap:12px;flex-wrap:wrap;color:var(--tc-text-muted);font-size:12px}.badge.ok{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 45%,transparent)}.badge.off{color:var(--tc-text-muted)}.tc-syshint{color:var(--tc-text-muted);font-size:12px;margin-top:8px}.tc-inbox{display:grid;grid-template-columns:1fr 340px;gap:var(--tc-gap);height:100%;min-height:0}.tc-inbox-main{min-width:0;display:flex;flex-direction:column;min-height:0}.tc-filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tc-check{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--tc-text-muted)}.tc-filters-info{color:var(--tc-text-muted);font-size:12px;margin-left:auto}.tc-table-wrap{flex:1;min-height:0;overflow:auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius)}.tc-table{width:100%;border-collapse:collapse;font-size:13px}.tc-table th,.tc-table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--tc-border);white-space:nowrap}.tc-table thead th{position:sticky;top:0;background:var(--tc-surface);color:var(--tc-text-muted);font-weight:600;z-index:1}.tc-table tbody tr{cursor:pointer}.tc-table tbody tr:hover{background:var(--tc-surface-raised)}.tc-table tbody tr.focused{background:color-mix(in srgb,var(--tc-accent-purple) 18%,transparent)}.tc-table tbody tr.dirty td{border-bottom-color:color-mix(in srgb,var(--tc-accent-orange) 40%,transparent)}.tc-key{font-weight:500;max-width:320px;overflow:hidden;text-overflow:ellipsis}.tc-muted{color:var(--tc-text-muted)}.tc-enum-select.dirty{border-color:var(--tc-accent-orange);color:var(--tc-accent-orange)}.badge.dirtybadge{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-row-actions{display:inline-flex;gap:4px}.tc-mini{padding:3px 8px}.tc-modal-backdrop{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:18px;background:#0000008f}.tc-modal{width:min(560px,100%);max-height:min(680px,92vh);overflow:auto;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:8px;padding:16px;box-shadow:0 18px 42px #00000052}.tc-modal h3{margin:0 0 12px;font-size:15px}.tc-group-list{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.tc-group-option{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;padding:9px 10px;border:1px solid var(--tc-border);border-radius:8px;background:var(--tc-surface-raised);cursor:pointer}.tc-group-option span{min-width:0}.tc-group-option b{display:block;overflow-wrap:anywhere}.tc-group-option small{display:block;margin-top:2px;color:var(--tc-text-muted)}.tc-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.tc-tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}.tc-tab{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:6px 14px;color:var(--tc-text);cursor:pointer}.tc-tab:hover{border-color:var(--tc-accent-purple)}.tc-tab.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-table tbody tr.is-child td{background:color-mix(in srgb,var(--tc-accent-purple) 6%,transparent)}.badge.var{color:var(--tc-accent-purple);border-color:color-mix(in srgb,var(--tc-accent-purple) 50%,transparent)}.media-type-music{--mt-accent: var(--tc-accent-cyan)}.media-type-game{--mt-accent: var(--tc-accent-green)}.media-type-video{--mt-accent: var(--tc-accent-orange)}.tc-watcher[class*=media-type-]{border-left:3px solid var(--mt-accent)}.tc-table tbody tr[class*=media-type-] td:first-child{box-shadow:inset 4px 0 0 var(--mt-accent)}.tc-table tbody tr[class*=media-type-]{background:color-mix(in srgb,var(--mt-accent) 6%,transparent)}.tc-detail{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:16px;overflow:auto;min-height:0}.tc-detail-title{margin:0 0 8px;font-size:15px;word-break:break-word}.tc-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tc-detail-grid{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 14px}.tc-detail-grid dt{color:var(--tc-text-muted);font-size:12px}.tc-detail-grid dd{margin:0}.tc-detail-error{color:var(--tc-danger);font-size:12px;margin-bottom:10px}.tc-detail-actions{display:flex;gap:8px}.tc-detail-art{width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px}.tc-detail-parent{font-size:12px;color:var(--tc-text-muted);background:var(--tc-surface-raised);border-radius:8px;padding:8px 10px;margin-bottom:12px}.tc-detail-section{margin-bottom:14px}.tc-detail-section h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-ctx-table{width:100%;border-collapse:collapse;font-size:12px}.tc-ctx-table th,.tc-ctx-table td{text-align:left;padding:4px 6px;border-bottom:1px solid var(--tc-border)}.tc-ctx-table th{color:var(--tc-text-muted);font-weight:600}.tc-variants{margin:0;padding-left:18px;font-size:13px}.tc-variants li{margin-bottom:3px}@media (max-width: 870px){.tc3{grid-template-columns:1fr}.tc-sidebar{display:none}.tc-menu-btn{display:inline-flex}.tc-inbox{grid-template-columns:1fr}}';
class Mp extends HTMLElement {
  constructor() {
    super(...arguments);
    _l(this, "_root", null);
    _l(this, "_hass", null);
  }
  connectedCallback() {
    if (this._root) return;
    const n = this.attachShadow({ mode: "open" }), r = document.createElement("style");
    r.textContent = Rp, n.appendChild(r);
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
    this._root?.render(T.createElement(Dp, { hass: this._hass }));
  }
}
customElements.get("title-classifier-v3-app") || customElements.define("title-classifier-v3-app", Mp);
