const books=[],RENDER_CARD="RENDER_CARD",RENDER_SEARCH="RENDER_SEARCH",NOTIFY_ADD="NOTIFY_ADD",NOTIFY_DELETE="NOTIFY_DELETE",UNREAD_KEY="UNREAD_KEY",READED_KEY="READED_KEY",BOOKS_DATA="BOOKS_DATA";document.addEventListener("DOMContentLoaded",()=>{let a=document.querySelector("#formInputAddBook"),g=document.querySelectorAll("#addBook"),h=document.querySelector("#formAddBook"),i=document.querySelector("#formBg"),j=document.querySelectorAll("#btCloseForm"),k=document.querySelector("#inputJudul"),l=document.querySelector("#inputPenulis"),m=document.querySelector("#inputTahun"),n=document.querySelector("#addBookNotify"),o=document.querySelector("#deleteNotify"),p=document.querySelector("#lengthJudul"),q=document.querySelector("#lengthPenulis"),r=document.querySelector("#btSubmit"),s=document.querySelector("#deleteBooks"),t=document.querySelector("#formDelete"),u=document.querySelector("#deleteBookTitle"),v=document.querySelector("#inputDelete"),w=document.querySelector("#btDelete"),b=document.querySelector("#inputSearch");function x(){let c=document.querySelector("#inputJudul"),d=document.querySelector("#inputPenulis"),e=document.querySelector("#inputTahun"),a=document.querySelector("#isRead"),b=y(c.value,d.value,e.value,a.checked);books.push(b),console.log(JSON.stringify(b,null,4)),p.innerText="",q.innerText="",h.setAttribute("hidden",""),i.setAttribute("hidden",""),r.setAttribute("disabled",""),books.length+=(k.value="",l.value="",m.value="",a.checked=!1)}function y(a,b,c,d){return{id:+new Date,title:a,author:b,year:c,isCompleted:d}}function z(a){let f=document.createElement("div"),h=document.createElement("div"),j=document.createElement("div"),g=document.createElement("div"),m=document.createElement("h3"),k=document.createElement("h4"),l=document.createElement("h4"),b=document.createElement("button");if(f.classList.add("bookCard","fadeIn"),h.classList.add("bookCardDetails","flex"),j.classList.add("cardTitle","flex"),k.classList.add("tcSecondary","fwRegular"),l.classList.add("tcSecondary","fwRegular"),g.classList.add("cardButton","flex"),b.classList.add("deleteBook","flex"),b.setAttribute("id","deleteBook"),b.setAttribute("title","Delete "+a.title+" book"),f.setAttribute("id",+a.id),m.innerText=a.title,k.innerText=a.author,l.innerText=a.year,b.innerHTML=`<img src="src/image/red-trash.svg" alt="Delete Book" />
                            <span>Delete book</span>`,j.append(m,k,l),h.append(j,g),f.append(h),a.isCompleted){let c=document.createElement("button");c.classList.add("checkRead","flex"),c.setAttribute("title","Read again "+a.title+" book"),c.innerHTML=`<img src="src/image/reread.svg" alt="Read Again" />
                                <span>Read again</span>`,c.addEventListener("click",()=>{readAgainAction(a.id)}),g.append(c,b)}else{let e=document.createElement("button");e.classList.add("checkRead","flex"),e.setAttribute("title","Done read "+a.title+" book"),e.innerHTML=`<img src="src/image/check.svg" alt="Done Read" />                              
                              <span>Done reading</span>`,e.addEventListener("click",()=>{doneReadAction(a.id)}),g.append(e,b)}return b.addEventListener("click",()=>{s.removeAttribute("hidden"),i.removeAttribute("hidden"),u.innerText=a.title,deleteBookAction(a)}),findId=b=>{for(let a of books)if(a.id===b)return a;return null},doneReadAction=b=>{let a=findId(b);null!=a&&(a.isCompleted=!0,document.dispatchEvent(new Event(RENDER_CARD)),A(),d(),B())},readAgainAction=b=>{let a=findId(b);null!=a&&(a.isCompleted=!1,document.dispatchEvent(new Event(RENDER_CARD)),A(),d(),B())},findIndex=b=>{for(let a in books)if(books[a].id===b)return a},deleteBookAction=a=>{t.addEventListener("submit",b=>{b.preventDefault();let c=findIndex(a.id),e=findId(a.id);e==a&&(console.log("DELETE BOOK : ",a.title,a.author,a.year),books.splice(c,1),document.dispatchEvent(new Event(NOTIFY_DELETE)),document.dispatchEvent(new Event(RENDER_CARD)),A(),d(),B(),s.setAttribute("hidden",""),v.value="",w.setAttribute("disabled",""),i.setAttribute("hidden",""))})},f}function c(){g.forEach(a=>{a.addEventListener("click",()=>{h.removeAttribute("hidden"),i.removeAttribute("hidden")})}),j.forEach(a=>{a.addEventListener("click",()=>{h.setAttribute("hidden",""),i.setAttribute("hidden",""),s.setAttribute("hidden","")})}),i.addEventListener("click",()=>{h.setAttribute("hidden",""),i.setAttribute("hidden",""),s.setAttribute("hidden","")}),k.addEventListener("input",()=>{let a=k.value.length,b=50-a;a>=1?p.innerText="Characters left : "+b:p.innerText="",b<=10?p.style.color="red":p.style.color="",50==a&&(p.innerText="Max characters reached"),checkInput()}),l.addEventListener("input",()=>{let a=l.value.length,b=50-a;a>=1?q.innerText="Characters left : "+b:q.innerText="",b<=10?q.style.color="red":q.style.color="",50==a&&(q.innerText="Max characters reached"),checkInput()}),m.addEventListener("input",()=>{m.value/m.value!=1?m.classList.add("inputWarning"):m.removeAttribute("class"),checkInput()}),checkInput=()=>{k.value.length>=1&&l.value.length>=1&&4==m.value.length&&m.value/m.value==1?r.removeAttribute("disabled"):r.setAttribute("disabled","")},v.addEventListener("input",()=>{if("DELETE"!==v.value||""==v.value){w.setAttribute("disabled","");return}w.removeAttribute("disabled")})}function d(){let c=document.querySelector("#unreadBooksCount"),d=document.querySelector("#readedBooksCount"),a=0,b=0;books.forEach(c=>{c.isCompleted?b++:a++}),c.innerText=a,d.innerText=b,e()&&(null==localStorage.getItem(UNREAD_KEY)&&localStorage.setItem(UNREAD_KEY,0),null==localStorage.getItem(READED_KEY)&&localStorage.setItem(READED_KEY,0),localStorage.setItem(UNREAD_KEY,a),localStorage.setItem(READED_KEY,b))}function e(){return!0}function f(){let b=document.querySelector("#emptyBooks"),a=localStorage.getItem(BOOKS_DATA),c=JSON.parse(a);if(null!==a){for(let d of c)books.push(d);b.setAttribute("hidden","")}B(),document.dispatchEvent(new Event(RENDER_CARD))}function A(){if(e()){let a=JSON.stringify(books);localStorage.setItem("BOOKS_DATA",a),document.dispatchEvent(new Event(RENDER_CARD))}}function B(){let a=document.querySelector("#emptyBooks"),b=document.querySelector(".unreadBooks"),c=document.querySelector(".readedBooks"),d=document.querySelector("#headerItem"),e=localStorage.getItem(BOOKS_DATA);null===e||books.length<=0?(a.removeAttribute("hidden"),b.setAttribute("hidden",""),d.style.display="none",c.setAttribute("hidden","")):(a.setAttribute("hidden",""),d.style.display="",b.removeAttribute("hidden"),c.removeAttribute("hidden"))}function C(){let g=b.value,a=[];books.filter(b=>{b.title.toLowerCase().includes(g.toLowerCase())&&a.push(b)}),document.addEventListener(RENDER_SEARCH,()=>{let b=document.querySelector("#unreadBooksList");b.innerHTML="";let c=document.querySelector("#readedBooksList");for(let d of(c.innerHTML="",a)){let e=z(d);d.isCompleted?c.append(e):b.append(e)}});let c=document.querySelector("#unreadBooksCount"),d=document.querySelector("#readedBooksCount"),e=0,f=0;a.forEach(a=>{a.isCompleted?f++:e++}),c.innerText=e,d.innerText=f,document.dispatchEvent(new Event(RENDER_SEARCH))}c(),a.addEventListener("submit",a=>{a.preventDefault(),x(),d(),A(),document.dispatchEvent(new Event(RENDER_CARD)),document.dispatchEvent(new Event(NOTIFY_ADD))}),b.addEventListener("input",a=>{a.preventDefault(),C(),""==b.value&&(z(books),document.dispatchEvent(new Event(RENDER_CARD)))}),document.addEventListener(RENDER_CARD,()=>{let a=document.querySelector("#unreadBooksList");a.innerHTML="";let b=document.querySelector("#readedBooksList");for(let c of(b.innerHTML="",books)){let d=z(c);c.isCompleted?(b.append(d),B()):(a.append(d),B())}}),document.addEventListener(NOTIFY_ADD,()=>{n.removeAttribute("hidden"),n.classList.add("fadeIn"),setTimeout(()=>{n.classList.add("fadeOut")},4e3),setTimeout(()=>{n.classList.remove("fadeOut"),n.setAttribute("hidden","")},4800)}),document.addEventListener(NOTIFY_DELETE,()=>{o.removeAttribute("hidden"),o.classList.add("fadeIn"),setTimeout(()=>{o.classList.add("fadeOut")},4e3),setTimeout(()=>{o.classList.remove("fadeOut"),o.setAttribute("hidden","")},4800)}),e()&&(f(),d())})