
    const asciiEl = document.getElementById('ascii-bg');
    if (asciiEl) {
      const chars = '01アイウエオカキクケコ∑Δ∇λπ';
      let html = '';
      for (let i = 0; i < 300; i++) html += chars[Math.floor(Math.random()*chars.length)] + ' ';
      asciiEl.textContent = html;
    }


    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    const highlighted = {
      616: { name: 'Polska',  color: '#c9a84c', glow: 'rgba(224,90,90,0.5)',  label: 'PL' },
      392: { name: 'Japonia', color: '#c9a84c', glow: 'rgba(201,168,76,0.5)', label: 'JP' },
      156: { name: 'Chiny',   color: '#c9a84c', glow: 'rgba(201,168,76,0.5)', label: 'CN' },
    };

    const svgEl = document.getElementById('world-map');
    const w = svgEl.viewBox.baseVal.width;
    const h = svgEl.viewBox.baseVal.height;

    const svg = d3.select('#world-map');
    const projection = d3.geoNaturalEarth1().scale(153).translate([w/2, h/2]);
    const path = d3.geoPath().projection(projection);


    svg.append('path')
      .datum(d3.geoGraticule()())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.04)')
      .attr('stroke-width', 0.5);

    function toggleProject(id, btn) {
      const card = document.getElementById(id);
      card.classList.toggle('expanded');
      const isExp = card.classList.contains('expanded');
      btn.querySelector('.proj-toggle-arrow').style.transform = isExp ? 'rotate(180deg)' : 'rotate(0)';
    }


    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const countries = topojson.feature(world, world.objects.countries);

        svg.selectAll('.country')
          .data(countries.features)
          .enter().append('path')
          .attr('class', 'country')
          .attr('d', path)
          .attr('fill', d => highlighted[+d.id] ? highlighted[+d.id].color : '#1a1a2e')
          .attr('stroke', d => highlighted[+d.id] ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.06)')
          .attr('stroke-width', d => highlighted[+d.id] ? 0.8 : 0.4)
          .attr('filter', d => highlighted[+d.id] ? `url(#glow-${d.id})` : null)
          .style('cursor', d => highlighted[+d.id] ? 'pointer' : 'default')
          .on('mouseover', function(event, d) {
            if (highlighted[+d.id]) {
              d3.select(this).attr('opacity', 0.75);
            }
          })
          .on('mouseout', function(event, d) {
            d3.select(this).attr('opacity', 1);
          });

      

        const pinData = [
          { id: 616, cx: 16.9,  cy: 51.9,  label: 'Polska'  },
          { id: 392, cx: 138.3, cy: 36.2,  label: 'Japonia' },
          { id: 156, cx: 104.2, cy: 35.9,  label: 'Chiny'   },
        ];

        pinData.forEach(({ id, cx, cy, label }) => {
          const [px, py] = projection([cx, cy]);
          const cfg = highlighted[id];

          const lx = id === 616 ? px - 52 : px + 10;
          const ly = py - 10;
          svg.append('rect')
            .attr('x', lx).attr('y', ly - 10)
            .attr('width', 46).attr('height', 14)
            .attr('fill', '#0a0a0f').attr('rx', 2).attr('opacity', 0.85);
          svg.append('text')
            .attr('x', lx + 4).attr('y', ly + 1)
            .attr('fill', cfg.color)
            .attr('font-family', 'DM Mono, monospace')
            .attr('font-size', '9px')
            .attr('letter-spacing', '0.1em')
            .text(label.toUpperCase());
        });
      })
      .catch(() => {
        svg.append('text')
          .attr('x', w/2).attr('y', h/2)
          .attr('text-anchor','middle')
          .attr('fill','var(--muted)')
          .attr('font-family','DM Mono, monospace')
          .attr('font-size','12px')
          .text('[ mapa niedostępna — sprawdź połączenie ]');
      });