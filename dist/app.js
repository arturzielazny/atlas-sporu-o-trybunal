'use strict';

const $ = selector => document.querySelector(selector);
const sourceById = id => SOURCES.find(source => source.id === id);
const topicNames = {wybory:'Skład i wybory',wyroki:'Orzeczenie TK',europa:'Wymiar europejski',zasady:'Reguły gry'};
const politicalParties = {
  po:{name:'PO / większość PO–PSL',logo:'assets/po.svg',alt:'PO'},
  ko:{name:'KO / koalicja rządowa',logo:'assets/ko.svg',alt:'KO'},
  pis:{name:'Obóz PiS',logo:'assets/pis.svg',alt:'PiS'}
};

function partyBadge(event) {
  const party=politicalParties[event.color];
  if(!party)return `<span class="party-badge"><i class="${event.color}" aria-hidden="true"></i>${event.actor}</span>`;
  return `<span class="party-badge party-badge-${event.color}" title="Oznaczenie obozu politycznego; nie przynależności partyjnej sędziego"><img src="${party.logo}" alt="${party.alt}" width="60" height="24"><span>${event.actor}</span></span>`;
}

function sourceLinks(ids) {
  return ids.map(id=>{const source=sourceById(id);return `<a class="context-source" href="${source.url}" target="_blank" rel="noopener noreferrer"><span>${source.title}<small>${source.institution} · ${source.date}</small></span><span aria-hidden="true">↗</span></a>`;}).join('');
}

function eventContext(event,summary='Rozwiń kontekst wydarzenia') {
  return `<details class="event-context"><summary><span>${summary}</span><span aria-hidden="true">+</span></summary><div class="event-context-body"><p>${event.detail}</p>${event.positionNote?`<p class="context-note">${event.positionNote}</p>`:''}<p class="context-source-label">Dokumenty źródłowe</p>${sourceLinks(event.sources)}</div></details>`;
}

function renderTimeline() {
  $('#timeline').innerHTML=CHAPTERS.map((chapter,index)=>`<section class="history-chapter" aria-labelledby="history-chapter-${chapter.id}"><header class="history-chapter-heading"><p>ROZDZIAŁ ${String(index+1).padStart(2,'0')} / 06 <span>${chapter.years}</span></p><h3 id="history-chapter-${chapter.id}">${chapter.title}</h3><p>${chapter.description}</p></header><div class="chapter-events">${EVENTS.filter(event=>event.chapter===chapter.id).map(event=>`<article class="timeline-event" data-party="${politicalParties[event.color]?event.color:'neutral'}"><div class="event-date"><time datetime="${event.id}">${event.date}</time><span>${event.year}</span></div><i class="event-dot" aria-hidden="true"></i><div class="event-card"><div class="event-card-top"><span class="event-tag tag-${event.type}">${topicNames[event.type]}</span>${partyBadge(event)}</div><h4>${event.title}</h4><p>${event.summary}</p><p class="event-effect"><strong>ZNACZENIE</strong><span>${event.effect}</span></p>${eventContext(event)}</div></article>`).join('')}</div></section>`).join('');
}

const seatIcon='<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M7 21v-7m16 7v-7M10 16V8a5 5 0 0 1 10 0v8M8 22h14v-6H8v6Zm2 0v5m10-5v5M4 14h6m10 0h6"/></svg>';
const seatSteps=[
  {party:'po',date:'8 października 2015',iso:'2015-10-08',label:'WYBÓR SEJMU VII KADENCJI',title:'PO–PSL wybiera pięć osób.',description:'Odchodząca większość wybiera następców na wszystkie pięć miejsc zwalnianych w 2015 roku. Trzy kadencje kończą się jeszcze za starego Sejmu, dwie dopiero za nowego.',classes:['orange','orange','orange','orange','orange'],names:['Roman Hauser','Andrzej Jakubecki','Krzysztof Ślebzak','Bronisław Sitek','Andrzej Sokala'],statuses:['XI','XI','XI','XII','XII'],groups:['Trzy miejsca listopadowe','Dwa miejsca grudniowe'],consequence:'Tu zaczyna się problem wyboru dwóch osób „na zapas”. Prezydent Andrzej Duda nie odbiera ślubowań od całej piątki.',sources:['info2015','k3415']},
  {party:'pis',date:'2 grudnia 2015',iso:'2015-12-02',label:'PONOWNY WYBÓR SEJMU VIII KADENCJI',title:'PiS wybiera kolejną piątkę.',description:'Nowa większość kwestionuje wszystkie październikowe wybory. Wybiera pięć kolejnych osób — także na trzy miejsca obsadzone już w październiku.',classes:['blue disputed-seat','blue disputed-seat','blue disputed-seat','blue','blue'],names:['Henryk Cioch','Lech Morawski','Mariusz Muszyński','Piotr Pszczółkowski','Julia Przyłębska'],statuses:['Spór','Spór','Spór','Wybór','Wybór'],groups:['Trzy wybory na miejsca już obsadzone','Dwa wybory na miejsca grudniowe'],consequence:'Spór obejmuje teraz również nakładające się wybory na trzy miejsca. To źródło określenia „dublerzy”.',sources:['info2015','k3415']},
  {date:'3 grudnia 2015',iso:'2015-12-03',label:'WYROK TRYBUNAŁU KONSTYTUCYJNEGO · K 34/15',title:'TK ocenia podstawę październikowego wyboru.',sources:['k3415']}
];
let revealedSteps=1;

