'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var isEqual = _interopDefault(require('fast-deep-equal'));
var invariant = _interopDefault(require('invariant'));

var FormContext = /*#__PURE__*/React.createContext(null);
const FormRefContext = /*#__PURE__*/React.createContext(null);
const FormControllerContext = /*#__PURE__*/React.createContext(null);

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

const TYPE_STRING$1 = "string";
const TYPE_ARRAY$1 = "array";
const TYPE_OBJECT$1 = "object";
const TYPE_FUNCTION$1 = "function";

const _getPlatformBasedFieldValue = e => e && typeof e === "object" && e.target && typeof e.preventDefault === "function" ? e.target.value : e;
const _getPlatformBasedFieldName = e => e && typeof e === "object" && e.target && typeof e.preventDefault === "function" ? e.target.name : undefined;
const _checkType = (val, oldVal) => newObject(typeof val === "function" ? val(oldVal) : val);
const _trimStrings = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  let isNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (value && typeof value === "string" && String(value)) {
    const trimedString = String(value).trim();
    return isNumber ? Number(trimedString) : trimedString;
  }
  return value;
};
const _setInitialValues = _ref => {
  let {
    formConfig,
    initialValues: _initialValues = {},
    formRef,
    isMultiple,
    isError
  } = _ref;
  const _resetValue = key => {
    const config = formConfig[key] || {};
    return key in _initialValues ? typeof _initialValues[key] === "function" ? _initialValues[key]() : _initialValues[key] : "default" in config ? config.default : "";
  };
  // if (Object.keys(_initialValues).length) {
  //   return _initialValues;
  // }
  const _values = (isMultiple ? Array.isArray(_initialValues) ? _initialValues : [_initialValues] : [_initialValues]).reduce((acc, initialValues) => {
    if (formConfig[IS_MULTIPLE]) return [];
    const __values = Object.entries(formConfig || {}).reduce((acc, _ref2) => {
      let [key, val = {}] = _ref2;
      if (key in initialValues) return newObject(acc, {
        [key]: val && (val[IS_SCHEMA] || val[IS_MULTIPLE] || val._formId_) ? _setInitialValues({
          formRef: val._formId_ ? val : formRef && formRef.current && formRef.current._schema[key].formRef,
          initialValues: initialValues[key] || {},
          formConfig: val._formId_ ? val.getFormConfig() : val[SCHEMA_CONFIG],
          isMultiple: val[IS_MULTIPLE],
          isError
        }) : isError ? initialValues[key] || null : _resetValue(key)
      });
      return newObject(acc, {
        [key]: isError ? initialValues[key] || null : _resetValue(key)
      });
    }, {});
    return isMultiple ? acc.concat([__values]) : __values;
  }, isMultiple ? [] : {});
  if (formRef && formRef.current) formRef.current[isError ? "errors" : "values"] = _values;
  return _values;
};
const _setInitialErrors = props => {
  return _setInitialValues({
    ...props,
    isError: true
  });
};
const _deepCopy = e => e;

// export function _deepCopy(src, /* INTERNAL */ _visited, _copiesVisited) {
//   if (src === null || typeof src !== "object") {
//     return src;
//   }

//   //Honor native/custom clone methods
//   if (typeof src.clone == "function") {
//     return src.clone(true);
//   }

//   //Special cases:
//   //Date
//   if (src instanceof Date) {
//     return new Date(src.getTime());
//   }
//   //RegExp
//   if (src instanceof RegExp) {
//     return new RegExp(src);
//   }
//   //DOM Element
//   if (src.nodeType && typeof src.cloneNode == "function") {
//     return src.cloneNode(true);
//   }

//   // Initialize the visited objects arrays if needed.
//   // This is used to detect cyclic references.
//   if (_visited === undefined) {
//     _visited = [];
//     _copiesVisited = [];
//   }

//   // Check if this object has already been visited
//   var i,
//     len = _visited.length;
//   for (i = 0; i < len; i++) {
//     // If so, get the copy we already made
//     if (src === _visited[i]) {
//       return _copiesVisited[i];
//     }
//   }

//   //Array
//   if (Object.prototype.toString.call(src) == "[object Array]") {
//     //[].slice() by itself would soft clone
//     var ret = src.slice();

//     //add it to the visited array
//     _visited.push(src);
//     _copiesVisited.push(ret);

//     var i = ret.length;
//     while (i--) {
//       ret[i] = _deepCopy(ret[i], _visited, _copiesVisited);
//     }
//     return ret;
//   }

//   //If we've reached here, we have a regular object

//   //make sure the returned object has the same prototype as the original
//   var proto = Object.getPrototypeOf
//     ? Object.getPrototypeOf(src)
//     : src.__proto__;
//   if (!proto) {
//     proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
//   }
//   var dest = Object.create(proto);

//   //add this object to the visited array
//   _visited.push(src);
//   _copiesVisited.push(dest);

//   for (var key in src) {
//     //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
//     //For an example of how this could be modified to do so, see the singleMixin() function
//     dest[key] = _deepCopy(src[key], _visited, _copiesVisited);
//   }
//   return dest;
// }

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

/* eslint-disable import/no-anonymous-default-export */
const ID_KEY = "id";
var useConsumerHook = (function () {
  let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const ref = React.useRef({});
  const {
    inputProps = {},
    idKey,
    onSubmit,
    setInputProps,
    extraProps
  } = React.useContext(FormContext) || {};
  const {
    render,
    inputConfig: _inputConfig,
    ...commonInputProps
  } = React.useContext(FormControllerContext) || {};
  const inputConfig = {
    ...props.inputConfig,
    ..._inputConfig
  };
  const {
    formRef,
    renderForm,
    _rootRef: rootRef
  } = React.useContext(FormRefContext) || {};
  if (!formRef) return {
    inputProps: {}
  };
  let _inputFieldProps = inputProps[props[idKey || ID_KEY]] || {};
  const isIdExists = !!(props[idKey || ID_KEY] && typeof props[idKey || ID_KEY] === "string");
  if (!isIdExists) return {
    inputProps: {}
  };
  if (_inputFieldProps._fieldConfig && !isEqual(ref.current.inputConfig, inputConfig)) {
    if (ref.current.inputConfig) Object.keys(ref.current.inputConfig).forEach(_ref => {
      let [key, val] = _ref;
      delete _inputFieldProps._fieldConfig[key];
    });
    _inputFieldProps._fieldConfig._initiated = isIdExists;
    if (typeOf(inputConfig) === TYPE_OBJECT$1) Object.entries(inputConfig).forEach(_ref2 => {
      let [key, val] = _ref2;
      if (val !== undefined) _inputFieldProps._fieldConfig[key] = val;
    });
    formRef.setFormConfig({
      ...formRef.getFormConfig(),
      [props[idKey || ID_KEY]]: newObject(_inputFieldProps._fieldConfig || {}, {
        _initiated: isIdExists,
        render: !!(inputConfig.render !== undefined ? inputConfig.render : render !== undefined ? render : renderForm || render)
      })
    }, [props[idKey || ID_KEY]], false);
    formRef._renderForm(true);
  }
  if (PRIMITIVE_VALUE === props[idKey || ID_KEY] && !(formRef._parentRef && formRef._parentRef._isMultipleForm)) throw new Error(`Invalid: "PRIMITIVE_VALUE" can only be used directly under "Form.Multiple"`);
  const __inputProps = formRef.getInputProps(extraProps);
  if (PRIMITIVE_VALUE in __inputProps && props[idKey || ID_KEY] !== PRIMITIVE_VALUE) {
    throw new Error(`Invalid: "${props[idKey || ID_KEY]}" cannot add any field to primitive value `);
  }
  if (!(props[idKey || ID_KEY] in __inputProps) && !ref.current.id) {
    ref.current.id = props[idKey || ID_KEY];
    if (props[idKey || ID_KEY] === PRIMITIVE_VALUE && Object.values(__inputProps).filter(_config => _config._config && _config._config._initiated).length) {
      throw new Error(`Invalid: cannot add id="PRIMITIVE_VALUE" field. Primitive value is always unique. Please remove the other fields in order to use id="PRIMITIVE_VALUE" `);
    }
    formRef.modifyFormConfig({
      [props[idKey || ID_KEY]]: newObject(inputConfig || {}, {
        _initiated: isIdExists,
        render: !!(inputConfig.render !== undefined ? inputConfig.render : renderForm || render)
      })
    });
    formRef._setInputProps();
    formRef._renderForm();
    formRef.renderForm();
  }
  React.useEffect(() => {
    setInputProps();
    return () => {
      if (!rootRef.current.dontResetOnUnmount) {
        if (_inputFieldProps._fieldConfig) {
          _inputFieldProps._fieldConfig._initiated = false;
          if (typeOf(inputConfig) === TYPE_OBJECT$1) Object.keys(inputConfig).forEach(key => {
            _inputFieldProps._fieldConfig[key] = _inputFieldProps._defaultConfig[key];
          });
        }
        if (inputProps[IS_SCHEMA]) {
          if (ref.current.id) inputProps[IS_SCHEMA].deleteFormConfig([ref.current.id]);
          inputProps[IS_SCHEMA].resetFormInput([props[idKey || ID_KEY]], !!ref.current.id);
          inputProps[IS_SCHEMA].onFormChangeCallback();
        }
      }
    };
  }, [formRef._formId_]);
  ref.current.inputConfig = inputConfig;
  if (_inputFieldProps.error) _inputFieldProps[IS_SCHEMA].validateField(_inputFieldProps.value === undefined ? "" : _inputFieldProps.value);
  const _inputProps = formRef.getInputProps(extraProps)[props[idKey || ID_KEY]] || {};
  return {
    inputProps: {
      ...(_inputProps.inputProps || {}),
      ...commonInputProps
    },
    _inputFieldConfig: _inputProps._config,
    ...(onSubmit ? {
      onSubmit
    } : {})
  };
});

/* eslint-disable import/no-anonymous-default-export */
const useFormConsumer = useConsumerHook;

