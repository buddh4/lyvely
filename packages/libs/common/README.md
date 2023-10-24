# lively-common

## Install

```
npm install lyvely-common
```

### Jest

Add the following to your jest config:

```
"transformIgnorePatterns": [
   "/node_modules/(?!lyvely-common/.*)"
]
```

This is required in order to prevent typescript transform conflicts since typescript does not respect `exports` in
`package.json`

## Link

`npm ls -g --depth=0 --link=true`

`npm rm --global lively-common`

## Troubleshooting

If build fails, delete `tsconfig.tsbuildinfo` and try again...