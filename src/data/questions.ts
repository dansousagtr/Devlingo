import { Question } from '../types'

export const lessonsQuestions: Record<string, Question[]> = {
    '1-1': [
        {
            id: '1-1-q1',
            title: 'Qual palavra-chave cria uma variável mutável?',
            options: ['const', 'let', 'var', 'variable'],
            correctAnswer: 1,
        },
        {
            id: '1-1-q2',
            title: 'Qual é a diferença entre let e var?',
            options: [
                'let tem escopo de bloco, var tem escopo de função',
                'Não há diferença',
                'var é mais moderno',
                'let é mais lento',
            ],
            correctAnswer: 0,
        },
        {
            id: '1-1-q3',
            title: 'O que é uma variável?',
            options: [
                'Um container para armazenar valores',
                'Uma função especial',
                'Um tipo de dado',
                'Uma palavra reservada',
            ],
            correctAnswer: 0,
        },
    ],
    '1-2': [
        {
            id: '1-2-q1',
            title: 'Qual operador é usado para soma?',
            options: ['-', '+', '*', '/'],
            correctAnswer: 1,
        },
        {
            id: '1-2-q2',
            title: 'O que retorna 5 > 3?',
            options: ['5', '3', 'true', 'false'],
            correctAnswer: 2,
        },
        {
            id: '1-2-q3',
            title: 'Qual é o operador de igualdade estrita?',
            options: ['==', '===', '=', '!=='],
            correctAnswer: 1,
        },
        {
            id: '1-2-q4',
            title: 'O que faz o operador &&?',
            options: [
                'OU lógico',
                'E lógico',
                'Negação',
                'Comparação',
            ],
            correctAnswer: 1,
        },
    ],
    '1-3': [
        {
            id: '1-3-q1',
            title: 'Como declarar uma função?',
            options: [
                'function minhaFuncao() {}',
                'func minhaFuncao() {}',
                'def minhaFuncao() {}',
                'function: minhaFuncao() {}',
            ],
            correctAnswer: 0,
        },
        {
            id: '1-3-q2',
            title: 'O que é uma função seta (arrow function)?',
            options: [
                'Uma função com seta no nome',
                'Uma sintaxe moderna de funções usando =>',
                'Uma função que retorna uma seta',
                'Não existe isso em JavaScript',
            ],
            correctAnswer: 1,
        },
        {
            id: '1-3-q3',
            title: 'Qual é o valor padrão de retorno de uma função?',
            options: ['null', 'undefined', '0', 'false'],
            correctAnswer: 1,
        },
    ],
    '2-1': [
        {
            id: '2-1-q1',
            title: 'Qual estrutura é usada para decisões?',
            options: ['if', 'loop', 'array', 'object'],
            correctAnswer: 0,
        },
        {
            id: '2-1-q2',
            title: 'O que faz a instrução if?',
            options: [
                'Repete um bloco de código',
                'Executa código se uma condição for verdadeira',
                'Define uma variável',
                'Cria uma função',
            ],
            correctAnswer: 1,
        },
        {
            id: '2-1-q3',
            title: 'Qual é a sintaxe do switch?',
            options: [
                'switch (variavel) { case: ... }',
                'switch { case: ... }',
                'switch (variavel) { }',
                'case switch (variavel) { }',
            ],
            correctAnswer: 0,
        },
    ],
    '2-2': [
        {
            id: '2-2-q1',
            title: 'Qual loop repete um número fixo de vezes?',
            options: ['while', 'do-while', 'for', 'foreach'],
            correctAnswer: 2,
        },
        {
            id: '2-2-q2',
            title: 'O que faz o método map()?',
            options: [
                'Filtra um array',
                'Transforma cada elemento do array',
                'Soma os elementos',
                'Ordena o array',
            ],
            correctAnswer: 1,
        },
        {
            id: '2-2-q3',
            title: 'Qual diferença entre for e forEach?',
            options: [
                'for é mais rápido',
                'forEach não pode ter break',
                'Não há diferença',
                'for é apenas para objetos',
            ],
            correctAnswer: 1,
        },
        {
            id: '2-2-q4',
            title: 'O que o método filter() faz?',
            options: [
                'Transforma cada elemento',
                'Remove duplicatas',
                'Retorna elementos que passam em um teste',
                'Ordena o array',
            ],
            correctAnswer: 2,
        },
    ],
    '2-3': [
        {
            id: '2-3-q1',
            title: 'O que é um método de array?',
            options: [
                'Uma função que funciona em um array',
                'Um tipo de variável',
                'Um operador especial',
                'Uma estrutura de controle',
            ],
            correctAnswer: 0,
        },
        {
            id: '2-3-q2',
            title: 'Qual método retorna o comprimento de um array?',
            options: ['size()', 'length', 'count()', 'total()'],
            correctAnswer: 1,
        },
        {
            id: '2-3-q3',
            title: 'O que faz o método reduce()?',
            options: [
                'Remove elementos',
                'Agrega todos os elementos em um valor único',
                'Cria um novo array',
                'Retorna o primeiro elemento',
            ],
            correctAnswer: 1,
        },
    ],
    '3-1': [
        {
            id: '3-1-q1',
            title: 'O que é um objeto em JavaScript?',
            options: [
                'Uma variável especial',
                'Uma coleção de pares chave-valor',
                'Uma função',
                'Um array especial',
            ],
            correctAnswer: 1,
        },
        {
            id: '3-1-q2',
            title: 'Como acessar uma propriedade de um objeto?',
            options: [
                'objeto.propriedade ou objeto["propriedade"]',
                'objeto->propriedade',
                'objeto:propriedade',
                'propriedade.objeto',
            ],
            correctAnswer: 0,
        },
        {
            id: '3-1-q3',
            title: 'O que é destructuring?',
            options: [
                'Quebrar um objeto',
                'Extrair valores de um objeto',
                'Criar um novo objeto',
                'Deletar propriedades',
            ],
            correctAnswer: 1,
        },
    ],
    '3-2': [
        {
            id: '3-2-q1',
            title: 'O que é um protótipo?',
            options: [
                'Um objeto modelo para outros objetos',
                'Uma função especial',
                'Um tipo de dado',
                'Uma operação matemática',
            ],
            correctAnswer: 0,
        },
        {
            id: '3-2-q2',
            title: 'Como se faz herança em JavaScript?',
            options: [
                'Usando protótipos',
                'Usando classes',
                'Ambos os anteriores',
                'Não é possível',
            ],
            correctAnswer: 2,
        },
        {
            id: '3-2-q3',
            title: 'O que é a cadeia de protótipos (prototype chain)?',
            options: [
                'Uma lista de protótipos vinculados',
                'Um operador especial',
                'Uma função',
                'Um tipo de array',
            ],
            correctAnswer: 0,
        },
    ],
    '3-3': [
        {
            id: '3-3-q1',
            title: 'Como declarar uma classe?',
            options: [
                'class MeuNome { }',
                'Class MeuNome { }',
                'classe MeuNome { }',
                'def MeuNome: { }',
            ],
            correctAnswer: 0,
        },
        {
            id: '3-3-q2',
            title: 'O que é um construtor?',
            options: [
                'Uma propriedade de classe',
                'Um método especial chamado ao criar um objeto',
                'Uma função seta',
                'Um operador',
            ],
            correctAnswer: 1,
        },
        {
            id: '3-3-q3',
            title: 'O que é herança de classes?',
            options: [
                'Uma classe filha estende uma classe pai usando extends',
                'Cópia de código entre classes',
                'Uma função especial',
                'Não existe em JavaScript',
            ],
            correctAnswer: 0,
        },
        {
            id: '3-3-q4',
            title: 'O que é encapsulamento?',
            options: [
                'Empacotar código em funções',
                'Tornar dados privados ou públicos',
                'Usar classes',
                'Usar objetos',
            ],
            correctAnswer: 1,
        },
    ],
    '4-1': [
        {
            id: '4-1-q1',
            title: 'O que é um callback?',
            options: [
                'Uma variável especial',
                'Uma função passada como argumento',
                'Um tipo de loop',
                'Uma estrutura de controle',
            ],
            correctAnswer: 1,
        },
        {
            id: '4-1-q2',
            title: 'O que é uma Promise?',
            options: [
                'Uma promessa literal',
                'Um objeto que representa um valor futuro',
                'Uma função especial',
                'Um tipo de array',
            ],
            correctAnswer: 1,
        },
        {
            id: '4-1-q3',
            title: 'Qual é o estado "pending" em uma Promise?',
            options: [
                'Concluída com sucesso',
                'A operação ainda está em progresso',
                'Rejeitada',
                'Cancelada',
            ],
            correctAnswer: 1,
        },
    ],
    '4-2': [
        {
            id: '4-2-q1',
            title: 'O que é async/await?',
            options: [
                'Um tipo de variável',
                'Sintaxe moderna para trabalhar com Promises',
                'Um operador especial',
                'Uma estrutura de loop',
            ],
            correctAnswer: 1,
        },
        {
            id: '4-2-q2',
            title: 'O que faz a palavra-chave await?',
            options: [
                'Espera uma Promise ser resolvida',
                'Cria uma Promise',
                'Recusa uma Promise',
                'Retorna um valor',
            ],
            correctAnswer: 0,
        },
        {
            id: '4-2-q3',
            title: 'Como tratar erros em async/await?',
            options: [
                'Com try/catch',
                'Com .catch()',
                'Com if/else',
                'Não é possível',
            ],
            correctAnswer: 0,
        },
        {
            id: '4-2-q4',
            title: 'Uma função async sempre retorna o quê?',
            options: [
                'Um valor comum',
                'Uma Promise',
                'Um callback',
                'undefined',
            ],
            correctAnswer: 1,
        },
    ],
    '5-1': [
        {
            id: '5-1-q1',
            title: 'O que é a API DOM?',
            options: [
                'Um banco de dados',
                'Interface para manipular HTML',
                'Um tipo de função',
                'Uma variável especial',
            ],
            correctAnswer: 1,
        },
        {
            id: '5-1-q2',
            title: 'Como selecionar um elemento pelo ID?',
            options: [
                'document.getElement("id")',
                'document.getElementById("id")',
                'document.select("id")',
                'document.find("#id")',
            ],
            correctAnswer: 1,
        },
        {
            id: '5-1-q3',
            title: 'O que é um nó (node)?',
            options: [
                'Um elemento especial',
                'Qualquer coisa no DOM',
                'Uma propriedade',
                'Uma função',
            ],
            correctAnswer: 1,
        },
    ],
    '5-2': [
        {
            id: '5-2-q1',
            title: 'O que é um evento?',
            options: [
                'Uma ação que ocorre no DOM',
                'Uma variável especial',
                'Uma função',
                'Uma propriedade',
            ],
            correctAnswer: 0,
        },
        {
            id: '5-2-q2',
            title: 'Como adicionar um listener de evento?',
            options: [
                'elemento.addEventListener("evento", funcao)',
                'elemento.on("evento", funcao)',
                'elemento.addEvent("evento", funcao)',
                'evento.add(elemento, funcao)',
            ],
            correctAnswer: 0,
        },
        {
            id: '5-2-q3',
            title: 'O que é propagação de eventos?',
            options: [
                'Um evento que se repete',
                'Um evento viaja através dos elementos',
                'Um tipo de erro',
                'Uma função especial',
            ],
            correctAnswer: 1,
        },
    ],
}
