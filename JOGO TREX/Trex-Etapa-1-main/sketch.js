//começar criando as variaveis.

var rex;

var rexrunning;

var rexdie;

var ground;

var groundpic;

var invisibleGround;

var cloud;

var cloudpic;

var obstaclePic1

var obstaclePic2

var obstaclePic3

var obstaclePic4

var obstaclePic5

var obstaclePic6

var obstacleGroup

var cloudGroup

var PLAY = 1;

var END = 0;

var gameState = PLAY  

var score = 0

var spriteGameOver

var spriteGameOverPic

var spriteRestart

var spriteRestartPic

var musicCheckPoint

var musicDie

var musicJump


function preload () {  //funçao para carregar os arquivos de imagem .png e de audio.

rexrunning = loadAnimation ("trex1.png","trex3.png","trex4.png");

rexdie = loadImage ("trex_collided.png");

groundpic = loadImage ("ground2.png");

cloudpic = loadImage ("cloud.png");

obstaclePic1 = loadImage ("obstacle1.png");

obstaclePic2 = loadImage ("obstacle2.png");

obstaclePic3  = loadImage ("obstacle3.png");

obstaclePic4 = loadImage ("obstacle4.png");

obstaclePic5 = loadImage ("obstacle5.png");

obstaclePic6 = loadImage ("obstacle6.png");

spriteGameOverPic = loadImage ("gameOver.png")

spriteRestartPic = loadImage ("restart.png")

musicCheckPoint = loadSound ("checkPoint.mp3")

musicDie = loadSound ("die.mp3")

musicJump = loadSound ("jump.mp3")

}


function setup() {
  createCanvas(600, 200);
  rex = createSprite (50,180,20,50);
  rex.addAnimation ("running",rexrunning); //adicionar animação rex correndo.
  rex.addAnimation("rexdying",rexdie); //adicionar animação do rex morrendo. 
  rex.scale = 0.5; //definir tamanho do rex
  
  rex.setCollider ("circle",0,0,40); //adicionar circulo verde ao redor do rex, esse circulo será a area de colisão(contato). 
  rex.debug = false; //deixar esse circulo verde invisivel, para aparecer so o dinossauro, sem circulo nenhum.
  
ground = createSprite (200,180,400,20);
ground.addAnimation ("ground",groundpic);
 
obstacleGroup = new Group ();
cloudGroup = new Group ();

spriteGameOver = createSprite (300,100,10,10);
spriteGameOver.addAnimation ("gameover",spriteGameOverPic);
spriteGameOver.scale = 0.7;

spriteRestart = createSprite (300,140,10,10);
spriteRestart.addAnimation ("restart",spriteRestartPic);
spriteRestart.scale = 0.5;

invisibleGround = createSprite (200,190,400,10); //chao invisivel para fazer o dinossauro ficar encima do sprite ground certinho.
invisibleGround.visible = false // deixar variavel invisivel
}

