'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var shared = require('@vue/shared');
var uniShared = require('@dcloudio/uni-shared');

function assertKey(key, shallow = false) {
    if (!key) {
        throw new Error(`${shallow ? 'shallowSsrRef' : 'ssrRef'}: You must provide a key.`);
    }
}
function proxy$1(target, track, trigger) {
    return new Proxy(target, {
        get(target, prop) {
            track();
            if (shared.isObject(target[prop])) {
                return proxy$1(target[prop], track, trigger);
            }
            return Reflect.get(target, prop);
        },
        set(obj, prop, newVal) {
            const result = Reflect.set(obj, prop, newVal);
            trigger();
            return result;
        },
    });
}
const globalData = {};
const ssrServerRef = (value, key, shallow = false) => {
    assertKey(key, shallow);
    const ctx = vue.getCurrentInstance() && vue.useSSRContext();
    let state;
    if (ctx) {
        const __uniSSR = ctx[uniShared.UNI_SSR] || (ctx[uniShared.UNI_SSR] = {});
        state = __uniSSR[uniShared.UNI_SSR_DATA] || (__uniSSR[uniShared.UNI_SSR_DATA] = {});
    }
    else {
        state = globalData;
    }
    state[key] = uniShared.sanitise(value);
    // SSR 模式下 watchEffect 不生效 https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts#L283
    // 故自定义ref
    return vue.customRef((track, trigger) => {
        const customTrigger = () => (trigger(), (state[key] = uniShared.sanitise(value)));
        return {
            get: () => {
                track();
                if (!shallow && shared.isObject(value)) {
                    return proxy$1(value, track, customTrigger);
                }
                return value;
            },
            set: (v) => {
                value = v;
                customTrigger();
            },
        };
    });
};
const ssrRef = (value, key) => {
    {
        return ssrServerRef(value, key);
    }
};
const shallowSsrRef = (value, key) => {
    {
        return ssrServerRef(value, key, true);
    }
};
function getSsrGlobalData() {
    return uniShared.sanitise(globalData);
}

/**
 * uni 对象是跨实例的，而此处列的 API 均是需要跟当前实例关联的，比如 requireNativePlugin 获取 dom 时，依赖当前 weex 实例
 */
function getCurrentSubNVue() {
    // @ts-ignore
    return uni.getSubNVueById(plus.webview.currentWebview().id);
}
function requireNativePlugin(name) {
    return weex.requireModule(name);
}

function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
}

// @ts-ignore
const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    // post-create lifecycle registrations are noops during SSR
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
};
const onShow = /*#__PURE__*/ createHook(uniShared.ON_SHOW);
const onHide = /*#__PURE__*/ createHook(uniShared.ON_HIDE);
const onLaunch = /*#__PURE__*/ createHook(uniShared.ON_LAUNCH);
const onError = /*#__PURE__*/ createHook(uniShared.ON_ERROR);
const onThemeChange = 
/*#__PURE__*/ createHook(uniShared.ON_THEME_CHANGE);
const onPageNotFound = 
/*#__PURE__*/ createHook(uniShared.ON_PAGE_NOT_FOUND);
const onUnhandledRejection = 
/*#__PURE__*/ createHook(uniShared.ON_UNHANDLE_REJECTION);
const onInit = /*#__PURE__*/ createHook(uniShared.ON_INIT);
// 小程序如果想在 setup 的 props 传递页面参数，需要定义 props，故同时暴露 onLoad 吧
const onLoad = /*#__PURE__*/ createHook(uniShared.ON_LOAD);
const onReady = /*#__PURE__*/ createHook(uniShared.ON_READY);
const onUnload = /*#__PURE__*/ createHook(uniShared.ON_UNLOAD);
const onResize = /*#__PURE__*/ createHook(uniShared.ON_RESIZE);
const onBackPress = 
/*#__PURE__*/ createHook(uniShared.ON_BACK_PRESS);
const onPageScroll = 
/*#__PURE__*/ createHook(uniShared.ON_PAGE_SCROLL);
const onTabItemTap = 
/*#__PURE__*/ createHook(uniShared.ON_TAB_ITEM_TAP);
const onReachBottom = /*#__PURE__*/ createHook(uniShared.ON_REACH_BOTTOM);
const onPullDownRefresh = /*#__PURE__*/ createHook(uniShared.ON_PULL_DOWN_REFRESH);
const onSaveExitState = 
/*#__PURE__*/ createHook(uniShared.ON_SAVE_EXIT_STATE);
const onShareTimeline = 
/*#__PURE__*/ createHook(uniShared.ON_SHARE_TIMELINE);
const onAddToFavorites = 
/*#__PURE__*/ createHook(uniShared.ON_ADD_TO_FAVORITES);
const onShareAppMessage = 
/*#__PURE__*/ createHook(uniShared.ON_SHARE_APP_MESSAGE);
const onNavigationBarButtonTap = 
/*#__PURE__*/ createHook(uniShared.ON_NAVIGATION_BAR_BUTTON_TAP);
const onNavigationBarSearchInputChanged = 
/*#__PURE__*/ createHook(uniShared.ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED);
const onNavigationBarSearchInputClicked = /*#__PURE__*/ createHook(uniShared.ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED);
const onNavigationBarSearchInputConfirmed = 
/*#__PURE__*/ createHook(uniShared.ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED);
const onNavigationBarSearchInputFocusChanged = 
/*#__PURE__*/ createHook(uniShared.ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED);