/* eslint-disable react/display-name */
const Consumer = /*#__PURE__*/React.memo(_ref => {
  let {
    children,
    ...props
  } = _ref;
  return typeof children === "function" ? children(props) : children;
}, (prev, next) => prev.inputProps.value === next.inputProps.value && prev.inputProps.error === next.inputProps.error && (prev._inputFieldConfig && prev._inputFieldConfig._config.lastUpdated) === (next._inputFieldConfig && next._inputFieldConfig._config.lastUpdated));
const ConsumerWithoutMemo = _ref2 => {
  let {
    children,
    ...props
  } = _ref2;
  return typeof children === "function" ? children(props) : children;
};
var FormConsumer = (_ref3 => {
  let {
    children,
    render,
    ...props
  } = _ref3;
  return props.id && !render ? /*#__PURE__*/React__default.createElement(Consumer, useConsumerHook(props), children) : /*#__PURE__*/React__default.createElement(ConsumerWithoutMemo, useConsumerHook(props), children);
});

/* eslint-disable react/display-name */
const getFormRef = (_formRef, id) => {
  let formRef = _formRef;
  if (formRef._isSchema_or_isMultiple_config_is_root) {
    formRef = formRef._schema[formRef._isSchema_or_isMultiple_config_is_root].formRef;
  }
  formRef = id ? formRef && formRef._schema[id] && formRef._schema[id].formRef : formRef;
  return formRef;
};
const checkFormRefIsValid = formRef => {
  if (!formRef || formRef.constructor.name !== "FormRef") {
    throw new Error("Invalid FormRef.Please use the formRef from the useFormHook");
  }
};
var FormProvider = /*#__PURE__*/React.forwardRef((_ref2, ref) => {
  let {
    children,
    idKey,
    onSubmit,
    formRef: _formRef,
    extraProps,
    id,
    renderForm: ___renderForm,
    dontResetOnUnmount
  } = _ref2;
  if (!_formRef && !id || _formRef && _formRef.constructor.name !== "FormRef") {
    if (_formRef) throw new Error("Invalid FormRef.Please use the formRef from the useFormHook");else throw new Error("Required props 'formRef' or 'id' ");
  }
  const {
    formRef: __formRef,
    renderForm: _renderForm,
    setRefresh: _setRefresh,
    rootFormRef: _rootFormRef,
    _rootRef: __rootRef
  } = React.useContext(FormRefContext) || {};
  const _ref = React.useRef({});
  const _rootRef = React.useRef({});
  const rootRef = __rootRef || _rootRef;
  _ref.current.dontResetOnUnmount = dontResetOnUnmount;
  const [_, setRefresh] = React.useState();
  const {
    extraProps: _extraProps = {}
  } = React.useContext(FormContext) || {};
  const __extraProps = newObject(_extraProps, extraProps);
  const rootFormRef = _rootFormRef || _formRef;
  let __setRefresh;
  __setRefresh = props => {
    if (_setRefresh) _setRefresh(props);
    setRefresh(props);
  };
  _ref.current.__setRefresh = __setRefresh;
  const renderForm = ___renderForm !== undefined ? ___renderForm : _renderForm;
  const idRef = React.useRef({});
  let ___formRef = _formRef || __formRef;
  checkFormRefIsValid(___formRef);
  let formRef = getFormRef(___formRef, id);
  if (_formRef && __formRef && (__formRef.formId === _formRef.formId || _formRef.formId === rootFormRef.formId)) throw new Error('Invalid: Formref are not valid. Cannot be used formref inside nested formref. Please use "id" instead');
  if (!formRef) {
    if (id) {
      checkFormRefIsValid(___formRef);
      if (___formRef._isMultipleForm) throw new Error(`Invalid: Cannot use 'id' directly under 'FormRef.Multiple'. Please use formRef props instead `);
      idRef.current.id = id;
      let newFormRef = ___formRef.modifyFormConfig({
        [id]: newSchema({})
      });
      ___formRef = newFormRef;
      let _valueRef = getFormRef(___formRef, id);
      formRef = _valueRef;
    }
  }
  checkFormRefIsValid(formRef);
  if (formRef._isMultipleForm) throw new Error(id ? `Invalid: This id (${id}) is configured for multiple form. Please use the 'Form.Multiple'` : "Invalid: This FormRef is configured for multiple form. Please use the 'Form.Multiple'");
  if (!formRef._setRenderForm) formRef._ref(IS_FORMREF)._setRenderForm = ___formRef._setRenderForm;
  const [inputProps, setInputProps] = React.useState(() => formRef && formRef.getInputProps(__extraProps));
  React.useEffect(() => {
    setInputProps(formRef && formRef.getInputProps(__extraProps));
  }, [formRef._formId_]);
  if (formRef && formRef._formId_) {
    if (__formRef) {
      formRef._ref(IS_FORMREF)._setInputProps = props => {
        if (__formRef._renderInputProps) __formRef._renderInputProps();
        setInputProps(props);
      };
    } else {
      formRef._ref(IS_FORMREF)._setInputProps = setInputProps;
    }
  }
  React.useEffect(() => () => {
    if (_ref.current.dontResetOnUnmount) {
      rootRef.current.dontResetOnUnmount = _ref.current.dontResetOnUnmount;
    }
  }, []);
  React.useEffect(() => {
    return () => {
      if (!rootRef.current.dontResetOnUnmount) {
        if (formRef && formRef._ref(IS_FORMREF)._setInputProps) delete formRef._ref(IS_FORMREF)._setInputProps;
        if (formRef && formRef._ref(IS_FORMREF)._extraProps) delete formRef._ref(IS_FORMREF)._extraProps;
      }
    };
  }, [formRef._formId_]);
  React.useEffect(() => {
    return () => {
      if (idRef.current.id && !rootRef.current.dontResetOnUnmount) {
        ___formRef.deleteFormConfig([idRef.current.id]);
        _ref.current.__setRefresh({});
      }
    };
  }, [___formRef._formId_]);
  if (formRef && formRef._formId_) formRef._ref(IS_FORMREF)._extraProps = __extraProps;
  React.useEffect(() => {
    formRef._ref(IS_FORMREF)._is_form_initiated = true;
    formRef._renderForm();
    formRef.renderForm();
    return () => {
      if (!rootRef.current.dontResetOnUnmount) {
        formRef._ref(IS_FORMREF)._is_form_initiated = false;
        formRef._renderForm();
        formRef.renderForm();
      }
    };
  }, [formRef._formId_]);
  rootFormRef._formRef.__formRef__.values = rootFormRef._formRef.__formRef__.getValues();
  rootFormRef._formRef.__formRef__.errors = rootFormRef._formRef.__formRef__.getErrors();
  return /*#__PURE__*/React__default.createElement(FormContext.Provider, {
    value: {
      inputProps,
      idKey,
      onSubmit,
      setInputProps: () => setInputProps(() => formRef.getInputProps(__extraProps)),
      formId: ___formRef._formId_,
      extraProps: __extraProps
    }
  }, /*#__PURE__*/React__default.createElement(FormRefContext.Provider, {
    value: {
      formRef,
      formId: formRef._formId_,
      renderForm,
      lastUpdated: formRef._lastUpdated,
      setRefresh: __setRefresh,
      rootFormRef: _rootFormRef || _formRef,
      _rootRef: rootRef
    }
  }, ref && "current" in ref && (ref.current = formRef) && null, typeof children === "function" ? children({
    inputProps,
    values: formRef.getValues(),
    errors: formRef.getErrors(),
    formRef
  }) : children));
});

