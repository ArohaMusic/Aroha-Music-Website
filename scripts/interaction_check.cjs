const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
class Element {
  constructor(attrs = {}) {this.attrs = {...attrs}; this.dataset = {}; this.hidden = false; this.listeners = {}; this.focused = false; this.classes = new Set(); this.classList = {add: c => this.classes.add(c), remove: c => this.classes.delete(c)};}
  setAttribute(k,v) {this.attrs[k] = v;} getAttribute(k) {return this.attrs[k];}
  addEventListener(k,fn) {(this.listeners[k] ??= []).push(fn);}
  dispatch(k,extra = {}) {const e = {target: this, currentTarget: this, preventDefault() {this.prevented = true;}, ...extra}; for (const fn of this.listeners[k] ?? []) fn(e); return e;}
  focus() {this.focused = true;}
}
const menu = new Element({'aria-expanded':'false'}), nav = new Element(); nav.hidden = true;
const navLinks = [new Element(),new Element()]; nav.querySelectorAll = () => navLinks;
const dialog = new Element(), enlarged = new Element(), title = new Element(), close = new Element(), year = new Element();
dialog.showModal = () => {dialog.open = true;}; dialog.close = () => {dialog.open = false; dialog.dispatch('close');};
dialog.getBoundingClientRect = () => ({left: 10, top: 10, right: 100, bottom: 100});
const gallery = ['discover','player','library','glimpses'].map(name => {const button = new Element(); button.dataset.title = name; const image = {src: 'http://localhost/assets/screenshots/'+name+'-540.webp', alt: 'Real Aroha '+name+' screen'}; button.querySelector = () => image; return button;});
const document = new Element(); document.body = new Element(); document.documentElement = new Element();
const elements = {'.menu-toggle':menu,'#mobile-nav':nav,'#screenshot-dialog':dialog,'#enlarged-screenshot':enlarged,'#screenshot-title':title,'#close-screenshot':close,'#copyright-year':year};
document.querySelector = s => elements[s] ?? null; document.querySelectorAll = s => s === '[data-screenshot]' ? gallery : [];
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/app.js'),'utf8'), {document, window:{}, matchMedia:() => ({matches:false, addEventListener(){}}), Date, String, Math});
menu.dispatch('click'); assert.equal(nav.hidden,false); assert.equal(menu.attrs['aria-expanded'],'true');
document.dispatch('keydown',{key:'Escape'}); assert.equal(nav.hidden,true); assert(menu.focused);
menu.dispatch('click'); navLinks[0].dispatch('click'); assert(nav.hidden);
for (const button of gallery) {const event = button.dispatch('click'); assert(event.prevented); assert.equal(dialog.open,true); assert.equal(title.textContent,button.dataset.title); assert(enlarged.src.endsWith(button.dataset.title+'-1080.webp')); assert(enlarged.alt.includes('Real Aroha')); assert(document.body.classes.has('modal-open')); close.dispatch('click'); assert.equal(dialog.open,false); assert(!document.body.classes.has('modal-open')); assert(button.focused);}
gallery[0].dispatch('click'); dialog.dispatch('click',{clientX: 0, clientY: 0}); assert.equal(dialog.open,false);
const showModal = dialog.showModal; delete dialog.showModal; const fallback = gallery[0].dispatch('click'); assert(!fallback.prevented); dialog.showModal = showModal;
assert.equal(year.textContent, String(new Date().getFullYear()));
console.log('PASS: mobile navigation, Escape, all four real screenshot selections, full-resolution image/alt text, close and focus restoration, backdrop dismissal, and ordinary image-link fallback.');
