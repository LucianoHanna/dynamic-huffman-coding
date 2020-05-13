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
    constructor (filho_esquerda, filho_direita, pai) {
        super()
        this.filho_esquerda = filho_esquerda
        this.filho_direita = filho_direita
    }

    contagem() {
        this.cont = this.filho_esquerda.contagem() + this.filho_direita.contagem()
        return this.cont
    }
}

function procura(caracter, raiz, caminho) {
    if (raiz instanceof NoIntermediario) {
        let c = procura(caracter, raiz.filho_esquerda, caminho + '0')

        if (c == null)
            return procura(caracter, raiz.filho_direita, caminho + '1')
        else
            return c
    }
    else {
        if (raiz.caracter == caracter) {
            return {raiz, caminho}
        } else {
            return null
        }
    }
}

function procuraFolhaVazia(raiz) {
    if (raiz instanceof NoIntermediario) {
        let c = procuraFolhaVazia(raiz.filho_esquerda)

        if (c == null)
            return procuraFolhaVazia(raiz.filho_direita)
        else
            return c
    }
    else if (raiz.vazio) 
            return raiz
}

function insere(folhaVazia, caracter) {
    let raiz = new NoIntermediario(folhaVazia, null)
    let folhaNova = new Folha(false, caracter, 1, raiz)
    raiz.filho_direita = folhaNova
    raiz.filho_esquerda.pai = raiz
    return raiz
}

function codificaCaracter(raiz, caracter) {
    let obj = procura(caracter, raiz, '');
    if (obj == null) {
        let folhaVazia = procuraFolhaVazia(raiz)
        if (folhaVazia.pai.filho_esquerda.vazio)
            folhaVazia.pai.filho_esquerda = insere(folhaVazia, caracter);
        else
            folhaVazia.pai.filho_direita = insere(folhaVazia, caracter);

        return caracter.charCodeAt(0)
    } else {
        obj.raiz.cont += 1
        return obj.caminho
    }
}

function listaOrdenadaProfundidade(raiz) {

    let lista = listaOrdenadaProfundidadeAuxiliar(raiz.filho_esquerda, 0, {})
    lista = listaOrdenadaProfundidadeAuxiliar(raiz.filho_direita, 0, lista)

    let niveisDecrescente = Object.keys(lista).sort((a, b) => b - a)
    
    let arr = []
    
    for (let i = 0; i < niveisDecrescente.length; i++) 
        arr = arr.concat(lista[niveisDecrescente[i]])

    return arr
}

function listaOrdenadaProfundidadeAuxiliar(raiz, nivel, lista) {
    let level = nivel
    if (lista[level])
        lista[level].push(raiz)
    else 
        lista[level] = [raiz]

    if (raiz instanceof Folha)
        return lista
    else 
        raiz.contagem()
    
    lista = listaOrdenadaProfundidadeAuxiliar(raiz.filho_esquerda, nivel + 1, lista)
    return listaOrdenadaProfundidadeAuxiliar(raiz.filho_direita, nivel + 1, lista)
}

function balanceamento(raiz) {
    let lista = listaOrdenadaProfundidade(raiz)

    for (let i = 0; i < lista.length; i++) {
        for (let j = lista.length - 1; j > i; j--) {
            if (lista[j].cont < lista[i].cont) {
                troca(lista[i], lista[j])
                return true
            }
        }
    }
    return false
}

function troca(obj1, obj2) {
    if (obj1.pai.filho_esquerda == obj1) {
        if (obj2.pai.filho_esquerda == obj2) {
            obj1.pai.filho_esquerda = obj2
            obj2.pai.filho_esquerda = obj1
        }
        else {
            obj1.pai.filho_esquerda = obj2
            obj2.pai.filho_direita = obj1
        }
    }
    else {
        if (obj2.pai.filho_esquerda == obj2) {
            obj1.pai.filho_direita = obj2
            obj2.pai.filho_esquerda = obj1
        }
        else {
            obj1.pai.filho_direita = obj2
            obj2.pai.filho_direita = obj1
        }
    }

    let tmp = obj1.pai
    obj1.pai = obj2.pai
    obj2.pai = tmp
}