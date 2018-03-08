import { QResizeObservable } from '../observables'

export default {
  name: 'QLayoutHeader',
  inject: {
    layout: {
      default () {
        console.error('QLayoutHeader needs to be child of QLayout')
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    revealOffset: {
      type: Number,
      default: 250
    }
  },
  data () {
    return {
      size: 0,
      revealed: true
    }
  },
  watch: {
    value (val) {
      this.__update('space', val)
      this.__updateLocal('revealed', true)
      this.layout.__animate()
    },
    offset (val) {
      this.__update('offset', val)
    },
    reveal (val) {
      if (!val) {
        this.__updateLocal('revealed', this.value)
      }
    },
    revealed (val) {
      this.layout.__animate()
      this.$emit('reveal', val)
    },
    'layout.scroll' (scroll) {
      if (!this.reveal) {
        return
      }
      this.__updateLocal('revealed',
        scroll.direction === 'up' ||
        scroll.position <= this.revealOffset ||
        scroll.position - scroll.inflexionPosition < 100
      )
    }
  },
  computed: {
    fixed () {
      return this.reveal || this.layout.view.indexOf('H') > -1
    },
    offset () {
      if (!this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      const offset = this.size - this.layout.scroll.position
      return offset > 0 ? offset : 0
    },
    computedClass () {
      return {
        'fixed-top': this.fixed,
        'absolute-top': !this.fixed,
        'q-layout-header-hidden': !this.value || (this.fixed && !this.revealed)
      }
    },
    computedStyle () {
      const
        view = this.layout.rows.top,
        css = {}

      if (view[0] === 'l' && this.layout.left.space) {
        css[`margin${this.$q.i18n.rtl ? 'Right' : 'Left'}`] = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css[`margin${this.$q.i18n.rtl ? 'Left' : 'Right'}`] = `${this.layout.right.size}px`
      }

      return css
    }
  },
  render (h) {
    return h('header', {
      staticClass: 'q-layout-header q-layout-transition',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      this.$slots.default,
      h(QResizeObservable, {
        on: { resize: this.__onResize }
      })
    ])
  },
  created () {
    this.layout.instances.header = this
    this.__update('space', this.value)
  },
  beforeDestroy () {
    if (this.layout.instances.header === this) {
      this.layout.instances.header = null
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
  },
  methods: {
    __onResize ({ height }) {
      this.__updateLocal('size', height)
      this.__update('size', height)
    },
    __update (prop, val) {
      if (this.layout.header[prop] !== val) {
        this.layout.header[prop] = val
      }
    },
    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    }
  }
}
