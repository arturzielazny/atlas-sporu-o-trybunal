'use strict';

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const sourceById = id => SOURCES.find(source => source.id === id);
const topics = {all:'Wszystko',wybory:'Skład i wybory',wyroki:'Wyroki',europa:'Europa',zasady:'Reguły gry'};
const topicNames = {wybory:'Skład i wybory',wyroki:'Orzeczenie TK',europa:'Wymiar europejski',zasady:'Reguły gry'};
const params = new URLSearchParams(location.search);
const state = {
  chapter: CHAPTERS.some(chapter => chapter.id === params.get('chapter')) ? params.get('chapter') : '2015',
  topic: Object.hasOwn(topics, params.get('topic')) ? params.get('topic') : 'all',
  search: (params.get('q') || '').slice(0,200),
  eventIndex: -1,
  seatStep: 2,
  seatSelected: -1
};

function updateUrl(changes) {
  const url = new URL(location.href);
  for (const [key,value] of Object.entries(changes)) {
    if (value === null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key,value);
  }
  history.replaceState(null,'',url);
}

function renderChapters() {
  $('#chapter-nav').innerHTML = CHAPTERS.map((chapter,index) => `<button class="chapter-button ${chapter.id === state.chapter ? 'active' : ''}" data-chapter="${chapter.id}" aria-pressed="${chapter.id === state.chapter}"><span class="chapter-index">0${index+1}</span><span class="chapter-years">${chapter.years}</span><span class="chapter-name">${chapter.name}</span></button>`).join('');
  $('#topic-filters').innerHTML = Object.entries(topics).map(([id,name]) => `<button data-topic="${id}" class="${state.topic === id ? 'active' : ''}" aria-pressed="${state.topic === id}">${name}</button>`).join('');
  const chapter = CHAPTERS.find(chapter => chapter.id === state.chapter);
  const index = CHAPTERS.indexOf(chapter);
  $('#chapter-number').textContent = state.search ? 'W CAŁEJ HISTORII' : `ROZDZIAŁ 0${index+1}`;
  $('#chapter-title').textContent = state.search ? `Wyniki dla: „${state.search}”` : chapter.title;
  $('#chapter-description').textContent = state.search ? 'Wyszukiwanie obejmuje wszystkie rozdziały, opisy wydarzeń, uczestników i konsekwencje.' : chapter.description;
  $('#chapter-position').textContent = `0${index+1} / 06`;
  $('#previous-chapter').disabled = index === 0;
  $('#next-chapter').disabled = index === CHAPTERS.length-1;
}

const normalize = text => text.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ł','l');

function getVisibleEvents() {
  const query = normalize(state.search.trim());
  return EVENTS.filter(event => {
    const inChapter = query || event.chapter === state.chapter;
    const inTopic = state.topic === 'all' || event.type === state.topic;
    const searchText = normalize([event.title,event.summary,event.detail,event.effect,event.actor,event.year,event.date].join(' '));
    return inChapter && inTopic && (!query || searchText.includes(query));
  });
}

function renderTimeline() {
  renderChapters();
  const events = getVisibleEvents();
  $('#results-count').textContent = `${events.length} ${events.length === 1 ? 'wydarzenie' : events.length > 1 && events.length < 5 ? 'wydarzenia' : 'wydarzeń'} · ${state.search ? 'wszystkie rozdziały' : CHAPTERS.find(chapter => chapter.id === state.chapter).years}`;
  $('#timeline').innerHTML = events.map(event => `<article class="timeline-event"><div class="event-date"><time datetime="${event.id}">${event.date}</time><span>${event.year}</span></div><i class="event-dot" aria-hidden="true"></i><div class="event-card"><div class="event-card-top"><span class="event-tag tag-${event.type}">${topicNames[event.type]}</span><span class="party-badge"><i class="${event.color}" aria-hidden="true"></i>${event.actor}</span></div><h4>${event.title}</h4><p>${event.summary}</p><div class="event-card-bottom"><p class="event-effect"><strong>ZNACZENIE</strong><span>${event.effect}</span></p><button class="event-open" data-event="${event.id}" aria-label="Szczegóły: ${escapeHtml(event.title)}">Czytaj dalej <span>↗</span></button></div></div></article>`).join('');
  $('#empty-results').hidden = events.length !== 0;
  updateUrl({chapter:state.chapter,topic:state.topic === 'all' ? null : state.topic,q:state.search || null});
}

function selectChapter(id,scroll = false) {
  state.chapter = id;
  state.search = '';
  state.topic = 'all';
  $('#timeline-search').value = '';
  renderTimeline();
  if (scroll) $('#chapter-nav').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
}

