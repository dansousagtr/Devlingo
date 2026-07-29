import { Unit } from '../types'

export const unitsData: Unit[] = [
  {
    id: 1,
    title: 'Fundamentos de JavaScript',
    description: 'Conceitos básicos de JavaScript para começar.',
    number: 1,
    lessons: [
      {
        id: '1-1',
        title: 'Variáveis e tipos',
        description: 'Aprenda sobre variáveis em JavaScript',
        xp: 10,
        completed: true,
      },
      {
        id: '1-2',
        title: 'Operadores',
        description: 'Conheça os operadores básicos',
        xp: 10,
        completed: false,
      },
      {
        id: '1-3',
        title: 'Funções',
        description: 'Crie e use funções',
        xp: 15,
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Estruturas de Controle',
    description: 'Aprenda como controlar o fluxo do seu código.',
    number: 2,
    lessons: [
      {
        id: '2-1',
        title: 'Condições',
        description: 'Use if, else e switch',
        xp: 10,
        completed: true,
      },
      {
        id: '2-2',
        title: 'Loops',
        description: 'Domine for, while e map',
        xp: 15,
        completed: true,
      },
      {
        id: '2-3',
        title: 'Array Methods',
        description: 'Métodos úteis de arrays',
        xp: 15,
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Objetos e Protótipos',
    description: 'Entenda objetos, herança e protótipos em JavaScript.',
    number: 3,
    lessons: [
      {
        id: '3-1',
        title: 'Objetos',
        description: 'Trabalhe com objetos',
        xp: 12,
        completed: false,
      },
      {
        id: '3-2',
        title: 'Protótipos',
        description: 'Herança por protótipos',
        xp: 12,
        completed: false,
      },
      {
        id: '3-3',
        title: 'Classes',
        description: 'Sintaxe de classes ES6',
        xp: 15,
        completed: false,
      },
    ],
  },
  {
    id: 4,
    title: 'Async e Promises',
    description: 'Aprenda a lidar com código assíncrono em JavaScript.',
    number: 4,
    lessons: [
      {
        id: '4-1',
        title: 'Callbacks',
        description: 'Callbacks e Promises',
        xp: 12,
        completed: false,
      },
      {
        id: '4-2',
        title: 'Async/Await',
        description: 'Programação assíncrona moderna',
        xp: 15,
        completed: false,
      },
    ],
  },
  {
    id: 5,
    title: 'DOM e Eventos',
    description: 'Pratique manipulação de DOM e eventos.',
    number: 5,
    lessons: [
      {
        id: '5-1',
        title: 'DOM API',
        description: 'Manipule o DOM',
        xp: 12,
        completed: false,
      },
      {
        id: '5-2',
        title: 'Eventos',
        description: 'Trabalhe com eventos',
        xp: 12,
        completed: false,
      },
    ],
  },
]
