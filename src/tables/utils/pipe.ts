export const pipe =
   <T>(...fns: Array<(arg: T) => T>) =>
   (initialValue: T): T =>
      fns.reduce((value, fn) => fn(value), initialValue);
