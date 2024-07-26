class ComponentPreviewElement extends HTMLElement {
  #shadowRoot;
  #cachedSrc;
  #observer;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    this.#cachedSrc = {};
    // @ts-ignore
    this.#shadowRoot.dataset = this.dataset;
    this.#observer = new MutationObserver((c) => {
      let changed = false;
      for (const cc of c) {
        let name = cc.attributeName;
        if (!name) continue;
        if (name == "schema" || name.startsWith('data-')) {
          changed = true;
          break;
        }
      }

      if (changed) {
        this.#shadowRoot.innerHTML = this.getAttribute('schema') || '';
        requestAnimationFrame(() => this.#processScripts());
      }
    });
  }

  connectedCallback() {
    this.#shadowRoot.innerHTML = this.getAttribute('schema') || '';
    requestAnimationFrame(() => this.#processScripts());
    this.#observer.observe(this, { attributes: true });
  }

  disconnectedCallback() {
    this.#observer.disconnect();
  }

  adoptedCallback() {
    //
  }

  get #scripts() {
    return this.#shadowRoot.querySelectorAll('script');
  }

  #scopedEval = (script) =>
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

customElements.define("preview-component", ComponentPreviewElement);
