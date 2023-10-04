(()=>{"use strict";class t{constructor(t,e){this.name=t,this.size=e,this.coordinates=[],this.hitCount=0,this.sunk=!1}hit(){this.hitCount+=1,this.hitCount===this.size&&(this.sunk=!0)}isSunk(){if(this.size===this.hitCount)return this.sunk=!0,`You sunk the ${this.name}`}}class e{constructor(t){this.name=t;const e=["A","B","C","D","E","F","G","H","I","J"],o=[1,2,3,4,5,6,7,8,9,10],n=document.querySelector(".battlefield"),s=document.createElement("div");s.classList.add("boardctn"),"Computer"===this.name?s.classList.add("compBoard"):s.classList.add("playerBoard"),n.appendChild(s);const i=document.createElement("div");i.classList.add("rowlabel");for(let t=0;t<10;t++){const o=document.createElement("div");o.classList.add("label"),o.textContent=e[t],i.appendChild(o)}s.appendChild(i);const r=document.createElement("div");r.classList.add("boardlabel"),"Computer"===this.name?(r.classList.add("comp"),r.textContent="Computer"):(r.classList.add("player"),r.textContent="Player"),s.appendChild(r);const a=document.createElement("div");a.classList.add("columnlabel");for(let t=0;t<10;t++){const e=document.createElement("div");e.classList.add("label"),e.textContent=t+1,a.appendChild(e)}s.appendChild(a);const c=document.createElement("div");c.classList.add("board"),s.appendChild(c);for(let n=0;n<10;n++){const s=document.createElement("div");for(let i=0;i<10;i++){const r=document.createElement("div");r.classList.add("cell"),r.dataset.xcoord=e[n],r.dataset.ycoord=o[i],r.dataset.player=`${t}`,s.appendChild(r)}s.classList.add("row"),c.appendChild(s)}}placeShip(t,e,o,n){if(this.placementValid(t,e,o,n)){for(let s=0;s<t.size;s++){const s=document.querySelector(`.cell[data-xcoord='${e}'][data-ycoord='${o}'][data-player='${this.name}']`);s.classList.add("ship"),t.coordinates.push({x:e,y:o}),s.classList.add(`${t.name}`),n?e=String.fromCharCode(e.charCodeAt(0)+1):o++}return!0}return!1}placementValid(t,e,o,n){if(n&&e.charCodeAt(0)+t.size-65>10)return!1;if(!n&&parseInt(o)+t.size-1>10)return!1;for(let s=0;s<t.size;s++){const t=document.querySelector(`.cell[data-xcoord='${e}'][data-ycoord='${o}'][data-player='${this.name}']`);if(t&&t.classList.contains("ship"))return!1;n?e=String.fromCharCode(e.charCodeAt(0)+1):o++}return!0}randomShipPlacement(t){if("Computer"===this.name){const e=[...t];for(let t=0;t<e.length;t++){const o=e[t];for(;;){const t=Math.floor(10*Math.random())+1,e=String.fromCharCode(65+Math.floor(10*Math.random())),n=Math.random()<.5;if(this.placementValid(o,e,t,n)){this.placeShip(o,e,t,n),console.log(`Placed ship ${o.name}`);break}console.log(`Failed to place ship ${o.name}, retrying...`)}}}}}class o{constructor(t){this.name=t,this.gameboard=new e(t),this.ships=[],this.previousAttacks=new Set,this.lastHit=null,this.directions=["up","down","left","right"],this.currentDirection=""}attackEnemy(t,e){const o=document.querySelector(".text"),n=document.querySelector(`.cell[data-xcoord='${t}'][data-ycoord='${e}'][data-player='Computer']`);let s=Array.from(n.classList);if(s=s.filter((t=>"cell"!==t&&"ship"!==t)),n.classList.contains("ship")){const t=this.ships.find((t=>t.name===s[0]));t.hit(),n.classList.add("hit"),n.textContent="o",o.textContent="It's a hit!",t.isSunk()&&(o.textContent=`You sunk their ${s[0]}`),console.log("hit")}else n.classList.add("miss"),n.textContent="x",o.textContent="It missed",console.log("miss")}receiveAttack(t,e,o){const n=document.querySelector(`.cell[data-xcoord='${t}'][data-ycoord='${e}'][data-player='Player']`),s=document.querySelector(".text");let i=Array.from(n.classList);if(i=i.filter((t=>"cell"!==t&&"ship"!==t)),n.classList.contains("ship")){const r=this.ships.find((t=>t.name===i[0]));return r.hit(),n.classList.add("hit"),n.textContent="o",s.textContent="It's a hit!",o.lastHit={x:t,y:e},console.log(`x: ${o.lastHit.x}, y: ${o.lastHit.y}`),console.log("hit"),r.isSunk()&&(o.lastHit=null,s.textContent=`Enemy sunk your ${i[0]}`),o.lastHit}n.classList.add("miss"),n.textContent="x",s.textContent="It missed",this.currentDirection=this.directions[Math.floor(Math.random()*this.directions.length)],console.log("miss")}hitNextMove(t){const{x:e,y:o}=t;switch(console.log(`currDir: '${this.currentDirection}`),this.currentDirection){case"up":return{x:String.fromCharCode(e.charCodeAt(0)-1),y:o};case"down":return{x:String.fromCharCode(e.charCodeAt(0)+1),y:o};case"left":return{x:e,y:o-1};case"right":return{x:e,y:o+1};default:return null}}getDirection(t,e){return t.x===e.x?t.y<e.y?"down":"left":t.y===e.y?t.x<e.x?"right":"up":this.directions[Math.floor(Math.random()*this.directions.length)]}changeDirection(t){switch(t){case"up":return"down";case"down":return"left";case"left":return"right";case"right":return"up";default:return this.directions[Math.floor(Math.random()*this.directions.length)]}}computerAttack(){let t,e;if(this.lastHit?console.log(`Last hit coordinates: x: ${this.lastHit.x}, y: ${this.lastHit.y}`):console.log("No last hit"),this.lastHit){let o=0;for(;o<4;){let s=this.hitNextMove(this.lastHit);if(n(s.x,s.y)&&!this.previousAttacks.has(`${s.x}${s.y}`)){t=s.x,e=s.y,console.log(`Valid! This move: x: ${t}, y: ${e}`);break}this.currentDirection=this.changeDirection(this.currentDirection),console.log(`Changing direction to: ${this.currentDirection}`),s=this.hitNextMove(this.lastHit),o+=1}4===o&&(t=String.fromCharCode(65+Math.floor(10*Math.random())),e=Math.floor(10*Math.random())+1,console.log(`No valid moves after 4 attempts: x: ${t}, y: ${e}`),this.lastHit="",o=0)}else{do{t=String.fromCharCode(65+Math.floor(10*Math.random())),e=Math.floor(10*Math.random())+1,console.log(`Random move: x: ${t}, y: ${e}`),this.currentDirection=this.directions[Math.floor(Math.random()*this.directions.length)]}while(this.previousAttacks.has(`${t}${e}`)||!n(t,e));console.log("No last hit, making a random move")}return this.previousAttacks.add(`${t}${e}`),console.log(`Current direction: ${this.currentDirection}`),{x:t,y:e}}}function n(t,e){const o="A".charCodeAt(0),n="J".charCodeAt(0);if("string"!=typeof t||"number"!=typeof e)return!1;const s=t.charCodeAt(0);return s>=o&&s<=n&&e>=1&&e<=10}new Promise((e=>{const n=new o("Player"),s=new t("Carrier",5),i=new t("Battleship",4),r=new t("Cruiser",3),a=new t("Submarine",3),c=new t("Destroyer",2),l=n.gameboard;n.ships=[s,i,r,a,c];const d=n.ships,h=new t("Carrier",5),u=new t("Battleship",4),m=new t("Cruiser",3),p=new t("Submarine",3),y=new t("Destroyer",2),f=new o("Computer");f.ships=[h,u,m,p,y],f.gameboard.randomShipPlacement(f.ships);let C=!0;const g=document.querySelector(".direction");g.addEventListener("click",(()=>{C=!C,g.textContent=C?"Vertical":"Horizontal"}));const x=document.querySelectorAll(".cell");let $=0;function v(){const t=this,o=t.getAttribute("data-xcoord"),s=t.getAttribute("data-ycoord"),i=t.getAttribute("data-player"),r=d[$];l.placementValid(r,o,s,C)&&"Player"===i&&(l.placeShip(r,o,s,C),$++,$===d.length?(console.log("All player ships have been placed."),e({player1:n,computer:f,done:!0}),x.forEach((function(t){t.removeEventListener("click",v)}))):console.log(`Place ${d[$].name} on the board.`))}return x.forEach((function(t){t.addEventListener("click",v)})),document.querySelector(".start").addEventListener("click",(()=>{const t=document.getElementById("name").value;document.querySelector(".player").textContent=t,n.name=t,function(){const t=document.querySelector(".overlay"),e=document.querySelector(".formcontainer");t.style.display="none",e.innerHTML=""}()})),{player1:n,computer:f}})).then((({player1:t,computer:e,done:o})=>{o?(document.querySelector(".direction").remove(),function(t,e){let o=t,n=!1;function s(){o=o===t?e:t}function i(){t.ships.every((t=>t.isSunk()))&&(n=!0,document.querySelector(".text").textContent=`${e.name} wins! Game over.`),e.ships.every((t=>t.isSunk()))&&(n=!0,console.log("Game over for computer"),document.querySelector(".text").textContent=`${t.name} wins! Game over.`)}const r=document.querySelectorAll(".compBoard .cell"),a=document.querySelector(".text");r.forEach((function(r){r.addEventListener("click",(()=>{if(o===t&&!n){const o=r.getAttribute("data-xcoord"),c=r.getAttribute("data-ycoord");a.textContent=`You attacked ${o}${c}`,setTimeout((()=>{e.attackEnemy(o,c),console.log("playerdone"),i(),s()}),500),setTimeout((()=>{if(!n){const o=e.computerAttack(),n=o.x,r=o.y;a.textContent=`The Enemy attacked ${n}${r}`,setTimeout((()=>{t.receiveAttack(n,r,e),console.log("compdone"),i(),s()}),700)}}),1500),r.removeEventListener("click",this)}}),{once:!0})}))}(t,e),console.log(t),console.log(e)):console.log("Initialization failed: Not all ships are placed.")})).catch((t=>{console.log("Initialization failed:",t)}))})();