var dc = Object.defineProperty;
var pc = (e, t, n) => t in e ? dc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var El = (e, t, n) => pc(e, typeof t != "symbol" ? t + "" : t, n);
var Ju = { exports: {} }, L = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qn = Symbol.for("react.element"), mc = Symbol.for("react.portal"), hc = Symbol.for("react.fragment"), vc = Symbol.for("react.strict_mode"), gc = Symbol.for("react.profiler"), yc = Symbol.for("react.provider"), xc = Symbol.for("react.context"), wc = Symbol.for("react.forward_ref"), kc = Symbol.for("react.suspense"), Sc = Symbol.for("react.memo"), Ec = Symbol.for("react.lazy"), Uo = Symbol.iterator;
function _c(e) {
  return e === null || typeof e != "object" ? null : (e = Uo && e[Uo] || e["@@iterator"], typeof e == "function" ? e : null);
}
var qu = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, bu = Object.assign, es = {};
function fn(e, t, n) {
  this.props = e, this.context = t, this.refs = es, this.updater = n || qu;
}
fn.prototype.isReactComponent = {};
fn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
fn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function ts() {
}
ts.prototype = fn.prototype;
function Hi(e, t, n) {
  this.props = e, this.context = t, this.refs = es, this.updater = n || qu;
}
var Wi = Hi.prototype = new ts();
Wi.constructor = Hi;
bu(Wi, fn.prototype);
Wi.isPureReactComponent = !0;
var $o = Array.isArray, ns = Object.prototype.hasOwnProperty, Qi = { current: null }, rs = { key: !0, ref: !0, __self: !0, __source: !0 };
function ls(e, t, n) {
  var r, l = {}, i = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (i = "" + t.key), t) ns.call(t, r) && !rs.hasOwnProperty(r) && (l[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) l.children = n;
  else if (1 < u) {
    for (var a = Array(u), c = 0; c < u; c++) a[c] = arguments[c + 2];
    l.children = a;
  }
  if (e && e.defaultProps) for (r in u = e.defaultProps, u) l[r] === void 0 && (l[r] = u[r]);
  return { $$typeof: qn, type: e, key: i, ref: o, props: l, _owner: Qi.current };
}
function Cc(e, t) {
  return { $$typeof: qn, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Ki(e) {
  return typeof e == "object" && e !== null && e.$$typeof === qn;
}
function Nc(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Ao = /\/+/g;
function _l(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Nc("" + e.key) : t.toString(36);
}
function Er(e, t, n, r, l) {
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
        case mc:
          o = !0;
      }
  }
  if (o) return o = e, l = l(o), e = r === "" ? "." + _l(o, 0) : r, $o(l) ? (n = "", e != null && (n = e.replace(Ao, "$&/") + "/"), Er(l, t, n, "", function(c) {
    return c;
  })) : l != null && (Ki(l) && (l = Cc(l, n + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(Ao, "$&/") + "/") + e)), t.push(l)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", $o(e)) for (var u = 0; u < e.length; u++) {
    i = e[u];
    var a = r + _l(i, u);
    o += Er(i, t, n, a, l);
  }
  else if (a = _c(e), typeof a == "function") for (e = a.call(e), u = 0; !(i = e.next()).done; ) i = i.value, a = r + _l(i, u++), o += Er(i, t, n, a, l);
  else if (i === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function ir(e, t, n) {
  if (e == null) return e;
  var r = [], l = 0;
  return Er(e, r, "", "", function(i) {
    return t.call(n, i, l++);
  }), r;
}
function jc(e) {
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
var ce = { current: null }, _r = { transition: null }, zc = { ReactCurrentDispatcher: ce, ReactCurrentBatchConfig: _r, ReactCurrentOwner: Qi };
function is() {
  throw Error("act(...) is not supported in production builds of React.");
}
L.Children = { map: ir, forEach: function(e, t, n) {
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
  if (!Ki(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
L.Component = fn;
L.Fragment = hc;
L.Profiler = gc;
L.PureComponent = Hi;
L.StrictMode = vc;
L.Suspense = kc;
L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = zc;
L.act = is;
L.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = bu({}, e.props), l = e.key, i = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (i = t.ref, o = Qi.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
    for (a in t) ns.call(t, a) && !rs.hasOwnProperty(a) && (r[a] = t[a] === void 0 && u !== void 0 ? u[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    u = Array(a);
    for (var c = 0; c < a; c++) u[c] = arguments[c + 2];
    r.children = u;
  }
  return { $$typeof: qn, type: e.type, key: l, ref: i, props: r, _owner: o };
};
L.createContext = function(e) {
  return e = { $$typeof: xc, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: yc, _context: e }, e.Consumer = e;
};
L.createElement = ls;
L.createFactory = function(e) {
  var t = ls.bind(null, e);
  return t.type = e, t;
};
L.createRef = function() {
  return { current: null };
};
L.forwardRef = function(e) {
  return { $$typeof: wc, render: e };
};
L.isValidElement = Ki;
L.lazy = function(e) {
  return { $$typeof: Ec, _payload: { _status: -1, _result: e }, _init: jc };
};
L.memo = function(e, t) {
  return { $$typeof: Sc, type: e, compare: t === void 0 ? null : t };
};
L.startTransition = function(e) {
  var t = _r.transition;
  _r.transition = {};
  try {
    e();
  } finally {
    _r.transition = t;
  }
};
L.unstable_act = is;
L.useCallback = function(e, t) {
  return ce.current.useCallback(e, t);
};
L.useContext = function(e) {
  return ce.current.useContext(e);
};
L.useDebugValue = function() {
};
L.useDeferredValue = function(e) {
  return ce.current.useDeferredValue(e);
};
L.useEffect = function(e, t) {
  return ce.current.useEffect(e, t);
};
L.useId = function() {
  return ce.current.useId();
};
L.useImperativeHandle = function(e, t, n) {
  return ce.current.useImperativeHandle(e, t, n);
};
L.useInsertionEffect = function(e, t) {
  return ce.current.useInsertionEffect(e, t);
};
L.useLayoutEffect = function(e, t) {
  return ce.current.useLayoutEffect(e, t);
};
L.useMemo = function(e, t) {
  return ce.current.useMemo(e, t);
};
L.useReducer = function(e, t, n) {
  return ce.current.useReducer(e, t, n);
};
L.useRef = function(e) {
  return ce.current.useRef(e);
};
L.useState = function(e) {
  return ce.current.useState(e);
};
L.useSyncExternalStore = function(e, t, n) {
  return ce.current.useSyncExternalStore(e, t, n);
};
L.useTransition = function() {
  return ce.current.useTransition();
};
L.version = "18.3.1";
Ju.exports = L;
var D = Ju.exports, os = { exports: {} }, Se = {}, us = { exports: {} }, ss = {};
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
  function t(_, z) {
    var P = _.length;
    _.push(z);
    e: for (; 0 < P; ) {
      var Y = P - 1 >>> 1, q = _[Y];
      if (0 < l(q, z)) _[Y] = z, _[P] = q, P = Y;
      else break e;
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0];
  }
  function r(_) {
    if (_.length === 0) return null;
    var z = _[0], P = _.pop();
    if (P !== z) {
      _[0] = P;
      e: for (var Y = 0, q = _.length, rr = q >>> 1; Y < rr; ) {
        var St = 2 * (Y + 1) - 1, Sl = _[St], Et = St + 1, lr = _[Et];
        if (0 > l(Sl, P)) Et < q && 0 > l(lr, Sl) ? (_[Y] = lr, _[Et] = P, Y = Et) : (_[Y] = Sl, _[St] = P, Y = St);
        else if (Et < q && 0 > l(lr, P)) _[Y] = lr, _[Et] = P, Y = Et;
        else break e;
      }
    }
    return z;
  }
  function l(_, z) {
    var P = _.sortIndex - z.sortIndex;
    return P !== 0 ? P : _.id - z.id;
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
  var a = [], c = [], v = 1, h = null, m = 3, x = !1, w = !1, k = !1, O = typeof setTimeout == "function" ? setTimeout : null, f = typeof clearTimeout == "function" ? clearTimeout : null, s = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function d(_) {
    for (var z = n(c); z !== null; ) {
      if (z.callback === null) r(c);
      else if (z.startTime <= _) r(c), z.sortIndex = z.expirationTime, t(a, z);
      else break;
      z = n(c);
    }
  }
  function g(_) {
    if (k = !1, d(_), !w) if (n(a) !== null) w = !0, We(S);
    else {
      var z = n(c);
      z !== null && Qe(g, z.startTime - _);
    }
  }
  function S(_, z) {
    w = !1, k && (k = !1, f(j), j = -1), x = !0;
    var P = m;
    try {
      for (d(z), h = n(a); h !== null && (!(h.expirationTime > z) || _ && !ge()); ) {
        var Y = h.callback;
        if (typeof Y == "function") {
          h.callback = null, m = h.priorityLevel;
          var q = Y(h.expirationTime <= z);
          z = e.unstable_now(), typeof q == "function" ? h.callback = q : h === n(a) && r(a), d(z);
        } else r(a);
        h = n(a);
      }
      if (h !== null) var rr = !0;
      else {
        var St = n(c);
        St !== null && Qe(g, St.startTime - z), rr = !1;
      }
      return rr;
    } finally {
      h = null, m = P, x = !1;
    }
  }
  var C = !1, N = null, j = -1, U = 5, T = -1;
  function ge() {
    return !(e.unstable_now() - T < U);
  }
  function I() {
    if (N !== null) {
      var _ = e.unstable_now();
      T = _;
      var z = !0;
      try {
        z = N(!0, _);
      } finally {
        z ? B() : (C = !1, N = null);
      }
    } else C = !1;
  }
  var B;
  if (typeof s == "function") B = function() {
    s(I);
  };
  else if (typeof MessageChannel < "u") {
    var _e = new MessageChannel(), Ue = _e.port2;
    _e.port1.onmessage = I, B = function() {
      Ue.postMessage(null);
    };
  } else B = function() {
    O(I, 0);
  };
  function We(_) {
    N = _, C || (C = !0, B());
  }
  function Qe(_, z) {
    j = O(function() {
      _(e.unstable_now());
    }, z);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(_) {
    _.callback = null;
  }, e.unstable_continueExecution = function() {
    w || x || (w = !0, We(S));
  }, e.unstable_forceFrameRate = function(_) {
    0 > _ || 125 < _ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : U = 0 < _ ? Math.floor(1e3 / _) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return m;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, e.unstable_next = function(_) {
    switch (m) {
      case 1:
      case 2:
      case 3:
        var z = 3;
        break;
      default:
        z = m;
    }
    var P = m;
    m = z;
    try {
      return _();
    } finally {
      m = P;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(_, z) {
    switch (_) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        _ = 3;
    }
    var P = m;
    m = _;
    try {
      return z();
    } finally {
      m = P;
    }
  }, e.unstable_scheduleCallback = function(_, z, P) {
    var Y = e.unstable_now();
    switch (typeof P == "object" && P !== null ? (P = P.delay, P = typeof P == "number" && 0 < P ? Y + P : Y) : P = Y, _) {
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
    return q = P + q, _ = { id: v++, callback: z, priorityLevel: _, startTime: P, expirationTime: q, sortIndex: -1 }, P > Y ? (_.sortIndex = P, t(c, _), n(a) === null && _ === n(c) && (k ? (f(j), j = -1) : k = !0, Qe(g, P - Y))) : (_.sortIndex = q, t(a, _), w || x || (w = !0, We(S))), _;
  }, e.unstable_shouldYield = ge, e.unstable_wrapCallback = function(_) {
    var z = m;
    return function() {
      var P = m;
      m = z;
      try {
        return _.apply(this, arguments);
      } finally {
        m = P;
      }
    };
  };
})(ss);
us.exports = ss;
var Pc = us.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tc = D, ke = Pc;
function y(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var as = /* @__PURE__ */ new Set(), Mn = {};
function It(e, t) {
  rn(e, t), rn(e + "Capture", t);
}
function rn(e, t) {
  for (Mn[e] = t, e = 0; e < t.length; e++) as.add(t[e]);
}
var Je = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Jl = Object.prototype.hasOwnProperty, Lc = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Vo = {}, Bo = {};
function Dc(e) {
  return Jl.call(Bo, e) ? !0 : Jl.call(Vo, e) ? !1 : Lc.test(e) ? Bo[e] = !0 : (Vo[e] = !0, !1);
}
function Rc(e, t, n, r) {
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
function Oc(e, t, n, r) {
  if (t === null || typeof t > "u" || Rc(e, t, n, r)) return !0;
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
var Yi = /[\-:]([a-z])/g;
function Xi(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Yi,
    Xi
  );
  re[t] = new fe(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Yi, Xi);
  re[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Yi, Xi);
  re[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  re[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
re.xlinkHref = new fe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  re[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Gi(e, t, n, r) {
  var l = re.hasOwnProperty(t) ? re[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Oc(t, n, l, r) && (n = null), r || l === null ? Dc(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var tt = Tc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, or = Symbol.for("react.element"), $t = Symbol.for("react.portal"), At = Symbol.for("react.fragment"), Zi = Symbol.for("react.strict_mode"), ql = Symbol.for("react.profiler"), cs = Symbol.for("react.provider"), fs = Symbol.for("react.context"), Ji = Symbol.for("react.forward_ref"), bl = Symbol.for("react.suspense"), ei = Symbol.for("react.suspense_list"), qi = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), ds = Symbol.for("react.offscreen"), Ho = Symbol.iterator;
function mn(e) {
  return e === null || typeof e != "object" ? null : (e = Ho && e[Ho] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Q = Object.assign, Cl;
function Sn(e) {
  if (Cl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Cl = t && t[1] || "";
  }
  return `
` + Cl + e;
}
var Nl = !1;
function jl(e, t) {
  if (!e || Nl) return "";
  Nl = !0;
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
      } catch (c) {
        var r = c;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (c) {
        r = c;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (var l = c.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, u = i.length - 1; 1 <= o && 0 <= u && l[o] !== i[u]; ) u--;
      for (; 1 <= o && 0 <= u; o--, u--) if (l[o] !== i[u]) {
        if (o !== 1 || u !== 1)
          do
            if (o--, u--, 0 > u || l[o] !== i[u]) {
              var a = `
` + l[o].replace(" at new ", " at ");
              return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
            }
          while (1 <= o && 0 <= u);
        break;
      }
    }
  } finally {
    Nl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Sn(e) : "";
}
function Mc(e) {
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
    case $t:
      return "Portal";
    case ql:
      return "Profiler";
    case Zi:
      return "StrictMode";
    case bl:
      return "Suspense";
    case ei:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case fs:
      return (e.displayName || "Context") + ".Consumer";
    case cs:
      return (e._context.displayName || "Context") + ".Provider";
    case Ji:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case qi:
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
function Ic(e) {
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
      return t === Zi ? "StrictMode" : "Mode";
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
function ps(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Fc(e) {
  var t = ps(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  e._valueTracker || (e._valueTracker = Fc(e));
}
function ms(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = ps(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Mr(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function ni(e, t) {
  var n = t.checked;
  return Q({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Wo(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = gt(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function hs(e, t) {
  t = t.checked, t != null && Gi(e, "checked", t, !1);
}
function ri(e, t) {
  hs(e, t);
  var n = gt(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? li(e, t.type, n) : t.hasOwnProperty("defaultValue") && li(e, t.type, gt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Qo(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function li(e, t, n) {
  (t !== "number" || Mr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
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
  if (t.dangerouslySetInnerHTML != null) throw Error(y(91));
  return Q({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Ko(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(y(92));
      if (En(n)) {
        if (1 < n.length) throw Error(y(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: gt(n) };
}
function vs(e, t) {
  var n = gt(t.value), r = gt(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function Yo(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function gs(e) {
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
  return e == null || e === "http://www.w3.org/1999/xhtml" ? gs(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var sr, ys = function(e) {
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
}, Uc = ["Webkit", "ms", "Moz", "O"];
Object.keys(Nn).forEach(function(e) {
  Uc.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Nn[t] = Nn[e];
  });
});
function xs(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Nn.hasOwnProperty(e) && Nn[e] ? ("" + t).trim() : t + "px";
}
function ws(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = xs(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var $c = Q({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function ui(e, t) {
  if (t) {
    if ($c[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(y(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(y(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(y(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(y(62));
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
function bi(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var ci = null, qt = null, bt = null;
function Xo(e) {
  if (e = tr(e)) {
    if (typeof ci != "function") throw Error(y(280));
    var t = e.stateNode;
    t && (t = al(t), ci(e.stateNode, e.type, t));
  }
}
function ks(e) {
  qt ? bt ? bt.push(e) : bt = [e] : qt = e;
}
function Ss() {
  if (qt) {
    var e = qt, t = bt;
    if (bt = qt = null, Xo(e), t) for (e = 0; e < t.length; e++) Xo(t[e]);
  }
}
function Es(e, t) {
  return e(t);
}
function _s() {
}
var zl = !1;
function Cs(e, t, n) {
  if (zl) return e(t, n);
  zl = !0;
  try {
    return Es(e, t, n);
  } finally {
    zl = !1, (qt !== null || bt !== null) && (_s(), Ss());
  }
}
function Fn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = al(n);
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
if (Je) try {
  var hn = {};
  Object.defineProperty(hn, "passive", { get: function() {
    fi = !0;
  } }), window.addEventListener("test", hn, hn), window.removeEventListener("test", hn, hn);
} catch {
  fi = !1;
}
function Ac(e, t, n, r, l, i, o, u, a) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (v) {
    this.onError(v);
  }
}
var jn = !1, Ir = null, Fr = !1, di = null, Vc = { onError: function(e) {
  jn = !0, Ir = e;
} };
function Bc(e, t, n, r, l, i, o, u, a) {
  jn = !1, Ir = null, Ac.apply(Vc, arguments);
}
function Hc(e, t, n, r, l, i, o, u, a) {
  if (Bc.apply(this, arguments), jn) {
    if (jn) {
      var c = Ir;
      jn = !1, Ir = null;
    } else throw Error(y(198));
    Fr || (Fr = !0, di = c);
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
function Ns(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Go(e) {
  if (Ft(e) !== e) throw Error(y(188));
}
function Wc(e) {
  var t = e.alternate;
  if (!t) {
    if (t = Ft(e), t === null) throw Error(y(188));
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
        if (i === n) return Go(l), e;
        if (i === r) return Go(l), t;
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
function js(e) {
  return e = Wc(e), e !== null ? zs(e) : null;
}
function zs(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = zs(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Ps = ke.unstable_scheduleCallback, Zo = ke.unstable_cancelCallback, Qc = ke.unstable_shouldYield, Kc = ke.unstable_requestPaint, X = ke.unstable_now, Yc = ke.unstable_getCurrentPriorityLevel, eo = ke.unstable_ImmediatePriority, Ts = ke.unstable_UserBlockingPriority, Ur = ke.unstable_NormalPriority, Xc = ke.unstable_LowPriority, Ls = ke.unstable_IdlePriority, il = null, Be = null;
function Gc(e) {
  if (Be && typeof Be.onCommitFiberRoot == "function") try {
    Be.onCommitFiberRoot(il, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Me = Math.clz32 ? Math.clz32 : qc, Zc = Math.log, Jc = Math.LN2;
function qc(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (Zc(e) / Jc | 0) | 0;
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
function $r(e, t) {
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
function bc(e, t) {
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
function ef(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
    var o = 31 - Me(i), u = 1 << o, a = l[o];
    a === -1 ? (!(u & n) || u & r) && (l[o] = bc(u, t)) : a <= t && (e.expiredLanes |= u), i &= ~u;
  }
}
function pi(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Ds() {
  var e = ar;
  return ar <<= 1, !(ar & 4194240) && (ar = 64), e;
}
function Pl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function bn(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Me(t), e[t] = n;
}
function tf(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Me(n), i = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
  }
}
function to(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Me(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var M = 0;
function Rs(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Os, no, Ms, Is, Fs, mi = !1, fr = [], at = null, ct = null, ft = null, Un = /* @__PURE__ */ new Map(), $n = /* @__PURE__ */ new Map(), it = [], nf = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Jo(e, t) {
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
  return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = tr(t), t !== null && no(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function rf(e, t, n, r, l) {
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
function Us(e) {
  var t = Nt(e.target);
  if (t !== null) {
    var n = Ft(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Ns(n), t !== null) {
          e.blockedOn = t, Fs(e.priority, function() {
            Ms(n);
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
    } else return t = tr(n), t !== null && no(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function qo(e, t, n) {
  Cr(e) && n.delete(t);
}
function lf() {
  mi = !1, at !== null && Cr(at) && (at = null), ct !== null && Cr(ct) && (ct = null), ft !== null && Cr(ft) && (ft = null), Un.forEach(qo), $n.forEach(qo);
}
function gn(e, t) {
  e.blockedOn === t && (e.blockedOn = null, mi || (mi = !0, ke.unstable_scheduleCallback(ke.unstable_NormalPriority, lf)));
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
  for (; 0 < it.length && (n = it[0], n.blockedOn === null); ) Us(n), n.blockedOn === null && it.shift();
}
var en = tt.ReactCurrentBatchConfig, Ar = !0;
function of(e, t, n, r) {
  var l = M, i = en.transition;
  en.transition = null;
  try {
    M = 1, ro(e, t, n, r);
  } finally {
    M = l, en.transition = i;
  }
}
function uf(e, t, n, r) {
  var l = M, i = en.transition;
  en.transition = null;
  try {
    M = 4, ro(e, t, n, r);
  } finally {
    M = l, en.transition = i;
  }
}
function ro(e, t, n, r) {
  if (Ar) {
    var l = hi(e, t, n, r);
    if (l === null) $l(e, t, r, Vr, n), Jo(e, r);
    else if (rf(l, e, t, n, r)) r.stopPropagation();
    else if (Jo(e, r), t & 4 && -1 < nf.indexOf(e)) {
      for (; l !== null; ) {
        var i = tr(l);
        if (i !== null && Os(i), i = hi(e, t, n, r), i === null && $l(e, t, r, Vr, n), i === l) break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else $l(e, t, r, null, n);
  }
}
var Vr = null;
function hi(e, t, n, r) {
  if (Vr = null, e = bi(r), e = Nt(e), e !== null) if (t = Ft(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Ns(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Vr = e, null;
}
function $s(e) {
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
      switch (Yc()) {
        case eo:
          return 1;
        case Ts:
          return 4;
        case Ur:
        case Xc:
          return 16;
        case Ls:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var ut = null, lo = null, Nr = null;
function As() {
  if (Nr) return Nr;
  var e, t = lo, n = t.length, r, l = "value" in ut ? ut.value : ut.textContent, i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
  return Nr = l.slice(e, 1 < r ? 1 - r : void 0);
}
function jr(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function dr() {
  return !0;
}
function bo() {
  return !1;
}
function Ee(e) {
  function t(n, r, l, i, o) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? dr : bo, this.isPropagationStopped = bo, this;
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
}, defaultPrevented: 0, isTrusted: 0 }, io = Ee(dn), er = Q({}, dn, { view: 0, detail: 0 }), sf = Ee(er), Tl, Ll, yn, ol = Q({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: oo, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== yn && (yn && e.type === "mousemove" ? (Tl = e.screenX - yn.screenX, Ll = e.screenY - yn.screenY) : Ll = Tl = 0, yn = e), Tl);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : Ll;
} }), eu = Ee(ol), af = Q({}, ol, { dataTransfer: 0 }), cf = Ee(af), ff = Q({}, er, { relatedTarget: 0 }), Dl = Ee(ff), df = Q({}, dn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), pf = Ee(df), mf = Q({}, dn, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), hf = Ee(mf), vf = Q({}, dn, { data: 0 }), tu = Ee(vf), gf = {
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
}, yf = {
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
}, xf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function wf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = xf[e]) ? !!t[e] : !1;
}
function oo() {
  return wf;
}
var kf = Q({}, er, { key: function(e) {
  if (e.key) {
    var t = gf[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = jr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? yf[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: oo, charCode: function(e) {
  return e.type === "keypress" ? jr(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? jr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), Sf = Ee(kf), Ef = Q({}, ol, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), nu = Ee(Ef), _f = Q({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: oo }), Cf = Ee(_f), Nf = Q({}, dn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), jf = Ee(Nf), zf = Q({}, ol, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Pf = Ee(zf), Tf = [9, 13, 27, 32], uo = Je && "CompositionEvent" in window, zn = null;
Je && "documentMode" in document && (zn = document.documentMode);
var Lf = Je && "TextEvent" in window && !zn, Vs = Je && (!uo || zn && 8 < zn && 11 >= zn), ru = " ", lu = !1;
function Bs(e, t) {
  switch (e) {
    case "keyup":
      return Tf.indexOf(t.keyCode) !== -1;
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
function Hs(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Vt = !1;
function Df(e, t) {
  switch (e) {
    case "compositionend":
      return Hs(t);
    case "keypress":
      return t.which !== 32 ? null : (lu = !0, ru);
    case "textInput":
      return e = t.data, e === ru && lu ? null : e;
    default:
      return null;
  }
}
function Rf(e, t) {
  if (Vt) return e === "compositionend" || !uo && Bs(e, t) ? (e = As(), Nr = lo = ut = null, Vt = !1, e) : null;
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
      return Vs && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Of = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function iu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Of[e.type] : t === "textarea";
}
function Ws(e, t, n, r) {
  ks(r), t = Br(t, "onChange"), 0 < t.length && (n = new io("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Pn = null, Vn = null;
function Mf(e) {
  ta(e, 0);
}
function ul(e) {
  var t = Wt(e);
  if (ms(t)) return e;
}
function If(e, t) {
  if (e === "change") return t;
}
var Qs = !1;
if (Je) {
  var Rl;
  if (Je) {
    var Ol = "oninput" in document;
    if (!Ol) {
      var ou = document.createElement("div");
      ou.setAttribute("oninput", "return;"), Ol = typeof ou.oninput == "function";
    }
    Rl = Ol;
  } else Rl = !1;
  Qs = Rl && (!document.documentMode || 9 < document.documentMode);
}
function uu() {
  Pn && (Pn.detachEvent("onpropertychange", Ks), Vn = Pn = null);
}
function Ks(e) {
  if (e.propertyName === "value" && ul(Vn)) {
    var t = [];
    Ws(t, Vn, e, bi(e)), Cs(Mf, t);
  }
}
function Ff(e, t, n) {
  e === "focusin" ? (uu(), Pn = t, Vn = n, Pn.attachEvent("onpropertychange", Ks)) : e === "focusout" && uu();
}
function Uf(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return ul(Vn);
}
function $f(e, t) {
  if (e === "click") return ul(t);
}
function Af(e, t) {
  if (e === "input" || e === "change") return ul(t);
}
function Vf(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Fe = typeof Object.is == "function" ? Object.is : Vf;
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
function su(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function au(e, t) {
  var n = su(e);
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
    n = su(n);
  }
}
function Ys(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ys(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function Xs() {
  for (var e = window, t = Mr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Mr(e.document);
  }
  return t;
}
function so(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Bf(e) {
  var t = Xs(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Ys(n.ownerDocument.documentElement, n)) {
    if (r !== null && so(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = n.textContent.length, i = Math.min(r.start, l);
        r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = au(n, i);
        var o = au(
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
var Hf = Je && "documentMode" in document && 11 >= document.documentMode, Bt = null, vi = null, Tn = null, gi = !1;
function cu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  gi || Bt == null || Bt !== Mr(r) || (r = Bt, "selectionStart" in r && so(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Tn && Bn(Tn, r) || (Tn = r, r = Br(vi, "onSelect"), 0 < r.length && (t = new io("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Bt)));
}
function pr(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Ht = { animationend: pr("Animation", "AnimationEnd"), animationiteration: pr("Animation", "AnimationIteration"), animationstart: pr("Animation", "AnimationStart"), transitionend: pr("Transition", "TransitionEnd") }, Ml = {}, Gs = {};
Je && (Gs = document.createElement("div").style, "AnimationEvent" in window || (delete Ht.animationend.animation, delete Ht.animationiteration.animation, delete Ht.animationstart.animation), "TransitionEvent" in window || delete Ht.transitionend.transition);
function sl(e) {
  if (Ml[e]) return Ml[e];
  if (!Ht[e]) return e;
  var t = Ht[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in Gs) return Ml[e] = t[n];
  return e;
}
var Zs = sl("animationend"), Js = sl("animationiteration"), qs = sl("animationstart"), bs = sl("transitionend"), ea = /* @__PURE__ */ new Map(), fu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function xt(e, t) {
  ea.set(e, t), It(t, [e]);
}
for (var Il = 0; Il < fu.length; Il++) {
  var Fl = fu[Il], Wf = Fl.toLowerCase(), Qf = Fl[0].toUpperCase() + Fl.slice(1);
  xt(Wf, "on" + Qf);
}
xt(Zs, "onAnimationEnd");
xt(Js, "onAnimationIteration");
xt(qs, "onAnimationStart");
xt("dblclick", "onDoubleClick");
xt("focusin", "onFocus");
xt("focusout", "onBlur");
xt(bs, "onTransitionEnd");
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
var Cn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Kf = new Set("cancel close invalid load scroll toggle".split(" ").concat(Cn));
function du(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, Hc(r, t, void 0, e), e.currentTarget = null;
}
function ta(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var u = r[o], a = u.instance, c = u.currentTarget;
        if (u = u.listener, a !== i && l.isPropagationStopped()) break e;
        du(l, u, c), i = a;
      }
      else for (o = 0; o < r.length; o++) {
        if (u = r[o], a = u.instance, c = u.currentTarget, u = u.listener, a !== i && l.isPropagationStopped()) break e;
        du(l, u, c), i = a;
      }
    }
  }
  if (Fr) throw e = di, Fr = !1, di = null, e;
}
function $(e, t) {
  var n = t[Si];
  n === void 0 && (n = t[Si] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (na(t, e, 2, !1), n.add(r));
}
function Ul(e, t, n) {
  var r = 0;
  t && (r |= 4), na(n, e, r, t);
}
var mr = "_reactListening" + Math.random().toString(36).slice(2);
function Hn(e) {
  if (!e[mr]) {
    e[mr] = !0, as.forEach(function(n) {
      n !== "selectionchange" && (Kf.has(n) || Ul(n, !1, e), Ul(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[mr] || (t[mr] = !0, Ul("selectionchange", !1, t));
  }
}
function na(e, t, n, r) {
  switch ($s(t)) {
    case 1:
      var l = of;
      break;
    case 4:
      l = uf;
      break;
    default:
      l = ro;
  }
  n = l.bind(null, t, n, e), l = void 0, !fi || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
}
function $l(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var u = r.stateNode.containerInfo;
      if (u === l || u.nodeType === 8 && u.parentNode === l) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var a = o.tag;
        if ((a === 3 || a === 4) && (a = o.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l)) return;
        o = o.return;
      }
      for (; u !== null; ) {
        if (o = Nt(u), o === null) return;
        if (a = o.tag, a === 5 || a === 6) {
          r = i = o;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  Cs(function() {
    var c = i, v = bi(n), h = [];
    e: {
      var m = ea.get(e);
      if (m !== void 0) {
        var x = io, w = e;
        switch (e) {
          case "keypress":
            if (jr(n) === 0) break e;
          case "keydown":
          case "keyup":
            x = Sf;
            break;
          case "focusin":
            w = "focus", x = Dl;
            break;
          case "focusout":
            w = "blur", x = Dl;
            break;
          case "beforeblur":
          case "afterblur":
            x = Dl;
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
            x = eu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            x = cf;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            x = Cf;
            break;
          case Zs:
          case Js:
          case qs:
            x = pf;
            break;
          case bs:
            x = jf;
            break;
          case "scroll":
            x = sf;
            break;
          case "wheel":
            x = Pf;
            break;
          case "copy":
          case "cut":
          case "paste":
            x = hf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            x = nu;
        }
        var k = (t & 4) !== 0, O = !k && e === "scroll", f = k ? m !== null ? m + "Capture" : null : m;
        k = [];
        for (var s = c, d; s !== null; ) {
          d = s;
          var g = d.stateNode;
          if (d.tag === 5 && g !== null && (d = g, f !== null && (g = Fn(s, f), g != null && k.push(Wn(s, g, d)))), O) break;
          s = s.return;
        }
        0 < k.length && (m = new x(m, w, null, n, v), h.push({ event: m, listeners: k }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (m = e === "mouseover" || e === "pointerover", x = e === "mouseout" || e === "pointerout", m && n !== ai && (w = n.relatedTarget || n.fromElement) && (Nt(w) || w[qe])) break e;
        if ((x || m) && (m = v.window === v ? v : (m = v.ownerDocument) ? m.defaultView || m.parentWindow : window, x ? (w = n.relatedTarget || n.toElement, x = c, w = w ? Nt(w) : null, w !== null && (O = Ft(w), w !== O || w.tag !== 5 && w.tag !== 6) && (w = null)) : (x = null, w = c), x !== w)) {
          if (k = eu, g = "onMouseLeave", f = "onMouseEnter", s = "mouse", (e === "pointerout" || e === "pointerover") && (k = nu, g = "onPointerLeave", f = "onPointerEnter", s = "pointer"), O = x == null ? m : Wt(x), d = w == null ? m : Wt(w), m = new k(g, s + "leave", x, n, v), m.target = O, m.relatedTarget = d, g = null, Nt(v) === c && (k = new k(f, s + "enter", w, n, v), k.target = d, k.relatedTarget = O, g = k), O = g, x && w) t: {
            for (k = x, f = w, s = 0, d = k; d; d = Ut(d)) s++;
            for (d = 0, g = f; g; g = Ut(g)) d++;
            for (; 0 < s - d; ) k = Ut(k), s--;
            for (; 0 < d - s; ) f = Ut(f), d--;
            for (; s--; ) {
              if (k === f || f !== null && k === f.alternate) break t;
              k = Ut(k), f = Ut(f);
            }
            k = null;
          }
          else k = null;
          x !== null && pu(h, m, x, k, !1), w !== null && O !== null && pu(h, O, w, k, !0);
        }
      }
      e: {
        if (m = c ? Wt(c) : window, x = m.nodeName && m.nodeName.toLowerCase(), x === "select" || x === "input" && m.type === "file") var S = If;
        else if (iu(m)) if (Qs) S = Af;
        else {
          S = Uf;
          var C = Ff;
        }
        else (x = m.nodeName) && x.toLowerCase() === "input" && (m.type === "checkbox" || m.type === "radio") && (S = $f);
        if (S && (S = S(e, c))) {
          Ws(h, S, n, v);
          break e;
        }
        C && C(e, m, c), e === "focusout" && (C = m._wrapperState) && C.controlled && m.type === "number" && li(m, "number", m.value);
      }
      switch (C = c ? Wt(c) : window, e) {
        case "focusin":
          (iu(C) || C.contentEditable === "true") && (Bt = C, vi = c, Tn = null);
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
          gi = !1, cu(h, n, v);
          break;
        case "selectionchange":
          if (Hf) break;
        case "keydown":
        case "keyup":
          cu(h, n, v);
      }
      var N;
      if (uo) e: {
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
      else Vt ? Bs(e, n) && (j = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (j = "onCompositionStart");
      j && (Vs && n.locale !== "ko" && (Vt || j !== "onCompositionStart" ? j === "onCompositionEnd" && Vt && (N = As()) : (ut = v, lo = "value" in ut ? ut.value : ut.textContent, Vt = !0)), C = Br(c, j), 0 < C.length && (j = new tu(j, e, null, n, v), h.push({ event: j, listeners: C }), N ? j.data = N : (N = Hs(n), N !== null && (j.data = N)))), (N = Lf ? Df(e, n) : Rf(e, n)) && (c = Br(c, "onBeforeInput"), 0 < c.length && (v = new tu("onBeforeInput", "beforeinput", null, n, v), h.push({ event: v, listeners: c }), v.data = N));
    }
    ta(h, t);
  });
}
function Wn(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Br(e, t) {
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
function pu(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n, a = u.alternate, c = u.stateNode;
    if (a !== null && a === r) break;
    u.tag === 5 && c !== null && (u = c, l ? (a = Fn(n, i), a != null && o.unshift(Wn(n, a, u))) : l || (a = Fn(n, i), a != null && o.push(Wn(n, a, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Yf = /\r\n?/g, Xf = /\u0000|\uFFFD/g;
function mu(e) {
  return (typeof e == "string" ? e : "" + e).replace(Yf, `
`).replace(Xf, "");
}
function hr(e, t, n) {
  if (t = mu(t), mu(e) !== t && n) throw Error(y(425));
}
function Hr() {
}
var yi = null, xi = null;
function wi(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var ki = typeof setTimeout == "function" ? setTimeout : void 0, Gf = typeof clearTimeout == "function" ? clearTimeout : void 0, hu = typeof Promise == "function" ? Promise : void 0, Zf = typeof queueMicrotask == "function" ? queueMicrotask : typeof hu < "u" ? function(e) {
  return hu.resolve(null).then(e).catch(Jf);
} : ki;
function Jf(e) {
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
function vu(e) {
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
var pn = Math.random().toString(36).slice(2), Ve = "__reactFiber$" + pn, Qn = "__reactProps$" + pn, qe = "__reactContainer$" + pn, Si = "__reactEvents$" + pn, qf = "__reactListeners$" + pn, bf = "__reactHandles$" + pn;
function Nt(e) {
  var t = e[Ve];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[qe] || n[Ve]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = vu(e); e !== null; ) {
        if (n = e[Ve]) return n;
        e = vu(e);
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
  throw Error(y(33));
}
function al(e) {
  return e[Qn] || null;
}
var Ei = [], Qt = -1;
function wt(e) {
  return { current: e };
}
function A(e) {
  0 > Qt || (e.current = Ei[Qt], Ei[Qt] = null, Qt--);
}
function F(e, t) {
  Qt++, Ei[Qt] = e.current, e.current = t;
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
function Wr() {
  A(me), A(ue);
}
function gu(e, t, n) {
  if (ue.current !== yt) throw Error(y(168));
  F(ue, t), F(me, n);
}
function ra(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(y(108, Ic(e) || "Unknown", l));
  return Q({}, n, r);
}
function Qr(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || yt, Lt = ue.current, F(ue, e), F(me, me.current), !0;
}
function yu(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(y(169));
  n ? (e = ra(e, t, Lt), r.__reactInternalMemoizedMergedChildContext = e, A(me), A(ue), F(ue, e)) : A(me), F(me, n);
}
var Ye = null, cl = !1, Vl = !1;
function la(e) {
  Ye === null ? Ye = [e] : Ye.push(e);
}
function ed(e) {
  cl = !0, la(e);
}
function kt() {
  if (!Vl && Ye !== null) {
    Vl = !0;
    var e = 0, t = M;
    try {
      var n = Ye;
      for (M = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Ye = null, cl = !1;
    } catch (l) {
      throw Ye !== null && (Ye = Ye.slice(e + 1)), Ps(eo, kt), l;
    } finally {
      M = t, Vl = !1;
    }
  }
  return null;
}
var Kt = [], Yt = 0, Kr = null, Yr = 0, Ce = [], Ne = 0, Dt = null, Xe = 1, Ge = "";
function _t(e, t) {
  Kt[Yt++] = Yr, Kt[Yt++] = Kr, Kr = e, Yr = t;
}
function ia(e, t, n) {
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
function ao(e) {
  e.return !== null && (_t(e, 1), ia(e, 1, 0));
}
function co(e) {
  for (; e === Kr; ) Kr = Kt[--Yt], Kt[Yt] = null, Yr = Kt[--Yt], Kt[Yt] = null;
  for (; e === Dt; ) Dt = Ce[--Ne], Ce[Ne] = null, Ge = Ce[--Ne], Ce[Ne] = null, Xe = Ce[--Ne], Ce[Ne] = null;
}
var we = null, xe = null, V = !1, Oe = null;
function oa(e, t) {
  var n = je(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function xu(e, t) {
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
function _i(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ci(e) {
  if (V) {
    var t = xe;
    if (t) {
      var n = t;
      if (!xu(e, t)) {
        if (_i(e)) throw Error(y(418));
        t = dt(n.nextSibling);
        var r = we;
        t && xu(e, t) ? oa(r, n) : (e.flags = e.flags & -4097 | 2, V = !1, we = e);
      }
    } else {
      if (_i(e)) throw Error(y(418));
      e.flags = e.flags & -4097 | 2, V = !1, we = e;
    }
  }
}
function wu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  we = e;
}
function vr(e) {
  if (e !== we) return !1;
  if (!V) return wu(e), V = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !wi(e.type, e.memoizedProps)), t && (t = xe)) {
    if (_i(e)) throw ua(), Error(y(418));
    for (; t; ) oa(e, t), t = dt(t.nextSibling);
  }
  if (wu(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(y(317));
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
function ua() {
  for (var e = xe; e; ) e = dt(e.nextSibling);
}
function on() {
  xe = we = null, V = !1;
}
function fo(e) {
  Oe === null ? Oe = [e] : Oe.push(e);
}
var td = tt.ReactCurrentBatchConfig;
function xn(e, t, n) {
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
function gr(e, t) {
  throw e = Object.prototype.toString.call(t), Error(y(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function ku(e) {
  var t = e._init;
  return t(e._payload);
}
function sa(e) {
  function t(f, s) {
    if (e) {
      var d = f.deletions;
      d === null ? (f.deletions = [s], f.flags |= 16) : d.push(s);
    }
  }
  function n(f, s) {
    if (!e) return null;
    for (; s !== null; ) t(f, s), s = s.sibling;
    return null;
  }
  function r(f, s) {
    for (f = /* @__PURE__ */ new Map(); s !== null; ) s.key !== null ? f.set(s.key, s) : f.set(s.index, s), s = s.sibling;
    return f;
  }
  function l(f, s) {
    return f = vt(f, s), f.index = 0, f.sibling = null, f;
  }
  function i(f, s, d) {
    return f.index = d, e ? (d = f.alternate, d !== null ? (d = d.index, d < s ? (f.flags |= 2, s) : d) : (f.flags |= 2, s)) : (f.flags |= 1048576, s);
  }
  function o(f) {
    return e && f.alternate === null && (f.flags |= 2), f;
  }
  function u(f, s, d, g) {
    return s === null || s.tag !== 6 ? (s = Xl(d, f.mode, g), s.return = f, s) : (s = l(s, d), s.return = f, s);
  }
  function a(f, s, d, g) {
    var S = d.type;
    return S === At ? v(f, s, d.props.children, g, d.key) : s !== null && (s.elementType === S || typeof S == "object" && S !== null && S.$$typeof === rt && ku(S) === s.type) ? (g = l(s, d.props), g.ref = xn(f, s, d), g.return = f, g) : (g = Or(d.type, d.key, d.props, null, f.mode, g), g.ref = xn(f, s, d), g.return = f, g);
  }
  function c(f, s, d, g) {
    return s === null || s.tag !== 4 || s.stateNode.containerInfo !== d.containerInfo || s.stateNode.implementation !== d.implementation ? (s = Gl(d, f.mode, g), s.return = f, s) : (s = l(s, d.children || []), s.return = f, s);
  }
  function v(f, s, d, g, S) {
    return s === null || s.tag !== 7 ? (s = Tt(d, f.mode, g, S), s.return = f, s) : (s = l(s, d), s.return = f, s);
  }
  function h(f, s, d) {
    if (typeof s == "string" && s !== "" || typeof s == "number") return s = Xl("" + s, f.mode, d), s.return = f, s;
    if (typeof s == "object" && s !== null) {
      switch (s.$$typeof) {
        case or:
          return d = Or(s.type, s.key, s.props, null, f.mode, d), d.ref = xn(f, null, s), d.return = f, d;
        case $t:
          return s = Gl(s, f.mode, d), s.return = f, s;
        case rt:
          var g = s._init;
          return h(f, g(s._payload), d);
      }
      if (En(s) || mn(s)) return s = Tt(s, f.mode, d, null), s.return = f, s;
      gr(f, s);
    }
    return null;
  }
  function m(f, s, d, g) {
    var S = s !== null ? s.key : null;
    if (typeof d == "string" && d !== "" || typeof d == "number") return S !== null ? null : u(f, s, "" + d, g);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case or:
          return d.key === S ? a(f, s, d, g) : null;
        case $t:
          return d.key === S ? c(f, s, d, g) : null;
        case rt:
          return S = d._init, m(
            f,
            s,
            S(d._payload),
            g
          );
      }
      if (En(d) || mn(d)) return S !== null ? null : v(f, s, d, g, null);
      gr(f, d);
    }
    return null;
  }
  function x(f, s, d, g, S) {
    if (typeof g == "string" && g !== "" || typeof g == "number") return f = f.get(d) || null, u(s, f, "" + g, S);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case or:
          return f = f.get(g.key === null ? d : g.key) || null, a(s, f, g, S);
        case $t:
          return f = f.get(g.key === null ? d : g.key) || null, c(s, f, g, S);
        case rt:
          var C = g._init;
          return x(f, s, d, C(g._payload), S);
      }
      if (En(g) || mn(g)) return f = f.get(d) || null, v(s, f, g, S, null);
      gr(s, g);
    }
    return null;
  }
  function w(f, s, d, g) {
    for (var S = null, C = null, N = s, j = s = 0, U = null; N !== null && j < d.length; j++) {
      N.index > j ? (U = N, N = null) : U = N.sibling;
      var T = m(f, N, d[j], g);
      if (T === null) {
        N === null && (N = U);
        break;
      }
      e && N && T.alternate === null && t(f, N), s = i(T, s, j), C === null ? S = T : C.sibling = T, C = T, N = U;
    }
    if (j === d.length) return n(f, N), V && _t(f, j), S;
    if (N === null) {
      for (; j < d.length; j++) N = h(f, d[j], g), N !== null && (s = i(N, s, j), C === null ? S = N : C.sibling = N, C = N);
      return V && _t(f, j), S;
    }
    for (N = r(f, N); j < d.length; j++) U = x(N, f, j, d[j], g), U !== null && (e && U.alternate !== null && N.delete(U.key === null ? j : U.key), s = i(U, s, j), C === null ? S = U : C.sibling = U, C = U);
    return e && N.forEach(function(ge) {
      return t(f, ge);
    }), V && _t(f, j), S;
  }
  function k(f, s, d, g) {
    var S = mn(d);
    if (typeof S != "function") throw Error(y(150));
    if (d = S.call(d), d == null) throw Error(y(151));
    for (var C = S = null, N = s, j = s = 0, U = null, T = d.next(); N !== null && !T.done; j++, T = d.next()) {
      N.index > j ? (U = N, N = null) : U = N.sibling;
      var ge = m(f, N, T.value, g);
      if (ge === null) {
        N === null && (N = U);
        break;
      }
      e && N && ge.alternate === null && t(f, N), s = i(ge, s, j), C === null ? S = ge : C.sibling = ge, C = ge, N = U;
    }
    if (T.done) return n(
      f,
      N
    ), V && _t(f, j), S;
    if (N === null) {
      for (; !T.done; j++, T = d.next()) T = h(f, T.value, g), T !== null && (s = i(T, s, j), C === null ? S = T : C.sibling = T, C = T);
      return V && _t(f, j), S;
    }
    for (N = r(f, N); !T.done; j++, T = d.next()) T = x(N, f, j, T.value, g), T !== null && (e && T.alternate !== null && N.delete(T.key === null ? j : T.key), s = i(T, s, j), C === null ? S = T : C.sibling = T, C = T);
    return e && N.forEach(function(I) {
      return t(f, I);
    }), V && _t(f, j), S;
  }
  function O(f, s, d, g) {
    if (typeof d == "object" && d !== null && d.type === At && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case or:
          e: {
            for (var S = d.key, C = s; C !== null; ) {
              if (C.key === S) {
                if (S = d.type, S === At) {
                  if (C.tag === 7) {
                    n(f, C.sibling), s = l(C, d.props.children), s.return = f, f = s;
                    break e;
                  }
                } else if (C.elementType === S || typeof S == "object" && S !== null && S.$$typeof === rt && ku(S) === C.type) {
                  n(f, C.sibling), s = l(C, d.props), s.ref = xn(f, C, d), s.return = f, f = s;
                  break e;
                }
                n(f, C);
                break;
              } else t(f, C);
              C = C.sibling;
            }
            d.type === At ? (s = Tt(d.props.children, f.mode, g, d.key), s.return = f, f = s) : (g = Or(d.type, d.key, d.props, null, f.mode, g), g.ref = xn(f, s, d), g.return = f, f = g);
          }
          return o(f);
        case $t:
          e: {
            for (C = d.key; s !== null; ) {
              if (s.key === C) if (s.tag === 4 && s.stateNode.containerInfo === d.containerInfo && s.stateNode.implementation === d.implementation) {
                n(f, s.sibling), s = l(s, d.children || []), s.return = f, f = s;
                break e;
              } else {
                n(f, s);
                break;
              }
              else t(f, s);
              s = s.sibling;
            }
            s = Gl(d, f.mode, g), s.return = f, f = s;
          }
          return o(f);
        case rt:
          return C = d._init, O(f, s, C(d._payload), g);
      }
      if (En(d)) return w(f, s, d, g);
      if (mn(d)) return k(f, s, d, g);
      gr(f, d);
    }
    return typeof d == "string" && d !== "" || typeof d == "number" ? (d = "" + d, s !== null && s.tag === 6 ? (n(f, s.sibling), s = l(s, d), s.return = f, f = s) : (n(f, s), s = Xl(d, f.mode, g), s.return = f, f = s), o(f)) : n(f, s);
  }
  return O;
}
var un = sa(!0), aa = sa(!1), Xr = wt(null), Gr = null, Xt = null, po = null;
function mo() {
  po = Xt = Gr = null;
}
function ho(e) {
  var t = Xr.current;
  A(Xr), e._currentValue = t;
}
function Ni(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function tn(e, t) {
  Gr = e, po = Xt = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (pe = !0), e.firstContext = null);
}
function Pe(e) {
  var t = e._currentValue;
  if (po !== e) if (e = { context: e, memoizedValue: t, next: null }, Xt === null) {
    if (Gr === null) throw Error(y(308));
    Xt = e, Gr.dependencies = { lanes: 0, firstContext: e };
  } else Xt = Xt.next = e;
  return t;
}
var jt = null;
function vo(e) {
  jt === null ? jt = [e] : jt.push(e);
}
function ca(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, vo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, be(e, r);
}
function be(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var lt = !1;
function go(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function fa(e, t) {
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
  return l = r.interleaved, l === null ? (t.next = t, vo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, be(e, n);
}
function zr(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, to(e, n);
  }
}
function Su(e, t) {
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
function Zr(e, t, n, r) {
  var l = e.updateQueue;
  lt = !1;
  var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
  if (u !== null) {
    l.shared.pending = null;
    var a = u, c = a.next;
    a.next = null, o === null ? i = c : o.next = c, o = a;
    var v = e.alternate;
    v !== null && (v = v.updateQueue, u = v.lastBaseUpdate, u !== o && (u === null ? v.firstBaseUpdate = c : u.next = c, v.lastBaseUpdate = a));
  }
  if (i !== null) {
    var h = l.baseState;
    o = 0, v = c = a = null, u = i;
    do {
      var m = u.lane, x = u.eventTime;
      if ((r & m) === m) {
        v !== null && (v = v.next = {
          eventTime: x,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var w = e, k = u;
          switch (m = t, x = n, k.tag) {
            case 1:
              if (w = k.payload, typeof w == "function") {
                h = w.call(x, h, m);
                break e;
              }
              h = w;
              break e;
            case 3:
              w.flags = w.flags & -65537 | 128;
            case 0:
              if (w = k.payload, m = typeof w == "function" ? w.call(x, h, m) : w, m == null) break e;
              h = Q({}, h, m);
              break e;
            case 2:
              lt = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, m = l.effects, m === null ? l.effects = [u] : m.push(u));
      } else x = { eventTime: x, lane: m, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, v === null ? (c = v = x, a = h) : v = v.next = x, o |= m;
      if (u = u.next, u === null) {
        if (u = l.shared.pending, u === null) break;
        m = u, u = m.next, m.next = null, l.lastBaseUpdate = m, l.shared.pending = null;
      }
    } while (!0);
    if (v === null && (a = h), l.baseState = a, l.firstBaseUpdate = c, l.lastBaseUpdate = v, t = l.shared.interleaved, t !== null) {
      l = t;
      do
        o |= l.lane, l = l.next;
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    Ot |= o, e.lanes = o, e.memoizedState = h;
  }
}
function Eu(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = n, typeof l != "function") throw Error(y(191, l));
      l.call(r);
    }
  }
}
var nr = {}, He = wt(nr), Kn = wt(nr), Yn = wt(nr);
function zt(e) {
  if (e === nr) throw Error(y(174));
  return e;
}
function yo(e, t) {
  switch (F(Yn, t), F(Kn, e), F(He, nr), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : oi(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = oi(t, e);
  }
  A(He), F(He, t);
}
function sn() {
  A(He), A(Kn), A(Yn);
}
function da(e) {
  zt(Yn.current);
  var t = zt(He.current), n = oi(t, e.type);
  t !== n && (F(Kn, e), F(He, n));
}
function xo(e) {
  Kn.current === e && (A(He), A(Kn));
}
var H = wt(0);
function Jr(e) {
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
function wo() {
  for (var e = 0; e < Bl.length; e++) Bl[e]._workInProgressVersionPrimary = null;
  Bl.length = 0;
}
var Pr = tt.ReactCurrentDispatcher, Hl = tt.ReactCurrentBatchConfig, Rt = 0, W = null, Z = null, b = null, qr = !1, Ln = !1, Xn = 0, nd = 0;
function le() {
  throw Error(y(321));
}
function ko(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Fe(e[n], t[n])) return !1;
  return !0;
}
function So(e, t, n, r, l, i) {
  if (Rt = i, W = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Pr.current = e === null || e.memoizedState === null ? od : ud, e = n(r, l), Ln) {
    i = 0;
    do {
      if (Ln = !1, Xn = 0, 25 <= i) throw Error(y(301));
      i += 1, b = Z = null, t.updateQueue = null, Pr.current = sd, e = n(r, l);
    } while (Ln);
  }
  if (Pr.current = br, t = Z !== null && Z.next !== null, Rt = 0, b = Z = W = null, qr = !1, t) throw Error(y(300));
  return e;
}
function Eo() {
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
    if (e === null) throw Error(y(310));
    Z = e, e = { memoizedState: Z.memoizedState, baseState: Z.baseState, baseQueue: Z.baseQueue, queue: Z.queue, next: null }, b === null ? W.memoizedState = b = e : b = b.next = e;
  }
  return b;
}
function Gn(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Wl(e) {
  var t = Te(), n = t.queue;
  if (n === null) throw Error(y(311));
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
    var u = o = null, a = null, c = i;
    do {
      var v = c.lane;
      if ((Rt & v) === v) a !== null && (a = a.next = { lane: 0, action: c.action, hasEagerState: c.hasEagerState, eagerState: c.eagerState, next: null }), r = c.hasEagerState ? c.eagerState : e(r, c.action);
      else {
        var h = {
          lane: v,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null
        };
        a === null ? (u = a = h, o = r) : a = a.next = h, W.lanes |= v, Ot |= v;
      }
      c = c.next;
    } while (c !== null && c !== i);
    a === null ? o = r : a.next = u, Fe(r, t.memoizedState) || (pe = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = a, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      i = l.lane, W.lanes |= i, Ot |= i, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Ql(e) {
  var t = Te(), n = t.queue;
  if (n === null) throw Error(y(311));
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
function pa() {
}
function ma(e, t) {
  var n = W, r = Te(), l = t(), i = !Fe(r.memoizedState, l);
  if (i && (r.memoizedState = l, pe = !0), r = r.queue, _o(ga.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || b !== null && b.memoizedState.tag & 1) {
    if (n.flags |= 2048, Zn(9, va.bind(null, n, r, l, t), void 0, null), ee === null) throw Error(y(349));
    Rt & 30 || ha(n, t, l);
  }
  return l;
}
function ha(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = W.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, W.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function va(e, t, n, r) {
  t.value = n, t.getSnapshot = r, ya(t) && xa(e);
}
function ga(e, t, n) {
  return n(function() {
    ya(t) && xa(e);
  });
}
function ya(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Fe(e, n);
  } catch {
    return !0;
  }
}
function xa(e) {
  var t = be(e, 1);
  t !== null && Ie(t, e, 1, -1);
}
function _u(e) {
  var t = Ae();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Gn, lastRenderedState: e }, t.queue = e, e = e.dispatch = id.bind(null, W, e), [t.memoizedState, e];
}
function Zn(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = W.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, W.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function wa() {
  return Te().memoizedState;
}
function Tr(e, t, n, r) {
  var l = Ae();
  W.flags |= e, l.memoizedState = Zn(1 | t, n, void 0, r === void 0 ? null : r);
}
function fl(e, t, n, r) {
  var l = Te();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Z !== null) {
    var o = Z.memoizedState;
    if (i = o.destroy, r !== null && ko(r, o.deps)) {
      l.memoizedState = Zn(t, n, i, r);
      return;
    }
  }
  W.flags |= e, l.memoizedState = Zn(1 | t, n, i, r);
}
function Cu(e, t) {
  return Tr(8390656, 8, e, t);
}
function _o(e, t) {
  return fl(2048, 8, e, t);
}
function ka(e, t) {
  return fl(4, 2, e, t);
}
function Sa(e, t) {
  return fl(4, 4, e, t);
}
function Ea(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function _a(e, t, n) {
  return n = n != null ? n.concat([e]) : null, fl(4, 4, Ea.bind(null, t, e), n);
}
function Co() {
}
function Ca(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Na(e, t) {
  var n = Te();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ko(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function ja(e, t, n) {
  return Rt & 21 ? (Fe(n, t) || (n = Ds(), W.lanes |= n, Ot |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, pe = !0), e.memoizedState = n);
}
function rd(e, t) {
  var n = M;
  M = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = Hl.transition;
  Hl.transition = {};
  try {
    e(!1), t();
  } finally {
    M = n, Hl.transition = r;
  }
}
function za() {
  return Te().memoizedState;
}
function ld(e, t, n) {
  var r = ht(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Pa(e)) Ta(t, n);
  else if (n = ca(e, t, n, r), n !== null) {
    var l = ae();
    Ie(n, e, r, l), La(n, t, r);
  }
}
function id(e, t, n) {
  var r = ht(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Pa(e)) Ta(t, l);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var o = t.lastRenderedState, u = i(o, n);
      if (l.hasEagerState = !0, l.eagerState = u, Fe(u, o)) {
        var a = t.interleaved;
        a === null ? (l.next = l, vo(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = ca(e, t, l, r), n !== null && (l = ae(), Ie(n, e, r, l), La(n, t, r));
  }
}
function Pa(e) {
  var t = e.alternate;
  return e === W || t !== null && t === W;
}
function Ta(e, t) {
  Ln = qr = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function La(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, to(e, n);
  }
}
var br = { readContext: Pe, useCallback: le, useContext: le, useEffect: le, useImperativeHandle: le, useInsertionEffect: le, useLayoutEffect: le, useMemo: le, useReducer: le, useRef: le, useState: le, useDebugValue: le, useDeferredValue: le, useTransition: le, useMutableSource: le, useSyncExternalStore: le, useId: le, unstable_isNewReconciler: !1 }, od = { readContext: Pe, useCallback: function(e, t) {
  return Ae().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: Pe, useEffect: Cu, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Tr(
    4194308,
    4,
    Ea.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return Tr(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return Tr(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = Ae();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = Ae();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = ld.bind(null, W, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Ae();
  return e = { current: e }, t.memoizedState = e;
}, useState: _u, useDebugValue: Co, useDeferredValue: function(e) {
  return Ae().memoizedState = e;
}, useTransition: function() {
  var e = _u(!1), t = e[0];
  return e = rd.bind(null, e[1]), Ae().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = W, l = Ae();
  if (V) {
    if (n === void 0) throw Error(y(407));
    n = n();
  } else {
    if (n = t(), ee === null) throw Error(y(349));
    Rt & 30 || ha(r, t, n);
  }
  l.memoizedState = n;
  var i = { value: n, getSnapshot: t };
  return l.queue = i, Cu(ga.bind(
    null,
    r,
    i,
    e
  ), [e]), r.flags |= 2048, Zn(9, va.bind(null, r, i, n, t), void 0, null), n;
}, useId: function() {
  var e = Ae(), t = ee.identifierPrefix;
  if (V) {
    var n = Ge, r = Xe;
    n = (r & ~(1 << 32 - Me(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Xn++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = nd++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, ud = {
  readContext: Pe,
  useCallback: Ca,
  useContext: Pe,
  useEffect: _o,
  useImperativeHandle: _a,
  useInsertionEffect: ka,
  useLayoutEffect: Sa,
  useMemo: Na,
  useReducer: Wl,
  useRef: wa,
  useState: function() {
    return Wl(Gn);
  },
  useDebugValue: Co,
  useDeferredValue: function(e) {
    var t = Te();
    return ja(t, Z.memoizedState, e);
  },
  useTransition: function() {
    var e = Wl(Gn)[0], t = Te().memoizedState;
    return [e, t];
  },
  useMutableSource: pa,
  useSyncExternalStore: ma,
  useId: za,
  unstable_isNewReconciler: !1
}, sd = { readContext: Pe, useCallback: Ca, useContext: Pe, useEffect: _o, useImperativeHandle: _a, useInsertionEffect: ka, useLayoutEffect: Sa, useMemo: Na, useReducer: Ql, useRef: wa, useState: function() {
  return Ql(Gn);
}, useDebugValue: Co, useDeferredValue: function(e) {
  var t = Te();
  return Z === null ? t.memoizedState = e : ja(t, Z.memoizedState, e);
}, useTransition: function() {
  var e = Ql(Gn)[0], t = Te().memoizedState;
  return [e, t];
}, useMutableSource: pa, useSyncExternalStore: ma, useId: za, unstable_isNewReconciler: !1 };
function De(e, t) {
  if (e && e.defaultProps) {
    t = Q({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function ji(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : Q({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var dl = { isMounted: function(e) {
  return (e = e._reactInternals) ? Ft(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = ae(), l = ht(e), i = Ze(r, l);
  i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Ie(t, e, l, r), zr(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = ae(), l = ht(e), i = Ze(r, l);
  i.tag = 1, i.payload = t, n != null && (i.callback = n), t = pt(e, i, l), t !== null && (Ie(t, e, l, r), zr(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = ae(), r = ht(e), l = Ze(n, r);
  l.tag = 2, t != null && (l.callback = t), t = pt(e, l, r), t !== null && (Ie(t, e, r, n), zr(t, e, r));
} };
function Nu(e, t, n, r, l, i, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Bn(n, r) || !Bn(l, i) : !0;
}
function Da(e, t, n) {
  var r = !1, l = yt, i = t.contextType;
  return typeof i == "object" && i !== null ? i = Pe(i) : (l = he(t) ? Lt : ue.current, r = t.contextTypes, i = (r = r != null) ? ln(e, l) : yt), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = dl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function ju(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && dl.enqueueReplaceState(t, t.state, null);
}
function zi(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, go(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? l.context = Pe(i) : (i = he(t) ? Lt : ue.current, l.context = ln(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (ji(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && dl.enqueueReplaceState(l, l.state, null), Zr(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function an(e, t) {
  try {
    var n = "", r = t;
    do
      n += Mc(r), r = r.return;
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
var ad = typeof WeakMap == "function" ? WeakMap : Map;
function Ra(e, t, n) {
  n = Ze(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    tl || (tl = !0, $i = r), Pi(e, t);
  }, n;
}
function Oa(e, t, n) {
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
function zu(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new ad();
    var l = /* @__PURE__ */ new Set();
    r.set(t, l);
  } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
  l.has(n) || (l.add(n), e = Ed.bind(null, e, t, n), t.then(e, e));
}
function Pu(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Tu(e, t, n, r, l) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Ze(-1, 1), t.tag = 2, pt(n, t, 1))), n.lanes |= 1), e);
}
var cd = tt.ReactCurrentOwner, pe = !1;
function se(e, t, n, r) {
  t.child = e === null ? aa(t, null, n, r) : un(t, e.child, n, r);
}
function Lu(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return tn(t, l), r = So(e, t, n, r, i, l), n = Eo(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (V && n && ao(t), t.flags |= 1, se(e, t, r, l), t.child);
}
function Du(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" && !Ro(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Ma(e, t, i, r, l)) : (e = Or(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (i = e.child, !(e.lanes & l)) {
    var o = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Bn, n(o, r) && e.ref === t.ref) return et(e, t, l);
  }
  return t.flags |= 1, e = vt(i, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Ma(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (Bn(i, r) && e.ref === t.ref) if (pe = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) e.flags & 131072 && (pe = !0);
    else return t.lanes = e.lanes, et(e, t, l);
  }
  return Ti(e, t, n, r, l);
}
function Ia(e, t, n) {
  var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, F(Zt, ye), ye |= n;
  else {
    if (!(n & 1073741824)) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, F(Zt, ye), ye |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, F(Zt, ye), ye |= r;
  }
  else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, F(Zt, ye), ye |= r;
  return se(e, t, l, n), t.child;
}
function Fa(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Ti(e, t, n, r, l) {
  var i = he(n) ? Lt : ue.current;
  return i = ln(t, i), tn(t, l), n = So(e, t, n, r, i, l), r = Eo(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, et(e, t, l)) : (V && r && ao(t), t.flags |= 1, se(e, t, n, l), t.child);
}
function Ru(e, t, n, r, l) {
  if (he(n)) {
    var i = !0;
    Qr(t);
  } else i = !1;
  if (tn(t, l), t.stateNode === null) Lr(e, t), Da(t, n, r), zi(t, n, r, l), r = !0;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var a = o.context, c = n.contextType;
    typeof c == "object" && c !== null ? c = Pe(c) : (c = he(n) ? Lt : ue.current, c = ln(t, c));
    var v = n.getDerivedStateFromProps, h = typeof v == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    h || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || a !== c) && ju(t, o, r, c), lt = !1;
    var m = t.memoizedState;
    o.state = m, Zr(t, r, o, l), a = t.memoizedState, u !== r || m !== a || me.current || lt ? (typeof v == "function" && (ji(t, n, v, r), a = t.memoizedState), (u = lt || Nu(t, n, u, r, m, a, c)) ? (h || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), o.props = r, o.state = a, o.context = c, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, fa(e, t), u = t.memoizedProps, c = t.type === t.elementType ? u : De(t.type, u), o.props = c, h = t.pendingProps, m = o.context, a = n.contextType, typeof a == "object" && a !== null ? a = Pe(a) : (a = he(n) ? Lt : ue.current, a = ln(t, a));
    var x = n.getDerivedStateFromProps;
    (v = typeof x == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== h || m !== a) && ju(t, o, r, a), lt = !1, m = t.memoizedState, o.state = m, Zr(t, r, o, l);
    var w = t.memoizedState;
    u !== h || m !== w || me.current || lt ? (typeof x == "function" && (ji(t, n, x, r), w = t.memoizedState), (c = lt || Nu(t, n, c, r, m, w, a) || !1) ? (v || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, w, a), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, w, a)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = w), o.props = r, o.state = w, o.context = a, r = c) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Li(e, t, n, r, i, l);
}
function Li(e, t, n, r, l, i) {
  Fa(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && yu(t, n, !1), et(e, t, i);
  r = t.stateNode, cd.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = un(t, e.child, null, i), t.child = un(t, null, u, i)) : se(e, t, u, i), t.memoizedState = r.state, l && yu(t, n, !0), t.child;
}
function Ua(e) {
  var t = e.stateNode;
  t.pendingContext ? gu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && gu(e, t.context, !1), yo(e, t.containerInfo);
}
function Ou(e, t, n, r, l) {
  return on(), fo(l), t.flags |= 256, se(e, t, n, r), t.child;
}
var Di = { dehydrated: null, treeContext: null, retryLane: 0 };
function Ri(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function $a(e, t, n) {
  var r = t.pendingProps, l = H.current, i = !1, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), F(H, l & 1), e === null)
    return Ci(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = hl(o, r, 0, null), e = Tt(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Ri(n), t.memoizedState = Di, e) : No(t, o));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return fd(e, t, o, r, u, l, n);
  if (i) {
    i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = vt(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = vt(u, i) : (i = Tt(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? Ri(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = Di, r;
  }
  return i = e.child, e = i.sibling, r = vt(i, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function No(e, t) {
  return t = hl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function yr(e, t, n, r) {
  return r !== null && fo(r), un(t, e.child, null, n), e = No(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function fd(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = Kl(Error(y(422))), yr(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = hl({ mode: "visible", children: r.children }, l, 0, null), i = Tt(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, t.mode & 1 && un(t, e.child, null, o), t.child.memoizedState = Ri(o), t.memoizedState = Di, i);
  if (!(t.mode & 1)) return yr(e, t, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, i = Error(y(419)), r = Kl(i, r, void 0), yr(e, t, o, r);
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
    return Do(), r = Kl(Error(y(421))), yr(e, t, o, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = _d.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, xe = dt(l.nextSibling), we = t, V = !0, Oe = null, e !== null && (Ce[Ne++] = Xe, Ce[Ne++] = Ge, Ce[Ne++] = Dt, Xe = e.id, Ge = e.overflow, Dt = t), t = No(t, r.children), t.flags |= 4096, t);
}
function Mu(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Ni(e.return, t, n);
}
function Yl(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
}
function Aa(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, i = r.tail;
  if (se(e, t, r.children, n), r = H.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && Mu(e, n, t);
      else if (e.tag === 19) Mu(e, n, t);
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
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Jr(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Yl(t, !1, l, n, i);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && Jr(e) === null) {
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
function Lr(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function et(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), Ot |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(y(153));
  if (t.child !== null) {
    for (e = t.child, n = vt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = vt(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function dd(e, t, n) {
  switch (t.tag) {
    case 3:
      Ua(t), on();
      break;
    case 5:
      da(t);
      break;
    case 1:
      he(t.type) && Qr(t);
      break;
    case 4:
      yo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      F(Xr, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (F(H, H.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? $a(e, t, n) : (F(H, H.current & 1), e = et(e, t, n), e !== null ? e.sibling : null);
      F(H, H.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Aa(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), F(H, H.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Ia(e, t, n);
  }
  return et(e, t, n);
}
var Va, Oi, Ba, Ha;
Va = function(e, t) {
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
Oi = function() {
};
Ba = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, zt(He.current);
    var i = null;
    switch (n) {
      case "input":
        l = ni(e, l), r = ni(e, r), i = [];
        break;
      case "select":
        l = Q({}, l, { value: void 0 }), r = Q({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        l = ii(e, l), r = ii(e, r), i = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Hr);
    }
    ui(n, r);
    var o;
    n = null;
    for (c in l) if (!r.hasOwnProperty(c) && l.hasOwnProperty(c) && l[c] != null) if (c === "style") {
      var u = l[c];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else c !== "dangerouslySetInnerHTML" && c !== "children" && c !== "suppressContentEditableWarning" && c !== "suppressHydrationWarning" && c !== "autoFocus" && (Mn.hasOwnProperty(c) ? i || (i = []) : (i = i || []).push(c, null));
    for (c in r) {
      var a = r[c];
      if (u = l?.[c], r.hasOwnProperty(c) && a !== u && (a != null || u != null)) if (c === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || a && a.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in a) a.hasOwnProperty(o) && u[o] !== a[o] && (n || (n = {}), n[o] = a[o]);
      } else n || (i || (i = []), i.push(
        c,
        n
      )), n = a;
      else c === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (i = i || []).push(c, a)) : c === "children" ? typeof a != "string" && typeof a != "number" || (i = i || []).push(c, "" + a) : c !== "suppressContentEditableWarning" && c !== "suppressHydrationWarning" && (Mn.hasOwnProperty(c) ? (a != null && c === "onScroll" && $("scroll", e), i || u === a || (i = [])) : (i = i || []).push(c, a));
    }
    n && (i = i || []).push("style", n);
    var c = i;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
Ha = function(e, t, n, r) {
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
function pd(e, t, n) {
  var r = t.pendingProps;
  switch (co(t), t.tag) {
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
      return he(t.type) && Wr(), ie(t), null;
    case 3:
      return r = t.stateNode, sn(), A(me), A(ue), wo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (vr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Oe !== null && (Bi(Oe), Oe = null))), Oi(e, t), ie(t), null;
    case 5:
      xo(t);
      var l = zt(Yn.current);
      if (n = t.type, e !== null && t.stateNode != null) Ba(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(y(166));
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
              Wo(r, i), $("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, $("invalid", r);
              break;
            case "textarea":
              Ko(r, i), $("invalid", r);
          }
          ui(n, i), l = null;
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
              ur(r), Qo(r, i, !0);
              break;
            case "textarea":
              ur(r), Yo(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Hr);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = gs(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Ve] = t, e[Qn] = r, Va(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = si(n, r), n) {
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
                Wo(e, r), l = ni(e, r), $("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = Q({}, r, { value: void 0 }), $("invalid", e);
                break;
              case "textarea":
                Ko(e, r), l = ii(e, r), $("invalid", e);
                break;
              default:
                l = r;
            }
            ui(n, l), u = l;
            for (i in u) if (u.hasOwnProperty(i)) {
              var a = u[i];
              i === "style" ? ws(e, a) : i === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && ys(e, a)) : i === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && In(e, a) : typeof a == "number" && In(e, "" + a) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (Mn.hasOwnProperty(i) ? a != null && i === "onScroll" && $("scroll", e) : a != null && Gi(e, i, a, o));
            }
            switch (n) {
              case "input":
                ur(e), Qo(e, r, !1);
                break;
              case "textarea":
                ur(e), Yo(e);
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
                typeof l.onClick == "function" && (e.onclick = Hr);
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
      if (e && t.stateNode != null) Ha(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(y(166));
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
        if (V && xe !== null && t.mode & 1 && !(t.flags & 128)) ua(), on(), t.flags |= 98560, i = !1;
        else if (i = vr(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!i) throw Error(y(318));
            if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(y(317));
            i[Ve] = t;
          } else on(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          ie(t), i = !1;
        } else Oe !== null && (Bi(Oe), Oe = null), i = !0;
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || H.current & 1 ? J === 0 && (J = 3) : Do())), t.updateQueue !== null && (t.flags |= 4), ie(t), null);
    case 4:
      return sn(), Oi(e, t), e === null && Hn(t.stateNode.containerInfo), ie(t), null;
    case 10:
      return ho(t.type._context), ie(t), null;
    case 17:
      return he(t.type) && Wr(), ie(t), null;
    case 19:
      if (A(H), i = t.memoizedState, i === null) return ie(t), null;
      if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wn(i, !1);
      else {
        if (J !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = Jr(e), o !== null) {
            for (t.flags |= 128, wn(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return F(H, H.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        i.tail !== null && X() > cn && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = Jr(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wn(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !V) return ie(t), null;
        } else 2 * X() - i.renderingStartTime > cn && n !== 1073741824 && (t.flags |= 128, r = !0, wn(i, !1), t.lanes = 4194304);
        i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
      }
      return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = X(), t.sibling = null, n = H.current, F(H, r ? n & 1 | 2 : n & 1), t) : (ie(t), null);
    case 22:
    case 23:
      return Lo(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? ye & 1073741824 && (ie(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ie(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(y(156, t.tag));
}
function md(e, t) {
  switch (co(t), t.tag) {
    case 1:
      return he(t.type) && Wr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return sn(), A(me), A(ue), wo(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return xo(t), null;
    case 13:
      if (A(H), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(y(340));
        on();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return A(H), null;
    case 4:
      return sn(), null;
    case 10:
      return ho(t.type._context), null;
    case 22:
    case 23:
      return Lo(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var xr = !1, oe = !1, hd = typeof WeakSet == "function" ? WeakSet : Set, E = null;
function Gt(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    K(e, t, r);
  }
  else n.current = null;
}
function Mi(e, t, n) {
  try {
    n();
  } catch (r) {
    K(e, t, r);
  }
}
var Iu = !1;
function vd(e, t) {
  if (yi = Ar, e = Xs(), so(e)) {
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
        var o = 0, u = -1, a = -1, c = 0, v = 0, h = e, m = null;
        t: for (; ; ) {
          for (var x; h !== n || l !== 0 && h.nodeType !== 3 || (u = o + l), h !== i || r !== 0 && h.nodeType !== 3 || (a = o + r), h.nodeType === 3 && (o += h.nodeValue.length), (x = h.firstChild) !== null; )
            m = h, h = x;
          for (; ; ) {
            if (h === e) break t;
            if (m === n && ++c === l && (u = o), m === i && ++v === r && (a = o), (x = h.nextSibling) !== null) break;
            h = m, m = h.parentNode;
          }
          h = x;
        }
        n = u === -1 || a === -1 ? null : { start: u, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (xi = { focusedElem: e, selectionRange: n }, Ar = !1, E = t; E !== null; ) if (t = E, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, E = e;
  else for (; E !== null; ) {
    t = E;
    try {
      var w = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (w !== null) {
            var k = w.memoizedProps, O = w.memoizedState, f = t.stateNode, s = f.getSnapshotBeforeUpdate(t.elementType === t.type ? k : De(t.type, k), O);
            f.__reactInternalSnapshotBeforeUpdate = s;
          }
          break;
        case 3:
          var d = t.stateNode.containerInfo;
          d.nodeType === 1 ? d.textContent = "" : d.nodeType === 9 && d.documentElement && d.removeChild(d.documentElement);
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
      K(t, t.return, g);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, E = e;
      break;
    }
    E = t.return;
  }
  return w = Iu, Iu = !1, w;
}
function Dn(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        l.destroy = void 0, i !== void 0 && Mi(t, n, i);
      }
      l = l.next;
    } while (l !== r);
  }
}
function pl(e, t) {
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
function Ii(e) {
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
function Wa(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Wa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ve], delete t[Qn], delete t[Si], delete t[qf], delete t[bf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Qa(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Fu(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Qa(e.return)) return null;
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
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Hr));
  else if (r !== 4 && (e = e.child, e !== null)) for (Fi(e, t, n), e = e.sibling; e !== null; ) Fi(e, t, n), e = e.sibling;
}
function Ui(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Ui(e, t, n), e = e.sibling; e !== null; ) Ui(e, t, n), e = e.sibling;
}
var te = null, Re = !1;
function nt(e, t, n) {
  for (n = n.child; n !== null; ) Ka(e, t, n), n = n.sibling;
}
function Ka(e, t, n) {
  if (Be && typeof Be.onCommitFiberUnmount == "function") try {
    Be.onCommitFiberUnmount(il, n);
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
      te !== null && (Re ? (e = te, n = n.stateNode, e.nodeType === 8 ? Al(e.parentNode, n) : e.nodeType === 1 && Al(e, n), An(e)) : Al(te, n.stateNode));
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
          i = i.tag, o !== void 0 && (i & 2 || i & 4) && Mi(n, t, o), l = l.next;
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
function Uu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new hd()), t.forEach(function(r) {
      var l = Cd.bind(null, e, r);
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
      if (te === null) throw Error(y(160));
      Ka(i, o, l), te = null, Re = !1;
      var a = l.alternate;
      a !== null && (a.return = null), l.return = null;
    } catch (c) {
      K(l, t, c);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ya(t, e), t = t.sibling;
}
function Ya(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Le(t, e), $e(e), r & 4) {
        try {
          Dn(3, e, e.return), pl(3, e);
        } catch (k) {
          K(e, e.return, k);
        }
        try {
          Dn(5, e, e.return);
        } catch (k) {
          K(e, e.return, k);
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
        } catch (k) {
          K(e, e.return, k);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, a = e.updateQueue;
        if (e.updateQueue = null, a !== null) try {
          u === "input" && i.type === "radio" && i.name != null && hs(l, i), si(u, o);
          var c = si(u, i);
          for (o = 0; o < a.length; o += 2) {
            var v = a[o], h = a[o + 1];
            v === "style" ? ws(l, h) : v === "dangerouslySetInnerHTML" ? ys(l, h) : v === "children" ? In(l, h) : Gi(l, v, h, c);
          }
          switch (u) {
            case "input":
              ri(l, i);
              break;
            case "textarea":
              vs(l, i);
              break;
            case "select":
              var m = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!i.multiple;
              var x = i.value;
              x != null ? Jt(l, !!i.multiple, x, !1) : m !== !!i.multiple && (i.defaultValue != null ? Jt(
                l,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : Jt(l, !!i.multiple, i.multiple ? [] : "", !1));
          }
          l[Qn] = i;
        } catch (k) {
          K(e, e.return, k);
        }
      }
      break;
    case 6:
      if (Le(t, e), $e(e), r & 4) {
        if (e.stateNode === null) throw Error(y(162));
        l = e.stateNode, i = e.memoizedProps;
        try {
          l.nodeValue = i;
        } catch (k) {
          K(e, e.return, k);
        }
      }
      break;
    case 3:
      if (Le(t, e), $e(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        An(t.containerInfo);
      } catch (k) {
        K(e, e.return, k);
      }
      break;
    case 4:
      Le(t, e), $e(e);
      break;
    case 13:
      Le(t, e), $e(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Po = X())), r & 4 && Uu(e);
      break;
    case 22:
      if (v = n !== null && n.memoizedState !== null, e.mode & 1 ? (oe = (c = oe) || v, Le(t, e), oe = c) : Le(t, e), $e(e), r & 8192) {
        if (c = e.memoizedState !== null, (e.stateNode.isHidden = c) && !v && e.mode & 1) for (E = e, v = e.child; v !== null; ) {
          for (h = E = v; E !== null; ) {
            switch (m = E, x = m.child, m.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Dn(4, m, m.return);
                break;
              case 1:
                Gt(m, m.return);
                var w = m.stateNode;
                if (typeof w.componentWillUnmount == "function") {
                  r = m, n = m.return;
                  try {
                    t = r, w.props = t.memoizedProps, w.state = t.memoizedState, w.componentWillUnmount();
                  } catch (k) {
                    K(r, n, k);
                  }
                }
                break;
              case 5:
                Gt(m, m.return);
                break;
              case 22:
                if (m.memoizedState !== null) {
                  Au(h);
                  continue;
                }
            }
            x !== null ? (x.return = m, E = x) : Au(h);
          }
          v = v.sibling;
        }
        e: for (v = null, h = e; ; ) {
          if (h.tag === 5) {
            if (v === null) {
              v = h;
              try {
                l = h.stateNode, c ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = h.stateNode, a = h.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null, u.style.display = xs("display", o));
              } catch (k) {
                K(e, e.return, k);
              }
            }
          } else if (h.tag === 6) {
            if (v === null) try {
              h.stateNode.nodeValue = c ? "" : h.memoizedProps;
            } catch (k) {
              K(e, e.return, k);
            }
          } else if ((h.tag !== 22 && h.tag !== 23 || h.memoizedState === null || h === e) && h.child !== null) {
            h.child.return = h, h = h.child;
            continue;
          }
          if (h === e) break e;
          for (; h.sibling === null; ) {
            if (h.return === null || h.return === e) break e;
            v === h && (v = null), h = h.return;
          }
          v === h && (v = null), h.sibling.return = h.return, h = h.sibling;
        }
      }
      break;
    case 19:
      Le(t, e), $e(e), r & 4 && Uu(e);
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
          if (Qa(n)) {
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
          r.flags & 32 && (In(l, ""), r.flags &= -33);
          var i = Fu(e);
          Ui(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = Fu(e);
          Fi(e, u, o);
          break;
        default:
          throw Error(y(161));
      }
    } catch (a) {
      K(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function gd(e, t, n) {
  E = e, Xa(e);
}
function Xa(e, t, n) {
  for (var r = (e.mode & 1) !== 0; E !== null; ) {
    var l = E, i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || xr;
      if (!o) {
        var u = l.alternate, a = u !== null && u.memoizedState !== null || oe;
        u = xr;
        var c = oe;
        if (xr = o, (oe = a) && !c) for (E = l; E !== null; ) o = E, a = o.child, o.tag === 22 && o.memoizedState !== null ? Vu(l) : a !== null ? (a.return = o, E = a) : Vu(l);
        for (; i !== null; ) E = i, Xa(i), i = i.sibling;
        E = l, xr = u, oe = c;
      }
      $u(e);
    } else l.subtreeFlags & 8772 && i !== null ? (i.return = l, E = i) : $u(e);
  }
}
function $u(e) {
  for (; E !== null; ) {
    var t = E;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            oe || pl(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !oe) if (n === null) r.componentDidMount();
            else {
              var l = t.elementType === t.type ? n.memoizedProps : De(t.type, n.memoizedProps);
              r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var i = t.updateQueue;
            i !== null && Eu(t, i, r);
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
              Eu(t, o, n);
            }
            break;
          case 5:
            var u = t.stateNode;
            if (n === null && t.flags & 4) {
              n = u;
              var a = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && n.focus();
                  break;
                case "img":
                  a.src && (n.src = a.src);
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
              var c = t.alternate;
              if (c !== null) {
                var v = c.memoizedState;
                if (v !== null) {
                  var h = v.dehydrated;
                  h !== null && An(h);
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
        oe || t.flags & 512 && Ii(t);
      } catch (m) {
        K(t, t.return, m);
      }
    }
    if (t === e) {
      E = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, E = n;
      break;
    }
    E = t.return;
  }
}
function Au(e) {
  for (; E !== null; ) {
    var t = E;
    if (t === e) {
      E = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, E = n;
      break;
    }
    E = t.return;
  }
}
function Vu(e) {
  for (; E !== null; ) {
    var t = E;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            pl(4, t);
          } catch (a) {
            K(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              K(t, l, a);
            }
          }
          var i = t.return;
          try {
            Ii(t);
          } catch (a) {
            K(t, i, a);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Ii(t);
          } catch (a) {
            K(t, o, a);
          }
      }
    } catch (a) {
      K(t, t.return, a);
    }
    if (t === e) {
      E = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, E = u;
      break;
    }
    E = t.return;
  }
}
var yd = Math.ceil, el = tt.ReactCurrentDispatcher, jo = tt.ReactCurrentOwner, ze = tt.ReactCurrentBatchConfig, R = 0, ee = null, G = null, ne = 0, ye = 0, Zt = wt(0), J = 0, Jn = null, Ot = 0, ml = 0, zo = 0, Rn = null, de = null, Po = 0, cn = 1 / 0, Ke = null, tl = !1, $i = null, mt = null, wr = !1, st = null, nl = 0, On = 0, Ai = null, Dr = -1, Rr = 0;
function ae() {
  return R & 6 ? X() : Dr !== -1 ? Dr : Dr = X();
}
function ht(e) {
  return e.mode & 1 ? R & 2 && ne !== 0 ? ne & -ne : td.transition !== null ? (Rr === 0 && (Rr = Ds()), Rr) : (e = M, e !== 0 || (e = window.event, e = e === void 0 ? 16 : $s(e.type)), e) : 1;
}
function Ie(e, t, n, r) {
  if (50 < On) throw On = 0, Ai = null, Error(y(185));
  bn(e, n, r), (!(R & 2) || e !== ee) && (e === ee && (!(R & 2) && (ml |= n), J === 4 && ot(e, ne)), ve(e, r), n === 1 && R === 0 && !(t.mode & 1) && (cn = X() + 500, cl && kt()));
}
function ve(e, t) {
  var n = e.callbackNode;
  ef(e, t);
  var r = $r(e, e === ee ? ne : 0);
  if (r === 0) n !== null && Zo(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && Zo(n), t === 1) e.tag === 0 ? ed(Bu.bind(null, e)) : la(Bu.bind(null, e)), Zf(function() {
      !(R & 6) && kt();
    }), n = null;
    else {
      switch (Rs(r)) {
        case 1:
          n = eo;
          break;
        case 4:
          n = Ts;
          break;
        case 16:
          n = Ur;
          break;
        case 536870912:
          n = Ls;
          break;
        default:
          n = Ur;
      }
      n = nc(n, Ga.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function Ga(e, t) {
  if (Dr = -1, Rr = 0, R & 6) throw Error(y(327));
  var n = e.callbackNode;
  if (nn() && e.callbackNode !== n) return null;
  var r = $r(e, e === ee ? ne : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = rl(e, r);
  else {
    t = r;
    var l = R;
    R |= 2;
    var i = Ja();
    (ee !== e || ne !== t) && (Ke = null, cn = X() + 500, Pt(e, t));
    do
      try {
        kd();
        break;
      } catch (u) {
        Za(e, u);
      }
    while (!0);
    mo(), el.current = i, R = l, G !== null ? t = 0 : (ee = null, ne = 0, t = J);
  }
  if (t !== 0) {
    if (t === 2 && (l = pi(e), l !== 0 && (r = l, t = Vi(e, l))), t === 1) throw n = Jn, Pt(e, 0), ot(e, r), ve(e, X()), n;
    if (t === 6) ot(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !xd(l) && (t = rl(e, r), t === 2 && (i = pi(e), i !== 0 && (r = i, t = Vi(e, i))), t === 1)) throw n = Jn, Pt(e, 0), ot(e, r), ve(e, X()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(y(345));
        case 2:
          Ct(e, de, Ke);
          break;
        case 3:
          if (ot(e, r), (r & 130023424) === r && (t = Po + 500 - X(), 10 < t)) {
            if ($r(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              ae(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = ki(Ct.bind(null, e, de, Ke), t);
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
          if (r = l, r = X() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * yd(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = ki(Ct.bind(null, e, de, Ke), r);
            break;
          }
          Ct(e, de, Ke);
          break;
        case 5:
          Ct(e, de, Ke);
          break;
        default:
          throw Error(y(329));
      }
    }
  }
  return ve(e, X()), e.callbackNode === n ? Ga.bind(null, e) : null;
}
function Vi(e, t) {
  var n = Rn;
  return e.current.memoizedState.isDehydrated && (Pt(e, t).flags |= 256), e = rl(e, t), e !== 2 && (t = de, de = n, t !== null && Bi(t)), e;
}
function Bi(e) {
  de === null ? de = e : de.push.apply(de, e);
}
function xd(e) {
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
  for (t &= ~zo, t &= ~ml, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Me(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function Bu(e) {
  if (R & 6) throw Error(y(327));
  nn();
  var t = $r(e, 0);
  if (!(t & 1)) return ve(e, X()), null;
  var n = rl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = pi(e);
    r !== 0 && (t = r, n = Vi(e, r));
  }
  if (n === 1) throw n = Jn, Pt(e, 0), ot(e, t), ve(e, X()), n;
  if (n === 6) throw Error(y(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Ct(e, de, Ke), ve(e, X()), null;
}
function To(e, t) {
  var n = R;
  R |= 1;
  try {
    return e(t);
  } finally {
    R = n, R === 0 && (cn = X() + 500, cl && kt());
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
function Lo() {
  ye = Zt.current, A(Zt);
}
function Pt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, Gf(n)), G !== null) for (n = G.return; n !== null; ) {
    var r = n;
    switch (co(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Wr();
        break;
      case 3:
        sn(), A(me), A(ue), wo();
        break;
      case 5:
        xo(r);
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
        ho(r.type._context);
        break;
      case 22:
      case 23:
        Lo();
    }
    n = n.return;
  }
  if (ee = e, G = e = vt(e.current, null), ne = ye = t, J = 0, Jn = null, zo = ml = Ot = 0, de = Rn = null, jt !== null) {
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
function Za(e, t) {
  do {
    var n = G;
    try {
      if (mo(), Pr.current = br, qr) {
        for (var r = W.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        qr = !1;
      }
      if (Rt = 0, b = Z = W = null, Ln = !1, Xn = 0, jo.current = null, n === null || n.return === null) {
        J = 1, Jn = t, G = null;
        break;
      }
      e: {
        var i = e, o = n.return, u = n, a = t;
        if (t = ne, u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var c = a, v = u, h = v.tag;
          if (!(v.mode & 1) && (h === 0 || h === 11 || h === 15)) {
            var m = v.alternate;
            m ? (v.updateQueue = m.updateQueue, v.memoizedState = m.memoizedState, v.lanes = m.lanes) : (v.updateQueue = null, v.memoizedState = null);
          }
          var x = Pu(o);
          if (x !== null) {
            x.flags &= -257, Tu(x, o, u, i, t), x.mode & 1 && zu(i, c, t), t = x, a = c;
            var w = t.updateQueue;
            if (w === null) {
              var k = /* @__PURE__ */ new Set();
              k.add(a), t.updateQueue = k;
            } else w.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              zu(i, c, t), Do();
              break e;
            }
            a = Error(y(426));
          }
        } else if (V && u.mode & 1) {
          var O = Pu(o);
          if (O !== null) {
            !(O.flags & 65536) && (O.flags |= 256), Tu(O, o, u, i, t), fo(an(a, u));
            break e;
          }
        }
        i = a = an(a, u), J !== 4 && (J = 2), Rn === null ? Rn = [i] : Rn.push(i), i = o;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, t &= -t, i.lanes |= t;
              var f = Ra(i, a, t);
              Su(i, f);
              break e;
            case 1:
              u = a;
              var s = i.type, d = i.stateNode;
              if (!(i.flags & 128) && (typeof s.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (mt === null || !mt.has(d)))) {
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var g = Oa(i, u, t);
                Su(i, g);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      ba(n);
    } catch (S) {
      t = S, G === n && n !== null && (G = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function Ja() {
  var e = el.current;
  return el.current = br, e === null ? br : e;
}
function Do() {
  (J === 0 || J === 3 || J === 2) && (J = 4), ee === null || !(Ot & 268435455) && !(ml & 268435455) || ot(ee, ne);
}
function rl(e, t) {
  var n = R;
  R |= 2;
  var r = Ja();
  (ee !== e || ne !== t) && (Ke = null, Pt(e, t));
  do
    try {
      wd();
      break;
    } catch (l) {
      Za(e, l);
    }
  while (!0);
  if (mo(), R = n, el.current = r, G !== null) throw Error(y(261));
  return ee = null, ne = 0, J;
}
function wd() {
  for (; G !== null; ) qa(G);
}
function kd() {
  for (; G !== null && !Qc(); ) qa(G);
}
function qa(e) {
  var t = tc(e.alternate, e, ye);
  e.memoizedProps = e.pendingProps, t === null ? ba(e) : G = t, jo.current = null;
}
function ba(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = md(n, t), n !== null) {
        n.flags &= 32767, G = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        J = 6, G = null;
        return;
      }
    } else if (n = pd(n, t, ye), n !== null) {
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
    ze.transition = null, M = 1, Sd(e, t, n, r);
  } finally {
    ze.transition = l, M = r;
  }
  return null;
}
function Sd(e, t, n, r) {
  do
    nn();
  while (st !== null);
  if (R & 6) throw Error(y(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(y(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (tf(e, i), e === ee && (G = ee = null, ne = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || wr || (wr = !0, nc(Ur, function() {
    return nn(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = ze.transition, ze.transition = null;
    var o = M;
    M = 1;
    var u = R;
    R |= 4, jo.current = null, vd(e, n), Ya(n, e), Bf(xi), Ar = !!yi, xi = yi = null, e.current = n, gd(n), Kc(), R = u, M = o, ze.transition = i;
  } else e.current = n;
  if (wr && (wr = !1, st = e, nl = l), i = e.pendingLanes, i === 0 && (mt = null), Gc(n.stateNode), ve(e, X()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if (tl) throw tl = !1, e = $i, $i = null, e;
  return nl & 1 && e.tag !== 0 && nn(), i = e.pendingLanes, i & 1 ? e === Ai ? On++ : (On = 0, Ai = e) : On = 0, kt(), null;
}
function nn() {
  if (st !== null) {
    var e = Rs(nl), t = ze.transition, n = M;
    try {
      if (ze.transition = null, M = 16 > e ? 16 : e, st === null) var r = !1;
      else {
        if (e = st, st = null, nl = 0, R & 6) throw Error(y(331));
        var l = R;
        for (R |= 4, E = e.current; E !== null; ) {
          var i = E, o = i.child;
          if (E.flags & 16) {
            var u = i.deletions;
            if (u !== null) {
              for (var a = 0; a < u.length; a++) {
                var c = u[a];
                for (E = c; E !== null; ) {
                  var v = E;
                  switch (v.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Dn(8, v, i);
                  }
                  var h = v.child;
                  if (h !== null) h.return = v, E = h;
                  else for (; E !== null; ) {
                    v = E;
                    var m = v.sibling, x = v.return;
                    if (Wa(v), v === c) {
                      E = null;
                      break;
                    }
                    if (m !== null) {
                      m.return = x, E = m;
                      break;
                    }
                    E = x;
                  }
                }
              }
              var w = i.alternate;
              if (w !== null) {
                var k = w.child;
                if (k !== null) {
                  w.child = null;
                  do {
                    var O = k.sibling;
                    k.sibling = null, k = O;
                  } while (k !== null);
                }
              }
              E = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) o.return = i, E = o;
          else e: for (; E !== null; ) {
            if (i = E, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                Dn(9, i, i.return);
            }
            var f = i.sibling;
            if (f !== null) {
              f.return = i.return, E = f;
              break e;
            }
            E = i.return;
          }
        }
        var s = e.current;
        for (E = s; E !== null; ) {
          o = E;
          var d = o.child;
          if (o.subtreeFlags & 2064 && d !== null) d.return = o, E = d;
          else e: for (o = s; E !== null; ) {
            if (u = E, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  pl(9, u);
              }
            } catch (S) {
              K(u, u.return, S);
            }
            if (u === o) {
              E = null;
              break e;
            }
            var g = u.sibling;
            if (g !== null) {
              g.return = u.return, E = g;
              break e;
            }
            E = u.return;
          }
        }
        if (R = l, kt(), Be && typeof Be.onPostCommitFiberRoot == "function") try {
          Be.onPostCommitFiberRoot(il, e);
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
function Hu(e, t, n) {
  t = an(n, t), t = Ra(e, t, 1), e = pt(e, t, 1), t = ae(), e !== null && (bn(e, 1, t), ve(e, t));
}
function K(e, t, n) {
  if (e.tag === 3) Hu(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Hu(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (mt === null || !mt.has(r))) {
        e = an(n, e), e = Oa(t, e, 1), t = pt(t, e, 1), e = ae(), t !== null && (bn(t, 1, e), ve(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Ed(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = ae(), e.pingedLanes |= e.suspendedLanes & n, ee === e && (ne & n) === n && (J === 4 || J === 3 && (ne & 130023424) === ne && 500 > X() - Po ? Pt(e, 0) : zo |= n), ve(e, t);
}
function ec(e, t) {
  t === 0 && (e.mode & 1 ? (t = cr, cr <<= 1, !(cr & 130023424) && (cr = 4194304)) : t = 1);
  var n = ae();
  e = be(e, t), e !== null && (bn(e, t, n), ve(e, n));
}
function _d(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), ec(e, n);
}
function Cd(e, t) {
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
  r !== null && r.delete(t), ec(e, n);
}
var tc;
tc = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || me.current) pe = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return pe = !1, dd(e, t, n);
    pe = !!(e.flags & 131072);
  }
  else pe = !1, V && t.flags & 1048576 && ia(t, Yr, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      Lr(e, t), e = t.pendingProps;
      var l = ln(t, ue.current);
      tn(t, n), l = So(null, t, r, e, l, n);
      var i = Eo();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, he(r) ? (i = !0, Qr(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, go(t), l.updater = dl, t.stateNode = l, l._reactInternals = t, zi(t, r, e, n), t = Li(null, t, r, !0, i, n)) : (t.tag = 0, V && i && ao(t), se(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (Lr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = jd(r), e = De(r, e), l) {
          case 0:
            t = Ti(null, t, r, e, n);
            break e;
          case 1:
            t = Ru(null, t, r, e, n);
            break e;
          case 11:
            t = Lu(null, t, r, e, n);
            break e;
          case 14:
            t = Du(null, t, r, De(r.type, e), n);
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
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Ti(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Ru(e, t, r, l, n);
    case 3:
      e: {
        if (Ua(t), e === null) throw Error(y(387));
        r = t.pendingProps, i = t.memoizedState, l = i.element, fa(e, t), Zr(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
          l = an(Error(y(423)), t), t = Ou(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = an(Error(y(424)), t), t = Ou(e, t, r, n, l);
          break e;
        } else for (xe = dt(t.stateNode.containerInfo.firstChild), we = t, V = !0, Oe = null, n = aa(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
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
      return da(t), e === null && Ci(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, wi(r, l) ? o = null : i !== null && wi(r, i) && (t.flags |= 32), Fa(e, t), se(e, t, o, n), t.child;
    case 6:
      return e === null && Ci(t), null;
    case 13:
      return $a(e, t, n);
    case 4:
      return yo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = un(t, null, r, n) : se(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Lu(e, t, r, l, n);
    case 7:
      return se(e, t, t.pendingProps, n), t.child;
    case 8:
      return se(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return se(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, F(Xr, r._currentValue), r._currentValue = o, i !== null) if (Fe(i.value, o)) {
          if (i.children === l.children && !me.current) {
            t = et(e, t, n);
            break e;
          }
        } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
          var u = i.dependencies;
          if (u !== null) {
            o = i.child;
            for (var a = u.firstContext; a !== null; ) {
              if (a.context === r) {
                if (i.tag === 1) {
                  a = Ze(-1, n & -n), a.tag = 2;
                  var c = i.updateQueue;
                  if (c !== null) {
                    c = c.shared;
                    var v = c.pending;
                    v === null ? a.next = a : (a.next = v.next, v.next = a), c.pending = a;
                  }
                }
                i.lanes |= n, a = i.alternate, a !== null && (a.lanes |= n), Ni(
                  i.return,
                  n,
                  t
                ), u.lanes |= n;
                break;
              }
              a = a.next;
            }
          } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
          else if (i.tag === 18) {
            if (o = i.return, o === null) throw Error(y(341));
            o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Ni(o, n, t), o = i.sibling;
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
      return r = t.type, l = De(r, t.pendingProps), l = De(r.type, l), Du(e, t, r, l, n);
    case 15:
      return Ma(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : De(r, l), Lr(e, t), t.tag = 1, he(r) ? (e = !0, Qr(t)) : e = !1, tn(t, n), Da(t, r, l), zi(t, r, l, n), Li(null, t, r, !0, e, n);
    case 19:
      return Aa(e, t, n);
    case 22:
      return Ia(e, t, n);
  }
  throw Error(y(156, t.tag));
};
function nc(e, t) {
  return Ps(e, t);
}
function Nd(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function je(e, t, n, r) {
  return new Nd(e, t, n, r);
}
function Ro(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function jd(e) {
  if (typeof e == "function") return Ro(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === Ji) return 11;
    if (e === qi) return 14;
  }
  return 2;
}
function vt(e, t) {
  var n = e.alternate;
  return n === null ? (n = je(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Or(e, t, n, r, l, i) {
  var o = 2;
  if (r = e, typeof e == "function") Ro(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case At:
      return Tt(n.children, l, i, t);
    case Zi:
      o = 8, l |= 8;
      break;
    case ql:
      return e = je(12, n, t, l | 2), e.elementType = ql, e.lanes = i, e;
    case bl:
      return e = je(13, n, t, l), e.elementType = bl, e.lanes = i, e;
    case ei:
      return e = je(19, n, t, l), e.elementType = ei, e.lanes = i, e;
    case ds:
      return hl(n, l, i, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case cs:
          o = 10;
          break e;
        case fs:
          o = 9;
          break e;
        case Ji:
          o = 11;
          break e;
        case qi:
          o = 14;
          break e;
        case rt:
          o = 16, r = null;
          break e;
      }
      throw Error(y(130, e == null ? e : typeof e, ""));
  }
  return t = je(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
}
function Tt(e, t, n, r) {
  return e = je(7, e, r, t), e.lanes = n, e;
}
function hl(e, t, n, r) {
  return e = je(22, e, r, t), e.elementType = ds, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function Xl(e, t, n) {
  return e = je(6, e, null, t), e.lanes = n, e;
}
function Gl(e, t, n) {
  return t = je(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function zd(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Pl(0), this.expirationTimes = Pl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Pl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function Oo(e, t, n, r, l, i, o, u, a) {
  return e = new zd(e, t, n, u, a), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = je(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, go(i), e;
}
function Pd(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: $t, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function rc(e) {
  if (!e) return yt;
  e = e._reactInternals;
  e: {
    if (Ft(e) !== e || e.tag !== 1) throw Error(y(170));
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
    throw Error(y(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (he(n)) return ra(e, n, t);
  }
  return t;
}
function lc(e, t, n, r, l, i, o, u, a) {
  return e = Oo(n, r, !0, e, l, i, o, u, a), e.context = rc(null), n = e.current, r = ae(), l = ht(n), i = Ze(r, l), i.callback = t ?? null, pt(n, i, l), e.current.lanes = l, bn(e, l, r), ve(e, r), e;
}
function vl(e, t, n, r) {
  var l = t.current, i = ae(), o = ht(l);
  return n = rc(n), t.context === null ? t.context = n : t.pendingContext = n, t = Ze(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = pt(l, t, o), e !== null && (Ie(e, l, o, i), zr(e, l, o)), o;
}
function ll(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Wu(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Mo(e, t) {
  Wu(e, t), (e = e.alternate) && Wu(e, t);
}
function Td() {
  return null;
}
var ic = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function Io(e) {
  this._internalRoot = e;
}
gl.prototype.render = Io.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(y(409));
  vl(e, t, null, null);
};
gl.prototype.unmount = Io.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Mt(function() {
      vl(null, e, null, null);
    }), t[qe] = null;
  }
};
function gl(e) {
  this._internalRoot = e;
}
gl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = Is();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < it.length && t !== 0 && t < it[n].priority; n++) ;
    it.splice(n, 0, e), n === 0 && Us(e);
  }
};
function Fo(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function yl(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Qu() {
}
function Ld(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var c = ll(o);
        i.call(c);
      };
    }
    var o = lc(t, r, e, 0, null, !1, !1, "", Qu);
    return e._reactRootContainer = o, e[qe] = o.current, Hn(e.nodeType === 8 ? e.parentNode : e), Mt(), o;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var c = ll(a);
      u.call(c);
    };
  }
  var a = Oo(e, 0, !1, null, null, !1, !1, "", Qu);
  return e._reactRootContainer = a, e[qe] = a.current, Hn(e.nodeType === 8 ? e.parentNode : e), Mt(function() {
    vl(t, a, n, r);
  }), a;
}
function xl(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var u = l;
      l = function() {
        var a = ll(o);
        u.call(a);
      };
    }
    vl(t, o, e, l);
  } else o = Ld(n, t, e, l, r);
  return ll(o);
}
Os = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = _n(t.pendingLanes);
        n !== 0 && (to(t, n | 1), ve(t, X()), !(R & 6) && (cn = X() + 500, kt()));
      }
      break;
    case 13:
      Mt(function() {
        var r = be(e, 1);
        if (r !== null) {
          var l = ae();
          Ie(r, e, 1, l);
        }
      }), Mo(e, 1);
  }
};
no = function(e) {
  if (e.tag === 13) {
    var t = be(e, 134217728);
    if (t !== null) {
      var n = ae();
      Ie(t, e, 134217728, n);
    }
    Mo(e, 134217728);
  }
};
Ms = function(e) {
  if (e.tag === 13) {
    var t = ht(e), n = be(e, t);
    if (n !== null) {
      var r = ae();
      Ie(n, e, t, r);
    }
    Mo(e, t);
  }
};
Is = function() {
  return M;
};
Fs = function(e, t) {
  var n = M;
  try {
    return M = e, t();
  } finally {
    M = n;
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
            var l = al(r);
            if (!l) throw Error(y(90));
            ms(r), ri(r, l);
          }
        }
      }
      break;
    case "textarea":
      vs(e, n);
      break;
    case "select":
      t = n.value, t != null && Jt(e, !!n.multiple, t, !1);
  }
};
Es = To;
_s = Mt;
var Dd = { usingClientEntryPoint: !1, Events: [tr, Wt, al, ks, Ss, To] }, kn = { findFiberByHostInstance: Nt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Rd = { bundleType: kn.bundleType, version: kn.version, rendererPackageName: kn.rendererPackageName, rendererConfig: kn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: tt.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = js(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: kn.findFiberByHostInstance || Td, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var kr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!kr.isDisabled && kr.supportsFiber) try {
    il = kr.inject(Rd), Be = kr;
  } catch {
  }
}
Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dd;
Se.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Fo(t)) throw Error(y(200));
  return Pd(e, t, null, n);
};
Se.createRoot = function(e, t) {
  if (!Fo(e)) throw Error(y(299));
  var n = !1, r = "", l = ic;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Oo(e, 1, !1, null, null, n, !1, r, l), e[qe] = t.current, Hn(e.nodeType === 8 ? e.parentNode : e), new Io(t);
};
Se.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(y(188)) : (e = Object.keys(e).join(","), Error(y(268, e)));
  return e = js(t), e = e === null ? null : e.stateNode, e;
};
Se.flushSync = function(e) {
  return Mt(e);
};
Se.hydrate = function(e, t, n) {
  if (!yl(t)) throw Error(y(200));
  return xl(null, e, t, !0, n);
};
Se.hydrateRoot = function(e, t, n) {
  if (!Fo(e)) throw Error(y(405));
  var r = n != null && n.hydratedSources || null, l = !1, i = "", o = ic;
  if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = lc(t, null, e, 1, n ?? null, l, !1, i, o), e[qe] = t.current, Hn(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
    n,
    l
  );
  return new gl(t);
};
Se.render = function(e, t, n) {
  if (!yl(t)) throw Error(y(200));
  return xl(null, e, t, !1, n);
};
Se.unmountComponentAtNode = function(e) {
  if (!yl(e)) throw Error(y(40));
  return e._reactRootContainer ? (Mt(function() {
    xl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[qe] = null;
    });
  }), !0) : !1;
};
Se.unstable_batchedUpdates = To;
Se.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!yl(n)) throw Error(y(200));
  if (e == null || e._reactInternals === void 0) throw Error(y(38));
  return xl(e, t, n, !1, r);
};
Se.version = "18.3.1-next-f1338f8080-20240426";
function oc() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(oc);
    } catch (e) {
      console.error(e);
    }
}
oc(), os.exports = Se;
var Od = os.exports, uc, Ku = Od;
uc = Ku.createRoot, Ku.hydrateRoot;
var sc = { exports: {} }, wl = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Md = D, Id = Symbol.for("react.element"), Fd = Symbol.for("react.fragment"), Ud = Object.prototype.hasOwnProperty, $d = Md.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ad = { key: !0, ref: !0, __self: !0, __source: !0 };
function ac(e, t, n) {
  var r, l = {}, i = null, o = null;
  n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Ud.call(t, r) && !Ad.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
  return { $$typeof: Id, type: e, key: i, ref: o, props: l, _owner: $d.current };
}
wl.Fragment = Fd;
wl.jsx = ac;
wl.jsxs = ac;
sc.exports = wl;
var p = sc.exports;
const Vd = "title_classifier/v3";
function Yu(e) {
  const t = (n, r = {}) => e.callWS({ type: `${Vd}/${n}`, ...r });
  return {
    listSources: () => t("list_sources"),
    listEntries: (n = {}) => t("list_entries", n),
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
function Bd(e, t, n) {
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
function Hd(e, t, n) {
  return e.map((r) => Bd(r, t[r.id], n[r.id]));
}
function Wd(e, t, n) {
  return { ...e, [t]: { enum: n } };
}
function Xu(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function Gu(e, t, n) {
  return { ...e, [t]: n };
}
function Zl(e, t) {
  if (!(t in e)) return e;
  const n = { ...e };
  return delete n[t], n;
}
function Qd(e, t, n) {
  return e.map((r) => r.id === t ? { ...r, enum: n } : r);
}
function Kd(e, t, n) {
  const r = t[n];
  if (r === void 0) return !1;
  const l = e.find((i) => i.id === n);
  return l === void 0 || r.enum !== l.enum;
}
const Yd = 5e3;
function Xd(e) {
  const [t, n] = D.useState([]), [r, l] = D.useState([]), [i, o] = D.useState({}), [u, a] = D.useState({}), [c, v] = D.useState(!1), [h, m] = D.useState(null), [x, w] = D.useState(null), [k, O] = D.useState(!1), f = D.useRef(e);
  f.current = e;
  const s = D.useRef(i);
  s.current = i;
  const d = D.useRef(!1), g = D.useRef(!1), S = D.useCallback(async () => {
    const I = f.current;
    if (!(!I || d.current)) {
      d.current = !0, O(!0);
      try {
        const B = Yu(I), [_e, Ue] = await Promise.all([
          B.listSources(),
          B.listEntries({ include_hidden: !0, limit: 2e4 })
        ]);
        n(_e), l(Ue), v(!0), m(null), w((/* @__PURE__ */ new Date()).toLocaleTimeString());
      } catch (B) {
        v(!1), m(B instanceof Error ? B.message : String(B));
      } finally {
        O(!1), d.current = !1;
      }
    }
  }, []);
  D.useEffect(() => {
    S();
    const I = window.setInterval(S, Yd);
    return () => window.clearInterval(I);
  }, [S]), D.useEffect(() => {
    e && !g.current && (g.current = !0, S());
  }, [e, S]);
  const C = D.useCallback((I, B) => {
    o((_e) => Wd(_e, I, B)), a((_e) => Zl(_e, I));
  }, []), N = D.useCallback((I) => {
    o((B) => Xu(B, I)), a((B) => Zl(B, I));
  }, []), j = D.useCallback(
    async (I) => {
      const B = f.current, _e = s.current[I];
      if (!(!B || _e === void 0)) {
        a((Ue) => Gu(Ue, I, { saving: !0, error: null }));
        try {
          const We = await Yu(B).setEnum(I, _e.enum);
          if (!We || !We.ok) throw new Error("set_enum rejected");
          l((Qe) => Qd(Qe, I, We.enum ?? _e.enum)), o((Qe) => Xu(Qe, I)), a((Qe) => Zl(Qe, I)), S();
        } catch (Ue) {
          a(
            (We) => Gu(We, I, {
              saving: !1,
              error: Ue instanceof Error ? Ue.message : String(Ue)
            })
          );
        }
      }
    },
    [S]
  ), U = D.useMemo(
    () => Hd(r, i, u),
    [r, i, u]
  ), T = D.useCallback(
    (I) => Kd(r, i, I),
    [r, i]
  ), ge = D.useCallback(
    (I) => U.find((B) => B.id === I),
    [U]
  );
  return {
    sources: t,
    entries: r,
    displayEntries: U,
    entryCount: c ? r.length : null,
    connected: c,
    error: h,
    lastSync: x,
    loading: k,
    refresh: S,
    setDraftEnum: C,
    resetDraft: N,
    applyDraft: j,
    isDirty: T,
    getDisplayEntry: ge,
    dirtyCount: Object.keys(i).length
  };
}
const cc = [
  { id: "overview", label: "Übersicht", icon: "▦", desc: "Systemzustand & aktuelles Tagebuch" },
  { id: "inbox", label: "Inbox", icon: "✉", desc: "Unklassifizierte Einträge abarbeiten" },
  { id: "diary", label: "Tagebuch", icon: "⏱", desc: "Verlauf der Sichtungen" },
  { id: "catalog", label: "Katalog", icon: "▤", desc: "Bibliothek & Pflege" },
  { id: "io", label: "Import / Export", icon: "⇅", desc: "v3-JSON, bildfrei" },
  { id: "settings", label: "Einstellungen", icon: "⚙", desc: "Watcher, DB, Theme, Debug" }
];
function Gd({ current: e, onSelect: t }) {
  return /* @__PURE__ */ p.jsxs("aside", { className: "tc-sidebar", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "tc-brand", children: [
      /* @__PURE__ */ p.jsx("div", { className: "logo", children: "TC" }),
      /* @__PURE__ */ p.jsxs("div", { children: [
        /* @__PURE__ */ p.jsx("div", { className: "title", children: "Title Classifier" }),
        /* @__PURE__ */ p.jsx("div", { className: "sub", children: "v3 · Verwaltung" })
      ] })
    ] }),
    /* @__PURE__ */ p.jsx("nav", { className: "tc-nav", children: cc.map((n) => /* @__PURE__ */ p.jsxs(
      "button",
      {
        className: n.id === e ? "active" : "",
        onClick: () => t(n.id),
        title: n.desc,
        children: [
          /* @__PURE__ */ p.jsx("span", { className: "ico", children: n.icon }),
          /* @__PURE__ */ p.jsx("span", { children: n.label })
        ]
      },
      n.id
    )) }),
    /* @__PURE__ */ p.jsx("div", { className: "foot", children: "Title Classifier v3.1 · UX" })
  ] });
}
function Zd(e) {
  e.dispatchEvent(
    new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 })
  );
}
function Jd({ title: e, desc: t, loading: n, onRefresh: r }) {
  const l = D.useRef(null);
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-cmdbar", children: [
    /* @__PURE__ */ p.jsx(
      "button",
      {
        ref: l,
        className: "tc-btn tc-menu-btn",
        title: "Menü",
        onClick: () => l.current && Zd(l.current),
        children: "☰"
      }
    ),
    /* @__PURE__ */ p.jsxs("div", { children: [
      /* @__PURE__ */ p.jsx("h1", { children: e }),
      /* @__PURE__ */ p.jsx("div", { className: "desc", children: t })
    ] }),
    /* @__PURE__ */ p.jsx("div", { className: "spacer" }),
    r ? /* @__PURE__ */ p.jsxs("button", { className: "tc-btn", onClick: r, disabled: n, children: [
      n ? "…" : "↻",
      " Aktualisieren"
    ] }) : null
  ] });
}
function qd({
  connected: e,
  entryCount: t,
  selectedCount: n,
  lastSync: r,
  error: l,
  watcherCount: i
}) {
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-statusbar", children: [
    /* @__PURE__ */ p.jsxs("span", { children: [
      /* @__PURE__ */ p.jsx("span", { className: `dot ${e ? "ok" : "bad"}` }),
      e ? "verbunden" : "getrennt"
    ] }),
    i !== void 0 ? /* @__PURE__ */ p.jsxs("span", { children: [
      "Watcher: ",
      i
    ] }) : null,
    /* @__PURE__ */ p.jsxs("span", { children: [
      "Einträge: ",
      t ?? "—"
    ] }),
    /* @__PURE__ */ p.jsxs("span", { children: [
      "Auswahl: ",
      n
    ] }),
    /* @__PURE__ */ p.jsxs("span", { children: [
      "Letzter Sync: ",
      r ?? "—"
    ] }),
    l ? /* @__PURE__ */ p.jsxs("span", { style: { color: "var(--tc-danger)" }, children: [
      "Fehler: ",
      l
    ] }) : null,
    /* @__PURE__ */ p.jsx("span", { className: "right", children: "Title Classifier v3" })
  ] });
}
const bd = {
  music: "Musik",
  game: "Spiel",
  video: "Video"
};
function ep({ s: e }) {
  const t = !!e.current_key;
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-watcher", children: [
    e.current_artwork ? /* @__PURE__ */ p.jsx(
      "img",
      {
        className: "tc-art",
        src: e.current_artwork,
        alt: "",
        onError: (n) => n.currentTarget.style.display = "none"
      }
    ) : /* @__PURE__ */ p.jsx("div", { className: "tc-art tc-art-fallback", children: e.online ? "♪" : "·" }),
    /* @__PURE__ */ p.jsxs("div", { className: "tc-w-main", children: [
      /* @__PURE__ */ p.jsxs("div", { className: "tc-w-head", children: [
        /* @__PURE__ */ p.jsx("span", { className: "tc-w-name", children: e.name }),
        /* @__PURE__ */ p.jsx("span", { className: `badge ${e.media_type}`, children: bd[e.media_type] }),
        /* @__PURE__ */ p.jsx("span", { className: "badge", children: e.context }),
        /* @__PURE__ */ p.jsx("span", { className: "badge", children: e.signal_type }),
        /* @__PURE__ */ p.jsx("span", { className: `badge ${e.online ? "ok" : "off"}`, children: e.online ? "online" : "offline" })
      ] }),
      /* @__PURE__ */ p.jsx("div", { className: `tc-w-cur ${t ? "" : "muted"}`, children: t ? `▶ ${e.current_key}` : "— inaktiv —" }),
      /* @__PURE__ */ p.jsxs("div", { className: "tc-w-meta", children: [
        /* @__PURE__ */ p.jsxs("span", { children: [
          "Effective Enum: ",
          /* @__PURE__ */ p.jsx("b", { className: "tc-enum", children: e.current_enum ?? "—" })
        ] }),
        /* @__PURE__ */ p.jsxs("span", { children: [
          e.entry_count,
          " Einträge · ",
          e.unmapped_count,
          " offen"
        ] })
      ] })
    ] })
  ] });
}
function tp({ store: e }) {
  const { sources: t, entryCount: n, connected: r, error: l, lastSync: i } = e, o = t.filter((c) => c.online).length, u = t.reduce((c, v) => c + v.unmapped_count, 0), a = t.filter((c) => c.current_key);
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-page", children: [
    l ? /* @__PURE__ */ p.jsxs("div", { className: "tc-card tc-error", children: [
      "Verbindungsfehler: ",
      l,
      " — letzte bekannte Daten werden angezeigt."
    ] }) : null,
    /* @__PURE__ */ p.jsxs("div", { className: "tc-stats", children: [
      /* @__PURE__ */ p.jsx(Sr, { label: "Watcher", value: t.length }),
      /* @__PURE__ */ p.jsx(Sr, { label: "Online", value: `${o}/${t.length}` }),
      /* @__PURE__ */ p.jsx(Sr, { label: "Einträge", value: n ?? "—" }),
      /* @__PURE__ */ p.jsx(Sr, { label: "Unklassifiziert", value: u })
    ] }),
    /* @__PURE__ */ p.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ p.jsx("h3", { children: "Jetzt aktiv" }),
      a.length ? /* @__PURE__ */ p.jsx("div", { className: "tc-active", children: a.map((c) => /* @__PURE__ */ p.jsxs("div", { className: "tc-active-row", children: [
        /* @__PURE__ */ p.jsx("span", { className: "tc-active-name", children: c.name }),
        /* @__PURE__ */ p.jsx("span", { className: "tc-active-key", children: c.current_key }),
        /* @__PURE__ */ p.jsx("span", { className: "tc-enum", children: c.current_enum ?? "—" })
      ] }, c.entry_id)) }) : /* @__PURE__ */ p.jsx("div", { className: "tc-placeholder", children: "Aktuell spielt nichts." })
    ] }),
    /* @__PURE__ */ p.jsxs("section", { className: "tc-section", children: [
      /* @__PURE__ */ p.jsx("h3", { children: "Watcher" }),
      t.length ? /* @__PURE__ */ p.jsx("div", { className: "tc-watchers", children: t.map((c) => /* @__PURE__ */ p.jsx(ep, { s: c }, c.entry_id)) }) : /* @__PURE__ */ p.jsx("div", { className: "tc-placeholder", children: r ? "Keine v3-Watcher konfiguriert." : "Verbinde mit Home Assistant …" })
    ] }),
    /* @__PURE__ */ p.jsxs("div", { className: "tc-syshint", children: [
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
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-stat", children: [
    /* @__PURE__ */ p.jsx("div", { className: "tc-stat-val", children: t }),
    /* @__PURE__ */ p.jsx("div", { className: "tc-stat-label", children: e })
  ] });
}
const np = ["music", "game", "video"], rp = [
  "homepod",
  "pc",
  "ps5",
  "switch",
  "stash",
  "apple_tv"
], lp = ["title", "app"], ip = Array.from({ length: 10 }, (e, t) => t);
function fc({ value: e, onChange: t, dirty: n, disabled: r }) {
  return /* @__PURE__ */ p.jsx(
    "select",
    {
      className: `tc-select tc-enum-select ${n ? "dirty" : ""}`,
      value: e,
      disabled: r,
      onChange: (l) => t(parseInt(l.target.value, 10)),
      onClick: (l) => l.stopPropagation(),
      children: ip.map((l) => /* @__PURE__ */ p.jsx("option", { value: l, children: l }, l))
    }
  );
}
function Zu(e) {
  if (!e) return "—";
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function op({ entry: e, onDraftEnum: t, onApply: n, onReset: r }) {
  return e ? /* @__PURE__ */ p.jsxs("aside", { className: "tc-detail", children: [
    /* @__PURE__ */ p.jsx("h3", { className: "tc-detail-title", children: e.key }),
    /* @__PURE__ */ p.jsxs("div", { className: "tc-detail-badges", children: [
      /* @__PURE__ */ p.jsx("span", { className: `badge ${e.media_type}`, children: e.media_type }),
      /* @__PURE__ */ p.jsx("span", { className: "badge", children: e.signal_type }),
      e.is_current && e.current_context ? /* @__PURE__ */ p.jsx("span", { className: "badge ok", children: e.current_context }) : null,
      e.hidden ? /* @__PURE__ */ p.jsx("span", { className: "badge off", children: "versteckt" }) : null,
      e.is_variant ? /* @__PURE__ */ p.jsx("span", { className: "badge", children: "Variante" }) : null
    ] }),
    /* @__PURE__ */ p.jsxs("dl", { className: "tc-detail-grid", children: [
      /* @__PURE__ */ p.jsx("dt", { children: "Enum" }),
      /* @__PURE__ */ p.jsx("dd", { children: /* @__PURE__ */ p.jsx(
        fc,
        {
          value: e.enum,
          onChange: (l) => t(e.id, l),
          dirty: e.dirty
        }
      ) }),
      /* @__PURE__ */ p.jsx("dt", { children: "Effective" }),
      /* @__PURE__ */ p.jsx("dd", { children: e.is_current ? e.effective_enum ?? "—" : "—" }),
      /* @__PURE__ */ p.jsx("dt", { children: "Server-Enum" }),
      /* @__PURE__ */ p.jsx("dd", { children: e.serverEnum }),
      /* @__PURE__ */ p.jsx("dt", { children: "Varianten" }),
      /* @__PURE__ */ p.jsx("dd", { children: e.variants.length }),
      /* @__PURE__ */ p.jsx("dt", { children: "Sichtungen" }),
      /* @__PURE__ */ p.jsx("dd", { children: e.seen_count }),
      /* @__PURE__ */ p.jsx("dt", { children: "Zuletzt" }),
      /* @__PURE__ */ p.jsx("dd", { children: Zu(e.last_seen) }),
      /* @__PURE__ */ p.jsx("dt", { children: "Erstmals" }),
      /* @__PURE__ */ p.jsx("dd", { children: Zu(e.first_seen) })
    ] }),
    e.saveError ? /* @__PURE__ */ p.jsxs("div", { className: "tc-detail-error", children: [
      "Fehler: ",
      e.saveError
    ] }) : null,
    /* @__PURE__ */ p.jsxs("div", { className: "tc-detail-actions", children: [
      /* @__PURE__ */ p.jsx(
        "button",
        {
          className: "tc-btn primary",
          disabled: !e.dirty || e.saving,
          onClick: () => n(e.id),
          children: e.saving ? "…" : "Apply"
        }
      ),
      /* @__PURE__ */ p.jsx(
        "button",
        {
          className: "tc-btn",
          disabled: !e.dirty || e.saving,
          onClick: () => r(e.id),
          children: "Zurücksetzen"
        }
      )
    ] })
  ] }) : /* @__PURE__ */ p.jsx("aside", { className: "tc-detail", children: /* @__PURE__ */ p.jsx("div", { className: "tc-placeholder", children: "Eintrag auswählen, um Details zu sehen." }) });
}
function up(e) {
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString();
}
function sp({ store: e }) {
  const [t, n] = D.useState(""), [r, l] = D.useState(""), [i, o] = D.useState(""), [u, a] = D.useState(""), [c, v] = D.useState(!1), [h, m] = D.useState(/* @__PURE__ */ new Set()), [x, w] = D.useState(null), k = D.useMemo(
    () => e.displayEntries.filter((s) => !(s.parent_id !== null || s.serverEnum !== 0 || !c && s.hidden || r && s.media_type !== r || i && s.signal_type !== i || u && s.current_context !== u || t && !s.key.toLowerCase().includes(t.toLowerCase()))),
    [e.displayEntries, c, r, i, u, t]
  ), O = (s) => m((d) => {
    const g = new Set(d);
    return g.has(s) ? g.delete(s) : g.add(s), g;
  }), f = x ? e.getDisplayEntry(x) : void 0;
  return /* @__PURE__ */ p.jsxs("div", { className: "tc-inbox", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "tc-inbox-main", children: [
      /* @__PURE__ */ p.jsxs("div", { className: "tc-filters", children: [
        /* @__PURE__ */ p.jsx(
          "input",
          {
            className: "tc-input",
            type: "search",
            placeholder: "Suche …",
            value: t,
            onChange: (s) => n(s.target.value)
          }
        ),
        /* @__PURE__ */ p.jsxs(
          "select",
          {
            className: "tc-select",
            value: r,
            onChange: (s) => l(s.target.value),
            children: [
              /* @__PURE__ */ p.jsx("option", { value: "", children: "Medienart: Alle" }),
              np.map((s) => /* @__PURE__ */ p.jsx("option", { value: s, children: s }, s))
            ]
          }
        ),
        /* @__PURE__ */ p.jsxs(
          "select",
          {
            className: "tc-select",
            value: u,
            onChange: (s) => a(s.target.value),
            children: [
              /* @__PURE__ */ p.jsx("option", { value: "", children: "Kontext: Alle" }),
              rp.map((s) => /* @__PURE__ */ p.jsx("option", { value: s, children: s }, s))
            ]
          }
        ),
        /* @__PURE__ */ p.jsxs(
          "select",
          {
            className: "tc-select",
            value: i,
            onChange: (s) => o(s.target.value),
            children: [
              /* @__PURE__ */ p.jsx("option", { value: "", children: "Signal: Alle" }),
              lp.map((s) => /* @__PURE__ */ p.jsx("option", { value: s, children: s }, s))
            ]
          }
        ),
        /* @__PURE__ */ p.jsxs("label", { className: "tc-check", children: [
          /* @__PURE__ */ p.jsx(
            "input",
            {
              type: "checkbox",
              checked: c,
              onChange: (s) => v(s.target.checked)
            }
          ),
          "versteckte"
        ] }),
        /* @__PURE__ */ p.jsxs("span", { className: "tc-filters-info", children: [
          k.length,
          " Einträge · Auswahl ",
          h.size,
          " · offen",
          " ",
          e.dirtyCount
        ] })
      ] }),
      /* @__PURE__ */ p.jsx("div", { className: "tc-table-wrap", children: /* @__PURE__ */ p.jsxs("table", { className: "tc-table", children: [
        /* @__PURE__ */ p.jsx("thead", { children: /* @__PURE__ */ p.jsxs("tr", { children: [
          /* @__PURE__ */ p.jsx("th", {}),
          /* @__PURE__ */ p.jsx("th", { children: "Key" }),
          /* @__PURE__ */ p.jsx("th", { children: "Art" }),
          /* @__PURE__ */ p.jsx("th", { children: "Kontext" }),
          /* @__PURE__ */ p.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ p.jsx("th", { children: "Enum" }),
          /* @__PURE__ */ p.jsx("th", { children: "Eff." }),
          /* @__PURE__ */ p.jsx("th", { children: "Status" }),
          /* @__PURE__ */ p.jsx("th", { children: "Zuletzt" }),
          /* @__PURE__ */ p.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ p.jsx("tbody", { children: k.length === 0 ? /* @__PURE__ */ p.jsx("tr", { children: /* @__PURE__ */ p.jsx("td", { colSpan: 10, className: "tc-placeholder", children: "Keine unklassifizierten Einträge." }) }) : k.map((s) => /* @__PURE__ */ p.jsxs(
          "tr",
          {
            className: `${s.id === x ? "focused" : ""} ${s.dirty ? "dirty" : ""}`,
            onClick: () => w(s.id),
            children: [
              /* @__PURE__ */ p.jsx("td", { children: /* @__PURE__ */ p.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: h.has(s.id),
                  onClick: (d) => d.stopPropagation(),
                  onChange: () => O(s.id)
                }
              ) }),
              /* @__PURE__ */ p.jsx("td", { className: "tc-key", children: s.key }),
              /* @__PURE__ */ p.jsx("td", { children: s.media_type }),
              /* @__PURE__ */ p.jsx("td", { children: s.is_current ? s.current_context ?? "—" : "—" }),
              /* @__PURE__ */ p.jsx("td", { children: s.signal_type }),
              /* @__PURE__ */ p.jsx("td", { children: /* @__PURE__ */ p.jsx(
                fc,
                {
                  value: s.enum,
                  dirty: s.dirty,
                  onChange: (d) => e.setDraftEnum(s.id, d)
                }
              ) }),
              /* @__PURE__ */ p.jsx("td", { children: s.is_current ? s.effective_enum ?? "—" : "—" }),
              /* @__PURE__ */ p.jsx("td", { children: s.saving ? /* @__PURE__ */ p.jsx("span", { className: "badge", children: "speichert…" }) : s.saveError ? /* @__PURE__ */ p.jsx("span", { className: "badge off", children: "Fehler" }) : s.dirty ? /* @__PURE__ */ p.jsx("span", { className: "badge dirtybadge", children: "geändert" }) : s.hidden ? /* @__PURE__ */ p.jsx("span", { className: "badge off", children: "versteckt" }) : /* @__PURE__ */ p.jsx("span", { className: "tc-muted", children: "—" }) }),
              /* @__PURE__ */ p.jsx("td", { className: "tc-muted", children: up(s.last_seen) }),
              /* @__PURE__ */ p.jsx("td", { children: s.dirty ? /* @__PURE__ */ p.jsxs(
                "span",
                {
                  className: "tc-row-actions",
                  onClick: (d) => d.stopPropagation(),
                  children: [
                    /* @__PURE__ */ p.jsx(
                      "button",
                      {
                        className: "tc-btn primary tc-mini",
                        disabled: s.saving,
                        onClick: () => e.applyDraft(s.id),
                        children: "✓"
                      }
                    ),
                    /* @__PURE__ */ p.jsx(
                      "button",
                      {
                        className: "tc-btn tc-mini",
                        disabled: s.saving,
                        onClick: () => e.resetDraft(s.id),
                        children: "↺"
                      }
                    )
                  ]
                }
              ) : null })
            ]
          },
          s.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ p.jsx(
      op,
      {
        entry: f,
        onDraftEnum: e.setDraftEnum,
        onApply: e.applyDraft,
        onReset: e.resetDraft
      }
    )
  ] });
}
function kl({ title: e, note: t }) {
  return /* @__PURE__ */ p.jsx("div", { className: "tc-page", children: /* @__PURE__ */ p.jsxs("div", { className: "tc-card tc-placeholder", children: [
    /* @__PURE__ */ p.jsx("h2", { children: e }),
    /* @__PURE__ */ p.jsx("p", { children: t })
  ] }) });
}
function ap() {
  return /* @__PURE__ */ p.jsx(
    kl,
    {
      title: "Tagebuch",
      note: "Verlauf der Sichtungen folgt in PR 9. TODO: eine echte Sighting-Timeline-Tabelle existiert in der DB noch nicht — der MVP zeigt nur verfügbare Daten."
    }
  );
}
function cp() {
  return /* @__PURE__ */ p.jsx(
    kl,
    {
      title: "Katalog",
      note: "Bibliothek mit Master/Kinder-Baum, Kontext-/Override-Anzeige (über v3/entry_detail) und den Tabs Alle/Unsortiert/Gruppen/Ausgeblendet folgen in PR 4–5."
    }
  );
}
function fp() {
  return /* @__PURE__ */ p.jsx(
    kl,
    {
      title: "Import / Export",
      note: "Bildfreies v3-JSON über die bestehende API mit Preview/Validierung und Konfliktanzeige folgt in PR 7."
    }
  );
}
function dp() {
  return /* @__PURE__ */ p.jsx(
    kl,
    {
      title: "Einstellungen",
      note: "Watcher-Status, PostgreSQL-Status (soweit verfügbar), v3-Konfiguration, Artwork-Fallbacks, Theme und Debug-Infos folgen in PR 8."
    }
  );
}
const pp = {
  diary: ap,
  catalog: cp,
  io: fp,
  settings: dp
};
function mp({ hass: e }) {
  const [t, n] = D.useState("overview"), r = Xd(e), l = cc.find((u) => u.id === t), i = pp[t], o = () => t === "inbox" ? /* @__PURE__ */ p.jsx(sp, { store: r }) : t === "overview" || !i ? /* @__PURE__ */ p.jsx(tp, { store: r }) : /* @__PURE__ */ p.jsx(i, {});
  return /* @__PURE__ */ p.jsxs("div", { className: "tc3", children: [
    /* @__PURE__ */ p.jsx(Gd, { current: t, onSelect: n }),
    /* @__PURE__ */ p.jsxs("div", { className: "tc3-body", children: [
      /* @__PURE__ */ p.jsx(
        Jd,
        {
          title: l.label,
          desc: l.desc,
          loading: r.loading,
          onRefresh: r.refresh
        }
      ),
      /* @__PURE__ */ p.jsx("main", { className: "tc3-main", children: o() }),
      /* @__PURE__ */ p.jsx(
        qd,
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
const hp = ':host{display:block;height:100%}:host,:root{--tc-bg: var(--primary-background-color, #1c1e2b);--tc-surface: #282a36;--tc-surface-raised: #343746;--tc-border: #44475a;--tc-text: var(--primary-text-color, #f8f8f2);--tc-text-muted: #9aa0bd;--tc-accent-purple: #bd93f9;--tc-accent-cyan: #8be9fd;--tc-accent-green: #50fa7b;--tc-accent-orange: #ffb86c;--tc-accent-pink: #ff79c6;--tc-danger: #ff5555;--tc-radius: 10px;--tc-gap: 14px}*{box-sizing:border-box}.tc3{display:grid;grid-template-columns:232px 1fr;height:100%;min-height:0;font-family:var(--paper-font-body1_-_font-family, "Segoe UI", system-ui, sans-serif);color:var(--tc-text);background:var(--tc-bg);font-size:14px}.tc3-body{display:grid;grid-template-rows:auto 1fr auto;min-width:0;min-height:0}.tc3-main{min-height:0;overflow:auto;padding:18px}.tc-sidebar{background:var(--tc-surface);border-right:1px solid var(--tc-border);display:flex;flex-direction:column;min-height:0}.tc-brand{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;border-bottom:1px solid var(--tc-border)}.tc-brand .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--tc-accent-purple),var(--tc-accent-pink));display:flex;align-items:center;justify-content:center;font-weight:700;color:#1c1e2b}.tc-brand .title{font-weight:700;line-height:1.1}.tc-brand .sub{color:var(--tc-text-muted);font-size:11px}.tc-nav{padding:10px 8px;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0;overflow:auto}.tc-nav button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:1px solid transparent;color:var(--tc-text);padding:9px 12px;border-radius:8px;cursor:pointer;font:inherit}.tc-nav button:hover{background:var(--tc-surface-raised)}.tc-nav button.active{background:color-mix(in srgb,var(--tc-accent-purple) 22%,transparent);border-color:color-mix(in srgb,var(--tc-accent-purple) 55%,transparent);color:#fff}.tc-nav .ico{width:18px;text-align:center;opacity:.85}.tc-sidebar .foot{padding:10px 16px;border-top:1px solid var(--tc-border);color:var(--tc-text-muted);font-size:11px}.tc-cmdbar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--tc-border);background:color-mix(in srgb,var(--tc-surface) 60%,var(--tc-bg))}.tc-cmdbar h1{font-size:17px;margin:0}.tc-cmdbar .desc{color:var(--tc-text-muted);font-size:12px}.tc-cmdbar .spacer{flex:1}.tc-menu-btn{display:none}input,select,button{font:inherit;color:var(--tc-text)}.tc-input,.tc-select,.tc-btn{background:var(--tc-surface-raised);border:1px solid var(--tc-border);border-radius:8px;padding:7px 10px;color:var(--tc-text)}.tc-btn{cursor:pointer}.tc-btn:hover:not(:disabled){border-color:var(--tc-accent-purple)}.tc-btn.primary{background:var(--tc-accent-purple);border-color:var(--tc-accent-purple);color:#1c1e2b;font-weight:600}.tc-btn:disabled{opacity:.45;cursor:default}.tc-statusbar{display:flex;align-items:center;gap:16px;padding:7px 18px;border-top:1px solid var(--tc-border);background:var(--tc-surface);color:var(--tc-text-muted);font-size:12px}.tc-statusbar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}.tc-statusbar .ok{background:var(--tc-accent-green)}.tc-statusbar .bad{background:var(--tc-danger)}.tc-statusbar .right{margin-left:auto}.tc-page{max-width:1200px}.tc-card{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:18px}.tc-placeholder{color:var(--tc-text-muted)}.tc-placeholder h2{color:var(--tc-text);margin:0 0 6px}.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;border:1px solid var(--tc-border)}.badge.music{color:var(--tc-accent-cyan);border-color:color-mix(in srgb,var(--tc-accent-cyan) 50%,transparent)}.badge.game{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 50%,transparent)}.badge.video{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-error{border-color:color-mix(in srgb,var(--tc-danger) 60%,transparent);color:var(--tc-danger);margin-bottom:var(--tc-gap)}.tc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--tc-gap);margin-bottom:20px}.tc-stat{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:14px 16px}.tc-stat-val{font-size:26px;font-weight:700}.tc-stat-label{color:var(--tc-text-muted);font-size:12px;margin-top:2px}.tc-section{margin-bottom:22px}.tc-section h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--tc-text-muted)}.tc-enum{color:var(--tc-accent-purple);font-weight:700}.tc-active{display:flex;flex-direction:column;gap:6px}.tc-active-row{display:grid;grid-template-columns:160px 1fr auto;gap:12px;align-items:center;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:8px;padding:8px 12px}.tc-active-name{color:var(--tc-text-muted)}.tc-active-key{font-weight:500}.tc-watchers{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--tc-gap)}.tc-watcher{display:flex;gap:12px;background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:12px 14px}.tc-art{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto}.tc-art-fallback{display:flex;align-items:center;justify-content:center;background:var(--tc-surface-raised);color:var(--tc-text-muted);font-size:20px}.tc-w-main{min-width:0;flex:1}.tc-w-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tc-w-name{font-weight:600}.tc-w-cur{margin-top:6px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tc-w-cur.muted{color:var(--tc-text-muted)}.tc-w-meta{margin-top:6px;display:flex;gap:12px;flex-wrap:wrap;color:var(--tc-text-muted);font-size:12px}.badge.ok{color:var(--tc-accent-green);border-color:color-mix(in srgb,var(--tc-accent-green) 45%,transparent)}.badge.off{color:var(--tc-text-muted)}.tc-syshint{color:var(--tc-text-muted);font-size:12px;margin-top:8px}.tc-inbox{display:grid;grid-template-columns:1fr 340px;gap:var(--tc-gap);height:100%;min-height:0}.tc-inbox-main{min-width:0;display:flex;flex-direction:column;min-height:0}.tc-filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tc-check{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--tc-text-muted)}.tc-filters-info{color:var(--tc-text-muted);font-size:12px;margin-left:auto}.tc-table-wrap{flex:1;min-height:0;overflow:auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius)}.tc-table{width:100%;border-collapse:collapse;font-size:13px}.tc-table th,.tc-table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--tc-border);white-space:nowrap}.tc-table thead th{position:sticky;top:0;background:var(--tc-surface);color:var(--tc-text-muted);font-weight:600;z-index:1}.tc-table tbody tr{cursor:pointer}.tc-table tbody tr:hover{background:var(--tc-surface-raised)}.tc-table tbody tr.focused{background:color-mix(in srgb,var(--tc-accent-purple) 18%,transparent)}.tc-table tbody tr.dirty td{border-bottom-color:color-mix(in srgb,var(--tc-accent-orange) 40%,transparent)}.tc-key{font-weight:500;max-width:320px;overflow:hidden;text-overflow:ellipsis}.tc-muted{color:var(--tc-text-muted)}.tc-enum-select.dirty{border-color:var(--tc-accent-orange);color:var(--tc-accent-orange)}.badge.dirtybadge{color:var(--tc-accent-orange);border-color:color-mix(in srgb,var(--tc-accent-orange) 50%,transparent)}.tc-row-actions{display:inline-flex;gap:4px}.tc-mini{padding:3px 8px}.tc-detail{background:var(--tc-surface);border:1px solid var(--tc-border);border-radius:var(--tc-radius);padding:16px;overflow:auto;min-height:0}.tc-detail-title{margin:0 0 8px;font-size:15px;word-break:break-word}.tc-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tc-detail-grid{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 14px}.tc-detail-grid dt{color:var(--tc-text-muted);font-size:12px}.tc-detail-grid dd{margin:0}.tc-detail-error{color:var(--tc-danger);font-size:12px;margin-bottom:10px}.tc-detail-actions{display:flex;gap:8px}@media (max-width: 870px){.tc3{grid-template-columns:1fr}.tc-sidebar{display:none}.tc-menu-btn{display:inline-flex}.tc-inbox{grid-template-columns:1fr}}';
class vp extends HTMLElement {
  constructor() {
    super(...arguments);
    El(this, "_root", null);
    El(this, "_hass", null);
  }
  connectedCallback() {
    if (this._root) return;
    const n = this.attachShadow({ mode: "open" }), r = document.createElement("style");
    r.textContent = hp, n.appendChild(r);
    const l = document.createElement("div");
    l.style.height = "100%", n.appendChild(l), this._root = uc(l), this._render();
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
    this._root?.render(D.createElement(mp, { hass: this._hass }));
  }
}
customElements.get("title-classifier-v3-app") || customElements.define("title-classifier-v3-app", vp);
