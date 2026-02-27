#!/usr/bin/env node
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/sql.js/dist/sql-wasm.js
var require_sql_wasm = __commonJS((exports, module) => {
  var __dirname = "D:\\code\\opencode_develop\\opencode_mem\\node_modules\\sql.js\\dist", __filename = "D:\\code\\opencode_develop\\opencode_mem\\node_modules\\sql.js\\dist\\sql-wasm.js";
  var initSqlJsPromise = undefined;
  var initSqlJs = function(moduleConfig) {
    if (initSqlJsPromise) {
      return initSqlJsPromise;
    }
    initSqlJsPromise = new Promise(function(resolveModule, reject) {
      var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
      var originalOnAbortFunction = Module["onAbort"];
      Module["onAbort"] = function(errorThatCausedAbort) {
        reject(new Error(errorThatCausedAbort));
        if (originalOnAbortFunction) {
          originalOnAbortFunction(errorThatCausedAbort);
        }
      };
      Module["postRun"] = Module["postRun"] || [];
      Module["postRun"].push(function() {
        resolveModule(Module);
      });
      module = undefined;
      var k;
      k ||= typeof Module != "undefined" ? Module : {};
      var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope, ca = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
      k.onRuntimeInitialized = function() {
        function a(f, l) {
          switch (typeof l) {
            case "boolean":
              dc(f, l ? 1 : 0);
              break;
            case "number":
              ec(f, l);
              break;
            case "string":
              fc(f, l, -1, -1);
              break;
            case "object":
              if (l === null)
                lb(f);
              else if (l.length != null) {
                var n = da(l.length);
                m.set(l, n);
                gc(f, n, l.length, -1);
                ea(n);
              } else
                sa(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
              break;
            default:
              lb(f);
          }
        }
        function b(f, l) {
          for (var n = [], p = 0;p < f; p += 1) {
            var u = r(l + 4 * p, "i32"), v = hc(u);
            if (v === 1 || v === 2)
              u = ic(u);
            else if (v === 3)
              u = jc(u);
            else if (v === 4) {
              v = u;
              u = kc(v);
              v = lc(v);
              for (var K = new Uint8Array(u), I = 0;I < u; I += 1)
                K[I] = m[v + I];
              u = K;
            } else
              u = null;
            n.push(u);
          }
          return n;
        }
        function c(f, l) {
          this.Qa = f;
          this.db = l;
          this.Oa = 1;
          this.lb = [];
        }
        function d(f, l) {
          this.db = l;
          this.eb = fa(f);
          if (this.eb === null)
            throw Error("Unable to allocate memory for the SQL string");
          this.kb = this.eb;
          this.Za = this.qb = null;
        }
        function e(f) {
          this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
          if (f != null) {
            var l = this.filename, n = "/", p = l;
            n && (n = typeof n == "string" ? n : ha(n), p = l ? ia(n + "/" + l) : n);
            l = ja(true, true);
            p = ka(p, l);
            if (f) {
              if (typeof f == "string") {
                n = Array(f.length);
                for (var u = 0, v = f.length;u < v; ++u)
                  n[u] = f.charCodeAt(u);
                f = n;
              }
              la(p, l | 146);
              n = ma(p, 577);
              na(n, f, 0, f.length, 0);
              oa(n);
              la(p, l);
            }
          }
          this.handleError(q(this.filename, g));
          this.db = r(g, "i32");
          ob(this.db);
          this.fb = {};
          this.Sa = {};
        }
        var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), t = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]), pb = h("sqlite3_sql", "string", ["number"]), nc = h("sqlite3_normalized_sql", "string", ["number"]), qb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), oc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), rb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), pc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), qc = h("sqlite3_bind_int", "number", [
          "number",
          "number",
          "number"
        ]), rc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), sc = h("sqlite3_step", "number", ["number"]), tc = h("sqlite3_errmsg", "string", ["number"]), uc = h("sqlite3_column_count", "number", ["number"]), vc = h("sqlite3_data_count", "number", ["number"]), wc = h("sqlite3_column_double", "number", ["number", "number"]), sb = h("sqlite3_column_text", "string", ["number", "number"]), xc = h("sqlite3_column_blob", "number", ["number", "number"]), yc = h("sqlite3_column_bytes", "number", ["number", "number"]), zc = h("sqlite3_column_type", "number", ["number", "number"]), Ac = h("sqlite3_column_name", "string", ["number", "number"]), Bc = h("sqlite3_reset", "number", ["number"]), Cc = h("sqlite3_clear_bindings", "number", ["number"]), Dc = h("sqlite3_finalize", "number", ["number"]), tb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), hc = h("sqlite3_value_type", "number", ["number"]), kc = h("sqlite3_value_bytes", "number", ["number"]), jc = h("sqlite3_value_text", "string", ["number"]), lc = h("sqlite3_value_blob", "number", ["number"]), ic = h("sqlite3_value_double", "number", ["number"]), ec = h("sqlite3_result_double", "", ["number", "number"]), lb = h("sqlite3_result_null", "", ["number"]), fc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), gc = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), dc = h("sqlite3_result_int", "", ["number", "number"]), sa = h("sqlite3_result_error", "", ["number", "string", "number"]), ub = h("sqlite3_aggregate_context", "number", ["number", "number"]), ob = h("RegisterExtensionFunctions", "number", ["number"]), vb = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
        c.prototype.bind = function(f) {
          if (!this.Qa)
            throw "Statement closed";
          this.reset();
          return Array.isArray(f) ? this.Cb(f) : f != null && typeof f === "object" ? this.Db(f) : true;
        };
        c.prototype.step = function() {
          if (!this.Qa)
            throw "Statement closed";
          this.Oa = 1;
          var f = sc(this.Qa);
          switch (f) {
            case 100:
              return true;
            case 101:
              return false;
            default:
              throw this.db.handleError(f);
          }
        };
        c.prototype.wb = function(f) {
          f == null && (f = this.Oa, this.Oa += 1);
          return wc(this.Qa, f);
        };
        c.prototype.Gb = function(f) {
          f == null && (f = this.Oa, this.Oa += 1);
          f = sb(this.Qa, f);
          if (typeof BigInt !== "function")
            throw Error("BigInt is not supported");
          return BigInt(f);
        };
        c.prototype.Hb = function(f) {
          f == null && (f = this.Oa, this.Oa += 1);
          return sb(this.Qa, f);
        };
        c.prototype.getBlob = function(f) {
          f == null && (f = this.Oa, this.Oa += 1);
          var l = yc(this.Qa, f);
          f = xc(this.Qa, f);
          for (var n = new Uint8Array(l), p = 0;p < l; p += 1)
            n[p] = m[f + p];
          return n;
        };
        c.prototype.get = function(f, l) {
          l = l || {};
          f != null && this.bind(f) && this.step();
          f = [];
          for (var n = vc(this.Qa), p = 0;p < n; p += 1)
            switch (zc(this.Qa, p)) {
              case 1:
                var u = l.useBigInt ? this.Gb(p) : this.wb(p);
                f.push(u);
                break;
              case 2:
                f.push(this.wb(p));
                break;
              case 3:
                f.push(this.Hb(p));
                break;
              case 4:
                f.push(this.getBlob(p));
                break;
              default:
                f.push(null);
            }
          return f;
        };
        c.prototype.getColumnNames = function() {
          for (var f = [], l = uc(this.Qa), n = 0;n < l; n += 1)
            f.push(Ac(this.Qa, n));
          return f;
        };
        c.prototype.getAsObject = function(f, l) {
          f = this.get(f, l);
          l = this.getColumnNames();
          for (var n = {}, p = 0;p < l.length; p += 1)
            n[l[p]] = f[p];
          return n;
        };
        c.prototype.getSQL = function() {
          return pb(this.Qa);
        };
        c.prototype.getNormalizedSQL = function() {
          return nc(this.Qa);
        };
        c.prototype.run = function(f) {
          f != null && this.bind(f);
          this.step();
          return this.reset();
        };
        c.prototype.tb = function(f, l) {
          l == null && (l = this.Oa, this.Oa += 1);
          f = fa(f);
          this.lb.push(f);
          this.db.handleError(oc(this.Qa, l, f, -1, 0));
        };
        c.prototype.Bb = function(f, l) {
          l == null && (l = this.Oa, this.Oa += 1);
          var n = da(f.length);
          m.set(f, n);
          this.lb.push(n);
          this.db.handleError(rb(this.Qa, l, n, f.length, 0));
        };
        c.prototype.sb = function(f, l) {
          l == null && (l = this.Oa, this.Oa += 1);
          this.db.handleError((f === (f | 0) ? qc : pc)(this.Qa, l, f));
        };
        c.prototype.Eb = function(f) {
          f == null && (f = this.Oa, this.Oa += 1);
          rb(this.Qa, f, 0, 0, 0);
        };
        c.prototype.ub = function(f, l) {
          l == null && (l = this.Oa, this.Oa += 1);
          switch (typeof f) {
            case "string":
              this.tb(f, l);
              return;
            case "number":
              this.sb(f, l);
              return;
            case "bigint":
              this.tb(f.toString(), l);
              return;
            case "boolean":
              this.sb(f + 0, l);
              return;
            case "object":
              if (f === null) {
                this.Eb(l);
                return;
              }
              if (f.length != null) {
                this.Bb(f, l);
                return;
              }
          }
          throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
        };
        c.prototype.Db = function(f) {
          var l = this;
          Object.keys(f).forEach(function(n) {
            var p = rc(l.Qa, n);
            p !== 0 && l.ub(f[n], p);
          });
          return true;
        };
        c.prototype.Cb = function(f) {
          for (var l = 0;l < f.length; l += 1)
            this.ub(f[l], l + 1);
          return true;
        };
        c.prototype.reset = function() {
          this.freemem();
          return Cc(this.Qa) === 0 && Bc(this.Qa) === 0;
        };
        c.prototype.freemem = function() {
          for (var f;(f = this.lb.pop()) !== undefined; )
            ea(f);
        };
        c.prototype.free = function() {
          this.freemem();
          var f = Dc(this.Qa) === 0;
          delete this.db.fb[this.Qa];
          this.Qa = 0;
          return f;
        };
        d.prototype.next = function() {
          if (this.eb === null)
            return { done: true };
          this.Za !== null && (this.Za.free(), this.Za = null);
          if (!this.db.db)
            throw this.nb(), Error("Database closed");
          var f = pa(), l = y(4);
          qa(g);
          qa(l);
          try {
            this.db.handleError(qb(this.db.db, this.kb, -1, g, l));
            this.kb = r(l, "i32");
            var n = r(g, "i32");
            if (n === 0)
              return this.nb(), { done: true };
            this.Za = new c(n, this.db);
            this.db.fb[n] = this.Za;
            return { value: this.Za, done: false };
          } catch (p) {
            throw this.qb = z(this.kb), this.nb(), p;
          } finally {
            ra(f);
          }
        };
        d.prototype.nb = function() {
          ea(this.eb);
          this.eb = null;
        };
        d.prototype.getRemainingSQL = function() {
          return this.qb !== null ? this.qb : z(this.kb);
        };
        typeof Symbol === "function" && typeof Symbol.iterator === "symbol" && (d.prototype[Symbol.iterator] = function() {
          return this;
        });
        e.prototype.run = function(f, l) {
          if (!this.db)
            throw "Database closed";
          if (l) {
            f = this.prepare(f, l);
            try {
              f.step();
            } finally {
              f.free();
            }
          } else
            this.handleError(t(this.db, f, 0, 0, g));
          return this;
        };
        e.prototype.exec = function(f, l, n) {
          if (!this.db)
            throw "Database closed";
          var p = null, u = null, v = null;
          try {
            v = u = fa(f);
            var K = y(4);
            for (f = [];r(v, "i8") !== 0; ) {
              qa(g);
              qa(K);
              this.handleError(qb(this.db, v, -1, g, K));
              var I = r(g, "i32");
              v = r(K, "i32");
              if (I !== 0) {
                var H = null;
                p = new c(I, this);
                for (l != null && p.bind(l);p.step(); )
                  H === null && (H = { columns: p.getColumnNames(), values: [] }, f.push(H)), H.values.push(p.get(null, n));
                p.free();
              }
            }
            return f;
          } catch (L) {
            throw p && p.free(), L;
          } finally {
            u && ea(u);
          }
        };
        e.prototype.each = function(f, l, n, p, u) {
          typeof l === "function" && (p = n, n = l, l = undefined);
          f = this.prepare(f, l);
          try {
            for (;f.step(); )
              n(f.getAsObject(null, u));
          } finally {
            f.free();
          }
          if (typeof p === "function")
            return p();
        };
        e.prototype.prepare = function(f, l) {
          qa(g);
          this.handleError(D(this.db, f, -1, g, 0));
          f = r(g, "i32");
          if (f === 0)
            throw "Nothing to prepare";
          var n = new c(f, this);
          l != null && n.bind(l);
          return this.fb[f] = n;
        };
        e.prototype.iterateStatements = function(f) {
          return new d(f, this);
        };
        e.prototype["export"] = function() {
          Object.values(this.fb).forEach(function(l) {
            l.free();
          });
          Object.values(this.Sa).forEach(A);
          this.Sa = {};
          this.handleError(w(this.db));
          var f = ta(this.filename);
          this.handleError(q(this.filename, g));
          this.db = r(g, "i32");
          ob(this.db);
          return f;
        };
        e.prototype.close = function() {
          this.db !== null && (Object.values(this.fb).forEach(function(f) {
            f.free();
          }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.Ya && (A(this.Ya), this.Ya = undefined), this.handleError(w(this.db)), ua("/" + this.filename), this.db = null);
        };
        e.prototype.handleError = function(f) {
          if (f === 0)
            return null;
          f = tc(this.db);
          throw Error(f);
        };
        e.prototype.getRowsModified = function() {
          return x(this.db);
        };
        e.prototype.create_function = function(f, l) {
          Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
          var n = va(function(p, u, v) {
            u = b(u, v);
            try {
              var K = l.apply(null, u);
            } catch (I) {
              sa(p, I, -1);
              return;
            }
            a(p, K);
          }, "viii");
          this.Sa[f] = n;
          this.handleError(tb(this.db, f, l.length, 1, 0, n, 0, 0, 0));
          return this;
        };
        e.prototype.create_aggregate = function(f, l) {
          var n = l.init || function() {
            return null;
          }, p = l.finalize || function(H) {
            return H;
          }, u = l.step;
          if (!u)
            throw "An aggregate function must have a step function in " + f;
          var v = {};
          Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
          l = f + "__finalize";
          Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
          var K = va(function(H, L, Pa) {
            var V = ub(H, 1);
            Object.hasOwnProperty.call(v, V) || (v[V] = n());
            L = b(L, Pa);
            L = [v[V]].concat(L);
            try {
              v[V] = u.apply(null, L);
            } catch (Fc) {
              delete v[V], sa(H, Fc, -1);
            }
          }, "viii"), I = va(function(H) {
            var L = ub(H, 1);
            try {
              var Pa = p(v[L]);
            } catch (V) {
              delete v[L];
              sa(H, V, -1);
              return;
            }
            a(H, Pa);
            delete v[L];
          }, "vi");
          this.Sa[f] = K;
          this.Sa[l] = I;
          this.handleError(tb(this.db, f, u.length - 1, 1, 0, 0, K, I, 0));
          return this;
        };
        e.prototype.updateHook = function(f) {
          this.Ya && (vb(this.db, 0, 0), A(this.Ya), this.Ya = undefined);
          if (!f)
            return this;
          this.Ya = va(function(l, n, p, u, v) {
            switch (n) {
              case 18:
                l = "insert";
                break;
              case 23:
                l = "update";
                break;
              case 9:
                l = "delete";
                break;
              default:
                throw "unknown operationCode in updateHook callback: " + n;
            }
            p = z(p);
            u = z(u);
            if (v > Number.MAX_SAFE_INTEGER)
              throw "rowId too big to fit inside a Number";
            f(l, p, u, Number(v));
          }, "viiiij");
          vb(this.db, this.Ya, 0);
          return this;
        };
        k.Database = e;
      };
      var wa = "./this.program", xa = (a, b) => {
        throw b;
      }, ya = globalThis.document?.currentScript?.src;
      typeof __filename != "undefined" ? ya = __filename : ba && (ya = self.location.href);
      var za = "", Aa, Ba;
      if (ca) {
        var fs = __require("node:fs");
        za = __dirname + "/";
        Ba = (a) => {
          a = Ca(a) ? new URL(a) : a;
          return fs.readFileSync(a);
        };
        Aa = async (a) => {
          a = Ca(a) ? new URL(a) : a;
          return fs.readFileSync(a, undefined);
        };
        1 < process.argv.length && (wa = process.argv[1].replace(/\\/g, "/"));
        process.argv.slice(2);
        typeof module != "undefined" && (module.exports = k);
        xa = (a, b) => {
          process.exitCode = a;
          throw b;
        };
      } else if (aa || ba) {
        try {
          za = new URL(".", ya).href;
        } catch {}
        ba && (Ba = (a) => {
          var b = new XMLHttpRequest;
          b.open("GET", a, false);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        });
        Aa = async (a) => {
          if (Ca(a))
            return new Promise((c, d) => {
              var e = new XMLHttpRequest;
              e.open("GET", a, true);
              e.responseType = "arraybuffer";
              e.onload = () => {
                e.status == 200 || e.status == 0 && e.response ? c(e.response) : d(e.status);
              };
              e.onerror = d;
              e.send(null);
            });
          var b = await fetch(a, { credentials: "same-origin" });
          if (b.ok)
            return b.arrayBuffer();
          throw Error(b.status + " : " + b.url);
        };
      }
      var Da = console.log.bind(console), B = console.error.bind(console), Ea, Fa = false, Ga, Ca = (a) => a.startsWith("file://"), m, C, Ha, E, F, Ia, Ja, G;
      function Ka() {
        var a = La.buffer;
        m = new Int8Array(a);
        Ha = new Int16Array(a);
        C = new Uint8Array(a);
        new Uint16Array(a);
        E = new Int32Array(a);
        F = new Uint32Array(a);
        Ia = new Float32Array(a);
        Ja = new Float64Array(a);
        G = new BigInt64Array(a);
        new BigUint64Array(a);
      }
      function Ma(a) {
        k.onAbort?.(a);
        a = "Aborted(" + a + ")";
        B(a);
        Fa = true;
        throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
      }
      var Na;
      async function Oa(a) {
        if (!Ea)
          try {
            var b = await Aa(a);
            return new Uint8Array(b);
          } catch {}
        if (a == Na && Ea)
          a = new Uint8Array(Ea);
        else if (Ba)
          a = Ba(a);
        else
          throw "both async and sync fetching of the wasm failed";
        return a;
      }
      async function Qa(a, b) {
        try {
          var c = await Oa(a);
          return await WebAssembly.instantiate(c, b);
        } catch (d) {
          B(`failed to asynchronously prepare wasm: ${d}`), Ma(d);
        }
      }
      async function Ra(a) {
        var b = Na;
        if (!Ea && !Ca(b) && !ca)
          try {
            var c = fetch(b, { credentials: "same-origin" });
            return await WebAssembly.instantiateStreaming(c, a);
          } catch (d) {
            B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
          }
        return Qa(b, a);
      }

      class Sa {
        name = "ExitStatus";
        constructor(a) {
          this.message = `Program terminated with exit(${a})`;
          this.status = a;
        }
      }
      var Ta = (a) => {
        for (;0 < a.length; )
          a.shift()(k);
      }, Ua = [], Va = [], Wa = () => {
        var a = k.preRun.shift();
        Va.push(a);
      }, J = 0, Xa = null;
      function r(a, b = "i8") {
        b.endsWith("*") && (b = "*");
        switch (b) {
          case "i1":
            return m[a];
          case "i8":
            return m[a];
          case "i16":
            return Ha[a >> 1];
          case "i32":
            return E[a >> 2];
          case "i64":
            return G[a >> 3];
          case "float":
            return Ia[a >> 2];
          case "double":
            return Ja[a >> 3];
          case "*":
            return F[a >> 2];
          default:
            Ma(`invalid type for getValue: ${b}`);
        }
      }
      var Ya = true;
      function qa(a) {
        var b = "i32";
        b.endsWith("*") && (b = "*");
        switch (b) {
          case "i1":
            m[a] = 0;
            break;
          case "i8":
            m[a] = 0;
            break;
          case "i16":
            Ha[a >> 1] = 0;
            break;
          case "i32":
            E[a >> 2] = 0;
            break;
          case "i64":
            G[a >> 3] = BigInt(0);
            break;
          case "float":
            Ia[a >> 2] = 0;
            break;
          case "double":
            Ja[a >> 3] = 0;
            break;
          case "*":
            F[a >> 2] = 0;
            break;
          default:
            Ma(`invalid type for setValue: ${b}`);
        }
      }
      var Za = new TextDecoder, $a = (a, b, c, d) => {
        c = b + c;
        if (d)
          return c;
        for (;a[b] && !(b >= c); )
          ++b;
        return b;
      }, z = (a, b, c) => a ? Za.decode(C.subarray(a, $a(C, a, b, c))) : "", ab = (a, b) => {
        for (var c = 0, d = a.length - 1;0 <= d; d--) {
          var e = a[d];
          e === "." ? a.splice(d, 1) : e === ".." ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
        }
        if (b)
          for (;c; c--)
            a.unshift("..");
        return a;
      }, ia = (a) => {
        var b = a.charAt(0) === "/", c = a.slice(-1) === "/";
        (a = ab(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
        a && c && (a += "/");
        return (b ? "/" : "") + a;
      }, bb = (a) => {
        var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
        a = b[0];
        b = b[1];
        if (!a && !b)
          return ".";
        b &&= b.slice(0, -1);
        return a + b;
      }, cb = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], db = () => {
        if (ca) {
          var a = __require("node:crypto");
          return (b) => a.randomFillSync(b);
        }
        return (b) => crypto.getRandomValues(b);
      }, eb = (a) => {
        (eb = db())(a);
      }, fb = (...a) => {
        for (var b = "", c = false, d = a.length - 1;-1 <= d && !c; d--) {
          c = 0 <= d ? a[d] : "/";
          if (typeof c != "string")
            throw new TypeError("Arguments to path.resolve must be strings");
          if (!c)
            return "";
          b = c + "/" + b;
          c = c.charAt(0) === "/";
        }
        b = ab(b.split("/").filter((e) => !!e), !c).join("/");
        return (c ? "/" : "") + b || ".";
      }, gb = (a) => {
        var b = $a(a, 0);
        return Za.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
      }, hb = [], ib = (a) => {
        for (var b = 0, c = 0;c < a.length; ++c) {
          var d = a.charCodeAt(c);
          127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
        }
        return b;
      }, M = (a, b, c, d) => {
        if (!(0 < d))
          return 0;
        var e = c;
        d = c + d - 1;
        for (var g = 0;g < a.length; ++g) {
          var h = a.codePointAt(g);
          if (127 >= h) {
            if (c >= d)
              break;
            b[c++] = h;
          } else if (2047 >= h) {
            if (c + 1 >= d)
              break;
            b[c++] = 192 | h >> 6;
            b[c++] = 128 | h & 63;
          } else if (65535 >= h) {
            if (c + 2 >= d)
              break;
            b[c++] = 224 | h >> 12;
            b[c++] = 128 | h >> 6 & 63;
            b[c++] = 128 | h & 63;
          } else {
            if (c + 3 >= d)
              break;
            b[c++] = 240 | h >> 18;
            b[c++] = 128 | h >> 12 & 63;
            b[c++] = 128 | h >> 6 & 63;
            b[c++] = 128 | h & 63;
            g++;
          }
        }
        b[c] = 0;
        return c - e;
      }, jb = [];
      function kb(a, b) {
        jb[a] = { input: [], output: [], cb: b };
        mb(a, nb);
      }
      var nb = { open(a) {
        var b = jb[a.node.rdev];
        if (!b)
          throw new N(43);
        a.tty = b;
        a.seekable = false;
      }, close(a) {
        a.tty.cb.fsync(a.tty);
      }, fsync(a) {
        a.tty.cb.fsync(a.tty);
      }, read(a, b, c, d) {
        if (!a.tty || !a.tty.cb.xb)
          throw new N(60);
        for (var e = 0, g = 0;g < d; g++) {
          try {
            var h = a.tty.cb.xb(a.tty);
          } catch (q) {
            throw new N(29);
          }
          if (h === undefined && e === 0)
            throw new N(6);
          if (h === null || h === undefined)
            break;
          e++;
          b[c + g] = h;
        }
        e && (a.node.atime = Date.now());
        return e;
      }, write(a, b, c, d) {
        if (!a.tty || !a.tty.cb.rb)
          throw new N(60);
        try {
          for (var e = 0;e < d; e++)
            a.tty.cb.rb(a.tty, b[c + e]);
        } catch (g) {
          throw new N(29);
        }
        d && (a.node.mtime = a.node.ctime = Date.now());
        return e;
      } }, wb = { xb() {
        a: {
          if (!hb.length) {
            var a = null;
            if (ca) {
              var b = Buffer.alloc(256), c = 0, d = process.stdin.fd;
              try {
                c = fs.readSync(d, b, 0, 256);
              } catch (e) {
                if (e.toString().includes("EOF"))
                  c = 0;
                else
                  throw e;
              }
              0 < c && (a = b.slice(0, c).toString("utf-8"));
            } else
              globalThis.window?.prompt && (a = window.prompt("Input: "), a !== null && (a += `
`));
            if (!a) {
              a = null;
              break a;
            }
            b = Array(ib(a) + 1);
            a = M(a, b, 0, b.length);
            b.length = a;
            hb = b;
          }
          a = hb.shift();
        }
        return a;
      }, rb(a, b) {
        b === null || b === 10 ? (Da(gb(a.output)), a.output = []) : b != 0 && a.output.push(b);
      }, fsync(a) {
        0 < a.output?.length && (Da(gb(a.output)), a.output = []);
      }, Tb() {
        return { Ob: 25856, Qb: 5, Nb: 191, Pb: 35387, Mb: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
      }, Ub() {
        return 0;
      }, Vb() {
        return [24, 80];
      } }, xb = { rb(a, b) {
        b === null || b === 10 ? (B(gb(a.output)), a.output = []) : b != 0 && a.output.push(b);
      }, fsync(a) {
        0 < a.output?.length && (B(gb(a.output)), a.output = []);
      } }, O = { Wa: null, Xa() {
        return O.createNode(null, "/", 16895, 0);
      }, createNode(a, b, c, d) {
        if ((c & 61440) === 24576 || (c & 61440) === 4096)
          throw new N(63);
        O.Wa || (O.Wa = { dir: { node: { Ta: O.La.Ta, Ua: O.La.Ua, lookup: O.La.lookup, hb: O.La.hb, rename: O.La.rename, unlink: O.La.unlink, rmdir: O.La.rmdir, readdir: O.La.readdir, symlink: O.La.symlink }, stream: { Va: O.Ma.Va } }, file: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: { Va: O.Ma.Va, read: O.Ma.read, write: O.Ma.write, ib: O.Ma.ib, jb: O.Ma.jb } }, link: { node: { Ta: O.La.Ta, Ua: O.La.Ua, readlink: O.La.readlink }, stream: {} }, vb: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: yb } });
        c = zb(a, b, c, d);
        P(c.mode) ? (c.La = O.Wa.dir.node, c.Ma = O.Wa.dir.stream, c.Na = {}) : (c.mode & 61440) === 32768 ? (c.La = O.Wa.file.node, c.Ma = O.Wa.file.stream, c.Ra = 0, c.Na = null) : (c.mode & 61440) === 40960 ? (c.La = O.Wa.link.node, c.Ma = O.Wa.link.stream) : (c.mode & 61440) === 8192 && (c.La = O.Wa.vb.node, c.Ma = O.Wa.vb.stream);
        c.atime = c.mtime = c.ctime = Date.now();
        a && (a.Na[b] = c, a.atime = a.mtime = a.ctime = c.atime);
        return c;
      }, Sb(a) {
        return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
      }, La: {
        Ta(a) {
          var b = {};
          b.dev = (a.mode & 61440) === 8192 ? a.id : 1;
          b.ino = a.id;
          b.mode = a.mode;
          b.nlink = 1;
          b.uid = 0;
          b.gid = 0;
          b.rdev = a.rdev;
          P(a.mode) ? b.size = 4096 : (a.mode & 61440) === 32768 ? b.size = a.Ra : (a.mode & 61440) === 40960 ? b.size = a.link.length : b.size = 0;
          b.atime = new Date(a.atime);
          b.mtime = new Date(a.mtime);
          b.ctime = new Date(a.ctime);
          b.blksize = 4096;
          b.blocks = Math.ceil(b.size / b.blksize);
          return b;
        },
        Ua(a, b) {
          for (var c of ["mode", "atime", "mtime", "ctime"])
            b[c] != null && (a[c] = b[c]);
          b.size !== undefined && (b = b.size, a.Ra != b && (b == 0 ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
        },
        lookup() {
          O.mb || (O.mb = new N(44), O.mb.stack = "<generic error, no stack>");
          throw O.mb;
        },
        hb(a, b, c, d) {
          return O.createNode(a, b, c, d);
        },
        rename(a, b, c) {
          try {
            var d = Q(b, c);
          } catch (g) {}
          if (d) {
            if (P(a.mode))
              for (var e in d.Na)
                throw new N(55);
            Ab(d);
          }
          delete a.parent.Na[a.name];
          b.Na[c] = a;
          a.name = c;
          b.ctime = b.mtime = a.parent.ctime = a.parent.mtime = Date.now();
        },
        unlink(a, b) {
          delete a.Na[b];
          a.ctime = a.mtime = Date.now();
        },
        rmdir(a, b) {
          var c = Q(a, b), d;
          for (d in c.Na)
            throw new N(55);
          delete a.Na[b];
          a.ctime = a.mtime = Date.now();
        },
        readdir(a) {
          return [".", "..", ...Object.keys(a.Na)];
        },
        symlink(a, b, c) {
          a = O.createNode(a, b, 41471, 0);
          a.link = c;
          return a;
        },
        readlink(a) {
          if ((a.mode & 61440) !== 40960)
            throw new N(28);
          return a.link;
        }
      }, Ma: { read(a, b, c, d, e) {
        var g = a.node.Na;
        if (e >= a.node.Ra)
          return 0;
        a = Math.min(a.node.Ra - e, d);
        if (8 < a && g.subarray)
          b.set(g.subarray(e, e + a), c);
        else
          for (d = 0;d < a; d++)
            b[c + d] = g[e + d];
        return a;
      }, write(a, b, c, d, e, g) {
        b.buffer === m.buffer && (g = false);
        if (!d)
          return 0;
        a = a.node;
        a.mtime = a.ctime = Date.now();
        if (b.subarray && (!a.Na || a.Na.subarray)) {
          if (g)
            return a.Na = b.subarray(c, c + d), a.Ra = d;
          if (a.Ra === 0 && e === 0)
            return a.Na = b.slice(c, c + d), a.Ra = d;
          if (e + d <= a.Ra)
            return a.Na.set(b.subarray(c, c + d), e), d;
        }
        g = e + d;
        var h = a.Na ? a.Na.length : 0;
        h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), h != 0 && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
        if (a.Na.subarray && b.subarray)
          a.Na.set(b.subarray(c, c + d), e);
        else
          for (g = 0;g < d; g++)
            a.Na[e + g] = b[c + g];
        a.Ra = Math.max(a.Ra, e + d);
        return d;
      }, Va(a, b, c) {
        c === 1 ? b += a.position : c === 2 && (a.node.mode & 61440) === 32768 && (b += a.node.Ra);
        if (0 > b)
          throw new N(28);
        return b;
      }, ib(a, b, c, d, e) {
        if ((a.node.mode & 61440) !== 32768)
          throw new N(43);
        a = a.node.Na;
        if (e & 2 || !a || a.buffer !== m.buffer) {
          e = true;
          d = 65536 * Math.ceil(b / 65536);
          var g = Bb(65536, d);
          g && C.fill(0, g, g + d);
          d = g;
          if (!d)
            throw new N(48);
          if (a) {
            if (0 < c || c + b < a.length)
              a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
            m.set(a, d);
          }
        } else
          e = false, d = a.byteOffset;
        return { Kb: d, Ab: e };
      }, jb(a, b, c, d) {
        O.Ma.write(a, b, 0, d, c, false);
        return 0;
      } } }, ja = (a, b) => {
        var c = 0;
        a && (c |= 365);
        b && (c |= 146);
        return c;
      }, Cb = null, Db = {}, Eb = [], Fb = 1, R = null, Gb = false, Hb = true, Ib = {}, N = class {
        name = "ErrnoError";
        constructor(a) {
          this.Pa = a;
        }
      }, Jb = class {
        gb = {};
        node = null;
        get flags() {
          return this.gb.flags;
        }
        set flags(a) {
          this.gb.flags = a;
        }
        get position() {
          return this.gb.position;
        }
        set position(a) {
          this.gb.position = a;
        }
      }, Kb = class {
        La = {};
        Ma = {};
        ab = null;
        constructor(a, b, c, d) {
          a ||= this;
          this.parent = a;
          this.Xa = a.Xa;
          this.id = Fb++;
          this.name = b;
          this.mode = c;
          this.rdev = d;
          this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & 365) === 365;
        }
        set read(a) {
          a ? this.mode |= 365 : this.mode &= -366;
        }
        get write() {
          return (this.mode & 146) === 146;
        }
        set write(a) {
          a ? this.mode |= 146 : this.mode &= -147;
        }
      };
      function S(a, b = {}) {
        if (!a)
          throw new N(44);
        b.ob ?? (b.ob = true);
        a.charAt(0) === "/" || (a = "//" + a);
        var c = 0;
        a:
          for (;40 > c; c++) {
            a = a.split("/").filter((q) => !!q);
            for (var d = Cb, e = "/", g = 0;g < a.length; g++) {
              var h = g === a.length - 1;
              if (h && b.parent)
                break;
              if (a[g] !== ".")
                if (a[g] === "..")
                  if (e = bb(e), d === d.parent) {
                    a = e + "/" + a.slice(g + 1).join("/");
                    c--;
                    continue a;
                  } else
                    d = d.parent;
                else {
                  e = ia(e + "/" + a[g]);
                  try {
                    d = Q(d, a[g]);
                  } catch (q) {
                    if (q?.Pa === 44 && h && b.Jb)
                      return { path: e };
                    throw q;
                  }
                  !d.ab || h && !b.ob || (d = d.ab.root);
                  if ((d.mode & 61440) === 40960 && (!h || b.$a)) {
                    if (!d.La.readlink)
                      throw new N(52);
                    d = d.La.readlink(d);
                    d.charAt(0) === "/" || (d = bb(e) + "/" + d);
                    a = d + "/" + a.slice(g + 1).join("/");
                    continue a;
                  }
                }
            }
            return { path: e, node: d };
          }
        throw new N(32);
      }
      function ha(a) {
        for (var b;; ) {
          if (a === a.parent)
            return a = a.Xa.zb, b ? a[a.length - 1] !== "/" ? `${a}/${b}` : a + b : a;
          b = b ? `${a.name}/${b}` : a.name;
          a = a.parent;
        }
      }
      function Lb(a, b) {
        for (var c = 0, d = 0;d < b.length; d++)
          c = (c << 5) - c + b.charCodeAt(d) | 0;
        return (a + c >>> 0) % R.length;
      }
      function Ab(a) {
        var b = Lb(a.parent.id, a.name);
        if (R[b] === a)
          R[b] = a.bb;
        else
          for (b = R[b];b; ) {
            if (b.bb === a) {
              b.bb = a.bb;
              break;
            }
            b = b.bb;
          }
      }
      function Q(a, b) {
        var c = P(a.mode) ? (c = Mb(a, "x")) ? c : a.La.lookup ? 0 : 2 : 54;
        if (c)
          throw new N(c);
        for (c = R[Lb(a.id, b)];c; c = c.bb) {
          var d = c.name;
          if (c.parent.id === a.id && d === b)
            return c;
        }
        return a.La.lookup(a, b);
      }
      function zb(a, b, c, d) {
        a = new Kb(a, b, c, d);
        b = Lb(a.parent.id, a.name);
        a.bb = R[b];
        return R[b] = a;
      }
      function P(a) {
        return (a & 61440) === 16384;
      }
      function Nb(a) {
        var b = ["r", "w", "rw"][a & 3];
        a & 512 && (b += "w");
        return b;
      }
      function Mb(a, b) {
        if (Hb)
          return 0;
        if (!b.includes("r") || a.mode & 292) {
          if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73))
            return 2;
        } else
          return 2;
        return 0;
      }
      function Ob(a, b) {
        if (!P(a.mode))
          return 54;
        try {
          return Q(a, b), 20;
        } catch (c) {}
        return Mb(a, "wx");
      }
      function Pb(a, b, c) {
        try {
          var d = Q(a, b);
        } catch (e) {
          return e.Pa;
        }
        if (a = Mb(a, "wx"))
          return a;
        if (c) {
          if (!P(d.mode))
            return 54;
          if (d === d.parent || ha(d) === "/")
            return 10;
        } else if (P(d.mode))
          return 31;
        return 0;
      }
      function Qb(a) {
        if (!a)
          throw new N(63);
        return a;
      }
      function T(a) {
        a = Eb[a];
        if (!a)
          throw new N(8);
        return a;
      }
      function Rb(a, b = -1) {
        a = Object.assign(new Jb, a);
        if (b == -1)
          a: {
            for (b = 0;4096 >= b; b++)
              if (!Eb[b])
                break a;
            throw new N(33);
          }
        a.fd = b;
        return Eb[b] = a;
      }
      function Sb(a, b = -1) {
        a = Rb(a, b);
        a.Ma?.Rb?.(a);
        return a;
      }
      function Tb(a, b, c) {
        var d = a?.Ma.Ua;
        a = d ? a : b;
        d ??= b.La.Ua;
        Qb(d);
        d(a, c);
      }
      var yb = { open(a) {
        a.Ma = Db[a.node.rdev].Ma;
        a.Ma.open?.(a);
      }, Va() {
        throw new N(70);
      } };
      function mb(a, b) {
        Db[a] = { Ma: b };
      }
      function Ub(a, b) {
        var c = b === "/";
        if (c && Cb)
          throw new N(10);
        if (!c && b) {
          var d = S(b, { ob: false });
          b = d.path;
          d = d.node;
          if (d.ab)
            throw new N(10);
          if (!P(d.mode))
            throw new N(54);
        }
        b = { type: a, Wb: {}, zb: b, Ib: [] };
        a = a.Xa(b);
        a.Xa = b;
        b.root = a;
        c ? Cb = a : d && (d.ab = b, d.Xa && d.Xa.Ib.push(b));
      }
      function Vb(a, b, c) {
        var d = S(a, { parent: true }).node;
        a = cb(a);
        if (!a)
          throw new N(28);
        if (a === "." || a === "..")
          throw new N(20);
        var e = Ob(d, a);
        if (e)
          throw new N(e);
        if (!d.La.hb)
          throw new N(63);
        return d.La.hb(d, a, b, c);
      }
      function ka(a, b = 438) {
        return Vb(a, b & 4095 | 32768, 0);
      }
      function U(a, b = 511) {
        return Vb(a, b & 1023 | 16384, 0);
      }
      function Wb(a, b, c) {
        typeof c == "undefined" && (c = b, b = 438);
        Vb(a, b | 8192, c);
      }
      function Xb(a, b) {
        if (!fb(a))
          throw new N(44);
        var c = S(b, { parent: true }).node;
        if (!c)
          throw new N(44);
        b = cb(b);
        var d = Ob(c, b);
        if (d)
          throw new N(d);
        if (!c.La.symlink)
          throw new N(63);
        c.La.symlink(c, b, a);
      }
      function Yb(a) {
        var b = S(a, { parent: true }).node;
        a = cb(a);
        var c = Q(b, a), d = Pb(b, a, true);
        if (d)
          throw new N(d);
        if (!b.La.rmdir)
          throw new N(63);
        if (c.ab)
          throw new N(10);
        b.La.rmdir(b, a);
        Ab(c);
      }
      function ua(a) {
        var b = S(a, { parent: true }).node;
        if (!b)
          throw new N(44);
        a = cb(a);
        var c = Q(b, a), d = Pb(b, a, false);
        if (d)
          throw new N(d);
        if (!b.La.unlink)
          throw new N(63);
        if (c.ab)
          throw new N(10);
        b.La.unlink(b, a);
        Ab(c);
      }
      function Zb(a, b) {
        a = S(a, { $a: !b }).node;
        return Qb(a.La.Ta)(a);
      }
      function $b(a, b, c, d) {
        Tb(a, b, { mode: c & 4095 | b.mode & -4096, ctime: Date.now(), Fb: d });
      }
      function la(a, b) {
        a = typeof a == "string" ? S(a, { $a: true }).node : a;
        $b(null, a, b);
      }
      function ac(a, b, c) {
        if (P(b.mode))
          throw new N(31);
        if ((b.mode & 61440) !== 32768)
          throw new N(28);
        var d = Mb(b, "w");
        if (d)
          throw new N(d);
        Tb(a, b, { size: c, timestamp: Date.now() });
      }
      function ma(a, b, c = 438) {
        if (a === "")
          throw new N(44);
        if (typeof b == "string") {
          var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
          if (typeof d == "undefined")
            throw Error(`Unknown file open mode: ${b}`);
          b = d;
        }
        c = b & 64 ? c & 4095 | 32768 : 0;
        if (typeof a == "object")
          d = a;
        else {
          var e = a.endsWith("/");
          a = S(a, { $a: !(b & 131072), Jb: true });
          d = a.node;
          a = a.path;
        }
        var g = false;
        if (b & 64)
          if (d) {
            if (b & 128)
              throw new N(20);
          } else {
            if (e)
              throw new N(31);
            d = Vb(a, c | 511, 0);
            g = true;
          }
        if (!d)
          throw new N(44);
        (d.mode & 61440) === 8192 && (b &= -513);
        if (b & 65536 && !P(d.mode))
          throw new N(54);
        if (!g && (e = d ? (d.mode & 61440) === 40960 ? 32 : P(d.mode) && (Nb(b) !== "r" || b & 576) ? 31 : Mb(d, Nb(b)) : 44))
          throw new N(e);
        b & 512 && !g && (e = d, e = typeof e == "string" ? S(e, { $a: true }).node : e, ac(null, e, 0));
        b &= -131713;
        e = Rb({ node: d, path: ha(d), flags: b, seekable: true, position: 0, Ma: d.Ma, Lb: [], error: false });
        e.Ma.open && e.Ma.open(e);
        g && la(d, c & 511);
        !k.logReadFiles || b & 1 || a in Ib || (Ib[a] = 1);
        return e;
      }
      function oa(a) {
        if (a.fd === null)
          throw new N(8);
        a.pb && (a.pb = null);
        try {
          a.Ma.close && a.Ma.close(a);
        } catch (b) {
          throw b;
        } finally {
          Eb[a.fd] = null;
        }
        a.fd = null;
      }
      function bc(a, b, c) {
        if (a.fd === null)
          throw new N(8);
        if (!a.seekable || !a.Ma.Va)
          throw new N(70);
        if (c != 0 && c != 1 && c != 2)
          throw new N(28);
        a.position = a.Ma.Va(a, b, c);
        a.Lb = [];
      }
      function cc(a, b, c, d, e) {
        if (0 > d || 0 > e)
          throw new N(28);
        if (a.fd === null)
          throw new N(8);
        if ((a.flags & 2097155) === 1)
          throw new N(8);
        if (P(a.node.mode))
          throw new N(31);
        if (!a.Ma.read)
          throw new N(28);
        var g = typeof e != "undefined";
        if (!g)
          e = a.position;
        else if (!a.seekable)
          throw new N(70);
        b = a.Ma.read(a, b, c, d, e);
        g || (a.position += b);
        return b;
      }
      function na(a, b, c, d, e) {
        if (0 > d || 0 > e)
          throw new N(28);
        if (a.fd === null)
          throw new N(8);
        if ((a.flags & 2097155) === 0)
          throw new N(8);
        if (P(a.node.mode))
          throw new N(31);
        if (!a.Ma.write)
          throw new N(28);
        a.seekable && a.flags & 1024 && bc(a, 0, 2);
        var g = typeof e != "undefined";
        if (!g)
          e = a.position;
        else if (!a.seekable)
          throw new N(70);
        b = a.Ma.write(a, b, c, d, e, undefined);
        g || (a.position += b);
        return b;
      }
      function ta(a) {
        var b = b || 0;
        var c = "binary";
        c !== "utf8" && c !== "binary" && Ma(`Invalid encoding type "${c}"`);
        b = ma(a, b);
        a = Zb(a).size;
        var d = new Uint8Array(a);
        cc(b, d, 0, a, 0);
        c === "utf8" && (d = gb(d));
        oa(b);
        return d;
      }
      function W(a, b, c) {
        a = ia("/dev/" + a);
        var d = ja(!!b, !!c);
        W.yb ?? (W.yb = 64);
        var e = W.yb++ << 8 | 0;
        mb(e, { open(g) {
          g.seekable = false;
        }, close() {
          c?.buffer?.length && c(10);
        }, read(g, h, q, w) {
          for (var t = 0, x = 0;x < w; x++) {
            try {
              var D = b();
            } catch (pb) {
              throw new N(29);
            }
            if (D === undefined && t === 0)
              throw new N(6);
            if (D === null || D === undefined)
              break;
            t++;
            h[q + x] = D;
          }
          t && (g.node.atime = Date.now());
          return t;
        }, write(g, h, q, w) {
          for (var t = 0;t < w; t++)
            try {
              c(h[q + t]);
            } catch (x) {
              throw new N(29);
            }
          w && (g.node.mtime = g.node.ctime = Date.now());
          return t;
        } });
        Wb(a, d, e);
      }
      var X = {};
      function Y(a, b, c) {
        if (b.charAt(0) === "/")
          return b;
        a = a === -100 ? "/" : T(a).path;
        if (b.length == 0) {
          if (!c)
            throw new N(44);
          return a;
        }
        return a + "/" + b;
      }
      function mc(a, b) {
        F[a >> 2] = b.dev;
        F[a + 4 >> 2] = b.mode;
        F[a + 8 >> 2] = b.nlink;
        F[a + 12 >> 2] = b.uid;
        F[a + 16 >> 2] = b.gid;
        F[a + 20 >> 2] = b.rdev;
        G[a + 24 >> 3] = BigInt(b.size);
        E[a + 32 >> 2] = 4096;
        E[a + 36 >> 2] = b.blocks;
        var c = b.atime.getTime(), d = b.mtime.getTime(), e = b.ctime.getTime();
        G[a + 40 >> 3] = BigInt(Math.floor(c / 1000));
        F[a + 48 >> 2] = c % 1000 * 1e6;
        G[a + 56 >> 3] = BigInt(Math.floor(d / 1000));
        F[a + 64 >> 2] = d % 1000 * 1e6;
        G[a + 72 >> 3] = BigInt(Math.floor(e / 1000));
        F[a + 80 >> 2] = e % 1000 * 1e6;
        G[a + 88 >> 3] = BigInt(b.ino);
        return 0;
      }
      var Ec = undefined, Gc = () => {
        var a = E[+Ec >> 2];
        Ec += 4;
        return a;
      }, Hc = 0, Ic = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Jc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Kc = {}, Lc = (a) => {
        Ga = a;
        Ya || 0 < Hc || (k.onExit?.(a), Fa = true);
        xa(a, new Sa(a));
      }, Mc = (a) => {
        if (!Fa)
          try {
            a();
          } catch (b) {
            b instanceof Sa || b == "unwind" || xa(1, b);
          } finally {
            if (!(Ya || 0 < Hc))
              try {
                Ga = a = Ga, Lc(a);
              } catch (b) {
                b instanceof Sa || b == "unwind" || xa(1, b);
              }
          }
      }, Nc = {}, Pc = () => {
        if (!Oc) {
          var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: wa || "./this.program" }, b;
          for (b in Nc)
            Nc[b] === undefined ? delete a[b] : a[b] = Nc[b];
          var c = [];
          for (b in a)
            c.push(`${b}=${a[b]}`);
          Oc = c;
        }
        return Oc;
      }, Oc, Qc = (a, b, c, d) => {
        var e = { string: (t) => {
          var x = 0;
          if (t !== null && t !== undefined && t !== 0) {
            x = ib(t) + 1;
            var D = y(x);
            M(t, C, D, x);
            x = D;
          }
          return x;
        }, array: (t) => {
          var x = y(t.length);
          m.set(t, x);
          return x;
        } };
        a = k["_" + a];
        var g = [], h = 0;
        if (d)
          for (var q = 0;q < d.length; q++) {
            var w = e[c[q]];
            w ? (h === 0 && (h = pa()), g[q] = w(d[q])) : g[q] = d[q];
          }
        c = a(...g);
        return c = function(t) {
          h !== 0 && ra(h);
          return b === "string" ? z(t) : b === "boolean" ? !!t : t;
        }(c);
      }, fa = (a) => {
        var b = ib(a) + 1, c = da(b);
        c && M(a, C, c, b);
        return c;
      }, Rc, Sc = [], A = (a) => {
        Rc.delete(Z.get(a));
        Z.set(a, null);
        Sc.push(a);
      }, Tc = (a) => {
        const b = a.length;
        return [b % 128 | 128, b >> 7, ...a];
      }, Uc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Vc = (a) => Tc(Array.from(a, (b) => Uc[b])), va = (a, b) => {
        if (!Rc) {
          Rc = new WeakMap;
          var c = Z.length;
          if (Rc)
            for (var d = 0;d < 0 + c; d++) {
              var e = Z.get(d);
              e && Rc.set(e, d);
            }
        }
        if (c = Rc.get(a) || 0)
          return c;
        c = Sc.length ? Sc.pop() : Z.grow(1);
        try {
          Z.set(c, a);
        } catch (g) {
          if (!(g instanceof TypeError))
            throw g;
          b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Tc([1, 96, ...Vc(b.slice(1)), ...Vc(b[0] === "v" ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          b = new WebAssembly.Module(b);
          b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
          Z.set(c, b);
        }
        Rc.set(a, c);
        return c;
      };
      R = Array(4096);
      Ub(O, "/");
      U("/tmp");
      U("/home");
      U("/home/web_user");
      (function() {
        U("/dev");
        mb(259, { read: () => 0, write: (d, e, g, h) => h, Va: () => 0 });
        Wb("/dev/null", 259);
        kb(1280, wb);
        kb(1536, xb);
        Wb("/dev/tty", 1280);
        Wb("/dev/tty1", 1536);
        var a = new Uint8Array(1024), b = 0, c = () => {
          b === 0 && (eb(a), b = a.byteLength);
          return a[--b];
        };
        W("random", c);
        W("urandom", c);
        U("/dev/shm");
        U("/dev/shm/tmp");
      })();
      (function() {
        U("/proc");
        var a = U("/proc/self");
        U("/proc/self/fd");
        Ub({ Xa() {
          var b = zb(a, "fd", 16895, 73);
          b.Ma = { Va: O.Ma.Va };
          b.La = { lookup(c, d) {
            c = +d;
            var e = T(c);
            c = { parent: null, Xa: { zb: "fake" }, La: { readlink: () => e.path }, id: c + 1 };
            return c.parent = c;
          }, readdir() {
            return Array.from(Eb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
          } };
          return b;
        } }, "/proc/self/fd");
      })();
      k.noExitRuntime && (Ya = k.noExitRuntime);
      k.print && (Da = k.print);
      k.printErr && (B = k.printErr);
      k.wasmBinary && (Ea = k.wasmBinary);
      k.thisProgram && (wa = k.thisProgram);
      if (k.preInit)
        for (typeof k.preInit == "function" && (k.preInit = [k.preInit]);0 < k.preInit.length; )
          k.preInit.shift()();
      k.stackSave = () => pa();
      k.stackRestore = (a) => ra(a);
      k.stackAlloc = (a) => y(a);
      k.cwrap = (a, b, c, d) => {
        var e = !c || c.every((g) => g === "number" || g === "boolean");
        return b !== "string" && e && !d ? k["_" + a] : (...g) => Qc(a, b, c, g);
      };
      k.addFunction = va;
      k.removeFunction = A;
      k.UTF8ToString = z;
      k.stringToNewUTF8 = fa;
      k.writeArrayToMemory = (a, b) => {
        m.set(a, b);
      };
      var da, ea, Bb, Wc, ra, y, pa, La, Z, Xc = {
        a: (a, b, c, d) => Ma(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
        i: function(a, b) {
          try {
            return a = z(a), la(a, b), 0;
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return -c.Pa;
          }
        },
        L: function(a, b, c) {
          try {
            b = z(b);
            b = Y(a, b);
            if (c & -8)
              return -28;
            var d = S(b, { $a: true }).node;
            if (!d)
              return -44;
            a = "";
            c & 4 && (a += "r");
            c & 2 && (a += "w");
            c & 1 && (a += "x");
            return a && Mb(d, a) ? -2 : 0;
          } catch (e) {
            if (typeof X == "undefined" || e.name !== "ErrnoError")
              throw e;
            return -e.Pa;
          }
        },
        j: function(a, b) {
          try {
            var c = T(a);
            $b(c, c.node, b, false);
            return 0;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return -d.Pa;
          }
        },
        h: function(a) {
          try {
            var b = T(a);
            Tb(b, b.node, { timestamp: Date.now(), Fb: false });
            return 0;
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return -c.Pa;
          }
        },
        b: function(a, b, c) {
          Ec = c;
          try {
            var d = T(a);
            switch (b) {
              case 0:
                var e = Gc();
                if (0 > e)
                  break;
                for (;Eb[e]; )
                  e++;
                return Sb(d, e).fd;
              case 1:
              case 2:
                return 0;
              case 3:
                return d.flags;
              case 4:
                return e = Gc(), d.flags |= e, 0;
              case 12:
                return e = Gc(), Ha[e + 0 >> 1] = 2, 0;
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (g) {
            if (typeof X == "undefined" || g.name !== "ErrnoError")
              throw g;
            return -g.Pa;
          }
        },
        g: function(a, b) {
          try {
            var c = T(a), d = c.node, e = c.Ma.Ta;
            a = e ? c : d;
            e ??= d.La.Ta;
            Qb(e);
            var g = e(a);
            return mc(b, g);
          } catch (h) {
            if (typeof X == "undefined" || h.name !== "ErrnoError")
              throw h;
            return -h.Pa;
          }
        },
        H: function(a, b) {
          b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
          try {
            if (isNaN(b))
              return -61;
            var c = T(a);
            if (0 > b || (c.flags & 2097155) === 0)
              throw new N(28);
            ac(c, c.node, b);
            return 0;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return -d.Pa;
          }
        },
        G: function(a, b) {
          try {
            if (b === 0)
              return -28;
            var c = ib("/") + 1;
            if (b < c)
              return -68;
            M("/", C, a, b);
            return c;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return -d.Pa;
          }
        },
        K: function(a, b) {
          try {
            return a = z(a), mc(b, Zb(a, true));
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return -c.Pa;
          }
        },
        C: function(a, b, c) {
          try {
            return b = z(b), b = Y(a, b), U(b, c), 0;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return -d.Pa;
          }
        },
        J: function(a, b, c, d) {
          try {
            b = z(b);
            var e = d & 256;
            b = Y(a, b, d & 4096);
            return mc(c, e ? Zb(b, true) : Zb(b));
          } catch (g) {
            if (typeof X == "undefined" || g.name !== "ErrnoError")
              throw g;
            return -g.Pa;
          }
        },
        x: function(a, b, c, d) {
          Ec = d;
          try {
            b = z(b);
            b = Y(a, b);
            var e = d ? Gc() : 0;
            return ma(b, c, e).fd;
          } catch (g) {
            if (typeof X == "undefined" || g.name !== "ErrnoError")
              throw g;
            return -g.Pa;
          }
        },
        v: function(a, b, c, d) {
          try {
            b = z(b);
            b = Y(a, b);
            if (0 >= d)
              return -28;
            var e = S(b).node;
            if (!e)
              throw new N(44);
            if (!e.La.readlink)
              throw new N(28);
            var g = e.La.readlink(e);
            var h = Math.min(d, ib(g)), q = m[c + h];
            M(g, C, c, d + 1);
            m[c + h] = q;
            return h;
          } catch (w) {
            if (typeof X == "undefined" || w.name !== "ErrnoError")
              throw w;
            return -w.Pa;
          }
        },
        u: function(a) {
          try {
            return a = z(a), Yb(a), 0;
          } catch (b) {
            if (typeof X == "undefined" || b.name !== "ErrnoError")
              throw b;
            return -b.Pa;
          }
        },
        f: function(a, b) {
          try {
            return a = z(a), mc(b, Zb(a));
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return -c.Pa;
          }
        },
        r: function(a, b, c) {
          try {
            b = z(b);
            b = Y(a, b);
            if (c)
              if (c === 512)
                Yb(b);
              else
                return -28;
            else
              ua(b);
            return 0;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return -d.Pa;
          }
        },
        q: function(a, b, c) {
          try {
            b = z(b);
            b = Y(a, b, true);
            var d = Date.now(), e, g;
            if (c) {
              var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
              q == 1073741823 ? e = d : q == 1073741822 ? e = null : e = 1000 * h + q / 1e6;
              c += 16;
              h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
              q = E[c + 8 >> 2];
              q == 1073741823 ? g = d : q == 1073741822 ? g = null : g = 1000 * h + q / 1e6;
            } else
              g = e = d;
            if ((g ?? e) !== null) {
              a = e;
              var w = S(b, { $a: true }).node;
              Qb(w.La.Ua)(w, { atime: a, mtime: g });
            }
            return 0;
          } catch (t) {
            if (typeof X == "undefined" || t.name !== "ErrnoError")
              throw t;
            return -t.Pa;
          }
        },
        m: () => Ma(""),
        l: () => {
          Ya = false;
          Hc = 0;
        },
        A: function(a, b) {
          a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
          a = new Date(1000 * a);
          E[b >> 2] = a.getSeconds();
          E[b + 4 >> 2] = a.getMinutes();
          E[b + 8 >> 2] = a.getHours();
          E[b + 12 >> 2] = a.getDate();
          E[b + 16 >> 2] = a.getMonth();
          E[b + 20 >> 2] = a.getFullYear() - 1900;
          E[b + 24 >> 2] = a.getDay();
          var c = a.getFullYear();
          E[b + 28 >> 2] = (c % 4 !== 0 || c % 100 === 0 && c % 400 !== 0 ? Jc : Ic)[a.getMonth()] + a.getDate() - 1 | 0;
          E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
          c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
          var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
          E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
        },
        y: function(a, b, c, d, e, g, h) {
          e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
          try {
            var q = T(d);
            if ((b & 2) !== 0 && (c & 2) === 0 && (q.flags & 2097155) !== 2)
              throw new N(2);
            if ((q.flags & 2097155) === 1)
              throw new N(2);
            if (!q.Ma.ib)
              throw new N(43);
            if (!a)
              throw new N(28);
            var w = q.Ma.ib(q, a, e, b, c);
            var t = w.Kb;
            E[g >> 2] = w.Ab;
            F[h >> 2] = t;
            return 0;
          } catch (x) {
            if (typeof X == "undefined" || x.name !== "ErrnoError")
              throw x;
            return -x.Pa;
          }
        },
        z: function(a, b, c, d, e, g) {
          g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
          try {
            var h = T(e);
            if (c & 2) {
              c = g;
              if ((h.node.mode & 61440) !== 32768)
                throw new N(43);
              if (!(d & 2)) {
                var q = C.slice(a, a + b);
                h.Ma.jb && h.Ma.jb(h, q, c, b, d);
              }
            }
          } catch (w) {
            if (typeof X == "undefined" || w.name !== "ErrnoError")
              throw w;
            return -w.Pa;
          }
        },
        n: (a, b) => {
          Kc[a] && (clearTimeout(Kc[a].id), delete Kc[a]);
          if (!b)
            return 0;
          var c = setTimeout(() => {
            delete Kc[a];
            Mc(() => Wc(a, performance.now()));
          }, b);
          Kc[a] = { id: c, Xb: b };
          return 0;
        },
        B: (a, b, c, d) => {
          var e = new Date().getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          F[a >> 2] = 60 * Math.max(g, e);
          E[b >> 2] = Number(g != e);
          b = (h) => {
            var q = Math.abs(h);
            return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
          };
          a = b(g);
          b = b(e);
          e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
        },
        d: () => Date.now(),
        s: () => 2147483648,
        c: () => performance.now(),
        o: (a) => {
          var b = C.length;
          a >>>= 0;
          if (2147483648 < a)
            return false;
          for (var c = 1;4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - La.buffer.byteLength + 65535) / 65536 | 0;
              try {
                La.grow(d);
                Ka();
                var e = 1;
                break a;
              } catch (g) {}
              e = undefined;
            }
            if (e)
              return true;
          }
          return false;
        },
        E: (a, b) => {
          var c = 0, d = 0, e;
          for (e of Pc()) {
            var g = b + c;
            F[a + d >> 2] = g;
            c += M(e, C, g, Infinity) + 1;
            d += 4;
          }
          return 0;
        },
        F: (a, b) => {
          var c = Pc();
          F[a >> 2] = c.length;
          a = 0;
          for (var d of c)
            a += ib(d) + 1;
          F[b >> 2] = a;
          return 0;
        },
        e: function(a) {
          try {
            var b = T(a);
            oa(b);
            return 0;
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return c.Pa;
          }
        },
        p: function(a, b) {
          try {
            var c = T(a);
            m[b] = c.tty ? 2 : P(c.mode) ? 3 : (c.mode & 61440) === 40960 ? 7 : 4;
            Ha[b + 2 >> 1] = 0;
            G[b + 8 >> 3] = BigInt(0);
            G[b + 16 >> 3] = BigInt(0);
            return 0;
          } catch (d) {
            if (typeof X == "undefined" || d.name !== "ErrnoError")
              throw d;
            return d.Pa;
          }
        },
        w: function(a, b, c, d) {
          try {
            a: {
              var e = T(a);
              a = b;
              for (var g, h = b = 0;h < c; h++) {
                var q = F[a >> 2], w = F[a + 4 >> 2];
                a += 8;
                var t = cc(e, m, q, w, g);
                if (0 > t) {
                  var x = -1;
                  break a;
                }
                b += t;
                if (t < w)
                  break;
                typeof g != "undefined" && (g += t);
              }
              x = b;
            }
            F[d >> 2] = x;
            return 0;
          } catch (D) {
            if (typeof X == "undefined" || D.name !== "ErrnoError")
              throw D;
            return D.Pa;
          }
        },
        D: function(a, b, c, d) {
          b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
          try {
            if (isNaN(b))
              return 61;
            var e = T(a);
            bc(e, b, c);
            G[d >> 3] = BigInt(e.position);
            e.pb && b === 0 && c === 0 && (e.pb = null);
            return 0;
          } catch (g) {
            if (typeof X == "undefined" || g.name !== "ErrnoError")
              throw g;
            return g.Pa;
          }
        },
        I: function(a) {
          try {
            var b = T(a);
            return b.Ma?.fsync?.(b);
          } catch (c) {
            if (typeof X == "undefined" || c.name !== "ErrnoError")
              throw c;
            return c.Pa;
          }
        },
        t: function(a, b, c, d) {
          try {
            a: {
              var e = T(a);
              a = b;
              for (var g, h = b = 0;h < c; h++) {
                var q = F[a >> 2], w = F[a + 4 >> 2];
                a += 8;
                var t = na(e, m, q, w, g);
                if (0 > t) {
                  var x = -1;
                  break a;
                }
                b += t;
                if (t < w)
                  break;
                typeof g != "undefined" && (g += t);
              }
              x = b;
            }
            F[d >> 2] = x;
            return 0;
          } catch (D) {
            if (typeof X == "undefined" || D.name !== "ErrnoError")
              throw D;
            return D.Pa;
          }
        },
        k: Lc
      };
      function Yc() {
        function a() {
          k.calledRun = true;
          if (!Fa) {
            if (!k.noFSInit && !Gb) {
              var b, c;
              Gb = true;
              b ??= k.stdin;
              c ??= k.stdout;
              d ??= k.stderr;
              b ? W("stdin", b) : Xb("/dev/tty", "/dev/stdin");
              c ? W("stdout", null, c) : Xb("/dev/tty", "/dev/stdout");
              d ? W("stderr", null, d) : Xb("/dev/tty1", "/dev/stderr");
              ma("/dev/stdin", 0);
              ma("/dev/stdout", 1);
              ma("/dev/stderr", 1);
            }
            Zc.N();
            Hb = false;
            k.onRuntimeInitialized?.();
            if (k.postRun)
              for (typeof k.postRun == "function" && (k.postRun = [k.postRun]);k.postRun.length; ) {
                var d = k.postRun.shift();
                Ua.push(d);
              }
            Ta(Ua);
          }
        }
        if (0 < J)
          Xa = Yc;
        else {
          if (k.preRun)
            for (typeof k.preRun == "function" && (k.preRun = [k.preRun]);k.preRun.length; )
              Wa();
          Ta(Va);
          0 < J ? Xa = Yc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
            setTimeout(() => k.setStatus(""), 1);
            a();
          }, 1)) : a();
        }
      }
      var Zc;
      (async function() {
        function a(c) {
          c = Zc = c.exports;
          k._sqlite3_free = c.P;
          k._sqlite3_value_text = c.Q;
          k._sqlite3_prepare_v2 = c.R;
          k._sqlite3_step = c.S;
          k._sqlite3_reset = c.T;
          k._sqlite3_exec = c.U;
          k._sqlite3_finalize = c.V;
          k._sqlite3_column_name = c.W;
          k._sqlite3_column_text = c.X;
          k._sqlite3_column_type = c.Y;
          k._sqlite3_errmsg = c.Z;
          k._sqlite3_clear_bindings = c._;
          k._sqlite3_value_blob = c.$;
          k._sqlite3_value_bytes = c.aa;
          k._sqlite3_value_double = c.ba;
          k._sqlite3_value_int = c.ca;
          k._sqlite3_value_type = c.da;
          k._sqlite3_result_blob = c.ea;
          k._sqlite3_result_double = c.fa;
          k._sqlite3_result_error = c.ga;
          k._sqlite3_result_int = c.ha;
          k._sqlite3_result_int64 = c.ia;
          k._sqlite3_result_null = c.ja;
          k._sqlite3_result_text = c.ka;
          k._sqlite3_aggregate_context = c.la;
          k._sqlite3_column_count = c.ma;
          k._sqlite3_data_count = c.na;
          k._sqlite3_column_blob = c.oa;
          k._sqlite3_column_bytes = c.pa;
          k._sqlite3_column_double = c.qa;
          k._sqlite3_bind_blob = c.ra;
          k._sqlite3_bind_double = c.sa;
          k._sqlite3_bind_int = c.ta;
          k._sqlite3_bind_text = c.ua;
          k._sqlite3_bind_parameter_index = c.va;
          k._sqlite3_sql = c.wa;
          k._sqlite3_normalized_sql = c.xa;
          k._sqlite3_changes = c.ya;
          k._sqlite3_close_v2 = c.za;
          k._sqlite3_create_function_v2 = c.Aa;
          k._sqlite3_update_hook = c.Ba;
          k._sqlite3_open = c.Ca;
          da = k._malloc = c.Da;
          ea = k._free = c.Ea;
          k._RegisterExtensionFunctions = c.Fa;
          Bb = c.Ga;
          Wc = c.Ha;
          ra = c.Ia;
          y = c.Ja;
          pa = c.Ka;
          La = c.M;
          Z = c.O;
          Ka();
          J--;
          k.monitorRunDependencies?.(J);
          J == 0 && Xa && (c = Xa, Xa = null, c());
          return Zc;
        }
        J++;
        k.monitorRunDependencies?.(J);
        var b = { a: Xc };
        if (k.instantiateWasm)
          return new Promise((c) => {
            k.instantiateWasm(b, (d, e) => {
              c(a(d, e));
            });
          });
        Na ??= k.locateFile ? k.locateFile("sql-wasm.wasm", za) : za + "sql-wasm.wasm";
        return a((await Ra(b)).instance);
      })();
      Yc();
      return Module;
    });
    return initSqlJsPromise;
  };
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = initSqlJs;
    module.exports.default = initSqlJs;
  } else if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return initSqlJs;
    });
  } else if (typeof exports === "object") {
    exports["Module"] = initSqlJs;
  }
});

