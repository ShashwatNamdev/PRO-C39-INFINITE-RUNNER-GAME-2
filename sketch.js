var truck, truckDrivingImage, truckCollidedImage;
var tiger,tigerRunningImage, tigerStopingImg;
var ground, groundImg;
var invisibleGround;
var obstaclesGroup, obstacle, obstacle1, obstacle2, obstacle3;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score=0;
var gameOver, restart;
var life1, life2, life3, life4, life5, lifeImg1, lifeImg2, lifeImg3, lifeImg4, lifeImg5;
var lifePoint = 5;

function preload(){
  truckDrivingImage = loadAnimation("Images/truckImg_1.png","Images/truckImg_2.png");
  truckCollidedImage = loadImage("Images/truckImg_1.png");
  tigerRunningImage = loadAnimation("Images/tigerImg_1.png","Images/tigerImg_2.png","Images/tigerImg_3.png","Images/tigerImg_4.png","Images/tigerImg_5.png","Images/tigerImg_6.png","Images/tigerImg_7.png","Images/tigerImg_8.png");
  tigerStopingImage = loadImage("Images/tigerImg_2.png");
  groundImage = loadImage("Images/groundImg.png");
  obstacle1 = loadImage("Images/obstacleImg_1.png");
  obstacle2 = loadImage("Images/obstacleImg_2.png");
  obstacle3 = loadImage("Images/obstacleImg_3.png");
  
  gameOverImage = loadImage("Images/gameoverImg.png");
  restartImage = loadImage("Images/restartImg.png");

  lifeImg1 = loadImage("Images/heart1.png");
  lifeImg2 = loadImage("Images/heart2.png");
  lifeImg3 = loadImage("Images/heart3.png");
  lifeImg4 = loadImage("Images/heart4.png");
  lifeImg5 = loadImage("Images/heart5.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  ground = createSprite(width /2,height/2,windowWidth,windowHeight);
  ground.addImage("ground",groundImage);
  ground.scale = 2.1;
  
  truck = createSprite(400,480,20,20);
  truck.x = ground.x/1.2;
  truck.y = ground.y*1.45;
  truck.addAnimation("driving", truckDrivingImage);
  truck.scale = 0.35;
  
  tiger = createSprite(100,480,20,20);
  tiger.x = ground.x/4;
  tiger.y = ground.y*1.45;
  tiger.addAnimation("running",tigerRunningImage);
  tiger.scale = 0.5;
  tiger.setCollider("rectangle",100,0,600,130);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-100);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
  
  restart = createSprite(windowWidth/2,windowHeight/2-35);
  restart.addImage(restartImage);
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,windowHeight/1.5,windowWidth,10);
  invisibleGround.y = ground.y*1.58
  invisibleGround.visible = false;

  life1 = createSprite(100,100);
  life1.addImage(lifeImg1);
  life1.scale = 0.1;

  life2 = createSprite(100,100);
  life2.addImage(lifeImg1);
  life2.scale = 0.1;

  life3 = createSprite(100,100);
  life3.addImage(lifeImg1);
  life3.scale = 0.1;

  life4 = createSprite(100,100);
  life4.addImage(lifeImg1);
  life4.scale = 0.1;
  
  life5 = createSprite(100,100);
  life5.addImage(lifeImg1);
  life5.scale = 0.1;

  obstaclesGroup = new Group();
}

function draw() {
  background(218,214,172);
  
  // camera.position.x = truck.x;
  camera.position.y = truck.y;

  life1.x = truck.x-60;
  life1.y = truck.y-80;

  life2.x = truck.x-35;
  life2.y = truck.y-80;

  life3.x = truck.x-10;
  life3.y = truck.y-80;

  life4.x = truck.x+15;
  life4.y = truck.y-80;

  life5.x = truck.x+40;
  life5.y = truck.y-80;
  
  if(gameState===PLAY){
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(8 + 3*score/150);
    
    if(keyDown("space") && truck.collide(invisibleGround)) {
      truck.velocityY = -23;
    }
    if(obstaclesGroup.isTouching(tiger)){
      tiger.velocityY = -20;
    }
    truck.velocityY = truck.velocityY + 1;
    tiger.velocityY = tiger.velocityY + 1;
    tiger.x = windowWidth/7;
    
    if (ground.x < 0){
      ground.x = width;
    }
    
    createObstacles();
    if(obstaclesGroup.isTouching(truck)){
      lifePoint -= 1;
    }
    
    if(lifePoint===4){
      life5.visible = false;
      obstaclesGroup.destroyEach();
    }
    if(lifePoint===3){
      life4.visible = false;
      obstaclesGroup.destroyEach();
    }
    
    if(lifePoint===2){
      life3.visible = false;
      obstaclesGroup.destroyEach();
    }
    
    if(lifePoint===1){
      life2.visible = false;
      obstaclesGroup.destroyEach();
    }
    
    if(lifePoint===0){
      life1.visible = false;
      gameState = END;
    }
    
  }
  else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    truck.velocityY = 0;
    tiger.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    truck.addImage("truckCollided",truckCollidedImage);
    truck.changeImage("truckCollided");
    tiger.addImage("tigerStop",tigerStopingImage);
    tiger.changeImage("tigerStop");
    tiger.x = truck.x-70;
    tiger.y = truck.y;
    obstaclesGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  console.log(lifePoint);
  truck.collide(invisibleGround);
  tiger.collide(invisibleGround);
  drawSprites();
  textSize(20);
  fill(0);
  text("Score: "+ score,windowWidth/2,windowHeight/15);
  text("Press 'Space' key to jump the Truck",windowWidth/2,windowHeight/30);
}

function createObstacles() {
  if(frameCount % 90 === 0){
    var obstacle = createSprite(windowWidth*2,windowHeight/1.4,10,40);
    // obstacle.debug = true;
    obstacle.velocityX = -(8 + 3*score/150);
    
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    obstacle.scale = 0.4;
    if(obstacle.x<-500){
      obstacle.lifetime = 300;
    }
    obstacle.setCollider("rectangle",0,0,300,160);
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  tiger.x = ground.x/4;
  
  obstaclesGroup.destroyEach();
  
  truck.changeAnimation("driving");
  tiger.changeAnimation("running");
  score = 0;
  lifePoint = 5;
  life1.visible = true;
  life2.visible = true;
  life3.visible = true;
  life4.visible = true;
  life5.visible = true;
}