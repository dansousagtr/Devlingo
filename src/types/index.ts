export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export interface Lesson {
  id: string | number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface Unit {
  id: string | number;
  title: string;
  description: string;
  number: number;
  lessons: Lesson[];
}

export interface Question {
  id: string | number;
  title: string;
  options: string[];
  correctAnswer: number;
}