// src/services/logger.ts
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}
function formatTimestamp() {
  return new Date().toISOString();
}
function truncateIfNeeded(message, maxLength = 1000) {
  if (message.length <= maxLength)
    return message;
  return message.slice(0, maxLength) + "...[truncated]";
}
function log(message, data) {
  try {
    ensureLogDir();
    const timestamp = formatTimestamp();
    const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : "";
    const logLine = `[${timestamp}] ${truncateIfNeeded(message)}${truncateIfNeeded(dataStr)}
`;
    appendFileSync(LOG_FILE, logLine, "utf-8");
  } catch {}
}
var LOG_DIR, LOG_FILE, MAX_LOG_SIZE;
var init_logger = __esm(() => {
  LOG_DIR = join(homedir(), ".local", "share", "opencode-memory");
  LOG_FILE = join(LOG_DIR, "opencode-mem.log");
  MAX_LOG_SIZE = 10 * 1024 * 1024;
});

// src/services/embedding.ts
import { pipeline, env } from "@xenova/transformers";
import { join as join2 } from "node:path";
import { homedir as homedir2 } from "node:os";
import { existsSync as existsSync2, mkdirSync as mkdirSync2 } from "node:fs";

class EmbeddingService {
  static instance;
  extractor = null;
  isLoading = false;
  loadingProgress = 0;
  modelName;
  quantized;
  constructor(modelName, quantized) {
    this.modelName = modelName;
    this.quantized = quantized;
  }
  static getInstance(modelName = "Xenova/paraphrase-multilingual-MiniLM-L12-v2", quantized = true) {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService(modelName, quantized);
    }
    return EmbeddingService.instance;
  }
  async loadModel() {
    if (this.extractor)
      return this.extractor;
    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return this.extractor;
    }
    this.isLoading = true;
    this.loadingProgress = 0;
    try {
      log("Loading embedding model", { model: this.modelName });
      if (!existsSync2(CACHE_DIR)) {
        mkdirSync2(CACHE_DIR, { recursive: true });
      }
      this.extractor = pipeline("feature-extraction", this.modelName, {
        quantized: this.quantized,
        progress_callback: (progress) => {
          if (progress && typeof progress.progress === "number") {
            this.loadingProgress = Math.round(progress.progress);
            if (progress.status === "downloading") {
              log("Model download progress", {
                file: progress.file,
                progress: this.loadingProgress
              });
            }
          }
        }
      });
      await this.extractor;
      this.loadingProgress = 100;
      log("Embedding model loaded successfully", { model: this.modelName });
    } catch (error) {
      log("Failed to load embedding model", { error: String(error) });
      this.extractor = null;
      throw error;
    } finally {
      this.isLoading = false;
    }
    return this.extractor;
  }
  async embed(texts) {
    const model = await this.loadModel();
    try {
      const results = await model(texts, {
        pooling: "mean",
        normalize: true
      });
      const vectors = [];
      for (let i = 0;i < texts.length; i++) {
        const tensor = results[i];
        vectors.push(Array.from(tensor.data));
      }
      return vectors;
    } catch (error) {
      log("Embedding failed", { error: String(error) });
      throw error;
    }
  }
  async embedOne(text) {
    const results = await this.embed([text]);
    return results[0];
  }
  isReady() {
    return this.extractor !== null && !this.isLoading;
  }
  getLoadingProgress() {
    return this.loadingProgress;
  }
  getModelName() {
    return this.modelName;
  }
}
var CACHE_DIR, embeddingService;
var init_embedding = __esm(() => {
  init_logger();
  CACHE_DIR = join2(homedir2(), ".local", "share", "opencode-memory", "models");
  env.cacheDir = CACHE_DIR;
  embeddingService = EmbeddingService.getInstance();
});

