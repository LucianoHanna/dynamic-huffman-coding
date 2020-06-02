class No {
}

class Folha extends No {
    constructor (vazio, caracter, cont, pai) {
        super()
        this.vazio = vazio
        this.caracter = caracter
        this.cont = cont
        this.pai = pai
        this.encontrado = false
    }

    contagem() {
        return this.cont
    }
}

class NoIntermediario extends No {
    constructor (filho_esquerda, filho_direita, pai) {
        super()
        this.filho_esquerda = filho_esquerda
        this.filho_direita = filho_direita
        this.pai = pai
    }

    filhos() {
        let str = ''
        if (this.filho_esquerda instanceof NoIntermediario) {
            str += this.filho_esquerda.filhos()
        }
        else {
            if (!this.filho_esquerda.vazio)
                str += this.filho_esquerda.caracter
            else 
                str += 'e0'
        }
        if (this.filho_direita instanceof NoIntermediario) {
            str += this.filho_direita.filhos()
        }
        else {
            if (!this.filho_direita.vazio)
                str += this.filho_direita.caracter
            else 
                str += 'e0'
        }

        return str
    }

    contagem() {
        this.cont = this.filho_esquerda.contagem() + this.filho_direita.contagem()
        return this.cont
    }
}

let passos = []

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

function procuraFolhaVazia(raiz, caminho) {
    if (raiz instanceof NoIntermediario) {
        let c = procuraFolhaVazia(raiz.filho_esquerda, caminho + '0')

        if (c == null)
            return procuraFolhaVazia(raiz.filho_direita, caminho + '1')
        else
            return c
    }
    else if (raiz.vazio) 
            return {raiz, caminho}
}

function insere(folhaVazia, caracter) {
    let raiz = new NoIntermediario(folhaVazia, null, folhaVazia.pai)
    let folhaNova = new Folha(false, caracter, 1, raiz)
    raiz.filho_direita = folhaNova
    raiz.filho_esquerda.pai = raiz
    return raiz
}

function codificaCaracter(raiz, caracter) {
    let obj = procura(caracter, raiz, '');
    if (obj == null) {
        let folhaVazia = procuraFolhaVazia(raiz, '')
        if (folhaVazia.raiz.pai == undefined)
            raiz = insere(folhaVazia.raiz, caracter)
        else if (folhaVazia.raiz.pai.filho_esquerda.vazio)
            folhaVazia.raiz.pai.filho_esquerda = insere(folhaVazia.raiz, caracter);
        else
            folhaVazia.raiz.pai.filho_direita = insere(folhaVazia.raiz, caracter);

        return {
            raiz,
            'caminho': folhaVazia.caminho + caracter.charCodeAt(0).toString(2),
            repetido: false
        }
    } else {
        obj.raiz.cont += 1
        obj.raiz.encontrado = true
        return {
            raiz,
            'caminho': obj.caminho,
            repetido: true
        }
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
                let x = ''
                let y = ''
                if (lista[i] instanceof Folha) {
                    x = lista[i].caracter
                } else {
                    x = lista[i].contagem()
                }

                if (lista[j] instanceof Folha) {
                    y = lista[j].caracter
                } else {
                    y = lista[j].contagem()
                }
                return {
                    state: true,
                    troca: [x, y]
                }
            }
        }
    }
    return {
        state: false
    }
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

function codificaString(str) {
    let raiz = new Folha(true, null, 0)
    let output = ''

    let numeroBitsOriginal = 0
    let numeroBitsCompactado = 0

    for (let i = 0; i < str.length; i++) {
        let tmp = codificaCaracter(raiz, str[i]);
        raiz = tmp.raiz
        output += tmp.caminho
        output += ' '

        numeroBitsOriginal += str.charCodeAt(0).toString(2).length
        numeroBitsCompactado += tmp.caminho.length
        passos.push(
            {
                arvore: 'digraph {' + makeString(raiz) + '}',
                insere: str[i],
                output: output,
                repetido: tmp.repetido,
                caminho: tmp.caminho,
                numeroBitsOriginal: numeroBitsOriginal,
                numeroBitsCompactado: numeroBitsCompactado
            }
        )
        let bal = balanceamento(raiz)
        while(bal.state) {
            passos.push(
                {
                    arvore: 'digraph {' + makeString(raiz) + '}',
                    troca: bal.troca,
                    output: output
                }
            )
            bal = balanceamento(raiz)
        }
    }
    return {raiz, output}
}

function decodifica(str) {
    let raiz = new Folha(true, null, 0)
    let output = ''

    let no_aux = raiz
    while (str.length > 0 || no_aux instanceof Folha) {
        if (no_aux instanceof Folha) {
            let char = ''
            if (no_aux.vazio) {
                char = String.fromCharCode(parseInt(str.substr(0, 7), 2))
                output = output.concat(char)
                str = str.substr(7)
            }
            else {
                char = no_aux.caracter
                output = output.concat(no_aux.caracter)
                str = str.substr(1)
            }
            let tmp = codificaCaracter(raiz, char)
            raiz = tmp.raiz
            passos.push(
                {
                    arvore: 'digraph {' + makeString(raiz) + '}',
                    insere: char,
                    output: output,
                    repetido: tmp.repetido,
                    caminho: tmp.caminho
                }
            )
            let bal = balanceamento(raiz)
            while(bal.state) {
                passos.push(
                    {
                        arvore: 'digraph {' + makeString(raiz) + '}',
                        troca: bal.troca,
                        output: output
                    }
                )
                bal = balanceamento(raiz)
            }
            no_aux = raiz
        }
        else {
            if (str.charAt(0) == '0') {
                no_aux = no_aux.filho_esquerda
            }
            else if (str.charAt(0) == '1') {
                no_aux = no_aux.filho_direita
            }
            str = str.substr(1)
        }
    }
    return {raiz, output}
}

