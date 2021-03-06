CLASS({
  package: 'foam.u2',
  name: 'Element',

  constants: {
    INITIAL: {
      output: function(out) {
        out('<', this.nodeName);
        if ( this.id ) out(' id="', this.id, '"');

        for ( key in this.attributeMap ) {
          var value = this.attributeMap[key];

          out(' ', key);
          if ( value !== undefined )
            out('="', value, '"');
        }
        if ( ! this.ILLEGAL_CLOSE_TAGS[this.nodeName] &&
             ( ! this.OPTIONAL_CLOSE_TAGS[this.nodeName] || this.childNodes.length ) ) {
          out('>');
          this.outputInnerHTML(out);
          out('</', this.nodeName);
        }
        out('>');

        this.state = this.OUTPUT;

        return out;
      },
      load:          function() { console.error('Must output before loading.'); },
      unload:        function() { console.error('Must output and load before unloading.');},
      destroy:       function() { },
      onAddCls:      function() { },
      onAddListener: function() { },
      onSetStyle:    function() { },
      onSetAttr:     function() { },
      toString:      function() { return 'INITIAL'; }
    },
    OUTPUT: {
      output:        function(out) {
        // Only warn because it could be useful for debugging.
        console.error('Duplicate output.');
        return this.INITIAL.output.call(this, out);
      },
      load:          function() {
        this.state = this.LOADED;
      },
      unload:        function() { console.error('Must load before unloading.'); },
      destroy:       function() { },
      onAddCls:      function() { },
      onAddListener: function(topic, listener) {
        this.id$el.addEventListener(topic, listener);
      },
      onSetStyle:    function(key, value) {
        this.id$el.style[key] = value;
      },
      onSetAttr:     function(key, value) {
        this.id$el[key] = value;
      },
      toString:      function() { return 'OUTPUT'; }
    },
    LOADED: {
      output:        function(out) { console.warn('Duplicate output.'); },
      load:          function() { console.error('Duplicate load.'); },
      unload:        function() {
        this.state = this.UNLOADED;
      },
      destroy:       function() { },
      onAddCls:      function() { },
      onAddListener: function(topic, listener) {
        this.id$el.addEventListener(topic, listener);
      },
      onSetStyle:    function() { },
      onSetAttr:     function(key, value) {
        this.id$el[key] = value;
      },
      toString:      function() { return 'LOADED'; }
    },
    UNLOADED: {
      output:        function() { },
      load:          function() {
        this.state = this.LOADED;
      },
      unload:        function() { },
      destroy:       function() { },
      onAddCls:      function() { },
      onAddListener: function() { },
      onSetStyle:    function() { },
      onSetAttr:     function() { },
      toString:      function() { return 'UNLOADED'; }
    },
    DESTROYED: { // Needed?
      output:        function() { },
      load:          function() { },
      unload:        function() { },
      destroy:       function() { },
      onAddCls:      function() { },
      onAddListener: function() { },
      onSetStyle:    function() { },
      onSetAttr:     function() { },
      toString:      function() { return 'DESTROYED'; }
    },

    OPTIONAL_CLOSE_TAGS: {
      HTML: true,
      HEAD: true,
      BODY: true,
      P: true,
      DT: true,
      DD: true,
      LI: true,
      OPTION: true,
      THEAD: true,
      TH: true,
      TBODY: true,
      TR: true,
      TD: true,
      TFOOT: true,
      COLGROUP: true
    },
    ILLEGAL_CLOSE_TAGS: {
      IMG: true,
      INPUT: true,
      BR: true,
      HR: true,
      FRAME: true,
      AREA: true,
      BASE: true,
      BASEFONT: true,
      COL: true,
      ISINDEX: true,
      LINK: true,
      META: true,
      PARAM: true
    }
  },

  properties: [
    {
      name: 'state',
      factory: function () { return this.INITIAL; }
    },
    {
      model_: 'foam.u2.EIDProperty',
      name: 'id'
    },
    {
      name: 'nodeName'/*,
      preSet: function(_, v) {
        return v.toLowerCase();
      }*/
    },
    {
      name: 'attributeMap',
      transient: true,
      factory: function() { return {}; }
    },
    {
      name: 'attributes',
      factory: function() { return []; },
      postSet: function(_, attrs) {
        for ( var i = 0 ; i < attrs.length ; i++ )
          this.attributeMap[attrs[i].name] = attrs[i];
      }
    },
    {
      name: 'css',
      factory: function() { return []; }
    },
    {
      name: 'childNodes',
      factory: function() { return []; }
    },
    {
      name: 'elListeners',
      factory: function() { return []; }
    },
    {
      name: 'children',
      transient: true,
      getter: function() {
        return this.childNodes.filter(function(c) { return typeof c !== 'string'; });
      }
    },
    {
      name: 'outerHTML',
      transient: true,
      getter: function() { return this.output(this.createOutputStream()); }
    },
    {
      name: 'innerHTML',
      transient: true,
      getter: function() { return this.outputInnerHTML(this.createOutputStream()); }
    }
  ],

  methods: [

    // State

    function onSetAttr(key, value) {
      this.state.onSetAttr.call(this, key, value);
    },

    function onAddListener(topic, listener) {
      this.state.onAddListener.call(this, topic, listener);
    },

    function onSetStyle(key, value) {
      this.state.onSetStyle.call(this, key, value);
    },

    //
    // Lifecycle
    //
    function load() { this.state.load.call(this); },

    function unload() { this.state.unload.call(this); },

    function destroy() { this.state.destroy.call(this); },

    //
    // DOM Compatibility
    //
    function setAttribute(name, value) {
      var attr = this.getAttributeNode(name);

      if ( attr ) {
        attr.value = value;
      } else {
        attr = {name: name, value: value};
        this.attributes.push(attr);
        this.attributeMap[name] = attr;
      }
    },

    function getAttributeNode(name) { return this.attributeMap[name]; },

    function getAttribute(name) {
      var attr = this.getAttributeNode(name);
      return attr && attr.value;
    },

    function appendChild(c) { this.childNodes.push(c); },

    function removeChild(c) {
      for ( var i = 0; i < this.childNodes.length; ++i ) {
        if ( this.childNodes[i] === c ) {
          this.childNodes.splice(i, 1);
          break;
        }
      }
    },

    //
    // Fluent Methods
    //
    function on(topic, listener) {
      this.elListeners.push([topic, listener]);
      this.onAddListener(topic, listener);
      return this;
    },

    function cls(cls) {
      this.classes[cls] = true;
      return this;
    },

    function attr(key, value) {
      this.attributeMap[key] = value;
      this.onSetAttr(key, value);
      return this;
    },

    function attrs(map) {
      for ( key in map ) this.attr(key, map[key]);
      return this;
    },

    function style(key, value) {
      this.css.push([key, value]);
      this.onSetStyle(key, value);
      return this;
    },

    function styles(map) {
      for ( key in map ) this.style(key, map[key]);
      return this;
    },

    function c() {
      this.childNodes.push.apply(this.childNodes, arguments);
      return this;
    },

    //
    // Output Methods
    //
    function output(out) { return this.state.output.call(this, out); },

    function outputInnerHTML(out) {
      for ( var i = 0 ; i < this.childNodes.length ; i++ )
        out(this.childNodes[i]/*.toString()*/);
      return out;
    },

    function createOutputStream() {
      var self = this;
      var buf = [];
      var f = function templateOut(/* arguments */) {
        for ( var i = 0 ; i < arguments.length ; i++ ) {
          var o = arguments[i];
          if ( typeof o === 'string' ) {
            buf.push(o);
          } else {
            if ( o && o.toView_ ) o = o.toView_();
            if ( ! ( o === null || o === undefined ) ) {
              if ( o.output ) {
                o.output(f);
              } else if ( o.toHTML ) {
                buf.push(o.toHTML());
              } else {
                buf.push(o);
              }
              if ( o.initHTML && self && obj.addChild ) self.addChild(o);
            }
          }
        }
      };

      f.toString = function() {
        if ( buf.length === 0 ) return '';
        if ( buf.length > 1 ) buf = [buf.join('')];
        return buf[0];
      }

      return f;
    },

    function write(document) {
      /* For debugging, not production. */
      document.writeln(this.outerHTML);
    },

    function toString() { return this.outerHTML; }
  ]
});


function E(opt_nodeName) {
  var e = foam.u2.Element.create();
  if ( opt_nodeName ) e.nodeName = opt_nodeName;
  return e;
}

/*
  TODO: compile, deepClone, pass data, don't clone if literal
*/
