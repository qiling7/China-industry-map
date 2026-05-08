import { initRender } from './filter/render.js';
import { bindPanel } from './ui/panel.js';
import { initDrawer } from './ui/drawer.js';
import { bindDrawerSearch } from './ui/panel.js';

async function fetchBackendData() {
    const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : '';

    const response = await fetch(`${baseUrl}/api/industries`);
    const rawData = await response.json();
    
    const regionMap = new Map();
    
    for (const raw of rawData) {
        const r = raw.region;
        if (!regionMap.has(r)) {
            regionMap.set(r, {
                id: r,
                region: r,
                lng: raw.lng,
                lat: raw.lat,
                industries: new Array()
            });
        }
        
        const record = regionMap.get(r);
        record.industries.push({
            name: raw.industry_name,
            category: raw.category,
            note: raw.note
        });
    }
    
    const features = Array.from(regionMap.values());
    features.sort((a, b) => a.region.localeCompare(b.region, 'zh-CN'));
    return features;
}

async function app() {
    const features = await fetchBackendData();
    initRender(features);
    bindPanel();
    initDrawer();
    bindDrawerSearch();
}

app();