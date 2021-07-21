var man, manRunningImage, manCollidedImage;
var wolf,wolfWalkingImage, wolfStopingImg;
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
  manRunningImage = loadAnimation("Images/runningMan1.jpg","Images/runningMan2.jpg","Images/runningMan3.jpg","Images/runningMan4.jpg","Images/runningMan5.jpg","Images/runningMan6.jpg",);
  manCollidedImage = loadImage("Images/runningMan7.jpg");
  wolfWalkingImage = loadAnimation("Images/wolf1.png","Images/wolf2.png","Images/wolf3.png","Images/wolf4.png","Images/wolf5.png","Images/wolf6.png",);
  wolfStopingImage = loadImage("Images/wolf7.png",);
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
  
  man = createSprite(400,480,20,20);
  man.x = ground.x/1.2;
  man.y = ground.y*1.45;
  man.addAnimation("running", manRunningImage);
  man.scale = 1.5;
  // man.debug = true;
  // man.setCollider("rectangle",0,0,100,200);
  
  wolf = createSprite(100,480,20,20);
  wolf.x = ground.x/4;
  wolf.y = ground.y*1.45;
  wolf.addAnimation("walking",wolfWalkingImage);
  wolf.scale = 1.5;
  // wolf.debug = true;
  // wolf.setCollider("rectangle",0,0,200,50);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-100);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
  
  restart = createSprite(windowWidth/2,windowHeight/2-35);
  restart.addImage(restartImage);
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,windowHeight/3,windowWidth,10);
  invisibleGround.y = ground.y+230;
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
  
  // camera.position.x = man.x;
  camera.position.y = man.y;

  life1.x = man.x-10;
  life1.y = man.y-80;

  life2.x = man.x+10;
  life2.y = man.y-80;

  life3.x = man.x+30;
  life3.y = man.y-80;

  life4.x = man.x+50;
  life4.y = man.y-80;

  life5.x = man.x+70;
  life5.y = man.y-80;
  
  if(gameState===PLAY){
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(8 + 3*score/150);
    
    if(keyDown("space") && man.collide(invisibleGround)) {
      man.velocityY = -23;
    }
    if(obstaclesGroup.isTouching(wolf)){
      wolf.velocityY = -20;
    }
    man.velocityY = man.velocityY + 1;
    wolf.velocityY = wolf.velocityY + 1;
    wolf.x = windowWidth/7;
    
    if (ground.x < 780){
      ground.x = width-780;
    }
    
    createObstacles();
    if(obstaclesGroup.isTouching(man)){
      lifePoint -= 1;
      obstaclesGroup.destroyEach();
    }
    
    if(lifePoint===4){
      life5.visible = false;
    }
    if(lifePoint===3){
      life4.visible = false;
    }
    
    if(lifePoint===2){
      life3.visible = false;
    }
    
    if(lifePoint===1){
      life2.visible = false;
    }
    
    if(lifePoint===0){
      life1.visible = false;
      gameState = END;
      console.log("Game Over!");
      console.log("Click 'Restart' to restart the game");
    }
    
  }
  else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    man.velocityY = 0;
    wolf.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    man.addImage("manCollided",manCollidedImage);
    man.changeImage("manCollided");
    wolf.addImage("wolfStop",wolfStopingImage);
    wolf.changeImage("wolfStop");
    wolf.x = man.x-70;
    wolf.y = man.y;
    obstaclesGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  console.log(lifePoint + " Heart left");
  man.collide(invisibleGround);
  wolf.collide(invisibleGround);
  drawSprites();
  textSize(20);
  fill(0);
  text("Score: "+ score,windowWidth/2,windowHeight/15);
  text("Press 'Space' key to jump Man",windowWidth/2,windowHeight/30);
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
  wolf.x = ground.x/4;
  
  obstaclesGroup.destroyEach();
  
  man.changeAnimation("running");
  wolf.changeAnimation("walking");
  score = 0;
  lifePoint = 5;
  life1.visible = true;
  life2.visible = true;
  life3.visible = true;
  life4.visible = true;
  life5.visible = true;
  console.log("Game Restarted!");
}