import { generateTimeStamp, typeOf } from "../utils";
import invariant from "invariant";

export const IS_SCHEMA = `_schema_id_@_${generateTimeStamp()}_@_`;
export const IS_FORMREF = `${IS_SCHEMA}_ref`;
export const IS_MULTIPLE = `${IS_SCHEMA}_multiple`;
export const IS_LITERAL_VALUE = `_schema_id_@__literal_@_`;
export const SCHEMA_CONFIG = `${IS_SCHEMA}_config`;

export const ON_CHANGE = "onChange";
export const ON_BLUR = "onBlur";
export const VALUE = "value";
export const ERROR = "error";

const checkKey = (key, message, dataType) => {
  const convertArray = Array.isArray(dataType) ? dataType : [dataType];
  invariant(convertArray.includes(typeOf(key)), message);
};

const checkIsValidConfig = (config) => config[IS_SCHEMA] || config[IS_MULTIPLE];

export const newSchema = (config) => {
  if (checkIsValidConfig(config || {}))
    checkKey(false, "(newSchema) Invalid form schema", "object");
  return {
    [IS_SCHEMA]: true,
    [SCHEMA_CONFIG]: config,
  };
};

export const newFormArray = (config) => {
  if (config[IS_MULTIPLE])
    checkKey(false, "(newMultiple) Invalid form schema", "object");
  return {
    [IS_MULTIPLE]: true,
    [SCHEMA_CONFIG]: config[IS_SCHEMA] ? config._config : config,
  };
};
