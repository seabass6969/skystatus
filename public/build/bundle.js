
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

    const { Error: Error_1, Object: Object_1, console: console_1$2 } = globals;

    // (251:0) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$4(ctx) {
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
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
    		id: create_fragment$e.name,
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

    function instance$e($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$e.name
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

    function create_fragment$d(ctx) {
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ah",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/component/thinking.svelte generated by Svelte v3.46.6 */

    const file$a = "src/component/thinking.svelte";

    function create_fragment$c(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/Villager.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "villager thinking");
    			attr_dev(img, "class", "spin svelte-1ac2uz0");
    			add_location(img, file$a, 19, 0, 398);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thinking",
    			options,
    			id: create_fragment$c.name
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
    const file$9 = "src/routes/bazaar.svelte";

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
    			add_location(p, file$9, 66, 0, 2193);
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
    		if (/*output*/ ctx[5].success) return create_if_block$3;
    		return create_else_block$1;
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
    			add_location(h1, file$9, 52, 0, 1349);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "maincolor hoverinput textbox svelte-17slas8");
    			add_location(input, file$9, 53, 0, 1412);
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
    function create_else_block$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "The code must be fuck up";
    			add_location(h1, file$9, 63, 0, 2138);
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(63:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:0) {#if output.success}
    function create_if_block$3(ctx) {
    	let t0;
    	let p;
    	let t1;
    	let t2_value = Date(/*output*/ ctx[5]["lastUpdated"]) + "";
    	let t2;
    	let if_block = /*done*/ ctx[2] == true && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text("last update is: ");
    			t2 = text(t2_value);
    			attr_dev(p, "class", "smalltext maincolor");
    			add_location(p, file$9, 61, 4, 2049);
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
    					if_block = create_if_block_1$3(ctx);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(55:0) {#if output.success}",
    		ctx
    	});

    	return block;
    }

    // (56:0) {#if done == true}
    function create_if_block_1$3(ctx) {
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
    			add_location(p0, file$9, 56, 0, 1531);
    			attr_dev(p1, "class", "subtext maincolor");
    			add_location(p1, file$9, 57, 0, 1658);
    			attr_dev(p2, "class", "subtext maincolor");
    			add_location(p2, file$9, 58, 0, 1787);
    			attr_dev(p3, "class", "subtext maincolor");
    			add_location(p3, file$9, 59, 0, 1912);
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
    		id: create_if_block_1$3.name,
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

    function create_fragment$b(ctx) {
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
    			add_location(div, file$9, 68, 0, 2230);
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
    		id: create_fragment$b.name,
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

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bazaar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/contactme.svelte generated by Svelte v3.46.6 */

    const file$8 = "src/routes/contactme.svelte";

    function create_fragment$a(ctx) {
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
    			add_location(p0, file$8, 23, 0, 433);
    			if (!src_url_equal(img0.src, img0_src_value = "/Discord-Logo-Color.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "discord logo");
    			attr_dev(img0, "class", "normalimage");
    			add_location(img0, file$8, 24, 22, 490);
    			attr_dev(p1, "class", "subsubtext");
    			add_location(p1, file$8, 24, 0, 468);
    			add_location(br0, file$8, 25, 106, 698);
    			add_location(br1, file$8, 25, 111, 703);
    			if (!src_url_equal(img1.src, img1_src_value = "/github.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Github logo");
    			attr_dev(img1, "class", "normalimage");
    			add_location(img1, file$8, 25, 167, 759);
    			attr_dev(a0, "href", "https://github.com/seabass6969/skystatus");
    			add_location(a0, file$8, 25, 116, 708);
    			attr_dev(p2, "class", "subsubtext");
    			add_location(p2, file$8, 25, 0, 592);
    			add_location(p3, file$8, 25, 246, 838);
    			attr_dev(a1, "href", "https://cephas.monster");
    			add_location(a1, file$8, 26, 36, 878);
    			attr_dev(p4, "class", "subsubtext");
    			add_location(p4, file$8, 26, 0, 842);
    			attr_dev(p5, "class", "subsubtext");
    			add_location(p5, file$8, 27, 0, 934);
    			if (!src_url_equal(img2.src, img2_src_value = "https://crafatar.com/renders/head/6b350daa18d946e9a5a08cd6102d4b6e?overlay")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "normalimage");
    			add_location(img2, file$8, 28, 75, 1043);
    			attr_dev(a2, "href", "/profile/6l6l/5bef569e02b644ae95e5c5e086f2cbee");
    			add_location(a2, file$8, 28, 18, 986);
    			attr_dev(div0, "class", "card svelte-r1ttd3");
    			add_location(div0, file$8, 28, 0, 968);
    			attr_dev(p6, "class", "subsubtext");
    			add_location(p6, file$8, 29, 0, 1171);
    			if (!src_url_equal(img3.src, img3_src_value = "https://crafatar.com/renders/head/e1e695dc1e17472091800861fdf7aa70?overlay")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "class", "normalimage");
    			add_location(img3, file$8, 31, 86, 1323);
    			attr_dev(a3, "href", "/profile/ShadowStriken15/e1e695dc1e17472091800861fdf7aa70");
    			add_location(a3, file$8, 31, 18, 1255);
    			attr_dev(div1, "class", "card svelte-r1ttd3");
    			add_location(div1, file$8, 31, 0, 1237);
    			if (!src_url_equal(img4.src, img4_src_value = "https://crafatar.com/renders/head/984aabbfade94549b22d9a27c85778bf?overlay")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			attr_dev(img4, "class", "normalimage");
    			add_location(img4, file$8, 32, 82, 1544);
    			attr_dev(a4, "href", "/profile/MADHAVMEHTA/36b0f9b0691e4081b5777a45b46ca416");
    			add_location(a4, file$8, 32, 18, 1480);
    			attr_dev(div2, "class", "card svelte-r1ttd3");
    			add_location(div2, file$8, 32, 0, 1462);
    			attr_dev(div3, "class", "card-container svelte-r1ttd3");
    			add_location(div3, file$8, 30, 0, 1208);
    			attr_dev(div4, "class", "back-bg svelte-r1ttd3");
    			add_location(div4, file$8, 34, 0, 1686);
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

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contactme', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contactme> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contactme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contactme",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/__error.svelte generated by Svelte v3.46.6 */

    const file$7 = "src/routes/__error.svelte";

    function create_fragment$9(ctx) {
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
    			add_location(h1, file$7, 18, 0, 334);
    			attr_dev(div, "class", "back-bg svelte-1p1zej1");
    			add_location(div, file$7, 19, 0, 377);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_error",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/routes/index.svelte generated by Svelte v3.46.6 */

    const file$6 = "src/routes/index.svelte";

    function create_fragment$8(ctx) {
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
    			add_location(h1, file$6, 30, 0, 615);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$6, 31, 0, 699);
    			attr_dev(a, "href", "https://github.com/seabass6969/skystatus/blob/master/LICENSE");
    			add_location(a, file$6, 33, 18, 769);
    			attr_dev(div0, "class", "smalltext");
    			add_location(div0, file$6, 32, 0, 727);
    			attr_dev(div1, "class", "back-bg svelte-ozov5j");
    			add_location(div1, file$6, 35, 0, 884);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/routes/Layout.svelte generated by Svelte v3.46.6 */
    const file$5 = "src/routes/Layout.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(img, file$5, 31, 38, 589);
    			attr_dev(a0, "class", "link svelte-54fs72");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$5, 31, 4, 555);
    			attr_dev(a1, "class", "link svelte-54fs72");
    			attr_dev(a1, "href", "/bazaar");
    			add_location(a1, file$5, 32, 4, 653);
    			attr_dev(a2, "class", "link svelte-54fs72");
    			attr_dev(a2, "href", "/mayor");
    			add_location(a2, file$5, 33, 4, 704);
    			attr_dev(a3, "class", "link svelte-54fs72");
    			attr_dev(a3, "href", "/news");
    			add_location(a3, file$5, 34, 4, 757);
    			attr_dev(a4, "class", "link svelte-54fs72");
    			attr_dev(a4, "href", "/locationtracker");
    			add_location(a4, file$5, 35, 4, 808);
    			attr_dev(a5, "class", "link svelte-54fs72");
    			attr_dev(a5, "href", "/profile");
    			add_location(a5, file$5, 36, 4, 871);
    			attr_dev(a6, "class", "link svelte-54fs72");
    			attr_dev(a6, "href", "/contactme");
    			add_location(a6, file$5, 37, 4, 928);
    			attr_dev(div, "class", "header svelte-54fs72");
    			add_location(div, file$5, 30, 0, 530);
    			add_location(br, file$5, 39, 0, 985);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$7.name
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
    const file$4 = "src/routes/locationtracker.svelte";

    // (77:40) 
    function create_if_block_3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "type in your username properly";
    			attr_dev(p, "class", "subtext");
    			add_location(p, file$4, 77, 0, 2306);
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
    function create_if_block$2(ctx) {
    	let br;
    	let t;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*locationdata*/ ctx[2].output.session.online == false) return create_if_block_1$2;
    		if (/*locationdata*/ ctx[2].output.session.gameType === "SKYBLOCK") return create_if_block_2$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			br = element("br");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(br, file$4, 66, 0, 1758);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(66:0) {#if locationdata.success !== false}",
    		ctx
    	});

    	return block;
    }

    // (73:0) {:else}
    function create_else_block(ctx) {
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
    			add_location(p, file$4, 73, 0, 2080);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(73:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if locationdata.output.session.gameType === "SKYBLOCK"}
    function create_if_block_2$1(ctx) {
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
    			add_location(p, file$4, 71, 0, 1946);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(71:0) {#if locationdata.output.session.gameType === \\\"SKYBLOCK\\\"}",
    		ctx
    	});

    	return block;
    }

    // (68:0) {#if locationdata.output.session.online == false}
    function create_if_block_1$2(ctx) {
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
    			add_location(p, file$4, 68, 0, 1813);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(68:0) {#if locationdata.output.session.online == false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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
    		if (/*locationdata*/ ctx[2].success !== false) return create_if_block$2;
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
    			add_location(input, file$4, 62, 0, 1474);
    			attr_dev(button, "class", "showme subsubtext maincolor hoverinput");
    			add_location(button, file$4, 63, 0, 1618);
    			attr_dev(div0, "class", "tablestyle svelte-1je9o45");
    			add_location(div0, file$4, 61, 0, 1449);
    			attr_dev(div1, "class", "back-bg svelte-1je9o45");
    			add_location(div1, file$4, 79, 0, 2366);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Locationtracker",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/component/minecraftCode.svelte generated by Svelte v3.46.6 */

    function create_fragment$5(ctx) {
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
    		id: create_fragment$5.name,
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

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MinecraftCode",
    			options,
    			id: create_fragment$5.name
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
    const file$3 = "src/routes/mayor.svelte";

    function get_each_context$3(ctx, list, i) {
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
    			add_location(p, file$3, 42, 0, 1129);
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
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			add_location(p0, file$3, 33, 0, 738);
    			attr_dev(p1, "class", "secondarycolor subtext");
    			add_location(p1, file$3, 34, 0, 854);
    			attr_dev(p2, "class", "smalltext maincolor");
    			add_location(p2, file$3, 40, 0, 1033);
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    function create_each_block$3(ctx) {
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
    			add_location(br, file$3, 37, 0, 978);
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
    		id: create_each_block$3.name,
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

    function create_fragment$4(ctx) {
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
    			add_location(div, file$3, 44, 0, 1166);
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
    		id: create_fragment$4.name,
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

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mayor",
    			options,
    			id: create_fragment$4.name
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

    const { console: console_1$1 } = globals;
    const file$2 = "src/routes/minion.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (77:0) {#if bzdata.done === true}
    function create_if_block$1(ctx) {
    	let div;
    	let t0;
    	let input;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*bzdata*/ ctx[7].output.success && create_if_block_1$1(ctx);

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
    			add_location(input, file$2, 77, 47, 2406);
    			attr_dev(div, "class", "subsubsubtext");
    			add_location(div, file$2, 77, 0, 2359);
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
    					if_block = create_if_block_1$1(ctx);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(77:0) {#if bzdata.done === true}",
    		ctx
    	});

    	return block;
    }

    // (79:0) {#if bzdata.output.success}
    function create_if_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*done*/ ctx[8] === true && create_if_block_2(ctx);

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
    					if_block = create_if_block_2(ctx);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(79:0) {#if bzdata.output.success}",
    		ctx
    	});

    	return block;
    }

    // (80:0) {#if done === true}
    function create_if_block_2(ctx) {
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
    			add_location(p, file$2, 80, 0, 2539);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(80:0) {#if done === true}",
    		ctx
    	});

    	return block;
    }

    // (90:4) {#each minionjson["fuel"] as a}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*a*/ ctx[17].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*a*/ ctx[17].speed;
    			option.value = option.__value;
    			add_location(option, file$2, 90, 8, 2983);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(90:4) {#each minionjson[\\\"fuel\\\"] as a}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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
    	let if_block = /*bzdata*/ ctx[7].done === true && create_if_block$1(ctx);
    	let each_value = minionjson["fuel"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			add_location(p0, file$2, 69, 0, 2010);
    			attr_dev(p1, "class", "subsubtext");
    			add_location(p1, file$2, 70, 0, 2053);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "10");
    			add_location(input0, file$2, 71, 0, 2101);
    			attr_dev(p2, "class", "subsubtext");
    			add_location(p2, file$2, 72, 0, 2159);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$2, 73, 0, 2202);
    			attr_dev(p3, "class", "subsubtext");
    			add_location(p3, file$2, 74, 0, 2253);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$2, 75, 0, 2291);
    			attr_dev(p4, "class", "subsubtext");
    			add_location(p4, file$2, 84, 0, 2691);
    			attr_dev(input3, "type", "checkbox");
    			add_location(input3, file$2, 85, 0, 2736);
    			attr_dev(p5, "class", "subsubtext");
    			add_location(p5, file$2, 86, 0, 2784);
    			option.selected = true;
    			option.__value = "0";
    			option.value = option.__value;
    			add_location(option, file$2, 88, 4, 2900);
    			attr_dev(select, "id", "BonusSpeedByFuel");
    			attr_dev(select, "name", "Fuel");
    			if (/*speedbyfuel*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[16].call(select));
    			add_location(select, file$2, 87, 0, 2828);
    			attr_dev(p6, "class", "subtext");
    			add_location(p6, file$2, 93, 0, 3047);
    			attr_dev(p7, "class", "subtext");
    			add_location(p7, file$2, 94, 0, 3106);
    			attr_dev(div, "class", "back-bg svelte-129ykmq");
    			add_location(div, file$2, 95, 0, 3159);
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
    					if_block = create_if_block$1(ctx);
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
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Minion> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Minion",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/routes/news.svelte generated by Svelte v3.46.6 */
    const file$1 = "src/routes/news.svelte";

    function get_each_context$1(ctx, list, i) {
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
    			add_location(p, file$1, 41, 0, 1032);
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
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    function create_each_block$1(ctx) {
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
    			add_location(p0, file$1, 36, 0, 790);
    			attr_dev(p1, "class", "secondarycolor smalltext");
    			add_location(p1, file$1, 37, 0, 862);
    			attr_dev(a, "class", "secondarycolor smalltext");
    			attr_dev(a, "href", /*items*/ ctx[2]["link"]);
    			add_location(a, file$1, 38, 0, 932);
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
    		id: create_each_block$1.name,
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

    function create_fragment$2(ctx) {
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
    			add_location(div, file$1, 43, 0, 1065);
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
    		id: create_fragment$2.name,
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

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/routes/profile.svelte generated by Svelte v3.46.6 */

    const { console: console_1 } = globals;
    const file = "src/routes/profile.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (86:42) 
    function create_if_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "type in your username properly";
    			attr_dev(p, "class", "subtext");
    			add_location(p, file, 86, 0, 2458);
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(86:42) ",
    		ctx
    	});

    	return block;
    }

    // (76:0) {#if profileidfetch.success !== false}
    function create_if_block(ctx) {
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
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			add_location(br0, file, 76, 0, 2047);
    			attr_dev(p, "class", "subtext");
    			add_location(p, file, 77, 0, 2052);
    			if (/*profileidfetch*/ ctx[1].selected_value === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file, 78, 0, 2096);
    			add_location(br1, file, 83, 0, 2305);
    			attr_dev(a, "class", "subsubtext");
    			attr_dev(a, "href", a_href_value = "/profile/" + /*playervalue*/ ctx[0] + "/" + /*profileidfetch*/ ctx[1].selected_value);
    			add_location(a, file, 84, 0, 2310);
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
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profileidfetch*/ 2) {
    				each_value = /*profileidfetch*/ ctx[1].profilelist;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(76:0) {#if profileidfetch.success !== false}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#each profileidfetch.profilelist as profilelist}
    function create_each_block(ctx) {
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
    			add_location(option, file, 80, 8, 2211);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(80:4) {#each profileidfetch.profilelist as profilelist}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
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
    		if (/*profileidfetch*/ ctx[1].success !== false) return create_if_block;
    		if (/*profileidfetch*/ ctx[1].success !== true) return create_if_block_1;
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
    			add_location(input, file, 72, 0, 1777);
    			attr_dev(button, "class", "showme subsubtext hoverinput maincolor");
    			add_location(button, file, 73, 0, 1908);
    			attr_dev(div0, "class", "tablestyle svelte-mavmgu");
    			add_location(div0, file, 71, 0, 1752);
    			add_location(br, file, 88, 0, 2518);
    			attr_dev(div1, "class", "back-bg svelte-mavmgu");
    			add_location(div1, file, 89, 0, 2523);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Profile> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$1.name
    		});
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
