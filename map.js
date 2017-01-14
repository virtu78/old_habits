var mapManager = {
	mapData:null, //переменная для хранения карты
	tLayer:null, //переменная для хранения ссылки на блоки карты
	xCount:0, // количество блоков по горизонтали
	yCount:0, // количество блоков по вертикали
	tSize:{x:0,y:0}, // размер блока
	mapSize:{x:0, y:0}, //размер карты в пикселях
	tilesets: new Array(), //массив орисаний блоков карты
	imgLoadCount:0, // количество загруженных изображений
	imgLoaded:false,//все изображения загружены (сначала-false)
	jsonLoaded:false,//json описание загружено(сначала-false)
	view:{x:0, y:0, w:960, h:960}
}
function LoadMap(){
	
		var request = new XMLHttpRequest();//создание ajax запроса
		request.open("GET", "data.json", true);
		//request.overrideMimeType('text/plain; charset=x-user-defined');
		request.onreadystatechange = function(){
			if(request.readyState == 4 ){
				if(request.status == 200){
				//alert(request.responseText);
					
	   mapManager.parseMapJSON(request.responseText);
				}
			}
		};
		//true -  отправить асинхронный запрс на  path
		//  с использованием функции GET
		request.send(null);//отпраить запрос
	}
//var something = loadMap();
//loadMap();

mapManager.parseMapJSON = function(mapJSON){
		mapManager.mapData = JSON.parse(mapJSON);//разобрать JSON
		mapManager.xCount = mapManager.mapData.width;// сохранение ширины
		mapManager.yCount = mapManager.mapData.height;//сохранение высоты
		mapManager.tSize.x = mapManager.mapData.tilewidth;// сохранение размера блока
		mapManager.tSize.y = mapManager.mapData.tileheight;// сохранение размера блока
		mapManager.mapSize.x = mapManager.xCount*mapManager.tSize.x;//вычисление размера карты
		mapManager.mapSize.y = mapManager.yCount*mapManager.tSize.y;//вычисление размера карты
		for(var i=0; i<mapManager.mapData.tilesets.length; i++)
		{
			var img = new Image();//создаем переменную для хранения изображений
			img.onload = function()
			{
				mapManager.imgLoadCount++;//увеличиваем счетчик
				if(mapManager.imgLoadCount === mapManager.mapData.tilesets.length)
				{
					mapManager.imgLoaded=true;//Загружены все изображения
				}
				
			};// конец описания функции onload
			
		
	
	        img.src =  mapManager.mapData.tilesets[i].image; 
			
	        //забираем tileset 
	        var t = mapManager.mapData.tilesets[i];//
	       var ts = {// создаем свой объект tileset
	
	            firstgid: t.firstgid, // firstgid - с него начинается нумерация в data
	             image: img, // объект рисунка
	             name: t.name,
	             xCount: Math.floor(t.imagewidth/mapManager.tSize.x),//горизонталь
		         yCount: Math.floor(t.imageheight/mapManager.tSize.y)//вертикаль
				 
	       };//конец объявления объекта ts
		   
	           mapManager.tilesets.push(ts);// сохраняем tileset в массив
	    }// окончание цикла for
		console.log(ts.image);
	 mapManager.jsonLoaded = true;//true, когда разобрали весь jsonLoaded
	
	}
	
