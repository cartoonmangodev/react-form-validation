'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var invariant = _interopDefault(require('invariant'));

const cloneObject = function (oldState) {
  let newState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.assign({}, oldState, newState);
};
const newObject = function () {
  let oldState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }
  return rest.length === 0 ? cloneObject(oldState) : rest.reduce((acc, curr) => cloneObject(acc, typeof curr === 'function' && curr(oldState, acc) || curr), cloneObject(oldState));
};

const TYPE_NULL = "null";
const TYPE_UNDEFINED = "undefined";
const TYPE_STRING = "string";
const TYPE_ARRAY = "array";
const TYPE_BOOLEAN = "boolean";
const TYPE_OBJECT = "object";
const TYPE_FUNCTION = "function";
const TYPE_ERROR = "error";
const TYPE_SYMBOL = "symbol";
const TYPE_GENERATOR_FUNCTION = "generatorFunction";
const type = {
  "[object Null]": TYPE_NULL,
  "[object Undefined]": TYPE_UNDEFINED,
  "[object String]": TYPE_STRING,
  "[object Array]": TYPE_ARRAY,
  "[object Boolean]": TYPE_BOOLEAN,
  "[object Object]": TYPE_OBJECT,
  "[object Function]": TYPE_FUNCTION,
  "[object Error]": TYPE_ERROR,
  "[object Symbol]": TYPE_SYMBOL,
  "[object GeneratorFunction]": TYPE_GENERATOR_FUNCTION
};
const typeOf = _obj => typeof _obj === "undefined" ? typeof _obj : type[Object.prototype.toString.call(_obj)] || typeof _obj;

const _uniqueId = {};
const generateTimeStamp = () => new Date().getTime();
const generateUniqueId = function generateUniqueId() {
  const __uniqueId = Math.floor(Math.random() * generateTimeStamp());
  if (_uniqueId[__uniqueId]) return generateUniqueId();
  _uniqueId[__uniqueId] = __uniqueId;
  return __uniqueId;
};
const deleteUniqueId = id => delete _uniqueId[id];

const IS_SCHEMA = `_schema_id_@_${generateTimeStamp()}_@_`;
const IS_MULTIPLE = `${IS_SCHEMA}_multiple`;
const SCHEMA_CONFIG = `${IS_SCHEMA}_config`;

const checkKey = (key, message, dataType) => {
  const convertArray = Array.isArray(dataType) ? dataType : [dataType];
  invariant(convertArray.includes(typeOf(key)), message);
};
const checkIsValidConfig = config => config[IS_SCHEMA] || config[IS_MULTIPLE];
const newSchema = config => {
  if (checkIsValidConfig(config || {})) checkKey(false, "(newSchema) Invalid form schema", "object");
  return {
    [IS_SCHEMA]: true,
    [SCHEMA_CONFIG]: config
  };
};
const newFormArray = config => {
  if (config[IS_MULTIPLE]) checkKey(false, "(newMultiple) Invalid form schema", "object");
  return {
    [IS_MULTIPLE]: true,
    [SCHEMA_CONFIG]: config[IS_SCHEMA] ? config._config : config
  };
};

exports.deleteUniqueId = deleteUniqueId;
exports.generateTimeStamp = generateTimeStamp;
exports.generateUniqueId = generateUniqueId;
exports.newFormArray = newFormArray;
exports.newObject = newObject;
exports.newSchema = newSchema;
exports.typeOf = typeOf;
