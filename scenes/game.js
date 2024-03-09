import { Scoreboard } from "../components/Scoreboard";

export class Game extends Phaser.Scene {

    constructor() {
      super({ key: 'game' });
    }

    init(){
      this.scoreboard = new Scoreboard(this);
    }
  
    preload() {
      this.load.image('background', 'images/background.png');     
      this.load.image('plataforma','images/plataforma.png');
      this.load.image('bola','images/bola.png');
      this.load.image('azulbloque','images/bloqueazul.png')
      this.load.image('negrobloque','images/bloquenegro.png')
      this.load.image('verdebloque','images/bloqueverde.png')
      this.load.image('naranjabloque','images/bloquenaranja.png')
      this.load.audio('gameoversample', 'sonidos/gameover.ogg')
      this.load.audio('brickimpactsample', 'sonidos/sounds_brick-impact.ogg')
      this.load.audio('platformsample', 'sonidos/platform-impact.ogg')
      this.load.audio('startsample', 'sonidos/start-game.ogg')
      this.load.audio('youwinsample', 'sonidos/you_win.ogg')
    }
  
    create() {
      this.physics.world.setBoundsCollision(true, true , true, false);

      this.add.image(440, 250, 'background');
      
      this.scoreboard.create();

    this.bricks = this.physics.add.staticGroup({
    key: ['azulbloque', 'naranjabloque', 'verdebloque', 'negrobloque'],
    frameQuantity: 10,
    gridAlign: {
      width: 10,
      height: 4,
      cellWidth: 67,
      cellHeight: 34,
      x: 65,
      y: 100
    }
    });

      this.plataforma = this.physics.add.image( 400, 460, 'plataforma').setImmovable();
      this.plataforma.setScale(0.2); // Reduce el tamaño de la imagen 
      this.plataforma.body.allowGravity = false
      this.plataforma.setCollideWorldBounds(true); 

      this.bola = this.physics.add.image( 400, 425, 'bola');
      this.bola.setScale(0.04); // Reduce el tamaño de la imagen
      this.bola.setData('glue',true);
      this.bola.setCollideWorldBounds(true); 

      this.physics.add.collider(this.bola, this.plataforma, this.impactaplataforma, null, this);
      this.physics.add.collider(this.bola, this.bricks, this.impactabrick, null, this);

      this.gameOverSample = this.sound.add('gameoversample');
      this.brickImpactSample = this.sound.add('brickimpactsample');
      this.platformtSample = this.sound.add('platformsample');
      this.youwinSample = this.sound.add('youwinsample');

      this.bola.setBounce(1);

      this.cursors = this.input.keyboard.createCursorKeys();

    }

    impactabrick(bola, brick){
      this.brickImpactSample.play();
      brick.disableBody(true, true);
      this.scoreboard.incrementapuntos(10);
      if(this.bricks.countActive() === 0){
        this.showCongratulations();
      }
    }

    impactaplataforma(bola, plataforma){
      this.platformtSample.play();
      this.scoreboard.incrementapuntos(1);
      let relativeImpact = bola.x - plataforma.x;
      console.log(relativeImpact);
      if(relativeImpact < 0.1 && relativeImpact >0.1){
        bola.setVelocityX(Phaser.Math.Between(-10, 10))
      } else {
      bola.setVelocityX(10 * relativeImpact);
      }
    }

    update() {
      if(this.cursors.left.isDown) {
        this.plataforma.setVelocityX(-500);
        if(this.bola.getData('glue')){
          this.bola.setVelocityX(-500);
        }   
      }
      else if(this.cursors.right.isDown) {
        this.plataforma.setVelocityX(500);
        if(this.bola.getData('glue')){
          this.bola.setVelocityX(500);
        }   
      }
      else{
        this.plataforma.setVelocityX(0);
        if(this.bola.getData('glue')){
          this.bola.setVelocityX(0);
        }   
      }

      if(this.bola.y > 500){
        console.log('fin');
        this.showGameOver();
      }

      if(this.cursors.up.isDown) {
        this.bola.setVelocity(-75, -300);
        this.bola.setData('glue', false);
      }
    }
  
      showGameOver(){
        this.gameOverSample.play();
        this.scene.start('gameover');
      }

      showCongratulations(){
        this.youwinSample.play();
        this.scene.start('congratulations');
      }
  }