/*mapManager.parseEntities=function(){
	//разбор слоя типа objectgroup
if(!mapManager.imgLoaded || !mapManager.jsonLoaded){
			setTimeout(function(){mapManager.parseEntities();},100);
			}else
				for(var j = 0; j<mapManager.mapData.layers.length; j++)
					//проходим по всем слоям карты
				if(mapManager.mapData.layers[j].type === "objectgroup")
				{
						var entities = mapManager.mapData.layers[j];
						
						//разобрать слой с объектами
						for(var i=0; i<entities.objects.length; i++)
						{
							var e = entities.objects[i];
							console.log(e);
								try
							{
								var obj = Object.create(gameManager.factory[e.type]);
								//  в соответсвии с типом создаем экземпляр объекта
								console.log(gameManager);
								obj.name = e.name;
								obj.pos_x = e.x;
								obj.pos_y = e.y;
								obj.size_x = e.width;
								obj.size_y = e.height;
								//помещаем в массив объектов
								gameManager.entities.push(obj);
								
								if(obj.name === "player")
								//инициализируем параметры игрока
								gameManager.initPlayer(obj);
								
							}	catch(ex){
								console.log("Error while creating: ["+e.gid+"]" +e.type+","+ex);
								//сообщение об ошибке
								
						}
				}// конец  for  для объектов слоя objectgroup
				
}// конец  if  проверки типа слоя на равенство objectgroup

};
*/
mapManager.draw = function(ctx){ 	//нарисовать карту в контексте
		//если карта не загружена, то повторить прорисовку через 100 мсек
		if(!mapManager.imgLoaded || !mapManager.jsonLoaded)
		{
			setTimeout(function(){mapManager.draw(ctx);},100);}
			else{
				if(mapManager.tLayer === null)//проверить, что  tLayer  настроен
					for(var id = 0; id<mapManager.mapData.layers.length; id++)
					{//проходим по всем слоям карты
						var layer = mapManager.mapData.layers[id];
						if(layer.type === "tilelayer")
						{//если не tilelayer - пропускаем
							mapManager.tLayer = layer;
							break;
						}
						
					}//окончание цикла  for
					
				for(var i = 0; i < mapManager.tLayer.data.length; i++)
				{// проойти по всей карте
					if(mapManager.tLayer.data[i] !==0)
					{//если нет данных - пропускаем
						var tile = mapManager.getTile(mapManager.tLayer.data[i]);//получение блока по индексу
						//i  проходит линейно по массиву. xCount-  длина по x
						var pX = (i % mapManager.xCount) * mapManager.tSize.x;//вычисляем x  в пикселах
						var pY = Math.floor(i / mapManager.xCount) * mapManager.tSize.y//вычисляем  y
						//рисуем в контексте
						// не рисуем за пределами видимой зоны
						//if(isVisible(pX, pY, mapManager.tSize.x, mapManager.tSize.y))
						//	continue;
						// сдвигаем видимую зону
						
						if(!mapManager.isVisible(pX,pY,mapManager.tSize.x,mapManager.tSize.y))
							continue;
						pX=pX-mapManager.view.x;
						pY=pY-mapManager.view.y;
						ctx.drawImage(tile.img, tile.px, tile.py, mapManager.tSize.x,
						mapManager.tSize.y, pX, pY, mapManager.tSize.x, mapManager.tSize.y);
					}
					
				}//окончание цикла  for
				
		}//окончание if else
				
	spriteManager.drawSprite(ctx,'left_right', Scaven.pos_x, Scaven.pos_y)
			
	};
	


mapManager.getTile = function (tileIndex){// индекс блока
		var tile = 
		{//один блока
			img:null,//изображение tileset
			px:0, 
			py:0//координаты блока в  tileset
		};
		//console.log(tile);
		var tileset = mapManager.getTileset(tileIndex);
		tile.img = tileset.image;//изображение искомого  toleset
		var id = tileIndex - tileset.firstgid;//индекс блока в  tileset
		//блок прямоугольный,остаток от деления на xCount дает x  в  tileset
		var x = id % tileset.xCount;
		// округление от деления на  xCount дает y в tileset
		var y = Math.floor(id/tileset.xCount);
		//с учетом размера можно посчитать координаты блока в пикселах
		tile.px = x * mapManager.tSize.x;
		tile.py =y * mapManager.tSize.y;
		
		return tile;// возвращаем блок для отображения		
	};
	
	
mapManager.getTileset = function (tileIndex){// получение блока по индексу
	for(var i=mapManager.tilesets.length - 1; i >= 0; i--)
		//в каждом  tilesets[i].firstgid  записано число, 
		//с которого начинается нумерация блоков
	if(mapManager.tilesets[i].firstgid <= tileIndex)
	{
		//если индекс первого блока меньше либо равен искомому
		//значит этот  tileset  и нужен
		return mapManager.tilesets[i]
	}
	return null;// возвращается найденный  tileset
};
mapManager.isVisible =function(x,y,width,height){// не рисуем за пределами видимой зоны
if(x+width<mapManager.view.x||y+height<mapManager.view.y||
x>mapManager.view.x+mapManager.view.w||y>mapManager.view.y+mapManager.view.h)
return false;
return true;
};
	var Scaven = {
	pos_x:480, pos_y:480,//позиция объекта врага
	
}
var spriteManager = {
	atlas:null,
	image: new Image(),
	sprites:new Array(),//массив объектов для отображения
	imgLoaded:false,
	jsonLoaded:false
};

