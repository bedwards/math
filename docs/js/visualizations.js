(function () {
  'use strict';

  /* ================================================================
     Visualization Engine — 10 interactive visualizations, lazy-loaded
     ================================================================ */

  // Helper: get CSS variable value
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Helper: setup canvas with proper DPI
  function setupCanvas(canvas, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  }

  // Helper: get theme-aware colors
  function colors() {
    var dark = document.documentElement.dataset.theme === 'dark';
    return {
      bg: dark ? '#1c1c1a' : '#f0efe9',
      text: dark ? '#e8e8e0' : '#1a1a1a',
      muted: dark ? '#707068' : '#7a7a7a',
      line: dark ? '#333330' : '#d4d0c8',
      accent: dark ? '#60a5fa' : '#2563eb',
      green: dark ? '#4ade80' : '#16a34a',
      amber: dark ? '#fbbf24' : '#d97706',
      rose: dark ? '#fb7185' : '#e11d48',
      violet: dark ? '#a78bfa' : '#7c3aed',
      teal: dark ? '#2dd4bf' : '#0d9488',
      indigo: dark ? '#818cf8' : '#4f46e5',
      orange: dark ? '#fb923c' : '#ea580c',
      cyan: dark ? '#22d3ee' : '#0891b2',
      slate: dark ? '#94a3b8' : '#475569',
      gold: dark ? '#f59e0b' : '#b45309'
    };
  }

  // Observe theme changes and redraw
  var activeVizzes = [];
  var themeObserver = new MutationObserver(function () {
    activeVizzes.forEach(function (v) { if (v.draw) v.draw(); });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---- Lazy Loader ---- */
  var VizLoader = {
    loaded: {},
    init: function () {
      var self = this;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            if (!self.loaded[id]) {
              self.loaded[id] = true;
              self.load(id);
            }
          }
        });
      }, { rootMargin: '300px' });
      document.querySelectorAll('.visualization-container').forEach(function (c) {
        observer.observe(c);
      });
    },
    load: function (id) {
      var vizMap = {
        'viz-sets': SetsViz,
        'viz-naturals': NaturalsViz,
        'viz-groups': GroupsViz,
        'viz-order': OrderViz,
        'viz-topology': TopologyViz,
        'viz-fields': FieldsViz,
        'viz-vectors': VectorsViz,
        'viz-metric': MetricViz,
        'viz-probability': ProbabilityViz,
        'viz-category': CategoryViz
      };
      if (vizMap[id]) {
        vizMap[id].init();
        activeVizzes.push(vizMap[id]);
      }
    }
  };

  /* ================================================================
     1. Sets — Interactive Venn Diagram
     ================================================================ */
  var SetsViz = {
    init: function () {
      var container = document.querySelector('#viz-sets .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 360;
      this.ctx = setupCanvas(canvas, this.w, this.h);

      // Two sets: positions
      this.setA = { x: 220, y: 180, r: 110, label: 'A' };
      this.setB = { x: 370, y: 180, r: 110, label: 'B' };
      this.dragging = null;
      this.mode = 'union';

      var self = this;
      canvas.addEventListener('mousedown', function (e) { self.onDown(e); });
      canvas.addEventListener('mousemove', function (e) { self.onMove(e); });
      canvas.addEventListener('mouseup', function () { self.dragging = null; });
      canvas.addEventListener('mouseleave', function () { self.dragging = null; });
      // Touch
      canvas.addEventListener('touchstart', function (e) { e.preventDefault(); self.onDown(e.touches[0]); }, { passive: false });
      canvas.addEventListener('touchmove', function (e) { e.preventDefault(); self.onMove(e.touches[0]); }, { passive: false });
      canvas.addEventListener('touchend', function () { self.dragging = null; });

      // Buttons
      var controls = document.querySelector('#viz-sets .viz-controls');
      if (controls) {
        controls.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            controls.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            self.mode = btn.dataset.mode;
            self.draw();
          });
        });
      }

      this.draw();
    },
    getPos: function (e) {
      var r = this.canvas.getBoundingClientRect();
      var sx = this.w / r.width;
      return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * (this.h / r.height) };
    },
    onDown: function (e) {
      var p = this.getPos(e);
      var dA = Math.hypot(p.x - this.setA.x, p.y - this.setA.y);
      var dB = Math.hypot(p.x - this.setB.x, p.y - this.setB.y);
      if (dA < this.setA.r) this.dragging = this.setA;
      else if (dB < this.setB.r) this.dragging = this.setB;
    },
    onMove: function (e) {
      if (!this.dragging) return;
      var p = this.getPos(e);
      this.dragging.x = Math.max(this.dragging.r, Math.min(this.w - this.dragging.r, p.x));
      this.dragging.y = Math.max(this.dragging.r, Math.min(this.h - this.dragging.r, p.y));
      this.draw();
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var A = this.setA, B = this.setB;
      var mode = this.mode;

      // Draw based on mode
      ctx.globalAlpha = 0.18;
      if (mode === 'union' || mode === 'a-only') {
        ctx.fillStyle = c.accent;
        ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, Math.PI * 2); ctx.fill();
      }
      if (mode === 'union' || mode === 'b-only') {
        ctx.fillStyle = c.green;
        ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.fill();
      }
      if (mode === 'intersection') {
        // Clip intersection
        ctx.save();
        ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = c.violet;
        ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      if (mode === 'a-only') {
        // Darken intersection area to "remove" B
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // Redraw A lightly
        ctx.globalAlpha = 0.18;
        ctx.save();
        ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = c.accent;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        // Cut out B
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // Outlines
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = c.green;
      ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.stroke();

      // Labels
      ctx.font = '600 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = c.accent;
      ctx.fillText('A', A.x - A.r * 0.5, A.y - A.r * 0.5);
      ctx.fillStyle = c.green;
      ctx.fillText('B', B.x + B.r * 0.5, B.y - B.r * 0.5);

      // Mode label
      var labels = { union: 'A \u222A B', intersection: 'A \u2229 B', 'a-only': 'A \u2216 B', 'b-only': 'B' };
      ctx.fillStyle = c.text;
      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillText(labels[mode] || '', w / 2, 24);

      // Instruction
      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Drag the circles to move them', w / 2, h - 16);
    }
  };

  /* ================================================================
     2. Natural Numbers — Successor Machine
     ================================================================ */
  var NaturalsViz = {
    init: function () {
      var container = document.querySelector('#viz-naturals .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 280;
      this.ctx = setupCanvas(canvas, this.w, this.h);
      this.current = 0;
      this.animating = false;
      this.animProgress = 0;

      var self = this;
      var btn = document.querySelector('#viz-naturals .viz-controls button[data-action="successor"]');
      if (btn) btn.addEventListener('click', function () { self.successor(); });
      var resetBtn = document.querySelector('#viz-naturals .viz-controls button[data-action="reset"]');
      if (resetBtn) resetBtn.addEventListener('click', function () { self.current = 0; self.draw(); });

      this.draw();
    },
    successor: function () {
      if (this.animating) return;
      this.animating = true;
      this.animProgress = 0;
      var self = this;
      function step() {
        self.animProgress += 0.03;
        if (self.animProgress >= 1) {
          self.animProgress = 1;
          self.current++;
          self.animating = false;
          self.draw();
          return;
        }
        self.draw();
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var cy = h / 2;
      var spacing = 60;
      var startX = 60;
      var maxVisible = Math.floor((w - 120) / spacing);

      // Number line
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, cy);
      ctx.lineTo(w - 30, cy);
      ctx.stroke();
      // Arrow
      ctx.beginPath();
      ctx.moveTo(w - 30, cy);
      ctx.lineTo(w - 40, cy - 6);
      ctx.moveTo(w - 30, cy);
      ctx.lineTo(w - 40, cy + 6);
      ctx.stroke();

      // Numbers
      var viewStart = Math.max(0, this.current - Math.floor(maxVisible / 2));
      for (var i = 0; i <= maxVisible; i++) {
        var n = viewStart + i;
        var x = startX + i * spacing;
        // Tick
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, cy - 8);
        ctx.lineTo(x, cy + 8);
        ctx.stroke();
        // Label
        ctx.fillStyle = n === this.current ? c.green : c.muted;
        ctx.font = n === this.current ? '700 16px Inter, sans-serif' : '400 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(String(n), x, cy + 14);
      }

      // Current pointer
      var curIdx = this.current - viewStart;
      var curX = startX + curIdx * spacing;
      if (this.animating) {
        var ease = this.animProgress * this.animProgress * (3 - 2 * this.animProgress);
        curX += ease * spacing;
      }

      // Hop arc
      if (this.animating) {
        var fromX = startX + curIdx * spacing;
        var toX = fromX + spacing;
        var arcMidX = (fromX + toX) / 2;
        var arcY = cy - 50;
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(fromX, cy - 10);
        ctx.quadraticCurveTo(arcMidX, arcY, fromX + this.animProgress * spacing, cy - 10);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Pointer triangle
      ctx.fillStyle = c.green;
      ctx.beginPath();
      ctx.moveTo(curX, cy - 14);
      ctx.lineTo(curX - 7, cy - 26);
      ctx.lineTo(curX + 7, cy - 26);
      ctx.closePath();
      ctx.fill();

      // S() label
      ctx.fillStyle = c.text;
      ctx.font = '600 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('S(' + this.current + ') = ' + (this.current + 1), w / 2, 30);

      // Info
      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Each click applies the successor function', w / 2, h - 10);
    }
  };

  /* ================================================================
     3. Groups — Cayley Table Explorer
     ================================================================ */
  var GroupsViz = {
    groups: {
      'Z3': {
        name: 'Z/3Z (integers mod 3)',
        elements: ['0', '1', '2'],
        op: function (a, b) { return String((parseInt(a) + parseInt(b)) % 3); },
        identity: '0'
      },
      'Z4': {
        name: 'Z/4Z (integers mod 4)',
        elements: ['0', '1', '2', '3'],
        op: function (a, b) { return String((parseInt(a) + parseInt(b)) % 4); },
        identity: '0'
      },
      'Klein': {
        name: 'Klein four-group',
        elements: ['e', 'a', 'b', 'c'],
        op: function (x, y) {
          var t = { 'ee': 'e', 'ea': 'a', 'eb': 'b', 'ec': 'c', 'ae': 'a', 'aa': 'e', 'ab': 'c', 'ac': 'b', 'be': 'b', 'ba': 'c', 'bb': 'e', 'bc': 'a', 'ce': 'c', 'ca': 'b', 'cb': 'a', 'cc': 'e' };
          return t[x + y];
        },
        identity: 'e'
      },
      'S3': {
        name: 'S\u2083 (symmetric group)',
        elements: ['e', 'r', 'r\u00B2', 's', 'sr', 'sr\u00B2'],
        op: function (a, b) {
          var idx = { 'e': 0, 'r': 1, 'r\u00B2': 2, 's': 3, 'sr': 4, 'sr\u00B2': 5 };
          var table = [
            [0,1,2,3,4,5],[1,2,0,4,5,3],[2,0,1,5,3,4],
            [3,5,4,0,2,1],[4,3,5,1,0,2],[5,4,3,2,1,0]
          ];
          var elems = ['e', 'r', 'r\u00B2', 's', 'sr', 'sr\u00B2'];
          return elems[table[idx[a]][idx[b]]];
        },
        identity: 'e'
      }
    },
    init: function () {
      this.container = document.querySelector('#viz-groups .viz-canvas-wrap');
      if (!this.container) return;
      this.currentGroup = 'Z3';
      this.hoverRow = -1;
      this.hoverCol = -1;

      var self = this;
      var sel = document.querySelector('#viz-groups select');
      if (sel) {
        sel.addEventListener('change', function () {
          self.currentGroup = sel.value;
          self.buildTable();
        });
      }
      this.buildTable();
    },
    buildTable: function () {
      var g = this.groups[this.currentGroup];
      var el = g.elements;
      var n = el.length;
      var self = this;

      this.container.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'overflow-x:auto;padding:1rem;';

      var table = document.createElement('table');
      table.style.cssText = 'border-collapse:collapse;margin:0 auto;';

      // Header row
      var thead = document.createElement('tr');
      var corner = document.createElement('th');
      corner.style.cssText = 'padding:8px 12px;font-family:Inter,sans-serif;font-size:13px;font-weight:700;';
      corner.textContent = g.name.length > 15 ? '\u2217' : '\u2217';
      thead.appendChild(corner);
      for (var j = 0; j < n; j++) {
        var th = document.createElement('th');
        th.style.cssText = 'padding:8px 12px;font-family:"JetBrains Mono",monospace;font-size:14px;font-weight:600;text-align:center;';
        th.textContent = el[j];
        thead.appendChild(th);
      }
      table.appendChild(thead);

      // Body
      for (var i = 0; i < n; i++) {
        var tr = document.createElement('tr');
        var rh = document.createElement('th');
        rh.style.cssText = 'padding:8px 12px;font-family:"JetBrains Mono",monospace;font-size:14px;font-weight:600;text-align:right;';
        rh.textContent = el[i];
        tr.appendChild(rh);
        for (var jj = 0; jj < n; jj++) {
          var td = document.createElement('td');
          td.dataset.row = i;
          td.dataset.col = jj;
          td.style.cssText = 'padding:8px 12px;text-align:center;font-family:"JetBrains Mono",monospace;font-size:14px;border:1px solid var(--border);transition:background 0.15s;cursor:default;';
          td.textContent = g.op(el[i], el[jj]);
          // Color identity results
          if (g.op(el[i], el[jj]) === g.identity) {
            td.style.fontWeight = '700';
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      wrap.appendChild(table);
      this.container.appendChild(wrap);

      // Hover logic
      var info = document.querySelector('#viz-groups .viz-info');
      table.addEventListener('mouseover', function (e) {
        var td = e.target.closest('td');
        if (!td) return;
        var r = parseInt(td.dataset.row);
        var cc = parseInt(td.dataset.col);
        // Highlight row and col
        table.querySelectorAll('td').forEach(function (cell) {
          var cr = parseInt(cell.dataset.row);
          var ccc = parseInt(cell.dataset.col);
          cell.style.background = (cr === r || ccc === cc) ? 'var(--bg-meta)' : '';
          if (cr === r && ccc === cc) cell.style.background = cssVar('--color-groups');
          if (cr === r && ccc === cc) cell.style.color = '#fff';
        });
        if (info) {
          info.textContent = el[r] + ' \u2217 ' + el[cc] + ' = ' + g.op(el[r], el[cc]);
        }
      });
      table.addEventListener('mouseleave', function () {
        table.querySelectorAll('td').forEach(function (cell) {
          cell.style.background = '';
          cell.style.color = '';
        });
        if (info) info.textContent = 'Hover over cells to see operations';
      });
    },
    draw: function () { this.buildTable(); }
  };

  /* ================================================================
     4. Order — Hasse Diagram
     ================================================================ */
  var OrderViz = {
    init: function () {
      var container = document.querySelector('#viz-order .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 380;
      this.ctx = setupCanvas(canvas, this.w, this.h);
      this.mode = 'partial'; // partial or total
      this.highlight = -1;

      var self = this;
      var controls = document.querySelector('#viz-order .viz-controls');
      if (controls) {
        controls.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            controls.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            self.mode = btn.dataset.mode;
            self.draw();
          });
        });
      }

      canvas.addEventListener('mousemove', function (e) {
        var p = self.getPos(e);
        self.highlight = self.findNode(p);
        self.draw();
      });
      canvas.addEventListener('mouseleave', function () {
        self.highlight = -1;
        self.draw();
      });

      this.draw();
    },
    getPos: function (e) {
      var r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.w / r.width), y: (e.clientY - r.top) * (this.h / r.height) };
    },
    findNode: function (p) {
      var nodes = this.getNodes();
      for (var i = 0; i < nodes.length; i++) {
        if (Math.hypot(p.x - nodes[i].x, p.y - nodes[i].y) < 18) return i;
      }
      return -1;
    },
    getNodes: function () {
      if (this.mode === 'total') {
        // Simple total order: 1 < 2 < 3 < 4 < 5 < 6
        var elems = [1, 2, 3, 4, 5, 6];
        var cx = this.w / 2;
        return elems.map(function (v, i) {
          return { val: v, x: cx, y: 340 - i * 55 };
        });
      }
      // Partial order: divisibility on {1,2,3,4,6,12}
      return [
        { val: 1, x: 300, y: 340 },
        { val: 2, x: 200, y: 260 },
        { val: 3, x: 400, y: 260 },
        { val: 4, x: 140, y: 180 },
        { val: 6, x: 340, y: 180 },
        { val: 12, x: 300, y: 100 }
      ];
    },
    getEdges: function () {
      if (this.mode === 'total') {
        return [[0,1],[1,2],[2,3],[3,4],[4,5]];
      }
      // Hasse edges for divisibility: cover relations
      return [[0,1],[0,2],[1,3],[1,4],[2,4],[3,5],[4,5]];
    },
    divides: function (a, b) { return b % a === 0; },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var nodes = this.getNodes();
      var edges = this.getEdges();
      var hi = this.highlight;

      // Find all nodes >= highlighted (reachable upward)
      var upSet = {};
      var downSet = {};
      if (hi >= 0) {
        var hiVal = nodes[hi].val;
        nodes.forEach(function (n, i) {
          if (this.mode === 'total') {
            if (n.val >= hiVal) upSet[i] = true;
            if (n.val <= hiVal) downSet[i] = true;
          } else {
            if (n.val % hiVal === 0) upSet[i] = true;
            if (hiVal % n.val === 0) downSet[i] = true;
          }
        }.bind(this));
      }

      // Draw edges
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.strokeStyle = (hi >= 0 && upSet[e[0]] && upSet[e[1]]) ? c.rose :
                          (hi >= 0 && downSet[e[0]] && downSet[e[1]]) ? c.amber : c.line;
        ctx.lineWidth = (hi >= 0 && (upSet[e[0]] && upSet[e[1]] || downSet[e[0]] && downSet[e[1]])) ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(function (n, i) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        if (i === hi) {
          ctx.fillStyle = c.rose;
        } else if (hi >= 0 && upSet[i]) {
          ctx.fillStyle = c.rose;
          ctx.globalAlpha = 0.4;
        } else if (hi >= 0 && downSet[i]) {
          ctx.fillStyle = c.amber;
          ctx.globalAlpha = 0.4;
        } else {
          ctx.fillStyle = c.bg;
        }
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = (i === hi) ? c.rose : c.line;
        ctx.lineWidth = (i === hi) ? 2.5 : 1.5;
        ctx.stroke();

        ctx.fillStyle = (i === hi) ? '#fff' : c.text;
        ctx.font = '600 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(n.val), n.x, n.y);
      });

      // Title
      ctx.fillStyle = c.text;
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.mode === 'total' ? 'Total Order: 1 < 2 < 3 < 4 < 5 < 6' : 'Partial Order: Divisibility on {1, 2, 3, 4, 6, 12}', w / 2, 24);

      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      if (hi >= 0) {
        ctx.fillText('Hover: elements above (pink) divide into ' + nodes[hi].val + ', elements below (amber) are divided by it', w / 2, h - 10);
      } else {
        ctx.fillText('Hover over a node to see its relationships', w / 2, h - 10);
      }
    }
  };

  /* ================================================================
     5. Topology — Open Set Operations
     ================================================================ */
  var TopologyViz = {
    init: function () {
      var container = document.querySelector('#viz-topology .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 340;
      this.ctx = setupCanvas(canvas, this.w, this.h);

      // Open intervals on [0, 10]
      this.intervals = [
        { a: 1, b: 4, color: 'violet' },
        { a: 3, b: 7, color: 'teal' }
      ];
      this.mode = 'both'; // both, union, intersection
      this.dragging = null;

      var self = this;
      var controls = document.querySelector('#viz-topology .viz-controls');
      if (controls) {
        controls.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            controls.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            self.mode = btn.dataset.mode;
            self.draw();
          });
        });
      }

      canvas.addEventListener('mousedown', function (e) { self.onDown(e); });
      canvas.addEventListener('mousemove', function (e) { self.onMove(e); });
      canvas.addEventListener('mouseup', function () { self.dragging = null; });
      canvas.addEventListener('mouseleave', function () { self.dragging = null; });

      this.draw();
    },
    toScreen: function (v) { return 50 + (v / 10) * (this.w - 100); },
    fromScreen: function (x) { return Math.max(0, Math.min(10, (x - 50) / (this.w - 100) * 10)); },
    getPos: function (e) {
      var r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.w / r.width), y: (e.clientY - r.top) * (this.h / r.height) };
    },
    onDown: function (e) {
      var p = this.getPos(e);
      // Check endpoints
      for (var i = 0; i < this.intervals.length; i++) {
        var iv = this.intervals[i];
        var sa = this.toScreen(iv.a);
        var sb = this.toScreen(iv.b);
        var row = 100 + i * 60;
        if (Math.hypot(p.x - sa, p.y - row) < 12) { this.dragging = { interval: i, end: 'a' }; return; }
        if (Math.hypot(p.x - sb, p.y - row) < 12) { this.dragging = { interval: i, end: 'b' }; return; }
      }
    },
    onMove: function (e) {
      if (!this.dragging) return;
      var p = this.getPos(e);
      var v = this.fromScreen(p.x);
      var iv = this.intervals[this.dragging.interval];
      if (this.dragging.end === 'a') iv.a = Math.min(v, iv.b - 0.2);
      else iv.b = Math.max(v, iv.a + 0.2);
      this.draw();
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var ivs = this.intervals;
      var mode = this.mode;
      var self = this;

      // Draw number line baseline
      function drawLine(y, label) {
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(w - 50, y);
        ctx.stroke();
        // Ticks
        for (var t = 0; t <= 10; t++) {
          var tx = self.toScreen(t);
          ctx.beginPath(); ctx.moveTo(tx, y - 4); ctx.lineTo(tx, y + 4); ctx.stroke();
          if (t % 2 === 0) {
            ctx.fillStyle = c.muted;
            ctx.font = '400 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String(t), tx, y + 16);
          }
        }
        if (label) {
          ctx.fillStyle = c.muted;
          ctx.font = '600 11px Inter, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(label, 42, y + 4);
        }
      }

      // Individual intervals
      if (mode === 'both' || mode === 'union' || mode === 'intersection') {
        for (var i = 0; i < ivs.length; i++) {
          var row = 100 + i * 60;
          drawLine(row, i === 0 ? 'U' : 'V');
          var sa = this.toScreen(ivs[i].a);
          var sb = this.toScreen(ivs[i].b);
          ctx.fillStyle = c[ivs[i].color];
          ctx.globalAlpha = 0.25;
          ctx.fillRect(sa, row - 12, sb - sa, 24);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c[ivs[i].color];
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(sa, row - 12); ctx.lineTo(sa, row + 12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sb, row - 12); ctx.lineTo(sb, row + 12); ctx.stroke();
          // Open circle endpoints
          ctx.beginPath(); ctx.arc(sa, row, 5, 0, Math.PI * 2);
          ctx.fillStyle = c.bg; ctx.fill();
          ctx.strokeStyle = c[ivs[i].color]; ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(sb, row, 5, 0, Math.PI * 2);
          ctx.fillStyle = c.bg; ctx.fill(); ctx.stroke();
          // Labels
          ctx.fillStyle = c[ivs[i].color];
          ctx.font = '500 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('(' + ivs[i].a.toFixed(1) + ', ' + ivs[i].b.toFixed(1) + ')', (sa + sb) / 2, row - 20);
        }
      }

      // Result line
      var resultY = 260;
      drawLine(resultY, '');

      var a1 = ivs[0].a, b1 = ivs[0].b, a2 = ivs[1].a, b2 = ivs[1].b;
      if (mode === 'union' || mode === 'both') {
        // Union
        var parts = [];
        if (b1 < a2 || b2 < a1) {
          parts.push([Math.min(a1, a2), Math.min(b1, b2)]);
          parts.push([Math.max(a1, a2), Math.max(b1, b2)]);
        } else {
          parts.push([Math.min(a1, a2), Math.max(b1, b2)]);
        }
        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.25;
        parts.forEach(function (p) {
          var sx = self.toScreen(p[0]), ex = self.toScreen(p[1]);
          ctx.fillRect(sx, resultY - 12, ex - sx, 24);
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = c.text;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('U \u222A V (union \u2014 still open!)', w / 2, resultY - 22);
      }
      if (mode === 'intersection') {
        var intA = Math.max(a1, a2), intB = Math.min(b1, b2);
        if (intA < intB) {
          var sx = this.toScreen(intA), ex = this.toScreen(intB);
          ctx.fillStyle = c.rose;
          ctx.globalAlpha = 0.25;
          ctx.fillRect(sx, resultY - 12, ex - sx, 24);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = c.text;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(intA < intB ? 'U \u2229 V (intersection \u2014 still open!)' : 'U \u2229 V = \u2205 (empty \u2014 also open!)', w / 2, resultY - 22);
      }

      // Title
      ctx.fillStyle = c.text;
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Open Sets on the Real Line', w / 2, 28);

      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Drag the endpoints of U and V to move them', w / 2, h - 10);
    }
  };

  /* ================================================================
     6. Fields / Real Numbers — Number Line Gap Finder
     ================================================================ */
  var FieldsViz = {
    init: function () {
      var container = document.querySelector('#viz-fields .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 320;
      this.ctx = setupCanvas(canvas, this.w, this.h);
      this.center = 1.414;
      this.zoom = 1; // 1 = show range 0 to 3
      this.showRationals = true;
      this.showGap = true;

      var self = this;
      var controls = document.querySelector('#viz-fields .viz-controls');
      if (controls) {
        var zoomIn = controls.querySelector('[data-action="zoom-in"]');
        var zoomOut = controls.querySelector('[data-action="zoom-out"]');
        if (zoomIn) zoomIn.addEventListener('click', function () { self.zoom = Math.min(self.zoom * 2, 256); self.draw(); });
        if (zoomOut) zoomOut.addEventListener('click', function () { self.zoom = Math.max(self.zoom / 2, 0.5); self.draw(); });
      }

      this.draw();
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var sqrt2 = Math.SQRT2;
      var range = 3 / this.zoom;
      var lo = sqrt2 - range / 2;
      var hi = sqrt2 + range / 2;
      var cy = h / 2 + 20;

      function toX(v) { return 50 + ((v - lo) / (hi - lo)) * (w - 100); }

      // Number line
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 40, cy);
      ctx.stroke();

      // Rational points
      if (this.showRationals) {
        var maxDenom = Math.min(Math.floor(20 * this.zoom), 200);
        ctx.fillStyle = c.accent;
        for (var d = 1; d <= maxDenom; d++) {
          var aStart = Math.ceil(lo * d);
          var aEnd = Math.floor(hi * d);
          for (var a = aStart; a <= aEnd; a++) {
            var v = a / d;
            if (v < lo || v > hi) continue;
            var x = toX(v);
            var size = Math.max(1.5, 4 - d * 0.3);
            ctx.globalAlpha = Math.max(0.15, 0.7 - d * 0.04);
            ctx.beginPath();
            ctx.arc(x, cy, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // sqrt(2) gap marker
      if (this.showGap) {
        var sx = toX(sqrt2);
        ctx.strokeStyle = c.rose;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(sx, cy - 40);
        ctx.lineTo(sx, cy + 40);
        ctx.stroke();
        ctx.setLineDash([]);

        // Open circle — the gap
        ctx.beginPath();
        ctx.arc(sx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = c.bg;
        ctx.fill();
        ctx.strokeStyle = c.rose;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = c.rose;
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('\u221A2 \u2248 1.41421356...', sx, cy - 50);

        ctx.font = '400 11px Inter, sans-serif';
        ctx.fillText('not rational \u2014 the gap', sx, cy - 65);
      }

      // Tick labels at nice intervals
      var step = range < 0.5 ? 0.05 : range < 2 ? 0.25 : range < 5 ? 0.5 : 1;
      var tickStart = Math.ceil(lo / step) * step;
      ctx.fillStyle = c.muted;
      ctx.font = '400 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      for (var t = tickStart; t <= hi; t += step) {
        var tx = toX(t);
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tx, cy - 5); ctx.lineTo(tx, cy + 5); ctx.stroke();
        ctx.fillText(t.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0), tx, cy + 20);
      }

      // Title
      ctx.fillStyle = c.text;
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('The Rationals Have Gaps', w / 2, 24);

      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Blue dots = rationals. Zoom in: the gap at \u221A2 never fills.  (Zoom: ' + this.zoom + 'x)', w / 2, h - 10);
    }
  };

  /* ================================================================
     7. Vector Spaces — Span and Basis Explorer
     ================================================================ */
  var VectorsViz = {
    init: function () {
      var container = document.querySelector('#viz-vectors .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 400;
      this.ctx = setupCanvas(canvas, this.w, this.h);

      this.v1 = { x: 2, y: 1 };
      this.v2 = { x: 0.5, y: 2 };
      this.scalarA = 1;
      this.scalarB = 1;
      this.dragging = null;

      var self = this;
      canvas.addEventListener('mousedown', function (e) { self.onDown(e); });
      canvas.addEventListener('mousemove', function (e) { self.onMove(e); });
      canvas.addEventListener('mouseup', function () { self.dragging = null; });
      canvas.addEventListener('mouseleave', function () { self.dragging = null; });

      var sliderA = document.querySelector('#viz-vectors input[data-param="a"]');
      var sliderB = document.querySelector('#viz-vectors input[data-param="b"]');
      if (sliderA) sliderA.addEventListener('input', function () { self.scalarA = parseFloat(sliderA.value); self.draw(); });
      if (sliderB) sliderB.addEventListener('input', function () { self.scalarB = parseFloat(sliderB.value); self.draw(); });

      this.draw();
    },
    scale: 50, // pixels per unit
    originX: function () { return this.w / 2; },
    originY: function () { return this.h / 2; },
    toScreen: function (vx, vy) { return { x: this.originX() + vx * this.scale, y: this.originY() - vy * this.scale }; },
    fromScreen: function (sx, sy) { return { x: (sx - this.originX()) / this.scale, y: (this.originY() - sy) / this.scale }; },
    getPos: function (e) {
      var r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.w / r.width), y: (e.clientY - r.top) * (this.h / r.height) };
    },
    onDown: function (e) {
      var p = this.getPos(e);
      var s1 = this.toScreen(this.v1.x, this.v1.y);
      var s2 = this.toScreen(this.v2.x, this.v2.y);
      if (Math.hypot(p.x - s1.x, p.y - s1.y) < 15) this.dragging = this.v1;
      else if (Math.hypot(p.x - s2.x, p.y - s2.y) < 15) this.dragging = this.v2;
    },
    onMove: function (e) {
      if (!this.dragging) return;
      var p = this.getPos(e);
      var v = this.fromScreen(p.x, p.y);
      this.dragging.x = Math.round(v.x * 4) / 4;
      this.dragging.y = Math.round(v.y * 4) / 4;
      this.draw();
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      var ox = this.originX(), oy = this.originY();
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.4;
      for (var gx = -6; gx <= 6; gx++) {
        var sx = ox + gx * this.scale;
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
      }
      for (var gy = -4; gy <= 4; gy++) {
        var sy = oy + gy * this.scale;
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Axes
      ctx.strokeStyle = c.muted;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

      // Parallelogram span
      var v1 = this.v1, v2 = this.v2;
      var p00 = this.toScreen(0, 0);
      var p10 = this.toScreen(v1.x, v1.y);
      var p01 = this.toScreen(v2.x, v2.y);
      var p11 = this.toScreen(v1.x + v2.x, v1.y + v2.y);
      ctx.fillStyle = c.indigo;
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.moveTo(p00.x, p00.y);
      ctx.lineTo(p10.x, p10.y);
      ctx.lineTo(p11.x, p11.y);
      ctx.lineTo(p01.x, p01.y);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw vectors
      function drawArrow(from, to, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        // Arrowhead
        var angle = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - 10 * Math.cos(angle - 0.3), to.y - 10 * Math.sin(angle - 0.3));
        ctx.lineTo(to.x - 10 * Math.cos(angle + 0.3), to.y - 10 * Math.sin(angle + 0.3));
        ctx.closePath();
        ctx.fill();
      }

      drawArrow(p00, p10, c.indigo);
      drawArrow(p00, p01, c.teal);

      // Scaled result vector
      var rx = this.scalarA * v1.x + this.scalarB * v2.x;
      var ry = this.scalarA * v1.y + this.scalarB * v2.y;
      var rp = this.toScreen(rx, ry);
      drawArrow(p00, rp, c.rose);

      // Labels
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = c.indigo;
      ctx.fillText('v\u2081 = (' + v1.x + ', ' + v1.y + ')', p10.x + 8, p10.y - 5);
      ctx.fillStyle = c.teal;
      ctx.fillText('v\u2082 = (' + v2.x + ', ' + v2.y + ')', p01.x + 8, p01.y - 5);
      ctx.fillStyle = c.rose;
      ctx.fillText(this.scalarA.toFixed(1) + 'v\u2081 + ' + this.scalarB.toFixed(1) + 'v\u2082', rp.x + 8, rp.y - 5);

      // Drag handles
      [p10, p01].forEach(function (p) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = c.bg; ctx.fill();
        ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5; ctx.stroke();
      });

      // Info
      var det = v1.x * v2.y - v1.y * v2.x;
      ctx.fillStyle = c.text;
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.abs(det) < 0.01 ? 'Linearly DEPENDENT \u2014 span collapses to a line!' : 'Linearly independent \u2014 these span all of R\u00B2', w / 2, 20);
    }
  };

  /* ================================================================
     8. Metric Spaces — Distance Playground
     ================================================================ */
  var MetricViz = {
    init: function () {
      var container = document.querySelector('#viz-metric .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 400;
      this.ctx = setupCanvas(canvas, this.w, this.h);

      this.center = { x: 300, y: 200 };
      this.radius = 120;
      this.metric = 'euclidean';
      this.dragging = false;

      var self = this;
      var sel = document.querySelector('#viz-metric select');
      if (sel) sel.addEventListener('change', function () { self.metric = sel.value; self.draw(); });
      var slider = document.querySelector('#viz-metric input[data-param="radius"]');
      if (slider) slider.addEventListener('input', function () { self.radius = parseInt(slider.value); self.draw(); });

      canvas.addEventListener('mousedown', function () { self.dragging = true; });
      canvas.addEventListener('mousemove', function (e) { if (self.dragging) { var p = self.getPos(e); self.center = p; self.draw(); } });
      canvas.addEventListener('mouseup', function () { self.dragging = false; });
      canvas.addEventListener('mouseleave', function () { self.dragging = false; });

      this.draw();
    },
    getPos: function (e) {
      var r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.w / r.width), y: (e.clientY - r.top) * (this.h / r.height) };
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var cx = this.center.x, cy = this.center.y;
      var r = this.radius;
      var metric = this.metric;

      // Grid
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      for (var gx = 0; gx < w; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (var gy = 0; gy < h; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw "circle" (ball of radius r)
      ctx.strokeStyle = c.orange;
      ctx.lineWidth = 2.5;
      ctx.fillStyle = c.orange;
      ctx.globalAlpha = 0.1;

      if (metric === 'euclidean') {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      } else if (metric === 'manhattan') {
        ctx.beginPath();
        ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy);
        ctx.closePath(); ctx.stroke();
      } else if (metric === 'chebyshev') {
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        ctx.globalAlpha = 1; ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
      } else if (metric === 'discrete') {
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '400 11px Inter, sans-serif';
        ctx.fillStyle = c.muted;
        ctx.textAlign = 'center';
        ctx.fillText(r >= 1 ? '(if r \u2265 1, the ball is everything)' : '(if r < 1, just the center point)', cx, cy + 24);
      }
      ctx.globalAlpha = 1;

      // Center dot
      ctx.fillStyle = c.orange;
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

      // Labels
      var names = { euclidean: 'Euclidean', manhattan: 'Manhattan (Taxicab)', chebyshev: 'Chebyshev (Max)', discrete: 'Discrete' };
      var shapes = { euclidean: 'Circle', manhattan: 'Diamond', chebyshev: 'Square', discrete: 'Point or Everything' };
      ctx.fillStyle = c.text;
      ctx.font = '600 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(names[metric] + ' Metric \u2014 "circle" is a ' + shapes[metric], w / 2, 24);

      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Drag to move center. Same axioms, different shapes.', w / 2, h - 10);
    }
  };

  /* ================================================================
     9. Probability — Sample Space Grid
     ================================================================ */
  var ProbabilityViz = {
    init: function () {
      this.container = document.querySelector('#viz-probability .viz-canvas-wrap');
      if (!this.container) return;
      this.selected = {};
      this.eventB = {};
      this.mode = 'select'; // 'select' or 'conditional'
      this.buildGrid();

      var self = this;
      var controls = document.querySelector('#viz-probability .viz-controls');
      if (controls) {
        controls.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (btn.dataset.action === 'sum7') {
              self.selected = {};
              for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) {
                if (i + j === 7) self.selected[i + ',' + j] = true;
              }
              self.updateGrid();
            } else if (btn.dataset.action === 'doubles') {
              self.selected = {};
              for (var ii = 1; ii <= 6; ii++) self.selected[ii + ',' + ii] = true;
              self.updateGrid();
            } else if (btn.dataset.action === 'clear') {
              self.selected = {};
              self.updateGrid();
            }
          });
        });
      }
    },
    buildGrid: function () {
      this.container.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'padding:1rem;overflow-x:auto;';

      // Title
      var title = document.createElement('div');
      title.style.cssText = 'text-align:center;font-family:Inter,sans-serif;font-size:13px;font-weight:600;margin-bottom:0.8rem;color:var(--text-primary);';
      title.textContent = 'Sample Space: Two Dice';
      wrap.appendChild(title);

      var table = document.createElement('table');
      table.style.cssText = 'border-collapse:collapse;margin:0 auto;';

      // Header
      var header = document.createElement('tr');
      var ch = document.createElement('th');
      ch.style.cssText = 'padding:4px 8px;font-family:Inter,sans-serif;font-size:11px;color:var(--text-muted);';
      ch.textContent = 'D1\\D2';
      header.appendChild(ch);
      for (var j = 1; j <= 6; j++) {
        var th = document.createElement('th');
        th.style.cssText = 'padding:4px 8px;font-family:"JetBrains Mono",monospace;font-size:12px;text-align:center;color:var(--text-secondary);';
        th.textContent = j;
        header.appendChild(th);
      }
      table.appendChild(header);

      var self = this;
      for (var i = 1; i <= 6; i++) {
        var tr = document.createElement('tr');
        var rh = document.createElement('th');
        rh.style.cssText = 'padding:4px 8px;font-family:"JetBrains Mono",monospace;font-size:12px;text-align:right;color:var(--text-secondary);';
        rh.textContent = i;
        tr.appendChild(rh);
        for (var jj = 1; jj <= 6; jj++) {
          var td = document.createElement('td');
          td.dataset.key = i + ',' + jj;
          td.style.cssText = 'width:40px;height:40px;text-align:center;font-family:"JetBrains Mono",monospace;font-size:11px;border:1px solid var(--border);cursor:pointer;transition:background 0.1s;user-select:none;';
          td.textContent = '(' + i + ',' + jj + ')';
          (function (key) {
            td.addEventListener('click', function () {
              if (self.selected[key]) delete self.selected[key];
              else self.selected[key] = true;
              self.updateGrid();
            });
          })(i + ',' + jj);
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      wrap.appendChild(table);

      // Probability display
      var prob = document.createElement('div');
      prob.className = 'prob-display';
      prob.style.cssText = 'text-align:center;margin-top:1rem;font-family:"JetBrains Mono",monospace;font-size:14px;color:var(--text-primary);min-height:2rem;';
      wrap.appendChild(prob);

      this.container.appendChild(wrap);
      this.table = table;
      this.probDisplay = prob;
      this.updateGrid();
    },
    updateGrid: function () {
      var self = this;
      this.table.querySelectorAll('td').forEach(function (td) {
        var key = td.dataset.key;
        if (self.selected[key]) {
          td.style.background = 'var(--color-probability)';
          td.style.color = '#fff';
        } else {
          td.style.background = '';
          td.style.color = '';
        }
      });
      var count = Object.keys(this.selected).length;
      var prob = count / 36;
      this.probDisplay.textContent = 'P(A) = ' + count + '/36 = ' + (prob === 0 ? '0' : prob.toFixed(4));
    },
    draw: function () { this.buildGrid(); }
  };

  /* ================================================================
     10. Category Theory — Composition Diagram
     ================================================================ */
  var CategoryViz = {
    init: function () {
      var container = document.querySelector('#viz-category .viz-canvas-wrap');
      if (!container) return;
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      this.canvas = canvas;
      this.w = 600;
      this.h = 400;
      this.ctx = setupCanvas(canvas, this.w, this.h);

      this.objects = [
        { name: 'A', x: 120, y: 200 },
        { name: 'B', x: 300, y: 100 },
        { name: 'C', x: 480, y: 200 }
      ];
      this.morphisms = [
        { from: 0, to: 1, label: 'f', color: 'slate' },
        { from: 1, to: 2, label: 'g', color: 'slate' }
      ];
      this.showComposition = false;

      var self = this;
      var compBtn = document.querySelector('#viz-category button[data-action="compose"]');
      if (compBtn) compBtn.addEventListener('click', function () {
        self.showComposition = !self.showComposition;
        compBtn.classList.toggle('active', self.showComposition);
        self.draw();
      });

      var resetBtn = document.querySelector('#viz-category button[data-action="reset"]');
      if (resetBtn) resetBtn.addEventListener('click', function () {
        self.showComposition = false;
        if (compBtn) compBtn.classList.remove('active');
        self.draw();
      });

      this.draw();
    },
    draw: function () {
      var ctx = this.ctx;
      var c = colors();
      var w = this.w, h = this.h;
      ctx.clearRect(0, 0, w, h);

      var objs = this.objects;
      var morphs = this.morphisms;

      // Draw morphisms (arrows)
      morphs.forEach(function (m) {
        var from = objs[m.from], to = objs[m.to];
        var angle = Math.atan2(to.y - from.y, to.x - from.x);
        var r = 28;
        var sx = from.x + r * Math.cos(angle);
        var sy = from.y + r * Math.sin(angle);
        var ex = to.x - r * Math.cos(angle);
        var ey = to.y - r * Math.sin(angle);

        ctx.strokeStyle = c[m.color] || c.slate;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();

        // Arrowhead
        ctx.fillStyle = c[m.color] || c.slate;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - 10 * Math.cos(angle - 0.3), ey - 10 * Math.sin(angle - 0.3));
        ctx.lineTo(ex - 10 * Math.cos(angle + 0.3), ey - 10 * Math.sin(angle + 0.3));
        ctx.closePath(); ctx.fill();

        // Label
        var mx = (sx + ex) / 2, my = (sy + ey) / 2;
        var nx = -Math.sin(angle) * 16, ny = Math.cos(angle) * 16;
        ctx.fillStyle = c[m.color] || c.slate;
        ctx.font = '600 16px "Crimson Pro", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.label, mx + nx, my + ny);
      });

      // Composition arrow (curved)
      if (this.showComposition) {
        var A = objs[0], C = objs[2];
        var midX = (A.x + C.x) / 2, midY = (A.y + C.y) / 2 + 80;

        ctx.strokeStyle = c.gold;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(A.x + 28, A.y + 10);
        ctx.quadraticCurveTo(midX, midY + 20, C.x - 28, C.y + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead
        var endAngle = Math.atan2(C.y + 10 - (midY + 20), C.x - 28 - midX);
        ctx.fillStyle = c.gold;
        ctx.beginPath();
        var aex = C.x - 28, aey = C.y + 10;
        ctx.moveTo(aex, aey);
        ctx.lineTo(aex - 10 * Math.cos(endAngle - 0.3), aey - 10 * Math.sin(endAngle - 0.3));
        ctx.lineTo(aex - 10 * Math.cos(endAngle + 0.3), aey - 10 * Math.sin(endAngle + 0.3));
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = c.gold;
        ctx.font = '600 16px "Crimson Pro", serif';
        ctx.textAlign = 'center';
        ctx.fillText('g \u2218 f', midX, midY + 6);

        ctx.font = '400 12px Inter, sans-serif';
        ctx.fillStyle = c.gold;
        ctx.fillText('composition: the axioms guarantee this exists', midX, midY + 24);
      }

      // Identity loops
      objs.forEach(function (obj) {
        ctx.strokeStyle = c.muted;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y - 28, 14, Math.PI * 0.8, Math.PI * 0.2);
        ctx.stroke();
        // Arrowhead
        var ae = Math.PI * 0.2;
        var lx = obj.x + 14 * Math.cos(ae);
        var ly = obj.y - 28 + 14 * Math.sin(ae);
        ctx.fillStyle = c.muted;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + 4, ly - 7);
        ctx.lineTo(lx + 7, ly + 2);
        ctx.closePath(); ctx.fill();
        // Label
        ctx.font = '400 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('id', obj.x, obj.y - 46);
      });

      // Objects (circles)
      objs.forEach(function (obj) {
        ctx.beginPath(); ctx.arc(obj.x, obj.y, 26, 0, Math.PI * 2);
        ctx.fillStyle = c.bg; ctx.fill();
        ctx.strokeStyle = c.slate; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = c.text;
        ctx.font = '700 20px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(obj.name, obj.x, obj.y);
      });

      // Title
      ctx.fillStyle = c.text;
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A Category with Three Objects', w / 2, 24);

      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('Two axioms: composition is associative, and every object has an identity', w / 2, h - 10);
    }
  };

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    VizLoader.init();
  });
})();
