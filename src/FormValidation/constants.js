import { generateTimeStamp } from "../utils";

export const IS_SCHEMA = `_schema_id_@_${generateTimeStamp()}_@_`;
export const IS_FORMREF = `${IS_SCHEMA}_ref`;
export const IS_MULTIPLE = `${IS_SCHEMA}_multiple`;
export const PRIMITIVE_VALUE = `${IS_SCHEMA}_primitive_@_`;
export const SCHEMA_CONFIG = `${IS_SCHEMA}_config`;

export const ON_CHANGE = "onChange";
export const ON_BLUR = "onBlur";
export const VALUE = "value";
export const ERROR = "error";
export const ON_CHANGE_TEXT = "onChangeText";
