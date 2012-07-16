var layout = (function() {
  var current = null;

  var styles = {
    'full-30': {
      'float': 'left',
      'height': '100%',
      'width': '30%'
    },
    'full-40': {
      'float': 'left',
      'height': '100%',
      'width': '40%'
    },
    'full-50': {
      'float': 'left',
      'height': '100%',
      'width': '50%'
    },
    'full-60': {
      'float': 'left',
      'height': '100%',
      'width': '60%'
    },
    'half-40': {
      'float': 'left',
      'height': '50%',
      'width': '40%'
    },
    'half-50': {
      'float': 'left',
      'height': '50%',
      'width': '50%'
    },
  };

  var definitions = {
    'half': [
      styles['full-50'],
      styles['full-50']
    ],
    'third': [
      styles['full-40'],
      styles['full-30'],
      styles['full-30']
    ],
    'quarter': [
      styles['half-50'],
      styles['half-50'],
      styles['half-50'],
      styles['half-50']
    ],
    'sixty_forty': [
      styles['full-60'],
      styles['full-40']
    ],
    'major_minor_tertiary': [
      styles['full-60'],
      styles['half-40'],
      styles['half-40']
    ]
  };

  var set_styles = function(selection, props, i) {
    for (var key in props) {
      selection.style(key, props[key]);
    }
  };

  var run_layout = function(selection, layout) {
    selection
      .style("display", function(d,i) {
        return i in layout ? null : 'none';
      })
      .filter(function(d,i) {
        return i in layout;
      })
      .each(function(d,i) {
        d3.select(this)
          .call(set_styles, layout[i]);  
      })
      ;
  };

  // cycle through primary window
  var cycle = function(class_name) {
    var class_name = class_name || '.pane';
    var actives = d3.selectAll(class_name)
      .filter(function() {
        return d3.select(this).style('display') != 'none';
      })
      .datum(function(d,i) {
        return i;
      });

    // put first element last
    actives.sort(function(a,b) {
      if (a == 0) return 1;
      return a - b;
    });

    layout(current, class_name);
  };

  var layout = function(layout_name, class_name) {
    var class_name = class_name || '.pane';
    d3.selectAll(class_name)
      .call(run_layout, definitions[layout_name])
  
    // save last layout
    current = key;
  };

  layout.styles = styles;
  layout.cycle = cycle;
  layout.definitions = {};
  layout.layouts = {};

  // expose layouts as functions on layout.layouts
  layout.define = function(key, styles) {
    layout.definitions[key] = styles;
    layout.layouts[key] = function(class_name) {
      var class_name = class_name || '.pane';
      layout(key, class_name);
    };
  };

  // expose pre-defined layouts as functions
  for (var key in definitions) {
    layout.define(key, definitions[key]);
  };

  return layout;
})();
