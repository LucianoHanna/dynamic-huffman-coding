class No {
}

class Folha extends No {
    constructor (vazio, caracter, cont) {
        super()
        this.vazio = vazio
        this.caracter = caracter
        this.cont = cont
    }

    contagem() {
        return cont
    }
}

class NoIntermediario extends No {
    constructor (filho_esquerda, filho_direita) {
        super()
        this.filho_esquerda = filho_esquerda
        this.filho_direita = filho_direita
    }

    contagem() {
        return this.filho_esquerda.contagem() + filho_direita.contagem()
    }
}