$('#chapter-nav').addEventListener('click',event => {
  const button = event.target.closest('[data-chapter]');
  if (button) selectChapter(button.dataset.chapter);
});
$('#topic-filters').addEventListener('click',event => {
  const button = event.target.closest('[data-topic]');
  if (button) {state.topic=button.dataset.topic;renderTimeline();}
});
$('#timeline-search').value = state.search;
$('#timeline-search').addEventListener('input',event => {
  state.search=event.target.value.slice(0,200);
  renderTimeline();
});
$('#clear-search').addEventListener('click',() => {state.search='';state.topic='all';$('#timeline-search').value='';renderTimeline();});
$('#previous-chapter').addEventListener('click',() => {const index=CHAPTERS.findIndex(chapter=>chapter.id===state.chapter);if(index>0)selectChapter(CHAPTERS[index-1].id,true);});
$('#next-chapter').addEventListener('click',() => {const index=CHAPTERS.findIndex(chapter=>chapter.id===state.chapter);if(index<CHAPTERS.length-1)selectChapter(CHAPTERS[index+1].id,true);});

function openEvent(id) {
  const index = EVENTS.findIndex(event => event.id === id);
  if (index < 0) return;
  state.eventIndex = index;
  const event = EVENTS[index];
  $('#dialog-category').textContent = topicNames[event.type];
  $('#dialog-category').className = `event-tag tag-${event.type}`;
  $('#dialog-date').textContent = `${event.date} ${event.year} · ${event.actor}`;
  $('#dialog-title').textContent = event.title;
  $('#dialog-body').innerHTML = `<p class="dialog-lead">${event.summary}</p><h3>Co się wydarzyło?</h3><p class="dialog-detail">${event.detail}</p><div class="dialog-consequence"><strong>Co to zmieniło?</strong>${event.effect}</div>${event.positionNote?`<p class="dialog-position-note">${event.positionNote}</p>`:''}<h3>Sprawdź źródła</h3>${event.sources.map(id=>{const source=sourceById(id);return `<a class="dialog-source" href="${source.url}" target="_blank" rel="noopener noreferrer"><span>${source.title}<br><small>${source.institution} · ${source.date}</small></span><span>↗</span></a>`;}).join('')}`;
  $('#dialog-prev').disabled = index === 0;
  $('#dialog-next').disabled = index === EVENTS.length-1;
  $('#dialog-position').textContent = `${index+1} / ${EVENTS.length}`;
  const dialog = $('#event-dialog');
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  updateUrl({event:id});
}

document.addEventListener('click',event => {
  const button = event.target.closest('[data-event]');
  if (button) openEvent(button.dataset.event);
});
$('#close-dialog').addEventListener('click',() => $('#event-dialog').close());
$('#event-dialog').addEventListener('close',() => updateUrl({event:null}));
$('#event-dialog').addEventListener('click',event => {if(event.target === $('#event-dialog')) {const bounds=event.target.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)event.target.close();}});
$('#dialog-prev').addEventListener('click',() => {if(state.eventIndex>0)openEvent(EVENTS[state.eventIndex-1].id);});
$('#dialog-next').addEventListener('click',() => {if(state.eventIndex<EVENTS.length-1)openEvent(EVENTS[state.eventIndex+1].id);});

const seatIcon = '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M7 21v-7m16 7v-7M10 16V8a5 5 0 0 1 10 0v8M8 22h14v-6H8v6Zm2 0v5m10-5v5M4 14h6m10 0h6"/></svg>';
const seatSteps = [
  {label:'WYBÓR SEJMU VII KADENCJI',title:'Jeden wybór obejmuje pięć miejsc.',description:'PO–PSL popiera wybór całej piątki. Trzy kadencje kończą się jeszcze w czasie starego Sejmu, dwie już za nowego. Prezydent nie odbiera ślubowań.',classes:['blue','blue','blue','orange','orange'],names:['Roman Hauser','Andrzej Jakubecki','Krzysztof Ślebzak','Bronisław Sitek','Andrzej Sokala'],statuses:['Listopad','Listopad','Listopad','Grudzień','Grudzień']},
  {label:'PONOWNY WYBÓR SEJMU VIII KADENCJI',title:'Nowa większość wybiera kolejną piątkę.',description:'Sejm z większością PiS wybiera pięć osób. Trzy wybory nakładają się na obsadzone miejsca listopadowe. To źródło określenia „dublerzy”.',classes:['red','red','red','blue','blue'],names:['Henryk Cioch','Lech Morawski','Mariusz Muszyński','Piotr Pszczółkowski','Julia Przyłębska'],statuses:['Spór','Spór','Spór','Wybór','Wybór']},
  {label:'WYROK TK · K 34/15',title:'Trzy miejsca ≠ dwa miejsca',description:'TK rozróżnia podstawy prawne: zgodna z Konstytucją dla trzech miejsc listopadowych, niezgodna dla dwóch grudniowych. Wyrok kontroluje przepisy ustawy.',classes:['blue','blue','blue','orange','orange'],names:['Roman Hauser','Andrzej Jakubecki','Krzysztof Ślebzak','Bronisław Sitek','Andrzej Sokala'],statuses:['Zgodna','Zgodna','Zgodna','Niezgodna','Niezgodna']}
];

