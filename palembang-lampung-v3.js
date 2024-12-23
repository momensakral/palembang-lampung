const PalembangLampung=PalembangLampung||{};PalembangLampung.validPrefixes=["0811","0812","0813","0821","0822","0851","0852","0853","0896","0897","0898","0899","0831","0832","0833","0855","0856","0877","0878","0881","0882","0883","0884","0885","0886","0887","0888","0889"];function validateWhatsApp(){const e=document.getElementById("whatsapp"),t=e.value.trim();e.setCustomValidity("");if(t.startsWith("0")){if(t.length<10)e.setCustomValidity("Nomor WhatsApp harus memiliki minimal 12 digit.");else{const a=t.substring(0,4);PalembangLampung.validPrefixes.includes(a)||e.setCustomValidity("Nomor yang kamu masukkan salah atau tidak terdaftar.")}}else e.setCustomValidity("Nomor WhatsApp harus dimulai dengan angka 0.")}document.getElementById("rsvpForm").addEventListener("submit",function(e){e.preventDefault();const t=document.getElementById("rsvpForm"),a=t.querySelector("#whatsapp"),n=a.value.trim(),s=t.querySelector('button[type="submit"]'),i=s.querySelector(".spinner"),o=document.getElementById("notification");if(!n.startsWith("0"))return void a.setCustomValidity("Nomor WhatsApp harus dimulai dengan angka 0.");if(n.length<10)return void a.setCustomValidity("Nomor WhatsApp harus memiliki minimal 12 digit.");const l=n.substring(0,4);if(!PalembangLampung.validPrefixes.includes(l))return void a.setCustomValidity("Nomor yang kamu masukkan salah atau tidak terdaftar.");s.querySelector("span").style.display="none",i.style.display="inline-block";const r=new FormData(t),d=(new Date).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).replace(",","");r.append("timestamp",d),r.append("status","Belum Terkirim"),fetch("https://script.google.com/macros/s/AKfycbxsTsi3WR22ZF_U7XDcxREcrgQ2Qa9HCQiGco4a9KhqB542EX6LbkD-ycPDC0QDqOzPdQ/exec",{method:"POST",body:r}).then((e=>e.text())).then((()=>{o.textContent="Terkirim!",o.style.display="block",t.reset(),setTimeout((()=>{o.style.display="none"}),3e3),i.style.display="none",s.querySelector("span").style.display="inline-block";const e=document.createElement("div");e.className="comment-item";const a=r.get("name"),n=r.get("attending"),l=r.get("message"),m=d,c="Hadir"===n?"hadir":"Tidak Hadir"===n?"tidak-hadir":"";e.innerHTML=`\n\t  <div class="d-flex">\n\t  <img src="https://ui-avatars.com/api/?size=40&amp;background=random&amp;color=random&amp;name=${a}" alt="${a}" loading="lazy" class="avatar rounded-circle" style="height: 30px; width: 30px;"/>\n\t  <div class="ml-2 text-left">\n      <p class="mb-0 font-weight-bold">${a}<span class="badge alert-info ${c}">${n}</span></p>\n      <p class="mb-0 pesan">${l}</p>\n      <small>${m}</small>\n\t  </div>\n      </div>\n    `;document.getElementById("rsvpDisplayContainer").prepend(e),history.replaceState(null,document.title,window.location.pathname)})).catch((e=>{console.error("Error:",e),alert("Terjadi kesalahan. Silakan coba lagi."),i.style.display="none",s.querySelector("span").style.display="inline-block"}))});let start=0,limit=4,isLoading=!1,allDataLoaded=!1;function toggleLoadingMessage(e){const t=document.getElementById("loadingMessage");t.style.display=e?"block":"none"}async function loadData(){if(isLoading||allDataLoaded)return;isLoading=!0,toggleLoadingMessage(!0);const e=`https://script.google.com/macros/s/AKfycbxsTsi3WR22ZF_U7XDcxREcrgQ2Qa9HCQiGco4a9KhqB542EX6LbkD-ycPDC0QDqOzPdQ/exec?start=${start}&limit=4`;try{const t=await fetch(e),a=await t.json(),n=document.getElementById("rsvpDisplayContainer");if(a.length>0){a.forEach((e=>{const t="Hadir"===e.attending?"hadir":"Tidak Hadir"===e.attending?"tidak-hadir":"",a=document.createElement("div");a.className="comment-item",a.innerHTML=`\n\t\t  <div class="d-flex">\n\t\t  <img src="https://ui-avatars.com/api/?size=40&amp;background=random&amp;color=random&amp;name=${e.name}" alt="${e.name}" loading="lazy" class="avatar rounded-circle" style="height: 30px; width: 30px;"/>\n\t\t  <div class="ml-2 text-left">\n          <p class="mb-0 font-weight-bold">${e.name}<span class="badge alert-info ${t}">${e.attending}</span></p>\n          <p class="mb-0 pesan">${e.message}</p>\n          <small>${e.timestamp}</small>\n    \t  </div>\n    \t  </div>\n        `,n.appendChild(a)})),start+=4;const e=document.getElementById("noMoreDataMessage");e&&e.remove()}else if(!document.getElementById("noMoreDataMessage")){const e=document.createElement("div");e.id="noMoreDataMessage",e.textContent="Semua komentar telah dimuat.",e.style.textAlign="center",e.style.fontSize="12px",e.style.color="#777",n.appendChild(e),allDataLoaded=!0,setTimeout((()=>{e.remove()}),5e3)}}catch(e){console.error("Error fetching data:",e)}finally{isLoading=!1,toggleLoadingMessage(!1)}}function observeLastItem(){const e=document.getElementById("rsvpDisplayContainer").lastElementChild;if(e){new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting&&(console.log("Elemen terakhir terlihat, memuat data..."),loadData())}))}),{root:null,rootMargin:"0px",threshold:1}).observe(e)}}window.addEventListener("DOMContentLoaded",loadData);const container=document.getElementById("rsvpDisplayContainer"),mutationObserver=new MutationObserver((()=>{observeLastItem()}));mutationObserver.observe(container,{childList:!0,subtree:!0}),observeLastItem();
