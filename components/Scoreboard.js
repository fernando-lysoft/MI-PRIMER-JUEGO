export class Scoreboard {
    constructor(scene) {
        this.relatedScene = scene;
        this.score = 0;
    }

    create(){
        this.scoreText = this.relatedScene.add.text(16, 16, 'PUNTOS: 0',{
            fontSize:'20px',
            fil:'#fff',
            fontFamily: 'verdana, arial, sans-serif'
          });
    }

    incrementapuntos(puntos) {
        this.score += puntos;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }
}