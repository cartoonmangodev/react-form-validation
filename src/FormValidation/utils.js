import { newObject } from "../utils";
import { IS_MULTIPLE, IS_SCHEMA, SCHEMA_CONFIG } from "./constants";

export const _getPlatformBasedFieldValue = (e) =>
  e &&
  typeof e === "object" &&
  e.target &&
  typeof e.preventDefault === "function"
    ? e.target.value
    : e;
export const _getPlatformBasedFieldName = (e) =>
  e &&
  typeof e === "object" &&
  e.target &&
  typeof e.preventDefault === "function"
    ? e.target.name
    : undefined;

export const _checkType = (val, oldVal) =>
  newObject(typeof val === "function" ? val(oldVal) : val);

export const _trimStrings = (value = "", isNumber = false) => {
  if (value && typeof value === "string" && String(value)) {
    const trimedString = String(value).trim();
    return isNumber ? Number(trimedString) : trimedString;
  }
  return value;
};

export const _setInitialValues = ({
  formConfig,
  initialValues: _initialValues = {},
  formRef,
  isMultiple,
  isError,
}) => {
  const _resetValue = (key) => {
    const config = formConfig[key] || {};
    return key in _initialValues
      ? typeof _initialValues[key] === "function"
        ? _initialValues[key]()
        : _initialValues[key]
      : "default" in config
      ? config.default
      : "";
  };
  // if (Object.keys(_initialValues).length) {
  //   return _initialValues;
  // }
  const _values = (isMultiple
    ? Array.isArray(_initialValues)
      ? _initialValues
      : [_initialValues]
    : [_initialValues]
  ).reduce(
    (acc, initialValues) => {
      if (formConfig[IS_MULTIPLE]) return [];
      const __values = Object.entries(formConfig || {}).reduce(
        (acc, [key, val = {}]) => {
          if (key in initialValues)
            return newObject(acc, {
              [key]:
                val && (val[IS_SCHEMA] || val[IS_MULTIPLE] || val._formId_)
                  ? _setInitialValues({
                      formRef: val._formId_
                        ? val
                        : formRef &&
                          formRef.current &&
                          formRef.current._schema[key].formRef,
                      initialValues: initialValues[key] || {},
                      formConfig: val._formId_
                        ? val.getFormConfig()
                        : val[SCHEMA_CONFIG],
                      isMultiple: val[IS_MULTIPLE],
                      isError,
                    })
                  : isError
                  ? initialValues[key] || null
                  : _resetValue(key),
            });
          return newObject(acc, {
            [key]: isError ? initialValues[key] || null : _resetValue(key),
          });
        },
        {}
      );
      return isMultiple ? acc.concat([__values]) : __values;
    },
    isMultiple ? [] : {}
  );
  if (formRef && formRef.current)
    formRef.current[isError ? "errors" : "values"] = _values;
  return _values;
};

export const _setInitialErrors = (props) => {
  return _setInitialValues({
    ...props,
    isError: true,
  });
};

export function _deepCopy(src, /* INTERNAL */ _visited, _copiesVisited) {
  if (src === null || typeof src !== "object") {
    return src;
  }

  //Honor native/custom clone methods
  if (typeof src.clone == "function") {
    return src.clone(true);
  }

  //Special cases:
  //Date
  if (src instanceof Date) {
    return new Date(src.getTime());
  }
  //RegExp
  if (src instanceof RegExp) {
    return new RegExp(src);
  }
  //DOM Element
  if (src.nodeType && typeof src.cloneNode == "function") {
    return src.cloneNode(true);
  }

  // Initialize the visited objects arrays if needed.
  // This is used to detect cyclic references.
  if (_visited === undefined) {
    _visited = [];
    _copiesVisited = [];
  }

  // Check if this object has already been visited
  var i,
    len = _visited.length;
  for (i = 0; i < len; i++) {
    // If so, get the copy we already made
    if (src === _visited[i]) {
      return _copiesVisited[i];
    }
  }

  //Array
  if (Object.prototype.toString.call(src) == "[object Array]") {
    //[].slice() by itself would soft clone
    var ret = src.slice();

    //add it to the visited array
    _visited.push(src);
    _copiesVisited.push(ret);

    var i = ret.length;
    while (i--) {
      ret[i] = _deepCopy(ret[i], _visited, _copiesVisited);
    }
    return ret;
  }

  //If we've reached here, we have a regular object

  //make sure the returned object has the same prototype as the original
  var proto = Object.getPrototypeOf
    ? Object.getPrototypeOf(src)
    : src.__proto__;
  if (!proto) {
    proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
  }
  var dest = Object.create(proto);

  //add this object to the visited array
  _visited.push(src);
  _copiesVisited.push(dest);

  for (var key in src) {
    //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
    //For an example of how this could be modified to do so, see the singleMixin() function
    dest[key] = _deepCopy(src[key], _visited, _copiesVisited);
  }
  return dest;
}