/* eslint-disable react/display-name */
const convertToOriginalData = value => typeOf(value) === TYPE_OBJECT$1 && PRIMITIVE_VALUE in value ? value[PRIMITIVE_VALUE] : value;
const generateNewFormRef = (formRef, _values, __formRef, rootFormRef, isMultiple) => {
  const __values = typeOf(_values) === TYPE_OBJECT$1 || _values === undefined ? _values : {
    [PRIMITIVE_VALUE]: _values
  };
  const _formRef = formRef._formValidationHandler(newObject({
    ...newObject(formRef._initialConfig),
    FORM_CONFIG: isMultiple ? newFormArray({}) : newObject(formRef._initialConfig.FORM_CONFIG),
    initialState: __values || {},
    renderFormCallback: rootFormRef._setRenderForm,
    _rootRef: {
      current: rootFormRef
    },
    getFormData: rootFormRef._isRenderForm ? __formRef._setRenderForm : undefined,
    _parentRef: formRef,
    _parentId: formRef.formId
  }));
  return _formRef;
};
const _getFormRef = (_formRef, id) => {
  let formRef = _formRef;
  if (formRef._isSchema_or_isMultiple_config_is_root) {
    formRef = formRef._schema[formRef._isSchema_or_isMultiple_config_is_root].formRef;
  }
  formRef = id ? formRef && formRef._schema[id] && formRef._schema[id].formRef : formRef;
  return formRef;
};
const checkFormRefIsValid$1 = formRef => {
  if (!formRef || formRef.constructor.name !== "FormRef") {
    throw new Error("Invalid FormRef.Please use the formRef from the useFormHook");
  }
};
var MultipleFormProvider = /*#__PURE__*/React.forwardRef((_ref2, ref) => {
  let {
    children,
    formRef: _formRef,
    noAutoLoop,
    id,
    renderForm: ___renderForm,
    defaultCount = 1,
    dontResetOnUnmount
  } = _ref2;
  if (!_formRef && !id || _formRef && _formRef.constructor.name !== "FormRef") {
    if (_formRef) throw new Error("Invalid FormRef.Please use the formRef from the useFormHook");else throw new Error("Required props 'formRef' or 'id' ");
  }
  const {
    formRef: ___formRef,
    setRefresh: _setRefresh,
    renderForm: _renderForm,
    rootFormRef: _rootFormRef,
    _rootRef: __rootRef
  } = React.useContext(FormRefContext) || {};
  const {
    setInputProps
  } = React.useContext(FormContext);
  const idRef = React.useRef({});
  const _ref = React.useRef({});
  const _rootRef = React.useRef({});
  const rootRef = __rootRef || _rootRef;
  _ref.current.dontResetOnUnmount = dontResetOnUnmount;
  const renderForm = ___renderForm !== undefined ? ___renderForm : _renderForm;
  const rootFormRef = _rootFormRef || _formRef;
  let _thisFormRef = _formRef || ___formRef;
  checkFormRefIsValid$1(_thisFormRef);
  const __formRef = _getFormRef(_thisFormRef, id);
  let formRef = __formRef;
  if (!formRef) {
    if (id) {
      idRef.current.id = id;
      let newFormRef = _thisFormRef.modifyFormConfig({
        [id]: newFormArray({})
      });
      _thisFormRef = newFormRef;
      let _valueRef = _getFormRef(_thisFormRef, id);
      formRef = _valueRef;
    }
  } else if (__formRef && _formRef && !__formRef._multipleConfig) {
    if (__formRef._parentRef) __formRef._parentRef.modifyFormConfig({
      [__formRef._parentId]: {
        ...__formRef._parentConfig[__formRef._parentId],
        [SCHEMA_CONFIG]: newFormArray({})
      }
    });
  }
  checkFormRefIsValid$1(formRef);
  if (!formRef._isMultipleForm) throw new Error(id ? `Invalid: This id (${id}) is configured for simple form. Please use the 'Form.Provider'` : `Invalid: This FormRef is configured for simple form. Please use the 'Form.Provider'`);
  const valueRef = React.useRef({});
  const [_, setRefresh] = React.useState();
  let __setRefresh;
  __setRefresh = props => {
    if (_setRefresh) _setRefresh(props);
    setRefresh(props);
  };
  const generate = () => {
    if (formRef[IS_MULTIPLE]._initialValues.length > 0) {
      return formRef[IS_MULTIPLE]._initialValues.map(_values => generateNewFormRef(formRef, _values, ___formRef, rootFormRef, !!___formRef._multipleConfig));
    }
    return [...Array(typeof defaultCount === "number" ? defaultCount : 0)].map(_values => generateNewFormRef(formRef, _values, ___formRef, rootFormRef, !!___formRef._multipleConfig));
  };
  const [formRefArray, setFormRefArray] = React.useState(() => generate());
  valueRef.current.formRefArray = formRefArray;
  const formIdIndex = {};
  const getFormIds = () => valueRef.current.formRefArray.map((_ref3, _index) => {
    let {
      formId
    } = _ref3;
    formIdIndex[formId] = _index;
    return formId;
  });
  const formIds = getFormIds();
  valueRef.current.formIds = formIds;
  valueRef.current.formIdIndex = formIdIndex;
  const onChangeOrderForm = React.useCallback((sourceFormId, targetFormId) => {
    const currentIndex = valueRef.current.formIdIndex[sourceFormId];
    const targetIndex = valueRef.current.formIdIndex[targetFormId];
    if (currentIndex !== targetIndex && valueRef.current.formRefArray.length > 1 && targetIndex >= 0 && targetIndex < valueRef.current.formRefArray.length && currentIndex >= 0 && currentIndex < valueRef.current.formRefArray.length) {
      setFormRefArray(_val => {
        const ___val = _val.slice();
        const __value = ___val[currentIndex];
        if (typeof targetIndex === "number" && typeof currentIndex === "number") {
          ___val.splice(currentIndex, 1);
          ___val.splice(targetIndex, 0, __value);
        }
        return ___val;
      });
    }
  }, []);
  const onSwapForm = React.useCallback((sourceFormId, targetFormId) => {
    const currentIndex = valueRef.current.formIdIndex[sourceFormId];
    const targetIndex = valueRef.current.formIdIndex[targetFormId];
    if (currentIndex !== targetIndex && valueRef.current.formRefArray.length > 1 && targetIndex >= 0 && targetIndex < valueRef.current.formRefArray.length && currentIndex >= 0 && currentIndex < valueRef.current.formRefArray.length) setFormRefArray(_val => {
      const ___val = _val.slice();
      const __value = ___val[currentIndex];
      const __value2 = ___val[targetIndex];
      if (typeof targetIndex === "number" && typeof currentIndex === "number") {
        ___val.splice(currentIndex, 1, __value2);
        ___val.splice(targetIndex, 1, __value);
      }
      return ___val;
    });
  }, []);
  const onResetForm = function () {
    let formIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const _formIds = Array.isArray(formIds) ? formIds : [formIds];
    _formIds.forEach(_formId => {
      const form = valueRef.current.formRefArray[valueRef.current.formIdIndex[_formId]];
      if (form && form.formRef) form.formRef.resetForm();
    });
  };
  const onClearForm = function () {
    let formIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const _formIds = Array.isArray(formIds) ? formIds : [formIds];
    _formIds.forEach(_formId => {
      const form = valueRef.current.formRefArray[valueRef.current.formIdIndex[_formId]];
      if (form && form.formRef) form.formRef.clearForm();
    });
  };
  const onAddMultipleForm = function () {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let formId = arguments.length > 1 ? arguments[1] : undefined;
    let formCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    let isAppend = arguments.length > 3 ? arguments[3] : undefined;
    const startIndex = valueRef.current.formIdIndex[formId] + (isAppend ? 1 : 0);
    if (startIndex >= 0 && startIndex <= valueRef.current.formRefArray.length) setFormRefArray(_val => {
      let __val = _val.slice();
      const _newFormRef = [...Array(formCount)].map((_, _index) => generateNewFormRef(formRef, value[_index], ___formRef, rootFormRef));
      if (typeof startIndex === "number") __val.splice(startIndex, 0, ..._newFormRef);else __val.concat(_newFormRef);
      return __val;
    });
  };
  const onAddForm = function () {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let formId = arguments.length > 1 ? arguments[1] : undefined;
    let formCount = arguments.length > 2 ? arguments[2] : undefined;
    let isAppend = arguments.length > 3 ? arguments[3] : undefined;
    onAddMultipleForm(Array.isArray(value) ? value : value !== undefined ? [value] : [], formId, formCount, isAppend);
  };
  const onCloneForm = function (sourceFormId) {
    let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    const targetIndex = valueRef.current.formIdIndex[sourceFormId];
    if (targetIndex > -1 && targetIndex < valueRef.current.formRefArray.length && valueRef.current.formRefArray[targetIndex] && valueRef.current.formRefArray[targetIndex].formRef) {
      const value = valueRef.current.formRefArray[targetIndex].formRef.getValues();
      onAddMultipleForm(Array(count).fill(value), sourceFormId, count);
    }
  };
  const onDeleteMultipleForm = function () {
    let deleteKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (deleteKey.length > 0) setFormRefArray(_options => {
      const __options = _options.slice();
      return __options.filter(_ref4 => {
        let {
          formId
        } = _ref4;
        return !deleteKey.includes(formId);
      });
    });
  };
  const onDeleteForm = React.useCallback(function () {
    let formIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    onDeleteMultipleForm(Array.isArray(formIds) ? formIds : [formIds]);
  }, []);
  const getValues = React.useCallback(() => {
    const _values = valueRef.current.formRefArray.map(_ref5 => {
      let {
        formRef
      } = _ref5;
      return convertToOriginalData(formRef.getValues());
    });
    return _values;
  }, []);
  const setInitialFormData = React.useCallback(function () {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let isResetValue = arguments.length > 1 ? arguments[1] : undefined;
    if (!Array.isArray(value)) return getValues();
    if (value.length > valueRef.current.formRefArray.length) {
      const _formArray = value.slice(valueRef.current.formRefArray.length).map(_value => generateNewFormRef(formRef, _value, ___formRef, rootFormRef));
      setFormRefArray(valueRef.current.formRefArray.concat(_formArray));
    }
    return valueRef.current.formRefArray.map((_ref6, _i) => {
      let {
        formRef
      } = _ref6;
      return formRef.setInitialFormData(value[_i] || {}, isResetValue);
    });
  }, []);
  const setFormErrors = React.useCallback(function () {
    let error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let isResetValue = arguments.length > 1 ? arguments[1] : undefined;
    return valueRef.current.formRefArray.map((_ref7, _i) => {
      let {
        formRef
      } = _ref7;
      return formRef.setFormErrors(error[_i] || {}, isResetValue);
    });
  }, []);
  const getFormConfig = React.useCallback(() => {
    return valueRef.current.formRefArray.map(_ref8 => {
      let {
        formRef
      } = _ref8;
      return formRef.getFormConfig();
    });
  }, []);
  const getFormRef = React.useCallback(_formId => {
    if (_formId) {
      const _formRef = valueRef.current.formRefArray.find(_ref9 => {
        let {
          formId
        } = _ref9;
        return formId === _formId;
      });
      if (_formRef) return _formRef.formRef;
      return null;
    }
    return valueRef.current.formRefArray.map(_ref10 => {
      let {
        formRef
      } = _ref10;
      return formRef;
    });
  }, []);
  const getErrors = React.useCallback(() => {
    return valueRef.current.formRefArray.map(_ref11 => {
      let {
        formRef
      } = _ref11;
      return convertToOriginalData(formRef.getErrors());
    });
  }, []);
  const resetForm = React.useCallback(resetOnlyThisForm => {
    return valueRef.current.formRefArray.map(_ref12 => {
      let {
        formRef
      } = _ref12;
      return formRef.resetForm(resetOnlyThisForm);
    });
  }, []);
  const clearForm = React.useCallback(clearOnlyThisForm => {
    return valueRef.current.formRefArray.map(_ref13 => {
      let {
        formRef
      } = _ref13;
      return formRef.clearForm(clearOnlyThisForm);
    });
  }, []);
  const getSampleForm = React.useCallback(() => {
    if (!valueRef.current.formRefArray.length) return [];
    return valueRef.current.formRefArray.map(_ref14 => {
      let {
        formRef
      } = _ref14;
      return formRef.getSampleForm();
    });
  }, []);
  const validateForm = React.useCallback(props => {
    return valueRef.current.formRefArray.reduce((acc, _ref15) => {
      let {
        formRef
      } = _ref15;
      const form = formRef.validateForm(props);
      return {
        errorCount: acc.errorCount + form.errorCount,
        isError: acc.isError || form.isError,
        isValidatePassed: acc.isValidatePassed || form.isValidatePassed,
        totalErrorCount: acc.totalErrorCount + form.totalErrorCount,
        errors: acc.errors.concat([form.errors]),
        values: acc.values.concat([form.values])
      };
    }, {
      errors: [],
      values: [],
      errorCount: 0,
      totalErrorCount: 0,
      isError: false,
      isValidatePassed: false
    });
  }, []);
  formRef[IS_MULTIPLE].getValues = getValues;
  formRef[IS_MULTIPLE].getErrors = getErrors;
  formRef[IS_MULTIPLE].validateForm = validateForm;
  formRef[IS_MULTIPLE].resetForm = resetForm;
  formRef[IS_MULTIPLE].getSampleForm = getSampleForm;
  formRef[IS_MULTIPLE].getFormConfig = getFormConfig;
  formRef[IS_MULTIPLE].getFormRef = getFormRef;
  formRef[IS_MULTIPLE].setInitialFormData = setInitialFormData;
  formRef[IS_MULTIPLE].setFormErrors = setFormErrors;
  formRef[IS_MULTIPLE].clearForm = clearForm;
  formRef.getValues = getValues;
  formRef.getErrors = getErrors;
  formRef.formRefArray = formRefArray;
  formRef.setFormValues = setInitialFormData;
  formRef.setInitialFormData = setInitialFormData;
  formRef.setFormErrors = setFormErrors;
  formRef.getSampleForm = getSampleForm;
  formRef.validateForm = validateForm;
  formRef.getFormConfig = getFormConfig;
  formRef.getFormRef = getFormRef;
  formRef.resetForm = resetForm;
  formRef.clearForm = clearForm;
  formRef.count = formRefArray.length;
  formRef.setFormRefArray = setFormRefArray;
  formRef.values = getValues();
  formRef.errors = getErrors();
  const multiple = {
    append: function (targetFormId) {
      let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      let count = arguments.length > 2 ? arguments[2] : undefined;
      return onAddForm(value, targetFormId, count, true);
    },
    reset: onResetForm,
    clear: onClearForm,
    delete: onDeleteForm,
    clone: onCloneForm,
    swap: onSwapForm,
    move: onChangeOrderForm,
    insert: function (targetFormId) {
      let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      let count = arguments.length > 2 ? arguments[2] : undefined;
      return onAddForm(value, targetFormId, count);
    },
    prepend: function (targetFormId) {
      let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      let count = arguments.length > 2 ? arguments[2] : undefined;
      onAddForm(value, targetFormId, count);
    },
    formIds
  };
  formRef.formArrayProps = multiple;
  rootFormRef._formRef.__formRef__.values = rootFormRef._formRef.__formRef__.getValues();
  rootFormRef._formRef.__formRef__.errors = rootFormRef._formRef.__formRef__.getErrors();
  React.useEffect(() => () => {
    if (_ref.current.dontResetOnUnmount) {
      rootRef.current.dontResetOnUnmount = _ref.current.dontResetOnUnmount;
    }
  }, []);
  React.useEffect(() => {
    formRef._ref(IS_FORMREF)._is_form_initiated = true;
    formRef._renderForm();
    formRef.renderForm();
    return () => {
      if (!rootRef.current.dontResetOnUnmount) {
        formRef._ref(IS_FORMREF)._is_form_initiated = false;
        formRef._renderForm();
        formRef.renderForm();
      }
    };
  }, [formRef._formId_]);
  React.useEffect(() => {
    return () => {
      if (rootRef.current.dontResetOnUnmount) {
        if (!formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState) formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState = formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues;
        formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues = getValues();
      } else {
        formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues = formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState;
      }
      if (idRef.current.id) if (!rootRef.current.dontResetOnUnmount) {
        _thisFormRef.deleteFormConfig([idRef.current.id]);
        // _thisFormRef.renderForm();
      }
    };
  }, [_thisFormRef._formId_]);
  if (!formRef._ref(IS_FORMREF)._setRenderForm) formRef._ref(IS_FORMREF)._setRenderForm = ___formRef._setRenderForm;
  if (formRef && formRef._formId_) {
    if (formRef) {
      formRef._ref(IS_FORMREF)._setInputProps = props => {
        if (_thisFormRef._renderInputProps) _thisFormRef._renderInputProps();
        setRefresh({});
      };
    } else formRef._setInputProps = setRefresh;
  }
  const _multipleProps = {
    ref: formRef,
    ...formRef
  };
  const _formRefProps = (_index, _ref) => {
    const _props = {
      index: _index,
      length: formRefArray.length,
      append: function () {
        let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        let count = arguments.length > 1 ? arguments[1] : undefined;
        return onAddForm(value, formIds[_index], count, true);
      },
      reset: onResetForm.bind(null, formIds[_index]),
      clear: onClearForm.bind(null, formIds[_index]),
      delete: onDeleteForm.bind(null, formIds[_index]),
      remove: onDeleteForm.bind(null, formIds[_index]),
      clone: onCloneForm.bind(null, formIds[_index]),
      swap: onSwapForm.bind(null, formIds[_index]),
      validate: _ref.validateForm,
      move: targetFormId => onChangeOrderForm.bind(null, _index, targetFormId),
      insert: function (targetFormId) {
        let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        let count = arguments.length > 2 ? arguments[2] : undefined;
        return onAddForm(value, targetFormId, count);
      },
      prepend: function () {
        let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        let count = arguments.length > 1 ? arguments[1] : undefined;
        onAddForm(value, formIds[_index], count);
      }
    };
    if (ref && "current" in ref) {
      ref.current = ref.current || {};
      ref.current.formArray = formRefArray;
      ref.current.form = _props;
      ref.current.formId = formRef._formId_;
      ref.current.multiple = multiple;
    }
    return {
      ..._props,
      form: _props
    };
  };
  return /*#__PURE__*/React__default.createElement(FormContext.Provider, {
    value: {
      formId: _thisFormRef._formId_,
      setInputProps
    }
  }, /*#__PURE__*/React__default.createElement(FormRefContext.Provider, {
    value: {
      formRef,
      formId: formRef._formId_,
      lastUpdated: formRef._lastUpdated,
      renderForm,
      setRefresh: __setRefresh,
      rootFormRef: _rootFormRef || _formRef,
      _rootRef: rootRef
    }
  }, noAutoLoop ? typeof children === "function" ? children(formRefArray, _multipleProps) : children : formRefArray.map((_ref, _i) => typeof children === "function" ? children({
    ..._ref,
    ..._formRefProps(_i, _ref.formRef),
    index: _i
  }, _multipleProps, _i) : children)));
});

