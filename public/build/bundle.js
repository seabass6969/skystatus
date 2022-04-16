
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.6 */

    const { Error: Error_1, Object: Object_1, console: console_1$3 } = globals;

    // (251:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/ah.svelte generated by Svelte v3.46.6 */

    function create_fragment$h(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ah', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ah> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Ah extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ah",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/component/thinking.svelte generated by Svelte v3.46.6 */

    const file$e = "src/component/thinking.svelte";

    function create_fragment$g(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/Villager.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "villager thinking");
    			attr_dev(img, "class", "spin svelte-1ac2uz0");
    			add_location(img, file$e, 19, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Thinking', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thinking> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Thinking extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thinking",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var products$1 = [
    	"BROWN_MUSHROOM",
    	"INK_SACK:3",
    	"SPOOKY_SHARD",
    	"INK_SACK:4",
    	"TARANTULA_WEB",
    	"CARROT_ITEM",
    	"ENCHANTED_POTATO",
    	"EXP_BOTTLE",
    	"JERRY_BOX_GREEN",
    	"ENCHANTED_SLIME_BALL",
    	"ENCHANTED_RED_MUSHROOM",
    	"ENCHANTED_GOLDEN_CARROT",
    	"ENCHANTED_RABBIT_HIDE",
    	"FLAWED_AMETHYST_GEM",
    	"PERFECT_JADE_GEM",
    	"ENCHANTED_BIRCH_LOG",
    	"ENCHANTED_GUNPOWDER",
    	"ENCHANTED_MELON",
    	"ENCHANTED_SUGAR",
    	"CACTUS",
    	"ENCHANTED_BLAZE_ROD",
    	"FLAWED_JASPER_GEM",
    	"ENCHANTED_CAKE",
    	"PUMPKIN",
    	"ENCHANTED_BROWN_MUSHROOM",
    	"GOBLIN_EGG_YELLOW",
    	"NURSE_SHARK_TOOTH",
    	"WHEAT",
    	"FLAWED_AMBER_GEM",
    	"ENCHANTED_RAW_SALMON",
    	"ENCHANTED_GLISTERING_MELON",
    	"PRISMARINE_SHARD",
    	"PROTECTOR_FRAGMENT",
    	"ENCHANTED_EMERALD",
    	"ENCHANTED_SPIDER_EYE",
    	"RED_MUSHROOM",
    	"GRAND_EXP_BOTTLE",
    	"MUTTON",
    	"ENCHANTED_MELON_BLOCK",
    	"POWER_CRYSTAL",
    	"RAW_SOULFLOW",
    	"WISE_FRAGMENT",
    	"DIAMOND",
    	"SHARK_FIN",
    	"COBBLESTONE",
    	"REFINED_MITHRIL",
    	"RAW_FISH",
    	"SPIDER_EYE",
    	"PERFECT_RUBY_GEM",
    	"ENCHANTED_PUFFERFISH",
    	"YOGGIE",
    	"PERFECT_JASPER_GEM",
    	"POTATO_ITEM",
    	"ENCHANTED_NETHERRACK",
    	"ENCHANTED_HUGE_MUSHROOM_1",
    	"ENCHANTED_HARD_STONE",
    	"REFINED_DIAMOND",
    	"TIGHTLY_TIED_HAY_BALE",
    	"ENCHANTED_COBBLESTONE",
    	"ENCHANTED_HUGE_MUSHROOM_2",
    	"PORK",
    	"PRISMARINE_CRYSTALS",
    	"ICE",
    	"HUGE_MUSHROOM_1",
    	"TIGER_SHARK_TOOTH",
    	"HUGE_MUSHROOM_2",
    	"ICE_BAIT",
    	"LOG_2:1",
    	"ENCHANTED_SNOW_BLOCK",
    	"GOLDEN_TOOTH",
    	"STRING",
    	"CHEESE_FUEL",
    	"HYPER_CATALYST",
    	"RABBIT_FOOT",
    	"REDSTONE",
    	"JERRY_BOX_GOLDEN",
    	"PUMPKIN_GUTS",
    	"ENCHANTED_CACTUS_GREEN",
    	"BOOSTER_COOKIE",
    	"ENCHANTED_CARROT_ON_A_STICK",
    	"ENCHANTED_ENDSTONE",
    	"ENCHANTED_COOKIE",
    	"ENCHANTED_LAPIS_LAZULI_BLOCK",
    	"ENCHANTED_SAND",
    	"COLOSSAL_EXP_BOTTLE",
    	"ENCHANTED_STRING",
    	"STRONG_FRAGMENT",
    	"SLIME_BALL",
    	"SNOW_BALL",
    	"ENCHANTED_ACACIA_LOG",
    	"HOLY_FRAGMENT",
    	"ENCHANTED_EGG",
    	"SAND",
    	"SOUL_FRAGMENT",
    	"FLAWED_RUBY_GEM",
    	"FINE_JADE_GEM",
    	"RAW_CHICKEN",
    	"PLASMA_BUCKET",
    	"ANCIENT_CLAW",
    	"FLAWLESS_JASPER_GEM",
    	"ENCHANTED_LAPIS_LAZULI",
    	"ENCHANTED_GHAST_TEAR",
    	"ENCHANTED_COCOA",
    	"CARROT_BAIT",
    	"FINE_TOPAZ_GEM",
    	"SEEDS",
    	"FINE_RUBY_GEM",
    	"ENCHANTED_LEATHER",
    	"ENCHANTED_SHARK_FIN",
    	"ENCHANTED_SPONGE",
    	"PERFECT_AMBER_GEM",
    	"HAY_BLOCK",
    	"INK_SACK",
    	"FLINT",
    	"ENCHANTED_SPRUCE_LOG",
    	"ENCHANTED_ROTTEN_FLESH",
    	"WOLF_TOOTH",
    	"ENCHANTED_GRILLED_PORK",
    	"ENCHANTED_NETHER_STALK",
    	"ENCHANTED_REDSTONE_BLOCK",
    	"ENCHANTED_QUARTZ_BLOCK",
    	"ENCHANTED_ANCIENT_CLAW",
    	"GREEN_CANDY",
    	"ENCHANTED_REDSTONE",
    	"ENCHANTED_REDSTONE_LAMP",
    	"TREASURITE",
    	"DWARVEN_COMPACTOR",
    	"GREAT_WHITE_SHARK_TOOTH",
    	"GRAVEL",
    	"MELON",
    	"ENCHANTED_PACKED_ICE",
    	"ENCHANTED_LAVA_BUCKET",
    	"RAW_FISH:3",
    	"ENCHANTED_PRISMARINE_SHARD",
    	"ENCHANTED_CARROT_STICK",
    	"ENCHANTED_IRON_BLOCK",
    	"RECOMBOBULATOR_3000",
    	"BONE",
    	"RAW_FISH:2",
    	"RAW_FISH:1",
    	"REVENANT_FLESH",
    	"ENCHANTED_GLOWSTONE",
    	"ENCHANTED_PORK",
    	"GOBLIN_EGG_RED",
    	"ROUGH_JASPER_GEM",
    	"FEATHER",
    	"WHALE_BAIT",
    	"NETHERRACK",
    	"SPONGE",
    	"BLAZE_ROD",
    	"ENCHANTED_DARK_OAK_LOG",
    	"YOUNG_FRAGMENT",
    	"FLAWLESS_TOPAZ_GEM",
    	"ENCHANTED_CLOWNFISH",
    	"REFINED_MINERAL",
    	"ENCHANTED_GOLD",
    	"ENCHANTED_RAW_CHICKEN",
    	"ENCHANTED_WATER_LILY",
    	"ROUGH_AMETHYST_GEM",
    	"ROUGH_RUBY_GEM",
    	"GOBLIN_EGG_BLUE",
    	"LOG:1",
    	"NULL_ATOM",
    	"FLAWLESS_RUBY_GEM",
    	"TITANIUM_ORE",
    	"BLUE_SHARK_TOOTH",
    	"CATALYST",
    	"LOG:3",
    	"LOG:2",
    	"BLESSED_BAIT",
    	"ENCHANTED_GLOWSTONE_DUST",
    	"ENCHANTED_INK_SACK",
    	"ENCHANTED_CACTUS",
    	"ENCHANTED_SUGAR_CANE",
    	"FLAWLESS_SAPPHIRE_GEM",
    	"ENCHANTED_COOKED_SALMON",
    	"ENCHANTED_SEEDS",
    	"CONCENTRATED_STONE",
    	"LOG",
    	"JACOBS_TICKET",
    	"ENCHANTED_BONE_BLOCK",
    	"GHAST_TEAR",
    	"ABSOLUTE_ENDER_PEARL",
    	"ENCHANTED_ENDER_PEARL",
    	"UNSTABLE_FRAGMENT",
    	"PURPLE_CANDY",
    	"SPIKED_BAIT",
    	"POLISHED_PUMPKIN",
    	"ENCHANTED_FERMENTED_SPIDER_EYE",
    	"ENCHANTED_GOLD_BLOCK",
    	"ROUGH_JADE_GEM",
    	"ENCHANTED_JUNGLE_LOG",
    	"ENCHANTED_FLINT",
    	"IRON_INGOT",
    	"ENCHANTED_EMERALD_BLOCK",
    	"NULL_OVOID",
    	"ENCHANTED_CLAY_BALL",
    	"ROUGH_SAPPHIRE_GEM",
    	"GLOWSTONE_DUST",
    	"GOLD_INGOT",
    	"REVENANT_VISCERA",
    	"PERFECT_AMETHYST_GEM",
    	"TARANTULA_SILK",
    	"TITANIC_EXP_BOTTLE",
    	"ENCHANTED_MUTTON",
    	"NULL_SPHERE",
    	"SUPER_EGG",
    	"SUPER_COMPACTOR_3000",
    	"ENCHANTED_IRON",
    	"STOCK_OF_STONKS",
    	"MITHRIL_ORE",
    	"ENCHANTED_HAY_BLOCK",
    	"ENCHANTED_BONE",
    	"ENCHANTED_PAPER",
    	"ENCHANTED_TITANIUM",
    	"ENCHANTED_DIAMOND_BLOCK",
    	"SPOOKY_BAIT",
    	"MAGMA_BUCKET",
    	"SUPERIOR_FRAGMENT",
    	"GOBLIN_EGG_GREEN",
    	"EMERALD",
    	"ENCHANTED_RABBIT_FOOT",
    	"LIGHT_BAIT",
    	"ENCHANTED_ICE",
    	"HOT_POTATO_BOOK",
    	"CLAY_BALL",
    	"ARACHNE_KEEPER_FRAGMENT",
    	"OLD_FRAGMENT",
    	"GREEN_GIFT",
    	"WORM_MEMBRANE",
    	"FLAWLESS_AMETHYST_GEM",
    	"ROUGH_TOPAZ_GEM",
    	"PACKED_ICE",
    	"ROUGH_AMBER_GEM",
    	"WATER_LILY",
    	"LOG_2",
    	"HAMSTER_WHEEL",
    	"ENCHANTED_OBSIDIAN",
    	"FINE_AMBER_GEM",
    	"ENCHANTED_COAL",
    	"COAL",
    	"ENCHANTED_QUARTZ",
    	"ENDER_PEARL",
    	"ENCHANTED_COAL_BLOCK",
    	"WEREWOLF_SKIN",
    	"GOBLIN_EGG",
    	"ENCHANTED_PRISMARINE_CRYSTALS",
    	"PERFECT_TOPAZ_GEM",
    	"DAEDALUS_STICK",
    	"ENCHANTED_WET_SPONGE",
    	"FLAWED_JADE_GEM",
    	"ENCHANTED_RAW_FISH",
    	"ENDER_STONE",
    	"QUARTZ",
    	"FOUL_FLESH",
    	"JERRY_BOX_PURPLE",
    	"RAW_BEEF",
    	"SLUDGE_JUICE",
    	"ENCHANTED_EYE_OF_ENDER",
    	"ECTOPLASM",
    	"SUGAR_CANE",
    	"MAGMA_CREAM",
    	"SHARK_BAIT",
    	"RED_GIFT",
    	"ENCHANTED_MITHRIL",
    	"JERRY_BOX_BLUE",
    	"ENCHANTED_RAW_BEEF",
    	"ENCHANTED_FEATHER",
    	"ENCHANTED_SLIME_BLOCK",
    	"ENCHANTED_OAK_LOG",
    	"RABBIT_HIDE",
    	"WHITE_GIFT",
    	"NETHER_STALK",
    	"SULPHUR",
    	"RABBIT",
    	"FINE_SAPPHIRE_GEM",
    	"DARK_BAIT",
    	"ENCHANTED_CARROT",
    	"ENCHANTED_PUMPKIN",
    	"GRIFFIN_FEATHER",
    	"ROTTEN_FLESH",
    	"ENCHANTED_COOKED_FISH",
    	"OBSIDIAN",
    	"SOULFLOW",
    	"MINNOW_BAIT",
    	"ENCHANTED_MAGMA_CREAM",
    	"ENCHANTED_FIREWORK_ROCKET",
    	"STARFALL",
    	"FLAWLESS_JADE_GEM",
    	"HARD_STONE",
    	"FLAWED_TOPAZ_GEM",
    	"LEATHER",
    	"ENCHANTED_COOKED_MUTTON",
    	"FINE_AMETHYST_GEM",
    	"REFINED_TITANIUM",
    	"ENCHANTED_RABBIT",
    	"SOUL_STRING",
    	"MUTANT_NETHER_STALK",
    	"ENCHANTED_BREAD",
    	"FUMING_POTATO_BOOK",
    	"FINE_JASPER_GEM",
    	"FLAWED_SAPPHIRE_GEM",
    	"ENCHANTED_CHARCOAL",
    	"FLAWLESS_AMBER_GEM",
    	"ENCHANTED_BLAZE_POWDER",
    	"SUMMONING_EYE",
    	"PERFECT_SAPPHIRE_GEM",
    	"FISH_BAIT",
    	"SNOW_BLOCK",
    	"ENCHANTED_BAKED_POTATO",
    	"COMPACTOR",
    	"ENCHANTED_DIAMOND",
    	"BAZAAR_COOKIE"
    ];
    var json$1 = {
    	products: products$1
    };

    var products = [
    	{
    		name: "COCO_BEAN",
    		replacer: "INK_SACK:3"
    	},
    	{
    		name: "CLAY",
    		replacer: "CLAY_BALL"
    	},
    	{
    		name: "ENCHANTED_CLAY",
    		replacer: "ENCHANTED_CLAY_BALL"
    	}
    ];
    var replacer = {
    	products: products
    };

    /* src/routes/bazaar.svelte generated by Svelte v3.46.6 */
    const file$d = "src/routes/bazaar.svelte";

    // (66:0) {:catch error}
    function create_catch_block$2(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[6] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("the error is ");
    			t1 = text(t1_value);
    			add_location(p, file$d, 66, 0, 2193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(66:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {:then output}
    function create_then_block$2(ctx) {
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let if_block_anchor;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*output*/ ctx[5].success) return create_if_block$4;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "type item to search on bz:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "subtext thirdcolor");
    			add_location(h1, file$d, 52, 0, 1349);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "maincolor hoverinput textbox svelte-17slas8");
    			add_location(input, file$d, 53, 0, 1412);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*itemname*/ ctx[0]);
    			insert_dev(target, t2, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*itemname*/ 1 && input.value !== /*itemname*/ ctx[0]) {
    				set_input_value(input, /*itemname*/ ctx[0]);
    			}

    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(52:0) {:then output}",
    		ctx
    	});

    	return block;
    }

    // (63:0) {:else}
    function create_else_block$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "The code must be fuck up";
    			add_location(h1, file$d, 63, 0, 2138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(63:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:0) {#if output.success}
    function create_if_block$4(ctx) {
    	let t0;
    	let p;
    	let t1;
    	let t2_value = Date(/*output*/ ctx[5]["lastUpdated"]) + "";
    	let t2;
    	let if_block = /*done*/ ctx[2] == true && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text("last update is: ");
    			t2 = text(t2_value);
    			attr_dev(p, "class", "smalltext maincolor");
    			add_location(p, file$d, 61, 4, 2049);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (/*done*/ ctx[2] == true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(55:0) {#if output.success}",
    		ctx
    	});

    	return block;
    }

    // (56:0) {#if done == true}
    function create_if_block_1$4(ctx) {
    	let p0;
    	let t0;
    	let t1_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["sellPrice"].toFixed(2) + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["sellVolume"].toFixed(2) + "";
    	let t4;
    	let t5;
    	let p2;
    	let t6;
    	let t7_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["buyPrice"].toFixed(2) + "";
    	let t7;
    	let t8;
    	let p3;
    	let t9;
    	let t10_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["buyVolume"].toFixed(2) + "";
    	let t10;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("sell price is: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("sell volume is: ");
    			t4 = text(t4_value);
    			t5 = space();
    			p2 = element("p");
    			t6 = text("buy price is: ");
    			t7 = text(t7_value);
    			t8 = space();
    			p3 = element("p");
    			t9 = text("buy volume is: ");
    			t10 = text(t10_value);
    			attr_dev(p0, "class", "subtext maincolor");
    			add_location(p0, file$d, 56, 0, 1531);
    			attr_dev(p1, "class", "subtext maincolor");
    			add_location(p1, file$d, 57, 0, 1658);
    			attr_dev(p2, "class", "subtext maincolor");
    			add_location(p2, file$d, 58, 0, 1787);
    			attr_dev(p3, "class", "subtext maincolor");
    			add_location(p3, file$d, 59, 0, 1912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t9);
    			append_dev(p3, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*realproccessname*/ 2 && t1_value !== (t1_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["sellPrice"].toFixed(2) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*realproccessname*/ 2 && t4_value !== (t4_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["sellVolume"].toFixed(2) + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*realproccessname*/ 2 && t7_value !== (t7_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["buyPrice"].toFixed(2) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*realproccessname*/ 2 && t10_value !== (t10_value = /*output*/ ctx[5]["products"][/*realproccessname*/ ctx[1]]["quick_status"]["buyVolume"].toFixed(2) + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(56:0) {#if done == true}",
    		ctx
    	});

    	return block;
    }

    // (50:12)  <Thinking /> {:then output}
    function create_pending_block$2(ctx) {
    	let thinking;
    	let current;
    	thinking = new Thinking({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(thinking.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(thinking, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thinking.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thinking.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thinking, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(50:12)  <Thinking /> {:then output}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 5,
    		error: 6,
    		blocks: [,,,]
    	};

    	handle_promise(/*out*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			div = element("div");
    			document.title = "bazaar";
    			attr_dev(div, "class", "back-bg svelte-17slas8");
    			add_location(div, file$d, 68, 0, 2230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => t1.parentNode;
    			info.anchor = t1;
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getBazaar() {
    	let response = await fetch("https://api.hypixel.net/skyblock/bazaar");
    	let output = await response.json();
    	return output;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bazaar', slots, []);
    	let out = getBazaar();
    	let itemname = "";
    	let realproccessname = "";
    	let done = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bazaar> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		itemname = this.value;
    		$$invalidate(0, itemname);
    	}

    	$$self.$capture_state = () => ({
    		Thinking,
    		json: json$1,
    		replacer,
    		getBazaar,
    		out,
    		itemname,
    		realproccessname,
    		done
    	});

    	$$self.$inject_state = $$props => {
    		if ('out' in $$props) $$invalidate(3, out = $$props.out);
    		if ('itemname' in $$props) $$invalidate(0, itemname = $$props.itemname);
    		if ('realproccessname' in $$props) $$invalidate(1, realproccessname = $$props.realproccessname);
    		if ('done' in $$props) $$invalidate(2, done = $$props.done);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*itemname, realproccessname*/ 3) {
    			{
    				$$invalidate(2, done = false);
    				$$invalidate(1, realproccessname = itemname.toUpperCase().replaceAll(" ", "_"));

    				for (let a = 0; a < replacer.products.length; a++) {
    					if (realproccessname == replacer.products[a].name) $$invalidate(1, realproccessname = replacer.products[a].replacer);
    				}

    				for (let i = 0; i < json$1.products.length; i++) {
    					if (realproccessname == json$1.products[i]) {
    						$$invalidate(2, done = true);
    					}
    				}
    			}
    		}
    	};

    	return [itemname, realproccessname, done, out, input_input_handler];
    }

    class Bazaar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bazaar",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/routes/contactme.svelte generated by Svelte v3.46.6 */
    const file$c = "src/routes/contactme.svelte";

    function create_fragment$e(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let t3;
    	let p2;
    	let t4;
    	let br0;
    	let br1;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let t6;
    	let p3;
    	let p4;
    	let t7;
    	let a1;
    	let t9;
    	let p5;
    	let t11;
    	let div0;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t12;
    	let t13;
    	let p6;
    	let t15;
    	let div3;
    	let div1;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t16;
    	let t17;
    	let div2;
    	let a4;
    	let img4;
    	let img4_src_value;
    	let t18;
    	let t19;
    	let div4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "contact me:";
    			t1 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t2 = text("Discord: Netscapes#9407");
    			t3 = space();
    			p2 = element("p");
    			t4 = text("I accept suggestion! Feel free to file issue in github. Also you can do pull request");
    			br0 = element("br");
    			br1 = element("br");
    			a0 = element("a");
    			img1 = element("img");
    			t5 = text("github repo");
    			t6 = space();
    			p3 = element("p");
    			p4 = element("p");
    			t7 = text("Main website: ");
    			a1 = element("a");
    			a1.textContent = "cephas.monster";
    			t9 = space();
    			p5 = element("p");
    			p5.textContent = "myself:";
    			t11 = space();
    			div0 = element("div");
    			a2 = element("a");
    			img2 = element("img");
    			t12 = text("6l6l");
    			t13 = space();
    			p6 = element("p");
    			p6.textContent = "my tester:";
    			t15 = space();
    			div3 = element("div");
    			div1 = element("div");
    			a3 = element("a");
    			img3 = element("img");
    			t16 = text("ShadowStriken15");
    			t17 = space();
    			div2 = element("div");
    			a4 = element("a");
    			img4 = element("img");
    			t18 = text("MADHAVMEHTA");
    			t19 = space();
    			div4 = element("div");
    			attr_dev(p0, "class", "subtext");
    			add_location(p0, file$c, 26, 0, 491);
    			if (!src_url_equal(img0.src, img0_src_value = "/Discord-Logo-Color.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "discord logo");
    			attr_dev(img0, "class", "normalimage");
    			add_location(img0, file$c, 27, 22, 548);
    			attr_dev(p1, "class", "subsubtext");
    			add_location(p1, file$c, 27, 0, 526);
    			add_location(br0, file$c, 28, 106, 756);
    			add_location(br1, file$c, 28, 111, 761);
    			if (!src_url_equal(img1.src, img1_src_value = "/github.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Github logo");
    			attr_dev(img1, "class", "normalimage");
    			add_location(img1, file$c, 28, 167, 817);
    			attr_dev(a0, "href", "https://github.com/seabass6969/skystatus");
    			add_location(a0, file$c, 28, 116, 766);
    			attr_dev(p2, "class", "subsubtext");
    			add_location(p2, file$c, 28, 0, 650);
    			add_location(p3, file$c, 28, 246, 896);
    			attr_dev(a1, "href", "https://cephas.monster");
    			add_location(a1, file$c, 29, 36, 936);
    			attr_dev(p4, "class", "subsubtext");
    			add_location(p4, file$c, 29, 0, 900);
    			attr_dev(p5, "class", "subsubtext");
    			add_location(p5, file$c, 30, 0, 992);
    			if (!src_url_equal(img2.src, img2_src_value = "https://crafatar.com/renders/head/6b350daa18d946e9a5a08cd6102d4b6e?overlay")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "normalimage");
    			add_location(img2, file$c, 31, 84, 1110);
    			attr_dev(a2, "href", "/profile/6l6l/5bef569e02b644ae95e5c5e086f2cbee");
    			add_location(a2, file$c, 31, 18, 1044);
    			attr_dev(div0, "class", "card svelte-r1ttd3");
    			add_location(div0, file$c, 31, 0, 1026);
    			attr_dev(p6, "class", "subsubtext");
    			add_location(p6, file$c, 32, 0, 1238);
    			if (!src_url_equal(img3.src, img3_src_value = "https://crafatar.com/renders/head/e1e695dc1e17472091800861fdf7aa70?overlay")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "class", "normalimage");
    			add_location(img3, file$c, 34, 95, 1399);
    			attr_dev(a3, "href", "/profile/ShadowStriken15/e1e695dc1e17472091800861fdf7aa70");
    			add_location(a3, file$c, 34, 18, 1322);
    			attr_dev(div1, "class", "card svelte-r1ttd3");
    			add_location(div1, file$c, 34, 0, 1304);
    			if (!src_url_equal(img4.src, img4_src_value = "https://crafatar.com/renders/head/984aabbfade94549b22d9a27c85778bf?overlay")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			attr_dev(img4, "class", "normalimage");
    			add_location(img4, file$c, 35, 91, 1629);
    			attr_dev(a4, "href", "/profile/MADHAVMEHTA/36b0f9b0691e4081b5777a45b46ca416");
    			add_location(a4, file$c, 35, 18, 1556);
    			attr_dev(div2, "class", "card svelte-r1ttd3");
    			add_location(div2, file$c, 35, 0, 1538);
    			attr_dev(div3, "class", "card-container svelte-r1ttd3");
    			add_location(div3, file$c, 33, 0, 1275);
    			attr_dev(div4, "class", "back-bg svelte-r1ttd3");
    			add_location(div4, file$c, 37, 0, 1771);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			append_dev(p1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t4);
    			append_dev(p2, br0);
    			append_dev(p2, br1);
    			append_dev(p2, a0);
    			append_dev(a0, img1);
    			append_dev(a0, t5);
    			append_dev(p2, t6);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t7);
    			append_dev(p4, a1);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, a2);
    			append_dev(a2, img2);
    			append_dev(a2, t12);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, a3);
    			append_dev(a3, img3);
    			append_dev(a3, t16);
    			append_dev(div3, t17);
    			append_dev(div3, div2);
    			append_dev(div2, a4);
    			append_dev(a4, img4);
    			append_dev(a4, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div4, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a2)),
    					action_destroyer(link.call(null, a3)),
    					action_destroyer(link.call(null, a4))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contactme', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contactme> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ link });
    	return [];
    }

    class Contactme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contactme",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/routes/__error.svelte generated by Svelte v3.46.6 */

    const file$b = "src/routes/__error.svelte";

    function create_fragment$d(ctx) {
    	let t0;
    	let h1;
    	let t2;
    	let div;

    	const block = {
    		c: function create() {
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "error has occur";
    			t2 = space();
    			div = element("div");
    			document.title = "error";
    			attr_dev(h1, "class", "maincolor");
    			add_location(h1, file$b, 18, 0, 334);
    			attr_dev(div, "class", "back-bg svelte-1p1zej1");
    			add_location(div, file$b, 19, 0, 377);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('_error', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<_error> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class _error extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_error",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/routes/index.svelte generated by Svelte v3.46.6 */

    const file$a = "src/routes/index.svelte";

    function create_fragment$c(ctx) {
    	let t0;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let div0;
    	let t5;
    	let a;
    	let t7;
    	let div1;

    	const block = {
    		c: function create() {
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "The all-in-one skyblock website for you";
    			t2 = space();
    			p = element("p");
    			p.textContent = "💯🙃";
    			t4 = space();
    			div0 = element("div");
    			t5 = text("Create by Cephas. ");
    			a = element("a");
    			a.textContent = "License under Apache-2.0 License";
    			t7 = space();
    			div1 = element("div");
    			document.title = "sky home";
    			attr_dev(h1, "class", "secondarycolor textspecial svelte-ozov5j");
    			add_location(h1, file$a, 30, 0, 615);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$a, 31, 0, 699);
    			attr_dev(a, "href", "https://github.com/seabass6969/skystatus/blob/master/LICENSE");
    			add_location(a, file$a, 33, 18, 769);
    			attr_dev(div0, "class", "smalltext");
    			add_location(div0, file$a, 32, 0, 727);
    			attr_dev(div1, "class", "back-bg svelte-ozov5j");
    			add_location(div1, file$a, 35, 0, 884);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t5);
    			append_dev(div0, a);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/routes/Layout.svelte generated by Svelte v3.46.6 */
    const file$9 = "src/routes/Layout.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let a1;
    	let t2;
    	let a2;
    	let t4;
    	let a3;
    	let t6;
    	let a4;
    	let t8;
    	let a5;
    	let t10;
    	let a6;
    	let t12;
    	let br;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			a1 = element("a");
    			a1.textContent = "bz";
    			t2 = space();
    			a2 = element("a");
    			a2.textContent = "mayor";
    			t4 = space();
    			a3 = element("a");
    			a3.textContent = "news";
    			t6 = space();
    			a4 = element("a");
    			a4.textContent = "place";
    			t8 = space();
    			a5 = element("a");
    			a5.textContent = "profile";
    			t10 = space();
    			a6 = element("a");
    			a6.textContent = "me";
    			t12 = space();
    			br = element("br");
    			if (!src_url_equal(img.src, img_src_value = "/favicon.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "image svelte-54fs72");
    			attr_dev(img, "alt", "homeimage");
    			add_location(img, file$9, 31, 38, 589);
    			attr_dev(a0, "class", "link svelte-54fs72");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$9, 31, 4, 555);
    			attr_dev(a1, "class", "link svelte-54fs72");
    			attr_dev(a1, "href", "/bazaar");
    			add_location(a1, file$9, 32, 4, 653);
    			attr_dev(a2, "class", "link svelte-54fs72");
    			attr_dev(a2, "href", "/mayor");
    			add_location(a2, file$9, 33, 4, 704);
    			attr_dev(a3, "class", "link svelte-54fs72");
    			attr_dev(a3, "href", "/news");
    			add_location(a3, file$9, 34, 4, 757);
    			attr_dev(a4, "class", "link svelte-54fs72");
    			attr_dev(a4, "href", "/locationtracker");
    			add_location(a4, file$9, 35, 4, 808);
    			attr_dev(a5, "class", "link svelte-54fs72");
    			attr_dev(a5, "href", "/profile");
    			add_location(a5, file$9, 36, 4, 871);
    			attr_dev(a6, "class", "link svelte-54fs72");
    			attr_dev(a6, "href", "/contactme");
    			add_location(a6, file$9, 37, 4, 928);
    			attr_dev(div, "class", "header svelte-54fs72");
    			add_location(div, file$9, 30, 0, 530);
    			add_location(br, file$9, 39, 0, 985);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, img);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(div, t2);
    			append_dev(div, a2);
    			append_dev(div, t4);
    			append_dev(div, a3);
    			append_dev(div, t6);
    			append_dev(div, a4);
    			append_dev(div, t8);
    			append_dev(div, a5);
    			append_dev(div, t10);
    			append_dev(div, a6);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, br, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2)),
    					action_destroyer(link.call(null, a3)),
    					action_destroyer(link.call(null, a4)),
    					action_destroyer(link.call(null, a5)),
    					action_destroyer(link.call(null, a6))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ link });
    	return [];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    var modeNames = {
    	farming_1: "The Farming Islands",
    	crystal_hollows: "Crystal Hollows",
    	foraging_1: "Floating Islands",
    	dark_auction: "Dark Auction",
    	dungeon: "Dungeons",
    	combat_3: "The End",
    	hub: "Hub",
    	dynamic: "Private Island",
    	mining_3: "Dwarven Mines",
    	mining_1: "Gold Mine",
    	combat_2: "Blazing Fortress",
    	mining_2: "Deep Caverns",
    	combat_1: "Spider's Den"
    };
    var json = {
    	modeNames: modeNames
    };

    /* src/routes/locationtracker.svelte generated by Svelte v3.46.6 */
    const file$8 = "src/routes/locationtracker.svelte";

    // (77:40) 
    function create_if_block_3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "type in your username properly";
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$8, 77, 0, 2306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(77:40) ",
    		ctx
    	});

    	return block;
    }

    // (66:0) {#if locationdata.success !== false}
    function create_if_block$3(ctx) {
    	let br;
    	let t;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*locationdata*/ ctx[2].output.session.online == false) return create_if_block_1$3;
    		if (/*locationdata*/ ctx[2].output.session.gameType === "SKYBLOCK") return create_if_block_2$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			br = element("br");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(br, file$8, 66, 0, 1758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(66:0) {#if locationdata.success !== false}",
    		ctx
    	});

    	return block;
    }

    // (73:0) {:else}
    function create_else_block$1(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*locationdata*/ ctx[2].output.session.gameType + "";
    	let t3;
    	let t4;
    	let t5_value = /*locationdata*/ ctx[2].output.session.mode + "";
    	let t5;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The Player ");
    			t1 = text(/*finalplayervalue*/ ctx[1]);
    			t2 = text(" is not playing skyblock but its playing in ");
    			t3 = text(t3_value);
    			t4 = text(" in ");
    			t5 = text(t5_value);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$8, 73, 0, 2080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finalplayervalue*/ 2) set_data_dev(t1, /*finalplayervalue*/ ctx[1]);
    			if (dirty & /*locationdata*/ 4 && t3_value !== (t3_value = /*locationdata*/ ctx[2].output.session.gameType + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*locationdata*/ 4 && t5_value !== (t5_value = /*locationdata*/ ctx[2].output.session.mode + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(73:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if locationdata.output.session.gameType === "SKYBLOCK"}
    function create_if_block_2$2(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = json.modeNames[/*locationdata*/ ctx[2].output.session.mode] + "";
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The Player ");
    			t1 = text(/*finalplayervalue*/ ctx[1]);
    			t2 = text(" is online and it's in ");
    			t3 = text(t3_value);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$8, 71, 0, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finalplayervalue*/ 2) set_data_dev(t1, /*finalplayervalue*/ ctx[1]);
    			if (dirty & /*locationdata*/ 4 && t3_value !== (t3_value = json.modeNames[/*locationdata*/ ctx[2].output.session.mode] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(71:0) {#if locationdata.output.session.gameType === \\\"SKYBLOCK\\\"}",
    		ctx
    	});

    	return block;
    }

    // (68:0) {#if locationdata.output.session.online == false}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The Player ");
    			t1 = text(/*finalplayervalue*/ ctx[1]);
    			t2 = text(" is not online");
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$8, 68, 0, 1813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finalplayervalue*/ 2) set_data_dev(t1, /*finalplayervalue*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(68:0) {#if locationdata.output.session.online == false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let t0;
    	let div0;
    	let input;
    	let t1;
    	let button;
    	let t3;
    	let t4;
    	let div1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*locationdata*/ ctx[2].success !== false) return create_if_block$3;
    		if (/*locationdata*/ ctx[2].success !== true) return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = space();
    			div0 = element("div");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "show";
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div1 = element("div");
    			document.title = "Location Tracker";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textboxmaincolor hoverinput maincolor");
    			add_location(input, file$8, 62, 0, 1474);
    			attr_dev(button, "class", "showme subsubtext maincolor hoverinput");
    			add_location(button, file$8, 63, 0, 1618);
    			attr_dev(div0, "class", "tablestyle svelte-1je9o45");
    			add_location(div0, file$8, 61, 0, 1449);
    			attr_dev(div1, "class", "back-bg svelte-1je9o45");
    			add_location(div1, file$8, 79, 0, 2366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*playervalue*/ ctx[0]);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "input", /*onchangevalue*/ ctx[4], false, false, false),
    					listen_dev(input, "change", /*clickedlocation*/ ctx[3], false, false, false),
    					listen_dev(button, "click", /*clickedlocation*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*playervalue*/ 1 && input.value !== /*playervalue*/ ctx[0]) {
    				set_input_value(input, /*playervalue*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t4.parentNode, t4);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Locationtracker', slots, []);
    	let playervalue = "";
    	let finalplayervalue = "";

    	let locationdata = {
    		output: undefined,
    		loading: false,
    		success: false
    	};

    	let finaldata = "";

    	async function clickedlocation() {
    		$$invalidate(2, locationdata.loading = true, locationdata);
    		const response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/status/' + playervalue);
    		const output = await response.json();

    		if (output.error == undefined) {
    			$$invalidate(2, locationdata.success = true, locationdata);
    			$$invalidate(2, locationdata = { output, loading: false });
    			$$invalidate(1, finalplayervalue = playervalue);
    		} else {
    			$$invalidate(2, locationdata.success = false, locationdata);
    		}
    	}

    	function onchangevalue() {
    		$$invalidate(2, locationdata.loading = false, locationdata);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Locationtracker> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		playervalue = this.value;
    		$$invalidate(0, playervalue);
    	}

    	$$self.$capture_state = () => ({
    		json,
    		playervalue,
    		finalplayervalue,
    		locationdata,
    		finaldata,
    		clickedlocation,
    		onchangevalue
    	});

    	$$self.$inject_state = $$props => {
    		if ('playervalue' in $$props) $$invalidate(0, playervalue = $$props.playervalue);
    		if ('finalplayervalue' in $$props) $$invalidate(1, finalplayervalue = $$props.finalplayervalue);
    		if ('locationdata' in $$props) $$invalidate(2, locationdata = $$props.locationdata);
    		if ('finaldata' in $$props) finaldata = $$props.finaldata;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		playervalue,
    		finalplayervalue,
    		locationdata,
    		clickedlocation,
    		onchangevalue,
    		input_input_handler
    	];
    }

    class Locationtracker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Locationtracker",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/component/minecraftCode.svelte generated by Svelte v3.46.6 */

    function create_fragment$9(ctx) {
    	let html_tag;
    	let raw_value = mainreplace(/*text*/ ctx[0]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && raw_value !== (raw_value = mainreplace(/*text*/ ctx[0]) + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function mainreplace(text) {
    	let StringText = String(text);

    	let replaceabletext = [
    		{ name: '§a', done: '' },
    		{ name: '§b', done: '' },
    		{ name: '§c', done: '' },
    		{ name: '§d', done: '' },
    		{ name: '§e', done: '' },
    		{ name: '§f', done: '' },
    		{ name: '§g', done: '' },
    		{ name: '§k', done: '' },
    		{ name: '§l', done: '' },
    		{ name: '§m', done: '' },
    		{ name: '§n', done: '' },
    		{ name: '§o', done: '' },
    		{ name: '§r', done: '' },
    		{ name: '§0', done: '' },
    		{ name: '§1', done: '' },
    		{ name: '§2', done: '' },
    		{ name: '§3', done: '' },
    		{ name: '§4', done: '' },
    		{ name: '§5', done: '' },
    		{ name: '§6', done: '' },
    		{ name: '§7', done: '' },
    		{ name: '§8', done: '' },
    		{ name: '§9', done: '' }
    	];

    	for (let i = 0; i < replaceabletext.length; i++) {
    		StringText = StringText.replaceAll(replaceabletext[i]['name'], replaceabletext[i]['done']);
    	}

    	return StringText;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MinecraftCode', slots, []);
    	let { text = "" } = $$props;
    	let string = "</p>";
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MinecraftCode> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text, mainreplace, string });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('string' in $$props) string = $$props.string;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class MinecraftCode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MinecraftCode",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get text() {
    		throw new Error("<MinecraftCode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<MinecraftCode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/mayor.svelte generated by Svelte v3.46.6 */
    const file$7 = "src/routes/mayor.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (42:0) {:catch error}
    function create_catch_block$1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[5] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("the error is ");
    			t1 = text(t1_value);
    			add_location(p, file$7, 42, 0, 1129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(42:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (33:0) {:then output}
    function create_then_block$1(ctx) {
    	let p0;
    	let t0;
    	let t1_value = /*output*/ ctx[1]["mayor"]["name"] + "";
    	let t1;
    	let t2;
    	let t3_value = /*output*/ ctx[1]["mayor"]["key"] + "";
    	let t3;
    	let t4;
    	let t5;
    	let p1;
    	let t7;
    	let t8;
    	let p2;
    	let t9;
    	let t10_value = Date(/*output*/ ctx[1]["lastUpdated"]) + "";
    	let t10;
    	let current;
    	let each_value = /*output*/ ctx[1]["mayor"]["perks"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("currently the mayor is: ");
    			t1 = text(t1_value);
    			t2 = text(" (");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "perks:";
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			p2 = element("p");
    			t9 = text("last update is: ");
    			t10 = text(t10_value);
    			attr_dev(p0, "class", "secondarycolor subtext");
    			add_location(p0, file$7, 33, 0, 738);
    			attr_dev(p1, "class", "secondarycolor subtext");
    			add_location(p1, file$7, 34, 0, 854);
    			attr_dev(p2, "class", "smalltext maincolor");
    			add_location(p2, file$7, 40, 0, 1033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t7, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t8, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t9);
    			append_dev(p2, t10);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*out*/ 1) {
    				each_value = /*output*/ ctx[1]["mayor"]["perks"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t8.parentNode, t8);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t7);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(33:0) {:then output}",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#each output["mayor"]["perks"] as perks}
    function create_each_block$4(ctx) {
    	let minecraftcode0;
    	let t0;
    	let br;
    	let t1;
    	let minecraftcode1;
    	let current;

    	minecraftcode0 = new MinecraftCode({
    			props: { text: /*perks*/ ctx[2].name },
    			$$inline: true
    		});

    	minecraftcode1 = new MinecraftCode({
    			props: { text: /*perks*/ ctx[2].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(minecraftcode0.$$.fragment);
    			t0 = text(":\n");
    			br = element("br");
    			t1 = space();
    			create_component(minecraftcode1.$$.fragment);
    			add_location(br, file$7, 37, 0, 978);
    		},
    		m: function mount(target, anchor) {
    			mount_component(minecraftcode0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(minecraftcode1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(minecraftcode0.$$.fragment, local);
    			transition_in(minecraftcode1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(minecraftcode0.$$.fragment, local);
    			transition_out(minecraftcode1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(minecraftcode0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			destroy_component(minecraftcode1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(36:0) {#each output[\\\"mayor\\\"][\\\"perks\\\"] as perks}",
    		ctx
    	});

    	return block;
    }

    // (31:12)  <Thinking /> {:then output}
    function create_pending_block$1(ctx) {
    	let thinking;
    	let current;
    	thinking = new Thinking({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(thinking.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(thinking, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thinking.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thinking.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thinking, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(31:12)  <Thinking /> {:then output}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 1,
    		error: 5,
    		blocks: [,,,]
    	};

    	handle_promise(/*out*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			div = element("div");
    			document.title = "mayor";
    			attr_dev(div, "class", "back-bg svelte-17v5r3o");
    			add_location(div, file$7, 44, 0, 1166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => t1.parentNode;
    			info.anchor = t1;
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getMayor() {
    	let response = await fetch("https://api.hypixel.net/resources/skyblock/election");
    	let output = await response.json();
    	return output;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mayor', slots, []);
    	let out = getMayor();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mayor> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Thinking, MinecraftCode, getMayor, out });

    	$$self.$inject_state = $$props => {
    		if ('out' in $$props) $$invalidate(0, out = $$props.out);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [out];
    }

    class Mayor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mayor",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var fuel = [
    	{
    		name: "Coal",
    		speed: 0.05,
    		times: false,
    		hour: 0.5
    	},
    	{
    		name: "Block of Coal",
    		speed: 0.05,
    		times: false,
    		hour: 5
    	},
    	{
    		name: "Enchanted Bread",
    		speed: 0.05,
    		times: false,
    		hour: 12
    	},
    	{
    		name: "Enchanted Coal",
    		speed: 0.1,
    		times: false,
    		hour: 24
    	},
    	{
    		name: "Enchanted Charcoal",
    		speed: 0.2,
    		times: false,
    		hour: 36
    	},
    	{
    		name: "Solar Panel",
    		speed: 0.125,
    		times: false,
    		hour: 0
    	},
    	{
    		name: "Enchanted Lava Bucket",
    		speed: 0.25,
    		times: false,
    		hour: 0
    	},
    	{
    		name: "Hamster Wheel",
    		speed: 0.5,
    		times: false,
    		hour: 24
    	},
    	{
    		name: "Foul Flesh",
    		speed: 0.9,
    		times: false,
    		hour: 5
    	},
    	{
    		name: "Catalyst",
    		speed: 2,
    		times: true,
    		hour: 3
    	},
    	{
    		name: "Hyper Catalyst",
    		speed: 3,
    		times: true,
    		hour: 6
    	},
    	{
    		name: "Tasty cheese",
    		speed: 2,
    		times: true,
    		hour: 1
    	},
    	{
    		name: "Magma Bucket",
    		speed: 0.3,
    		times: false,
    		hour: 0
    	},
    	{
    		name: "Plasma Bucket",
    		speed: 0.35,
    		times: false,
    		hour: 0
    	}
    ];
    var minion = [
    	{
    		name: "Wheat Minion",
    		resource_generated: [
    			"Wheat",
    			"Seeds"
    		],
    		tier: [
    		]
    	}
    ];
    var minionjson = {
    	fuel: fuel,
    	minion: minion
    };

    /* src/routes/minion.svelte generated by Svelte v3.46.6 */

    const { console: console_1$2 } = globals;
    const file$6 = "src/routes/minion.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (77:0) {#if bzdata.done === true}
    function create_if_block$2(ctx) {
    	let div;
    	let t0;
    	let input;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*bzdata*/ ctx[7].output.success && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("price checker on bz ");
    			input = element("input");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "maincolor hoverinput textbox");
    			add_location(input, file$6, 77, 47, 2406);
    			attr_dev(div, "class", "subsubsubtext");
    			add_location(div, file$6, 77, 0, 2359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, input);
    			set_input_value(input, /*itemname*/ ctx[0]);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*itemname*/ 1 && input.value !== /*itemname*/ ctx[0]) {
    				set_input_value(input, /*itemname*/ ctx[0]);
    			}

    			if (/*bzdata*/ ctx[7].output.success) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(77:0) {#if bzdata.done === true}",
    		ctx
    	});

    	return block;
    }

    // (79:0) {#if bzdata.output.success}
    function create_if_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*done*/ ctx[8] === true && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*done*/ ctx[8] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(79:0) {#if bzdata.output.success}",
    		ctx
    	});

    	return block;
    }

    // (80:0) {#if done === true}
    function create_if_block_2$1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*bzdata*/ ctx[7].output.products[/*realproccessname*/ ctx[1]]["quick_status"]["sellPrice"].toFixed(2) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("sell price: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "subsubsubtext maincolor");
    			add_location(p, file$6, 80, 0, 2539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bzdata, realproccessname*/ 130 && t1_value !== (t1_value = /*bzdata*/ ctx[7].output.products[/*realproccessname*/ ctx[1]]["quick_status"]["sellPrice"].toFixed(2) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(80:0) {#if done === true}",
    		ctx
    	});

    	return block;
    }

    // (90:4) {#each minionjson["fuel"] as a}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*a*/ ctx[17].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*a*/ ctx[17].speed;
    			option.value = option.__value;
    			add_location(option, file$6, 90, 8, 2983);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(90:4) {#each minionjson[\\\"fuel\\\"] as a}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let input0;
    	let t5;
    	let p2;
    	let t7;
    	let input1;
    	let t8;
    	let p3;
    	let t10;
    	let input2;
    	let t11;
    	let t12;
    	let p4;
    	let t14;
    	let input3;
    	let t15;
    	let p5;
    	let t17;
    	let select;
    	let option;
    	let t19;
    	let p6;
    	let t20;
    	let t21_value = /*result*/ ctx[9] / 24 + "";
    	let t21;
    	let t22;
    	let p7;
    	let t23;
    	let t24;
    	let t25;
    	let div;
    	let mounted;
    	let dispose;
    	let if_block = /*bzdata*/ ctx[7].done === true && create_if_block$2(ctx);
    	let each_value = minionjson["fuel"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Minion calcaulator:";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Orginal Minion speed:";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "item per action:";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "Unit price:";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			if (if_block) if_block.c();
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "diamond spreading:";
    			t14 = space();
    			input3 = element("input");
    			t15 = space();
    			p5 = element("p");
    			p5.textContent = "fuel bonus speed:";
    			t17 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "none";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t19 = space();
    			p6 = element("p");
    			t20 = text("result after an hour: ");
    			t21 = text(t21_value);
    			t22 = space();
    			p7 = element("p");
    			t23 = text("result after a days: ");
    			t24 = text(/*result*/ ctx[9]);
    			t25 = space();
    			div = element("div");
    			document.title = "minion";
    			attr_dev(p0, "class", "subtext");
    			add_location(p0, file$6, 69, 0, 2010);
    			attr_dev(p1, "class", "subsubtext");
    			add_location(p1, file$6, 70, 0, 2053);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "10");
    			add_location(input0, file$6, 71, 0, 2101);
    			attr_dev(p2, "class", "subsubtext");
    			add_location(p2, file$6, 72, 0, 2159);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$6, 73, 0, 2202);
    			attr_dev(p3, "class", "subsubtext");
    			add_location(p3, file$6, 74, 0, 2253);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$6, 75, 0, 2291);
    			attr_dev(p4, "class", "subsubtext");
    			add_location(p4, file$6, 84, 0, 2691);
    			attr_dev(input3, "type", "checkbox");
    			add_location(input3, file$6, 85, 0, 2736);
    			attr_dev(p5, "class", "subsubtext");
    			add_location(p5, file$6, 86, 0, 2784);
    			option.selected = true;
    			option.__value = "0";
    			option.value = option.__value;
    			add_location(option, file$6, 88, 4, 2900);
    			attr_dev(select, "id", "BonusSpeedByFuel");
    			attr_dev(select, "name", "Fuel");
    			if (/*speedbyfuel*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[16].call(select));
    			add_location(select, file$6, 87, 0, 2828);
    			attr_dev(p6, "class", "subtext");
    			add_location(p6, file$6, 93, 0, 3047);
    			attr_dev(p7, "class", "subtext");
    			add_location(p7, file$6, 94, 0, 3106);
    			attr_dev(div, "class", "back-bg svelte-129ykmq");
    			add_location(div, file$6, 95, 0, 3159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*speed*/ ctx[2]);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*items_preaction*/ ctx[3]);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*price*/ ctx[4]);
    			insert_dev(target, t11, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, input3, anchor);
    			input3.checked = /*useDiaSP*/ ctx[6];
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*speedbyfuel*/ ctx[5]);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t20);
    			append_dev(p6, t21);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t23);
    			append_dev(p7, t24);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[15]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*speed*/ 4 && to_number(input0.value) !== /*speed*/ ctx[2]) {
    				set_input_value(input0, /*speed*/ ctx[2]);
    			}

    			if (dirty & /*items_preaction*/ 8 && to_number(input1.value) !== /*items_preaction*/ ctx[3]) {
    				set_input_value(input1, /*items_preaction*/ ctx[3]);
    			}

    			if (dirty & /*price*/ 16 && to_number(input2.value) !== /*price*/ ctx[4]) {
    				set_input_value(input2, /*price*/ ctx[4]);
    			}

    			if (/*bzdata*/ ctx[7].done === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t12.parentNode, t12);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*useDiaSP*/ 64) {
    				input3.checked = /*useDiaSP*/ ctx[6];
    			}

    			if (dirty & /*minionjson*/ 0) {
    				each_value = minionjson["fuel"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*speedbyfuel, minionjson*/ 32) {
    				select_option(select, /*speedbyfuel*/ ctx[5]);
    			}

    			if (dirty & /*result*/ 512 && t21_value !== (t21_value = /*result*/ ctx[9] / 24 + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*result*/ 512) set_data_dev(t24, /*result*/ ctx[9]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t11);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Minion', slots, []);

    	let bzdata = {
    		loading: false,
    		output: undefined,
    		done: false
    	};

    	let itemname = "";
    	let realproccessname = "";
    	let done = false;

    	onMount(async () => {
    		$$invalidate(7, bzdata.loading = true, bzdata);
    		let res = await fetch("https://api.hypixel.net/skyblock/bazaar");
    		let output = await res.json();
    		$$invalidate(7, bzdata = { loading: false, output, done: true });
    		$$invalidate(10, diamond_price = bzdata.output.products["DIAMOND"]["quick_status"]["sellPrice"].toFixed(2));
    	});

    	let speed = 10;
    	let items_preaction = 1;
    	let price = 2100;
    	let speedbyfuel;
    	let useDiaSP = false;
    	let diamond_price = 0;
    	let result;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Minion> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		speed = to_number(this.value);
    		$$invalidate(2, speed);
    	}

    	function input1_input_handler() {
    		items_preaction = to_number(this.value);
    		$$invalidate(3, items_preaction);
    	}

    	function input2_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(4, price);
    	}

    	function input_input_handler() {
    		itemname = this.value;
    		$$invalidate(0, itemname);
    	}

    	function input3_change_handler() {
    		useDiaSP = this.checked;
    		$$invalidate(6, useDiaSP);
    	}

    	function select_change_handler() {
    		speedbyfuel = select_value(this);
    		$$invalidate(5, speedbyfuel);
    	}

    	$$self.$capture_state = () => ({
    		json: json$1,
    		replacer,
    		minionjson,
    		Thinking,
    		onMount,
    		bzdata,
    		itemname,
    		realproccessname,
    		done,
    		speed,
    		items_preaction,
    		price,
    		speedbyfuel,
    		useDiaSP,
    		diamond_price,
    		result
    	});

    	$$self.$inject_state = $$props => {
    		if ('bzdata' in $$props) $$invalidate(7, bzdata = $$props.bzdata);
    		if ('itemname' in $$props) $$invalidate(0, itemname = $$props.itemname);
    		if ('realproccessname' in $$props) $$invalidate(1, realproccessname = $$props.realproccessname);
    		if ('done' in $$props) $$invalidate(8, done = $$props.done);
    		if ('speed' in $$props) $$invalidate(2, speed = $$props.speed);
    		if ('items_preaction' in $$props) $$invalidate(3, items_preaction = $$props.items_preaction);
    		if ('price' in $$props) $$invalidate(4, price = $$props.price);
    		if ('speedbyfuel' in $$props) $$invalidate(5, speedbyfuel = $$props.speedbyfuel);
    		if ('useDiaSP' in $$props) $$invalidate(6, useDiaSP = $$props.useDiaSP);
    		if ('diamond_price' in $$props) $$invalidate(10, diamond_price = $$props.diamond_price);
    		if ('result' in $$props) $$invalidate(9, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*itemname, realproccessname, diamond_price, useDiaSP, speed, speedbyfuel, items_preaction, price*/ 1151) {
    			{
    				$$invalidate(8, done = false);
    				$$invalidate(1, realproccessname = itemname.toUpperCase().replaceAll(" ", "_"));

    				for (let a = 0; a < replacer.products.length; a++) {
    					if (realproccessname == replacer.products[a].name) $$invalidate(1, realproccessname = replacer.products[a].replacer);
    				}

    				for (let i = 0; i < json$1.products.length; i++) {
    					if (realproccessname == json$1.products[i]) {
    						$$invalidate(8, done = true);
    					}
    				}

    				// end bazaar checking price
    				console.log(diamond_price);

    				if (useDiaSP === false) {
    					$$invalidate(9, result = 88400.0 / (speed / (1 + speedbyfuel)) * items_preaction * price);
    				}

    				if (useDiaSP === true) {
    					$$invalidate(9, result = 88400.0 / (speed / (1 + speedbyfuel)) * items_preaction * price + diamond_price * speed);
    				}
    			}
    		}
    	};

    	return [
    		itemname,
    		realproccessname,
    		speed,
    		items_preaction,
    		price,
    		speedbyfuel,
    		useDiaSP,
    		bzdata,
    		done,
    		result,
    		diamond_price,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input_input_handler,
    		input3_change_handler,
    		select_change_handler
    	];
    }

    class Minion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Minion",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/routes/news.svelte generated by Svelte v3.46.6 */
    const file$5 = "src/routes/news.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (41:0) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[5] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("error is ");
    			t1 = text(t1_value);
    			add_location(p, file$5, 41, 0, 1032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(41:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {:then output}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*output*/ ctx[1]["items"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*out*/ 1) {
    				each_value = /*output*/ ctx[1]["items"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(35:0) {:then output}",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#each output["items"] as items}
    function create_each_block$2(ctx) {
    	let p0;
    	let t0;
    	let t1_value = /*items*/ ctx[2]["title"] + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4_value = /*items*/ ctx[2]["text"] + "";
    	let t4;
    	let t5;
    	let a;
    	let t6;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("title: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Date it added:");
    			t4 = text(t4_value);
    			t5 = space();
    			a = element("a");
    			t6 = text("forum post link");
    			attr_dev(p0, "class", "secondarycolor underline subtext svelte-12jajth");
    			add_location(p0, file$5, 36, 0, 790);
    			attr_dev(p1, "class", "secondarycolor smalltext");
    			add_location(p1, file$5, 37, 0, 862);
    			attr_dev(a, "class", "secondarycolor smalltext");
    			attr_dev(a, "href", /*items*/ ctx[2]["link"]);
    			add_location(a, file$5, 38, 0, 932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t6);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(36:0) {#each output[\\\"items\\\"] as items}",
    		ctx
    	});

    	return block;
    }

    // (33:12)  <Thinking /> {:then output}
    function create_pending_block(ctx) {
    	let thinking;
    	let current;
    	thinking = new Thinking({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(thinking.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(thinking, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thinking.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thinking.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thinking, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(33:12)  <Thinking /> {:then output}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 1,
    		error: 5,
    		blocks: [,,,]
    	};

    	handle_promise(/*out*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			div = element("div");
    			document.title = "News";
    			attr_dev(div, "class", "back-bg svelte-12jajth");
    			add_location(div, file$5, 43, 0, 1065);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => t1.parentNode;
    			info.anchor = t1;
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getNews() {
    	let response = await fetch("https://skyproxyjs.cephas8080.workers.dev/api/News");
    	let output = await response.json();
    	return output;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News', slots, []);
    	let out = getNews();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<News> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Thinking, getNews, out });

    	$$self.$inject_state = $$props => {
    		if ('out' in $$props) $$invalidate(0, out = $$props.out);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [out];
    }

    class News extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/routes/profile.svelte generated by Svelte v3.46.6 */

    const { console: console_1$1 } = globals;
    const file$4 = "src/routes/profile.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (87:42) 
    function create_if_block_1$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "type in your username properly";
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$4, 87, 0, 2510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(87:42) ",
    		ctx
    	});

    	return block;
    }

    // (77:0) {#if profileidfetch.success !== false}
    function create_if_block$1(ctx) {
    	let br0;
    	let t0;
    	let p;
    	let t2;
    	let select;
    	let t3;
    	let br1;
    	let t4;
    	let a;
    	let t5;
    	let a_href_value;
    	let mounted;
    	let dispose;
    	let each_value = /*profileidfetch*/ ctx[1].profilelist;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			p = element("p");
    			p.textContent = "select your profile:";
    			t2 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			a = element("a");
    			t5 = text("show the profile");
    			add_location(br0, file$4, 77, 0, 2090);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$4, 78, 0, 2095);
    			if (/*profileidfetch*/ ctx[1].selected_value === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$4, 79, 0, 2139);
    			add_location(br1, file$4, 84, 0, 2348);
    			attr_dev(a, "class", "subsubtext");
    			attr_dev(a, "href", a_href_value = "/profile/" + /*playervalue*/ ctx[0] + "/" + /*profileidfetch*/ ctx[1].selected_value);
    			add_location(a, file$4, 85, 0, 2353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*profileidfetch*/ ctx[1].selected_value);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
    					action_destroyer(link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profileidfetch*/ 2) {
    				each_value = /*profileidfetch*/ ctx[1].profilelist;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*profileidfetch*/ 2) {
    				select_option(select, /*profileidfetch*/ ctx[1].selected_value);
    			}

    			if (dirty & /*playervalue, profileidfetch*/ 3 && a_href_value !== (a_href_value = "/profile/" + /*playervalue*/ ctx[0] + "/" + /*profileidfetch*/ ctx[1].selected_value)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(77:0) {#if profileidfetch.success !== false}",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#each profileidfetch.profilelist as profilelist}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*profilelist*/ ctx[8].cute_name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*profilelist*/ ctx[8].profile_id;
    			option.value = option.__value;
    			add_location(option, file$4, 81, 8, 2254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profileidfetch*/ 2 && t_value !== (t_value = /*profilelist*/ ctx[8].cute_name + "")) set_data_dev(t, t_value);

    			if (dirty & /*profileidfetch*/ 2 && option_value_value !== (option_value_value = /*profilelist*/ ctx[8].profile_id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(81:4) {#each profileidfetch.profilelist as profilelist}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t0;
    	let div0;
    	let input;
    	let t1;
    	let button;
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let div1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*profileidfetch*/ ctx[1].success !== false) return create_if_block$1;
    		if (/*profileidfetch*/ ctx[1].success !== true) return create_if_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = space();
    			div0 = element("div");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "fetch";
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			div1 = element("div");
    			document.title = "profile";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textbox hoverinput maincolor svelte-mavmgu");
    			add_location(input, file$4, 73, 0, 1820);
    			attr_dev(button, "class", "showme subsubtext hoverinput maincolor");
    			add_location(button, file$4, 74, 0, 1951);
    			attr_dev(div0, "class", "tablestyle svelte-mavmgu");
    			add_location(div0, file$4, 72, 0, 1795);
    			add_location(br, file$4, 89, 0, 2570);
    			attr_dev(div1, "class", "back-bg svelte-mavmgu");
    			add_location(div1, file$4, 90, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*playervalue*/ ctx[0]);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(input, "input", /*onchangevalue*/ ctx[3], false, false, false),
    					listen_dev(input, "change", /*showprofile*/ ctx[2], false, false, false),
    					listen_dev(button, "click", /*showprofile*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*playervalue*/ 1 && input.value !== /*playervalue*/ ctx[0]) {
    				set_input_value(input, /*playervalue*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t4.parentNode, t4);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let playervalue = "";
    	let finalplayervalue = "";

    	let profileidfetch = {
    		loading: false,
    		success: false,
    		profilelist: undefined,
    		selected_value: undefined
    	};

    	let profiledata = {
    		loading: false,
    		success: false,
    		output: undefined
    	};

    	async function showprofile() {
    		$$invalidate(1, profileidfetch.loading = true, profileidfetch);
    		$$invalidate(0, playervalue = playervalue.replaceAll(" ", ""));
    		const response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profileslist/' + playervalue);
    		const output = await response.json();

    		if (output.error == undefined) {
    			$$invalidate(1, profileidfetch.success = true, profileidfetch);
    			$$invalidate(1, profileidfetch = { profilelist: output, loading: false });
    			console.log(output);
    			finalplayervalue = playervalue;
    		} else {
    			$$invalidate(1, profileidfetch.success = false, profileidfetch);
    		}
    	}

    	function onchangevalue() {
    		$$invalidate(1, profileidfetch.loading = false, profileidfetch);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		playervalue = this.value;
    		$$invalidate(0, playervalue);
    	}

    	function select_change_handler() {
    		profileidfetch.selected_value = select_value(this);
    		$$invalidate(1, profileidfetch);
    	}

    	$$self.$capture_state = () => ({
    		link,
    		Thinking,
    		playervalue,
    		finalplayervalue,
    		profileidfetch,
    		profiledata,
    		showprofile,
    		onchangevalue
    	});

    	$$self.$inject_state = $$props => {
    		if ('playervalue' in $$props) $$invalidate(0, playervalue = $$props.playervalue);
    		if ('finalplayervalue' in $$props) finalplayervalue = $$props.finalplayervalue;
    		if ('profileidfetch' in $$props) $$invalidate(1, profileidfetch = $$props.profileidfetch);
    		if ('profiledata' in $$props) profiledata = $$props.profiledata;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		playervalue,
    		profileidfetch,
    		showprofile,
    		onchangevalue,
    		input_input_handler,
    		select_change_handler
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/component/ProgressBar.svelte generated by Svelte v3.46.6 */

    const file$3 = "src/component/ProgressBar.svelte";

    function create_fragment$4(ctx) {
    	let div3;
    	let p0;
    	let t0;
    	let t1;
    	let t2_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[1] + "";
    	let t2;
    	let t3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t4;
    	let div2;
    	let div1;
    	let p1;
    	let t5_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[2] + "";
    	let t5;
    	let t6;
    	let t7_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[3] + "";
    	let t7;
    	let t8;
    	let div3_resize_listener;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			p0 = element("p");
    			t0 = text(/*text*/ ctx[2]);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			img = element("img");
    			t4 = space();
    			div2 = element("div");
    			div1 = element("div");
    			p1 = element("p");
    			t5 = text(t5_value);
    			t6 = text(" / ");
    			t7 = text(t7_value);
    			t8 = text(" XP");
    			attr_dev(p0, "class", "barText svelte-1ccjhag");
    			add_location(p0, file$3, 138, 0, 3206);
    			if (!src_url_equal(img.src, img_src_value = /*Image*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Progress Bar Icon");
    			attr_dev(img, "class", "IMG svelte-1ccjhag");
    			add_location(img, file$3, 140, 0, 3274);
    			attr_dev(div0, "class", "barIMG svelte-1ccjhag");
    			add_location(div0, file$3, 139, 0, 3253);
    			attr_dev(p1, "class", "xp svelte-1ccjhag");
    			add_location(p1, file$3, 145, 0, 3494);
    			attr_dev(div1, "class", "barContent svelte-1ccjhag");
    			set_style(div1, "width", "calc((" + /*styleclass*/ ctx[4] + " - 30px)*" + /*roundup*/ ctx[5](/*xp*/ ctx[0])[0] + " / 100)");
    			add_location(div1, file$3, 144, 0, 3402);
    			attr_dev(div2, "class", "barObject svelte-1ccjhag");
    			set_style(div2, "width", "calc(" + /*styleclass*/ ctx[4] + " - 30px)");
    			add_location(div2, file$3, 142, 0, 3335);
    			attr_dev(div3, "class", "bar svelte-1ccjhag");
    			add_render_callback(() => /*div3_elementresize_handler*/ ctx[6].call(div3));
    			add_location(div3, file$3, 137, 0, 3167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			div3_resize_listener = add_resize_listener(div3, /*div3_elementresize_handler*/ ctx[6].bind(div3));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 4) set_data_dev(t0, /*text*/ ctx[2]);
    			if (dirty & /*xp*/ 1 && t2_value !== (t2_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[1] + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*Image*/ 2 && !src_url_equal(img.src, img_src_value = /*Image*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*xp*/ 1 && t5_value !== (t5_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[2] + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*xp*/ 1 && t7_value !== (t7_value = /*roundup*/ ctx[5](/*xp*/ ctx[0])[3] + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*styleclass, xp*/ 17) {
    				set_style(div1, "width", "calc((" + /*styleclass*/ ctx[4] + " - 30px)*" + /*roundup*/ ctx[5](/*xp*/ ctx[0])[0] + " / 100)");
    			}

    			if (dirty & /*styleclass*/ 16) {
    				set_style(div2, "width", "calc(" + /*styleclass*/ ctx[4] + " - 30px)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			div3_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressBar', slots, []);
    	let styleclass = "100vw";
    	let w;

    	let lv = [
    		0,
    		50,
    		125,
    		200,
    		300,
    		500,
    		750,
    		1000,
    		1500,
    		2000,
    		3500,
    		5000,
    		7500,
    		10000,
    		15000,
    		20000,
    		30000,
    		50000,
    		75000,
    		100000,
    		200000,
    		300000,
    		400000,
    		500000,
    		600000,
    		700000,
    		800000,
    		900000,
    		1000000,
    		1100000,
    		1200000,
    		1300000,
    		1400000,
    		1500000,
    		1600000,
    		1700000,
    		1800000,
    		1900000,
    		2000000,
    		2100000,
    		2200000,
    		2300000,
    		2400000,
    		2500000,
    		2600000,
    		2750000,
    		2900000,
    		3100000,
    		3400000,
    		3700000,
    		4000000,
    		4300000,
    		4600000,
    		4900000,
    		5200000,
    		5500000,
    		5800000,
    		6100000,
    		6400000,
    		6700000,
    		7000000,
    		7000001
    	];

    	let reallv = [
    		0,
    		50,
    		175,
    		375,
    		675,
    		1175,
    		1925,
    		2925,
    		4425,
    		6425,
    		9925,
    		14925,
    		22425,
    		32425,
    		47425,
    		67425,
    		97425,
    		147425,
    		222425,
    		322425,
    		522425,
    		822425,
    		1222425,
    		1722425,
    		2322425,
    		3022425,
    		3822425,
    		4722425,
    		5722425,
    		6822425,
    		8022425,
    		9322425,
    		10722425,
    		12222425,
    		13822425,
    		15522425,
    		17322425,
    		19222425,
    		21222425,
    		23322425,
    		25522425,
    		27822425,
    		30222425,
    		32722425,
    		35322425,
    		38072425,
    		40972425,
    		44072425,
    		47472425,
    		51172425,
    		55172425,
    		59472425,
    		64072425,
    		68972425,
    		74172425,
    		79672425,
    		85472425,
    		91572425,
    		97972425,
    		104672425,
    		111672425
    	];

    	function roundup(number) {
    		if (number !== undefined) {
    			let test = number;
    			let level = 0;

    			for (let i = 0; i < 60; i++) {
    				if (test > lv[i]) {
    					test = test - lv[i];
    					level++;
    				}
    			}

    			return [(test / lv[level] * 100).toFixed(2), level - 1, test, lv[level]];
    		} else {
    			return [0, 0, 0, 0];
    		}
    	}
    	let { xp = undefined } = $$props;
    	let { Image = undefined } = $$props;
    	let { text = undefined } = $$props;
    	const writable_props = ['xp', 'Image', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	function div3_elementresize_handler() {
    		w = this.clientWidth;
    		$$invalidate(3, w);
    	}

    	$$self.$$set = $$props => {
    		if ('xp' in $$props) $$invalidate(0, xp = $$props.xp);
    		if ('Image' in $$props) $$invalidate(1, Image = $$props.Image);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({
    		styleclass,
    		w,
    		lv,
    		reallv,
    		roundup,
    		xp,
    		Image,
    		text
    	});

    	$$self.$inject_state = $$props => {
    		if ('styleclass' in $$props) $$invalidate(4, styleclass = $$props.styleclass);
    		if ('w' in $$props) $$invalidate(3, w = $$props.w);
    		if ('lv' in $$props) lv = $$props.lv;
    		if ('reallv' in $$props) reallv = $$props.reallv;
    		if ('xp' in $$props) $$invalidate(0, xp = $$props.xp);
    		if ('Image' in $$props) $$invalidate(1, Image = $$props.Image);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*w*/ 8) {
    			{
    				if (w <= 600) {
    					// console.log("phone mode")
    					$$invalidate(4, styleclass = "90vw");
    				}
    			}
    		}
    	};

    	return [xp, Image, text, w, styleclass, roundup, div3_elementresize_handler];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { xp: 0, Image: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get xp() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xp(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Image() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Image(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/component/CollectionUI.svelte generated by Svelte v3.46.6 */

    const file$2 = "src/component/CollectionUI.svelte";

    function create_fragment$3(ctx) {
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let span2;
    	let t2;
    	let t3;
    	let span0;
    	let span1;
    	let t5;
    	let div3;
    	let t6_value = reun$1(/*string*/ ctx[1]) + "";
    	let t6;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			span2 = element("span");
    			t2 = text(/*ITEMNAME*/ ctx[0]);
    			t3 = space();
    			span0 = element("span");
    			span1 = element("span");
    			span1.textContent = `${/*getlevel*/ ctx[3]()}`;
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			if (!src_url_equal(img.src, img_src_value = /*imageurl*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "Image " + /*ITEMNAME*/ ctx[0]);
    			attr_dev(img, "class", "collection-icon svelte-jq1cov");
    			add_location(img, file$2, 76, 29, 1601);
    			attr_dev(div0, "class", "collection-icon svelte-jq1cov");
    			add_location(div0, file$2, 76, 0, 1572);
    			attr_dev(div1, "class", "collection-stats");
    			add_location(div1, file$2, 77, 0, 1675);
    			add_location(span0, file$2, 79, 36, 1777);
    			attr_dev(span1, "class", "stats-value");
    			add_location(span1, file$2, 79, 49, 1790);
    			attr_dev(span2, "class", "stats-name svelte-jq1cov");
    			add_location(span2, file$2, 79, 0, 1741);
    			attr_dev(div2, "class", "collecion-name");
    			add_location(div2, file$2, 78, 0, 1712);
    			attr_dev(div3, "class", "collection-amount svelte-jq1cov");
    			add_location(div3, file$2, 81, 0, 1843);
    			attr_dev(div4, "class", "content svelte-jq1cov");
    			add_location(div4, file$2, 75, 0, 1550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, span2);
    			append_dev(span2, t2);
    			append_dev(span2, t3);
    			append_dev(span2, span0);
    			append_dev(span2, span1);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageurl*/ 4 && !src_url_equal(img.src, img_src_value = /*imageurl*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*ITEMNAME*/ 1 && img_alt_value !== (img_alt_value = "Image " + /*ITEMNAME*/ ctx[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*ITEMNAME*/ 1) set_data_dev(t2, /*ITEMNAME*/ ctx[0]);
    			if (dirty & /*string*/ 2 && t6_value !== (t6_value = reun$1(/*string*/ ctx[1]) + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function reun$1(valable) {
    	if (valable === undefined) {
    		return 0;
    	} else {
    		return valable;
    	}
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CollectionUI', slots, []);
    	let { ITEMNAME = undefined } = $$props;
    	let { string = undefined } = $$props;
    	let { collectiontier = undefined } = $$props;
    	let { imageurl = undefined } = $$props;
    	let { maxtier = undefined } = $$props;

    	function getlevel() {
    		if (string === undefined) {
    			return 0;
    		}

    		if (string >= maxtier) {
    			return "MAX";
    		}

    		for (let i = 0; i < collectiontier.length; i++) {
    			if (collectiontier[i] - string > 0) {
    				return i - 1;
    			}
    		}
    	}

    	const writable_props = ['ITEMNAME', 'string', 'collectiontier', 'imageurl', 'maxtier'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CollectionUI> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ITEMNAME' in $$props) $$invalidate(0, ITEMNAME = $$props.ITEMNAME);
    		if ('string' in $$props) $$invalidate(1, string = $$props.string);
    		if ('collectiontier' in $$props) $$invalidate(4, collectiontier = $$props.collectiontier);
    		if ('imageurl' in $$props) $$invalidate(2, imageurl = $$props.imageurl);
    		if ('maxtier' in $$props) $$invalidate(5, maxtier = $$props.maxtier);
    	};

    	$$self.$capture_state = () => ({
    		ITEMNAME,
    		string,
    		collectiontier,
    		imageurl,
    		maxtier,
    		reun: reun$1,
    		getlevel
    	});

    	$$self.$inject_state = $$props => {
    		if ('ITEMNAME' in $$props) $$invalidate(0, ITEMNAME = $$props.ITEMNAME);
    		if ('string' in $$props) $$invalidate(1, string = $$props.string);
    		if ('collectiontier' in $$props) $$invalidate(4, collectiontier = $$props.collectiontier);
    		if ('imageurl' in $$props) $$invalidate(2, imageurl = $$props.imageurl);
    		if ('maxtier' in $$props) $$invalidate(5, maxtier = $$props.maxtier);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ITEMNAME, string, imageurl, getlevel, collectiontier, maxtier];
    }

    class CollectionUI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			ITEMNAME: 0,
    			string: 1,
    			collectiontier: 4,
    			imageurl: 2,
    			maxtier: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CollectionUI",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get ITEMNAME() {
    		throw new Error("<CollectionUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ITEMNAME(value) {
    		throw new Error("<CollectionUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get string() {
    		throw new Error("<CollectionUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set string(value) {
    		throw new Error("<CollectionUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collectiontier() {
    		throw new Error("<CollectionUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collectiontier(value) {
    		throw new Error("<CollectionUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageurl() {
    		throw new Error("<CollectionUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageurl(value) {
    		throw new Error("<CollectionUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxtier() {
    		throw new Error("<CollectionUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxtier(value) {
    		throw new Error("<CollectionUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/component/ImageText.svelte generated by Svelte v3.46.6 */

    const file$1 = "src/component/ImageText.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = text(/*text*/ ctx[2]);
    			attr_dev(img, "class", "normalimage");
    			if (!src_url_equal(img.src, img_src_value = /*imageurl*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*Alt*/ ctx[0]);
    			add_location(img, file$1, 5, 24, 130);
    			attr_dev(div, "class", "subsubtext");
    			add_location(div, file$1, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageText', slots, []);
    	const Alt = "";
    	const imageurl = "";
    	const text = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageText> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Alt, imageurl, text });
    	return [Alt, imageurl, text];
    }

    class ImageText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { Alt: 0, imageurl: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageText",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get Alt() {
    		return this.$$.ctx[0];
    	}

    	set Alt(value) {
    		throw new Error("<ImageText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageurl() {
    		return this.$$.ctx[1];
    	}

    	set imageurl(value) {
    		throw new Error("<ImageText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		return this.$$.ctx[2];
    	}

    	set text(value) {
    		throw new Error("<ImageText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var bignumber = createCommonjsModule(function (module) {
    (function (globalObject) {

    /*
     *      bignumber.js v9.0.2
     *      A JavaScript library for arbitrary-precision arithmetic.
     *      https://github.com/MikeMcl/bignumber.js
     *      Copyright (c) 2021 Michael Mclaughlin <M8ch88l@gmail.com>
     *      MIT Licensed.
     *
     *      BigNumber.prototype methods     |  BigNumber methods
     *                                      |
     *      absoluteValue            abs    |  clone
     *      comparedTo                      |  config               set
     *      decimalPlaces            dp     |      DECIMAL_PLACES
     *      dividedBy                div    |      ROUNDING_MODE
     *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
     *      exponentiatedBy          pow    |      RANGE
     *      integerValue                    |      CRYPTO
     *      isEqualTo                eq     |      MODULO_MODE
     *      isFinite                        |      POW_PRECISION
     *      isGreaterThan            gt     |      FORMAT
     *      isGreaterThanOrEqualTo   gte    |      ALPHABET
     *      isInteger                       |  isBigNumber
     *      isLessThan               lt     |  maximum              max
     *      isLessThanOrEqualTo      lte    |  minimum              min
     *      isNaN                           |  random
     *      isNegative                      |  sum
     *      isPositive                      |
     *      isZero                          |
     *      minus                           |
     *      modulo                   mod    |
     *      multipliedBy             times  |
     *      negated                         |
     *      plus                            |
     *      precision                sd     |
     *      shiftedBy                       |
     *      squareRoot               sqrt   |
     *      toExponential                   |
     *      toFixed                         |
     *      toFormat                        |
     *      toFraction                      |
     *      toJSON                          |
     *      toNumber                        |
     *      toPrecision                     |
     *      toString                        |
     *      valueOf                         |
     *
     */


      var BigNumber,
        isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
        mathceil = Math.ceil,
        mathfloor = Math.floor,

        bignumberError = '[BigNumber Error] ',
        tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

        BASE = 1e14,
        LOG_BASE = 14,
        MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
        // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
        SQRT_BASE = 1e7,

        // EDITABLE
        // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
        // the arguments to toExponential, toFixed, toFormat, and toPrecision.
        MAX = 1E9;                                   // 0 to MAX_INT32


      /*
       * Create and return a BigNumber constructor.
       */
      function clone(configObject) {
        var div, convertBase, parseNumeric,
          P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
          ONE = new BigNumber(1),


          //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


          // The default values below must be integers within the inclusive ranges stated.
          // The values can also be changed at run-time using BigNumber.set.

          // The maximum number of decimal places for operations involving division.
          DECIMAL_PLACES = 20,                     // 0 to MAX

          // The rounding mode used when rounding to the above decimal places, and when using
          // toExponential, toFixed, toFormat and toPrecision, and round (default value).
          // UP         0 Away from zero.
          // DOWN       1 Towards zero.
          // CEIL       2 Towards +Infinity.
          // FLOOR      3 Towards -Infinity.
          // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
          // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
          // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
          // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
          // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
          ROUNDING_MODE = 4,                       // 0 to 8

          // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

          // The exponent value at and beneath which toString returns exponential notation.
          // Number type: -7
          TO_EXP_NEG = -7,                         // 0 to -MAX

          // The exponent value at and above which toString returns exponential notation.
          // Number type: 21
          TO_EXP_POS = 21,                         // 0 to MAX

          // RANGE : [MIN_EXP, MAX_EXP]

          // The minimum exponent value, beneath which underflow to zero occurs.
          // Number type: -324  (5e-324)
          MIN_EXP = -1e7,                          // -1 to -MAX

          // The maximum exponent value, above which overflow to Infinity occurs.
          // Number type:  308  (1.7976931348623157e+308)
          // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
          MAX_EXP = 1e7,                           // 1 to MAX

          // Whether to use cryptographically-secure random number generation, if available.
          CRYPTO = false,                          // true or false

          // The modulo mode used when calculating the modulus: a mod n.
          // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
          // The remainder (r) is calculated as: r = a - n * q.
          //
          // UP        0 The remainder is positive if the dividend is negative, else is negative.
          // DOWN      1 The remainder has the same sign as the dividend.
          //             This modulo mode is commonly known as 'truncated division' and is
          //             equivalent to (a % n) in JavaScript.
          // FLOOR     3 The remainder has the same sign as the divisor (Python %).
          // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
          // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
          //             The remainder is always positive.
          //
          // The truncated division, floored division, Euclidian division and IEEE 754 remainder
          // modes are commonly used for the modulus operation.
          // Although the other rounding modes can also be used, they may not give useful results.
          MODULO_MODE = 1,                         // 0 to 9

          // The maximum number of significant digits of the result of the exponentiatedBy operation.
          // If POW_PRECISION is 0, there will be unlimited significant digits.
          POW_PRECISION = 0,                       // 0 to MAX

          // The format specification used by the BigNumber.prototype.toFormat method.
          FORMAT = {
            prefix: '',
            groupSize: 3,
            secondaryGroupSize: 0,
            groupSeparator: ',',
            decimalSeparator: '.',
            fractionGroupSize: 0,
            fractionGroupSeparator: '\xA0',        // non-breaking space
            suffix: ''
          },

          // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
          // '-', '.', whitespace, or repeated character.
          // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
          ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
          alphabetHasNormalDecimalDigits = true;


        //------------------------------------------------------------------------------------------


        // CONSTRUCTOR


        /*
         * The BigNumber constructor and exported function.
         * Create and return a new instance of a BigNumber object.
         *
         * v {number|string|BigNumber} A numeric value.
         * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
         */
        function BigNumber(v, b) {
          var alphabet, c, caseChanged, e, i, isNum, len, str,
            x = this;

          // Enable constructor call without `new`.
          if (!(x instanceof BigNumber)) return new BigNumber(v, b);

          if (b == null) {

            if (v && v._isBigNumber === true) {
              x.s = v.s;

              if (!v.c || v.e > MAX_EXP) {
                x.c = x.e = null;
              } else if (v.e < MIN_EXP) {
                x.c = [x.e = 0];
              } else {
                x.e = v.e;
                x.c = v.c.slice();
              }

              return;
            }

            if ((isNum = typeof v == 'number') && v * 0 == 0) {

              // Use `1 / n` to handle minus zero also.
              x.s = 1 / v < 0 ? (v = -v, -1) : 1;

              // Fast path for integers, where n < 2147483648 (2**31).
              if (v === ~~v) {
                for (e = 0, i = v; i >= 10; i /= 10, e++);

                if (e > MAX_EXP) {
                  x.c = x.e = null;
                } else {
                  x.e = e;
                  x.c = [v];
                }

                return;
              }

              str = String(v);
            } else {

              if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

              x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
            }

            // Decimal point?
            if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

            // Exponential form?
            if ((i = str.search(/e/i)) > 0) {

              // Determine exponent.
              if (e < 0) e = i;
              e += +str.slice(i + 1);
              str = str.substring(0, i);
            } else if (e < 0) {

              // Integer.
              e = str.length;
            }

          } else {

            // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
            intCheck(b, 2, ALPHABET.length, 'Base');

            // Allow exponential notation to be used with base 10 argument, while
            // also rounding to DECIMAL_PLACES as with other bases.
            if (b == 10 && alphabetHasNormalDecimalDigits) {
              x = new BigNumber(v);
              return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
            }

            str = String(v);

            if (isNum = typeof v == 'number') {

              // Avoid potential interpretation of Infinity and NaN as base 44+ values.
              if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

              x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

              // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
              if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
                throw Error
                 (tooManyDigits + v);
              }
            } else {
              x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
            }

            alphabet = ALPHABET.slice(0, b);
            e = i = 0;

            // Check that str is a valid base b number.
            // Don't use RegExp, so alphabet can contain special characters.
            for (len = str.length; i < len; i++) {
              if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                if (c == '.') {

                  // If '.' is not the first character and it has not be found before.
                  if (i > e) {
                    e = len;
                    continue;
                  }
                } else if (!caseChanged) {

                  // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                  if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                      str == str.toLowerCase() && (str = str.toUpperCase())) {
                    caseChanged = true;
                    i = -1;
                    e = 0;
                    continue;
                  }
                }

                return parseNumeric(x, String(v), isNum, b);
              }
            }

            // Prevent later check for length on converted number.
            isNum = false;
            str = convertBase(str, b, 10, x.s);

            // Decimal point?
            if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
            else e = str.length;
          }

          // Determine leading zeros.
          for (i = 0; str.charCodeAt(i) === 48; i++);

          // Determine trailing zeros.
          for (len = str.length; str.charCodeAt(--len) === 48;);

          if (str = str.slice(i, ++len)) {
            len -= i;

            // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
            if (isNum && BigNumber.DEBUG &&
              len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
                throw Error
                 (tooManyDigits + (x.s * v));
            }

             // Overflow?
            if ((e = e - i - 1) > MAX_EXP) {

              // Infinity.
              x.c = x.e = null;

            // Underflow?
            } else if (e < MIN_EXP) {

              // Zero.
              x.c = [x.e = 0];
            } else {
              x.e = e;
              x.c = [];

              // Transform base

              // e is the base 10 exponent.
              // i is where to slice str to get the first element of the coefficient array.
              i = (e + 1) % LOG_BASE;
              if (e < 0) i += LOG_BASE;  // i < 1

              if (i < len) {
                if (i) x.c.push(+str.slice(0, i));

                for (len -= LOG_BASE; i < len;) {
                  x.c.push(+str.slice(i, i += LOG_BASE));
                }

                i = LOG_BASE - (str = str.slice(i)).length;
              } else {
                i -= len;
              }

              for (; i--; str += '0');
              x.c.push(+str);
            }
          } else {

            // Zero.
            x.c = [x.e = 0];
          }
        }


        // CONSTRUCTOR PROPERTIES


        BigNumber.clone = clone;

        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;


        /*
         * Configure infrequently-changing library-wide settings.
         *
         * Accept an object with the following optional properties (if the value of a property is
         * a number, it must be an integer within the inclusive range stated):
         *
         *   DECIMAL_PLACES   {number}           0 to MAX
         *   ROUNDING_MODE    {number}           0 to 8
         *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
         *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
         *   CRYPTO           {boolean}          true or false
         *   MODULO_MODE      {number}           0 to 9
         *   POW_PRECISION       {number}           0 to MAX
         *   ALPHABET         {string}           A string of two or more unique characters which does
         *                                       not contain '.'.
         *   FORMAT           {object}           An object with some of the following properties:
         *     prefix                 {string}
         *     groupSize              {number}
         *     secondaryGroupSize     {number}
         *     groupSeparator         {string}
         *     decimalSeparator       {string}
         *     fractionGroupSize      {number}
         *     fractionGroupSeparator {string}
         *     suffix                 {string}
         *
         * (The values assigned to the above FORMAT object properties are not checked for validity.)
         *
         * E.g.
         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
         *
         * Ignore properties/parameters set to null or undefined, except for ALPHABET.
         *
         * Return an object with the properties current values.
         */
        BigNumber.config = BigNumber.set = function (obj) {
          var p, v;

          if (obj != null) {

            if (typeof obj == 'object') {

              // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
              // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                DECIMAL_PLACES = v;
              }

              // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
              // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
                v = obj[p];
                intCheck(v, 0, 8, p);
                ROUNDING_MODE = v;
              }

              // EXPONENTIAL_AT {number|number[]}
              // Integer, -MAX to MAX inclusive or
              // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
              // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
                v = obj[p];
                if (v && v.pop) {
                  intCheck(v[0], -MAX, 0, p);
                  intCheck(v[1], 0, MAX, p);
                  TO_EXP_NEG = v[0];
                  TO_EXP_POS = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);
                  TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
                }
              }

              // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
              // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
              // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
              if (obj.hasOwnProperty(p = 'RANGE')) {
                v = obj[p];
                if (v && v.pop) {
                  intCheck(v[0], -MAX, -1, p);
                  intCheck(v[1], 1, MAX, p);
                  MIN_EXP = v[0];
                  MAX_EXP = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);
                  if (v) {
                    MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                  } else {
                    throw Error
                     (bignumberError + p + ' cannot be zero: ' + v);
                  }
                }
              }

              // CRYPTO {boolean} true or false.
              // '[BigNumber Error] CRYPTO not true or false: {v}'
              // '[BigNumber Error] crypto unavailable'
              if (obj.hasOwnProperty(p = 'CRYPTO')) {
                v = obj[p];
                if (v === !!v) {
                  if (v) {
                    if (typeof crypto != 'undefined' && crypto &&
                     (crypto.getRandomValues || crypto.randomBytes)) {
                      CRYPTO = v;
                    } else {
                      CRYPTO = !v;
                      throw Error
                       (bignumberError + 'crypto unavailable');
                    }
                  } else {
                    CRYPTO = v;
                  }
                } else {
                  throw Error
                   (bignumberError + p + ' not true or false: ' + v);
                }
              }

              // MODULO_MODE {number} Integer, 0 to 9 inclusive.
              // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
                v = obj[p];
                intCheck(v, 0, 9, p);
                MODULO_MODE = v;
              }

              // POW_PRECISION {number} Integer, 0 to MAX inclusive.
              // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                POW_PRECISION = v;
              }

              // FORMAT {object}
              // '[BigNumber Error] FORMAT not an object: {v}'
              if (obj.hasOwnProperty(p = 'FORMAT')) {
                v = obj[p];
                if (typeof v == 'object') FORMAT = v;
                else throw Error
                 (bignumberError + p + ' not an object: ' + v);
              }

              // ALPHABET {string}
              // '[BigNumber Error] ALPHABET invalid: {v}'
              if (obj.hasOwnProperty(p = 'ALPHABET')) {
                v = obj[p];

                // Disallow if less than two characters,
                // or if it contains '+', '-', '.', whitespace, or a repeated character.
                if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                  alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
                  ALPHABET = v;
                } else {
                  throw Error
                   (bignumberError + p + ' invalid: ' + v);
                }
              }

            } else {

              // '[BigNumber Error] Object expected: {v}'
              throw Error
               (bignumberError + 'Object expected: ' + obj);
            }
          }

          return {
            DECIMAL_PLACES: DECIMAL_PLACES,
            ROUNDING_MODE: ROUNDING_MODE,
            EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
            RANGE: [MIN_EXP, MAX_EXP],
            CRYPTO: CRYPTO,
            MODULO_MODE: MODULO_MODE,
            POW_PRECISION: POW_PRECISION,
            FORMAT: FORMAT,
            ALPHABET: ALPHABET
          };
        };


        /*
         * Return true if v is a BigNumber instance, otherwise return false.
         *
         * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
         *
         * v {any}
         *
         * '[BigNumber Error] Invalid BigNumber: {v}'
         */
        BigNumber.isBigNumber = function (v) {
          if (!v || v._isBigNumber !== true) return false;
          if (!BigNumber.DEBUG) return true;

          var i, n,
            c = v.c,
            e = v.e,
            s = v.s;

          out: if ({}.toString.call(c) == '[object Array]') {

            if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

              // If the first element is zero, the BigNumber value must be zero.
              if (c[0] === 0) {
                if (e === 0 && c.length === 1) return true;
                break out;
              }

              // Calculate number of digits that c[0] should have, based on the exponent.
              i = (e + 1) % LOG_BASE;
              if (i < 1) i += LOG_BASE;

              // Calculate number of digits of c[0].
              //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
              if (String(c[0]).length == i) {

                for (i = 0; i < c.length; i++) {
                  n = c[i];
                  if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
                }

                // Last element cannot be zero, unless it is the only element.
                if (n !== 0) return true;
              }
            }

          // Infinity/NaN
          } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
            return true;
          }

          throw Error
            (bignumberError + 'Invalid BigNumber: ' + v);
        };


        /*
         * Return a new BigNumber whose value is the maximum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.maximum = BigNumber.max = function () {
          return maxOrMin(arguments, P.lt);
        };


        /*
         * Return a new BigNumber whose value is the minimum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.minimum = BigNumber.min = function () {
          return maxOrMin(arguments, P.gt);
        };


        /*
         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
         * zeros are produced).
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
         * '[BigNumber Error] crypto unavailable'
         */
        BigNumber.random = (function () {
          var pow2_53 = 0x20000000000000;

          // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
          // Check if Math.random() produces more than 32 bits of randomness.
          // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
          // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
          var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
           ? function () { return mathfloor(Math.random() * pow2_53); }
           : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
             (Math.random() * 0x800000 | 0); };

          return function (dp) {
            var a, b, e, k, v,
              i = 0,
              c = [],
              rand = new BigNumber(ONE);

            if (dp == null) dp = DECIMAL_PLACES;
            else intCheck(dp, 0, MAX);

            k = mathceil(dp / LOG_BASE);

            if (CRYPTO) {

              // Browsers supporting crypto.getRandomValues.
              if (crypto.getRandomValues) {

                a = crypto.getRandomValues(new Uint32Array(k *= 2));

                for (; i < k;) {

                  // 53 bits:
                  // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                  // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                  // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                  //                                     11111 11111111 11111111
                  // 0x20000 is 2^21.
                  v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                  // Rejection sampling:
                  // 0 <= v < 9007199254740992
                  // Probability that v >= 9e15, is
                  // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                  if (v >= 9e15) {
                    b = crypto.getRandomValues(new Uint32Array(2));
                    a[i] = b[0];
                    a[i + 1] = b[1];
                  } else {

                    // 0 <= v <= 8999999999999999
                    // 0 <= (v % 1e14) <= 99999999999999
                    c.push(v % 1e14);
                    i += 2;
                  }
                }
                i = k / 2;

              // Node.js supporting crypto.randomBytes.
              } else if (crypto.randomBytes) {

                // buffer
                a = crypto.randomBytes(k *= 7);

                for (; i < k;) {

                  // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                  // 0x100000000 is 2^32, 0x1000000 is 2^24
                  // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                  // 0 <= v < 9007199254740992
                  v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                     (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                     (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

                  if (v >= 9e15) {
                    crypto.randomBytes(7).copy(a, i);
                  } else {

                    // 0 <= (v % 1e14) <= 99999999999999
                    c.push(v % 1e14);
                    i += 7;
                  }
                }
                i = k / 7;
              } else {
                CRYPTO = false;
                throw Error
                 (bignumberError + 'crypto unavailable');
              }
            }

            // Use Math.random.
            if (!CRYPTO) {

              for (; i < k;) {
                v = random53bitInt();
                if (v < 9e15) c[i++] = v % 1e14;
              }
            }

            k = c[--i];
            dp %= LOG_BASE;

            // Convert trailing digits to zeros according to dp.
            if (k && dp) {
              v = POWS_TEN[LOG_BASE - dp];
              c[i] = mathfloor(k / v) * v;
            }

            // Remove trailing elements which are zero.
            for (; c[i] === 0; c.pop(), i--);

            // Zero?
            if (i < 0) {
              c = [e = 0];
            } else {

              // Remove leading elements which are zero and adjust exponent accordingly.
              for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

              // Count the digits of the first element of c to determine leading zeros, and...
              for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

              // adjust the exponent accordingly.
              if (i < LOG_BASE) e -= LOG_BASE - i;
            }

            rand.e = e;
            rand.c = c;
            return rand;
          };
        })();


        /*
         * Return a BigNumber whose value is the sum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.sum = function () {
          var i = 1,
            args = arguments,
            sum = new BigNumber(args[0]);
          for (; i < args.length;) sum = sum.plus(args[i++]);
          return sum;
        };


        // PRIVATE FUNCTIONS


        // Called by BigNumber and BigNumber.prototype.toString.
        convertBase = (function () {
          var decimal = '0123456789';

          /*
           * Convert string of baseIn to an array of numbers of baseOut.
           * Eg. toBaseOut('255', 10, 16) returns [15, 15].
           * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
           */
          function toBaseOut(str, baseIn, baseOut, alphabet) {
            var j,
              arr = [0],
              arrL,
              i = 0,
              len = str.length;

            for (; i < len;) {
              for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

              arr[0] += alphabet.indexOf(str.charAt(i++));

              for (j = 0; j < arr.length; j++) {

                if (arr[j] > baseOut - 1) {
                  if (arr[j + 1] == null) arr[j + 1] = 0;
                  arr[j + 1] += arr[j] / baseOut | 0;
                  arr[j] %= baseOut;
                }
              }
            }

            return arr.reverse();
          }

          // Convert a numeric string of baseIn to a numeric string of baseOut.
          // If the caller is toString, we are converting from base 10 to baseOut.
          // If the caller is BigNumber, we are converting from baseIn to base 10.
          return function (str, baseIn, baseOut, sign, callerIsToString) {
            var alphabet, d, e, k, r, x, xc, y,
              i = str.indexOf('.'),
              dp = DECIMAL_PLACES,
              rm = ROUNDING_MODE;

            // Non-integer.
            if (i >= 0) {
              k = POW_PRECISION;

              // Unlimited precision.
              POW_PRECISION = 0;
              str = str.replace('.', '');
              y = new BigNumber(baseIn);
              x = y.pow(str.length - i);
              POW_PRECISION = k;

              // Convert str as if an integer, then restore the fraction part by dividing the
              // result by its base raised to a power.

              y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
               10, baseOut, decimal);
              y.e = y.c.length;
            }

            // Convert the number as integer.

            xc = toBaseOut(str, baseIn, baseOut, callerIsToString
             ? (alphabet = ALPHABET, decimal)
             : (alphabet = decimal, ALPHABET));

            // xc now represents str as an integer and converted to baseOut. e is the exponent.
            e = k = xc.length;

            // Remove trailing zeros.
            for (; xc[--k] == 0; xc.pop());

            // Zero?
            if (!xc[0]) return alphabet.charAt(0);

            // Does str represent an integer? If so, no need for the division.
            if (i < 0) {
              --e;
            } else {
              x.c = xc;
              x.e = e;

              // The sign is needed for correct rounding.
              x.s = sign;
              x = div(x, y, dp, rm, baseOut);
              xc = x.c;
              r = x.r;
              e = x.e;
            }

            // xc now represents str converted to baseOut.

            // THe index of the rounding digit.
            d = e + dp + 1;

            // The rounding digit: the digit to the right of the digit that may be rounded up.
            i = xc[d];

            // Look at the rounding digits and mode to determine whether to round up.

            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;

            r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                  : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                   rm == (x.s < 0 ? 8 : 7));

            // If the index of the rounding digit is not greater than zero, or xc represents
            // zero, then the result of the base conversion is zero or, if rounding up, a value
            // such as 0.00001.
            if (d < 1 || !xc[0]) {

              // 1^-dp or 0
              str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
            } else {

              // Truncate xc to the required number of decimal places.
              xc.length = d;

              // Round up?
              if (r) {

                // Rounding up may mean the previous digit has to be rounded up and so on.
                for (--baseOut; ++xc[--d] > baseOut;) {
                  xc[d] = 0;

                  if (!d) {
                    ++e;
                    xc = [1].concat(xc);
                  }
                }
              }

              // Determine trailing zeros.
              for (k = xc.length; !xc[--k];);

              // E.g. [4, 11, 15] becomes 4bf.
              for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

              // Add leading zeros, decimal point and trailing zeros as required.
              str = toFixedPoint(str, e, alphabet.charAt(0));
            }

            // The caller will add the sign.
            return str;
          };
        })();


        // Perform division in the specified base. Called by div and convertBase.
        div = (function () {

          // Assume non-zero x and k.
          function multiply(x, k, base) {
            var m, temp, xlo, xhi,
              carry = 0,
              i = x.length,
              klo = k % SQRT_BASE,
              khi = k / SQRT_BASE | 0;

            for (x = x.slice(); i--;) {
              xlo = x[i] % SQRT_BASE;
              xhi = x[i] / SQRT_BASE | 0;
              m = khi * xlo + xhi * klo;
              temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
              carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
              x[i] = temp % base;
            }

            if (carry) x = [carry].concat(x);

            return x;
          }

          function compare(a, b, aL, bL) {
            var i, cmp;

            if (aL != bL) {
              cmp = aL > bL ? 1 : -1;
            } else {

              for (i = cmp = 0; i < aL; i++) {

                if (a[i] != b[i]) {
                  cmp = a[i] > b[i] ? 1 : -1;
                  break;
                }
              }
            }

            return cmp;
          }

          function subtract(a, b, aL, base) {
            var i = 0;

            // Subtract b from a.
            for (; aL--;) {
              a[aL] -= i;
              i = a[aL] < b[aL] ? 1 : 0;
              a[aL] = i * base + a[aL] - b[aL];
            }

            // Remove leading zeros.
            for (; !a[0] && a.length > 1; a.splice(0, 1));
          }

          // x: dividend, y: divisor.
          return function (x, y, dp, rm, base) {
            var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
              yL, yz,
              s = x.s == y.s ? 1 : -1,
              xc = x.c,
              yc = y.c;

            // Either NaN, Infinity or 0?
            if (!xc || !xc[0] || !yc || !yc[0]) {

              return new BigNumber(

               // Return NaN if either NaN, or both Infinity or 0.
               !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

                // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                xc && xc[0] == 0 || !yc ? s * 0 : s / 0
             );
            }

            q = new BigNumber(s);
            qc = q.c = [];
            e = x.e - y.e;
            s = dp + e + 1;

            if (!base) {
              base = BASE;
              e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
              s = s / LOG_BASE | 0;
            }

            // Result exponent may be one less then the current value of e.
            // The coefficients of the BigNumbers from convertBase may have trailing zeros.
            for (i = 0; yc[i] == (xc[i] || 0); i++);

            if (yc[i] > (xc[i] || 0)) e--;

            if (s < 0) {
              qc.push(1);
              more = true;
            } else {
              xL = xc.length;
              yL = yc.length;
              i = 0;
              s += 2;

              // Normalise xc and yc so highest order digit of yc is >= base / 2.

              n = mathfloor(base / (yc[0] + 1));

              // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
              // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
              if (n > 1) {
                yc = multiply(yc, n, base);
                xc = multiply(xc, n, base);
                yL = yc.length;
                xL = xc.length;
              }

              xi = yL;
              rem = xc.slice(0, yL);
              remL = rem.length;

              // Add zeros to make remainder as long as divisor.
              for (; remL < yL; rem[remL++] = 0);
              yz = yc.slice();
              yz = [0].concat(yz);
              yc0 = yc[0];
              if (yc[1] >= base / 2) yc0++;
              // Not necessary, but to prevent trial digit n > base, when using base 3.
              // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

              do {
                n = 0;

                // Compare divisor and remainder.
                cmp = compare(yc, rem, yL, remL);

                // If divisor < remainder.
                if (cmp < 0) {

                  // Calculate trial digit, n.

                  rem0 = rem[0];
                  if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

                  // n is how many times the divisor goes into the current remainder.
                  n = mathfloor(rem0 / yc0);

                  //  Algorithm:
                  //  product = divisor multiplied by trial digit (n).
                  //  Compare product and remainder.
                  //  If product is greater than remainder:
                  //    Subtract divisor from product, decrement trial digit.
                  //  Subtract product from remainder.
                  //  If product was less than remainder at the last compare:
                  //    Compare new remainder and divisor.
                  //    If remainder is greater than divisor:
                  //      Subtract divisor from remainder, increment trial digit.

                  if (n > 1) {

                    // n may be > base only when base is 3.
                    if (n >= base) n = base - 1;

                    // product = divisor * trial digit.
                    prod = multiply(yc, n, base);
                    prodL = prod.length;
                    remL = rem.length;

                    // Compare product and remainder.
                    // If product > remainder then trial digit n too high.
                    // n is 1 too high about 5% of the time, and is not known to have
                    // ever been more than 1 too high.
                    while (compare(prod, rem, prodL, remL) == 1) {
                      n--;

                      // Subtract divisor from product.
                      subtract(prod, yL < prodL ? yz : yc, prodL, base);
                      prodL = prod.length;
                      cmp = 1;
                    }
                  } else {

                    // n is 0 or 1, cmp is -1.
                    // If n is 0, there is no need to compare yc and rem again below,
                    // so change cmp to 1 to avoid it.
                    // If n is 1, leave cmp as -1, so yc and rem are compared again.
                    if (n == 0) {

                      // divisor < remainder, so n must be at least 1.
                      cmp = n = 1;
                    }

                    // product = divisor
                    prod = yc.slice();
                    prodL = prod.length;
                  }

                  if (prodL < remL) prod = [0].concat(prod);

                  // Subtract product from remainder.
                  subtract(rem, prod, remL, base);
                  remL = rem.length;

                   // If product was < remainder.
                  if (cmp == -1) {

                    // Compare divisor and new remainder.
                    // If divisor < new remainder, subtract divisor from remainder.
                    // Trial digit n too low.
                    // n is 1 too low about 5% of the time, and very rarely 2 too low.
                    while (compare(yc, rem, yL, remL) < 1) {
                      n++;

                      // Subtract divisor from remainder.
                      subtract(rem, yL < remL ? yz : yc, remL, base);
                      remL = rem.length;
                    }
                  }
                } else if (cmp === 0) {
                  n++;
                  rem = [0];
                } // else cmp === 1 and n will be 0

                // Add the next digit, n, to the result array.
                qc[i++] = n;

                // Update the remainder.
                if (rem[0]) {
                  rem[remL++] = xc[xi] || 0;
                } else {
                  rem = [xc[xi]];
                  remL = 1;
                }
              } while ((xi++ < xL || rem[0] != null) && s--);

              more = rem[0] != null;

              // Leading zero?
              if (!qc[0]) qc.splice(0, 1);
            }

            if (base == BASE) {

              // To calculate q.e, first get the number of digits of qc[0].
              for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

              round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

            // Caller is convertBase.
            } else {
              q.e = e;
              q.r = +more;
            }

            return q;
          };
        })();


        /*
         * Return a string representing the value of BigNumber n in fixed-point or exponential
         * notation rounded to the specified decimal places or significant digits.
         *
         * n: a BigNumber.
         * i: the index of the last digit required (i.e. the digit that may be rounded up).
         * rm: the rounding mode.
         * id: 1 (toExponential) or 2 (toPrecision).
         */
        function format(n, i, rm, id) {
          var c0, e, ne, len, str;

          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);

          if (!n.c) return n.toString();

          c0 = n.c[0];
          ne = n.e;

          if (i == null) {
            str = coeffToString(n.c);
            str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
             ? toExponential(str, ne)
             : toFixedPoint(str, ne, '0');
          } else {
            n = round(new BigNumber(n), i, rm);

            // n.e may have changed if the value was rounded up.
            e = n.e;

            str = coeffToString(n.c);
            len = str.length;

            // toPrecision returns exponential notation if the number of significant digits
            // specified is less than the number of digits necessary to represent the integer
            // part of the value in fixed-point notation.

            // Exponential notation.
            if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

              // Append zeros?
              for (; len < i; str += '0', len++);
              str = toExponential(str, e);

            // Fixed-point notation.
            } else {
              i -= ne;
              str = toFixedPoint(str, e, '0');

              // Append zeros?
              if (e + 1 > len) {
                if (--i > 0) for (str += '.'; i--; str += '0');
              } else {
                i += e - len;
                if (i > 0) {
                  if (e + 1 == len) str += '.';
                  for (; i--; str += '0');
                }
              }
            }
          }

          return n.s < 0 && c0 ? '-' + str : str;
        }


        // Handle BigNumber.max and BigNumber.min.
        function maxOrMin(args, method) {
          var n,
            i = 1,
            m = new BigNumber(args[0]);

          for (; i < args.length; i++) {
            n = new BigNumber(args[i]);

            // If any number is NaN, return NaN.
            if (!n.s) {
              m = n;
              break;
            } else if (method.call(m, n)) {
              m = n;
            }
          }

          return m;
        }


        /*
         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
         * Called by minus, plus and times.
         */
        function normalise(n, c, e) {
          var i = 1,
            j = c.length;

           // Remove trailing zeros.
          for (; !c[--j]; c.pop());

          // Calculate the base 10 exponent. First get the number of digits of c[0].
          for (j = c[0]; j >= 10; j /= 10, i++);

          // Overflow?
          if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

            // Infinity.
            n.c = n.e = null;

          // Underflow?
          } else if (e < MIN_EXP) {

            // Zero.
            n.c = [n.e = 0];
          } else {
            n.e = e;
            n.c = c;
          }

          return n;
        }


        // Handle values that fail the validity test in BigNumber.
        parseNumeric = (function () {
          var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
            dotAfter = /^([^.]+)\.$/,
            dotBefore = /^\.([^.]+)$/,
            isInfinityOrNaN = /^-?(Infinity|NaN)$/,
            whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

          return function (x, str, isNum, b) {
            var base,
              s = isNum ? str : str.replace(whitespaceOrPlus, '');

            // No exception on ±Infinity or NaN.
            if (isInfinityOrNaN.test(s)) {
              x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
            } else {
              if (!isNum) {

                // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                s = s.replace(basePrefix, function (m, p1, p2) {
                  base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                  return !b || b == base ? p1 : m;
                });

                if (b) {
                  base = b;

                  // E.g. '1.' to '1', '.1' to '0.1'
                  s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
                }

                if (str != s) return new BigNumber(s, base);
              }

              // '[BigNumber Error] Not a number: {n}'
              // '[BigNumber Error] Not a base {b} number: {n}'
              if (BigNumber.DEBUG) {
                throw Error
                  (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
              }

              // NaN
              x.s = null;
            }

            x.c = x.e = null;
          }
        })();


        /*
         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
         * If r is truthy, it is known that there are more digits after the rounding digit.
         */
        function round(x, sd, rm, r) {
          var d, i, j, k, n, ni, rd,
            xc = x.c,
            pows10 = POWS_TEN;

          // if x is not Infinity or NaN...
          if (xc) {

            // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
            // n is a base 1e14 number, the value of the element of array x.c containing rd.
            // ni is the index of n within x.c.
            // d is the number of digits of n.
            // i is the index of rd within n including leading zeros.
            // j is the actual index of rd within n (if < 0, rd is a leading zero).
            out: {

              // Get the number of digits of the first element of xc.
              for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
              i = sd - d;

              // If the rounding digit is in the first element of xc...
              if (i < 0) {
                i += LOG_BASE;
                j = sd;
                n = xc[ni = 0];

                // Get the rounding digit at index j of n.
                rd = n / pows10[d - j - 1] % 10 | 0;
              } else {
                ni = mathceil((i + 1) / LOG_BASE);

                if (ni >= xc.length) {

                  if (r) {

                    // Needed by sqrt.
                    for (; xc.length <= ni; xc.push(0));
                    n = rd = 0;
                    d = 1;
                    i %= LOG_BASE;
                    j = i - LOG_BASE + 1;
                  } else {
                    break out;
                  }
                } else {
                  n = k = xc[ni];

                  // Get the number of digits of n.
                  for (d = 1; k >= 10; k /= 10, d++);

                  // Get the index of rd within n.
                  i %= LOG_BASE;

                  // Get the index of rd within n, adjusted for leading zeros.
                  // The number of leading zeros of n is given by LOG_BASE - d.
                  j = i - LOG_BASE + d;

                  // Get the rounding digit at index j of n.
                  rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
                }
              }

              r = r || sd < 0 ||

              // Are there any non-zero digits after the rounding digit?
              // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
              // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
               xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

              r = rm < 4
               ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
               : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

                // Check whether the digit to the left of the rounding digit is odd.
                ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
                 rm == (x.s < 0 ? 8 : 7));

              if (sd < 1 || !xc[0]) {
                xc.length = 0;

                if (r) {

                  // Convert sd to decimal places.
                  sd -= x.e + 1;

                  // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                  xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                  x.e = -sd || 0;
                } else {

                  // Zero.
                  xc[0] = x.e = 0;
                }

                return x;
              }

              // Remove excess digits.
              if (i == 0) {
                xc.length = ni;
                k = 1;
                ni--;
              } else {
                xc.length = ni + 1;
                k = pows10[LOG_BASE - i];

                // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                // j > 0 means i > number of leading zeros of n.
                xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
              }

              // Round up?
              if (r) {

                for (; ;) {

                  // If the digit to be rounded up is in the first element of xc...
                  if (ni == 0) {

                    // i will be the length of xc[0] before k is added.
                    for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                    j = xc[0] += k;
                    for (k = 1; j >= 10; j /= 10, k++);

                    // if i != k the length has increased.
                    if (i != k) {
                      x.e++;
                      if (xc[0] == BASE) xc[0] = 1;
                    }

                    break;
                  } else {
                    xc[ni] += k;
                    if (xc[ni] != BASE) break;
                    xc[ni--] = 0;
                    k = 1;
                  }
                }
              }

              // Remove trailing zeros.
              for (i = xc.length; xc[--i] === 0; xc.pop());
            }

            // Overflow? Infinity.
            if (x.e > MAX_EXP) {
              x.c = x.e = null;

            // Underflow? Zero.
            } else if (x.e < MIN_EXP) {
              x.c = [x.e = 0];
            }
          }

          return x;
        }


        function valueOf(n) {
          var str,
            e = n.e;

          if (e === null) return n.toString();

          str = coeffToString(n.c);

          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
            ? toExponential(str, e)
            : toFixedPoint(str, e, '0');

          return n.s < 0 ? '-' + str : str;
        }


        // PROTOTYPE/INSTANCE METHODS


        /*
         * Return a new BigNumber whose value is the absolute value of this BigNumber.
         */
        P.absoluteValue = P.abs = function () {
          var x = new BigNumber(this);
          if (x.s < 0) x.s = 1;
          return x;
        };


        /*
         * Return
         *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
         *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
         *   0 if they have the same value,
         *   or null if the value of either is NaN.
         */
        P.comparedTo = function (y, b) {
          return compare(this, new BigNumber(y, b));
        };


        /*
         * If dp is undefined or null or true or false, return the number of decimal places of the
         * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
         *
         * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
         * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
         * ROUNDING_MODE if rm is omitted.
         *
         * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */
        P.decimalPlaces = P.dp = function (dp, rm) {
          var c, n, v,
            x = this;

          if (dp != null) {
            intCheck(dp, 0, MAX);
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);

            return round(new BigNumber(x), dp + x.e + 1, rm);
          }

          if (!(c = x.c)) return null;
          n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

          // Subtract the number of trailing zeros of the last number.
          if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
          if (n < 0) n = 0;

          return n;
        };


        /*
         *  n / 0 = I
         *  n / N = N
         *  n / I = 0
         *  0 / n = 0
         *  0 / 0 = N
         *  0 / N = N
         *  0 / I = 0
         *  N / n = N
         *  N / 0 = N
         *  N / N = N
         *  N / I = N
         *  I / n = I
         *  I / 0 = I
         *  I / N = N
         *  I / I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.dividedBy = P.div = function (y, b) {
          return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
        };


        /*
         * Return a new BigNumber whose value is the integer part of dividing the value of this
         * BigNumber by the value of BigNumber(y, b).
         */
        P.dividedToIntegerBy = P.idiv = function (y, b) {
          return div(this, new BigNumber(y, b), 0, 1);
        };


        /*
         * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
         *
         * If m is present, return the result modulo m.
         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
         * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
         *
         * The modular power operation works efficiently when x, n, and m are integers, otherwise it
         * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
         *
         * n {number|string|BigNumber} The exponent. An integer.
         * [m] {number|string|BigNumber} The modulus.
         *
         * '[BigNumber Error] Exponent not an integer: {n}'
         */
        P.exponentiatedBy = P.pow = function (n, m) {
          var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
            x = this;

          n = new BigNumber(n);

          // Allow NaN and ±Infinity, but not other non-integers.
          if (n.c && !n.isInteger()) {
            throw Error
              (bignumberError + 'Exponent not an integer: ' + valueOf(n));
          }

          if (m != null) m = new BigNumber(m);

          // Exponent of MAX_SAFE_INTEGER is 15.
          nIsBig = n.e > 14;

          // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
          if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

            // The sign of the result of pow when x is negative depends on the evenness of n.
            // If +n overflows to ±Infinity, the evenness of n would be not be known.
            y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
            return m ? y.mod(m) : y;
          }

          nIsNeg = n.s < 0;

          if (m) {

            // x % m returns NaN if abs(m) is zero, or m is NaN.
            if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

            isModExp = !nIsNeg && x.isInteger() && m.isInteger();

            if (isModExp) x = x.mod(m);

          // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
          // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
          } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
            // [1, 240000000]
            ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
            // [80000000000000]  [99999750000000]
            : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

            // If x is negative and n is odd, k = -0, else k = 0.
            k = x.s < 0 && isOdd(n) ? -0 : 0;

            // If x >= 1, k = ±Infinity.
            if (x.e > -1) k = 1 / k;

            // If n is negative return ±0, else return ±Infinity.
            return new BigNumber(nIsNeg ? 1 / k : k);

          } else if (POW_PRECISION) {

            // Truncating each coefficient array to a length of k after each multiplication
            // equates to truncating significant digits to POW_PRECISION + [28, 41],
            // i.e. there will be a minimum of 28 guard digits retained.
            k = mathceil(POW_PRECISION / LOG_BASE + 2);
          }

          if (nIsBig) {
            half = new BigNumber(0.5);
            if (nIsNeg) n.s = 1;
            nIsOdd = isOdd(n);
          } else {
            i = Math.abs(+valueOf(n));
            nIsOdd = i % 2;
          }

          y = new BigNumber(ONE);

          // Performs 54 loop iterations for n of 9007199254740991.
          for (; ;) {

            if (nIsOdd) {
              y = y.times(x);
              if (!y.c) break;

              if (k) {
                if (y.c.length > k) y.c.length = k;
              } else if (isModExp) {
                y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
              }
            }

            if (i) {
              i = mathfloor(i / 2);
              if (i === 0) break;
              nIsOdd = i % 2;
            } else {
              n = n.times(half);
              round(n, n.e + 1, 1);

              if (n.e > 14) {
                nIsOdd = isOdd(n);
              } else {
                i = +valueOf(n);
                if (i === 0) break;
                nIsOdd = i % 2;
              }
            }

            x = x.times(x);

            if (k) {
              if (x.c && x.c.length > k) x.c.length = k;
            } else if (isModExp) {
              x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
            }
          }

          if (isModExp) return y;
          if (nIsNeg) y = ONE.div(y);

          return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
         * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
         */
        P.integerValue = function (rm) {
          var n = new BigNumber(this);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(n, n.e + 1, rm);
        };


        /*
         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
         * otherwise return false.
         */
        P.isEqualTo = P.eq = function (y, b) {
          return compare(this, new BigNumber(y, b)) === 0;
        };


        /*
         * Return true if the value of this BigNumber is a finite number, otherwise return false.
         */
        P.isFinite = function () {
          return !!this.c;
        };


        /*
         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * otherwise return false.
         */
        P.isGreaterThan = P.gt = function (y, b) {
          return compare(this, new BigNumber(y, b)) > 0;
        };


        /*
         * Return true if the value of this BigNumber is greater than or equal to the value of
         * BigNumber(y, b), otherwise return false.
         */
        P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
          return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

        };


        /*
         * Return true if the value of this BigNumber is an integer, otherwise return false.
         */
        P.isInteger = function () {
          return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
        };


        /*
         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
         * otherwise return false.
         */
        P.isLessThan = P.lt = function (y, b) {
          return compare(this, new BigNumber(y, b)) < 0;
        };


        /*
         * Return true if the value of this BigNumber is less than or equal to the value of
         * BigNumber(y, b), otherwise return false.
         */
        P.isLessThanOrEqualTo = P.lte = function (y, b) {
          return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
        };


        /*
         * Return true if the value of this BigNumber is NaN, otherwise return false.
         */
        P.isNaN = function () {
          return !this.s;
        };


        /*
         * Return true if the value of this BigNumber is negative, otherwise return false.
         */
        P.isNegative = function () {
          return this.s < 0;
        };


        /*
         * Return true if the value of this BigNumber is positive, otherwise return false.
         */
        P.isPositive = function () {
          return this.s > 0;
        };


        /*
         * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
         */
        P.isZero = function () {
          return !!this.c && this.c[0] == 0;
        };


        /*
         *  n - 0 = n
         *  n - N = N
         *  n - I = -I
         *  0 - n = -n
         *  0 - 0 = 0
         *  0 - N = N
         *  0 - I = -I
         *  N - n = N
         *  N - 0 = N
         *  N - N = N
         *  N - I = N
         *  I - n = I
         *  I - 0 = I
         *  I - N = N
         *  I - I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
         * BigNumber(y, b).
         */
        P.minus = function (y, b) {
          var i, j, t, xLTy,
            x = this,
            a = x.s;

          y = new BigNumber(y, b);
          b = y.s;

          // Either NaN?
          if (!a || !b) return new BigNumber(NaN);

          // Signs differ?
          if (a != b) {
            y.s = -b;
            return x.plus(y);
          }

          var xe = x.e / LOG_BASE,
            ye = y.e / LOG_BASE,
            xc = x.c,
            yc = y.c;

          if (!xe || !ye) {

            // Either Infinity?
            if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

            // Either zero?
            if (!xc[0] || !yc[0]) {

              // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
              return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

               // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
               ROUNDING_MODE == 3 ? -0 : 0);
            }
          }

          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice();

          // Determine which is the bigger number.
          if (a = xe - ye) {

            if (xLTy = a < 0) {
              a = -a;
              t = xc;
            } else {
              ye = xe;
              t = yc;
            }

            t.reverse();

            // Prepend zeros to equalise exponents.
            for (b = a; b--; t.push(0));
            t.reverse();
          } else {

            // Exponents equal. Check digit by digit.
            j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

            for (a = b = 0; b < j; b++) {

              if (xc[b] != yc[b]) {
                xLTy = xc[b] < yc[b];
                break;
              }
            }
          }

          // x < y? Point xc to the array of the bigger number.
          if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

          b = (j = yc.length) - (i = xc.length);

          // Append zeros to xc if shorter.
          // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
          if (b > 0) for (; b--; xc[i++] = 0);
          b = BASE - 1;

          // Subtract yc from xc.
          for (; j > a;) {

            if (xc[--j] < yc[j]) {
              for (i = j; i && !xc[--i]; xc[i] = b);
              --xc[i];
              xc[j] += BASE;
            }

            xc[j] -= yc[j];
          }

          // Remove leading zeros and adjust exponent accordingly.
          for (; xc[0] == 0; xc.splice(0, 1), --ye);

          // Zero?
          if (!xc[0]) {

            // Following IEEE 754 (2008) 6.3,
            // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
            y.s = ROUNDING_MODE == 3 ? -1 : 1;
            y.c = [y.e = 0];
            return y;
          }

          // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
          // for finite x and y.
          return normalise(y, xc, ye);
        };


        /*
         *   n % 0 =  N
         *   n % N =  N
         *   n % I =  n
         *   0 % n =  0
         *  -0 % n = -0
         *   0 % 0 =  N
         *   0 % N =  N
         *   0 % I =  0
         *   N % n =  N
         *   N % 0 =  N
         *   N % N =  N
         *   N % I =  N
         *   I % n =  N
         *   I % 0 =  N
         *   I % N =  N
         *   I % I =  N
         *
         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
         */
        P.modulo = P.mod = function (y, b) {
          var q, s,
            x = this;

          y = new BigNumber(y, b);

          // Return NaN if x is Infinity or NaN, or y is NaN or zero.
          if (!x.c || !y.s || y.c && !y.c[0]) {
            return new BigNumber(NaN);

          // Return x if y is Infinity or x is zero.
          } else if (!y.c || x.c && !x.c[0]) {
            return new BigNumber(x);
          }

          if (MODULO_MODE == 9) {

            // Euclidian division: q = sign(y) * floor(x / abs(y))
            // r = x - qy    where  0 <= r < abs(y)
            s = y.s;
            y.s = 1;
            q = div(x, y, 0, 3);
            y.s = s;
            q.s *= s;
          } else {
            q = div(x, y, 0, MODULO_MODE);
          }

          y = x.minus(q.times(y));

          // To match JavaScript %, ensure sign of zero is sign of dividend.
          if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

          return y;
        };


        /*
         *  n * 0 = 0
         *  n * N = N
         *  n * I = I
         *  0 * n = 0
         *  0 * 0 = 0
         *  0 * N = N
         *  0 * I = N
         *  N * n = N
         *  N * 0 = N
         *  N * N = N
         *  N * I = N
         *  I * n = I
         *  I * 0 = N
         *  I * N = N
         *  I * I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
         * of BigNumber(y, b).
         */
        P.multipliedBy = P.times = function (y, b) {
          var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
            base, sqrtBase,
            x = this,
            xc = x.c,
            yc = (y = new BigNumber(y, b)).c;

          // Either NaN, ±Infinity or ±0?
          if (!xc || !yc || !xc[0] || !yc[0]) {

            // Return NaN if either is NaN, or one is 0 and the other is Infinity.
            if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
              y.c = y.e = y.s = null;
            } else {
              y.s *= x.s;

              // Return ±Infinity if either is ±Infinity.
              if (!xc || !yc) {
                y.c = y.e = null;

              // Return ±0 if either is ±0.
              } else {
                y.c = [0];
                y.e = 0;
              }
            }

            return y;
          }

          e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
          y.s *= x.s;
          xcL = xc.length;
          ycL = yc.length;

          // Ensure xc points to longer array and xcL to its length.
          if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

          // Initialise the result array with zeros.
          for (i = xcL + ycL, zc = []; i--; zc.push(0));

          base = BASE;
          sqrtBase = SQRT_BASE;

          for (i = ycL; --i >= 0;) {
            c = 0;
            ylo = yc[i] % sqrtBase;
            yhi = yc[i] / sqrtBase | 0;

            for (k = xcL, j = i + k; j > i;) {
              xlo = xc[--k] % sqrtBase;
              xhi = xc[k] / sqrtBase | 0;
              m = yhi * xlo + xhi * ylo;
              xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
              c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
              zc[j--] = xlo % base;
            }

            zc[j] = c;
          }

          if (c) {
            ++e;
          } else {
            zc.splice(0, 1);
          }

          return normalise(y, zc, e);
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber negated,
         * i.e. multiplied by -1.
         */
        P.negated = function () {
          var x = new BigNumber(this);
          x.s = -x.s || null;
          return x;
        };


        /*
         *  n + 0 = n
         *  n + N = N
         *  n + I = I
         *  0 + n = n
         *  0 + 0 = 0
         *  0 + N = N
         *  0 + I = I
         *  N + n = N
         *  N + 0 = N
         *  N + N = N
         *  N + I = N
         *  I + n = I
         *  I + 0 = I
         *  I + N = N
         *  I + I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
         * BigNumber(y, b).
         */
        P.plus = function (y, b) {
          var t,
            x = this,
            a = x.s;

          y = new BigNumber(y, b);
          b = y.s;

          // Either NaN?
          if (!a || !b) return new BigNumber(NaN);

          // Signs differ?
           if (a != b) {
            y.s = -b;
            return x.minus(y);
          }

          var xe = x.e / LOG_BASE,
            ye = y.e / LOG_BASE,
            xc = x.c,
            yc = y.c;

          if (!xe || !ye) {

            // Return ±Infinity if either ±Infinity.
            if (!xc || !yc) return new BigNumber(a / 0);

            // Either zero?
            // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
            if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
          }

          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice();

          // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
          if (a = xe - ye) {
            if (a > 0) {
              ye = xe;
              t = yc;
            } else {
              a = -a;
              t = xc;
            }

            t.reverse();
            for (; a--; t.push(0));
            t.reverse();
          }

          a = xc.length;
          b = yc.length;

          // Point xc to the longer array, and b to the shorter length.
          if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

          // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
          for (a = 0; b;) {
            a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
            xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
          }

          if (a) {
            xc = [a].concat(xc);
            ++ye;
          }

          // No need to check for zero, as +x + +y != 0 && -x + -y != 0
          // ye = MAX_EXP + 1 possible
          return normalise(y, xc, ye);
        };


        /*
         * If sd is undefined or null or true or false, return the number of significant digits of
         * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
         * If sd is true include integer-part trailing zeros in the count.
         *
         * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
         * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
         * ROUNDING_MODE if rm is omitted.
         *
         * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
         *                     boolean: whether to count integer-part trailing zeros: true or false.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
         */
        P.precision = P.sd = function (sd, rm) {
          var c, n, v,
            x = this;

          if (sd != null && sd !== !!sd) {
            intCheck(sd, 1, MAX);
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);

            return round(new BigNumber(x), sd, rm);
          }

          if (!(c = x.c)) return null;
          v = c.length - 1;
          n = v * LOG_BASE + 1;

          if (v = c[v]) {

            // Subtract the number of trailing zeros of the last element.
            for (; v % 10 == 0; v /= 10, n--);

            // Add the number of digits of the first element.
            for (v = c[0]; v >= 10; v /= 10, n++);
          }

          if (sd && x.e + 1 > n) n = x.e + 1;

          return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
         *
         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
         */
        P.shiftedBy = function (k) {
          intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
          return this.times('1e' + k);
        };


        /*
         *  sqrt(-n) =  N
         *  sqrt(N) =  N
         *  sqrt(-I) =  N
         *  sqrt(I) =  I
         *  sqrt(0) =  0
         *  sqrt(-0) = -0
         *
         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.squareRoot = P.sqrt = function () {
          var m, n, r, rep, t,
            x = this,
            c = x.c,
            s = x.s,
            e = x.e,
            dp = DECIMAL_PLACES + 4,
            half = new BigNumber('0.5');

          // Negative/NaN/Infinity/zero?
          if (s !== 1 || !c || !c[0]) {
            return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
          }

          // Initial estimate.
          s = Math.sqrt(+valueOf(x));

          // Math.sqrt underflow/overflow?
          // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
          if (s == 0 || s == 1 / 0) {
            n = coeffToString(c);
            if ((n.length + e) % 2 == 0) n += '0';
            s = Math.sqrt(+n);
            e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

            if (s == 1 / 0) {
              n = '5e' + e;
            } else {
              n = s.toExponential();
              n = n.slice(0, n.indexOf('e') + 1) + e;
            }

            r = new BigNumber(n);
          } else {
            r = new BigNumber(s + '');
          }

          // Check for zero.
          // r could be zero if MIN_EXP is changed after the this value was created.
          // This would cause a division by zero (x/t) and hence Infinity below, which would cause
          // coeffToString to throw.
          if (r.c[0]) {
            e = r.e;
            s = e + dp;
            if (s < 3) s = 0;

            // Newton-Raphson iteration.
            for (; ;) {
              t = r;
              r = half.times(t.plus(div(x, t, dp, 1)));

              if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

                // The exponent of r may here be one less than the final result exponent,
                // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                // are indexed correctly.
                if (r.e < e) --s;
                n = n.slice(s - 3, s + 1);

                // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                // iteration.
                if (n == '9999' || !rep && n == '4999') {

                  // On the first iteration only, check to see if rounding up gives the
                  // exact result as the nines may infinitely repeat.
                  if (!rep) {
                    round(t, t.e + DECIMAL_PLACES + 2, 0);

                    if (t.times(t).eq(x)) {
                      r = t;
                      break;
                    }
                  }

                  dp += 4;
                  s += 4;
                  rep = 1;
                } else {

                  // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                  // result. If not, then there are further digits and m will be truthy.
                  if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                    // Truncate to the first rounding digit.
                    round(r, r.e + DECIMAL_PLACES + 2, 1);
                    m = !r.times(r).eq(x);
                  }

                  break;
                }
              }
            }
          }

          return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
        };


        /*
         * Return a string representing the value of this BigNumber in exponential notation and
         * rounded using ROUNDING_MODE to dp fixed decimal places.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */
        P.toExponential = function (dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp++;
          }
          return format(this, dp, rm, 1);
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounding
         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
         * but e.g. (-0.00001).toFixed(0) is '-0'.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */
        P.toFixed = function (dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp = dp + this.e + 1;
          }
          return format(this, dp, rm);
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounded
         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
         * of the format or FORMAT object (see BigNumber.set).
         *
         * The formatting object may contain some or all of the properties shown below.
         *
         * FORMAT = {
         *   prefix: '',
         *   groupSize: 3,
         *   secondaryGroupSize: 0,
         *   groupSeparator: ',',
         *   decimalSeparator: '.',
         *   fractionGroupSize: 0,
         *   fractionGroupSeparator: '\xA0',      // non-breaking space
         *   suffix: ''
         * };
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         * [format] {object} Formatting options. See FORMAT pbject above.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         * '[BigNumber Error] Argument not an object: {format}'
         */
        P.toFormat = function (dp, rm, format) {
          var str,
            x = this;

          if (format == null) {
            if (dp != null && rm && typeof rm == 'object') {
              format = rm;
              rm = null;
            } else if (dp && typeof dp == 'object') {
              format = dp;
              dp = rm = null;
            } else {
              format = FORMAT;
            }
          } else if (typeof format != 'object') {
            throw Error
              (bignumberError + 'Argument not an object: ' + format);
          }

          str = x.toFixed(dp, rm);

          if (x.c) {
            var i,
              arr = str.split('.'),
              g1 = +format.groupSize,
              g2 = +format.secondaryGroupSize,
              groupSeparator = format.groupSeparator || '',
              intPart = arr[0],
              fractionPart = arr[1],
              isNeg = x.s < 0,
              intDigits = isNeg ? intPart.slice(1) : intPart,
              len = intDigits.length;

            if (g2) i = g1, g1 = g2, g2 = i, len -= i;

            if (g1 > 0 && len > 0) {
              i = len % g1 || g1;
              intPart = intDigits.substr(0, i);
              for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
              if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
              if (isNeg) intPart = '-' + intPart;
            }

            str = fractionPart
             ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
              ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
               '$&' + (format.fractionGroupSeparator || ''))
              : fractionPart)
             : intPart;
          }

          return (format.prefix || '') + str + (format.suffix || '');
        };


        /*
         * Return an array of two BigNumbers representing the value of this BigNumber as a simple
         * fraction with an integer numerator and an integer denominator.
         * The denominator will be a positive non-zero value less than or equal to the specified
         * maximum denominator. If a maximum denominator is not specified, the denominator will be
         * the lowest value necessary to represent the number exactly.
         *
         * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
         *
         * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
         */
        P.toFraction = function (md) {
          var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
            x = this,
            xc = x.c;

          if (md != null) {
            n = new BigNumber(md);

            // Throw if md is less than one or is not an integer, unless it is Infinity.
            if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
              throw Error
                (bignumberError + 'Argument ' +
                  (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
            }
          }

          if (!xc) return new BigNumber(x);

          d = new BigNumber(ONE);
          n1 = d0 = new BigNumber(ONE);
          d1 = n0 = new BigNumber(ONE);
          s = coeffToString(xc);

          // Determine initial denominator.
          // d is a power of 10 and the minimum max denominator that specifies the value exactly.
          e = d.e = s.length - x.e - 1;
          d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
          md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

          exp = MAX_EXP;
          MAX_EXP = 1 / 0;
          n = new BigNumber(s);

          // n0 = d1 = 0
          n0.c[0] = 0;

          for (; ;)  {
            q = div(n, d, 0, 1);
            d2 = d0.plus(q.times(d1));
            if (d2.comparedTo(md) == 1) break;
            d0 = d1;
            d1 = d2;
            n1 = n0.plus(q.times(d2 = n1));
            n0 = d2;
            d = n.minus(q.times(d2 = d));
            n = d2;
          }

          d2 = div(md.minus(d0), d1, 0, 1);
          n0 = n0.plus(d2.times(n1));
          d0 = d0.plus(d2.times(d1));
          n0.s = n1.s = x.s;
          e = e * 2;

          // Determine which fraction is closer to x, n0/d0 or n1/d1
          r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
              div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

          MAX_EXP = exp;

          return r;
        };


        /*
         * Return the value of this BigNumber converted to a number primitive.
         */
        P.toNumber = function () {
          return +valueOf(this);
        };


        /*
         * Return a string representing the value of this BigNumber rounded to sd significant digits
         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
         * necessary to represent the integer part of the value in fixed-point notation, then use
         * exponential notation.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
         */
        P.toPrecision = function (sd, rm) {
          if (sd != null) intCheck(sd, 1, MAX);
          return format(this, sd, rm, 2);
        };


        /*
         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
         * TO_EXP_NEG, return exponential notation.
         *
         * [b] {number} Integer, 2 to ALPHABET.length inclusive.
         *
         * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
         */
        P.toString = function (b) {
          var str,
            n = this,
            s = n.s,
            e = n.e;

          // Infinity or NaN?
          if (e === null) {
            if (s) {
              str = 'Infinity';
              if (s < 0) str = '-' + str;
            } else {
              str = 'NaN';
            }
          } else {
            if (b == null) {
              str = e <= TO_EXP_NEG || e >= TO_EXP_POS
               ? toExponential(coeffToString(n.c), e)
               : toFixedPoint(coeffToString(n.c), e, '0');
            } else if (b === 10 && alphabetHasNormalDecimalDigits) {
              n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
              str = toFixedPoint(coeffToString(n.c), n.e, '0');
            } else {
              intCheck(b, 2, ALPHABET.length, 'Base');
              str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
            }

            if (s < 0 && n.c[0]) str = '-' + str;
          }

          return str;
        };


        /*
         * Return as toString, but do not accept a base argument, and include the minus sign for
         * negative zero.
         */
        P.valueOf = P.toJSON = function () {
          return valueOf(this);
        };


        P._isBigNumber = true;

        if (configObject != null) BigNumber.set(configObject);

        return BigNumber;
      }


      // PRIVATE HELPER FUNCTIONS

      // These functions don't need access to variables,
      // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


      function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
      }


      // Return a coefficient array as a string of base 10 digits.
      function coeffToString(a) {
        var s, z,
          i = 1,
          j = a.length,
          r = a[0] + '';

        for (; i < j;) {
          s = a[i++] + '';
          z = LOG_BASE - s.length;
          for (; z--; s = '0' + s);
          r += s;
        }

        // Determine trailing zeros.
        for (j = r.length; r.charCodeAt(--j) === 48;);

        return r.slice(0, j + 1 || 1);
      }


      // Compare the value of BigNumbers x and y.
      function compare(x, y) {
        var a, b,
          xc = x.c,
          yc = y.c,
          i = x.s,
          j = y.s,
          k = x.e,
          l = y.e;

        // Either NaN?
        if (!i || !j) return null;

        a = xc && !xc[0];
        b = yc && !yc[0];

        // Either zero?
        if (a || b) return a ? b ? 0 : -j : i;

        // Signs differ?
        if (i != j) return i;

        a = i < 0;
        b = k == l;

        // Either Infinity?
        if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

        // Compare exponents.
        if (!b) return k > l ^ a ? 1 : -1;

        j = (k = xc.length) < (l = yc.length) ? k : l;

        // Compare digit by digit.
        for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
      }


      /*
       * Check that n is a primitive number, an integer, and in range, otherwise throw.
       */
      function intCheck(n, min, max, name) {
        if (n < min || n > max || n !== mathfloor(n)) {
          throw Error
           (bignumberError + (name || 'Argument') + (typeof n == 'number'
             ? n < min || n > max ? ' out of range: ' : ' not an integer: '
             : ' not a primitive number: ') + String(n));
        }
      }


      // Assumes finite n.
      function isOdd(n) {
        var k = n.c.length - 1;
        return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
      }


      function toExponential(str, e) {
        return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
         (e < 0 ? 'e' : 'e+') + e;
      }


      function toFixedPoint(str, e, z) {
        var len, zs;

        // Negative exponent?
        if (e < 0) {

          // Prepend zeros.
          for (zs = z + '.'; ++e; zs += z);
          str = zs + str;

        // Positive exponent
        } else {
          len = str.length;

          // Append zeros.
          if (++e > len) {
            for (zs = z, e -= len; --e; zs += z);
            str += zs;
          } else if (e < len) {
            str = str.slice(0, e) + '.' + str.slice(e);
          }
        }

        return str;
      }


      // EXPORT


      BigNumber = clone();
      BigNumber['default'] = BigNumber.BigNumber = BigNumber;

      // AMD.
      if (module.exports) {
        module.exports = BigNumber;

      // Browser.
      } else {
        if (!globalObject) {
          globalObject = typeof self != 'undefined' && self ? self : window;
        }

        globalObject.BigNumber = BigNumber;
      }
    })(commonjsGlobal);
    });

    /* src/routes/profileid.svelte generated by Svelte v3.46.6 */

    const { console: console_1 } = globals;
    const file = "src/routes/profileid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (245:0) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let p0;
    	let t1;
    	let t2_value = reun(/*profiledata*/ ctx[1].last_save) + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4;
    	let t5_value = /*toformated*/ ctx[7](reun(/*profiledata*/ ctx[1].bank_balance)) + "";
    	let t5;
    	let t6;
    	let p2;
    	let t7;
    	let t8_value = /*toformated*/ ctx[7](reun(/*profiledata*/ ctx[1].coin_purse)) + "";
    	let t8;
    	let t9;
    	let p3;
    	let t10;
    	let t11_value = reun(/*profiledata*/ ctx[1].fairy_souls) + "";
    	let t11;
    	let t12;
    	let br;
    	let t13;
    	let current_block_type_index;
    	let if_block0;
    	let t14;
    	let current_block_type_index_1;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*skills*/ ctx[4].experience_skill_taming !== undefined) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_1, create_else_block_1];
    	const if_blocks_1 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*coll*/ ctx[6] !== undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_2(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			p0 = element("p");
    			t1 = text("last save: ");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text("bank balance: ");
    			t5 = text(t5_value);
    			t6 = space();
    			p2 = element("p");
    			t7 = text("coin purse: ");
    			t8 = text(t8_value);
    			t9 = space();
    			p3 = element("p");
    			t10 = text("fairy souls: ");
    			t11 = text(t11_value);
    			t12 = space();
    			br = element("br");
    			t13 = space();
    			if_block0.c();
    			t14 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			if (!src_url_equal(img.src, img_src_value = "https://crafatar.com/renders/body/" + /*proDout*/ ctx[0].uuid + "?overlay")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "imageofuuid svelte-14u11zx");
    			add_location(img, file, 245, 0, 18204);
    			attr_dev(p0, "class", "subsubtext");
    			add_location(p0, file, 247, 0, 18325);
    			attr_dev(p1, "class", "subsubtext");
    			add_location(p1, file, 248, 0, 18392);
    			attr_dev(p2, "class", "subsubtext");
    			add_location(p2, file, 249, 0, 18477);
    			attr_dev(p3, "class", "subsubtext");
    			add_location(p3, file, 250, 0, 18558);
    			attr_dev(div, "class", "floatright");
    			add_location(div, file, 246, 0, 18300);
    			add_location(br, file, 252, 0, 18636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(div, t6);
    			append_dev(div, p2);
    			append_dev(p2, t7);
    			append_dev(p2, t8);
    			append_dev(div, t9);
    			append_dev(div, p3);
    			append_dev(p3, t10);
    			append_dev(p3, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t13, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t14, anchor);
    			if_blocks_1[current_block_type_index_1].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*proDout*/ 1 && !src_url_equal(img.src, img_src_value = "https://crafatar.com/renders/body/" + /*proDout*/ ctx[0].uuid + "?overlay")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*profiledata*/ 2) && t2_value !== (t2_value = reun(/*profiledata*/ ctx[1].last_save) + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t5_value !== (t5_value = /*toformated*/ ctx[7](reun(/*profiledata*/ ctx[1].bank_balance)) + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t8_value !== (t8_value = /*toformated*/ ctx[7](reun(/*profiledata*/ ctx[1].coin_purse)) + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t11_value !== (t11_value = reun(/*profiledata*/ ctx[1].fairy_souls) + "")) set_data_dev(t11, t11_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(t14.parentNode, t14);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_2(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t13);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t14);
    			if_blocks_1[current_block_type_index_1].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(245:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (243:0) {#if proDout.loading == true}
    function create_if_block(ctx) {
    	let thinking;
    	let current;
    	thinking = new Thinking({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(thinking.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(thinking, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thinking.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thinking.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thinking, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(243:0) {#if proDout.loading == true}",
    		ctx
    	});

    	return block;
    }

    // (269:0) {:else}
    function create_else_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Not enabled your skills api";
    			attr_dev(p, "class", "subsubtext");
    			add_location(p, file, 269, 0, 20087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(269:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (255:0) {#if skills.experience_skill_taming !== undefined}
    function create_if_block_2(ctx) {
    	let div;
    	let span;
    	let t1;
    	let progressbar0;
    	let t2;
    	let progressbar1;
    	let t3;
    	let progressbar2;
    	let t4;
    	let progressbar3;
    	let t5;
    	let progressbar4;
    	let t6;
    	let progressbar5;
    	let t7;
    	let progressbar6;
    	let t8;
    	let progressbar7;
    	let t9;
    	let progressbar8;
    	let t10;
    	let progressbar9;
    	let current;

    	progressbar0 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_taming,
    				text: "Taming",
    				Image: "/resource/minecraft/textures/items/spawn_egg_overlay.png"
    			},
    			$$inline: true
    		});

    	progressbar1 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_mining,
    				text: "Mining",
    				Image: "/resource/minecraft/textures/items/stone_pickaxe.png"
    			},
    			$$inline: true
    		});

    	progressbar2 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_foraging,
    				text: "Foraging",
    				Image: "/resource/minecraft/textures/blocks/sapling_jungle.png"
    			},
    			$$inline: true
    		});

    	progressbar3 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_enchanting,
    				text: "Enchanting",
    				Image: "/resource/minecraft/textures/blocks/enchanting_table_top.png"
    			},
    			$$inline: true
    		});

    	progressbar4 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_carpentry,
    				text: "Carpentry",
    				Image: "/resource/minecraft/textures/blocks/crafting_table_top.png"
    			},
    			$$inline: true
    		});

    	progressbar5 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_farming,
    				text: "Farming",
    				Image: "/resource/minecraft/textures/items/gold_hoe.png"
    			},
    			$$inline: true
    		});

    	progressbar6 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_combat,
    				text: "Combat",
    				Image: "/resource/minecraft/textures/items/stone_sword.png"
    			},
    			$$inline: true
    		});

    	progressbar7 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_fishing,
    				text: "Fishing",
    				Image: "/resource/minecraft/textures/items/fishing_rod_uncast.png"
    			},
    			$$inline: true
    		});

    	progressbar8 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_alchemy,
    				text: "Alchemy",
    				Image: "/resource/minecraft/textures/items/brewing_stand.png"
    			},
    			$$inline: true
    		});

    	progressbar9 = new ProgressBar({
    			props: {
    				xp: /*skills*/ ctx[4].experience_skill_runecrafting,
    				text: "Runecrafting",
    				Image: "/resource/minecraft/textures/items/magma_cream.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Skills";
    			t1 = space();
    			create_component(progressbar0.$$.fragment);
    			t2 = space();
    			create_component(progressbar1.$$.fragment);
    			t3 = space();
    			create_component(progressbar2.$$.fragment);
    			t4 = space();
    			create_component(progressbar3.$$.fragment);
    			t5 = space();
    			create_component(progressbar4.$$.fragment);
    			t6 = space();
    			create_component(progressbar5.$$.fragment);
    			t7 = space();
    			create_component(progressbar6.$$.fragment);
    			t8 = space();
    			create_component(progressbar7.$$.fragment);
    			t9 = space();
    			create_component(progressbar8.$$.fragment);
    			t10 = space();
    			create_component(progressbar9.$$.fragment);
    			attr_dev(span, "class", "subheader subtext");
    			add_location(span, file, 256, 0, 18714);
    			attr_dev(div, "class", "skills svelte-14u11zx");
    			add_location(div, file, 255, 0, 18693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			mount_component(progressbar0, div, null);
    			append_dev(div, t2);
    			mount_component(progressbar1, div, null);
    			append_dev(div, t3);
    			mount_component(progressbar2, div, null);
    			append_dev(div, t4);
    			mount_component(progressbar3, div, null);
    			append_dev(div, t5);
    			mount_component(progressbar4, div, null);
    			append_dev(div, t6);
    			mount_component(progressbar5, div, null);
    			append_dev(div, t7);
    			mount_component(progressbar6, div, null);
    			append_dev(div, t8);
    			mount_component(progressbar7, div, null);
    			append_dev(div, t9);
    			mount_component(progressbar8, div, null);
    			append_dev(div, t10);
    			mount_component(progressbar9, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar0_changes = {};
    			if (dirty & /*skills*/ 16) progressbar0_changes.xp = /*skills*/ ctx[4].experience_skill_taming;
    			progressbar0.$set(progressbar0_changes);
    			const progressbar1_changes = {};
    			if (dirty & /*skills*/ 16) progressbar1_changes.xp = /*skills*/ ctx[4].experience_skill_mining;
    			progressbar1.$set(progressbar1_changes);
    			const progressbar2_changes = {};
    			if (dirty & /*skills*/ 16) progressbar2_changes.xp = /*skills*/ ctx[4].experience_skill_foraging;
    			progressbar2.$set(progressbar2_changes);
    			const progressbar3_changes = {};
    			if (dirty & /*skills*/ 16) progressbar3_changes.xp = /*skills*/ ctx[4].experience_skill_enchanting;
    			progressbar3.$set(progressbar3_changes);
    			const progressbar4_changes = {};
    			if (dirty & /*skills*/ 16) progressbar4_changes.xp = /*skills*/ ctx[4].experience_skill_carpentry;
    			progressbar4.$set(progressbar4_changes);
    			const progressbar5_changes = {};
    			if (dirty & /*skills*/ 16) progressbar5_changes.xp = /*skills*/ ctx[4].experience_skill_farming;
    			progressbar5.$set(progressbar5_changes);
    			const progressbar6_changes = {};
    			if (dirty & /*skills*/ 16) progressbar6_changes.xp = /*skills*/ ctx[4].experience_skill_combat;
    			progressbar6.$set(progressbar6_changes);
    			const progressbar7_changes = {};
    			if (dirty & /*skills*/ 16) progressbar7_changes.xp = /*skills*/ ctx[4].experience_skill_fishing;
    			progressbar7.$set(progressbar7_changes);
    			const progressbar8_changes = {};
    			if (dirty & /*skills*/ 16) progressbar8_changes.xp = /*skills*/ ctx[4].experience_skill_alchemy;
    			progressbar8.$set(progressbar8_changes);
    			const progressbar9_changes = {};
    			if (dirty & /*skills*/ 16) progressbar9_changes.xp = /*skills*/ ctx[4].experience_skill_runecrafting;
    			progressbar9.$set(progressbar9_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar0.$$.fragment, local);
    			transition_in(progressbar1.$$.fragment, local);
    			transition_in(progressbar2.$$.fragment, local);
    			transition_in(progressbar3.$$.fragment, local);
    			transition_in(progressbar4.$$.fragment, local);
    			transition_in(progressbar5.$$.fragment, local);
    			transition_in(progressbar6.$$.fragment, local);
    			transition_in(progressbar7.$$.fragment, local);
    			transition_in(progressbar8.$$.fragment, local);
    			transition_in(progressbar9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar0.$$.fragment, local);
    			transition_out(progressbar1.$$.fragment, local);
    			transition_out(progressbar2.$$.fragment, local);
    			transition_out(progressbar3.$$.fragment, local);
    			transition_out(progressbar4.$$.fragment, local);
    			transition_out(progressbar5.$$.fragment, local);
    			transition_out(progressbar6.$$.fragment, local);
    			transition_out(progressbar7.$$.fragment, local);
    			transition_out(progressbar8.$$.fragment, local);
    			transition_out(progressbar9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar0);
    			destroy_component(progressbar1);
    			destroy_component(progressbar2);
    			destroy_component(progressbar3);
    			destroy_component(progressbar4);
    			destroy_component(progressbar5);
    			destroy_component(progressbar6);
    			destroy_component(progressbar7);
    			destroy_component(progressbar8);
    			destroy_component(progressbar9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(255:0) {#if skills.experience_skill_taming !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (335:0) {:else}
    function create_else_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Not enabled your skills api";
    			attr_dev(p, "class", "subsubsubtext");
    			add_location(p, file, 335, 0, 23512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(335:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (272:0) {#if coll !== undefined}
    function create_if_block_1(ctx) {
    	let div10;
    	let span0;
    	let t1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let t6;
    	let div3;
    	let t7;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let t9;
    	let div5;
    	let t10;
    	let div6;
    	let img3;
    	let img3_src_value;
    	let t11;
    	let t12;
    	let div7;
    	let t13;
    	let div8;
    	let img4;
    	let img4_src_value;
    	let t14;
    	let t15;
    	let div9;
    	let t16;
    	let p0;
    	let t18;
    	let span1;
    	let t20;
    	let p1;
    	let t21;
    	let t22_value = reun(/*profiledata*/ ctx[1].death_count) + "";
    	let t22;
    	let t23;
    	let p2;
    	let t24;
    	let t25_value = reun(/*profiledata*/ ctx[1].total_kills) + "";
    	let t25;
    	let t26;
    	let br;
    	let t27;
    	let span2;
    	let t29;
    	let p3;
    	let img5;
    	let img5_src_value;
    	let t30;
    	let t31_value = reun(/*profiledata*/ ctx[1].item_fished) + "";
    	let t31;
    	let t32;
    	let p4;
    	let img6;
    	let img6_src_value;
    	let t33;
    	let t34_value = reun(/*profiledata*/ ctx[1].critical_damage) + "";
    	let t34;
    	let t35;
    	let span3;
    	let img7;
    	let img7_src_value;
    	let t36;
    	let t37;
    	let p5;
    	let t38;
    	let t39_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_spend)) + "";
    	let t39;
    	let t40;
    	let p6;
    	let t41;
    	let t42_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_earned)) + "";
    	let t42;
    	let t43;
    	let p7;
    	let t44;
    	let t45_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_fees)) + "";
    	let t45;
    	let t46;
    	let p8;
    	let t47;
    	let t48_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_bidded)) + "";
    	let t48;
    	let t49;
    	let p9;
    	let t50;
    	let t51_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_won)) + "";
    	let t51;
    	let t52;
    	let span4;
    	let img8;
    	let img8_src_value;
    	let t53;
    	let t54;
    	let p10;
    	let t55;
    	let t56_value = reun(/*giftdata*/ ctx[3].gift_given) + "";
    	let t56;
    	let t57;
    	let p11;
    	let t58;
    	let t59_value = reun(/*giftdata*/ ctx[3].gift_received) + "";
    	let t59;
    	let current;
    	let each_value_4 = /*collection*/ ctx[5].farming;
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks_4[i], 1, 1, () => {
    		each_blocks_4[i] = null;
    	});

    	let each_value_3 = /*collection*/ ctx[5].mining;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out_1 = i => transition_out(each_blocks_3[i], 1, 1, () => {
    		each_blocks_3[i] = null;
    	});

    	let each_value_2 = /*collection*/ ctx[5].combat;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out_2 = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*collection*/ ctx[5].foraging;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_3 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*collection*/ ctx[5].fishing;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_4 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			span0 = element("span");
    			span0.textContent = "Collection";
    			t1 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t2 = text("Farming:");
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t5 = text("Mining:");
    			t6 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t7 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t8 = text("Combat:");
    			t9 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t10 = space();
    			div6 = element("div");
    			img3 = element("img");
    			t11 = text("FORAGING:");
    			t12 = space();
    			div7 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();
    			div8 = element("div");
    			img4 = element("img");
    			t14 = text("FISHING:");
    			t15 = space();
    			div9 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			p0 = element("p");
    			p0.textContent = "*Note: only count one members in a co-op only";
    			t18 = space();
    			span1 = element("span");
    			span1.textContent = "Top kills & deaths";
    			t20 = space();
    			p1 = element("p");
    			t21 = text("Total Deaths ");
    			t22 = text(t22_value);
    			t23 = space();
    			p2 = element("p");
    			t24 = text("Total Kills ");
    			t25 = text(t25_value);
    			t26 = space();
    			br = element("br");
    			t27 = space();
    			span2 = element("span");
    			span2.textContent = "Miscellaneous";
    			t29 = space();
    			p3 = element("p");
    			img5 = element("img");
    			t30 = text("Items fished: ");
    			t31 = text(t31_value);
    			t32 = space();
    			p4 = element("p");
    			img6 = element("img");
    			t33 = text("  Highest Critical damage ");
    			t34 = text(t34_value);
    			t35 = space();
    			span3 = element("span");
    			img7 = element("img");
    			t36 = text("Auction House:");
    			t37 = space();
    			p5 = element("p");
    			t38 = text("Total spending: ");
    			t39 = text(t39_value);
    			t40 = space();
    			p6 = element("p");
    			t41 = text("Total earning: ");
    			t42 = text(t42_value);
    			t43 = space();
    			p7 = element("p");
    			t44 = text("Auction fees: ");
    			t45 = text(t45_value);
    			t46 = space();
    			p8 = element("p");
    			t47 = text("Bids: ");
    			t48 = text(t48_value);
    			t49 = space();
    			p9 = element("p");
    			t50 = text("Wons: ");
    			t51 = text(t51_value);
    			t52 = space();
    			span4 = element("span");
    			img8 = element("img");
    			t53 = text("Gift:");
    			t54 = space();
    			p10 = element("p");
    			t55 = text("Gift given: ");
    			t56 = text(t56_value);
    			t57 = space();
    			p11 = element("p");
    			t58 = text("Gift received: ");
    			t59 = text(t59_value);
    			attr_dev(span0, "class", "subheader subtext");
    			add_location(span0, file, 274, 0, 20225);
    			attr_dev(img0, "class", "normalimage");
    			if (!src_url_equal(img0.src, img0_src_value = "/resource/minecraft/textures/items/stone_hoe.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Farming logo");
    			add_location(img0, file, 276, 24, 20315);
    			attr_dev(div0, "class", "subsubtext");
    			add_location(div0, file, 276, 0, 20291);
    			attr_dev(div1, "class", "scrollable svelte-14u11zx");
    			add_location(div1, file, 277, 4, 20433);
    			attr_dev(img1, "class", "normalimage");
    			if (!src_url_equal(img1.src, img1_src_value = "/resource/minecraft/textures/items/stone_pickaxe.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Mining logo");
    			add_location(img1, file, 284, 24, 20682);
    			attr_dev(div2, "class", "subsubtext");
    			add_location(div2, file, 284, 0, 20658);
    			attr_dev(div3, "class", "scrollable svelte-14u11zx");
    			add_location(div3, file, 285, 4, 20802);
    			attr_dev(img2, "class", "normalimage");
    			if (!src_url_equal(img2.src, img2_src_value = "/resource/minecraft/textures/items/stone_sword.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Combat logo");
    			add_location(img2, file, 292, 24, 21050);
    			attr_dev(div4, "class", "subsubtext");
    			add_location(div4, file, 292, 0, 21026);
    			attr_dev(div5, "class", "scrollable svelte-14u11zx");
    			add_location(div5, file, 293, 4, 21168);
    			attr_dev(img3, "class", "normalimage");
    			if (!src_url_equal(img3.src, img3_src_value = "/resource/minecraft/textures/blocks/sapling_jungle.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Foraging logo");
    			add_location(img3, file, 299, 24, 21417);
    			attr_dev(div6, "class", "subsubtext");
    			add_location(div6, file, 299, 0, 21393);
    			attr_dev(div7, "class", "scrollable svelte-14u11zx");
    			add_location(div7, file, 300, 4, 21543);
    			attr_dev(img4, "class", "normalimage");
    			if (!src_url_equal(img4.src, img4_src_value = "/resource/minecraft/textures/items/fish_pufferfish_raw.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Fishing logo");
    			add_location(img4, file, 307, 24, 21794);
    			attr_dev(div8, "class", "subsubtext");
    			add_location(div8, file, 307, 0, 21770);
    			attr_dev(div9, "class", "scrollable svelte-14u11zx");
    			add_location(div9, file, 308, 4, 21922);
    			attr_dev(p0, "class", "smalltext");
    			add_location(p0, file, 315, 0, 22157);
    			attr_dev(span1, "class", "subheader subtext");
    			add_location(span1, file, 316, 0, 22228);
    			attr_dev(p1, "class", "smalltext");
    			add_location(p1, file, 317, 0, 22286);
    			attr_dev(p2, "class", "smalltext");
    			add_location(p2, file, 318, 0, 22356);
    			add_location(br, file, 319, 0, 22425);
    			attr_dev(span2, "class", "subheader subtext");
    			add_location(span2, file, 321, 0, 22431);
    			if (!src_url_equal(img5.src, img5_src_value = "/resource/minecraft/textures/items/fish_cod_raw.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "");
    			add_location(img5, file, 322, 21, 22505);
    			attr_dev(p3, "class", "smalltext");
    			add_location(p3, file, 322, 0, 22484);
    			if (!src_url_equal(img6.src, img6_src_value = "/resource/minecraft/textures/items/iron_sword.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "");
    			add_location(img6, file, 323, 21, 22646);
    			attr_dev(p4, "class", "smalltext");
    			add_location(p4, file, 323, 0, 22625);
    			if (!src_url_equal(img7.src, img7_src_value = "/resource/minecraft/textures/items/diamond.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "");
    			add_location(img7, file, 324, 25, 22805);
    			attr_dev(span3, "class", "subsubtext");
    			add_location(span3, file, 324, 0, 22780);
    			attr_dev(p5, "class", "smalltext");
    			add_location(p5, file, 325, 0, 22892);
    			attr_dev(p6, "class", "smalltext");
    			add_location(p6, file, 326, 0, 22970);
    			attr_dev(p7, "class", "smalltext");
    			add_location(p7, file, 327, 0, 23048);
    			attr_dev(p8, "class", "smalltext");
    			add_location(p8, file, 328, 0, 23123);
    			attr_dev(p9, "class", "smalltext");
    			add_location(p9, file, 329, 0, 23192);
    			attr_dev(div10, "class", "statscotent");
    			add_location(div10, file, 272, 0, 20172);
    			if (!src_url_equal(img8.src, img8_src_value = "/resource/minecraft/textures/items/diamond.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "");
    			add_location(img8, file, 331, 25, 23290);
    			attr_dev(span4, "class", "subsubtext");
    			add_location(span4, file, 331, 0, 23265);
    			attr_dev(p10, "class", "smalltext");
    			add_location(p10, file, 332, 0, 23368);
    			attr_dev(p11, "class", "smalltext");
    			add_location(p11, file, 333, 0, 23433);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, span0);
    			append_dev(div10, t1);
    			append_dev(div10, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t2);
    			append_dev(div10, t3);
    			append_dev(div10, div1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(div1, null);
    			}

    			append_dev(div10, t4);
    			append_dev(div10, div2);
    			append_dev(div2, img1);
    			append_dev(div2, t5);
    			append_dev(div10, t6);
    			append_dev(div10, div3);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div3, null);
    			}

    			append_dev(div10, t7);
    			append_dev(div10, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t8);
    			append_dev(div10, t9);
    			append_dev(div10, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append_dev(div10, t10);
    			append_dev(div10, div6);
    			append_dev(div6, img3);
    			append_dev(div6, t11);
    			append_dev(div10, t12);
    			append_dev(div10, div7);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div7, null);
    			}

    			append_dev(div10, t13);
    			append_dev(div10, div8);
    			append_dev(div8, img4);
    			append_dev(div8, t14);
    			append_dev(div10, t15);
    			append_dev(div10, div9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div9, null);
    			}

    			append_dev(div10, t16);
    			append_dev(div10, p0);
    			append_dev(div10, t18);
    			append_dev(div10, span1);
    			append_dev(div10, t20);
    			append_dev(div10, p1);
    			append_dev(p1, t21);
    			append_dev(p1, t22);
    			append_dev(div10, t23);
    			append_dev(div10, p2);
    			append_dev(p2, t24);
    			append_dev(p2, t25);
    			append_dev(div10, t26);
    			append_dev(div10, br);
    			append_dev(div10, t27);
    			append_dev(div10, span2);
    			append_dev(div10, t29);
    			append_dev(div10, p3);
    			append_dev(p3, img5);
    			append_dev(p3, t30);
    			append_dev(p3, t31);
    			append_dev(div10, t32);
    			append_dev(div10, p4);
    			append_dev(p4, img6);
    			append_dev(p4, t33);
    			append_dev(p4, t34);
    			append_dev(div10, t35);
    			append_dev(div10, span3);
    			append_dev(span3, img7);
    			append_dev(span3, t36);
    			append_dev(div10, t37);
    			append_dev(div10, p5);
    			append_dev(p5, t38);
    			append_dev(p5, t39);
    			append_dev(div10, t40);
    			append_dev(div10, p6);
    			append_dev(p6, t41);
    			append_dev(p6, t42);
    			append_dev(div10, t43);
    			append_dev(div10, p7);
    			append_dev(p7, t44);
    			append_dev(p7, t45);
    			append_dev(div10, t46);
    			append_dev(div10, p8);
    			append_dev(p8, t47);
    			append_dev(p8, t48);
    			append_dev(div10, t49);
    			append_dev(div10, p9);
    			append_dev(p9, t50);
    			append_dev(p9, t51);
    			insert_dev(target, t52, anchor);
    			insert_dev(target, span4, anchor);
    			append_dev(span4, img8);
    			append_dev(span4, t53);
    			insert_dev(target, t54, anchor);
    			insert_dev(target, p10, anchor);
    			append_dev(p10, t55);
    			append_dev(p10, t56);
    			insert_dev(target, t57, anchor);
    			insert_dev(target, p11, anchor);
    			append_dev(p11, t58);
    			append_dev(p11, t59);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*collection*/ 32) {
    				each_value_4 = /*collection*/ ctx[5].farming;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    						transition_in(each_blocks_4[i], 1);
    					} else {
    						each_blocks_4[i] = create_each_block_4(child_ctx);
    						each_blocks_4[i].c();
    						transition_in(each_blocks_4[i], 1);
    						each_blocks_4[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks_4.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*collection*/ 32) {
    				each_value_3 = /*collection*/ ctx[5].mining;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    						transition_in(each_blocks_3[i], 1);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						transition_in(each_blocks_3[i], 1);
    						each_blocks_3[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_3.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*collection*/ 32) {
    				each_value_2 = /*collection*/ ctx[5].combat;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*collection*/ 32) {
    				each_value_1 = /*collection*/ ctx[5].foraging;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div7, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_3(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*collection*/ 32) {
    				each_value = /*collection*/ ctx[5].fishing;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div9, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_4(i);
    				}

    				check_outros();
    			}

    			if ((!current || dirty & /*profiledata*/ 2) && t22_value !== (t22_value = reun(/*profiledata*/ ctx[1].death_count) + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t25_value !== (t25_value = reun(/*profiledata*/ ctx[1].total_kills) + "")) set_data_dev(t25, t25_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t31_value !== (t31_value = reun(/*profiledata*/ ctx[1].item_fished) + "")) set_data_dev(t31, t31_value);
    			if ((!current || dirty & /*profiledata*/ 2) && t34_value !== (t34_value = reun(/*profiledata*/ ctx[1].critical_damage) + "")) set_data_dev(t34, t34_value);
    			if ((!current || dirty & /*ah_data*/ 4) && t39_value !== (t39_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_spend)) + "")) set_data_dev(t39, t39_value);
    			if ((!current || dirty & /*ah_data*/ 4) && t42_value !== (t42_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_earned)) + "")) set_data_dev(t42, t42_value);
    			if ((!current || dirty & /*ah_data*/ 4) && t45_value !== (t45_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_fees)) + "")) set_data_dev(t45, t45_value);
    			if ((!current || dirty & /*ah_data*/ 4) && t48_value !== (t48_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_bidded)) + "")) set_data_dev(t48, t48_value);
    			if ((!current || dirty & /*ah_data*/ 4) && t51_value !== (t51_value = /*toformated*/ ctx[7](reun(/*ah_data*/ ctx[2].ah_won)) + "")) set_data_dev(t51, t51_value);
    			if ((!current || dirty & /*giftdata*/ 8) && t56_value !== (t56_value = reun(/*giftdata*/ ctx[3].gift_given) + "")) set_data_dev(t56, t56_value);
    			if ((!current || dirty & /*giftdata*/ 8) && t59_value !== (t59_value = reun(/*giftdata*/ ctx[3].gift_received) + "")) set_data_dev(t59, t59_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_4[i]);
    			}

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_4 = each_blocks_4.filter(Boolean);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				transition_out(each_blocks_4[i]);
    			}

    			each_blocks_3 = each_blocks_3.filter(Boolean);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t52);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t54);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t57);
    			if (detaching) detach_dev(p11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(272:0) {#if coll !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (279:0) {#each collection.farming as item}
    function create_each_block_4(ctx) {
    	let collectionui;
    	let current;

    	collectionui = new CollectionUI({
    			props: {
    				ITEMNAME: /*item*/ ctx[11].name,
    				string: /*item*/ ctx[11].string,
    				collectiontier: /*item*/ ctx[11].tier,
    				maxtier: /*item*/ ctx[11].maxtier,
    				imageurl: /*item*/ ctx[11].image
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collectionui.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collectionui, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const collectionui_changes = {};
    			if (dirty & /*collection*/ 32) collectionui_changes.ITEMNAME = /*item*/ ctx[11].name;
    			if (dirty & /*collection*/ 32) collectionui_changes.string = /*item*/ ctx[11].string;
    			if (dirty & /*collection*/ 32) collectionui_changes.collectiontier = /*item*/ ctx[11].tier;
    			if (dirty & /*collection*/ 32) collectionui_changes.maxtier = /*item*/ ctx[11].maxtier;
    			if (dirty & /*collection*/ 32) collectionui_changes.imageurl = /*item*/ ctx[11].image;
    			collectionui.$set(collectionui_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collectionui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collectionui, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(279:0) {#each collection.farming as item}",
    		ctx
    	});

    	return block;
    }

    // (287:0) {#each collection.mining as item}
    function create_each_block_3(ctx) {
    	let collectionui;
    	let current;

    	collectionui = new CollectionUI({
    			props: {
    				ITEMNAME: /*item*/ ctx[11].name,
    				string: /*item*/ ctx[11].string,
    				collectiontier: /*item*/ ctx[11].tier,
    				maxtier: /*item*/ ctx[11].maxtier,
    				imageurl: /*item*/ ctx[11].image
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collectionui.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collectionui, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const collectionui_changes = {};
    			if (dirty & /*collection*/ 32) collectionui_changes.ITEMNAME = /*item*/ ctx[11].name;
    			if (dirty & /*collection*/ 32) collectionui_changes.string = /*item*/ ctx[11].string;
    			if (dirty & /*collection*/ 32) collectionui_changes.collectiontier = /*item*/ ctx[11].tier;
    			if (dirty & /*collection*/ 32) collectionui_changes.maxtier = /*item*/ ctx[11].maxtier;
    			if (dirty & /*collection*/ 32) collectionui_changes.imageurl = /*item*/ ctx[11].image;
    			collectionui.$set(collectionui_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collectionui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collectionui, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(287:0) {#each collection.mining as item}",
    		ctx
    	});

    	return block;
    }

    // (295:0) {#each collection.combat as item}
    function create_each_block_2(ctx) {
    	let collectionui;
    	let current;

    	collectionui = new CollectionUI({
    			props: {
    				ITEMNAME: /*item*/ ctx[11].name,
    				string: /*item*/ ctx[11].string,
    				collectiontier: /*item*/ ctx[11].tier,
    				maxtier: /*item*/ ctx[11].maxtier,
    				imageurl: /*item*/ ctx[11].image
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collectionui.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collectionui, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const collectionui_changes = {};
    			if (dirty & /*collection*/ 32) collectionui_changes.ITEMNAME = /*item*/ ctx[11].name;
    			if (dirty & /*collection*/ 32) collectionui_changes.string = /*item*/ ctx[11].string;
    			if (dirty & /*collection*/ 32) collectionui_changes.collectiontier = /*item*/ ctx[11].tier;
    			if (dirty & /*collection*/ 32) collectionui_changes.maxtier = /*item*/ ctx[11].maxtier;
    			if (dirty & /*collection*/ 32) collectionui_changes.imageurl = /*item*/ ctx[11].image;
    			collectionui.$set(collectionui_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collectionui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collectionui, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(295:0) {#each collection.combat as item}",
    		ctx
    	});

    	return block;
    }

    // (302:0) {#each collection.foraging as item}
    function create_each_block_1(ctx) {
    	let collectionui;
    	let current;

    	collectionui = new CollectionUI({
    			props: {
    				ITEMNAME: /*item*/ ctx[11].name,
    				string: /*item*/ ctx[11].string,
    				collectiontier: /*item*/ ctx[11].tier,
    				maxtier: /*item*/ ctx[11].maxtier,
    				imageurl: /*item*/ ctx[11].image
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collectionui.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collectionui, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const collectionui_changes = {};
    			if (dirty & /*collection*/ 32) collectionui_changes.ITEMNAME = /*item*/ ctx[11].name;
    			if (dirty & /*collection*/ 32) collectionui_changes.string = /*item*/ ctx[11].string;
    			if (dirty & /*collection*/ 32) collectionui_changes.collectiontier = /*item*/ ctx[11].tier;
    			if (dirty & /*collection*/ 32) collectionui_changes.maxtier = /*item*/ ctx[11].maxtier;
    			if (dirty & /*collection*/ 32) collectionui_changes.imageurl = /*item*/ ctx[11].image;
    			collectionui.$set(collectionui_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collectionui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collectionui, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(302:0) {#each collection.foraging as item}",
    		ctx
    	});

    	return block;
    }

    // (310:0) {#each collection.fishing as item}
    function create_each_block(ctx) {
    	let collectionui;
    	let current;

    	collectionui = new CollectionUI({
    			props: {
    				ITEMNAME: /*item*/ ctx[11].name,
    				string: /*item*/ ctx[11].string,
    				collectiontier: /*item*/ ctx[11].tier,
    				maxtier: /*item*/ ctx[11].maxtier,
    				imageurl: /*item*/ ctx[11].image
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collectionui.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collectionui, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const collectionui_changes = {};
    			if (dirty & /*collection*/ 32) collectionui_changes.ITEMNAME = /*item*/ ctx[11].name;
    			if (dirty & /*collection*/ 32) collectionui_changes.string = /*item*/ ctx[11].string;
    			if (dirty & /*collection*/ 32) collectionui_changes.collectiontier = /*item*/ ctx[11].tier;
    			if (dirty & /*collection*/ 32) collectionui_changes.maxtier = /*item*/ ctx[11].maxtier;
    			if (dirty & /*collection*/ 32) collectionui_changes.imageurl = /*item*/ ctx[11].image;
    			collectionui.$set(collectionui_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collectionui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collectionui, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(310:0) {#each collection.fishing as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let title_value;
    	let t0;
    	let p;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let div;
    	let current;
    	document.title = title_value = "" + (/*id*/ ctx[8] + " profile");
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*proDout*/ ctx[0].loading == true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			t0 = space();
    			p = element("p");
    			p.textContent = `${/*id*/ ctx[8]} profile:`;
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			div = element("div");
    			attr_dev(p, "class", "subtext");
    			add_location(p, file, 241, 0, 18115);
    			attr_dev(div, "class", "back-bg svelte-14u11zx");
    			add_location(div, file, 338, 0, 23581);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t3, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*id*/ 256) && title_value !== (title_value = "" + (/*id*/ ctx[8] + " profile"))) {
    				document.title = title_value;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t4.parentNode, t4);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function reun(valable) {
    	if (valable === undefined) {
    		return "Not enabled your api";
    	} else {
    		return valable;
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profileid', slots, []);

    	function toformated(number) {
    		return new bignumber(number.toString()).toFormat();
    	}

    	let { params = {} } = $$props;
    	let id = params.id;
    	let profile = params.profile;

    	let proDout = {
    		output: undefined,
    		loading: false,
    		uuid: undefined
    	};

    	let profiledata = {
    		bank_balance: undefined,
    		critical_damage: undefined,
    		death_count: undefined,
    		total_kills: undefined,
    		item_fished: undefined
    	};

    	let ah_data = {
    		ah_fees: undefined,
    		ah_earned: undefined,
    		ah_solded: undefined,
    		ah_spend: undefined,
    		ah_bidded: undefined,
    		ah_won: undefined
    	};

    	let giftdata = {
    		gift_given: undefined,
    		gift_received: undefined
    	};

    	let skills = {
    		experience_skill_alchemy: undefined,
    		experience_skill_carpentry: undefined,
    		experience_skill_combat: undefined,
    		experience_skill_enchanting: undefined,
    		experience_skill_farming: undefined,
    		experience_skill_fishing: undefined,
    		experience_skill_foraging: undefined,
    		experience_skill_mining: undefined,
    		experience_skill_runecrafting: undefined,
    		experience_skill_taming: undefined
    	};

    	let collection = {};
    	let coll = undefined;

    	onMount(async () => {
    		$$invalidate(0, proDout.loading = true, proDout);
    		let response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profile/' + id + '/' + profile);
    		let output = await response.json();
    		let res = await fetch("https://skyproxyjs.cephas8080.workers.dev/fetchuuid/" + id.replaceAll(" ", ""));
    		let uuidout = await res.json();
    		$$invalidate(0, proDout = { output, loading: false, uuid: uuidout.id });
    		console.log(output);

    		try {
    			$$invalidate(1, profiledata = {
    				bank_balance: reun(proDout.output.profile.banking.balance.toFixed(2)),
    				coin_purse: reun(proDout.output.profile.members[proDout.uuid].coin_purse.toFixed(2)),
    				item_fished: reun(proDout.output.profile.members[proDout.uuid].stats.items_fished)
    			});
    		} catch(err) {
    			console.log(err);

    			$$invalidate(1, profiledata = {
    				last_save: undefined,
    				bank_balance: undefined,
    				coin_purse: undefined,
    				fairy_souls: undefined,
    				item_fished: undefined
    			});
    		}

    		($$invalidate(1, profiledata.last_save = proDout.output.profile.last_save, profiledata), $$invalidate(1, profiledata.fairy_souls = reun(proDout.output.profile.members[proDout.uuid].fairy_souls_collected), profiledata));
    		$$invalidate(1, profiledata.critical_damage = reun(proDout.output.profile.members[proDout.uuid].stats.highest_critical_damage.toFixed(1)), profiledata);
    		$$invalidate(1, profiledata.death_count = reun(proDout.output.profile.members[proDout.uuid].death_count), profiledata);
    		$$invalidate(1, profiledata.total_kills = reun(proDout.output.profile.members[proDout.uuid].stats.kills), profiledata);

    		$$invalidate(2, ah_data = {
    			ah_fees: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_fees),
    			ah_earned: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_gold_earned),
    			ah_spend: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_gold_spent),
    			ah_bidded: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_bids),
    			ah_won: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_won)
    		});

    		$$invalidate(3, giftdata = {
    			gift_given: reun(proDout.output.profile.members[proDout.uuid].stats.gifts_given),
    			gift_received: reun(proDout.output.profile.members[proDout.uuid].stats.gifts_received)
    		});

    		$$invalidate(4, skills = {
    			experience_skill_alchemy: reun(proDout.output.profile.members[proDout.uuid].experience_skill_alchemy.toFixed(0)),
    			experience_skill_carpentry: reun(proDout.output.profile.members[proDout.uuid].experience_skill_carpentry.toFixed(0)),
    			experience_skill_combat: reun(proDout.output.profile.members[proDout.uuid].experience_skill_combat.toFixed(0)),
    			experience_skill_enchanting: reun(proDout.output.profile.members[proDout.uuid].experience_skill_enchanting.toFixed(0)),
    			experience_skill_farming: reun(proDout.output.profile.members[proDout.uuid].experience_skill_farming.toFixed(0)),
    			experience_skill_fishing: reun(proDout.output.profile.members[proDout.uuid].experience_skill_fishing.toFixed(0)),
    			experience_skill_foraging: reun(proDout.output.profile.members[proDout.uuid].experience_skill_foraging.toFixed(0)),
    			experience_skill_mining: reun(proDout.output.profile.members[proDout.uuid].experience_skill_mining.toFixed(0)),
    			experience_skill_runecrafting: reun(proDout.output.profile.members[proDout.uuid].experience_skill_runecrafting.toFixed(0)),
    			experience_skill_taming: reun(proDout.output.profile.members[proDout.uuid].experience_skill_taming.toFixed(0))
    		});

    		$$invalidate(6, coll = reun(proDout.output.profile.members[proDout.uuid].collection));

    		$$invalidate(5, collection = {
    			foraging: [
    				{
    					name: "Oak Wood",
    					string: coll.LOG,
    					tier: [0, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 30000],
    					maxtier: 30000,
    					image: '/resource/minecraft/textures/blocks/log_oak.png'
    				},
    				{
    					name: "Spruce Wood",
    					string: coll["LOG:1"],
    					tier: [0, 50, 100, 250, 1000, 2000, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/blocks/log_spruce.png'
    				},
    				{
    					name: "Birch Wood",
    					string: coll["LOG:2"],
    					tier: [0, 50, 100, 250, 1000, 2000, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/blocks/log_birch.png'
    				},
    				{
    					name: "Jungle Wood",
    					string: coll["LOG:3"],
    					tier: [0, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 25000],
    					maxtier: 25000,
    					image: '/resource/minecraft/textures/blocks/log_jungle.png'
    				},
    				{
    					name: "Acacia Wood",
    					string: coll["LOG_2"],
    					tier: [0, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 25000],
    					maxtier: 25000,
    					image: '/resource/minecraft/textures/blocks/log_acacia.png'
    				},
    				{
    					name: "Dark Oak Wood",
    					string: coll["LOG_2:1"],
    					tier: [0, 50, 100, 250, 1000, 2000, 5000, 10000, 15000, 25000],
    					maxtier: 25000,
    					image: '/resource/minecraft/textures/blocks/log_big_oak.png'
    				}
    			],
    			fishing: [
    				{
    					name: "Raw Fish",
    					string: coll["RAW_FISH"],
    					tier: [0, 20, 50, 100, 250, 500, 1000, 2500, 15000, 30000, 45000, 60000],
    					maxtier: 60000,
    					image: '/resource/minecraft/textures/items/fish_cod_raw.png'
    				},
    				{
    					name: "Raw Salmon",
    					string: coll["RAW_FISH:1"],
    					tier: [0, 20, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    					maxtier: 10000,
    					image: '/resource/minecraft/textures/items/fish_salmon_raw.png'
    				},
    				{
    					name: "Clownfish",
    					string: coll["RAW_FISH:2"],
    					tier: [0, 10, 25, 50, 100, 200, 400, 800],
    					maxtier: 800,
    					image: '/resource/minecraft/textures/items/fish_clownfish_raw.png'
    				},
    				{
    					name: "Pufferfish",
    					string: coll["RAW_FISH:3"],
    					tier: [0, 20, 50, 100, 150, 400, 800, 2400, 4800, 9000],
    					maxtier: 9000,
    					image: '/resource/minecraft/textures/items/fish_pufferfish_raw.png'
    				},
    				{
    					name: "Prismarine Shard",
    					string: coll["PRISMARINE_SHARD"],
    					tier: [0, 10, 25, 50, 100, 200, 400],
    					maxtier: 400,
    					image: '/resource/minecraft/textures/items/prismarine_shard.png'
    				},
    				{
    					name: "Prismarine Crystal",
    					string: coll["PRISMARINE_CRYSTALS"],
    					tier: [0, 10, 25, 50, 100, 200, 400, 800],
    					maxtier: 800,
    					image: '/resource/minecraft/textures/items/prismarine_crystals.png'
    				},
    				{
    					name: "Clay",
    					string: coll["CLAY_BALL"],
    					tier: [0, 50, 100, 250, 1000, 2500],
    					maxtier: 2500,
    					image: '/resource/minecraft/textures/items/clay_ball.png'
    				},
    				{
    					name: "Lily Pad",
    					string: coll["WATER_LILY"],
    					tier: [0, 10, 50, 100, 200, 500, 1500, 3000, 6000, 10000],
    					maxtier: 10000,
    					image: '/resource/minecraft/textures/blocks/waterlily.png'
    				},
    				{
    					name: "Ink Sac",
    					string: coll["INK_SACK"],
    					tier: [0, 20, 40, 100, 200, 400, 800, 1500, 2500, 4000],
    					maxtier: 4000,
    					image: '/resource/minecraft/textures/items/dye_powder_black.png'
    				},
    				{
    					name: "Sponge",
    					string: coll["SPONGE"],
    					tier: [0, 20, 40, 100, 200, 400, 800, 1500, 2500, 4000],
    					maxtier: 4000,
    					image: '/resource/minecraft/textures/blocks/sponge.png'
    				}
    			],
    			combat: [
    				{
    					name: "Rotten Flesh",
    					string: coll["ROTTEN_FLESH"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/rotten_flesh.png'
    				},
    				{
    					name: "Bone",
    					string: coll["BONE"],
    					tier: [0, 50, 100, 250, 500, 1000, 5000, 10000, 25000, 50000, 150000],
    					maxtier: 150000,
    					image: '/resource/minecraft/textures/items/bone.png'
    				},
    				{
    					name: "String",
    					string: coll["STRING"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/string.png'
    				},
    				{
    					name: "Spider eye",
    					string: coll["SPIDER_EYE"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/spider_eye.png'
    				},
    				{
    					name: "Gun powder",
    					string: coll["GUNPOWDER"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/gunpowder.png'
    				},
    				{
    					name: "Ender Pearl",
    					string: coll["ENDER_PEARL"],
    					tier: [0, 50, 250, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/ender_pearl.png'
    				},
    				{
    					name: "Blaze Rod",
    					string: coll["BLAZE_ROD"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/blaze_rod.png'
    				},
    				{
    					name: "Ghast Tear",
    					string: coll["GHAST_TEAR"],
    					tier: [0, 20, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/ghast_tear.png'
    				},
    				{
    					name: "Magma Cream",
    					string: coll["MAGMA_CREAM"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/magma_cream.png'
    				},
    				{
    					name: "Slime ball",
    					string: coll["SLIME_BALL"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/slimeball.png'
    				}
    			],
    			mining: [
    				{
    					name: "Mithril",
    					string: coll["MITHRIL_ORE"],
    					tier: [0, 50, 250, 1000, 2500, 5000, 10000, 250000, 500000, 1000000],
    					maxtier: 1000000,
    					image: '/resource/minecraft/textures/items/prismarine_crystals.png'
    				},
    				{
    					name: "Cobblestone",
    					string: coll["COBBLESTONE"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 40000, 70000],
    					maxtier: 70000,
    					image: '/resource/minecraft/textures/blocks/cobblestone.png'
    				},
    				{
    					name: "Coal",
    					string: coll["COAL"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/coal.png'
    				},
    				{
    					name: "Iron Ingot",
    					string: coll["IRON_INGOT"],
    					tier: [
    						0,
    						50,
    						100,
    						250,
    						1000,
    						2500,
    						5000,
    						10000,
    						25000,
    						50000,
    						100000,
    						200000,
    						400000
    					],
    					maxtier: 400000,
    					image: '/resource/minecraft/textures/items/iron_ingot.png'
    				},
    				{
    					name: "Gold Ingot",
    					string: coll["GOLD_INGOT"],
    					tier: [0, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000],
    					maxtier: 25000,
    					image: '/resource/minecraft/textures/items/gold_ingot.png'
    				},
    				{
    					name: "Diamond",
    					string: coll["DIAMOND_BLOCK"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/diamond.png'
    				},
    				{
    					name: "Lapis Lazuli",
    					string: coll["INK_SACK:4"],
    					tier: [0, 50, 250, 1000, 2000, 10000, 25000, 50000, 100000, 150000, 250000],
    					maxtier: 250000,
    					image: '/resource/minecraft/textures/blocks/lapis_block.png'
    				},
    				{
    					name: "Emerald",
    					string: coll["EMERALD"],
    					tier: [0, 50, 100, 250, 1000, 5000, 15000, 30000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/emerald.png'
    				},
    				{
    					name: "Redstone",
    					string: coll["REDSTONE"],
    					tier: [
    						0,
    						100,
    						250,
    						750,
    						1500,
    						3000,
    						5000,
    						10000,
    						25000,
    						50000,
    						200000,
    						400000,
    						600000,
    						800000,
    						1000000,
    						1200000,
    						1400000
    					],
    					maxtier: 1400000,
    					image: '/resource/minecraft/textures/items/redstone_dust.png'
    				},
    				{
    					name: "Nether Quartz",
    					string: coll["QUARTZ"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/quartz.png'
    				},
    				{
    					name: "OBSIDIAN",
    					string: coll["OBSIDIAN"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/blocks/obsidian.png'
    				},
    				{
    					name: "Glowstone",
    					string: coll["GLOWSTONE_DUST"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/glowstone_dust.png'
    				},
    				{
    					name: "Gravel",
    					string: coll["GRAVEL"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 15000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/blocks/gravel.png'
    				},
    				{
    					name: "Ice",
    					string: coll["ICE"],
    					tier: [0, 50, 100, 250, 500, 1000, 5000, 10000, 50000, 100000, 250000],
    					maxtier: 250000,
    					image: '/resource/minecraft/textures/blocks/ice.png'
    				},
    				{
    					name: "NETHERRACK",
    					string: coll["NETHERRACK"],
    					tier: [0, 50, 250, 500, 1000, 5000],
    					maxtier: 5000,
    					image: '/resource/minecraft/textures/blocks/netherrack.png'
    				},
    				{
    					name: "Sand",
    					string: coll["SAND"],
    					tier: [0, 50, 250, 500, 1000, 2500, 5000],
    					maxtier: 2500,
    					image: '/resource/minecraft/textures/blocks/sand.png'
    				},
    				{
    					name: "End Stone",
    					string: coll["ENDER_STONE"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 15000, 25000],
    					maxtier: 25000,
    					image: '/resource/minecraft/textures/blocks/end_stone.png'
    				}
    			],
    			farming: [
    				{
    					name: "Wheat",
    					string: coll["WHEAT"],
    					tier: [0, 50, 100, 250, 500, 1000, 2500, 10000, 15000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/wheat.png'
    				},
    				{
    					name: "Carrot",
    					string: coll["CARROT_ITEM"],
    					tier: [0, 100, 250, 500, 1700, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/carrot.png'
    				},
    				{
    					name: "Potato",
    					string: coll["POTATO_ITEM"],
    					tier: [0, 100, 200, 500, 1750, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/potato.png'
    				},
    				{
    					name: "Pumpkin",
    					string: coll["PUMPKIN"],
    					tier: [0, 40, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
    					maxtier: 250000,
    					image: '/resource/minecraft/textures/blocks/pumpkin_side.png'
    				},
    				{
    					name: "Melon",
    					string: coll["MELON"],
    					tier: [0, 250, 500, 1250, 5000, 15500, 25000, 50000, 100000, 250000],
    					maxtier: 250000,
    					image: '/resource/minecraft/textures/items/melon.png'
    				},
    				{
    					name: "Seed",
    					string: coll["SEEDS"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000],
    					maxtier: 5000,
    					image: '/resource/minecraft/textures/items/seeds_wheat.png'
    				},
    				{
    					name: "Mushroom",
    					string: coll["MUSHROOM_COLLECTION"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/blocks/mushroom_red.png'
    				},
    				{
    					name: "Cocoa bean",
    					string: coll["INK_SACK:3"],
    					tier: [0, 75, 200, 500, 2000, 5000, 10000, 20000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/misc/unknown_server.png'
    				},
    				{
    					name: "Cactus",
    					string: coll["CACTUS"],
    					tier: [0, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/blocks/cactus_side.png'
    				},
    				{
    					name: "Sugar Cane",
    					string: coll["SUGAR_CANE"],
    					tier: [0, 100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/sugar.png'
    				},
    				{
    					name: "Feather",
    					string: coll["FEATHER"],
    					tier: [0, 50, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/feather.png'
    				},
    				{
    					name: "Leather",
    					string: coll["LEATHER"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
    					maxtier: 100000,
    					image: '/resource/minecraft/textures/items/leather.png'
    				},
    				{
    					name: "Pork Chop",
    					string: coll["PORK"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/porkchop_raw.png'
    				},
    				{
    					name: "Chicken",
    					string: coll["RAW_CHICKEN"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/chicken_raw.png'
    				},
    				{
    					name: "Mutton",
    					string: coll["MUTTON"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/mutton_raw.png'
    				},
    				{
    					name: "Rabbit",
    					string: coll["RABBIT"],
    					tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],
    					maxtier: 50000,
    					image: '/resource/minecraft/textures/items/rabbit_raw.png'
    				},
    				{
    					name: "Nether Wart",
    					string: coll["NETHER_STALK"],
    					tier: [
    						0,
    						50,
    						100,
    						250,
    						1000,
    						2500,
    						5000,
    						10000,
    						25000,
    						50000,
    						75000,
    						100000,
    						250000
    					],
    					maxtier: 250000,
    					image: '/resource/minecraft/textures/items/nether_wart.png'
    				}
    			]
    		});
    	}); // 50, 100, 250, 1000, 2000, 5000, 10000, 15000, 25000
    	// console.log(proDout.output.profile.members[proDout.uuid])

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Profileid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(9, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		ProgressBar,
    		Thinking,
    		CollectionUi: CollectionUI,
    		ImageText,
    		BigNumber: bignumber,
    		onMount,
    		reun,
    		toformated,
    		params,
    		id,
    		profile,
    		proDout,
    		profiledata,
    		ah_data,
    		giftdata,
    		skills,
    		collection,
    		coll
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(9, params = $$props.params);
    		if ('id' in $$props) $$invalidate(8, id = $$props.id);
    		if ('profile' in $$props) profile = $$props.profile;
    		if ('proDout' in $$props) $$invalidate(0, proDout = $$props.proDout);
    		if ('profiledata' in $$props) $$invalidate(1, profiledata = $$props.profiledata);
    		if ('ah_data' in $$props) $$invalidate(2, ah_data = $$props.ah_data);
    		if ('giftdata' in $$props) $$invalidate(3, giftdata = $$props.giftdata);
    		if ('skills' in $$props) $$invalidate(4, skills = $$props.skills);
    		if ('collection' in $$props) $$invalidate(5, collection = $$props.collection);
    		if ('coll' in $$props) $$invalidate(6, coll = $$props.coll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		proDout,
    		profiledata,
    		ah_data,
    		giftdata,
    		skills,
    		collection,
    		coll,
    		toformated,
    		id,
    		params
    	];
    }

    class Profileid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profileid",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<Profileid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Profileid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.6 */

    function create_fragment(ctx) {
    	let layout;
    	let t;
    	let router;
    	let current;
    	layout = new Layout({ $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		'/': Routes,
    		'/ah': Ah,
    		'/bazaar': Bazaar,
    		'/contactme': Contactme,
    		'/locationtracker': Locationtracker,
    		'/mayor': Mayor,
    		'/minion': Minion,
    		'/news': News,
    		'/profile': Profile,
    		'/profile/:id/:profile': Profileid,
    		'*': _error
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		ah: Ah,
    		bazaar: Bazaar,
    		contactme: Contactme,
    		__error: _error,
    		index: Routes,
    		Layout,
    		locationtracker: Locationtracker,
    		mayor: Mayor,
    		minion: Minion,
    		news: News,
    		profile: Profile,
    		profileid: Profileid,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	//props: {
    	//	name: 'world'
    	//}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