function draw() {
  background("lightgray") //cor do fundo selecionada a partir de r,g,b (red, green, blue) varia de 0-255 cada uma ou apenas escrever o nome da cor entre aspas.
  rex.collide (invisibleGround); //fazer o rex encostar com o "chao invisivel" para ele ficar encima do sprite ground certinho.
  textSize(15) //tamanho do texto
  text("score: "+score,30,30); //texto que deve ser exibido + pontuação, X , Y


  if (gameState === PLAY) { //se o estado de jogo for play, ou seja, quando o dinossauro esta vivo.
      ground.velocityX = -(8+ 3 * score/100); //velocidade do chao indo para esquerda, simulando o movimento do dinossauro. velocidade aumentando de 100 em 100 pontos.
      if (score > 0 && score%100 === 0){
   musicCheckPoint.play()//codigo para tocar a musica, que foi carregada na preload
      }

      spawnClouds(); //função para spawnar nuvens (criada la embaixo do codigo)
      spawnObstacles(); //função para spawnar obstaculos (criada la embaixo do codigo) 
  
       score=score + Math.round (getFrameRate()/60); //codigo para fazer a pontuação subir progressivamente, usando o frame rate, /60 para o numero nao ficar muito grande
      
        if (ground.x<0) { //quando o chao chegar ate a posixão X menor q 0, ou seja -1, consequência abaixo:
        ground.x = ground.width/2; //o chao sera divido em duas partes e cada uma das partes vai reinicializar encima da outra, quando uma chega ao 0 a outra é exibida.
            }
        if (keyDown("space") && rex.y >= 155 ) { //se a tecla espaço estiver pressionada e a localização Y do rex for maior ou igual a 155(para ele nao ficar pulando no ar): consequencia abaixo
       musicJump.play(); //codigo para tocar a musica, que foi carregada na preload
       rex.velocityY = -11; //pulo do rex.
              } 
        rex.velocityY=rex.velocityY + 0.8; //para fazer o papel da gravidade, ou seja, quando o dinossauro pular, ele vai voltar para o chão. velocidade Y positiva= força para baixo. 
        
        if (obstacleGroup.isTouching(rex)) { //se o grupo de obstaculos encostar no rex, transformar o estado de jogo em end, ou seja, acabar
       musicDie.play(); //codigo para tocar a musica, que foi carregada na preload
       gameState = END;   
              }
  spriteGameOver.visible = false; // var.visible = false faz com que a variavel não apareça em determinado estado de jogo.                            
  spriteRestart.visible = false;
}

  if (gameState === END) { //se o estado de jogo for end, ou seja, quando o dinossauro morre, fim do jogo.
       ground.velocityX = 0; //velocidade do chão = 0 (essa velocidade do chao q da ideia de movimeneto do dinossauro) deixar o dinossauro parado.
       
       cloudGroup.setVelocityXEach(0); //mudar a velocidade do grupo das nuvens para 0.
       
       obstacleGroup.setVelocityXEach(0);  //mudar a velocidade do grupo dos obstaculos para 0.
       
       rex.changeAnimation("rexdying",rexdie); //mudar a animação do rexrunning para rexdie, ou seja, animação do rex morto.
       rex.velocityY = 0;//velocidade y do rex = 0, para quando perder o dinossauro parar pular
       
       spriteRestart.visible = true; //deixar o sprite do texto "restart" visivel, pois o jogo "acabou".
       spriteGameOver.visible = true; //deixar o sprite do texto "gameOver" visivel, pois o jogo "acabou".
       
       

  if (mousePressedOver(spriteRestart)) { // se apertar o "spriteRestart" chama a função resetbuttom, criada la em baixo;
       resetbuttom(); //função para o botao restart;
       }

       cloudGroup.setLifetimeEach(-1); //lifetime das nuvens -1 para quando o jogo acabar as nuvens nao sumirem.
       obstacleGroup.setLifetimeEach(-1); //lifetime dos obstaculos -1 para quando o jogo acabar os obstaculos nao sumirem.
}      
drawSprites();

} 
function spawnClouds() { //função para spawnar nuvens
  if (frameCount % 60 === 0) { //cada vez que o frame count dividido por 60 tiver resto 0, ou seja de 60 em 60 frames: consequencia abaixo.
    cloud = createSprite (600,50,40,10); //crias sprite da nuvem, X, Y, largura, altura.
     cloud.velocityX = -(8 + 3 * score/100); //definir a velocidade da nuvem, numero negativo pois esta indo para esquerda.
      cloud.addAnimation ("cloud", cloudpic); //adicionando animação das nuvens, cloudpic foi definida la na function preload.
      cloud.y = Math.round(random(50,100)); //codigo para gerar as nuvens de forma aleatoria na posição Y.

      cloudGroup.add(cloud); //criando grupo de nuvens, adicionado a variavel cloud. 

      cloud.depth = rex.depth; //pedir professora para ajudar com comentario
      rex.depth = rex.depth + 1;//pedir professora para ajudar com comentario
      
      cloud.lifetime=108; //lifetime das nuvens para quando elas sairem da area do canvas elas desapareçam, deixando o jogo menos pesado.
  } 
}
function spawnObstacles() { //função para criar obstaculos.
if (frameCount % 60 === 0) { //cada vez que o frame count dividido por 60 tiver resto 0, ou seja de 60 em 60 frames: consequencia abaixo.
  var obstacleSprite = createSprite (400,165,10,40); //criar sprite do obstaculo, X, Y, largura, altura.
       obstacleSprite.velocityX = -(8 + 3 * score/100); //definir a velocidade do obstaculo, negativo pois esta indo pra esquerda, na mesma velocidade que o chão.
        obstacleSprite.scale = 0.5; //definir o tamanho do obstaculo
         obstacleSprite.lifetime=55; //lifetime dos sprites para quando eles sairem da area do canvas eles desapareçam, deixando o jogo menos pesado.

         obstacleGroup.add(obstacleSprite); //criando grupo dos obstaculos adicionando a variavel do obstaculo.

         var randomObstacle = Math.round(random(1,6)); //essa variavel terá 6 opçoes de skins de obstaculos e eles serao escolhidos aleatoriamente ao longo do jogo.
         switch (randomObstacle) { //switch(alternar) entre os cases(opções) abaixo:
        
        case 1: obstacleSprite.addImage(obstaclePic1); //opção 1, com o seu obstaculo 1 carregado.
               break;//break é para evitar que a imagem que acabou de ser escolhida, seja escolhida novamente, em seguida; a sequencia 1,2,1 é possivel, por ex.
        case 2: obstacleSprite.addImage(obstaclePic2); //opção 2, com o seu obstaculo 2 carregado.
               break;
        case 3: obstacleSprite.addImage(obstaclePic3); //opção 3, com o seu obstaculo 3 carregado.
               break;
        case 4: obstacleSprite.addImage(obstaclePic4); //opção 4, com o seu obstaculo 4 carregado.
               break;
        case 5: obstacleSprite.addImage(obstaclePic5); //opção 5, com o seu obstaculo 5 carregado.
               break;
        case 6: obstacleSprite.addImage(obstaclePic6); //opção 6, com o seu obstaculo 6 carregado.
               break;
        default:break; //reinicializar esse processo todo novamente, para que mesmo quando todas as opções tenham sido escolhidas, os obstaculos nao parem de ser gerados.
 }
  }
   }
function resetbuttom() { //para reiniciar o jogo.
gameState = PLAY;

score = 0 

spriteGameOver.visible = false; // var.visible = false faz com que a variavel não apareça em determinado estado de jogo.                            
spriteRestart.visible = false;

cloudGroup.destroyEach() //quando o botao reset for pressionado destruir as nuvens
obstacleGroup.destroyEach() //quando o botao reset for pressionado destruir os obstaculos.

rex.changeAnimation ("running",rexrunning); //quando o botao reset for pressionado mudar a animação para rex running(para o jogo começar novamente)
}


