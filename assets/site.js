/* Male — Portfolio */
(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  // menú mobile
  var mb=d.querySelector('.menu-btn'), ul=d.querySelector('nav ul');
  if(mb&&ul){
    mb.addEventListener('click',function(){ul.classList.toggle('open');mb.setAttribute('aria-expanded',ul.classList.contains('open'))});
    ul.addEventListener('click',function(e){if(e.target.tagName==='A')ul.classList.remove('open')});
  }

  // barra de progreso
  var pr=d.querySelector('.prog'), tick=false;
  function onScroll(){var h=root.scrollHeight-innerHeight;pr.style.transform='scaleX('+(h>0?scrollY/h:0)+')';tick=false}
  if(pr)addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});

  // aparición al hacer scroll
  var rv=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.04});
    rv.forEach(function(el){io.observe(el)});
  } else rv.forEach(function(el){el.classList.add('in')});

  // índice: preview que sigue al cursor
  var pv=d.querySelector('.ix-prev');
  if(fine&&pv){
    var pimg=pv.querySelector('img');
    d.querySelectorAll('.index a').forEach(function(a){
      a.addEventListener('mouseenter',function(){var s=a.getAttribute('data-prev');if(!s){pv.classList.remove('on');return}pimg.src=s;pv.classList.add('on')});
      a.addEventListener('mouseleave',function(){pv.classList.remove('on')});
      a.addEventListener('mousemove',function(e){pv.style.left=e.clientX+'px';pv.style.top=e.clientY+'px'});
    });
  }

  // cursor "Ver"
  var cur=d.querySelector('.cur');
  if(fine&&cur){
    addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'},{passive:true});
    d.addEventListener('mouseover',function(e){
      var t=e.target.closest('.f,.wk,.next');
      if(e.target.closest('.index')){cur.classList.remove('on');return}
      cur.classList.toggle('on',!!t);
      cur.textContent=t&&(t.classList.contains('wk')||t.classList.contains('next'))?'Abrir':'Ver';
    });
  }

  // lightbox (solo en páginas que lo tienen)
  var lb=d.querySelector('.lb'); if(!lb)return;
  var groups={};
  d.querySelectorAll('[data-g]').forEach(function(el){
    var g=el.dataset.g,k=el.dataset.k; groups[g]=groups[g]||{};
    if(!groups[g][k])groups[g][k]=el.dataset.l;
  });
  Object.keys(groups).forEach(function(g){var o=groups[g];groups[g]=Object.keys(o).sort().map(function(k){return{k:k,src:o[k]}})});
  var lbi=lb.querySelector('.lb-stage img'), lbc=lb.querySelector('.lb-count'), lbt=lb.querySelector('.lb-title');
  var cg=null, ci=0, last=null;
  function show(i){
    var list=groups[cg]; ci=(i+list.length)%list.length;
    lbi.style.opacity=0;
    var im=new Image(); im.onload=function(){lbi.src=im.src;lbi.style.opacity=1}; im.src=list[ci].src;
    lbc.textContent=(ci+1)+' / '+list.length;
    [1,-1].forEach(function(s){(new Image()).src=list[(ci+s+list.length)%list.length].src});
  }
  function open(g,k,el){
    cg=g; last=el; var list=groups[g], i=0;
    for(var j=0;j<list.length;j++)if(list[j].k===k){i=j;break}
    lbt.textContent=d.body.dataset.work||'Male';
    lb.classList.add('on'); lb.setAttribute('aria-hidden','false');
    d.body.style.overflow='hidden'; show(i); lb.querySelector('.lb-close').focus();
  }
  function close(){lb.classList.remove('on');lb.setAttribute('aria-hidden','true');d.body.style.overflow='';lbi.removeAttribute('src');if(last&&last.focus)last.focus()}
  d.querySelectorAll('[data-g]').forEach(function(el){
    if(el.tagName==='FIGURE'){el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label','Ampliar imagen')}
    el.addEventListener('click',function(){open(el.dataset.g,el.dataset.k,el)});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el.dataset.g,el.dataset.k,el)}});
  });
  lb.querySelector('.lb-prev').addEventListener('click',function(){show(ci-1)});
  lb.querySelector('.lb-next').addEventListener('click',function(){show(ci+1)});
  lb.querySelector('.lb-close').addEventListener('click',close);
  d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;
    if(e.key==='Escape')close();else if(e.key==='ArrowRight')show(ci+1);else if(e.key==='ArrowLeft')show(ci-1)});
  var sx=null;
  lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)show(ci+(dx<0?1:-1));sx=null});
})();
