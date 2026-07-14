// share.js - Instagram-ready Dossier Export (1080x1350)
function getStoredProfile() {
  try {
    const raw = localStorage.getItem('ARCHITECT_IDENTITY');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

function renderDossierToCanvas(profile, canvas) {
  const W = 1080, H = 1350;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const color = profile.power?.color || '#00d9ff';
  const bg = '#070a12';
  const panel = '#111a2e';

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(0,217,255,0.06)';
  ctx.lineWidth = 1;
  const grid = 54;
  for (let gx = 0; gx < W; gx += grid) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += grid) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  // Glows
  const glow = (x, y, r, c) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  glow(220, 180, 600, color + '22');
  glow(900, 1150, 700, '#9d7cff18');

  // Top rule
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(64, 84, W - 128, 1);

  // Header
  ctx.fillStyle = '#5a6688';
  ctx.font = '600 22px Orbitron, monospace';
  ctx.letterSpacing = '0.18em';
  ctx.fillText('THE POWER INDEX', 64, 56);
  ctx.textAlign = 'right';
  ctx.font = '500 18px Inter, sans-serif';
  ctx.fillStyle = '#8a96b4';
  ctx.fillText('DOSSIER // CLASSIFIED', W - 64, 56);
  ctx.textAlign = 'left';

  // Icon circle
  const iconX = 540, iconY = 210, iconR = 56;
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
  ctx.fillStyle = '#152040';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = '44px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(profile.power?.icon || '⬢', iconX, iconY + 2);

  // Hero name
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e6ecff';
  ctx.font = '800 64px Orbitron, monospace';
  let hero = (profile.hero || 'UNKNOWN ENTITY').toUpperCase();
  // shrink if too long
  let heroSize = 64;
  while (ctx.measureText(hero).width > W - 160 && heroSize > 36) {
    heroSize -= 2;
    ctx.font = `800 ${heroSize}px Orbitron, monospace`;
  }
  ctx.fillText(hero, 540, 340);

  // Power name
  ctx.fillStyle = color;
  ctx.font = '600 34px Inter';
  ctx.fillText(profile.power?.name || 'Unknown Power', 540, 390);

  // Rarity pill
  const rarity = (profile.power?.rarity || 'UNKNOWN').toUpperCase();
  const cat = (profile.power?.category || '').toUpperCase();
  const pillText = cat ? `${rarity} • ${cat}` : rarity;
  ctx.font = '700 18px Orbitron';
  const pillW = ctx.measureText(pillText).width + 40;
  const pillX = 540 - pillW / 2, pillY = 418;
  drawRoundedRect(ctx, pillX, pillY, pillW, 38, 19, color + '18', color + '66');
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(pillText, 540, pillY + 19);

  // Faction
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#8a96b4';
  ctx.font = '500 20px Inter';
  ctx.fillText('FACTION', 96, 520);
  ctx.fillStyle = '#e6ecff';
  ctx.font = '600 26px Inter';
  ctx.fillText(profile.faction?.name || 'Unaffiliated', 96, 552);
  ctx.fillStyle = '#8a96b4';
  ctx.font = '400 20px Inter';
  const factionDesc = profile.faction?.description || '';
  wrapText(ctx, factionDesc, 96, 584, W - 192, 28);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(96, 640, W - 192, 1);

  // Power description
  ctx.fillStyle = '#c8d3f0';
  ctx.font = '400 26px Inter';
  const desc = profile.power?.description || '';
  let nextY = wrapText(ctx, desc, 96, 690, W - 192, 38) + 16;

  // Traits
  ctx.fillStyle = '#8a96b4';
  ctx.font = '600 18px Orbitron';
  ctx.fillText('SIGNATURE TRAITS', 96, nextY);
  nextY += 18;
  const traits = profile.traits || [];
  let tx = 96, ty = nextY + 18;
  ctx.font = '600 18px Orbitron';
  traits.forEach(([name, val]) => {
    const label = `${name.toUpperCase()}: ${val}`;
    const tw = ctx.measureText(label).width + 24;
    if (tx + tw > W - 96) { tx = 96; ty += 44; }
    drawRoundedRect(ctx, tx, ty, tw, 32, 8, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.10)');
    // left accent
    ctx.fillStyle = color;
    ctx.fillRect(tx, ty, 3, 32);
    ctx.fillStyle = '#aab6d6';
    ctx.fillText(label, tx + 12, ty + 21);
    tx += tw + 10;
  });
  ty += 70;

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(96, H - 140, W - 192, 1);
  ctx.fillStyle = '#5a6688';
  ctx.font = '500 16px monospace';
  ctx.textAlign = 'left';
  const date = new Date(profile.generatedAt || Date.now()).toLocaleDateString();
  ctx.fillText(`Generated ${date} • Mode: ${(profile.mode || 'DEEP SCAN').toUpperCase()}`, 96, H - 96);
  ctx.textAlign = 'right';
  ctx.fillText('power-index.local', W - 96, H - 96);
  ctx.fillText('Every choice leaves a signature.', W - 96, H - 68);

  // Bottom brand line
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(200, H - 18, W - 400, 2);

  return canvas;
}

async function downloadDossierImage() {
  const profile = getStoredProfile();
  if (!profile) { alert('Complete a scan first.'); return; }
  const canvas = document.getElementById('dossierCanvas');
  if (!canvas) { alert('Canvas missing'); return; }
  // enrich with mode if available
  if (typeof getCurrentMode === 'function') {
    try { profile.mode = getCurrentMode(); } catch {}
  }
  renderDossierToCanvas(profile, canvas);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  const safeName = (profile.hero || 'dossier').replace(/\s+/g, '_').toLowerCase();
  a.download = `${safeName}_dossier_1080x1350.png`;
  document.body.appendChild(a); a.click(); a.remove();
}

async function shareDossierImage() {
  const profile = getStoredProfile();
  if (!profile) { alert('Complete a scan first.'); return; }
  const canvas = document.getElementById('dossierCanvas');
  renderDossierToCanvas(profile, canvas);
  canvas.toBlob(async (blob) => {
    if (!blob) { downloadDossierImage(); return; }
    const file = new File([blob], 'dossier.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: `${profile.hero} - ${profile.power?.name}`, text: `My Power Index: ${profile.hero} / ${profile.power?.name}` }); return; } catch (e) { /* user cancelled */ }
    }
    downloadDossierImage();
  }, 'image/png');
}
