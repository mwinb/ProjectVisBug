import $ from 'blingblingjs'

export class Handles extends HTMLElement {

  constructor() {
    super()
    this.$shadow = this.attachShadow({mode: 'closed'})
  }

  connectedCallback() {
    window.addEventListener('resize', this.on_resize.bind(this))
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.on_resize)
  }

  on_resize() {
    window.requestAnimationFrame(() => {
      const node_label_id = this.$shadow.host.getAttribute('data-label-id')
      const [source_el] = $(`[data-label-id="${node_label_id}"]`)

      if (!source_el) return

      this.position = {
        node_label_id,
        el: source_el,
      }
    })
  }

  set position({el, node_label_id}) {
    this.$shadow.innerHTML = this.render(el.getBoundingClientRect(), node_label_id)

    if (this._backdrop) {
      this.backdrop = {
        element: this._backdrop.update(el),
        update:  this._backdrop.update,
      }
    }
  }

  set backdrop(bd) {
    this._backdrop = bd

    const cur_child = this.$shadow.querySelector('visbug-boxmodel')

    cur_child
      ? this.$shadow.replaceChild(bd.element, cur_child)
      : this.$shadow.appendChild(bd.element)
  }

  render({ x, y, width, height, top, left }, node_label_id) {
    this.$shadow.host.setAttribute('data-label-id', node_label_id)
    
    return `
      ${this.styles({top,left})}
      <svg
        class="visbug-handles"
        width="${width}" height="${height}"
        viewBox="0 0 ${width} ${height}"
        version="1.1" xmlns="http://www.w3.org/2000/svg"
      >
        <rect stroke="hotpink" fill="none" width="100%" height="100%"></rect>
        <circle stroke="hotpink" fill="white" cx="0" cy="0" r="2"></circle>
        <circle stroke="hotpink" fill="white" cx="100%" cy="0" r="2"></circle>
        <circle stroke="hotpink" fill="white" cx="100%" cy="100%" r="2"></circle>
        <circle stroke="hotpink" fill="white" cx="0" cy="100%" r="2"></circle>
        <circle fill="hotpink" cx="${width/2}" cy="0" r="2"></circle>
        <circle fill="hotpink" cx="0" cy="${height/2}" r="2"></circle>
        <circle fill="hotpink" cx="${width/2}" cy="${height}" r="2"></circle>
        <circle fill="hotpink" cx="${width}" cy="${height/2}" r="2"></circle>
      </svg>
    `
  }

  styles({top,left}) {
    return `
      <style>
        :host > svg {
          position: absolute;
          top: ${top + window.scrollY}px;
          left: ${left}px;
          overflow: visible;
          pointer-events: none;
          z-index: 2147483644;
        }
      </style>
    `
  }
}

customElements.define('visbug-handles', Handles)
