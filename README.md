# graphql2js

This script helps you convert graphql operation and schema files into JavaScript files that you can import
in your project.

This is useful if you are using `graphql-tag/loader` in your webpack client code and want to import those
same `graphql` files in code that is not using `webpack`.

For each `.graphql` file in the source folder it will output a `.graphql.js` file in the output folder.

If a target file already exists and matches the source file, this leaves the output unchanged.

## Installation

### Yarn

`yarn add -D graphql2js`

### npm

`npm install -D graphql2js`

## Usage

### Yarn 

`yarn graphql2js -d src -o dist src/**/*.graphql`

To stay running and watch for file changes after the initial build:

`yarn graphql2js -d src -o dist --watch src/**/*.graphql`

### npx 

`npx graphql2js -d src -o dist src/**/*.graphql`

To stay running and watch for file changes after the initial build:

`npx graphql2js -d src -o dist --watch src/**/*.graphql`

### Multi-project building

You can build multiple projects in a monorepo at once, if they use the same input and output
folders relative to the folder with package.json, by prefixing the folder arguments with `{projectRoot}`:

`yarn graphql2js -d '{projectRoot}/src' -o '{projectRoot}/dist' src/**/*.graphql`

### TypeScript declarations

You can pass the option `-t` and it will output a `.d.ts` file with each `.js` file it generates.

## History

### 1.2.0

Changed it so that `--watch` still processes all the files

### 1.3.0

Added option `-t` to emit typescript `.d.ts` files

### 1.4.0

Added `{projectRoot}` support for multi-projects building / watching
