/**
 * Factory returns function for registering components.
 *
 * Register function Usage:
 *     register({
 *         signal,
 *         [initialStatus],
 *         data,
 *         [init],
 *         [onClick],
 *         handler: {
 *             [status],
 *             [mouseDown],
 *             [mouseMove],
 *             [mouseUp]
 *         }
 *     })
 *
 * Utils:
 *     this.bindKey() can only be used in init method.
 *     this.$store
 **/

import Mousetrap from 'mousetrap';

export default class {
    constructor(mainCanvas) {
        this.component = mainCanvas;
        this.registerIssues = new Map();
        this.currentIssue = null;
        this.componentInterface = {
            signalEmit: (function(signal) {
                if (this.currentIssue) {
                    for (let x of this.currentIssue.bindKeys)
                        Mousetrap.unbind(x.key, x.event);
                }
                this.currentIssue = this.registerIssues.get(signal);
                if (this.currentIssue) {
                    for (let x of this.currentIssue.bindKeys)
                        Mousetrap.bind(x.key, x.func, x.event);
                    if (this.currentIssue.initialStatus != undefined)
                        this.currentIssue.context.status = this.currentIssue.initialStatus;
                    else
                        this.currentIssue.context.status = null;
                    if (this.currentIssue.onClick)
                        this.currentIssue.onClick();
                }
            }).bind(this),
            on: (function(type, e) {
                if (this.currentIssue) {
                    try {
                        this.currentIssue.handler.get(this.currentIssue.context.status)[type](e);
                    }
                    catch(err) {
                        var handler = this.currentIssue.defaultHandler[type];
                        if (handler) handler(e);
                    }
                }
            }).bind(this)
        };

        this.register = (function(o) {
            if (!o.signal)
                return;
            var currentIssue = {};
            currentIssue.bindKeys = [];
            var context = {
                $bindKey: function(key, func, event) {
                    currentIssue.bindKeys.push({ key: key, func: func, event: event });
                },
                $store: this.component.$store,
                status: null
            };
            if (o.data)
                for (let x in o.data)
                    context[x] = o.data[x];
            currentIssue.context = context;
            currentIssue.initialStatus = o.initialStatus;
            if (o.init)
                o.init.call(context);
            if (o.onClick)
                currentIssue.onClick = o.onClick.bind(context);
            currentIssue.handler = new Map();
            currentIssue.defaultHandler = null;
            for (let x of o.handler) {
                let curHandler = {};
                if (x.mouseDown)
                    curHandler.mouseDown = x.mouseDown.bind(context);
                if (x.mouseMove)
                    curHandler.mouseMove = x.mouseMove.bind(context);
                if (x.mouseUp)
                    curHandler.mouseUp = x.mouseUp.bind(context);
                if (x.status)
                    currentIssue.handler.set(x.status, curHandler);
                else
                    currentIssue.defaultHandler = curHandler;
            }
            this.registerIssues.set(o.signal, currentIssue);
        }).bind(this);
    }
}
