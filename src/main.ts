export function main() {
  console.log('hello');
}
declare let global: any;
global.main = main;