import { Question, Unit } from '../types'

const lessonQuestionsById: Record<string, Question[]> = {
  '1-1': [
    {
      id: '1-1-q1',
      title: 'JavaScript é uma linguagem de:',
      options: ['Marcação', 'Programação', 'Estilo', 'Banco de dados'],
      correctAnswer: 1,
    },
    {
      id: '1-1-q2',
      title: 'Onde o JavaScript pode ser executado?',
      options: ['Apenas no servidor', 'Apenas no navegador', 'No navegador e no servidor', 'Apenas no banco'],
      correctAnswer: 2,
    },
    {
      id: '1-1-q3',
      title: 'JavaScript é mais usado para:',
      options: ['Criar páginas interativas', 'Editar imagens', 'Gerenciar banco diretamente', 'Compilar sistemas'],
      correctAnswer: 0,
    },
  ],
  '1-2': [
    {
      id: '1-2-q1',
      title: 'Qual comando exibe algo no console?',
      options: ['print()', 'console.log()', 'echo()', 'alert()'],
      correctAnswer: 1,
    },
    {
      id: '1-2-q2',
      title: 'Qual é o resultado de 2 + 2 em JS?',
      options: ['22', '4', 'undefined', 'NaN'],
      correctAnswer: 1,
    },
    {
      id: '1-2-q3',
      title: 'Qual destas é uma forma válida de string?',
      options: ['"Olá"', '123', 'true', 'null'],
      correctAnswer: 0,
    },
  ],
  '2-1': [
    {
      id: '2-1-q1',
      title: 'Qual palavra-chave cria uma variável mutável?',
      options: ['const', 'let', 'var', 'define'],
      correctAnswer: 1,
    },
    {
      id: '2-1-q2',
      title: 'Qual palavra-chave cria uma constante?',
      options: ['let', 'const', 'var', 'static'],
      correctAnswer: 1,
    },
    {
      id: '2-1-q3',
      title: 'Qual escopo o let possui?',
      options: ['Escopo de bloco', 'Escopo global apenas', 'Escopo de classe', 'Sem escopo'],
      correctAnswer: 0,
    },
  ],
  '2-2': [
    {
      id: '2-2-q1',
      title: 'Qual destes é um tipo primitivo em JavaScript?',
      options: ['Array', 'String', 'Date', 'RegExp'],
      correctAnswer: 1,
    },
    {
      id: '2-2-q2',
      title: 'Qual o tipo de "42"?',
      options: ['string', 'number', 'boolean', 'object'],
      correctAnswer: 0,
    },
    {
      id: '2-2-q3',
      title: 'Qual destes NÃO é primitivo?',
      options: ['Object', 'number', 'string', 'boolean'],
      correctAnswer: 0,
    },
  ],
  '3-1': [
    {
      id: '3-1-q1',
      title: 'Qual operador representa multiplicação?',
      options: ['+', '*', '/', '%'],
      correctAnswer: 1,
    },
    {
      id: '3-1-q2',
      title: 'Qual é o resultado de 10 / 2?',
      options: ['2', '5', '8', '10'],
      correctAnswer: 1,
    },
    {
      id: '3-1-q3',
      title: 'Qual operador representa resto da divisão?',
      options: ['%', '/', '*', '-'],
      correctAnswer: 0,
    },
  ],
  '3-2': [
    {
      id: '3-2-q1',
      title: 'Qual operador significa E lógico?',
      options: ['||', '&&', '!', '??'],
      correctAnswer: 1,
    },
    {
      id: '3-2-q2',
      title: 'Qual operador verifica igualdade estrita?',
      options: ['==', '===', '!=', '='],
      correctAnswer: 1,
    },
    {
      id: '3-2-q3',
      title: 'Qual operador representa OU lógico?',
      options: ['||', '&&', '!', '==='],
      correctAnswer: 0,
    },
  ],
  '4-1': [
    {
      id: '4-1-q1',
      title: 'Qual estrutura executa um bloco se a condição for verdadeira?',
      options: ['if', 'else', 'switch', 'case'],
      correctAnswer: 0,
    },
    {
      id: '4-1-q2',
      title: 'Qual palavra-chave define o caso alternativo?',
      options: ['else', 'if', 'case', 'default'],
      correctAnswer: 0,
    },
    {
      id: '4-1-q3',
      title: 'Qual símbolo abre um bloco em JS?',
      options: ['{', '(', '[', '<'],
      correctAnswer: 0,
    },
  ],
  '4-2': [
    {
      id: '4-2-q1',
      title: 'Qual palavra-chave encerra um case?',
      options: ['break', 'stop', 'return', 'exit'],
      correctAnswer: 0,
    },
    {
      id: '4-2-q2',
      title: 'Qual palavra-chave define o caso padrão?',
      options: ['default', 'case', 'else', 'fallback'],
      correctAnswer: 0,
    },
    {
      id: '4-2-q3',
      title: 'Qual palavra-chave inicia o switch?',
      options: ['switch', 'case', 'default', 'if'],
      correctAnswer: 0,
    },
  ],
  '5-1': [
    {
      id: '5-1-q1',
      title: 'Qual palavra-chave declara uma função?',
      options: ['function', 'func', 'def', 'fn'],
      correctAnswer: 0,
    },
    {
      id: '5-1-q2',
      title: 'Como chamamos uma função chamada soma?',
      options: ['soma()', 'call soma()', 'soma.call()', 'execute soma()'],
      correctAnswer: 0,
    },
    {
      id: '5-1-q3',
      title: 'O que vai entre parênteses na função?',
      options: ['Parâmetros', 'Retorno', 'Escopo', 'Objeto'],
      correctAnswer: 0,
    },
  ],
  '5-2': [
    {
      id: '5-2-q1',
      title: 'O que é escopo em JavaScript?',
      options: ['Regra de acesso a variáveis', 'Tipo de função', 'Um operador', 'Uma biblioteca'],
      correctAnswer: 0,
    },
    {
      id: '5-2-q2',
      title: 'Closure ocorre quando...',
      options: ['Uma função lembra variáveis do escopo externo', 'Uma variável muda de tipo', 'Uma função não retorna nada', 'Uma função é chamada sem parâmetros'],
      correctAnswer: 0,
    },
    {
      id: '5-2-q3',
      title: 'Closure é útil para:',
      options: ['Manter estado privado', 'Remover variáveis', 'Apagar funções', 'Criar classes automaticamente'],
      correctAnswer: 0,
    },
  ],
}

