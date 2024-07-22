import { useEffect, useMemo } from "react";
import { parse } from "yaml";

const HTMLElementShim: any = typeof HTMLElement === 'undefined' ? Object : HTMLElement;

const CustomElementsShim: any = typeof CustomElementRegistry === 'undefined' ? null : customElements;

export class ComponentPreviewElement extends HTMLElementShim {
    static observedAttributes = ["schema"];
    #shadowRoot: ShadowRoot;
    #cachedSrc: Record<string, string>;
    #observer: MutationObserver;
    #dataset: Record<string, string | null>;

    constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#cachedSrc = {};
        this.#dataset = {};
        // @ts-ignore
        this.#shadowRoot.dataset = this.#dataset;
        this.#observer = new MutationObserver((mutationRecords) => {
            let dataChanged = false;
            mutationRecords.forEach(record => {
                let attr = record.attributeName;
                if (attr && attr.startsWith('data-')) {
                    this.#dataset[attr.substring(5)] = this.getAttribute(attr);
                    dataChanged = true;
                }
            });
            if (dataChanged) {
                console.log(this.#dataset);
                requestAnimationFrame(() => this.#processScripts());
            }
        });

    }

    connectedCallback() {
        this.#observer.observe(this, { attributes: true });
    }

    disconnectedCallback() {
        this.#observer.disconnect();
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    get #scripts() {
        return this.#shadowRoot.querySelectorAll('script');
    }

    #scopedEval = (script: string) =>
        Function(script).bind(this.#shadowRoot)();

    async #processScripts() {
        let scripts = this.#scripts;
        console.log(scripts);
        for (const s of scripts) {
            if (s.src) {
                if (!this.#cachedSrc[s.src]) {
                    try {
                        let a = await fetch(s.src);
                        let b = await a.text();
                        this.#scopedEval(b);
                        this.#cachedSrc[s.src] = b;
                    } catch (error) {
                        console.error(error);
                    }
                }
            } else {
                this.#scopedEval(s.innerHTML);
            }
        }
    }

    attributeChangedCallback(name: any, oldValue: any, newValue: any) {
        if (name == 'schema') {
            this.#shadowRoot.innerHTML = newValue;
            requestAnimationFrame(() => this.#processScripts());
        }
    }
}


export function ComponentPreview({ schema, config }: any) {
    let dataConf = useMemo(() => {
        try {
            if (!config) return {};
            let parsedConf = parse(config) || {};
            if (!parsedConf['mock'] || typeof parsedConf['mock'] !== 'object') return {};
            return Object.entries(parsedConf['mock']).reduce((o: Record<string, string>, [k, v]) => {
                o['data-' + k] = ['array', 'object'].includes(typeof v) ? JSON.stringify(v) : v + '';
                return o;
            }, {})
        } catch (error) {
            console.error(error);
            return {};
        }
    }, [config])

    let ElemName = 'preview-component';
    useEffect(() => {
        if (CustomElementsShim && !CustomElementsShim.get(ElemName))
            CustomElementsShim.define(ElemName, ComponentPreviewElement);
    }, [ElemName])

    // @ts-ignore
    return <ElemName schema={schema} {...dataConf}></ElemName>
}

export function ComponentRender({ component, data }: any) {
    if (!component || !component.identifier) return <div></div>

    let dataConf = useMemo(() => {
        try {
            if (!data) return {};
            return data.reduce((o: Record<string, string>, { key, value }: any) => {
                o['data-' + key] = ['array', 'object'].includes(typeof value) ? JSON.stringify(value) : value + '';
                return o;
            }, {})
        } catch (error) {
            console.error(error);
            return {};
        }
    }, [data])

    let ElemName = 'preview-component';
    useEffect(() => {
        if (CustomElementsShim && !CustomElementsShim.get(ElemName))
            CustomElementsShim.define(ElemName, ComponentPreviewElement);
    }, [ElemName])

    // @ts-ignore
    return <ElemName schema={component.schema} {...dataConf}></ElemName>
}