function renderSeatsForStep(step) {
  return `<p class="story-selection-label">Kogo wybrano w tym kroku?</p><div class="five-seats story-seats" role="list" aria-label="Pięć miejsc objętych tym wyborem">${step.names.map((name,index)=>`<div class="seat ${step.classes[index]}" role="listitem" aria-label="${name}: ${index<3?step.groups[0]:step.groups[1]}">${seatIcon}<span>${step.statuses[index]}</span></div>`).join('')}</div><div class="story-seat-groups"><div><strong>${step.groups[0]}</strong><p>${step.names.slice(0,3).join(', ')}</p></div><div><strong>${step.groups[1]}</strong><p>${step.names.slice(3).join(', ')}</p></div></div>`;
}

function renderJudgment() {
  return `<div class="judgment-author"><span>KTO WYDAŁ OCENĘ?</span><p><strong>Trybunał Konstytucyjny</strong><br>Wyrok z 3 grudnia 2015 r., sygnatura K 34/15.</p></div><div class="judgment-scope"><span>KTÓREGO WYBORU DOTYCZY OCENA?</span>${partyBadge({color:'po',actor:'Pięć osób wybranych przez PO–PSL 8 października — z kroku 1.'})}<p>TK badał przepis ustawy, który pozwolił na ten wybór. Poniżej oceniono <strong>podstawę prawną październikowego wyboru</strong>, a nie całą piątkę wybraną przez PiS 2 grudnia.</p></div><div class="judgment-groups"><article class="judgment-group judgment-valid"><div class="judgment-count"><strong>3</strong><span>osoby z wyboru<br>8 października</span></div><p class="judgment-result">Według TK:<strong>podstawa wyboru zgodna z Konstytucją</strong></p><p>Chodzi o miejsca po sędziach, których kadencje kończyły się 6 listopada, jeszcze za starego Sejmu. <strong>Odchodzący Sejm miał prawo obsadzić te trzy miejsca.</strong></p><ul><li>Roman Hauser</li><li>Andrzej Jakubecki</li><li>Krzysztof Ślebzak</li></ul></article><article class="judgment-group judgment-invalid"><div class="judgment-count"><strong>2</strong><span>osoby z wyboru<br>8 października</span></div><p class="judgment-result">Według TK:<strong>podstawa wyboru niezgodna z Konstytucją</strong></p><p>Chodzi o miejsca zwalniane w grudniu, już za nowego Sejmu. To te dwa wybory „na zapas”. <strong>Te miejsca powinien obsadzić nowy Sejm.</strong></p><ul><li>Bronisław Sitek</li><li>Andrzej Sokala</li></ul></article></div><div class="judgment-takeaway"><h4>Co z tego wynika?</h4><p>Ocena październikowej piątki jest różna: <strong>trzy miejsca miały konstytucyjną podstawę wyboru, dwa jej nie miały.</strong> TK wskazał też obowiązek niezwłocznego odebrania ślubowania od prawidłowo wybranych sędziów.</p></div>`;
}