function showTree(no) {
    let z = 'digraph {' + makeString(no) + '}'
    d3.select("#tree").graphviz()
    .keyMode('tag-index')
    .zoom(false)
    .fade(false)
    .renderDot(z);
}

function makeString(no) {
    let str = ''
    str += `\"&#xf05e;\"[fillcolor="blue", style="filled"];`

    if (no instanceof Folha) {
        return ''
    }
    else {
        if (no.filho_esquerda) {
            if (no.filho_esquerda instanceof Folha) {
                let filhoString = ''
                if (no.filho_esquerda.vazio) {
                    filhoString = '\"&#xf05e;\"'
                }
                else {
                    if (no.filho_esquerda.caracter == ' ')
                        filhoString = '\"' + '␣' + no.filho_esquerda.cont + '\"'
                    else
                        filhoString = '\"' + no.filho_esquerda.caracter + no.filho_esquerda.cont + '\"'
                }

                if (no.filho_esquerda.encontrado)
                    str += `${filhoString}[fillcolor="yellow", style="filled"];`

                str += '\"' + no.filhos() + '{' + no.contagem().toString() + '}' + '\"' + '->' + filhoString + '[label=0];'
            }
            else {
                str += '\"' + no.filhos() + '{' + no.contagem().toString() + '}' + '\"' + '->'
                str += '\"' + no.filho_esquerda.filhos() + '{' + no.filho_esquerda.contagem() + '}' + '\"' + '[label=0];'
                str += makeString(no.filho_esquerda)
            }
        }
        if (no.filho_direita) {
            if (no.filho_direita instanceof Folha) {
                let filhoString
                if (no.filho_direita.vazio) {
                    filhoString = '\"&#xf05e;\"'
                }
                else {
                    if (no.filho_direita.caracter == ' ')
                        filhoString = '\"' + '␣' + no.filho_direita.cont + '\"'
                    else
                        filhoString = '\"' + no.filho_direita.caracter + no.filho_direita.cont  + '\"'
                }
                if (no.filho_direita.encontrado)
                    str += `${filhoString}[fillcolor="yellow", style="filled"];`


                str += '\"' + no.filhos() + '{' + no.contagem().toString() + '}' + '\"' + '->' + filhoString + '[label=1];'
            }
            else {
                str += '\"' + no.filhos() + '{' + no.contagem().toString() + '}' + '\"' + '->'
                str += '\"' + no.filho_direita.filhos() + '{' + no.filho_direita.contagem() + '}' + '\"' + '[label=1];'
                str += makeString(no.filho_direita)
            }
        }
    }
    return str
}

function buttonCodificar() {
    let str = $('#input-string').val()
    document.getElementById('tree').innerHTML = ''
    document.getElementById('operacao').innerHTML = ''
    document.getElementById('string-codificada').innerText = ''
    document.getElementById('taxa-compactacao').innerText = ''
    document.getElementById('prevStep').disabled = true
    passos = []
    stepIndex = -1
    codificaString(str)
    
    if (passos.length > 0)
        document.getElementById('nextStep').disabled = false

}

function buttonDecodificar() {
    let str = $('#input-string').val()
    
    document.getElementById('tree').innerHTML = ''
    document.getElementById('operacao').innerHTML = ''
    document.getElementById('string-codificada').innerText = ''
    document.getElementById('taxa-compactacao').innerText = ''
    document.getElementById('prevStep').disabled = true
    passos = []
    stepIndex = -1

    decodifica(str)
    
    if (passos.length > 0)
        document.getElementById('nextStep').disabled = false
}

let stepIndex = -1
function renderStep() {
    if (passos[stepIndex].insere && !passos[stepIndex].repetido)
        if (passos[stepIndex].insere == ' ')
            document.getElementById('operacao').innerText = `Insere ␣`
        else
            document.getElementById('operacao').innerText = `Insere ${passos[stepIndex].insere}`
    
    else if (passos[stepIndex].insere && passos[stepIndex].repetido)
        document.getElementById('operacao').innerText = `Encontrado ${passos[stepIndex].insere} (${passos[stepIndex].caminho})`

    else if (passos[stepIndex].troca) 
        document.getElementById('operacao').innerText = `Troca ${passos[stepIndex].troca[0]} <-> ${passos[stepIndex].troca[1]}`

    document.getElementById('taxa-compactacao').innerText = `${Number(passos[stepIndex].numeroBitsOriginal / passos[stepIndex].numeroBitsCompactado).toFixed(3)} (${passos[stepIndex].numeroBitsOriginal}:${passos[stepIndex].numeroBitsCompactado})`
    document.getElementById('string-codificada').innerText = passos[stepIndex].output
    document.getElementById('tree').innerHTML = ''

    d3.select("#tree").graphviz()
    .keyMode('tag-index')
    .zoom(false)
    .fade(false)
    .dot(passos[stepIndex].arvore)
    .render()

    .on('end', () => {
        let texts = document.querySelectorAll('g > text')
        for (text of texts) {
            let str = text.innerHTML.substring(
                text.innerHTML.lastIndexOf('{') + 1, 
                text.innerHTML.lastIndexOf('}')
            )
            if (str.length > 0)
                text.innerHTML = str
        }
    });

    if (stepIndex == passos.length - 1)
        document.getElementById('nextStep').disabled = true
    else
        document.getElementById('nextStep').disabled = false

    if (stepIndex > 0)
        document.getElementById('prevStep').disabled = false
    else
        document.getElementById('prevStep').disabled = true
}

function nextStep() {
    stepIndex += 1
    renderStep()
}

function prevStep() {
    stepIndex -= 1
    renderStep()
}