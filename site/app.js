const nav=document.querySelector('#navigation');
const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}});

const objects=[...document.querySelectorAll('[data-object]')];
let saved=[];
try{saved=JSON.parse(localStorage.getItem('saved-objects')||'[]');if(!Array.isArray(saved))saved=[];}catch{}
const filters=document.querySelector('.filters');
if(filters){
 const tools=document.createElement('div');tools.className='catalog-tools';
 tools.innerHTML='<label class="catalog-search">Поиск объекта<input id="object-search" type="search" placeholder="Название или размер дома"></label><label class="saved-only"><input id="saved-only" type="checkbox"> Только избранное</label><button class="btn secondary" id="reset-filters" type="button">Сбросить</button><button class="btn" id="compare-open" type="button" disabled>Сравнить (0)</button>';
 filters.before(tools);
 objects.forEach((card,index)=>{
  card.dataset.key=card.querySelector('.cover').href;
  const actions=document.createElement('div');actions.className='object-actions';
  const favorite=document.createElement('button');favorite.type='button';favorite.className='favorite';favorite.title='Добавить в избранное';favorite.setAttribute('aria-label',`В избранное: ${card.querySelector('h3').textContent}`);
  const update=()=>{const active=saved.includes(card.dataset.key);favorite.textContent=active?'♥':'♡';favorite.setAttribute('aria-pressed',String(active));favorite.title=active?'Убрать из избранного':'Добавить в избранное';};update();
  favorite.addEventListener('click',()=>{saved=saved.includes(card.dataset.key)?saved.filter(key=>key!==card.dataset.key):[...saved,card.dataset.key];try{localStorage.setItem('saved-objects',JSON.stringify(saved));}catch{}update();filterObjects();});
  const label=document.createElement('label');label.className='compare-choice';label.innerHTML=`<input type="checkbox" data-compare aria-label="Сравнить объект ${index+1}"> Сравнить`;
  actions.append(favorite,label);card.querySelector('.copy').append(actions);
  const request=document.createElement('a');request.href='#contact';request.className='object-request';request.textContent='Обсудить такой дом →';request.addEventListener('click',()=>{document.querySelector('form [name="type"]').value=card.dataset.type==='barnhaus'?'Барнхаус':'Каркасный дом';document.querySelector('form [name="comment"]').value=`Интересует объект: ${card.querySelector('h3').textContent}`;});card.querySelector('.copy').append(request);
 });
 const filterObjects=()=>{
  const type=document.querySelector('#type').value,floors=document.querySelector('#floors').value,area=document.querySelector('#area').value;
  const search=document.querySelector('#object-search').value.trim().toLocaleLowerCase('ru');
  let count=0;
  objects.forEach(card=>{const size=Number(card.dataset.area);const match=(type==='all'||type===card.dataset.type)&&(floors==='all'||floors===card.dataset.floors)&&(area==='all'||(size>0&&(area==='small'?size<100:size>=100)))&&card.textContent.toLocaleLowerCase('ru').includes(search)&&(!document.querySelector('#saved-only').checked||saved.includes(card.dataset.key));card.hidden=!match;if(match)count++;});
  document.querySelector('#empty').hidden=count>0;document.querySelector('#result-count').textContent=`Найдено объектов: ${count}`;
 };
 document.querySelectorAll('.filters select,#saved-only').forEach(el=>el.addEventListener('change',filterObjects));
 document.querySelector('#object-search').addEventListener('input',filterObjects);
 document.querySelector('#reset-filters').addEventListener('click',()=>{document.querySelectorAll('.filters select').forEach(el=>el.value='all');document.querySelector('#object-search').value='';document.querySelector('#saved-only').checked=false;filterObjects();});
 const compareOpen=document.querySelector('#compare-open');
 document.querySelectorAll('[data-compare]').forEach(el=>el.addEventListener('change',()=>{const count=document.querySelectorAll('[data-compare]:checked').length;compareOpen.textContent=`Сравнить (${count})`;compareOpen.disabled=count<2;}));
 compareOpen.addEventListener('click',()=>{
  const content=document.querySelector('#compare-content');content.replaceChildren();
  document.querySelectorAll('[data-compare]:checked').forEach(el=>{const card=el.closest('[data-object]');const column=document.createElement('article');const img=card.querySelector('img').cloneNode();img.loading='eager';column.append(img);const title=document.createElement('h3');title.textContent=card.querySelector('h3').textContent;column.append(title);const details=document.createElement('p');details.textContent=card.querySelector('.copy p').textContent;column.append(details);const params=document.createElement('p');params.textContent='Площадь, этажность, планировка и стоимость: [УКАЗАТЬ ДАННЫЕ].';column.append(params);const link=document.createElement('a');link.href=card.querySelector('.cover').href;link.textContent='Этап строительства на YouTube →';column.append(link);content.append(column);});
  document.querySelector('#compare-dialog').showModal();
 });
}

