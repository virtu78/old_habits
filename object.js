
var spriteManager = 
{
	atlas:null,
	image: new Image(),
	sprites:new Array(),//������ �������� ��� �����������
	imgLoaded:false,
	jsonLoaded:false
};

function LoadAtlas()
{
	var request = new XMLHttpRequest();//�������� ajax �������
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
		//true -  ��������� ����������� ����� �� path
		//  � �������������� ������� GET
		request.send();//�������� ������
};
spriteManager.ParseAtlas=function(atlasJSON)
{
	//��������� ����� � ���������
	spriteManager.atlas =JSON.parse(atlasJSON)
	console.log(spriteManager.atlas);
	for (var name in spriteManager.atlas.frames)
	{//������ �� ���� ������ � frames
		var frame = spriteManager.atlas.frames[name].frame;// ��������� ������� �
		//���������� �  frame
	// ���������� �������������  frame � ���� �������
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
	{//�������� ������ �� �����
		for (var i=0;i<spriteManager.sprites.length;i++)
		{
			var s=spriteManager.sprites[i];
			if (s.name === name)//��� ������� - ������� ������
			return s;
			console.log(s);
		}
	return null;//���� �� �����
	
	};
	/*var Entity = 
{
	pos_x:0,pos_y:0,//������� �������
	size_x:0, size_y:0,//������� �������
	extend:function(extendProto)
	{
		var object = Object.create(Entity)
		for(var property in ExtendProto)
		{
			if(Entity.hasOwnProperty(property) || typeof object[property]==="undefined")
			{
				object[property] = extendProto[property];
			}
		}//����� �����  for
	
	}//����� ������� extend
};
var Player = Entity.extend({
	lifetime:100,
	move_x:0,move_y:0,//����������� ��������
	speed:1,// �������� ������
	draw: function(ctx){},//���������� ������
	update: function(){},//���������� � �����
	onTouchEntity:function(obj){},//��������� ������� � ������������
	onTouchMap:function(idx){},//��������� ������� � �����
	kill:function(){},//����������� �������
	attack: function(){}//�����
});
var Enemy = Entity.extend({
	lifetime:100,
	move_x:0,move_y:0,//����������� ��������
	speed:1,// �������� ������
	draw: function(ctx){spriteManager.draw.Sprite(ctx, "left_stand", spriteManager.pos_x, spriteManager.pos_y);},//���������� ������
	update: function(){},//���������� � �����
	onTouchEntity:function(obj){},//��������� ������� � ������������
	onTouchMap:function(idx){},//��������� ������� � �����
	kill:function(){},//����������� �������
	attack: function(){}//�����
});
*/