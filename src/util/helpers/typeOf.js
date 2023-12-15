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
  "[object GeneratorFunction]": TYPE_GENERATOR_FUNCTION,
};

export const typeOf = (_obj) =>
  typeof _obj === "undefined"
    ? typeof _obj
    : type[Object.prototype.toString.call(_obj)] || typeof _obj;