let callbackId = 1;
let proxy;
const callbacks = {};
function normalizeArg(arg) {
    if (typeof arg === 'function') {
        const id = callbackId++;
        callbacks[id] = arg;
        return id;
    }
    else if (shared.isPlainObject(arg)) {
        Object.keys(arg).forEach((name) => {
            arg[name] = normalizeArg(arg[name]);
        });
    }
    return arg;
}
function initUtsInstanceMethod(async, opts) {
    return initProxyFunction(async, opts);
}
function getProxy() {
    if (!proxy) {
        proxy = uni.requireNativePlugin('UTS-Proxy');
    }
    return proxy;
}
function resolveSyncResult(res) {
    if (res.errMsg) {
        throw new Error(res.errMsg);
    }
    return res.params;
}
function invokePropGetter(args) {
    return resolveSyncResult(getProxy().invokeSync(args, () => { }));
}
function initProxyFunction(async, { package: pkg, class: cls, name: propOrMethod, id: instanceId, }) {
    const invokeCallback = ({ id, name, params, keepAlive, }) => {
        const callback = callbacks[id];
        if (callback) {
            callback(...params);
            if (!keepAlive) {
                delete callbacks[id];
            }
        }
        else {
            console.error(`${pkg}${cls}.${propOrMethod} ${name} is not found`);
        }
    };
    const baseArgs = instanceId
        ? { id: instanceId, name: propOrMethod }
        : {
            package: pkg,
            class: cls,
            name: propOrMethod,
        };
    return (...args) => {
        const invokeArgs = shared.extend({}, baseArgs, {
            params: args.map((arg) => normalizeArg(arg)),
        });
        if (async) {
            return new Promise((resolve, reject) => {
                getProxy().invokeAsync(invokeArgs, (res) => {
                    if (res.type !== 'return') {
                        invokeCallback(res);
                    }
                    else {
                        if (res.errMsg) {
                            reject(res.errMsg);
                        }
                        else {
                            resolve(res.params);
                        }
                    }
                });
            });
        }
        return resolveSyncResult(getProxy().invokeSync(invokeArgs, invokeCallback));
    };
}
function initUtsStaticMethod(async, opts) {
    return initProxyFunction(async, opts);
}
const initUtsProxyFunction = initUtsStaticMethod;
function initUtsProxyClass({ package: pkg, class: cls, methods, props, staticProps, staticMethods, }) {
    const baseOptions = {
        package: pkg,
        class: cls,
    };
    return class ProxyClass {
        constructor(...params) {
            const target = {};
            // 初始化实例 ID
            const instanceId = initProxyFunction(false, shared.extend({ name: 'constructor', params }, baseOptions)).apply(null, params);
            return new Proxy(this, {
                get(_, name) {
                    if (!target[name]) {
                        //实例方法
                        if (shared.hasOwn(methods, name)) {
                            target[name] = initUtsInstanceMethod(!!methods[name].async, shared.extend({
                                id: instanceId,
                                name,
                            }, baseOptions));
                        }
                        else if (shared.hasOwn(staticMethods, name)) {
                            // 静态方法
                            target[name] = initUtsStaticMethod(!!staticMethods[name].async, shared.extend({ name }, baseOptions));
                        }
                        else if (props.includes(name)) {
                            // 实例属性
                            return invokePropGetter({ id: instanceId, name: name });
                        }
                        else if (staticProps.includes(name)) {
                            // 静态属性
                            return invokePropGetter(shared.extend({ name: name }, baseOptions));
                        }
                    }
                    return target[name];
                },
            });
        }
    };
}

exports.getCurrentSubNVue = getCurrentSubNVue;
exports.getSsrGlobalData = getSsrGlobalData;
exports.initUtsProxyClass = initUtsProxyClass;
exports.initUtsProxyFunction = initUtsProxyFunction;
exports.onAddToFavorites = onAddToFavorites;
exports.onBackPress = onBackPress;
exports.onError = onError;
exports.onHide = onHide;
exports.onInit = onInit;
exports.onLaunch = onLaunch;
exports.onLoad = onLoad;
exports.onNavigationBarButtonTap = onNavigationBarButtonTap;
exports.onNavigationBarSearchInputChanged = onNavigationBarSearchInputChanged;
exports.onNavigationBarSearchInputClicked = onNavigationBarSearchInputClicked;
exports.onNavigationBarSearchInputConfirmed = onNavigationBarSearchInputConfirmed;
exports.onNavigationBarSearchInputFocusChanged = onNavigationBarSearchInputFocusChanged;
exports.onPageNotFound = onPageNotFound;
exports.onPageScroll = onPageScroll;
exports.onPullDownRefresh = onPullDownRefresh;
exports.onReachBottom = onReachBottom;
exports.onReady = onReady;
exports.onResize = onResize;
exports.onSaveExitState = onSaveExitState;
exports.onShareAppMessage = onShareAppMessage;
exports.onShareTimeline = onShareTimeline;
exports.onShow = onShow;
exports.onTabItemTap = onTabItemTap;
exports.onThemeChange = onThemeChange;
exports.onUnhandledRejection = onUnhandledRejection;
exports.onUnload = onUnload;
exports.requireNativePlugin = requireNativePlugin;
exports.resolveEasycom = resolveEasycom;
exports.shallowSsrRef = shallowSsrRef;
exports.ssrRef = ssrRef;
