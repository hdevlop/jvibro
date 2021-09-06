import Roboto from './Seven_Seg.ttf'
var Width = window.screen.width;
var Height = window.screen.height - 100;
var tela;
var freq = 0;
var freq_Arr = [];

const { ipcRenderer } = window.require("electron");
ipcRenderer.on('freq', (event, c1) => {
    freq_Arr.push(c1*60);
    if (freq_Arr.length > 200){
        freq = Averaging(freq_Arr).toFixed(0);
        freq_Arr = [];
    }
})

const Averaging = (arr) => {
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += parseFloat(arr[i], 10);
    }
    var avg = total / arr.length;
    return avg
}

const oscilloBack = p => {
    var myFont;
    p.setup = () => {
        myFont = p.loadFont(Roboto);
        p.createCanvas(Width, Height);
        tela = new Tela(0, 0, Width, Height);
    }
    p.draw = () => {
        p.strokeWeight(0.5);
        p.background("#0e1f0e");
        p.fill(232, 235, 52);

        tela.display();
        p.fill("white");
        p.textSize(110);
        p.textFont(myFont);
        p.text(freq, 60, 100);
        p.textSize(50);
        p.text("rpm", 250, 100);
    }

    class Tela {
        constructor(xi, yi, wi, hi) {
            this.x = parseInt(xi);
            this.y = parseInt(yi);
            this.w = parseInt(wi);
            this.h = parseInt(hi);
        }
        display() {

            p.fill(0);
            p.strokeWeight(1);
            p.stroke(100);
            for (var lin = this.y; lin < this.y + this.h; lin += this.h / 20) {
                p.line(this.x, lin, this.x + this.w, lin);
            }
            for (var col = this.x; col < this.x + this.w; col += this.w / 26) {
                p.line(col, this.y, col, this.y + this.h);
            }
            p.stroke(255);
            p.strokeWeight(1);
            p.line(this.w / 2, this.h, this.w / 2, 0)
            p.line(0, this.h / 2, this.w, this.h / 2)
        }
    }
};

export default oscilloBack;