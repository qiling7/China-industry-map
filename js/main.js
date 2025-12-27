import { buildFeatures } from './filter/search.js';
import { initRender } from './filter/render.js';
import { bindPanel } from './ui/panel.js';

async function app() {
  const features = buildFeatures();
  initRender(features);
  bindPanel();
}

app();