const rawUnits: Unit[] = [
  {
    id: 1,
    title: 'Fundamentos do JavaScript',
    description: 'Aprenda os conceitos básicos da linguagem JavaScript.',
    number: 1,
    lessons: [
      {
        id: '1-1',
        title: 'O que é JavaScript?',
        description: 'Introdução à linguagem, sua história e aplicações',
        xp: 10,
        completed: false,
      },
      {
        id: '1-2',
        title: 'Seu Primeiro Programa',
        description: 'Escreva seu primeiro "Hello World" em JavaScript',
        xp: 15,
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Variáveis e Tipos de Dados',
    description: 'Entenda como funcionam as variáveis e tipos de dados em JS.',
    number: 2,
    lessons: [
      {
        id: '2-1',
        title: 'Variáveis: let, const e var',
        description: 'Diferenças entre as formas de declarar variáveis',
        xp: 15,
        completed: false,
      },
      {
        id: '2-2',
        title: 'Tipos Primitivos de Dados',
        description: 'String, number, boolean, undefined, null e symbol',
        xp: 20,
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Operadores e Expressões',
    description: 'Domine os operadores matemáticos, lógicos e de comparação.',
    number: 3,
    lessons: [
      {
        id: '3-1',
        title: 'Operadores Aritméticos',
        description: 'Soma, subtração, multiplicação, divisão e mais',
        xp: 15,
        completed: false,
      },
      {
        id: '3-2',
        title: 'Operadores Lógicos e de Comparação',
        description: 'AND, OR, NOT, ==, ===, <, >, e outros',
        xp: 20,
        completed: false,
      },
    ],
  },
  {
    id: 4,
    title: 'Condicionais e Estruturas de Controle',
    description: 'Aprenda a usar if, else, switch e outras estruturas de controle.',
    number: 4,
    lessons: [
      {
        id: '4-1',
        title: 'If, Else If e Else',
        description: 'Controle o fluxo do seu programa com condicionais',
        xp: 20,
        completed: false,
      },
      {
        id: '4-2',
        title: 'Switch Case',
        description: 'Use switch para escolher entre múltiplas opções',
        xp: 20,
        completed: false,
      },
    ],
  },
  {
    id: 5,
    title: 'Funções e Escopo',
    description: 'Crie e utilize funções em seus programas JavaScript.',
    number: 5,
    lessons: [
      {
        id: '5-1',
        title: 'Declarando e Chamando Funções',
        description: 'Crie funções reutilizáveis em seus programas',
        xp: 25,
        completed: false,
      },
      {
        id: '5-2',
        title: 'Escopo e Closure',
        description: 'Entenda como variáveis são acessadas em diferentes contextos',
        xp: 25,
        completed: false,
      },
    ],
  },
]

export const unitsData: Unit[] = rawUnits.map((unit) => ({
  ...unit,
  lessons: unit.lessons.map((lesson) => ({
    ...lesson,
    questions: lessonQuestionsById[String(lesson.id)] ?? [],
  })),
}))