const quiz=document.querySelector('#selection');
if(quiz){
  const questions=[{title:'Какой дом вы рассматриваете?',options:['Барнхаус','Шале','Пока выбираю']},{title:'Какая площадь вам нужна?',options:['До 60 м²','60–100 м²','100–150 м²','Больше 150 м²','Пока не определена']},{title:'Как планируете использовать дом?',options:['Постоянное проживание','Сезонное проживание','Гостевой дом']},{title:'Есть ли участок и проект?',options:['Есть участок и проект','Есть только участок','Пока выбираю участок']}];
 const answers=Array(4).fill(null);let step=0;
 const render=()=>{
  document.querySelector('#step-label').textContent=`Шаг ${step+1} из 4`;document.querySelector('#selection-progress').value=step+1;
  document.querySelector('#question-title').textContent=questions[step].title;
  const options=document.querySelector('#question-options');options.replaceChildren();
  questions[step].options.forEach(text=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='quiz-answer';input.value=text;input.checked=answers[step]===text;input.addEventListener('change',()=>{answers[step]=text;document.querySelector('#selection-next').disabled=false;});const span=document.createElement('span');span.textContent=text;label.append(input,span);options.append(label);});
  document.querySelector('#selection-back').disabled=step===0;document.querySelector('#selection-next').disabled=!answers[step];document.querySelector('#selection-next').textContent=step===3?'Перейти к заявке →':'Далее →';
 };
 document.querySelector('#selection-back').addEventListener('click',()=>{if(step>0){step--;render();}});
 document.querySelector('#selection-next').addEventListener('click',()=>{if(!answers[step])return;if(step<3){step++;render();return;}const form=document.querySelector('form');form.elements.type.value=answers[0];form.elements.selection.value=questions.map((q,i)=>`${q.title} ${answers[i]}`).join('\n');document.querySelector('#contact').scrollIntoView();form.elements.name.focus({preventScroll:true});});render();
}

document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-stage]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});const image=document.querySelector('#stage-photo');image.src=button.dataset.stage==='frame'?image.src.replace(/(frame|roof|facade)\.jpg$|barnhaus-interior\.webp$/,'barnhaus-interior.webp'):image.src.replace(/(frame|roof|facade)\.jpg$|barnhaus-interior\.webp$/,`${button.dataset.stage}.jpg`);image.alt=button.querySelector('strong').textContent;}));
const photoDialog=document.querySelector('#photo-dialog');
document.querySelectorAll('[data-gallery],.visual-grid figure,.house-banner').forEach(element=>{
 const open=()=>{const image=element.querySelector('img');photoDialog.querySelector('img').src=image.src;photoDialog.querySelector('img').alt=image.alt;photoDialog.querySelector('p').textContent=element.querySelector('figcaption')?.textContent||image.alt;photoDialog.showModal();};
 element.addEventListener('click',e=>{if(e.target.closest('a'))return;open();});
 if(element.tagName!=='BUTTON'){element.tabIndex=0;element.setAttribute('role','button');element.setAttribute('aria-label','Увеличить фотографию');element.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});}
});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});});

document.querySelector('form')?.addEventListener('submit',e=>{
 e.preventDefault();const form=e.currentTarget;const d=new FormData(form);
 const text=`Запрос на расчет дома\nИмя: ${d.get('name')}\nСпособ связи: ${d.get('contact')}\nТип: ${d.get('type')}\nПлощадь: ${d.get('area')||'не определена'}\nПроект: ${d.get('project')||'нет ссылки'}\n${d.get('selection')||''}\nКомментарий: ${d.get('comment')||''}`;
 const preview=document.querySelector('#request-preview');preview.hidden=false;preview.textContent=text;
 const status=document.querySelector('#form-status');const email=form.dataset.email;
 if(email){const link=document.querySelector('#send-email');link.hidden=false;link.href=`mailto:${email}?subject=${encodeURIComponent('Запрос на расчет дома')}&body=${encodeURIComponent(text)}`;status.textContent='Сообщение подготовлено. Откройте почтовое приложение и отправьте письмо самостоятельно.';}
 else{status.textContent='Сообщение подготовлено, но не отправлено: получатель заявки пока не подключен.';}
});
