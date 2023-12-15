import {
  TYPE_NULL,
  TYPE_UNDEFINED,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_BOOLEAN,
  TYPE_OBJECT,
  TYPE_FUNCTION,
  TYPE_ERROR,
  TYPE_SYMBOL,
  TYPE_GENERATOR_FUNCTION,
} from "../../constants";

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
