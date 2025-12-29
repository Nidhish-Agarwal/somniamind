import{y as u,r as c,j as t,ab as M,av as I,bA as $,bB as S,bC as T,bD as L,t as x,a2 as o}from"./index-xSfxuKuS.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]],D=u("Download",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]],E=u("Link2",R);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]],A=u("MessageCircle",O),z=({isOpen:m,onClose:r,shareImage:v,share_captions:e,dreamId:d})=>{const[g,w]=c.useState(!1),[y,p]=c.useState(!1),[j,b]=c.useState(!1),l=window.location.origin,f={instagram:{name:"Instagram",icon:L,bg:"bg-gradient-to-br from-purple-600 to-pink-600",copyText:`${e==null?void 0:e.instagram} ✨

Made with SomniaMind 🌙`,url:"https://www.instagram.com/",toast:"Caption copied! Open Instagram to share ✨"},whatsapp:{name:"WhatsApp",icon:A,bg:"bg-green-600",copyText:`${e==null?void 0:e.whatsapp} ✨

Made with SomniaMind 🌙`,url:`https://wa.me/?text=${encodeURIComponent(`${e==null?void 0:e.whatsapp}

${l}`)}`,toast:"Opening WhatsApp ✨"},twitter:{name:"X",icon:T,bg:"bg-slate-700",copyText:`${e==null?void 0:e.twitter} ✨

Made with SomniaMind 🌙`,url:`https://twitter.com/intent/tweet?text=${encodeURIComponent(e==null?void 0:e.twitter)}&url=${l}`,toast:"Opening Twitter ✨"},telegram:{name:"Telegram",icon:S,bg:"bg-blue-500",copyText:`${e==null?void 0:e.telegram} ✨

Made with SomniaMind 🌙`,url:`https://t.me/share/url?url=${l}&text=${encodeURIComponent(e==null?void 0:e.telegram)}`,toast:"Opening Telegram ✨"},pinterest:{name:"Pinterest",bg:"bg-red-600",copyText:`${e==null?void 0:e.pinterest} ✨

Made with SomniaMind 🌙`,url:`https://pinterest.com/pin/create/button/?url=${l}&description=${encodeURIComponent(e==null?void 0:e.pinterest)}`,toast:"Opening Pinterest ✨",customIcon:t.jsx("svg",{className:"w-7 h-7 text-white",viewBox:"0 0 24 24",fill:"currentColor",children:t.jsx("path",{d:"M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174..."})})},copy:{name:"Copy link",icon:E,bg:"bg-slate-600",copyText:`${l}/dream/public/${d}`,toast:"Link copied 🔗"}},h=v;c.useEffect(()=>{const a=n=>{n.key==="Escape"&&r()};return m&&(document.addEventListener("keydown",a),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",a),document.body.style.overflow="unset"}},[m,r]);const k=async()=>{w(!0);try{const n=await(await fetch(h)).blob(),i=window.URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download=`somniamind-${Date.now()}.png`,document.body.appendChild(s),s.click(),document.body.removeChild(s),window.URL.revokeObjectURL(i),x("Share",{source:"Image",event:"Image Downloaded",dreamId:d}),o.success("Image downloaded 📸")}catch(a){o.error("Download failed. Please try again.",{description:a.message})}finally{setTimeout(()=>w(!1),1e3)}},C=async()=>{p(!0);try{await navigator.clipboard.writeText(`${e==null?void 0:e.generic} ✨

Made with SomniaMind 🌙`),x("Share",{event:"Caption Copied",type:"Generic",dreamId:d}),o.success("Caption copied ✨")}catch(a){o.error("Copy failed. Please try again.",{description:a.message})}finally{setTimeout(()=>p(!1),1e3)}},N=async a=>{const n=f[a];if(n)try{x("Share",{event:"Share Clicked",platform:a,dreamId:d}),b(!0),n.copyText&&await navigator.clipboard.writeText(n.copyText),o.success(n.toast||"Copied ✨"),n.url&&setTimeout(()=>{window.open(n.url,"_blank","noopener,noreferrer")},400)}catch(i){o.error("Failed to copy",{description:i.message})}finally{setTimeout(()=>b(!1),800)}};return m?t.jsxs("div",{className:"fixed inset-0 z-50  flex items-center justify-center p-4 animate-fadeIn",onClick:r,children:[t.jsx("div",{className:"absolute inset-0 bg-black/60 backdrop-blur-md"}),t.jsxs("div",{className:"relative max-h-[85vh] overflow-y-auto w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl animate-slideUp",onClick:a=>a.stopPropagation(),children:[t.jsx("button",{onClick:r,className:"absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10",children:t.jsx(M,{className:"w-4 h-4 text-white"})}),t.jsxs("div",{className:"p-4 space-y-4",children:[t.jsxs("div",{className:"text-center space-y-1",children:[t.jsx("h2",{className:"text-lg font-semibold text-white",children:"Share your dream"}),t.jsx("p",{className:"text-xs text-slate-400",children:"Let others experience your dream ✨"})]}),t.jsx("div",{className:"relative rounded-xl overflow-hidden shadow-xl bg-slate-700/50",children:t.jsx(I,{src:h,alt:"Dream share preview",className:"w-full h-auto"})}),t.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[t.jsxs("button",{onClick:k,disabled:g,className:"flex items-center text-sm justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white rounded-xl font-medium transition-all active:scale-95",children:[t.jsx(D,{className:"w-4 h-4"}),g?"Downloading...":"Download"]}),t.jsxs("button",{onClick:C,disabled:y,className:"flex items-center text-sm justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white rounded-xl font-medium transition-all active:scale-95 border border-white/20",children:[t.jsx($,{className:"w-4 h-4"}),y?"Copied!":"Copy"]})]}),t.jsx("div",{className:"h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"}),t.jsx("div",{className:"grid grid-cols-3 gap-3",children:Object.entries(f).map(([a,n])=>{const i=n.icon;return t.jsxs("button",{onClick:()=>N(a),disabled:j,className:"flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/10 transition-all active:scale-95",children:[t.jsx("div",{className:`w-11 h-11 flex items-center justify-center rounded-full ${n.bg}`,children:n.customIcon?n.customIcon:t.jsx(i,{className:"w-5 h-5 text-white"})}),t.jsx("span",{className:"text-[10px] text-slate-300",children:n.name})]},a)})}),t.jsx("div",{className:"text-center",children:t.jsx("p",{className:"text-[10px] text-slate-500",children:"Made with SomniaMind 🌙"})})]})]}),t.jsx("style",{children:`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `})]}):null};export{z as default};
