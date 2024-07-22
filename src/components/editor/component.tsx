import { useEffect, useMemo } from "react";
import { parse } from "yaml";

const HTMLElementShim: any = typeof HTMLElement === 'undefined' ? Object : HTMLElement;

const CustomElementsShim: any = typeof CustomElementRegistry === 'undefined' ? null : customElements;

export class ComponentPreviewElement extends HTMLElementShim {
    #shadowRoot: ShadowRoot;
    #cachedSrc: Record<string, string>;
    #observer: MutationObserver;

    constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#cachedSrc = {};
        // @ts-ignore
        this.#shadowRoot.dataset = this.dataset;
        this.#observer = new MutationObserver(() => {
            this.#shadowRoot.innerHTML = this.getAttribute('schema') || '';
            requestAnimationFrame(() => this.#processScripts());
        });

    }

    connectedCallback() {
        // @ts-ignore
        this.#observer.observe(this, { attributes: true });
        this.#shadowRoot.innerHTML = this.getAttribute('schema') || '';
        requestAnimationFrame(() => this.#processScripts());
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
        for (const s of scripts) {
            if (!s.src) {
                this.#scopedEval(s.innerHTML);
                continue;
            }
            if (this.#cachedSrc[s.src]) {
                continue;
            }
            try {
                let a = await fetch(s.src);
                let b = await a.text();
                this.#scopedEval(b);
                this.#cachedSrc[s.src] = b;
            } catch (error) {
                console.error(error);
            }
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
