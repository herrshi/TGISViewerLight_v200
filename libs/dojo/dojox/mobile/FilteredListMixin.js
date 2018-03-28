//>>built
define("dojox/mobile/FilteredListMixin","require dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/dom dojo/dom-class dojo/dom-construct dojo/aspect dijit/registry ./SearchBox ./ScrollableView ./viewRegistry".split(" "),function(e,h,k,c,q,l,d,m,n,f,p,g){return k("dojox.mobile.FilteredListMixin",null,{filterBoxRef:null,placeHolder:"",filterBoxVisible:!0,_filterBox:null,_createdFilterBox:null,_createdScrollableView:null,startup:function(){if(!this._started){this.inherited(arguments);if(this.filterBoxRef)if((this._filterBox=
n.byId(this.filterBoxRef))&&this._filterBox.isInstanceOf(f))this._filterBox.set("searchAttr",this.labelProperty?this.labelProperty:"label"),this._filterBox.placeHolder||this._filterBox.set("placeHolder",this.placeHolder),this._filterBox.on("search",c.hitch(this,"_onFilter"));else throw Error("Cannot find a widget of type dojox/mobile/SearchBox or subclass at the specified filterBoxRef: "+this.filterBoxRef);else{this._createdFilterBox=this._filterBox=new f({searchAttr:this.labelProperty?this.labelProperty:
"label",ignoreCase:!0,incremental:!0,onSearch:c.hitch(this,"_onFilter"),selectOnClick:!0,placeHolder:this.placeHolder});this._createdScrollableView=new p;var a=this.domNode;this.domNode.parentNode.replaceChild(this._createdScrollableView.domNode,this.domNode);d.place(a,this._createdScrollableView.containerNode);a=d.create("div");d.place(this._createdFilterBox.domNode,a);d.place(a,this._createdScrollableView.domNode,"before");this.filterBoxClass&&l.add(a,this.filterBoxClass);this._createdFilterBox.startup();
this._createdScrollableView.startup();this._createdScrollableView.resize()}var b=g.getEnclosingScrollable(this.domNode);b&&this.connect(b,"onFlickAnimationEnd",c.hitch(this,function(){this._filterBox.focusNode.value||(this._previousUnfilteredScrollPos=b.getPos())}));this.store?this._initStore():this._createStore(this._initStore)}},_setFilterBoxVisibleAttr:function(a){this._set("filterBoxVisible",a);this._filterBox&&this._filterBox.domNode&&(this._filterBox.domNode.style.display=a?"":"none")},_setPlaceHolderAttr:function(a){this._set("placeHolder",
a);this._filterBox&&this._filterBox.set("placeHolder",a)},getFilterBox:function(){return this._filterBox},getScrollableView:function(){return this._createdScrollableView},_initStore:function(){var a=this.store;a.get&&a.query?this._filterBox.store=a:e(["dojo/store/DataStore"],c.hitch(this,function(b){a=new b({store:a});this._filterBox.store=a}))},_createStore:function(a){e(["./_StoreListMixin","dojo/store/Memory"],c.hitch(this,function(b,d){k.safeMixin(this,new b);this.append=!0;this.createListItem=
function(a){return a.listItem};m.before(this,"generateList",function(){h.forEach(this.getChildren(),function(a){a.domNode.parentNode.removeChild(a.domNode)})});var e=[],f=null;h.forEach(this.getChildren(),function(a){f=a.label?a.label:a.domNode.innerText||a.domNode.textContent;e.push({label:f,listItem:a})});var g=new d({idProperty:"label",data:{items:e}});this.store=null;this.query={};this.setStore(g,this.query,this.queryOptions);c.hitch(this,a)()}))},_onFilter:function(a,b,c){!1!==this.onFilter(a,
b,c)&&(this.setQuery(b),(a=g.getEnclosingScrollable(this.domNode))&&a.scrollTo(this._filterBox.focusNode.value?{x:0,y:0}:this._previousUnfilteredScrollPos||{x:0,y:0}))},onFilter:function(){},destroy:function(a){this.inherited(arguments);this._createdFilterBox&&(this._createdFilterBox.destroy(a),this._createdFilterBox=null);this._createdScrollableView&&(this._createdScrollableView.destroy(a),this._createdScrollableView=null)}})});