function renderSeats() {
  const step=seatSteps[state.seatStep];
  document.querySelectorAll('[data-seat-step]').forEach(button=>{const active=Number(button.dataset.seatStep)===state.seatStep;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  $('#seat-stage-label').textContent=step.label;
  $('#seat-stage-title').textContent=step.title;
  $('#seat-stage-description').textContent=step.description;
  $('#five-seats').innerHTML=step.names.map((name,index)=>`<button class="seat ${step.classes[index]} ${index===state.seatSelected?'selected':''}" data-seat="${index}" aria-pressed="${index===state.seatSelected}" aria-label="${name}: ${step.statuses[index]}">${seatIcon}<span>${step.statuses[index]}</span></button>`).join('');
  if(state.seatSelected<0)$('#seat-detail').innerHTML='<strong>Każde miejsce ma swoją historię.</strong>Wybierz jeden z pięciu foteli, aby zobaczyć nazwisko i kontekst.';
  else {
    const index=state.seatSelected;
    let text;
    if(state.seatStep===0)text=index<3?'Wybrany 8 października na jedno z trzech miejsc listopadowych.':'Wybrany 8 października na jedno z dwóch miejsc grudniowych.';
    else if(state.seatStep===1)text=index<3?'Wybór dotyczy grupy trzech miejsc już obsadzonych w październiku.':'Wybór dotyczy grupy dwóch miejsc zwalnianych w grudniu.';
    else text=index<3?'K 34/15 potwierdza konstytucyjność podstawy prawnej wyboru na tę grupę miejsc.':'K 34/15 kwestionuje podstawę wyboru dokonanego przez odchodzący Sejm na tę grupę miejsc.';
    $('#seat-detail').innerHTML=`<strong>${step.names[index]}</strong>${text}`;
  }
}
document.querySelectorAll('[data-seat-step]').forEach(button=>button.addEventListener('click',()=>{state.seatStep=Number(button.dataset.seatStep);state.seatSelected=-1;renderSeats();}));
$('#five-seats').addEventListener('click',event=>{const button=event.target.closest('[data-seat]');if(button){state.seatSelected=Number(button.dataset.seat);renderSeats();$('#five-seats').querySelector(`[data-seat="${state.seatSelected}"]`).focus({preventScroll:true});}});

function renderActor(id) {
  const actor=ACTORS[id];
  if(!actor)return;
  document.querySelectorAll('[data-actor]').forEach(button=>{const active=button.dataset.actor===id;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  $('#actor-detail').innerHTML=`<p class="eyebrow">${actor.label}</p><h3>${actor.title}</h3><p>${actor.description}</p><div class="actor-powers"><span>ROLA W KONFLIKCIE</span><p>${actor.context}</p></div><a class="text-link" href="${sourceById(actor.source).url}" target="_blank" rel="noopener noreferrer">${actor.link} <span>↗</span></a>`;
}
document.querySelectorAll('[data-actor]').forEach(button=>button.addEventListener('click',()=>renderActor(button.dataset.actor)));

function renderSources() {
  const filter=$('#source-filter').value;
  const sources=SOURCES.filter(source=>filter==='all'||source.group===filter);
  $('#source-count').textContent=`${sources.length} dokumentów`;
  $('#source-list').innerHTML=sources.map(source=>`<a class="source-item" href="${source.url}" target="_blank" rel="noopener noreferrer"><span>${String(SOURCES.indexOf(source)+1).padStart(2,'0')}</span><div><h3>${source.title}</h3><p>${source.date} · ${source.note}</p></div><span class="source-institution">${source.institution}</span><span class="source-arrow" aria-hidden="true">↗</span></a>`).join('');
}
$('#source-filter').addEventListener('change',renderSources);

$('.menu-toggle').addEventListener('click',()=>{const menu=$('#mobile-nav');menu.hidden=!menu.hidden;$('.menu-toggle').setAttribute('aria-expanded',String(!menu.hidden));$('.menu-toggle').setAttribute('aria-label',menu.hidden?'Otwórz menu':'Zamknij menu');});
$('#mobile-nav').querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Otwórz menu');}));

let scrollQueued=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#reading-progress').style.width=`${max>0?Math.min(100,Math.max(0,scrollY/max*100)):0}%`;scrollQueued=false;}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress);

renderTimeline();
renderSeats();
renderActor('sejm');
renderSources();
updateProgress();
if(params.get('event'))openEvent(params.get('event'));