const FormController = _ref => {
  let {
    children,
    hide,
    render,
    inputConfig,
    ...rest
  } = _ref;
  return hide ? null : /*#__PURE__*/React__default.createElement(FormControllerContext.Provider, {
    value: {
      render,
      inputConfig,
      ...rest
    }
  }, children);
};

const emailRegex = /^([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,4})$/;
function validateEmail(email) {
  return emailRegex.test(String(email).toLowerCase());
}
function validate(value, fieldName) {
  let {
    optional: isOptional,
    minLength,
    isRequired,
    message = {},
    length,
    pattern,
    key
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if ((isOptional || !isRequired) && !value) return "";
  const IS_NO_VALUE = typeof value === "number" || typeof value === "boolean" ? false : !value;
  if (value && minLength && value.length < minLength) return message && typeof message.minLength !== "undefined" ? message.minLength : `Minimum ${minLength} characters is required`;
  if (value && length && value.length !== length) return message && message && typeof message.length !== "undefined" ? message.length : `Number should be ${length} digits long`;
  switch (fieldName) {
    case "password":
      {
        if (IS_NO_VALUE) {
          return message && typeof message.required !== "undefined" ? message.required : "This field is required";
        }
        return "";
      }
    case "email":
      {
        if (IS_NO_VALUE) return message && typeof message.required !== "undefined" ? message.required : "Please enter your email";
        if (value && !validateEmail(value)) return message && typeof message.invalid !== "undefined" ? message.invalid : "Invalid email address";
        return "";
      }
    case "name":
      {
        if (IS_NO_VALUE) return message && typeof message.required !== "undefined" ? message.required : "Please enter your name";
        // if (value && !validateEmail(value)) return 'Invalid email address';
        return "";
      }
    case "mobileNumber":
      {
        if (IS_NO_VALUE) return message && typeof message.required !== "undefined" ? message.required : "Please enter 10 digit mobile number";
        return "";
      }
    case "about":
      {
        if (IS_NO_VALUE) return message && typeof message.required !== "undefined" ? message.required : "This field is required";
        // if (value && !validateEmail(value)) return 'Invalid email address';
        return "";
      }
    default:
      if (IS_NO_VALUE) {
        return message && typeof message.required !== "undefined" ? message.required : "This field is required";
      }
      if (pattern) {
        if (Object.prototype.toString.call(pattern) === "[object RegExp]") {
          if (pattern.test(value)) return "";
          return message && typeof message.pattern !== "undefined" ? message.regex : `${key} is invalid `;
        }
      }
      return "";
  }
}

const formValidationHandler = function () {
  let {
    ON_CHANGE_KEY: _ON_CHANGE_KEY,
    ON_BLUR_KEY: _ON_BLUR_KEY,
    VALUE_KEY: _VALUE_KEY,
    ERROR_KEY: _ERROR_KEY,
    VALIDATOR: _VALIDATOR
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let _formIds = [];
  let _formRefs = {};
  const _formValidationHandler = function () {
    let {
      VALIDATOR: Validate = _VALIDATOR || validate,
      initialState: initialValues = {},
      getFormData: onFormChangeCallback,
      renderFormCallback = onFormChangeCallback,
      FORM_CONFIG: _FORM_CONFIG = {},
      ON_CHANGE_KEY = _ON_CHANGE_KEY || ON_CHANGE,
      ON_BLUR_KEY = _ON_BLUR_KEY || ON_BLUR,
      VALUE_KEY = _VALUE_KEY || VALUE,
      ERROR_KEY = _ERROR_KEY || ERROR,
      [IS_MULTIPLE]: _isMultiple,
      _formRef,
      _objKey = "",
      _schemaKey,
      _initialErrors = {},
      ref,
      _rootRef,
      _parentRef,
      _parentConfig,
      _parentId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    function FormRef() {}
    const formRef = {
      current: new FormRef()
    };
    FormRef.prototype.is_validate_form_triggered = false;
    FormRef.prototype._schema = {};
    FormRef.prototype._formRef = {};
    FormRef.prototype._formIds = [];
    const __formRef = _formRef || formRef;
    const deleteId = _deleteId => {
      deleteUniqueId(_deleteId);
      delete _formRefs[_deleteId];
      const _ids = __formRef.current._formIds.filter(_id => _id !== _deleteId);
      __formRef.current._formIds = _ids;
      _formIds = _ids;
    };
    let FORM_CONFIG = _deepCopy(_FORM_CONFIG);

    /** Initial schema config - start */
    let _isSchema_or_isMultiple_config_is_root;
    if (!_schemaKey) {
      if (FORM_CONFIG[IS_MULTIPLE]) {
        FORM_CONFIG = {
          [IS_MULTIPLE]: FORM_CONFIG
        };
        _isSchema_or_isMultiple_config_is_root = IS_MULTIPLE;
      } else if (FORM_CONFIG[IS_SCHEMA]) {
        FORM_CONFIG = {
          [IS_SCHEMA]: FORM_CONFIG
        };
        _isSchema_or_isMultiple_config_is_root = IS_SCHEMA;
      }
    }
    /** Initial schema config - end */

    FormRef.prototype._formConfig = _deepCopy(FORM_CONFIG);
    const _isMultipleForm = _isMultiple || _isSchema_or_isMultiple_config_is_root === IS_MULTIPLE;
    FormRef.prototype._isMultipleForm = _isMultipleForm;
    if (_isSchema_or_isMultiple_config_is_root) {
      /* formRef */
      FormRef.prototype._isSchema_or_isMultiple_config_is_root = _isSchema_or_isMultiple_config_is_root;
    }
    FormRef.prototype[IS_MULTIPLE] = {
      _initialValues: _isMultipleForm && Array.isArray(initialValues) ? initialValues.slice() : []
    };
    FormRef.prototype._schema = formRef.current._schema;
    const getOriginalFormObject = _obj => _isSchema_or_isMultiple_config_is_root ? _obj[_isSchema_or_isMultiple_config_is_root] : _obj;
    const initialConfig = {
      initialValues: Array.isArray(initialValues) ? initialValues.slice() : newObject(initialValues),
      Validate,
      getFormData: onFormChangeCallback,
      renderFormCallback,
      FORM_CONFIG,
      ON_CHANGE_KEY,
      ON_BLUR_KEY,
      VALUE_KEY,
      ERROR_KEY
    };
    FormRef.prototype._initialFormConfig = _deepCopy(initialConfig.FORM_CONFIG);
    FormRef.prototype._initialConfig = _deepCopy(initialConfig);
    const formId = generateUniqueId();
    _formRefs[formId] = formRef.current;
    _formIds.push(formId);
    __formRef.current._formIds.push(formId);
    let formConfig = initialConfig.FORM_CONFIG;
    const _initiateSchema = function (_formConfig) {
      let _values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let _errors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      let _keys = arguments.length > 3 ? arguments[3] : undefined;
      const __formConfig = _formConfig || formConfig;
      if (_isMultiple && _formConfig[IS_MULTIPLE]) {
        FormRef.prototype._multipleConfig = newObject(_formConfig);
        return;
      }
      Object.entries(__formConfig).forEach(_ref2 => {
        let [key, val] = _ref2;
        if (_keys && !_keys.includes(key)) return;
        if (!__formRef.current._formRef.__formRef__) __formRef.current._formRef.__formRef__ = formRef.current;
        const ___objKey = `${_objKey ? `${_objKey}_` : ""}${key}`;
        if ((val[IS_SCHEMA] || val[IS_MULTIPLE]) && val[SCHEMA_CONFIG] || val._formId_) {
          if (val[SCHEMA_CONFIG]) val[SCHEMA_CONFIG] = newObject(val[SCHEMA_CONFIG]);else if (val._formId_) {
            val._initialConfig = newObject(val._initialConfig);
            val._initialFormConfig = newObject(val._initialFormConfig);
          }
          const _id = formRef.current._schema[key] && formRef.current._schema[key].formRef._formId_;
          if (_id) deleteId(_id);
          const _ref = _formValidationHandler({
            ...(val._formId_ ? val._initialConfig : initialConfig),
            FORM_CONFIG: val._formId_ ? val._initialFormConfig : formRef.current._schema[key] && formRef.current._schema[key].formRef.getFormConfig() || val[SCHEMA_CONFIG],
            ref,
            initialState: _values[key] || initialValues[key],
            _formRef: __formRef,
            _objKey: ___objKey,
            _parentRef: formRef.current,
            _schemaKey: key,
            _parentConfig: __formConfig,
            _parentId: key,
            _initialErrors: _errors[key] || _initialErrors[key],
            [IS_MULTIPLE]: val[IS_MULTIPLE]
          });
          formRef.current._hasChildRef = true;
          formRef.current._schema[key] = _ref;
          __formRef.current._formRef[___objKey] = _ref;
          // formRef.current._formRef = getOriginalFormRef(
          //   __formRef.current._formRef
          // );
        } else if (_keys) {
          values[key] = formRef.current._resetValue(key);
        }
      });
    };
    _initiateSchema(formConfig, initialValues, _initialErrors);
    const _resetValue = isClear => key => {
      const config = formConfig[key] || {};
      return isClear ? "default" in config ? config.default : "" : key in initialValues ? typeof initialValues[key] === "function" ? initialValues[key]() : initialValues[key] : "default" in config ? config.default : "";
    };
    FormRef.prototype._resetValue = _resetValue(false);
    FormRef.prototype._clearValue = _resetValue(true);
    let values = _setInitialValues({
      formConfig,
      initialValues,
      formRef,
      isMultiple: _isMultiple
    });
    let errors = _setInitialErrors({
      formConfig,
      initialValues: _initialErrors,
      formRef,
      isMultiple: _isMultiple
    });
    FormRef.prototype.formConfig = formConfig;
    const _onFormChangeCallback = dontRender => {
      if (__formRef.current.getValues) {
        formRef.current.values = formRef.current.getValues();
        formRef.current.errors = formRef.current.getErrors();
        FormRef.prototype.formConfig = formRef.current.getFormConfig();
        const _values = __formRef.current.getValues();
        const _errors = __formRef.current.getErrors();
        const _formConfig = __formRef.current.getFormConfig();
        __formRef.current.values = _values;
        __formRef.current.errors = _errors;
        __formRef.current._ref(IS_FORMREF).formConfig = _formConfig;
        if (ref && "current" in ref) {
          ref.current = ref.current || {};
          ref.current.values = _values;
          ref.current.errors = _errors;
          ref.current.sampleFormObject = getSampleForm();
        }
      }
      if (typeOf(onFormChangeCallback) === TYPE_FUNCTION$1 && !dontRender) {
        // setTimeout(() => {
        const ___formRef = _rootRef || __formRef;
        if (___formRef.current.getValues) {
          const _data = {
            values: ___formRef.current.getValues(),
            errors: ___formRef.current.getErrors(),
            formConfig: ___formRef.current.getFormConfig()
          };
          if (!isEqual(_data, __formRef.current.oldData)) {
            __formRef.current.oldData = _data;
            onFormChangeCallback(_data);
          }
        }
        // });
      }
    };

    const _resetSchema = _config => {
      (Array.isArray(_config) ? _config : Object.keys(_config)).reduce((acc, key) => {
        const _formRef = formRef.current._schema[key] && formRef.current._schema[key].formRef;
        const _id = _formRef && _formRef._formId_;
        if (_id) deleteId(_id);
        delete formRef.current._schema[key];
        delete formRef.current._schema[key];
        return {
          ...acc,
          [key]: {}
        };
      }, {});
    };
    const _resetFormRef = _config => {
      (Array.isArray(_config) ? _config : Object.keys(_config)).forEach(key => {
        const ___objKey = `${_objKey ? `${_objKey}_` : ""}${key}`;
        delete formRef.current._formRef[___objKey];
        // delete formRef.current._formRef[___objKey];
      });
    };

    const setFormConfig = function (_formConfig, _newConfigKeys) {
      let initiateSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      const __formConfig = _deepCopy(_formConfig);
      FormRef.prototype._initialFormConfig = _deepCopy(_formConfig);
      FormRef.prototype._formConfig = __formConfig;
      FormRef.prototype.formConfig = __formConfig;
      const _values = formRef.current.getValues();
      const _errors = formRef.current.getErrors();
      FormRef.prototype.formConfig = _checkType(_formConfig, formRef.current.formConfig);
      formConfig = __formConfig;
      const _lastUpdated = Math.floor(Math.random() * generateTimeStamp());
      formRef.current.lastUpdated = _lastUpdated;
      if (initiateSchema) {
        _resetSchema(_newConfigKeys);
        _resetFormRef(_newConfigKeys);
        _initiateSchema(_formConfig, newObject(_values), newObject(_errors), _newConfigKeys);
        _onFormChangeCallback(!initiateSchema);
        if (typeOf(formRef.current._setInputProps) === TYPE_FUNCTION$1) formRef.current._setInputProps(formRef.current.getInputProps(formRef.current._extraProps || __formRef.current._extraProps));
      }
      return formRef.current;
    };
    const setValues = (_values, dontSetInputProps) => {
      formRef.current.values = _checkType(_values, formRef.current.values);
      values = _checkType(_values, values);
      // setTimeout(() => {
      //   if (
      //     typeOf(formRef.current._setInputProps) === TYPE_FUNCTION &&
      //     !dontSetInputProps
      //   )
      //     formRef.current._setInputProps(
      //       formRef.current.getInputProps(
      //         formRef.current._extraProps || __formRef.current._extraProps
      //       )
      //     );
      // });
    };

    const setErrors = (_errors, dontSetInputProps) => {
      formRef.current.errors = _checkType(_errors, formRef.current.errors);
      errors = formRef.current.errors;
      _onFormChangeCallback();
      if (typeOf(formRef.current._setInputProps) === TYPE_FUNCTION$1 && !dontSetInputProps) formRef.current._setInputProps(formRef.current.getInputProps(formRef.current._extraProps || __formRef.current._extraProps));
    };
    const validateValue = function (__value, key, isSetValue, isSetError, _config) {
      let isTrim = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      let dontRender = arguments.length > 6 ? arguments[6] : undefined;
      const config = _config || formRef.current.formConfig[key] || {};
      let {
        value,
        error: validatorError
      } = config.validator ? config.validator(__value, {
        formRef: formRef.current,
        values,
        errors
      }, config._config, config._commonInputProps) : {
        value: __value
      };
      let error = null;
      if ((typeof config.validate === "boolean" ? config.validate : true) && config._initiated && (typeof config.isValidateOnChange === "boolean" ? config.isValidateOnChange : true)) {
        error = validatorError;
        if ((config.trim !== undefined ? config.trim : config.trim || isTrim) || config.type === "number" || config.allowOnlyNumber || config.allowValidNumber) value = _trimStrings(value, config.isNumber);
        if (config.type === "number") {
          if (Number.isNaN(+value) && value !== "") return {
            error,
            value: values[key],
            key
          };
        } else if (config.allowOnlyNumber) {
          if (Number.isNaN(+value) && value !== "") {
            error = error || ((config.message && config.message.allowOnlyNumber) !== undefined ? config.message && config.message.allowOnlyNumber : "Only numbers are allowed");
          }
        }
        if (value !== "" && ["string", "number"].includes(typeof value) && Number.isNaN(+value) && !(config.allowValidNumber ? !!+value : true)) {
          error = error || ((config.message && config.message.allowValidNumber) !== undefined ? config.message && config.message.allowValidNumber : "Please enter valid number");
        }
        if (config.maxLength && (value || "").length > config.maxLength) {
          error = error || (typeof (config.message && config.message.maxLength) !== "undefined" ? config.message.maxLength : `maximum ${config.maxLength} characters are allowed`);
          // value = value.slice(0, config.maxLength);
        }

        error = error || Validate(value, config.type, {
          key,
          optional: config.optional,
          minLength: config.minLength,
          message: config.message,
          maxLength: config.maxLength,
          length: config.length,
          ...config
        });
        if (value && config.match && typeof config.match === "string" && values[config.match]) error = error || (values[config.match] !== value ? typeof (config.message && config.message.match) !== "undefined" ? config.message.match : `${key} not matching with ${config.match}` : null);
        if (config.allowOnlyNumber || config.min || config.max) if (!Number.isNaN(+value) && value !== "") {
          if (value && (config.min || config.max)) if (+value < config.min) {
            error = error || ((config.message && config.message.min) !== undefined ? config.message && config.message.min : `Minimum value ${config.min} is required`);
          } else if (+value > config.max) {
            error = error || ((config.message && config.message.max) !== undefined ? config.message && config.message.max : `Maximum value ${config.max} is allowed`);
          }
        }
      }
      if (typeof config.callback === "function") {
        const response = config.callback({
          error,
          value,
          key,
          formRef: formRef.current,
          values,
          errors,
          is_validation_allowed: typeof config.validate === "boolean" ? config.validate : true
        }, formRef.current.formConfig[key]._config, formRef.current.formConfig[key]._commonInputProps);
        if (typeOf(response) === TYPE_OBJECT$1) {
          if (response.value !== undefined) value = response.value;
          if (response.error !== undefined) error = response.error;
        }
      }
      if (isSetValue) setValues({
        ...values,
        [key]: value
      });
      if (isSetError) {
        setErrors({
          ...errors,
          [key]: error || null
        }, dontRender);
      }
      return {
        error,
        value,
        key
      };
    };
    const onChangeValues = function () {
      let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let key = arguments.length > 1 ? arguments[1] : undefined;
      let {
        value: _value,
        isStopPropagation,
        isValidateOnly,
        config,
        isSetError = true,
        trim,
        dontRender
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // formRef.current.isFormChanged = true;
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (e && isStopPropagation && typeof e.stopPropagation === "function") e.stopPropagation();
      let value = _value !== undefined ? _value : _getPlatformBasedFieldValue(e);
      const _key = _getPlatformBasedFieldName(e);
      const KEY = key || _key;
      if (isValidateOnly || !KEY) return validateValue(value, KEY, null, null, config, trim, dontRender);
      validateValue(value, KEY, true, isSetError, undefined, trim, dontRender);
    };
    const onValidateValues = _ref3 => {
      let {
        value,
        isValue,
        key,
        isValidateOnly,
        config,
        trim
      } = _ref3;
      return onChangeValues(value, key, {
        value: isValue ? value : undefined,
        isValidateOnly,
        config,
        trim
      });
    };
    const onBlurValues = function (e, key) {
      let config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      const _key = _getPlatformBasedFieldName(e);
      const KEY = key || _key;
      const value = values[KEY];
      if (config.isValidateOnBlur === undefined ? true : config.isValidateOnBlur) validateValue(value, KEY, false, true);
    };
    const validateThisForm = function () {
      let {
        isSetError = true
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      formRef.current.is_validate_form_triggered = true;
      const _values = formRef.current.getValues();
      const _errors = errors;
      const isError = [];
      for (const [key, val] of Object.entries(formConfig)) {
        if (val[IS_SCHEMA] || val[IS_MULTIPLE] || val._formId_) continue;
        const {
          error: _error
        } = validateValue(_values[key], key, false, false, val, true);
        _errors[key] = _error;
        if (_error) isError.push(null);
        if (isSetError) {
          setErrors(_errors);
        }
      }
      // if (isSetError) setFormErrors(_errors);
      formRef.current.is_validate_form_triggered = false;
      return {
        values: PRIMITIVE_VALUE in _values ? _values[PRIMITIVE_VALUE] : _values,
        errors: PRIMITIVE_VALUE in _errors ? _errors[PRIMITIVE_VALUE] : _errors,
        totalErrorCount: isError.length,
        errorCount: isError.length,
        isError: isError.length > 0,
        isValidatePassed: isError.length === 0
      };
    };
    const validateForm = props => {
      let obj = formRef.current.validateThisForm(props);
      obj = Object.entries(formRef.current._schema).reduce((acc, _ref4) => {
        let [key, val] = _ref4;
        if (val.formRef._isMultipleForm && !val.formRef[IS_MULTIPLE].validateForm) return acc;
        let obj2 = val.formRef[IS_MULTIPLE].validateForm ? val.formRef[IS_MULTIPLE].validateForm(props) : val.formRef.validateForm(props);
        return {
          errorCount: acc.errorCount + obj2.errorCount,
          isError: acc.isError || obj2.isError,
          isValidatePassed: acc.isValidatePassed || obj2.isValidatePassed,
          totalErrorCount: acc.totalErrorCount + obj2.totalErrorCount,
          errors: newObject(acc.errors, {
            [key]: obj2.errors
          }),
          values: newObject(acc.values, {
            [key]: obj2.values
          })
        };
      }, obj);
      obj.values = getOriginalFormObject(obj.values);
      obj.errors = getOriginalFormObject(obj.errors);
      return obj;
    };
    const validateCustomForm = _ref5 => {
      let {
        isSetError,
        formConfig: form_config = {},
        values: __values = {},
        errors: __errors = {}
      } = _ref5;
      const _FORM_CONFIG = form_config;
      const _values = __values;
      const _errors = __errors;
      const isError = [];
      for (const key of Object.keys(_FORM_CONFIG)) {
        const {
          error: _error
        } = validateValue(_values[key], key, false, false, _FORM_CONFIG[key]);
        _errors[key] = _error;
        if (_error) isError.push(null);
      }
      if (isSetError) setErrors(_errors);
      return {
        values: _values,
        errors: _errors,
        totalErrorCount: isError.length,
        errorCount: isError.length,
        isError: isError.length > 0,
        isValidatePassed: isError.length === 0
      };
    };
    const onValidateCustomObject = (value, config) => validateForm({
      isSetError: false,
      values: value,
      formConfig: config,
      isNewFormConfig: true,
      isResetValue: true,
      isResetError: true
    });
    const onAddFormConfig = isReset => config => {
      const _config = typeof config === "function" ? config(formRef.current.getFormConfig()) : config;
      const _configKeys = Object.keys(config);
      if (isReset) {
        return setFormConfig(newObject(_config), _configKeys);
      } else {
        // Object.assign(formConfig, _config);
        return setFormConfig({
          ...formRef.current.getFormConfig(),
          ..._config
        }, _configKeys);
      }
    };
    const onDeleteFormConfig = keys => {
      const _formConfig = {
        ...formConfig
      };
      if (Array.isArray(keys)) {
        keys.forEach(_key => {
          if (typeOf(_key) === TYPE_STRING$1) delete _formConfig[_key];
        });
        setFormConfig(_formConfig, keys);
      }
    };
    const resetFormInput = function () {
      let clearKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let isDeleteKey = arguments.length > 1 ? arguments[1] : undefined;
      const _values = {
        ...values
      };
      const _errors = {
        ...errors
      };
      clearKeys.forEach(_key => {
        if (isDeleteKey && !(_key in initialValues)) {
          delete _values[_key];
          delete _errors[_key];
        } else {
          _values[_key] = formRef.current._resetValue(_key);
          _errors[_key] = null;
        }
      });
      setValues(_values);
      setErrors(_errors);
    };
    const validateFields = function () {
      let formFields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let config = arguments.length > 1 ? arguments[1] : undefined;
      formFields.forEach(_key => {
        if (values[_key]) {
          onChangeValues(values[_key], _key, config);
        }
      });
    };
    const commonInputProps = function (key) {
      let {
        config,
        propKeyMap: {
          onChange = ON_CHANGE_KEY,
          onBlur = ON_BLUR_KEY,
          value = VALUE_KEY,
          error = ERROR_KEY
        } = {},
        ...rest
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const INITIAL_FORM_CONFIG = formRef.current.formConfig[key];
      const initialConfig = newObject(INITIAL_FORM_CONFIG._commonInputProps && INITIAL_FORM_CONFIG._commonInputProps._defaultConfig || INITIAL_FORM_CONFIG);
      if (INITIAL_FORM_CONFIG) {
        INITIAL_FORM_CONFIG._config = {
          config,
          formId,
          key,
          keyName: key,
          lastUpdated: formRef.current.lastUpdated,
          ...rest
        };
        if (INITIAL_FORM_CONFIG._config.config === undefined) delete INITIAL_FORM_CONFIG._config.config;
      }
      let _commonInputProps = {
        [onChange]: e => {
          onChangeValues(e, key, config);
          const _validateFieldsOnChange = INITIAL_FORM_CONFIG && INITIAL_FORM_CONFIG.validateFieldsOnChange;
          if (_validateFieldsOnChange && _validateFieldsOnChange.length > 0) {
            validateFields(_validateFieldsOnChange, INITIAL_FORM_CONFIG._config);
          }
          if (INITIAL_FORM_CONFIG.render) formRef.current.renderForm();
        },
        [onBlur]: e => onBlurValues(e, key, INITIAL_FORM_CONFIG),
        [value]: values[key],
        [error]: errors[key]
      };
      _commonInputProps = {
        ..._commonInputProps,
        ...(INITIAL_FORM_CONFIG && (typeof INITIAL_FORM_CONFIG.inputProps === "function" ? INITIAL_FORM_CONFIG.inputProps(formRef.current, INITIAL_FORM_CONFIG._config, {
          onChange: _commonInputProps[onChange],
          onBlur: _commonInputProps[onBlur],
          value: _commonInputProps[value],
          error: _commonInputProps[error],
          key
        }) : INITIAL_FORM_CONFIG.inputProps) || {})
      };
      _commonInputProps.inputProps = {
        ..._commonInputProps
      };
      _commonInputProps._fieldConfig = INITIAL_FORM_CONFIG;
      _commonInputProps._config = {
        ...formRef.current.formConfig[key]
      };
      _commonInputProps[IS_SCHEMA] = {
        validateField: e => {
          onChangeValues(e, key, {
            ...config,
            dontRender: true
          });
          const _validateFieldsOnChange = config && config.validateFieldsOnChange || INITIAL_FORM_CONFIG && INITIAL_FORM_CONFIG.validateFieldsOnChange;
          if (_validateFieldsOnChange && _validateFieldsOnChange.length > 0) {
            validateFields(_validateFieldsOnChange, {
              ...INITIAL_FORM_CONFIG._config,
              dontRender: true
            });
          }
        }
      };
      _commonInputProps._defaultConfig = initialConfig;
      // delete _commonInputProps._config.inputProps;
      // delete _commonInputProps._config._commonInputProps;

      if (INITIAL_FORM_CONFIG) {
        INITIAL_FORM_CONFIG._commonInputProps = {
          ..._commonInputProps
        };
      }
      return _commonInputProps;
    };
    const setInitialFormData = (value, isResetValue) => {
      const _value = value || {};
      const _values = Object.entries(formRef.current.formConfig).reduce((acc, _ref6) => {
        let [key, val] = _ref6;
        if (val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]) {
          formRef.current._schema[key].formRef.setInitialFormData(_value[key] || (val[IS_MULTIPLE] ? [] : {}), isResetValue);
          return acc;
        }
        return newObject(acc, {
          [key]: key in _value ? _value[key] : isResetValue ? formRef.current._resetValue(key) : formRef.current.getValues()[key]
        });
      }, {});
      setValues(_values);
    };
    const setFormErrors = (error, isResetError) => {
      const _errors = Object.entries(formRef.current.formConfig).reduce((acc, _ref7) => {
        let [key, val] = _ref7;
        if (val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]) {
          formRef.current._schema[key].formRef.setFormErrors(error && error[key] || {}, isResetError);
          return acc;
        }
        return newObject(acc, {
          [key]: key in error || isResetError ? error[key] || null : errors[key]
        });
      }, {});
      setErrors(_errors);
    };
    const resetForm = isClear => resetOnlyThisForm => {
      const _values = Object.entries(formConfig || {}).reduce((acc, _ref8) => {
        let [key, val = {}] = _ref8;
        const method = isClear ? "clearForm" : "resetForm";
        return newObject(acc, val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE] ? resetOnlyThisForm ? {} : {
          [key]: val[IS_MULTIPLE] ? (() => {
            const _data = formRef.current._schema[key].formRef[method]();
            return Array.isArray(_data) ? _data : [];
          })() : formRef.current._schema[key].formRef[method]()
        } : {
          [key]: isClear ? formRef.current._clearValue(key) : formRef.current._resetValue(key)
        });
      }, values);
      formRef.current.setFormValues(newObject(_values), true);
      formRef.current.setFormErrors({}, true);
      return _values;
    };

    // const getResponseValues = (_response) => {
    //   const _dontConvertKeysToObject =
    //     typeOf(_response) === TYPE_BOOLEAN && !_response;

    //   if (typeOf(_response) === TYPE_OBJECT) {
    //     return Object.entries(formRef.current.formConfig).reduce(
    //       (acc, [_key, _config = {}]) => ({
    //         ...acc,
    //         [_key]: Safe(_response, `.${_config.key || _key}`),
    //       }),
    //       {}
    //     );
    //   }
    //   let _value = values[_key];
    //   _value =
    //     typeof _config.payloadCallback === "function"
    //       ? _config.payloadCallback(_value)
    //       : _config.isAllowEmpty
    //       ? _value
    //       : _value || undefined;

    //   if (_dontConvertKeysToObject)
    //     return Object.entries(formRef.current.formConfig).reduce(
    //       (acc, [_key, _config = {}]) => ({
    //         ...acc,
    //         [_config.key || _key]: _value,
    //       }),
    //       {}
    //     );

    //   return Object.entries(formRef.current.formConfig).reduce(
    //     (acc, [_key, _config = {}]) =>
    //       updateIn(acc, (_config.key || _key).split("."), () => _value),
    //     {}
    //   );
    // };

    // const setResponseErrors = (_errors) => {
    //   const _keyErrors = Object.entries(formRef.current.formConfig).reduce(
    //     (acc, [_key, _config = {}]) => ({
    //       ...acc,
    //       [_key]: Safe(_errors, `.${_config.key || _key}`),
    //     }),
    //     {}
    //   );
    //   setErrors(_keyErrors);
    // };

    const _getInputProps = () => getInputProps(formRef.current._extraProps || __formRef.current._extraProps);
    const getInputProps = function () {
      let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.entries(formRef.current.formConfig).reduce((prev, _ref9) => {
        let [key, val] = _ref9;
        return val[IS_SCHEMA] || val._formId_ ? prev : {
          ...prev,
          [key]: commonInputProps(key, extraProps)
        };
      }, {
        [IS_SCHEMA]: {
          addFormConfig: formRef.current.modifyFormConfig,
          deleteFormConfig: formRef.current.deleteFormConfig,
          getInputProps: _getInputProps,
          onFormChangeCallback: _onFormChangeCallback,
          resetFormInput: formRef.current.resetFormInput
        }
      });
    };
    const setValidate = function () {
      let _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let __config = {
        ...formConfig
      };
      let __errors = {
        ...errors
      };
      Object.entries(_config).forEach(_ref10 => {
        let [_key, _value] = _ref10;
        __config[_key].validate = _value;
        if (!_value) __errors[_key] = null;
      });
      setFormConfig(__config, Object.keys(_config));
      setErrors(__errors);
    };
    const setOptional = function () {
      let _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let __config = {
        ...formConfig
      };
      let __errors = {
        ...errors
      };
      Object.entries(_config).forEach(_ref11 => {
        let [_key, _value] = _ref11;
        __config[_key].optional = _value;
        __config[_key].isRequired = false;
        __errors[_key] = null;
      });
      setFormConfig(__config, Object.keys(_config));
      setErrors(__errors);
      validateFields(Object.keys(_config));
    };
    const setRequired = function () {
      let _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let __config = {
        ...formConfig
      };
      let __errors = {
        ...errors
      };
      Object.entries(_config).forEach(_ref12 => {
        let [_key, _value] = _ref12;
        __config[_key].isRequired = _value;
        __config[_key].optional = false;
        __errors[_key] = null;
      });
      setFormConfig(__config, Object.keys(_config));
      setErrors(__errors);
      validateFields(Object.keys(_config));
    };

    // const renderForm = ((_config = {}) => {
    //   _setValues(values);
    //   _setErrors(errors);
    //   _setFormConfig(formRef.current.formConfig);
    // });

    const getValues = () => {
      return getOriginalFormObject(Object.entries(formRef.current.getFormConfig()).reduce((acc, _ref13) => {
        let [key, val] = _ref13;
        const _isSchema = val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];
        if ((!_isSchema && !val._initiated || _isSchema && !(formRef.current._schema[key] && formRef.current._schema[key].formRef._is_form_initiated)) && !_isSchema_or_isMultiple_config_is_root) return acc;
        if (!_isSchema && !val._initiated) return acc;
        let _value = val[IS_MULTIPLE] ? errors[key] : formRef.current._schema[key] && formRef.current._schema[key].formRef.getValues();
        const getValues = formRef.current._schema[key] && formRef.current._schema[key].formRef[IS_MULTIPLE].getValues;
        if (typeof getValues === "function") _value = getValues();
        _value = val[IS_MULTIPLE] ? Array.isArray(_value) ? _value : [] : _value;
        return {
          ...acc,
          [key]: _isSchema ? _value : values[key] === undefined ? "default" in val ? val.default : "" : values[key]
        };
      }, {}));
    };
    const getErrors = () => getOriginalFormObject(Object.entries(formConfig).reduce((acc, _ref14) => {
      let [key, val] = _ref14;
      const _isSchema = val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];
      if ((!_isSchema && !val._initiated || _isSchema && !(formRef.current._schema[key] && formRef.current._schema[key].formRef._is_form_initiated)) && !_isSchema_or_isMultiple_config_is_root) return acc;
      let _error = val[IS_MULTIPLE] ? errors[key] : formRef.current._schema[key] && formRef.current._schema[key].formRef.getErrors();
      const getErrors = formRef.current._schema[key] && formRef.current._schema[key].formRef[IS_MULTIPLE].getErrors;
      if (typeof getErrors === "function") _error = getErrors();
      return {
        ...acc,
        [key]: _isSchema ? val[IS_MULTIPLE] ? Array.isArray(_error) ? _error : [_error] : _error : errors[key] || null
      };
    }, {}));
    const getFormConfig = () => newObject(getOriginalFormObject(Object.entries(formConfig).reduce((acc, _ref15) => {
      let [key, val] = _ref15;
      const _isSchema = val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];
      if (_isSchema) {
        let _getFormConfig = formRef.current._schema[key] && formRef.current._schema[key].formRef.getFormConfig;
        if (typeof _getFormConfig === "function") {
          return {
            ...acc,
            [key]: {
              ...val,
              [SCHEMA_CONFIG]: val[IS_MULTIPLE] ? formRef.current._schema[key] && formRef.current._schema[key].formRef[IS_MULTIPLE].getFormConfig && formRef.current._schema[key].formRef[IS_MULTIPLE].getFormConfig() || _getFormConfig() : _getFormConfig()
            }
          };
        }
        return acc;
      }
      return {
        ...acc,
        [key]: val
      };
    }, {})));
    const getSchema = () => newObject(getOriginalFormObject(Object.entries(formConfig).reduce((acc, _ref16) => {
      let [key, val] = _ref16;
      const _isSchema = val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];
      if (_isSchema) {
        let _getSchema = formRef.current._schema[key] && formRef.current._schema[key].formRef.getSchema;
        if (typeof _getSchema === "function") {
          return {
            ...acc,
            [key]: {
              ...val,
              [SCHEMA_CONFIG]: _getSchema()
            }
          };
        }
        return acc;
      }
      return {
        ...acc,
        [key]: val
      };
    }, {})));
    const getSampleForm = () => getOriginalFormObject(Object.entries(formConfig).reduce((acc, _ref17) => {
      let [key, val] = _ref17;
      let _value;
      if (val[IS_MULTIPLE]) _value = formRef.current._schema[key] && formRef.current._schema[key].formRef[IS_MULTIPLE].getSampleForm && formRef.current._schema[key].formRef[IS_MULTIPLE].getSampleForm();else _value = formRef.current._schema[key] && formRef.current._schema[key].formRef.getSampleForm();
      return {
        ...acc,
        [key]: val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE] ? val[IS_MULTIPLE] ? Array.isArray(_value) ? _value : [_value] : _value : val.default
      };
    }, {}));
    const renderForm = () => {
      if (typeOf(renderFormCallback) === TYPE_FUNCTION$1 && (_rootRef || __formRef).current.getValues) {
        const _data = {
          values: (_rootRef || __formRef).current.getValues(),
          errors: (_rootRef || __formRef).current.getErrors(),
          formConfig: (_rootRef || __formRef).current.getFormConfig()
        };
        renderFormCallback(_data);
      }
    };
    const getFormRef = keys => {
      if (keys && keys.length > 0 && typeOf(keys) === TYPE_ARRAY$1) {
        const _formRef = formRef.current._formRef[keys.join("_")];
        if (_formRef) return _formRef.formRef;else return null;
      } else if (!keys) return formRef.current._formRef.__formRef__;
      return null;
    };
    const getFormRefById = formId => {
      if (_formRefs[formId]) return _formRefs[formId];
      return null;
    };
    const onUnMountForm = () => {
      __formRef.current._formIds.forEach(_id => {
        deleteId(_id);
        deleteUniqueId(_id);
      });
    };
    const resetValues = keys => {
      const _values = {
        ...values
      };
      const _errors = {
        ...errors
      };
      (keys || []).forEach(_key => {
        const _config = formConfig[_key];
        if ((_config[IS_SCHEMA] || _config[IS_MULTIPLE]) && _config[SCHEMA_CONFIG]) _values[_key] = formRef.current._schema[_key].formRef.resetForm();else {
          _values[_key] = formRef.current._resetValue(_key);
          _errors[_key] = null;
        }
      });
      setValues(_values);
      setErrors(_errors);
    };
    const clearValues = keys => {
      const _values = {
        ...values
      };
      const _errors = {
        ...errors
      };
      (keys || []).forEach(_key => {
        const _config = formConfig[_key];
        if ((_config[IS_SCHEMA] || _config[IS_MULTIPLE]) && _config[SCHEMA_CONFIG]) {
          _values[_key] = formRef.current._schema[_key].formRef.clearForm();
        } else {
          _values[_key] = formRef.current._clearValue(_key);
          _errors[_key] = null;
        }
      });
      setValues(_values);
      setErrors(_errors);
    };

    /* formRef - start */
    formRef.current.getValues = getValues;
    formRef.current.getErrors = getErrors;
    formRef.current.setFormValues = setInitialFormData;
    formRef.current.setFormErrors = setFormErrors;
    formRef.current.getSampleForm = getSampleForm;
    formRef.current.validateForm = validateForm;
    formRef.current.resetForm = resetForm(false);
    formRef.current.clearForm = resetForm(true);
    if (!formRef.current._isMultipleForm) {
      formRef.current.setValidate = setValidate;
      formRef.current.setOptional = setOptional;
      formRef.current.setRequired = setRequired;
      formRef.current.setOptional = setOptional;
      formRef.current.setRequired = setRequired;
      formRef.current.resetValues = resetValues;
      formRef.current.clearValues = clearValues;
      formRef.current.deleteFormConfig = onDeleteFormConfig;
      formRef.current.modifyFormConfig = onAddFormConfig(false);
      formRef.current.resetFormConfig = onAddFormConfig(true);
    }
    formRef.current.renderForm = renderForm;
    formRef.current.getFormRef = getFormRef;
    formRef.current.getFormRefById = getFormRefById;
    formRef.current._isRootRef = !_formRef;
    if (_parentRef) FormRef.prototype._parentRef = _parentRef;
    if (_parentConfig) FormRef.prototype._parentConfig = _parentConfig;
    if (_parentId) FormRef.prototype._parentId = _parentId;
    FormRef.prototype._ref = _key => {
      if (_key === IS_FORMREF) return FormRef.prototype;
      return null;
    };

    /* formRef - End */

    FormRef.prototype.getInputProps = getInputProps;
    FormRef.prototype.getFormConfig = getFormConfig;
    FormRef.prototype.commonInputProps = commonInputProps;
    FormRef.prototype.setInitialFormData = setInitialFormData;
    FormRef.prototype._renderForm = _onFormChangeCallback;
    FormRef.prototype.onBlurValues = onBlurValues;
    FormRef.prototype.onChangeValues = onChangeValues;
    FormRef.prototype.onValidateValues = onValidateValues;
    FormRef.prototype.validateThisForm = validateThisForm;
    FormRef.prototype.validateObject = onValidateCustomObject;
    FormRef.prototype._onUnMountForm = onUnMountForm;
    FormRef.prototype.getSchema = getSchema;
    FormRef.prototype.setFormConfig = setFormConfig;
    FormRef.prototype.resetFormInput = resetFormInput;
    FormRef.prototype.validateCustomForm = validateCustomForm;
    // FormRef.prototype.getResponseValues = getResponseValues;
    // FormRef.prototype.setResponseErrors = setResponseErrors;
    // FormRef.prototype.setKeyErrors = setResponseErrors;

    FormRef.prototype.getFormConfig = getFormConfig;
    FormRef.prototype._objKey = _objKey;
    FormRef.prototype._schema = formRef.current._schema;
    FormRef.prototype._formValidationHandler = _formValidationHandler;
    FormRef.prototype.formConfig = newObject(formRef.current._formConfig);
    FormRef.prototype._renderInputProps = () => {
      if (typeOf(formRef.current._setInputProps) === TYPE_FUNCTION$1) formRef.current._setInputProps(formRef.current.getInputProps(formRef.current._extraProps || __formRef.current._extraProps));
    };

    // formRef.current._formRef = __formRef.current._formRef;

    /* Don't remove or modify [_formId_] key used in provider  */
    FormRef.prototype._formId_ = formId;
    formRef.current.formId = formId;
    /* end */

    FormRef.prototype._ref = _key => {
      if (_key === IS_FORMREF) return FormRef.prototype;
      return null;
    };
    formRef.current.values = getValues();
    formRef.current.errors = getErrors();
    _onFormChangeCallback();
    return {
      formRef: formRef.current,
      formId
    };
  };
  const useFormValidationHook = _ref18 => {
    let {
      renderForm,
      ...props
    } = _ref18;
    const setRenderForm = React.useState()[1];
    const initiateFormValidationHandler = (initialState, _initialErrors) => _formValidationHandler({
      ...props,
      initialState,
      _initialErrors,
      renderFormCallback: setRenderForm,
      getFormData: renderForm ? setRenderForm : undefined
    });
    const [{
      formRef,
      formId
    }, setState] = React.useState(() => initiateFormValidationHandler(props.initialState, props.initialErrors));
    formRef._ref(IS_FORMREF)._setRenderForm = setRenderForm;
    formRef._ref(IS_FORMREF)._isRenderForm = !!renderForm;
    React.useEffect(() => formRef._onUnMountForm, [formRef]);
    formRef.setInitialState = (_initialState, _initialErrors) => {
      setState(() => initiateFormValidationHandler(_initialState, _initialErrors));
    };
    return {
      formRef,
      formId
    };
  };
  const useFormRef = formId => {
    const {
      formRef: _formRef,
      rootFormRef
    } = React.useContext(FormRefContext) || {};
    const formRef = formId ? _formRefs[formId] : _formRef;
    if (!formRef) return {};
    return {
      formRef,
      formId: formRef && formRef._formId_,
      rootFormRef: rootFormRef || formRef
    };
  };
  return {
    useForm: useFormValidationHook,
    formHandler: _formValidationHandler,
    useFormRef
  };
};
const FormProvider$1 = formValidationHandler;
/* example
  FORM_CONFIG = {
    name: {
      type: 'string',
      optional: true,
      minLength: 4,
      maxLength: 1,
      extraConfig: {
        isNumber: true
      }
    },
  };
*/
/**
 * @Available props <useFormValidationHandlerHook>
 * setInitialFormData
 * commonInputProps
 * onChangeValues
 * onBlurValues
 * validateForm
 * setValues
 * setErrors
 * formRef
 * errors
 * values
 */

// const {
//   useFormValidationHook,
//   formValidationHandler,
//   useFormRef,
// } = FormValidationHandlerProvider({
//   VALIDATOR: null,
//   ON_CHANGE_KEY: "onChange",
//   ON_BLUR_KEY: "onBlur",
//   VALUE: "value",
//   ERROR: "error",
// });

// export { useFormValidationHook, formValidationHandler, useFormRef,  };

// import {
const Form = {
  Consumer: FormConsumer,
  Provider: FormProvider,
  Controller: FormController,
  Multiple: MultipleFormProvider,
  Array: MultipleFormProvider
};

exports.Form = Form;
exports.FormProvider = FormProvider$1;
exports.useFormConsumer = useFormConsumer;
