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

// const raiz = new Folha(true, null, 0)



// console.log(typeof raiz)



const folha_e = new Folha(true, null, 0);
const folha_d = new Folha(false, 'T', 1);
const raiz = new NoIntermediario(folha_e, folha_d)

console.log(raiz)

console.log('\n\n\n\n\n\n')
console.log(procura('T', raiz))