// src/services/store.ts
var exports_store = {};
__export(exports_store, {
  resetStore: () => resetStore,
  getStore: () => getStore,
  LocalMemoryStore: () => LocalMemoryStore
});
import { join as join3 } from "node:path";
import { homedir as homedir3 } from "node:os";
import { existsSync as existsSync3, mkdirSync as mkdirSync3, readFileSync, writeFileSync } from "node:fs";
function generateId() {
  return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
function cosineSimilarity(a, b) {
  if (a.length !== b.length)
    return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0;i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0)
    return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
async function initSql() {
  if (SQL)
    return SQL;
  SQL = await import_sql.default({});
  return SQL;
}

class LocalMemoryStore {
  db;
  dataDir;
  dbPath;
  initialized = false;
  sqlReady = false;
  constructor(storageLocation = "user", projectPath) {
    if (storageLocation === "project" && projectPath) {
      this.dataDir = join3(projectPath, ".opencode-memory");
    } else {
      this.dataDir = DATA_DIR_USER;
    }
    if (!existsSync3(this.dataDir)) {
      mkdirSync3(this.dataDir, { recursive: true });
    }
    this.dbPath = join3(this.dataDir, DB_NAME);
    this.initialized = true;
    log("Memory store created", { dataDir: this.dataDir, dbPath: this.dbPath });
  }
  async initDatabase() {
    if (this.sqlReady)
      return;
    const sql = await initSql();
    if (existsSync3(this.dbPath)) {
      const buffer = readFileSync(this.dbPath);
      this.db = new sql.Database(buffer);
    } else {
      this.db = new sql.Database;
    }
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        vector BLOB,
        scope TEXT NOT NULL,
        type TEXT NOT NULL,
        container_tag TEXT NOT NULL,
        project_name TEXT,
        project_path TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        metadata TEXT
      )
    `);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_container_tag ON memories(container_tag)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_scope ON memories(scope)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_created_at ON memories(created_at)`);
    this.saveDatabase();
    this.sqlReady = true;
    log("Database initialized", { dataDir: this.dataDir });
  }
  saveDatabase() {
    if (!this.db)
      return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    writeFileSync(this.dbPath, buffer);
  }
  async addMemory(memory) {
    await this.initDatabase();
    const id = generateId();
    const now = Date.now();
    let vector;
    try {
      vector = await embeddingService.embedOne(memory.content);
    } catch (error) {
      log("Failed to generate embedding", { error: String(error) });
    }
    const vectorBlob = vector ? Buffer.from(new Float32Array(vector).buffer) : null;
    const metadataJson = memory.metadata ? JSON.stringify(memory.metadata) : null;
    this.db.run(`INSERT INTO memories (id, content, vector, scope, type, container_tag, project_name, project_path, created_at, updated_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      memory.content,
      vectorBlob,
      memory.scope,
      memory.type,
      memory.containerTag,
      memory.projectName || null,
      memory.projectPath || null,
      now,
      now,
      metadataJson
    ]);
    this.saveDatabase();
    log("Memory added", { id, scope: memory.scope, type: memory.type });
    return {
      id,
      content: memory.content,
      vector,
      scope: memory.scope,
      type: memory.type,
      containerTag: memory.containerTag,
      projectName: memory.projectName,
      projectPath: memory.projectPath,
      createdAt: now,
      updatedAt: now,
      metadata: memory.metadata
    };
  }
  async getMemory(id) {
    await this.initDatabase();
    const result = this.db.exec("SELECT * FROM memories WHERE id = ?", [id]);
    if (result.length === 0 || result[0].values.length === 0)
      return null;
    return this.rowToMemory(result[0].columns, result[0].values[0]);
  }
  async searchMemories(query, containerTag, options) {
    await this.initDatabase();
    const threshold = options?.threshold ?? 0.6;
    const limit = options?.limit ?? 10;
    let queryVector;
    try {
      queryVector = await embeddingService.embedOne(query);
    } catch (error) {
      log("Failed to generate query embedding", { error: String(error) });
      return [];
    }
    const result = this.db.exec(`SELECT id, content, vector, scope, type, created_at FROM memories WHERE container_tag = ? ORDER BY created_at DESC`, [containerTag]);
    if (result.length === 0)
      return [];
    const rows = result[0].values;
    const results = [];
    for (const row of rows) {
      const vectorData = row[2];
      if (!vectorData)
        continue;
      const memoryVector = Array.from(new Float32Array(vectorData.buffer));
      const similarity = cosineSimilarity(queryVector, memoryVector);
      if (similarity >= threshold) {
        results.push({
          id: row[0],
          content: row[1],
          similarity,
          scope: row[3],
          type: row[4],
          createdAt: row[5]
        });
      }
    }
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }
  async listMemories(containerTag, limit = 20) {
    await this.initDatabase();
    const result = this.db.exec(`SELECT * FROM memories WHERE container_tag = ? ORDER BY created_at DESC LIMIT ?`, [containerTag, limit]);
    if (result.length === 0)
      return [];
    const columns = result[0].columns;
    return result[0].values.map((row) => this.rowToMemory(columns, row));
  }
  async deleteMemory(id) {
    await this.initDatabase();
    this.db.run("DELETE FROM memories WHERE id = ?", [id]);
    this.saveDatabase();
    log("Memory deleted", { id });
    return true;
  }
  async clearMemories(containerTag) {
    await this.initDatabase();
    let count = 0;
    if (containerTag) {
      const result = this.db.exec("SELECT COUNT(*) FROM memories WHERE container_tag = ?", [containerTag]);
      count = result[0]?.values[0]?.[0] || 0;
      this.db.run("DELETE FROM memories WHERE container_tag = ?", [containerTag]);
    } else {
      const result = this.db.exec("SELECT COUNT(*) FROM memories");
      count = result[0]?.values[0]?.[0] || 0;
      this.db.run("DELETE FROM memories");
    }
    this.saveDatabase();
    log("Memories cleared", { containerTag, count });
    return count;
  }
  async getStats() {
    await this.initDatabase();
    const totalResult = this.db.exec("SELECT COUNT(*) FROM memories");
    const userResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'user'");
    const projectResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'project'");
    return {
      total: totalResult[0]?.values[0]?.[0] || 0,
      user: userResult[0]?.values[0]?.[0] || 0,
      project: projectResult[0]?.values[0]?.[0] || 0
    };
  }
  rowToMemory(columns, row) {
    const colIndex = {};
    columns.forEach((col, i) => {
      colIndex[col] = i;
    });
    let vector;
    const vectorData = row[colIndex["vector"]];
    if (vectorData) {
      vector = Array.from(new Float32Array(vectorData.buffer));
    }
    return {
      id: row[colIndex["id"]],
      content: row[colIndex["content"]],
      vector,
      scope: row[colIndex["scope"]],
      type: row[colIndex["type"]],
      containerTag: row[colIndex["container_tag"]],
      projectName: row[colIndex["project_name"]],
      projectPath: row[colIndex["project_path"]],
      createdAt: row[colIndex["created_at"]],
      updatedAt: row[colIndex["updated_at"]],
      metadata: row[colIndex["metadata"]] ? JSON.parse(row[colIndex["metadata"]]) : undefined
    };
  }
  getDataDir() {
    return this.dataDir;
  }
  close() {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
      log("Memory store closed");
    }
  }
}
function getStore(storageLocation = "user", projectPath) {
  if (!storeInstance) {
    storeInstance = new LocalMemoryStore(storageLocation, projectPath);
  }
  return storeInstance;
}
function resetStore() {
  if (storeInstance) {
    storeInstance.close();
    storeInstance = null;
  }
}
var import_sql, DATA_DIR_USER, DB_NAME = "data.db", SQL = null, storeInstance = null;
var init_store = __esm(() => {
  init_logger();
  init_embedding();
  import_sql = __toESM(require_sql_wasm(), 1);
  DATA_DIR_USER = join3(homedir3(), ".local", "share", "opencode-memory");
});

// src/cli.ts
import { join as join4 } from "node:path";
import { homedir as homedir4 } from "node:os";
import { existsSync as existsSync4, mkdirSync as mkdirSync4, readFileSync as readFileSync2, writeFileSync as writeFileSync2, readdirSync, statSync } from "node:fs";
var CONFIG_DIR = join4(homedir4(), ".config", "opencode");
var OPENCODE_CONFIG = join4(CONFIG_DIR, "opencode.jsonc");
var OPENCODE_CONFIG_JSON = join4(CONFIG_DIR, "opencode.json");
var DATA_DIR = join4(homedir4(), ".local", "share", "opencode-memory");
var PLUGIN_NAME = "opencode-mem";
function stripJsoncComments(content) {
  let result = "";
  let inString = false;
  let escape = false;
  for (let i = 0;i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (escape) {
      result += char;
      escape = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (!inString) {
      if (char === "/" && nextChar === "/") {
        while (i < content.length && content[i] !== `
`)
          i++;
        continue;
      }
      if (char === "/" && nextChar === "*") {
        i += 2;
        while (i < content.length && !(content[i] === "*" && content[i + 1] === "/"))
          i++;
        i++;
        continue;
      }
    }
    result += char;
  }
  return result.trim();
}
function readJsonc(path) {
  const content = readFileSync2(path, "utf-8");
  return JSON.parse(stripJsoncComments(content));
}
function writeJson(path, data) {
  writeFileSync2(path, JSON.stringify(data, null, 2), "utf-8");
}
function getOpenCodeConfigPath() {
  if (existsSync4(OPENCODE_CONFIG))
    return OPENCODE_CONFIG;
  if (existsSync4(OPENCODE_CONFIG_JSON))
    return OPENCODE_CONFIG_JSON;
  return null;
}
function formatBytes(bytes) {
  if (bytes === 0)
    return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
function getDirSize(dir) {
  let size = 0;
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join4(dir, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  return size;
}
var commands = {
  install: async () => {
    console.log(`
  Installing ${PLUGIN_NAME}...
`);
    if (!existsSync4(CONFIG_DIR)) {
      mkdirSync4(CONFIG_DIR, { recursive: true });
    }
    const configPath = getOpenCodeConfigPath();
    if (configPath && existsSync4(configPath)) {
      let config;
      try {
        config = readJsonc(configPath);
      } catch (e) {
        console.log(`  ✗ Failed to parse config: ${configPath}`);
        console.log(`  Error: ${e instanceof Error ? e.message : String(e)}`);
        console.log(`
  Please add manually to your config:`);
        console.log(`    "plugin": ["${PLUGIN_NAME}"]
`);
        return;
      }
      if (config.plugin?.includes(PLUGIN_NAME)) {
        console.log(`  ✓ ${PLUGIN_NAME} is already installed
`);
        return;
      }
      if (!config.plugin) {
        config.plugin = [];
      }
      if (!Array.isArray(config.plugin)) {
        config.plugin = [config.plugin];
      }
      config.plugin.push(PLUGIN_NAME);
      try {
        writeJson(configPath, config);
        console.log(`  ✓ Plugin registered in ${configPath}`);
      } catch (e) {
        console.log(`  ✗ Failed to write config`);
        console.log(`
  Please add manually to ${configPath}:`);
        console.log(`    "plugin": ["${PLUGIN_NAME}"]
`);
        return;
      }
    } else {
      const config = { plugin: [PLUGIN_NAME] };
      try {
        writeJson(OPENCODE_CONFIG_JSON, config);
        console.log(`  ✓ Created config at ${OPENCODE_CONFIG_JSON}`);
      } catch (e) {
        console.log(`  ✗ Failed to create config`);
        console.log(`
  Please create ${OPENCODE_CONFIG_JSON} with:`);
        console.log(`    { "plugin": ["${PLUGIN_NAME}"] }
`);
        return;
      }
    }
    if (!existsSync4(DATA_DIR)) {
      mkdirSync4(DATA_DIR, { recursive: true });
    }
    console.log(`  ✓ Created data directory: ${DATA_DIR}`);
    console.log(`
  Next steps:`);
    console.log(`  1. Run '${PLUGIN_NAME} init' to initialize storage`);
    console.log(`  2. Restart OpenCode with: opencode -c
`);
  },
  init: async () => {
    console.log(`
  Initializing ${PLUGIN_NAME}...
`);
    if (!existsSync4(DATA_DIR)) {
      mkdirSync4(DATA_DIR, { recursive: true });
    }
    console.log(`  ✓ Data directory created: ${DATA_DIR}`);
    console.log(`
  Embedding model: Xenova/paraphrase-multilingual-MiniLM-L12-v2`);
    console.log(`  Size: ~420MB (downloaded automatically on first use)`);
    console.log(`
  ✓ Initialization complete!
`);
    console.log(`  Restart OpenCode to use local memory:`);
    console.log(`    opencode -c
`);
  },
  status: async () => {
    console.log(`
  ${PLUGIN_NAME} Status
`);
    const configPath = getOpenCodeConfigPath();
    let installed = false;
    if (configPath && existsSync4(configPath)) {
      try {
        const config = readJsonc(configPath);
        installed = config.plugin?.includes?.(PLUGIN_NAME) || false;
      } catch {}
    }
    console.log(`  Plugin: ${installed ? "✓ Installed" : "✗ Not installed"}`);
    console.log(`  Data Directory: ${DATA_DIR}`);
    console.log(`  Exists: ${existsSync4(DATA_DIR) ? "✓" : "✗"}`);
    const dbPath = join4(DATA_DIR, "data.db");
    if (existsSync4(dbPath)) {
      const dbStats = statSync(dbPath);
      console.log(`  Database: ${formatBytes(dbStats.size)}`);
    }
    const modelsDir = join4(DATA_DIR, "models");
    if (existsSync4(modelsDir)) {
      const modelSize = getDirSize(modelsDir);
      console.log(`  Model Cache: ${formatBytes(modelSize)}`);
    }
    console.log();
  },
  config: async (args) => {
    const subCommand = args[0];
    if (subCommand === "show" || !subCommand) {
      const configPath = join4(CONFIG_DIR, "memory.json");
      console.log(`
  Config file: ${configPath}
`);
      if (existsSync4(configPath)) {
        console.log(readFileSync2(configPath, "utf-8"));
      } else {
        console.log(`  No config file found. Using defaults.
`);
      }
    } else if (subCommand === "set") {
      const key = args[1];
      const value = args[2];
      if (!key || !value) {
        console.log(`  Usage: config set <key> <value>
`);
        return;
      }
      const configPath = join4(CONFIG_DIR, "memory.json");
      let config = {};
      if (existsSync4(configPath)) {
        config = JSON.parse(readFileSync2(configPath, "utf-8"));
      }
      if (value === "true")
        config[key] = true;
      else if (value === "false")
        config[key] = false;
      else if (!isNaN(Number(value)))
        config[key] = Number(value);
      else
        config[key] = value;
      if (!existsSync4(CONFIG_DIR)) {
        mkdirSync4(CONFIG_DIR, { recursive: true });
      }
      writeJson(configPath, config);
      console.log(`
  ✓ Set ${key} = ${value}
`);
    } else if (subCommand === "edit") {
      const configPath = join4(CONFIG_DIR, "memory.json");
      const editor = process.env.EDITOR || process.env.VISUAL || "nano";
      const { execSync } = __require("node:child_process");
      execSync(`${editor} ${configPath}`, { stdio: "inherit" });
    }
  },
  memories: async (args) => {
    const subCommand = args[0];
    const { getStore: getStore2 } = await Promise.resolve().then(() => (init_store(), exports_store));
    const store = getStore2();
    if (subCommand === "list") {
      const scope = args.includes("--scope") ? args[args.indexOf("--scope") + 1] : undefined;
      const limit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1]) : 20;
      const tag = scope === "user" ? `${PLUGIN_NAME}_user_default` : `${PLUGIN_NAME}_project_default`;
      const memories = await store.listMemories(tag, limit);
      console.log(`
  Memories (${scope || "all"}): ${memories.length}
`);
      if (memories.length === 0) {
        console.log(`  No memories found.
`);
        return;
      }
      memories.forEach((m, i) => {
        const date = new Date(m.createdAt).toLocaleDateString();
        console.log(`  ${i + 1}. [${m.type}] ${m.content.slice(0, 60)}${m.content.length > 60 ? "..." : ""}`);
        console.log(`     ID: ${m.id} | ${date}
`);
      });
    } else if (subCommand === "search") {
      const query = args[1];
      if (!query) {
        console.log(`  Usage: memories search <query>
`);
        return;
      }
      const tag = `${PLUGIN_NAME}_project_default`;
      const results = await store.searchMemories(query, tag, { limit: 10 });
      console.log(`
  Search results for "${query}": ${results.length}
`);
      results.forEach((r, i) => {
        const similarity = Math.round(r.similarity * 100);
        console.log(`  ${i + 1}. [${similarity}%] ${r.content.slice(0, 60)}${r.content.length > 60 ? "..." : ""}`);
        console.log(`     ID: ${r.id}
`);
      });
    } else if (subCommand === "add") {
      const content = args.slice(1).join(" ");
      if (!content) {
        console.log(`  Usage: memories add <content>
`);
        return;
      }
      const tag = `${PLUGIN_NAME}_project_default`;
      const memory = await store.addMemory({
        content,
        scope: "project",
        type: "learned-pattern",
        containerTag: tag
      });
      console.log(`
  ✓ Memory added with ID: ${memory.id}
`);
    } else if (subCommand === "forget") {
      const id = args[1];
      if (!id) {
        console.log(`  Usage: memories forget <id>
`);
        return;
      }
      const deleted = await store.deleteMemory(id);
      if (deleted) {
        console.log(`
  ✓ Memory ${id} deleted
`);
      } else {
        console.log(`
  ✗ Memory not found
`);
      }
    } else if (subCommand === "clear") {
      const confirmed = args.includes("--force");
      if (!confirmed) {
        console.log(`  This will delete ALL memories. Use --force to confirm.
`);
        return;
      }
      const count = await store.clearMemories();
      console.log(`
  ✓ Cleared ${count} memories
`);
    } else {
      console.log(`
  Memory Commands:
  
    list [--scope <user|project>] [--limit <n>]   List memories
    search <query>                                 Search memories
    add <content>                                  Add a memory
    forget <id>                                    Delete a memory
    clear --force                                  Delete all memories
`);
    }
  },
  export: async (args) => {
    const outputPath = args[0] || "memories-export.json";
    const { getStore: getStore2 } = await Promise.resolve().then(() => (init_store(), exports_store));
    const store = getStore2();
    const stats = await store.getStats();
    const memories = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      stats,
      memories: []
    };
    const tag = `${PLUGIN_NAME}_project_default`;
    const allMemories = await store.listMemories(tag, 1000);
    memories.memories = allMemories;
    writeFileSync2(outputPath, JSON.stringify(memories, null, 2), "utf-8");
    console.log(`
  ✓ Exported ${allMemories.length} memories to ${outputPath}
`);
  },
  import: async (args) => {
    const inputPath = args[0];
    if (!inputPath || !existsSync4(inputPath)) {
      console.log(`  Usage: import <file>
`);
      return;
    }
    const data = JSON.parse(readFileSync2(inputPath, "utf-8"));
    const { getStore: getStore2 } = await Promise.resolve().then(() => (init_store(), exports_store));
    const store = getStore2();
    let imported = 0;
    const tag = `${PLUGIN_NAME}_project_default`;
    for (const mem of data.memories || []) {
      await store.addMemory({
        content: mem.content,
        scope: mem.scope || "project",
        type: mem.type || "learned-pattern",
        containerTag: tag
      });
      imported++;
    }
    console.log(`
  ✓ Imported ${imported} memories
`);
  },
  model: async (args) => {
    const subCommand = args[0];
    if (subCommand === "clear-cache") {
      const modelsDir = join4(DATA_DIR, "models");
      if (existsSync4(modelsDir)) {
        const { rmSync } = __require("node:fs");
        rmSync(modelsDir, { recursive: true });
        console.log(`
  ✓ Model cache cleared
`);
      } else {
        console.log(`
  No model cache found
`);
      }
    } else {
      console.log(`
  Model Commands:
  
    clear-cache    Clear the embedding model cache
`);
    }
  },
  logs: async () => {
    const logFile = join4(DATA_DIR, "opencode-mem.log");
    if (existsSync4(logFile)) {
      const content = readFileSync2(logFile, "utf-8");
      const lines = content.split(`
`).slice(-50);
      console.log(`
  Last 50 log lines:
`);
      lines.forEach((line) => console.log(`  ${line}`));
    } else {
      console.log(`
  No logs found
`);
    }
  },
  help: async () => {
    console.log(`
  ${PLUGIN_NAME} - Local persistent memory for OpenCode

  Usage: ${PLUGIN_NAME} <command> [options]

  Commands:

    install                Install plugin to OpenCode
    init                   Initialize storage and download model
    status                 Show plugin status
    config [show|set|edit] Manage configuration
    memories <cmd>         Manage memories (list, search, add, forget, clear)
    export [file]          Export memories to JSON
    import <file>          Import memories from JSON
    model <cmd>            Model management (clear-cache)
    logs                   View recent logs
    help                   Show this help

  Examples:

    ${PLUGIN_NAME} install
    ${PLUGIN_NAME} init
    ${PLUGIN_NAME} memories list --scope project
    ${PLUGIN_NAME} memories search "build error"
    ${PLUGIN_NAME} export my-memories.json

  More info: https://github.com/opencode-mem/opencode-mem
`);
  }
};
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  if (commands[command]) {
    await commands[command](args.slice(1));
  } else {
    console.log(`
  Unknown command: ${command}`);
    console.log(`  Run '${PLUGIN_NAME} help' for usage.
`);
    process.exit(1);
  }
}
main().catch((e) => {
  console.error(`
  Error: ${e.message}
`);
  process.exit(1);
});
