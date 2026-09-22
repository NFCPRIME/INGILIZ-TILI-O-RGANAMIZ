/* Shared helpers for about.html, pricing.html, blog.html, admin.html */
const CONTENT_KEY = 'zinapoya_admin_content';
const LANG_KEY = 'zinapoya_lang';

const DEFAULT_CONTENT = {
  site:{ name:"Zinapoya",
    tagline_uz:"IELTS 9 sari — mustaqil ingliz tili platformasi",
    tagline_ru:"К IELTS 9 — платформа для самостоятельного изучения английского",
    tagline_en:"Towards IELTS 9 — a self-study English platform",
    contact_email:"info@zinapoya.uz", telegram:"https://t.me/zinapoya" },
  about:{
    uz:"Zinapoya — ingliz tilini boshidan IELTS 9-darajasigacha mustaqil o'rganish uchun yaratilgan platforma.",
    ru:"Zinapoya — платформа для самостоятельного изучения английского языка от начального уровня до IELTS 9.",
    en:"Zinapoya is a platform for self-studying English from the very beginning up to IELTS band 9." },
  pricing:[],
  blog:[]
};

async function loadContent(){
  try{
    const raw = localStorage.getItem(CONTENT_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  try{
    const res = await fetch('content.json', {cache:'no-store'});
    if(res.ok) return await res.json();
  }catch(e){}
  return DEFAULT_CONTENT;
}
function saveContent(content){
  try{ localStorage.setItem(CONTENT_KEY, JSON.stringify(content)); return true; }catch(e){ return false; }
}

function currentLang(){ return localStorage.getItem(LANG_KEY) || 'uz'; }
function applyLang(l){
  localStorage.setItem(LANG_KEY, l);
  document.body.setAttribute('data-lang', l);
  document.querySelectorAll('.langtoggle button').forEach(b=>b.classList.toggle('active', b.dataset.l===l));
}
function wireLangToggle(){
  document.querySelectorAll('.langtoggle button').forEach(b=>{
    b.addEventListener('click', ()=>applyLang(b.dataset.l));
  });
  applyLang(currentLang());
}
function L3(uz, ru, en){ return currentLang()==='ru' ? ru : (currentLang()==='en' ? en : uz); }

function markActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.tabs a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')===path);
  });
}
