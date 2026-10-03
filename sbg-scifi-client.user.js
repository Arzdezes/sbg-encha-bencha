// ==UserScript==
// @name         SBG Sci-Fi Client
// @namespace    https://github.com/Arzdezes/sbg-encha-bencha
// @version      0.7.0
// @description  Visual-only SBG client shell. No automation or gameplay advantage.
// @author       Arzdezes
// @match        https://sbg-game.ru/app/*
// @match        https://beta.sbg-game.ru/app/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/* ===== SBG SCI-FI SHELL v0.4 / visual-only profiles ===== */
(function () {
  'use strict';
  if (window.__SBG_SCIFI_SHELL__) return;
  window.__SBG_SCIFI_SHELL__ = '0.4';

  const PROFILE_KEY = 'sbg_scifi_profile';
  const PROFILES = ['minimal','balanced','full'];
  const LABELS = {minimal:'MIN',balanced:'BAL',full:'FULL'};
  const DESCR = {minimal:'LOW POWER',balanced:'BALANCED',full:'FULL FX'};
  function loadProfile(){const p=localStorage.getItem(PROFILE_KEY);return PROFILES.includes(p)?p:'balanced'}
  let profile = loadProfile();

  const CSS = `
  :root{--shell-cyan:#63f4ff;--shell-cyan2:#c8feff;--shell-dim:rgba(99,244,255,.22);--shell-bg:rgba(2,12,16,.58)}
  #sbg-shell-overlay{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--shell-cyan)}
  #sbg-shell-overlay::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.010) 0 1px,transparent 1px 6px);opacity:.22}
  .sbg-shell-corner{position:absolute;width:34px;height:34px;opacity:.72}
  .sbg-shell-corner.tl{left:10px;top:10px;border-left:1px solid var(--shell-cyan);border-top:1px solid var(--shell-cyan)}
  .sbg-shell-corner.tr{right:10px;top:10px;border-right:1px solid var(--shell-cyan);border-top:1px solid var(--shell-cyan)}
  .sbg-shell-corner.bl{left:10px;bottom:10px;border-left:1px solid var(--shell-cyan);border-bottom:1px solid var(--shell-cyan)}
  .sbg-shell-corner.br{right:10px;bottom:10px;border-right:1px solid var(--shell-cyan);border-bottom:1px solid var(--shell-cyan)}
  #sbg-shell-status{position:absolute;top:11px;left:50%;transform:translateX(-50%);padding:3px 10px;border-left:1px solid var(--shell-dim);border-right:1px solid var(--shell-dim);background:linear-gradient(90deg,transparent,var(--shell-bg),transparent);font-size:10px;letter-spacing:.16em;white-space:nowrap;opacity:.84}
  #sbg-shell-gps{position:absolute;bottom:14px;left:14px;padding:3px 6px;border-left:2px solid var(--shell-cyan);background:linear-gradient(90deg,rgba(0,20,26,.72),transparent);font-size:9px;letter-spacing:.08em;opacity:.68}
  #sbg-shell-mode{position:absolute;bottom:14px;right:14px;padding:3px 6px;border-right:2px solid var(--shell-cyan);background:linear-gradient(270deg,rgba(0,20,26,.72),transparent);font-size:9px;letter-spacing:.08em;opacity:.68;text-align:right}
  #sbg-shell-scan{position:absolute;left:0;right:0;height:1px;top:-3%;background:linear-gradient(90deg,transparent,var(--shell-cyan),transparent);opacity:.18;animation:sbg-shell-scan 9.5s linear infinite}
  @keyframes sbg-shell-scan{0%{top:-3%;opacity:0}8%{opacity:.18}92%{opacity:.18}100%{top:103%;opacity:0}}

  #sbg-shell-profile{position:fixed;z-index:2147483400;right:11px;top:54px;pointer-events:auto;border:1px solid rgba(99,244,255,.28);background:rgba(0,16,20,.72);color:#aefaff;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.10em;padding:6px 7px;border-radius:2px;opacity:.72;-webkit-tap-highlight-color:transparent}
  #sbg-shell-profile:active{opacity:1}

  #sbg-shell-boot{position:fixed;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;background:#010607;color:var(--shell-cyan);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;pointer-events:none;transition:opacity .45s ease,visibility .45s ease}
  #sbg-shell-boot.off{opacity:0;visibility:hidden}
  .sbg-shell-bootbox{width:min(78vw,350px);border:1px solid rgba(99,244,255,.26);padding:14px;background:rgba(0,18,22,.42)}
  .sbg-shell-title{font-size:14px;letter-spacing:.22em;text-align:center}.sbg-shell-sub{font-size:8px;opacity:.58;letter-spacing:.10em;text-align:center;margin-top:6px}
  .sbg-shell-bar{height:2px;margin-top:12px;background:rgba(99,244,255,.10);overflow:hidden}.sbg-shell-bar>i{display:block;height:100%;width:0;background:var(--shell-cyan);animation:sbg-shell-load 1.1s linear forwards}
  @keyframes sbg-shell-load{to{width:100%}}.sbg-shell-log{margin-top:10px;font-size:8px;line-height:1.55;opacity:.50;white-space:pre-line}

  .sbg-shell-ripple{position:fixed;width:6px;height:6px;border:1px solid rgba(99,244,255,.72);border-radius:50%;transform:translate(-50%,-50%) scale(1);z-index:2147483200;pointer-events:none;animation:sbg-shell-ripple .34s linear forwards}
  @keyframes sbg-shell-ripple{to{transform:translate(-50%,-50%) scale(4.4);opacity:0}}
  .sbg-shell-detected{animation:sbg-shell-detected .26s linear}@keyframes sbg-shell-detected{0%{filter:brightness(1)}35%{filter:brightness(1.12)}100%{filter:brightness(1)}}
  .sbg-shell-event{position:fixed;left:50%;top:50%;z-index:2147483300;pointer-events:none;transform:translate(-50%,-50%);width:16px;height:16px;border:1px solid var(--shell-cyan);border-radius:50%;animation:sbg-shell-event-ring .55s linear forwards}
  @keyframes sbg-shell-event-ring{0%{opacity:0;transform:translate(-50%,-50%) scale(.65)}15%{opacity:.92}100%{opacity:0;transform:translate(-50%,-50%) scale(6.5)}}
  .sbg-shell-event.attack{border-color:#ff7464}.sbg-shell-event.draw{border-color:#7cff95}.sbg-shell-event.deploy{border-color:#ffd45a}
  .sbg-shell-flash{position:fixed;inset:0;z-index:2147483190;pointer-events:none;background:rgba(99,244,255,.035);animation:sbg-shell-flash .18s linear forwards}.sbg-shell-flash.attack{background:rgba(255,100,90,.05)}.sbg-shell-flash.draw{background:rgba(80,255,130,.045)}.sbg-shell-flash.deploy{background:rgba(255,212,90,.045)}@keyframes sbg-shell-flash{from{opacity:1}to{opacity:0}}
  .sbg-shell-toast{position:fixed;left:50%;top:19%;transform:translateX(-50%);z-index:2147483350;pointer-events:none;padding:5px 12px;border-top:1px solid rgba(99,244,255,.32);border-bottom:1px solid rgba(99,244,255,.22);background:linear-gradient(90deg,transparent,rgba(0,16,20,.76),transparent);font:700 9px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.16em;color:var(--shell-cyan2);white-space:nowrap;animation:sbg-shell-toast .82s linear forwards}@keyframes sbg-shell-toast{0%{opacity:0;transform:translate(-50%,-4px)}15%{opacity:1;transform:translate(-50%,0)}70%{opacity:.95}100%{opacity:0;transform:translate(-50%,2px)}}

  .info.popup:not(.hidden),.popup:not(.hidden),.modal:not(.hidden){box-shadow:0 0 0 1px rgba(99,244,255,.10)!important}.attack-slider-wrp:not(.hidden){box-shadow:0 -1px 0 rgba(255,100,80,.22)!important}.draw-slider-wrp:not(.hidden){box-shadow:0 -1px 0 rgba(100,255,150,.20)!important}

  /* Minimal: no continuous animation, no scanlines, no touch ripples or fullscreen flashes. */
  .sbgfx-minimal #sbg-shell-scan,.sbgfx-minimal #sbg-shell-overlay::before{display:none}.sbgfx-minimal .sbg-shell-ripple,.sbgfx-minimal .sbg-shell-flash{display:none}.sbgfx-minimal .sbg-shell-corner{opacity:.45}.sbgfx-minimal .sbg-shell-event{animation-duration:.30s}.sbgfx-minimal .sbg-shell-toast{animation-duration:.58s}
  /* Balanced = default lightweight look. */
  .sbgfx-balanced #sbg-shell-scan{animation-duration:9.5s;opacity:.16}
  /* Full: richer but still avoids blur/backdrop-filter. */
  .sbgfx-full #sbg-shell-overlay::before{opacity:.38}.sbgfx-full #sbg-shell-scan{animation-duration:5.4s;opacity:.42;box-shadow:0 0 8px rgba(99,244,255,.24)}.sbgfx-full .sbg-shell-corner{width:46px;height:46px;opacity:.88}.sbgfx-full .sbg-shell-event{animation-duration:.72s;box-shadow:0 0 12px rgba(99,244,255,.35)}.sbgfx-full .sbg-shell-toast{text-shadow:0 0 6px rgba(99,244,255,.45)}
  `;

  const q=(s)=>document.querySelector(s);
  let statusTimer=null,lastPopup=null,attackOpen=false,drawOpen=false,pendingPanelCheck=0,lastRipple=0,lastFxAt=0,lastFxKind='';

  function applyProfile(next,announce=true){
    profile=next; localStorage.setItem(PROFILE_KEY,profile);
    document.documentElement.classList.remove('sbgfx-minimal','sbgfx-balanced','sbgfx-full');
    document.documentElement.classList.add('sbgfx-'+profile);
    const b=q('#sbg-shell-profile'); if(b)b.textContent='FX // '+LABELS[profile];
    if(announce)setStatus('RENDER // '+DESCR[profile],1100);
  }
  function cycleProfile(){const i=PROFILES.indexOf(profile);applyProfile(PROFILES[(i+1)%PROFILES.length]);}
  function setStatus(text,timeout=950){const el=q('#sbg-shell-status');if(!el)return;clearTimeout(statusTimer);el.textContent=text;el.style.opacity='1';statusTimer=setTimeout(()=>{el.textContent='SBG // FIELD SCANNER';el.style.opacity='.84'},timeout)}
  function setMode(text){const el=q('#sbg-shell-mode');if(el)el.textContent=text}
  function eventFx(kind,label){const now=Date.now();if(now-lastFxAt<200&&kind===lastFxKind)return;lastFxAt=now;lastFxKind=kind;const ring=document.createElement('div');ring.className='sbg-shell-event '+(kind||'');document.body.appendChild(ring);if(profile!=='minimal'){const flash=document.createElement('div');flash.className='sbg-shell-flash '+(kind||'');document.body.appendChild(flash);setTimeout(()=>flash.remove(),240)}const toast=document.createElement('div');toast.className='sbg-shell-toast';toast.textContent=label;document.body.appendChild(toast);setTimeout(()=>ring.remove(),profile==='minimal'?360:760);setTimeout(()=>toast.remove(),profile==='minimal'?650:950);setStatus(label,800)}
  function normText(el){return((el&&(el.getAttribute?.('aria-label')||el.title||el.textContent))||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function classifyAction(target){const el=target instanceof Element?target.closest('button,[role="button"],input[type="button"],input[type="submit"],.attack-slider-wrp,.draw-slider-wrp,.deploy-slider-wrp'):null;if(!el)return null;if(el.closest('.attack-slider-wrp')||el.id==='attack-menu'||/attack|fire|огонь|ата(ка|ков)/i.test(normText(el)))return['attack','ATTACK // PULSE'];if(el.closest('.draw-slider-wrp')||el.id==='draw'||/draw|link|связ|рисова/i.test(normText(el)))return['draw','LINK // TRACE'];if(el.id==='magic-deploy-btn'||el.closest('.deploy-slider-wrp')||/deploy|установ|развер|ядро/i.test(normText(el)))return['deploy','POINT // DEPLOY'];if(/repair|заряд|recharge|почин/i.test(normText(el)))return['','POINT // SERVICE'];return null}
  function updatePanels(){pendingPanelCheck=0;const a=!!q('.attack-slider-wrp:not(.hidden)'),d=!!q('.draw-slider-wrp:not(.hidden)');if(a!==attackOpen){attackOpen=a;if(a){setMode('MODE // ATTACK');setStatus('TARGETING // ACTIVE')}else if(!d)setMode('MODE // SCAN')}if(d!==drawOpen){drawOpen=d;if(d){setMode('MODE // LINK');setStatus('LINK TRACE // ACTIVE')}else if(!a)setMode('MODE // SCAN')}const popup=q('.info.popup:not(.hidden), .popup:not(.hidden), .modal:not(.hidden)');if(popup&&popup!==lastPopup){lastPopup=popup;if(profile!=='minimal'){popup.classList.add('sbg-shell-detected');setTimeout(()=>popup.classList.remove('sbg-shell-detected'),280)}setStatus('POINT // ACQUIRED',780)}if(!popup)lastPopup=null}
  function scheduleUpdatePanels(){if(pendingPanelCheck)return;pendingPanelCheck=setTimeout(updatePanels,profile==='minimal'?220:120)}

  function mount(){
    if(!document.head||!document.body)return false;if(q('#sbg-shell-overlay'))return true;
    const style=document.createElement('style');style.id='sbg-shell-style';style.textContent=CSS;document.head.appendChild(style);
    const overlay=document.createElement('div');overlay.id='sbg-shell-overlay';overlay.innerHTML='<div class="sbg-shell-corner tl"></div><div class="sbg-shell-corner tr"></div><div class="sbg-shell-corner bl"></div><div class="sbg-shell-corner br"></div><div id="sbg-shell-status">SBG // FIELD SCANNER</div><div id="sbg-shell-gps">GPS LINK // ACQUIRING</div><div id="sbg-shell-mode">MODE // SCAN</div><div id="sbg-shell-scan"></div>';document.body.appendChild(overlay);
    const btn=document.createElement('button');btn.id='sbg-shell-profile';btn.type='button';btn.textContent='FX // '+LABELS[profile];btn.setAttribute('aria-label','Change visual effects profile');btn.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();cycleProfile()});document.body.appendChild(btn);
    applyProfile(profile,false);
    const boot=document.createElement('div');boot.id='sbg-shell-boot';boot.innerHTML='<div class="sbg-shell-bootbox"><div class="sbg-shell-title">SBG // SCANNER</div><div class="sbg-shell-sub">TACTICAL GEO INTERFACE · v0.4</div><div class="sbg-shell-bar"><i></i></div><div class="sbg-shell-log">CORE .... ONLINE\nGEO ..... LINK\nEVENT ... PASSIVE\nRENDER .. '+DESCR[profile]+'</div></div>';document.body.appendChild(boot);setTimeout(()=>boot.classList.add('off'),profile==='minimal'?900:1250);setTimeout(()=>boot.remove(),profile==='minimal'?1250:1750);
    document.addEventListener('pointerdown',(e)=>{if(profile==='minimal'||e.target===btn)return;const now=Date.now();if(now-lastRipple<140)return;lastRipple=now;const r=document.createElement('div');r.className='sbg-shell-ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),380)},{passive:true});
    document.addEventListener('click',(e)=>{if(e.target===btn)return;const action=classifyAction(e.target);if(action)eventFx(action[0],action[1])},{capture:false,passive:true});
    const gps=q('#sbg-shell-gps');if(navigator.geolocation&&gps){try{navigator.geolocation.watchPosition((p)=>{const a=Math.round(p.coords.accuracy||0);gps.textContent='GPS LINK // ±'+a+'m'},()=>{gps.textContent='GPS LINK // DEGRADED'},{enableHighAccuracy:false,maximumAge:profile==='minimal'?30000:20000,timeout:12000})}catch(_){}}
    const obs=new MutationObserver(()=>scheduleUpdatePanels());obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});updatePanels();return true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
