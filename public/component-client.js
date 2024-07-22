class ComponentPreviewElement extends HTMLElement {
  #shadowRoot;
  #cachedSrc;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    this.#cachedSrc = {};
    // @ts-ignore
    this.#shadowRoot.dataset = this.dataset;
  }

  connectedCallback() {
    this.#shadowRoot.innerHTML = this.getAttribute('schema') || '';
    requestAnimationFrame(() => this.#processScripts());
  }

  disconnectedCallback() {
    //
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
