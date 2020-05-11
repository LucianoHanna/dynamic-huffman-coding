class No {
}

class Folha extends No {
    constructor (vazio, caracter, cont, pai) {
        super()
        this.vazio = vazio
        this.caracter = caracter
        this.cont = cont
        this.pai = pai
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

function procura(caracter, raiz) {
    if (raiz instanceof NoIntermediario) {
        let c = procura(caracter, raiz.filho_esquerda)

        if (c == null)
            return procura(caracter, raiz.filho_direita)
        else
            return c
    }
    else {
        if (raiz.caracter == caracter) {
            return raiz
        }
    }
}

function insere(folhaVazia, caracter) {
    let raiz = new NoIntermediario(folhaVazia, null)
    let folhaNova = new Folha(false, caracter, 1, raiz)
    raiz.filho_direita = folhaNova
    raiz.filho_esquerda.pai = raiz
    return raiz
}