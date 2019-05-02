# graphql2js

This script helps you convert graphql operation and schema files into JavaScript files that you can import
in your project.

This is useful if you are using `graphql-tag/loader` in your webpack client code and want to import those
same `graphql` files in code that is not using `webpack`.

For each `.graphql` file in the source folder it will output a `.graphql.js` file in the output folder.

## Installation

### Yarn

`yarn add -D graphql2js`

### npm

`npm install -D graphql2js`

## Usage

### Yarn 

`yarn graphql2js -d src -o dist src/**/*.graphql`

### npx 

`npx graphql2js -d src -o dist src/**/*.graphql`

