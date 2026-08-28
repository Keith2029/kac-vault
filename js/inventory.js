
(() => {
  let items = [];

  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(Number(n || 0));

  const valueLow = x => Number(x.valuation?.low ?? x.low ?? 0);
  const valueHigh = x => Number(x.valuation?.high ?? x.high ?? 0);
  const valueMid = x => (valueLow(x) + valueHigh(x)) / 2;

  function itemSearchText(x) {
    return [
      x.sku, x.category, x.title, x.issue, x.year, x.publisher, x.status,
      x.grade, x.significance, x.note, x.creators, x.cert,
      x.player, x.team, x.manufacturer, x.cardNumber, x.sport, x.position,
      x.rookie ? 'rookie rookie card' : '', x.hallOfFame ? 'hall of fame hof' : ''
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function updateAnalytics(filtered) {
    const graded = filtered.filter(x => x.status === 'Graded').length;
    const photographed = filtered.filter(x => x.photos?.front).length;
    const low = filtered.reduce((s,x)=>s+valueLow(x),0);
    const high = filtered.reduce((s,x)=>s+valueHigh(x),0);

    $('metric-items').textContent = filtered.length;
    $('metric-graded').textContent = graded;
    $('metric-photo').textContent = photographed;
    $('metric-range').textContent = `${money(low)}–${money(high)}`;

    const publisherCounts = {};
    filtered.forEach(x => {
      const key = x.publisher || 'Unknown';
      publisherCounts[key] = (publisherCounts[key] || 0) + 1;
    });
    const maxCount = Math.max(1, ...Object.values(publisherCounts));
    $('publisher-bars').innerHTML = Object.entries(publisherCounts)
      .sort((a,b)=>b[1]-a[1])
      .map(([name,count]) => `
        <div class="analytics-bar-row">
          <span>${name}</span>
          <div class="analytics-bar-track"><i style="width:${(count/maxCount)*100}%"></i></div>
          <b>${count}</b>
        </div>`).join('') || '<span class="analytics-empty">No records in the current view.</span>';

    const statusCounts = {};
    filtered.forEach(x => {
      const key = x.status || 'Unknown';
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });
    $('status-breakdown').innerHTML = Object.entries(statusCounts)
      .sort((a,b)=>b[1]-a[1])
      .map(([name,count]) => `<span class="analytics-chip"><b>${count}</b> ${name}</span>`).join('');
  }

  function getFiltered() {
    const q = $('search').value.trim().toLowerCase();
    const category = $('category').value;
    const publisher = $('publisher').value;
    const status = $('status').value;
    const year = $('year').value;
    const value = $('value').value;

    return items.filter(x => {
      if (q && !itemSearchText(x).includes(q)) return false;
      if (category && x.category !== category) return false;
      if (publisher && x.publisher !== publisher) return false;
      if (status && x.status !== status) return false;
      if (year && String(x.year) !== year) return false;

      const mid = valueMid(x);
      if (value === 'under100' && !(mid < 100)) return false;
      if (value === '100-499' && !(mid >= 100 && mid < 500)) return false;
      if (value === '500-999' && !(mid >= 500 && mid < 1000)) return false;
      if (value === '1000plus' && !(mid >= 1000)) return false;
      return true;
    });
  }

  function sortItems(list) {
    const sort = $('sort').value;
    return [...list].sort((a,b) => {
      if (sort === 'sku') return a.sku.localeCompare(b.sku);
      if (sort === 'title') return `${a.title} ${a.issue}`.localeCompare(`${b.title} ${b.issue}`);
      if (sort === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sort === 'year-asc') return (a.year || 0) - (b.year || 0);
      if (sort === 'value-desc') return valueMid(b) - valueMid(a);
      if (sort === 'value-asc') return valueMid(a) - valueMid(b);
      return a.sku.localeCompare(b.sku);
    });
  }

  function render() {
    const filtered = sortItems(getFiltered());
    $('count').textContent = filtered.length;
    updateAnalytics(filtered);

    $('grid').innerHTML = filtered.map(x => {
      const photo = x.photos?.front;
      const img = photo
        ? `<div class="card-image"><img src="${photo}" alt="${x.title} ${x.issue || ''}"><span class="actual-tag">ACTUAL ITEM</span></div>`
        : `<div class="placeholder"><span>${x.sku}</span><small>PHOTO PENDING</small></div>`;

      const link = x.recordUrl || x.slug || '#';
      const low = valueLow(x), high = valueHigh(x);
      const val = (low || high) ? `${money(low)}–${money(high)}` : 'Value TBD';

      return `<article class="item-card ${photo ? 'photographed' : ''}">
        <a href="${link}">
          ${img}
          <div class="item-card-body">
            <div class="sku-line"><span>${x.sku}</span>${x.grade ? `<b>${x.grade}</b>` : ''}</div>
            <h3>${x.title}</h3>
            <div class="issue">${x.issue || ''}</div>
            <p>${x.significance || ''}</p>
            <div class="item-bottom">
              <span>${x.year || 'Year TBD'} · ${x.publisher || 'Publisher TBD'}</span>
              <strong>${val}</strong>
            </div>
          </div>
        </a>
      </article>`;
    }).join('') || `<div class="empty-results"><strong>No matching records.</strong><span>Try removing one or more filters.</span></div>`;
  }

  function fillSelect(id, values) {
    const el = $(id);
    values.forEach(v => {
      const option = document.createElement('option');
      option.value = v;
      option.textContent = v;
      el.appendChild(option);
    });
  }

  function initialize(data) {
    const doc = Array.isArray(data) ? {items:data} : data;
    items = doc.items || [];

    fillSelect('category', [...new Set(items.map(x=>x.category).filter(Boolean))].sort());
    fillSelect('publisher', [...new Set(items.map(x=>x.publisher).filter(Boolean))].sort());
    fillSelect('status', [...new Set(items.map(x=>x.status).filter(Boolean))].sort());
    fillSelect('year', [...new Set(items.map(x=>x.year).filter(Boolean))].sort((a,b)=>b-a));

    const params = new URLSearchParams(window.location.search);
    const presetCategory = params.get('category');
    const presetSearch = params.get('search');
    if (presetCategory && [...$('category').options].some(o => o.value === presetCategory)) $('category').value = presetCategory;
    if (presetSearch) $('search').value = presetSearch;

    ['search','category','publisher','status','year','value','sort']
      .forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', render));

    $('clear-filters').addEventListener('click', () => {
      $('search').value = '';
      ['category','publisher','status','year','value'].forEach(id => $(id).value = '');
      $('sort').value = 'sku';
      render();
    });

    render();
  }

  async function loadData() {
    try {
      const response = await fetch('data/inventory.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Inventory request failed');
      initialize(await response.json());
    } catch (err) {
      if (window.KAC_INVENTORY_DATA) {
        initialize(window.KAC_INVENTORY_DATA);
      } else {
        $('grid').innerHTML = '<div class="empty-results"><strong>Inventory unavailable.</strong><span>Please reload the page.</span></div>';
      }
    }
  }

  loadData();
})();
