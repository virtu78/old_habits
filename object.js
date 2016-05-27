
var spriteManager = 
{
	atlas:null,
	image: new Image(),
	sprites:new Array(),//массив объектов для отображения
	imgLoaded:false,
	jsonLoaded:false
};

function LoadAtlas()
{
	var request = new XMLHttpRequest();//создание ajax запроса
		request.open("GET", "scaven.json", true);
		//request.overrideMimeType('text/plain; charset=x-user-defined');
		request.onreadystatechange = function(){
			if(request.readyState == 4 ){
				if(request.status == 200){
				alert(request.responseText);
					
	   spriteManager.ParseAtlas(request.responseText);
	   spriteManager.loadImg();
	   
				}
			}
		};
		//true -  отправить асинхронный запрс на path
		//  с использованием функции GET
		request.send();//отпраить запрос
};
spriteManager.ParseAtlas=function(atlasJSON)
{
	//разобрать атлас с объектами
	spriteManager.atlas =JSON.parse(atlasJSON)
	console.log(spriteManager.atlas);
	for (var name in spriteManager.atlas.frames)
	{//проход по всем именам в frames
		var frame = spriteManager.atlas.frames[name].frame;// получение спрайта и
		//сохранение в  frame
	// сохранение характеристик  frame в виде объекта
	spriteManager.sprites.push({name:name,x:frame.x,y:frame.y,w:frame.w, h:frame.h});
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
	

spriteManager.drawSprite = function(ctx,name,x,y){
	if(!spriteManager.imgLoaded || !spriteManager.jsonLoaded){
			setTimeout(function(){spriteManager.drawSprite(ctx,name,x,y);},100);
			}else{
				var sprite = spriteManager.getSprite(name);
				ctx.drawImage(spriteManager.image,sprite.x,sprite.y,sprite.w,sprite.h,x,y.sprite.w,sprite.h);
}
};
	spriteManager.getSprite=function(name)
	{//получить объект по имени
		for (var i=0;i<spriteManager.sprites.length;i++)
		{
			var s=spriteManager.sprites[i];
			if (s.name === name)//имя совпало - вернуть объект
			return s;
			console.log(s);
		}
	return null;//если не нашли
	
	};
	/*var Entity = 
{
	pos_x:0,pos_y:0,//позиция объекта
	size_x:0, size_y:0,//размеры объекта
	extend:function(extendProto)
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