import bodyParser from 'body-parser';
import multer from 'multer';
import assert from 'assert';
import pathToRegexp from 'path-to-regexp';
import { join } from 'path';
import { windowPath } from './utils';
import glob from 'glob';

const VALID_METHODS = ['post', 'get', 'put', 'patch', 'delete'];
const BODY_PARSED_METHODS = ['post', 'get', 'put', 'patch', 'delete'];
let spinner = null;

function createHandler(method, path, handler) {
  return function(req, res, next) {
    if (BODY_PARSED_METHODS.includes(method)) {
      bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
        bodyParser.urlencoded({ limit: '5mb', extended: true })(
          req,
          res,
          () => {
            sendData();
          },
        );
      });
    }

    function sendData() {
      if (typeof handler === 'function') {
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

export function normalizeConfig(config) {
  return Object.keys(config).reduce((memo, key) => {
    const handler = config[key];
    const type = typeof handler;
    assert(
      type === 'function' || type === 'object',
      `mock value of ${key} should be function or object, but got ${type}`,
    );
    const { method, path } = parseKey(key);
    const keys = [];
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler),
    });
    return memo;
  }, []);
}

function parseKey(key) {
  let method = 'get';
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }
  assert(
    VALID_METHODS.includes(method),
    `Invalid method ${method} for path ${path}, please check your mock files.`,
  );
  return {
    method,
    path,
  };
}

export function getMockFiles(opts) {
  let mockFiles = glob
    .sync(opts.path, {
      ignore: ['**/node_modules/**'],
    })
    .map(p => join(process.cwd(), p));
  // 处理一下路径，不然在 win 下面会报错
  mockFiles = mockFiles.map(p => windowPath(p));

  return mockFiles;
}

export function getMockConfigFromFiles(files) {
  return files.reduce((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line
      memo = {
        ...memo,
        ...(m.default || m),
      };
      return memo;
    } catch (e) {
      throw new Error(e.stack);
    }
  }, {});
}

function getMockConfig(opts) {
  const files = getMockFiles(opts);
  return getMockConfigFromFiles(files);
}

export default function(opts) {
  spinner = opts.spinner;

  try {
    return normalizeConfig(getMockConfig(opts));
  } catch (e) {
    spinner.fail(`Mock files parse failed`);
  }
}
