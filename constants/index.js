'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('invariant');

// export const IS_SCHEMA = `_schema_id_@_${generateTimeStamp()}_@_`;
const IS_SCHEMA = `_schema_id_@_@_`;
const IS_FORMREF = `${IS_SCHEMA}_ref`;
const IS_MULTIPLE = `${IS_SCHEMA}_multiple`;
const PRIMITIVE_VALUE = `${IS_SCHEMA}_primitive_@_`;
const SCHEMA_CONFIG = `${IS_SCHEMA}_config`;
const ON_CHANGE = "onChange";
const ON_BLUR = "onBlur";
const VALUE = "value";
const ERROR = "error";
const ON_CHANGE_TEXT = "onChangeText";

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

exports.ERROR = ERROR;
exports.IS_FORMREF = IS_FORMREF;
exports.IS_MULTIPLE = IS_MULTIPLE;
exports.IS_SCHEMA = IS_SCHEMA;
exports.ON_BLUR = ON_BLUR;
exports.ON_CHANGE = ON_CHANGE;
exports.ON_CHANGE_TEXT = ON_CHANGE_TEXT;
exports.PRIMITIVE_VALUE = PRIMITIVE_VALUE;
exports.SCHEMA_CONFIG = SCHEMA_CONFIG;
exports.TYPE_ARRAY = TYPE_ARRAY;
exports.TYPE_BOOLEAN = TYPE_BOOLEAN;
exports.TYPE_ERROR = TYPE_ERROR;
exports.TYPE_FUNCTION = TYPE_FUNCTION;
exports.TYPE_GENERATOR_FUNCTION = TYPE_GENERATOR_FUNCTION;
exports.TYPE_NULL = TYPE_NULL;
exports.TYPE_OBJECT = TYPE_OBJECT;
exports.TYPE_STRING = TYPE_STRING;
exports.TYPE_SYMBOL = TYPE_SYMBOL;
exports.TYPE_UNDEFINED = TYPE_UNDEFINED;
exports.VALUE = VALUE;
