#!/usr/bin/env node
import chokidar from 'chokidar';
import commander from 'commander';
import * as fs from 'fs';
import glob from 'glob';
import {
  dirname,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import { mkdirsSync } from 'fs-extra';

let printFilenames = false;

const writeIfChanged = (outPath: string, fileContent: string) => {
  const existingFileContent = fs.existsSync(outPath)
    ? fs.readFileSync(outPath).toString('utf-8')
    : '';
  if (fileContent !== existingFileContent) {
    mkdirsSync(dirname(outPath));
    fs.writeFileSync(outPath, Buffer.from(fileContent, 'utf-8'));
    if (printFilenames) {
      console.log({ outPath }, 'Updated file');
    }
    return true;
  }
  return false;
};

export const generate = (source: string): string => {
  const loader = require('graphql-tag/loader');

  return loader.call(
    {
      cacheable: () => {},
    },
    source,
  );
};

const updatePath = (path: string, outPath: string) => {
  if (!fs.existsSync(path)) {
    if (fs.existsSync(outPath)) {
      fs.unlinkSync(outPath);
      return true;
    }
    return false;
  } else {
    const source = fs.readFileSync(path).toString('utf-8');
    const newContent = generate(source);
    return writeIfChanged(outPath, newContent);
  }
};

const main = () => {
  try {
    commander.description(
      'Generate javascript files from GraphQL files, so you can import them.  Uses babel-tag/loader under the hood.',
    );

    commander.option(
      '-w, --watch',
      'Watch for file changes and automatically update ts files',
      false,
    );
    commander.option(
      '-o, --output <outPath>',
      'Directory to write output files into',
      './bin',
    );
    commander.option(
      '-d, --root <rootPath>',
      'Dir to consider source files relative to when calculating the output path',
    );
    commander.option('-v, --verbose', 'More output', false);

    commander.arguments('<patterns...>');

    commander.parse(process.argv);

    const { verbose, output: outPath, root, watch } = commander.opts();
    if (verbose) {
      printFilenames = true;
    }

    if(!outPath) {
      console.error('Must provide output folder!');
      process.exit(1);
    }
    const rootPath =
      root || require('glob-parent')(commander.args[0]);

    if(!outPath) {
      console.error('Root path not provided and could not be derived from input glob!');
      process.exit(1);
    }

    const listener = (path: string) =>
      updatePath(
        path,
        resolvePath(outPath, relativePath(rootPath || '', path + '.js')),
      );
    if (watch) {
      const watcher = chokidar.watch(commander.args, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
      });
      watcher
        .on('add', listener)
        .on('change', listener)
        .on('unlink', listener)
        .on('error', error => console.error(error))
        .on('ready', () => {
          console.log('Watching for changes');
          printFilenames = true;
        });
    } else {
      let fileCount = 0;
      let changedCount = 0;
      for (const pattern of commander.args) {
        for (const path of glob.sync(pattern)) {
          fileCount += 1;
          if (listener(path)) {
            changedCount += 1;
          }
        }
      }
      console.log({ changedCount, fileCount }, 'Code generation finished.');
      process.exit(0);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
