declare module '*.jpg';
declare module '*.webp';
declare module '*.png';
declare module '*.svg';

interface Set<T> {
  random(): T;
}

interface Array<T> {
  random(): T;
}
