"use strict";(self.webpackChunkwonder_writer=self.webpackChunkwonder_writer||[]).push([[725],{7395:(b,d,r)=>{r.d(d,{r:()=>e});var a=r(1223),c=r(6868);let e=(()=>{class i{constructor(){this.color="white"}ngOnInit(){}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=a.Xpm({type:i,selectors:[["app-icon-button"]],hostVars:1,hostBindings:function(t,p){2&t&&a.uIk("ww-color",p.color)},inputs:{name:"name",color:"color"},decls:1,vars:1,consts:[[3,"name"]],template:function(t,p){1&t&&a._UZ(0,"app-icon",0),2&t&&a.Q6J("name",p.name)},directives:[c.o],styles:["[_nghost-%COMP%]{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;-webkit-user-select:none;user-select:none;cursor:pointer}[_nghost-%COMP%] > *[_ngcontent-%COMP%]{flex:0 0 auto}app-icon[_ngcontent-%COMP%]     path{transition:fill .1s}[ww-color=white][_nghost-%COMP%]   app-icon[_ngcontent-%COMP%]     path{fill:#fff}[ww-color=suva-grey][_nghost-%COMP%]   app-icon[_ngcontent-%COMP%]     path{fill:#8b8b8b}[_nghost-%COMP%]:hover[ww-color=white]   app-icon[_ngcontent-%COMP%]     path{fill:#e6e6e6}[_nghost-%COMP%]:hover[ww-color=suva-grey]   app-icon[_ngcontent-%COMP%]     path{fill:#a5a5a5}[_nghost-%COMP%]:active[ww-color=white]   app-icon[_ngcontent-%COMP%]     path{fill:#ccc}[_nghost-%COMP%]:active[ww-color=suva-grey]   app-icon[_ngcontent-%COMP%]     path{fill:#bebebe}.ww-light-theme   [ww-color=white][_nghost-%COMP%]   app-icon[_ngcontent-%COMP%]     path{fill:#313335}.ww-light-theme   [_nghost-%COMP%]:hover[ww-color=white]   app-icon[_ngcontent-%COMP%]     path{fill:#3d4042}.ww-light-theme   [_nghost-%COMP%]:active[ww-color=white]   app-icon[_ngcontent-%COMP%]     path{fill:#4a4d50}"]}),i})()},725:(b,d,r)=>{r.r(d),r.d(d,{WriterModule:()=>y});var a=r(9808),c=r(9426),e=r(1223),i=r(9270),l=r(7458),t=r(1427),p=r(7395);function f(n,h){if(1&n){const o=e.EpF();e.TgZ(0,"app-icon-button",5),e.NdJ("click",function(){return e.CHM(o),e.oxw().onBackClick()}),e.qZA()}}function u(n,h){if(1&n){const o=e.EpF();e.TgZ(0,"app-icon-button",6),e.NdJ("click",function(){return e.CHM(o),e.oxw().toggleHierarchy()}),e.qZA()}}function w(n,h){if(1&n){const o=e.EpF();e.TgZ(0,"app-icon-button",7),e.NdJ("click",function(){return e.CHM(o).$implicit.click()}),e.qZA()}2&n&&e.Q6J("name",h.$implicit.name)}const m=function(){return["/"]};let _=(()=>{class n{constructor(o,s,g){this.headerService=o,this.hierarchyService=s,this.subscriptionService=g,this.showBack=!1,this.showMenu=!1,this.actions=[],this._drawerOpened=!1}ngOnInit(){this._subscribeShowBack(),this._subscribeShowMenu(),this._subscribeHeaderActions(),this._subscribeHierarchyDrawerOpened()}onBackClick(){this.headerService.emitBackClick()}toggleHierarchy(){this.hierarchyService.hierarchyDrawerOpened=!this._drawerOpened}_subscribeShowBack(){const o=this.headerService.showBack$.subscribe(s=>this.showBack=s);this.subscriptionService.store("_subscribeShowBack",o)}_subscribeShowMenu(){const o=this.headerService.showMenu$.subscribe(s=>this.showMenu=s);this.subscriptionService.store("_subscribeShowMenu",o)}_subscribeHeaderActions(){const o=this.headerService.actions$.subscribe(s=>this.actions=s);this.subscriptionService.store("_subscribeHeaderActions",o)}_subscribeHierarchyDrawerOpened(){const o=this.hierarchyService.hierarchyDrawerOpened$.subscribe(s=>this._drawerOpened=s);this.subscriptionService.store("_subscribeHierarchyDrawerOpened",o)}}return n.\u0275fac=function(o){return new(o||n)(e.Y36(l.r),e.Y36(t._),e.Y36(i.F))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-header"]],features:[e._Bn([i.F])],decls:8,vars:5,consts:[[1,"ww-flex"],["name","arrow-back",3,"click",4,"ngIf"],["name","menu",3,"click",4,"ngIf"],[3,"routerLink"],[3,"name","click",4,"ngFor","ngForOf"],["name","arrow-back",3,"click"],["name","menu",3,"click"],[3,"name","click"]],template:function(o,s){1&o&&(e.TgZ(0,"div",0),e.YNc(1,f,1,0,"app-icon-button",1),e.YNc(2,u,1,0,"app-icon-button",2),e.TgZ(3,"a",3),e.TgZ(4,"h1"),e._uU(5," Wonder Writer "),e.qZA(),e.qZA(),e.qZA(),e.TgZ(6,"div",0),e.YNc(7,w,1,1,"app-icon-button",4),e.qZA()),2&o&&(e.xp6(1),e.Q6J("ngIf",s.showBack),e.xp6(1),e.Q6J("ngIf",s.showMenu),e.xp6(1),e.Q6J("routerLink",e.DdM(4,m)),e.xp6(4),e.Q6J("ngForOf",s.actions))},directives:[a.O5,c.yS,a.sg,p.r],styles:["[_nghost-%COMP%]{width:100%;height:60px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;box-sizing:border-box;padding:0 20px;background-color:#090c0f;box-shadow:0 3px 6px #00000029;position:relative;z-index:100}[_nghost-%COMP%] > *[_ngcontent-%COMP%]{flex:0 0 auto}.ww-flex[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap}.ww-flex[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{flex:0 0 auto}a[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none}h1[_ngcontent-%COMP%]{font-family:Roboto,sans-serif;font-size:20px;font-weight:300;line-height:29px;color:#fff}app-icon-button[_ngcontent-%COMP%] + app-icon-button[_ngcontent-%COMP%]{margin-left:20px}app-icon-button[_ngcontent-%COMP%] + a[_ngcontent-%COMP%]{margin-left:20px}.ww-light-theme   [_nghost-%COMP%]{background-color:#4e91d5}"]}),n})();const C=[{path:"",component:(()=>{class n{constructor(){}ngOnInit(){}}return n.\u0275fac=function(o){return new(o||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-writer"]],decls:3,vars:0,consts:[[1,"ww-content"]],template:function(o,s){1&o&&(e._UZ(0,"app-header"),e.TgZ(1,"div",0),e._UZ(2,"router-outlet"),e.qZA())},directives:[_,c.lC],styles:["[_nghost-%COMP%]{width:100%;height:100%;position:absolute;display:block}.ww-content[_ngcontent-%COMP%]{height:calc(100% - 60px);background-color:#313335}.ww-light-theme   [_nghost-%COMP%]   .ww-content[_ngcontent-%COMP%]{background-color:#fff}"]}),n})(),children:[{path:"",pathMatch:"full",redirectTo:"projects"},{path:"projects",loadChildren:()=>Promise.all([r.e(125),r.e(592),r.e(935)]).then(r.bind(r,4935)).then(n=>n.ProjectsModule)},{path:"project/:id/settings",loadChildren:()=>Promise.all([r.e(125),r.e(904),r.e(757)]).then(r.bind(r,1757)).then(n=>n.ProjectSettingsModule)},{path:"project",loadChildren:()=>Promise.all([r.e(125),r.e(904),r.e(592),r.e(647)]).then(r.bind(r,4647)).then(n=>n.ProjectModule)}]}];let M=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[c.Bz.forChild(C)],c.Bz]}),n})();var O=r(8976);let v=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[a.ez,O.v,c.Bz]]}),n})(),y=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[a.ez,M,v]]}),n})()},7458:(b,d,r)=>{r.d(d,{r:()=>e});var a=r(1223),c=r(1135);let e=(()=>{class i{constructor(){this._onBackClick=new a.vpe,this._showBack$=new c.X(!1),this._showMenu$=new c.X(!1),this._actions$=new c.X([])}get showBack$(){return this._showBack$.asObservable()}get showMenu$(){return this._showMenu$.asObservable()}get actions$(){return this._actions$.asObservable()}set showBack(t){this._showBack$.next(t)}set showMenu(t){this._showMenu$.next(t)}set actions(t){this._actions$.next(t)}emitBackClick(){this._onBackClick.emit()}subscribeBackClick(t){return this._onBackClick.subscribe(t)}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=a.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},1427:(b,d,r)=>{r.d(d,{_:()=>e});var a=r(1223),c=r(1135);let e=(()=>{class i{constructor(){this._droppableDropzones=[],this._droppableHierarchies=[],this._hierarchyChanged=new a.vpe,this._hierarchyDrawerOpened$=new c.X(!1),this._draggingHierarchyDOMRect$=new c.X(void 0),this._draggingHierarchy$=new c.X(void 0),this._draggingMouseEvent$=new c.X(void 0),this._draggingScope$=new c.X(void 0),this._openedHierarchy$=new c.X(void 0)}get hierarchyDrawerOpened$(){return this._hierarchyDrawerOpened$.asObservable()}get draggingHierarchyDOMRect$(){return this._draggingHierarchyDOMRect$.asObservable()}get draggingHierarchy$(){return this._draggingHierarchy$.asObservable()}get draggingMouseEvent$(){return this._draggingMouseEvent$.asObservable()}get draggingScope$(){return this._draggingScope$.asObservable()}get openedHierarchy$(){return this._openedHierarchy$.asObservable()}set hierarchyDrawerOpened(t){this._hierarchyDrawerOpened$.next(t)}set draggingHierarchyDOMRect(t){this._draggingHierarchyDOMRect$.next(t)}set draggingHierarchy(t){this._draggingHierarchy$.next(t)}set draggingMouseEvent(t){this._draggingMouseEvent$.next(t)}set draggingScope(t){this._draggingScope$.next(t)}registerDroppableDropzone(t){this._droppableDropzones.push(t)}registerDroppableHierarchy(t){this._droppableHierarchies.push(t)}unregisterDroppableDropzone(t){this._droppableDropzones=this._droppableDropzones.filter(p=>p!==t)}unregisterDroppableHierarchy(t){this._droppableHierarchies=this._droppableHierarchies.filter(p=>p!==t)}checkDroppableDropzones(t,p){return this._droppableDropzones.filter(u=>(u.checkDraggingHierarchyContained(t,p),u.droppable))[0]}checkDroppableHierarchy(t,p){return this._droppableHierarchies.filter(u=>(u.checkDraggingHierarchyContained(t,p),u.droppable))[0]}openDocumentHierarchy(t){this._openedHierarchy$.next(t)}closeDocumentHierarchy(){this._openedHierarchy$.next(void 0)}emitHierarchyChanged(){this._hierarchyChanged.emit()}subscribeHierarchyChanged(t){return this._hierarchyChanged.subscribe(t)}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=a.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()}}]);