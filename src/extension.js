// @flow
import component, {state} from 'kompo';
const render = component.render
    ,react = component.react
    ,dispatch = state.dispatch
    ,slot = component.slot
    ,hasSlot = component.hasSlot
    ,getRouter  = component.getRouter;
import {capitalize, replace, addAttributes, isObject, remove, empty}  from 'kompo-util';

/**
 * DOM extension can be prefixed with arbitrary string
 *
 * @param {string} prefix
 */
export default function extension(prefix:string):void {
    // Prevent lookups
    const noPrefix:boolean = typeof prefix === 'undefined',
        doc:Document = document,
        ElementPrototype:Element = Element.prototype,
        FragPrototype:DocumentFragment = DocumentFragment.prototype;

    /**
     * Returns (prefixed) methodName
     *
     * @param methodName
     * @returns {string}
     */
    function addPrefix(methodName:string):string {
        if (noPrefix) {
            return methodName;
        }

        return prefix + capitalize(methodName);
    }

    /**
     * @see render() @ github.com/rubenhazelaar/kompo/src/component/component.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('render'), {
        value: function ():void {
            render(this);
        }
    });

    /**
     * @see react() @ github.com/rubenhazelaar/kompo/src/component/component.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('react'), {
        value: function (statefull:statefull):void {
            react(this, statefull);
        }
    });

    /**
     * @see dispatch() @ github.com/rubenhazelaar/kompo/src/state/dispatch.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('dispatch'), {
        value: function (cb:(state:state)=>void):void {
            dispatch(this,cb);
        }
    });

    /**
     * @see slot() @ github.com/rubenhazelaar/kompo/src/component/component.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('slot'), {
        value: function (name:string, cb:slotCallback):void {
            slot(this, name, cb);
        }
    });

    /**
     * @see hasSlot() @ github.com/rubenhazelaar/kompo/src/component/component.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('slot'), {
        value: function (name:string,):boolean {
            return hasSlot(this, name);
        }
    });

    /**
     * @see getRouter() @ github.com/rubenhazelaar/kompo/src/component/component.js 
     */
    Object.defineProperty(ElementPrototype, addPrefix('getRouter'), {
        value: function ():router {
            return getRouter(this);
        }
    });

    /**
     * Syntactic sugar for getting/setting a attribute.
     *
     * @param {string} name
     * @param {*} value
     * @returns {string|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('attr'), {
        value: function (name:string, value:any):string | Element {
            if (arguments.length === 1) {
                return this.getAttribute(name);
            } else {
                this.setAttribute(name, value);
                return this;
            }
        }
    });

    /**
     * Syntactic sugar for checking if an attribute exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    Object.defineProperty(ElementPrototype, addPrefix('hasAttr'), {
        value: function (name:string):boolean {
            return this.hasAttribute(name);
        }
    });

    /**
     * Syntactic sugar for removing an attribute.
     *
     * @param {string} name
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('removeAttr'), {
        value: function (name:string):Element {
            this.removeAttribute(name);
            return this;
        }
    });

    /**
     * Syntactic sugar for getting or setting a TextNode.
     *
     * @param {string} txt
     * @returns {Element|Text}
     */
    Object.defineProperty(ElementPrototype, addPrefix('txt'), {
        value: function (txt:string):Element | string {
            if (arguments.length === 1) {
                this.textContent = txt;
                return this;
            } else {
                return this.textContent;
            }
        }
    });

    /**
     * Syntactic sugar for appending an Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    const appendFnName = addPrefix('append'),
        appendFn = function (child:KompoElement, chain:boolean | attributes = true, ch:boolean = true):Element {
            if (typeof child === 'string') {
                child = doc.createElement(child);
            }

            this.appendChild(child);

            if (isObject(arguments[1])) {
                addAttributes(child, chain);
                return ch ? child : this;
            } else {
                return chain ? child : this;
            }

        };
    Object.defineProperty(ElementPrototype, appendFnName, {value: appendFn});
    Object.defineProperty(FragPrototype, appendFnName, {value: appendFn});

    /**
     * Syntactic sugar for appending an Element
     * on the parent of current Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('parentAppend'), {
        value: function (child:KompoElement, chain:boolean | attributes = true, ch:boolean = true):Element {
            return this.parentNode.append(child, chain, ch);
        }
    });

    /**
     * Syntactic sugar for appending an cloned Element
     * to its parent.
     *
     * BEWARE: It does not copy event listeners
     * BEWARE: deep option can have serious performance implications
     *
     * @param {boolean} deep = deep copy or not
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('cloneAppend'), {
        value: function (deep:boolean = false):Element {
            return this.parentNode.append(this.cloneNode(deep));
        }
    });

    /**
     * Syntactic sugar for cloning an Element
     *
     * BEWARE: It does not copy event listeners
     * BEWARE: deep option can have serious performance implications
     *
     * @param {boolean} deep = deep copy or not
     * @returns {Element}
     */
    const cloneFnName = addPrefix('clone'),
        cloneFn = function (deep:boolean = false):Element {
            return this.cloneNode(deep);
        };
    Object.defineProperty(ElementPrototype, cloneFnName, {value: cloneFn});
    Object.defineProperty(FragPrototype, cloneFnName, {value: cloneFn});

    /**
     * Syntactic sugar for prepending an Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    const prependFnName = addPrefix('prepend'),
        prependFn = function (child:KompoElement, chain:boolean | attributes = true, ch:boolean = true):Element {
            let firstChild = this.firstChild;

            if (typeof child === 'string') {
                child = doc.createElement(child);
            }

            if (firstChild) {
                this.insertBefore(child, firstChild);
            } else {
                this.append(child)
            }

            if (isObject(arguments[1])) {
                addAttributes(child, chain);
                return ch ? child : this;
            } else {
                return chain ? child : this;
            }

        };
    Object.defineProperty(ElementPrototype, prependFnName, {value: prependFn});
    Object.defineProperty(FragPrototype, prependFnName, {value: prependFn});

    /**
     * Syntactic sugar for getting the parent Element.
     *
     * @returns {Element|Node}
     */
    Object.defineProperty(ElementPrototype, addPrefix('parent'), {
        value: function ():Element | Node {
            return this.parentElement || this.parentNode;
        }
    });

    /**
     * Syntactic sugar for checking if the Element
     * has a parent.
     *
     * @returns {boolean}
     */
    Object.defineProperty(ElementPrototype, addPrefix('hasParent'), {
        value: function ():boolean {
            return !(this.parentElement === null && this.parentNode === null);
        }
    });

    /**
     * Recurse to the root Element (which has no parent)
     *
     * @returns {Element|Node}
     */
    Object.defineProperty(ElementPrototype, addPrefix('root'), {
        value: function (parent:?Element | Node):Element | Node {
            parent = !parent ?
            this.parentElement || this.parentNode :
                parent;

            while ((parent.parentElement || parent.parentNode) !== null) {
                parent = this.root(parent.parentElement || parent.parentNode);
            }

            return parent;
        }
    });

    /**
     * Syntactic sugar/polyfill for Element.remove()
     */
    if (!('remove' in ElementPrototype)) {
        Object.defineProperty(ElementPrototype, addPrefix('remove'), {
            value: function ():void {
                remove(this);
            }
        });
    }

    /**
     * Syntactic sugar for removing all child Elements|Nodes
     *
     * @returns {Node}
     */
    const emptyFnName = addPrefix('empty'),
        emptyFn = function ():Node {
            return empty(this);
        };
    Object.defineProperty(ElementPrototype, emptyFnName, {value: emptyFn});
    Object.defineProperty(FragPrototype, emptyFnName, {value: emptyFn});

    /**
     * Syntactic sugar for logging
     *
     * When chain methods it can be used to log an Element
     * right in the middle of the chain.
     *
     * @returns {Node}
     */
    Object.defineProperty(ElementPrototype, addPrefix('log'), {
        value: function ():Node {
            console.log(this);
            return this;
        }
    });

    /**
     * @see ./replace.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('replace'), {
        value: function (child:KompoElement, replaceLastChild:boolean = false):Node {
            return replace(this, child, replaceLastChild);
        }
    });

    /**
     * Syntactic sugar for replacing the
     * current Element with a new one.
     *
     * BEWARE: a parent Element must exist
     *
     * @returns {Node} - return the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('replaceWith'), {
        value: function (newElement:KompoElement, attributes:?attributes):Node {
            if (typeof newElement === 'string') {
                newElement = doc.createElement(newElement);
            }

            if (typeof attributes !== 'undefined') {
                addAttributes(newElement, attributes);
            }

            this.parentNode.replaceChild(this, newElement);
            return newElement;
        }
    });

    /**
     * Syntactic sugar for inserting an Element
     * before another Element
     *
     * BEWARE: a parenNode needs to be available
     *
     * @returns {Node} - the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('before'), {
        value: function (newSibling:KompoElement, attributes:?attributes):Node {
            let parentNode:Node = this.parentNode;

            if (typeof newSibling === 'string') {
                newSibling = doc.createElement(newSibling);
            }

            if (typeof attributes !== 'undefined') {
                addAttributes(newSibling, attributes);
            }

            if (parentNode) {
                parentNode.insertBefore(newSibling, this);
            }
            return newSibling;
        }
    });

    /**
     * Syntactic sugar for inserting an Element
     * after another Element
     *
     * BEWARE: a parenNode needs to be available
     *
     * @returns {Node} - the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('after'), {
        value: function (newSibling:KompoElement, attributes:attributes):Node {
            let parentNode:Node = this.parentNode,
                nextSibling:Node = this.nextSibling;

            if (typeof newSibling === 'string') {
                newSibling = doc.createElement(newSibling);
            }

            if (typeof attributes !== 'undefined') {
                addAttributes(newSibling, attributes);
            }

            if (parentNode) {
                if (nextSibling) {
                    parentNode.insertBefore(newSibling, nextSibling);
                } else {
                    parentNode.appendChild(newSibling);
                }
            }

            return newSibling;
        }
    });
}