function renderSeatStory() {
  $('#seat-story-steps').innerHTML=seatSteps.map((step,index)=>`<article id="seat-step-${index+1}" class="seat-story-step ${index===2?'seat-story-judgment':''}" data-story-step="${index+1}" ${index>0?'hidden':''} aria-labelledby="seat-story-title-${index+1}"><header class="story-step-header"><span class="story-step-number">${index+1}</span><div><p>KROK ${index+1} Z 3</p><time datetime="${step.iso}">${step.date}</time></div></header><p class="story-step-label">${step.label}</p><h3 id="seat-story-title-${index+1}" tabindex="-1">${step.title}</h3>${index<2?`<div class="story-step-party">${partyBadge({color:step.party,actor:politicalParties[step.party].name})}</div><p class="story-step-description">${step.description}</p>${renderSeatsForStep(step)}<div class="story-step-consequence"><strong>Dlaczego to ważne?</strong><p>${step.consequence}</p></div>`:renderJudgment()}<details class="story-step-sources"><summary>Dokumenty do tego kroku <span aria-hidden="true">+</span></summary>${sourceLinks(step.sources)}</details>${index<2?`<div class="story-step-next"><p>To jeszcze nie koniec. <strong>Naciśnij przycisk, żeby odsłonić dalszy ciąg poniżej.</strong></p><button type="button" class="reveal-step ${index===0?'reveal-pis':'reveal-judgment'}" data-reveal-step="${index+2}" aria-controls="seat-step-${index+2}" aria-expanded="false"><span>Kliknij, aby odsłonić krok ${index+2}<small>${seatSteps[index+1].date} · ${index===0?'Ponowny wybór PiS':'Wyrok TK'}</small></span><span aria-hidden="true">↓</span></button></div>`:`<p class="story-complete"><span aria-hidden="true">✓</span> Znasz trzy etapy. Przewijaj dalej — teraz zobaczysz obecną sytuację.</p>`}</article>`).join('');
}

$('#seat-story-steps').addEventListener('click',event=>{
  const button=event.target.closest('[data-reveal-step]');
  if(!button)return;
  const next=Number(button.dataset.revealStep);
  if(next!==revealedSteps+1||next>seatSteps.length)return;
  const target=$(`#seat-step-${next}`);
  target.hidden=false;
  revealedSteps=next;
  button.closest('.story-step-next').innerHTML=`<p class="story-revealed"><span aria-hidden="true">✓</span> Krok ${next} jest odsłonięty poniżej. Przewiń dalej, aby go przeczytać. <span aria-hidden="true">↓</span></p>`;
  $('#seat-story-progress').textContent=`Odsłonięto ${next} z 3 kroków. ${next===3?'Wszystkie etapy są widoczne.':'Kolejny krok odsłonisz przyciskiem pod drugą kartą.'}`;
  target.querySelector('h3').focus({preventScroll:true});
  updateProgress();
});

function renderActors() {
  $('#actor-list').innerHTML=Object.entries(ACTORS).map(([id,actor],index)=>`<article class="actor-reading-card" aria-labelledby="actor-title-${id}"><p class="actor-reading-label"><span>${String(index+1).padStart(2,'0')}</span>${actor.label}</p><h3 id="actor-title-${id}">${actor.title}</h3><p>${actor.description}</p><div class="actor-reading-context"><strong>Rola w konflikcie</strong><p>${actor.context}</p></div><a class="text-link" href="${sourceById(actor.source).url}" target="_blank" rel="noopener noreferrer">${actor.link} <span aria-hidden="true">↗</span></a></article>`).join('');
}

function renderSources() {
  const filter=$('#source-filter').value;
  const sources=SOURCES.filter(source=>filter==='all'||source.group===filter);
  $('#source-count').textContent=`${sources.length} dokumentów`;
  $('#source-list').innerHTML=sources.map(source=>`<a class="source-item" href="${source.url}" target="_blank" rel="noopener noreferrer"><span>${String(SOURCES.indexOf(source)+1).padStart(2,'0')}</span><div><h3>${source.title}</h3><p>${source.date} · ${source.note}</p></div><span class="source-institution">${source.institution}</span><span class="source-arrow" aria-hidden="true">↗</span></a>`).join('');
}
$('#source-filter').addEventListener('change',renderSources);

let scrollQueued=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#reading-progress').style.width=`${max>0?Math.min(100,Math.max(0,scrollY/max*100)):0}%`;scrollQueued=false;}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress);
addEventListener('load',updateProgress);
document.addEventListener('toggle',()=>requestAnimationFrame(updateProgress),true);

renderSeatStory();
renderTimeline();
renderActors();
renderSources();
document.querySelectorAll('[data-inline-event]').forEach(container=>{const event=EVENTS.find(event=>event.id===container.dataset.inlineEvent);if(event)container.innerHTML=eventContext(event);});
updateProgress();
