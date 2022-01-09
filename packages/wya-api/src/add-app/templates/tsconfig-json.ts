export default function () {
  return `{
  "include": ["src"],
  "exclude": ["node_modules"],
  "extends": "tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "target": "ES5",
    "lib": ["ES2021"]
  }
}`;
}