function LoadAtlas(){
	var request = new XMLHttpRequest();//создание ajax запроса
		request.open("GET", "scaven.json", true);
		//request.overrideMimeType('text/plain; charset=x-user-defined');
		request.onreadystatechange = function(){
			if(request.readyState == 4 ){
				if(request.status == 200){
				
					
	   spriteManager.parseAtlas(request.responseText);
	   spriteManager.loadImg();
	   
				}
			}
		};
		//true -  отправить асинхронный запрс на path
		//  с использованием функции GET
		request.send();//отпраить запрос
};

spriteManager.parseAtlas=function(atlasJSON){
	//разобрать атлас с объектами
	spriteManager.atlas =JSON.parse(atlasJSON)
	
	for (var name in spriteManager.atlas.frames)
	{//проход по всем именам в frames
		var frame = spriteManager.atlas.frames[name].frame;// получение спрайта и
		//сохранение в  frame
	// сохранение характеристик  frame в виде объекта
	spriteManager.sprites.push({name: name, x: frame.x, y: frame.y, w:frame.w, h:frame.h});
	spriteManager.jsonLoaded=true;
	console.log(spriteManager.jsonLoaded);
	}
};
console.log(spriteManager.sprites);


spriteManager.loadImg =function(){
	for(var image in spriteManager.atlas.meta)
	{
		var img = new Image();
		img.onload = function()
		{
			spriteManager.imgLoaded=true;
			console.log(spriteManager.imgLoaded);			
		};
		img.src = spriteManager.atlas.meta.image;
		spriteManager.image=img;
	}
	
console.log(spriteManager.image);
	
};
console.log(spriteManager);
	
spriteManager.drawSprite = function(ctx,name,x, y){
	if(!spriteManager.imgLoaded || !spriteManager.jsonLoaded){
			setTimeout(function(){spriteManager.drawSprite(ctx, name, x, y);},100);
			}else{
				var sprite = spriteManager.getSprite('left_right');
				if(!mapManager.isVisible(x,y,sprite.w, sprite.h))
					return;//не рисуем за пределами видимой зоны
				//сдвигаем видимую зону
				x-=mapManager.view.x;
				y-=mapManager.view.y;
				//console.log(spriteManager.imgLoaded);
				//console.log(spriteManager.jsonLoaded);
				//console.log(sprite);
				ctx.drawImage(spriteManager.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
}

};

	spriteManager.getSprite=function(name){//получить объект по имени
		for (var i=0;i<spriteManager.sprites.length;i++)
		{
			var s=spriteManager.sprites[i];
			if (s.name === name)//имя совпало - вернуть объект
			return s;
			//console.log(s);
		}
	return null;//если не нашли
	
	};
	

	/*extend:function(extendProto)
	{
		var object = Object.create(Entity)
		for(var property in ExtendProto)
		{
			if(Entity.hasOwnProperty(property) || typeof object[property]==="undefined")
			{
				object[property] = extendProto[property];
			}
		}//конец цикла  for
	
	}//конец функции extend
};
var Player = Entity.extend({
	lifetime:100,
	move_x:0,move_y:0,//направление движения
	speed:1,// скорость игрока
	draw: function(ctx){},//прорисовка игрока
	update: function(){},//обновление в цикле
	onTouchEntity:function(obj){},//обработка встречи с препятствием
	onTouchMap:function(idx){},//обработка встречи с лавой
	kill:function(){},//уничтожение объекта
	attack: function(){}//атака
});
var Enemy = Entity.extend({
	lifetime:100,
	move_x:0,move_y:0,//направление движения
	speed:1,// скорость игрока
	draw: function(ctx){spriteManager.draw.Sprite(ctx, "left_stand", spriteManager.pos_x, spriteManager.pos_y);},//прорисовка игрока
	update: function(){},//обновление в цикле
	onTouchEntity:function(obj){},//обработка встречи с препятствием
	onTouchMap:function(idx){},//обработка встречи с лавой
	kill:function(){},//уничтожение объекта
	attack: function(){}//атака
});

*/
