"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var invariant=_interopDefault(require("invariant"));const TYPE_NULL="null",TYPE_UNDEFINED="undefined",TYPE_STRING="string",TYPE_ARRAY="array",TYPE_BOOLEAN="boolean",TYPE_OBJECT="object",TYPE_FUNCTION="function",TYPE_ERROR="error",TYPE_SYMBOL="symbol",TYPE_GENERATOR_FUNCTION="generatorFunction",type={"[object Null]":"null","[object Undefined]":"undefined","[object String]":"string","[object Array]":"array","[object Boolean]":"boolean","[object Object]":"object","[object Function]":"function","[object Error]":"error","[object Symbol]":"symbol","[object GeneratorFunction]":"generatorFunction"},typeOf=e=>void 0===e?typeof e:type[Object.prototype.toString.call(e)]||typeof e,generateTimeStamp=()=>(new Date).getTime(),IS_SCHEMA=`_schema_id_@_${generateTimeStamp()}_@_`,IS_FORMREF=`${IS_SCHEMA}_ref`,IS_MULTIPLE=`${IS_SCHEMA}_multiple`,IS_LITERAL_VALUE="_schema_id_@__literal_@_",SCHEMA_CONFIG=`${IS_SCHEMA}_config`,ON_CHANGE="onChange",ON_BLUR="onBlur",VALUE="value",ERROR="error",checkKey=(e,o,r)=>{const t=Array.isArray(r)?r:[r];invariant(t.includes(typeOf(e)),o)},checkIsValidConfig=e=>e[IS_SCHEMA]||e[IS_MULTIPLE],newSchema=e=>(checkIsValidConfig(e||{})&&checkKey(!1,"(newSchema) Invalid form schema","object"),{[IS_SCHEMA]:!0,[SCHEMA_CONFIG]:e}),newFormArray=e=>(e[IS_MULTIPLE]&&checkKey(!1,"(newMultiple) Invalid form schema","object"),{[IS_MULTIPLE]:!0,[SCHEMA_CONFIG]:e[IS_SCHEMA]?e._config:e}),TYPE_NULL$1="null",TYPE_UNDEFINED$1="undefined",TYPE_STRING$1="string",TYPE_ARRAY$1="array",TYPE_BOOLEAN$1="boolean",TYPE_OBJECT$1="object",TYPE_FUNCTION$1="function",TYPE_ERROR$1="error",TYPE_SYMBOL$1="symbol",TYPE_GENERATOR_FUNCTION$1="generatorFunction";exports.ERROR=ERROR,exports.IS_FORMREF=IS_FORMREF,exports.IS_LITERAL_VALUE=IS_LITERAL_VALUE,exports.IS_MULTIPLE=IS_MULTIPLE,exports.IS_SCHEMA=IS_SCHEMA,exports.ON_BLUR=ON_BLUR,exports.ON_CHANGE=ON_CHANGE,exports.SCHEMA_CONFIG=SCHEMA_CONFIG,exports.TYPE_ARRAY="array",exports.TYPE_BOOLEAN="boolean",exports.TYPE_ERROR="error",exports.TYPE_FUNCTION="function",exports.TYPE_GENERATOR_FUNCTION="generatorFunction",exports.TYPE_NULL="null",exports.TYPE_OBJECT="object",exports.TYPE_STRING="string",exports.TYPE_SYMBOL="symbol",exports.TYPE_UNDEFINED="undefined",exports.VALUE=VALUE,exports.newFormArray=newFormArray,exports.newSchema=newSchema;
