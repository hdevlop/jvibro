var Width = window.screen.width;
var Height = window.screen.height - 100;
var tela;


const oscilloBack = p => {
    p.setup = () => {
        p.createCanvas(Width, Height);
        tela = new Tela(0, 0, Width, Height);
    }
    p.draw = () => {
        p.strokeWeight(0.5);
        p.background("#0e1f0e");
        p.fill(232, 235, 52);

        tela.display();
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