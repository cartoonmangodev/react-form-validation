import { useEffect, useState } from "react";
import {
  newObject,
  generateTimeStamp,
  typeOf,
  updateIn,
  Safe,
} from "react-boilerplate-redux-saga-hoc/utils";

import {
  TYPE_BOOLEAN,
  TYPE_OBJECT,
  TYPE_FUNCTION,
  TYPE_STRING,
  TYPE_ARRAY,
} from "react-boilerplate-redux-saga-hoc/constants";

import isEqual from "fast-deep-equal";

import {
  _deepCopy,
  _setInitialErrors,
  _setInitialValues,
  _getPlatformBasedFieldValue,
  _getPlatformBasedFieldName,
  _checkType,
  _trimStrings,
} from "./utils";

import Validator from "./validator";

import {
  IS_MULTIPLE,
  IS_SCHEMA,
  ON_CHANGE,
  SCHEMA_CONFIG,
  ON_BLUR,
  VALUE,
  ERROR,
  IS_FORMREF,
} from "./constants";

const formValidationHandler = ({
  ON_CHANGE_KEY: _ON_CHANGE_KEY,
  ON_BLUR_KEY: _ON_BLUR_KEY,
  VALUE_KEY: _VALUE_KEY,
  ERROR_KEY: _ERROR_KEY,
  VALIDATOR: _VALIDATOR,
} = {}) => {
  let _formIds = [];
  let _formRefs = {};
  const _formValidationHandler = ({
    VALIDATOR: Validate = _VALIDATOR || Validator,
    initialValues = {},
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
  } = {}) => {
    function FormRef() {}
    const formRef = {
      current: new FormRef(),
    };
    FormRef.prototype.is_validate_form_triggered = false;
    FormRef.prototype._schema = {};
    FormRef.prototype._formRef = {};
    FormRef.prototype._formIds = [];
    if (_isMultiple) console.log(initialValues);
    FormRef.prototype[IS_MULTIPLE] = {
      _initialValues:
        _isMultiple && Array.isArray(initialValues) ? initialValues : [],
    };

    const __formRef = _formRef || formRef;

    const deleteId = (deleteId) => {
      delete _formRefs[deleteId];
      __formRef.current._formIds = __formRef.current._formIds.filter(
        (_id) => _id !== deleteId
      );
      _formIds = _formIds.filter((_id) => _id !== deleteId);
      return _formIds;
    };

    let FORM_CONFIG = _deepCopy(_FORM_CONFIG);

    /** Initial schema config - start */
    let _isSchema_or_isMultiple_config_is_root;
    if (!_schemaKey) {
      if (FORM_CONFIG[IS_MULTIPLE]) {
        FORM_CONFIG = {
          [IS_MULTIPLE]: FORM_CONFIG,
        };
        _isSchema_or_isMultiple_config_is_root = IS_MULTIPLE;
      } else if (FORM_CONFIG[IS_SCHEMA]) {
        FORM_CONFIG = {
          [IS_SCHEMA]: FORM_CONFIG,
        };
        _isSchema_or_isMultiple_config_is_root = IS_SCHEMA;
      }
    }
    /** Initial schema config - end */

    FormRef.prototype._formConfig = _deepCopy(FORM_CONFIG);
    FormRef.prototype._isMultipleForm =
      _isMultiple || _isSchema_or_isMultiple_config_is_root === IS_MULTIPLE;

    if (_isSchema_or_isMultiple_config_is_root) {
      /* formRef */
      FormRef.prototype._isSchema_or_isMultiple_config_is_root =
        _isSchema_or_isMultiple_config_is_root;
    }

    FormRef.prototype._schema = formRef.current._schema;

    const getOriginalFormObject = (_obj) =>
      _isSchema_or_isMultiple_config_is_root
        ? _obj[_isSchema_or_isMultiple_config_is_root]
        : _obj;

    const initialConfig = {
      Validate,
      getFormData: onFormChangeCallback,
      renderFormCallback,
      FORM_CONFIG,
      ON_CHANGE_KEY,
      ON_BLUR_KEY,
      VALUE_KEY,
      ERROR_KEY,
    };

    FormRef.prototype._initialFormConfig = initialConfig.FORM_CONFIG;
    FormRef.prototype._initialConfig = initialConfig;

    const formId = (function generateFormId() {
      const _formId = Math.floor(Math.random() * generateTimeStamp());
      return _formIds.includes(_formId) ? generateFormId() : _formId;
    })();

    _formRefs[formId] = formRef.current;
    _formIds.push(formId);
    __formRef.current._formIds.push(formId);

    let formConfig = initialConfig.FORM_CONFIG;

    const _initiateSchema = (
      _formConfig,
      _values = {},
      _errors = {},
      _keys
    ) => {
      const __formConfig = _formConfig || formConfig;
      Object.entries(__formConfig).forEach(([key, val]) => {
        if (_keys && !_keys.includes(key)) return;
        if (!__formRef.current._formRef.__formRef__)
          __formRef.current._formRef.__formRef__ = formRef.current;
        const ___objKey = `${_objKey ? `${_objKey}_` : ""}${key}`;
        if (
          ((val[IS_SCHEMA] || val[IS_MULTIPLE]) && val[SCHEMA_CONFIG]) ||
          val._formId_
        ) {
          if (val[SCHEMA_CONFIG])
            val[SCHEMA_CONFIG] = newObject(val[SCHEMA_CONFIG]);
          else if (val._formId_) {
            val._initialConfig = newObject(val._initialConfig);
            val._initialFormConfig = newObject(val._initialFormConfig);
          }
          const _id =
            formRef.current._schema[key] &&
            formRef.current._schema[key].formRef._formId_;
          if (_id) _formIds = deleteId(_id);

          const _ref = _formValidationHandler({
            ...(val._formId_ ? val._initialConfig : initialConfig),
            FORM_CONFIG: val._formId_
              ? val._initialFormConfig
              : (formRef.current._schema[key] &&
                  formRef.current._schema[key].formRef.getFormConfig()) ||
                val[SCHEMA_CONFIG],
            ref,
            initialValues: _values[key] || initialValues[key],
            _formRef: __formRef,
            _formRef: __formRef,
            _objKey: ___objKey,
            _schemaKey: key,
            _initialErrors: _errors[key] || _initialErrors[key],
            [IS_MULTIPLE]: val[IS_MULTIPLE],
          });
          formRef.current._hasChildRef = true;
          formRef.current._schema[key] = _ref;
          __formRef.current._formRef[___objKey] = _ref;
          // formRef.current._formRef = getOriginalFormRef(
          //   __formRef.current._formRef
          // );
        }
      });
    };

    _initiateSchema(formConfig, initialValues, _initialErrors);

    let values = _setInitialValues({
      formConfig,
      initialValues,
      formRef,
      isMultiple: _isMultiple,
    });

    let errors = _setInitialErrors({
      formConfig,
      initialValues: _initialErrors,
      formRef,
      isMultiple: _isMultiple,
    });

    formRef.current.values = values;
    formRef.current.errors = errors;
    FormRef.prototype.formConfig = formConfig;

    const _onFormChangeCallback = (dontRender) => {
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
      if (typeOf(onFormChangeCallback) === TYPE_FUNCTION && !dontRender)
        setTimeout(() => {
          if (__formRef.current.getValues) {
            const _data = {
              values: (_rootRef || __formRef).current.getValues(),
              errors: (_rootRef || __formRef).current.getErrors(),
              formConfig: (_rootRef || __formRef).current.getFormConfig(),
            };
            if (!isEqual(_data, __formRef.current.oldData)) {
              __formRef.current.oldData = _data;
              onFormChangeCallback(_data);
            }
          }
        });
    };

    const _resetSchema = (_config) => {
      (Array.isArray(_config) ? _config : Object.keys(_config)).reduce(
        (acc, key) => {
          const _formRef =
            formRef.current._schema[key] &&
            formRef.current._schema[key].formRef;
          const _id = _formRef && _formRef._formId_;
          if (_id) _formIds = deleteId(_id);
          delete formRef.current._schema[key];
          delete formRef.current._schema[key];
          return {
            ...acc,
            [key]: {},
          };
        },
        {}
      );
    };

    const _resetFormRef = (_config) => {
      (Array.isArray(_config) ? _config : Object.keys(_config)).forEach(
        (key) => {
          const ___objKey = `${_objKey ? `${_objKey}_` : ""}${key}`;
          delete formRef.current._formRef[___objKey];
          // delete formRef.current._formRef[___objKey];
        }
      );
    };

    const setFormConfig = (
      _formConfig,
      _newConfigKeys,
      initiateSchema = true
    ) => {
      const __formConfig = _deepCopy(_formConfig);
      FormRef.prototype._initialFormConfig = _deepCopy(_formConfig);
      FormRef.prototype._formConfig = __formConfig;
      FormRef.prototype.formConfig = __formConfig;
      const _values = formRef.current.getValues();
      const _errors = formRef.current.getErrors();
      FormRef.prototype.formConfig = _checkType(
        _formConfig,
        formRef.current.formConfig
      );
      formConfig = __formConfig;
      const _lastUpdated = Math.floor(Math.random() * generateTimeStamp());
      formRef.current.lastUpdated = _lastUpdated;
      formRef.current.lastUpdated = _lastUpdated;
      if (initiateSchema) {
        _resetSchema(_newConfigKeys);
        _resetFormRef(_newConfigKeys);
        _initiateSchema(
          _formConfig,
          newObject(_values),
          newObject(_errors),
          _newConfigKeys
        );
        _onFormChangeCallback(!initiateSchema);
        if (typeOf(formRef.current._setInputProps) === TYPE_FUNCTION)
          formRef.current._setInputProps(
            formRef.current.getInputProps(
              formRef.current._extraProps || __formRef.current._extraProps
            )
          );
      }
      return formRef.current;
    };

    const setValues = (_values, dontSetInputProps) => {
      formRef.current.values = _checkType(_values, formRef.current.values);
      values = formRef.current.values;
      _onFormChangeCallback();
      setTimeout(() => {
        if (
          typeOf(formRef.current._setInputProps) === TYPE_FUNCTION &&
          !dontSetInputProps
        )
          formRef.current._setInputProps(
            formRef.current.getInputProps(
              formRef.current._extraProps || __formRef.current._extraProps
            )
          );
      });
    };

    const setErrors = (_errors, dontSetInputProps) => {
      formRef.current.errors = _checkType(_errors, formRef.current.errors);
      errors = formRef.current.errors;
      _onFormChangeCallback();
      if (
        typeOf(formRef.current._setInputProps) === TYPE_FUNCTION &&
        !dontSetInputProps
      )
        formRef.current._setInputProps(
          formRef.current.getInputProps(
            formRef.current._extraProps || __formRef.current._extraProps
          )
        );
    };

    const validateValue = (
      __value,
      key,
      isSetValue,
      isSetError,
      _config,
      isTrim = false,
      dontRender
    ) => {
      // formRef.current.lastUpdated = generateTimeStamp();
      const config = _config || formRef.current.formConfig[key] || {};
      // eslint-disable-next-line prefer-const
      let { value, error: validatorError } =
        config && config.validator
          ? config.validator(
              __value,
              { formRef: formRef.current, values, errors },
              config._config,
              config._commonInputProps
            )
          : { value: __value };
      let error = null;
      let maxError = null;
      if (!config._noValidate && config._initiated) {
        if (
          typeof config.trim !== "undefined"
            ? config.trim
            : config.trim || isTrim
        )
          value = _trimStrings(value, config.isNumber);
        if (config.maxLength && (value || "").length > config.maxLength) {
          maxError =
            typeof (config.message && config.message.maxLength) !== "undefined"
              ? config.message.maxLength
              : `maximum ${config.maxLength} characters are allowed`;
          value = value.slice(0, config.maxLength);
        }

        if (config) {
          error =
            validatorError ||
            Validate(value, config.type, {
              key,
              optional: config.optional,
              minLength: config.minLength,
              message: config.message,
              maxLength: config.maxLength,
              length: config.length,
              ...config,
            }) ||
            maxError;
          if (
            value &&
            config.match &&
            typeof config.match === "string" &&
            values[config.match]
          )
            error =
              values[config.match] !== value
                ? typeof (config.message && config.message.match) !==
                  "undefined"
                  ? config.message.match
                  : `${key} not matching with ${config.match}`
                : maxError;
        }
        if (key && isSetValue)
          if (
            value !== "" &&
            ["string", "number"].includes(typeof value) &&
            !Number.isNaN(+value) &&
            !(config.allowValidNumber ? !!+value : true)
          )
            error =
              (config.message && config.message.allowValidNumber) !== undefined
                ? config.message && config.message.allowValidNumber
                : "Please enter valid number";
          else if (config.allowOnlyNumber)
            if (!Number.isNaN(+value)) {
              setValues(
                {
                  ...values,
                  [key]: value,
                },
                dontRender
              );
            } else
              error =
                typeof (config.message && config.message.allowOnlyNumber) !==
                "undefined"
                  ? config.message && config.message.allowOnlyNumber
                  : "Only numbers are allowed";
          else {
            setValues(
              {
                ...values,
                [key]: value,
              },
              dontRender
            );
          }
      } else {
        setValues(
          {
            ...values,
            [key]: value,
          },
          dontRender
        );
      }
      if (typeof config.callback === "function") {
        const response = config.callback(
          {
            error,
            value,
            key,
            formRef: formRef.current,
            values,
            errors,
            is_validation_allowed: !config._noValidate,
          },
          formRef.current.formConfig[key]._config,
          formRef.current.formConfig[key]._commonInputProps
        );
        if (typeOf(response) === TYPE_OBJECT) {
          setValues(
            {
              ...values,
              [key]: response.value,
            },
            dontRender
          );
          error = response.error;
        }
      }
      if (isSetError) {
        setErrors(
          {
            ...errors,
            [key]: error || null,
          },
          dontRender
        );
      }
      return { error, value, key };
    };

    const onChangeValues = (
      e = {},
      key,
      {
        value: _value,
        isStopPropagation,
        isValidateOnly,
        config,
        isSetError = true,
        trim,
        dontRender,
      } = {}
    ) => {
      // formRef.current.isFormChanged = true;
      // formRef.current.lastUpdated = generateTimeStamp();
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (e && isStopPropagation && typeof e.stopPropagation === "function")
        e.stopPropagation();
      let value =
        _value !== undefined ? _value : _getPlatformBasedFieldValue(e);
      const _key = _getPlatformBasedFieldName(e);
      const KEY = key || _key;
      if (isValidateOnly || !KEY)
        return validateValue(value, KEY, null, null, config, trim, dontRender);
      validateValue(value, KEY, true, isSetError, undefined, trim, dontRender);
    };

    const onValidateValues = ({
      value,
      isValue,
      key,
      isValidateOnly,
      config,
      trim,
    }) =>
      onChangeValues(value, key, {
        value: isValue ? value : undefined,
        isValidateOnly,
        config,
        trim,
      });

    const onBlurValues = (e, key, config = {}) => {
      const _key = _getPlatformBasedFieldName(e);
      const KEY = key || _key;
      const value = values[KEY];
      if (
        config.isValidateOnBlur === undefined ? true : config.isValidateOnBlur
      )
        validateValue(value, KEY, false, true);
    };

    const validateThisForm = ({ isSetError = true } = {}) => {
      formRef.current.is_validate_form_triggered = true;
      const _values = values;
      const _errors = errors;
      const isError = [];
      for (const [key, val] of Object.entries(formConfig)) {
        if (val[IS_SCHEMA] || val[IS_MULTIPLE] || val._formId_) continue;
        const { error: _error } = validateValue(
          _values[key],
          key,
          false,
          false,
          val,
          true
        );
        _errors[key] = _error;
        if (_error) isError.push(null);
        if (isSetError) {
          setErrors(_errors);
        }
      }
      // if (isSetError) setFormErrors(_errors);
      formRef.current.is_validate_form_triggered = false;
      return {
        values: _values,
        errors: _errors,
        totalErrorCount: isError.length,
        errorCount: isError.length,
        isError: isError.length > 0,
        isValidatePassed: isError.length === 0,
      };
    };

    const validateForm = (props) => {
      let obj = formRef.current.validateThisForm(props);
      obj = Object.entries(formRef.current._schema).reduce(
        (acc, [key, val]) => {
          if (
            val.formRef._isMultipleForm &&
            !val.formRef[IS_MULTIPLE].validateForm
          )
            return acc;

          let obj2 = val.formRef[IS_MULTIPLE].validateForm
            ? val.formRef[IS_MULTIPLE].validateForm(props)
            : val.formRef.validateForm(props);

          return {
            errorCount: acc.errorCount + obj2.errorCount,
            isError: acc.isError || obj2.isError,
            isValidatePassed: acc.isValidatePassed || obj2.isValidatePassed,
            totalErrorCount: acc.totalErrorCount + obj2.totalErrorCount,
            errors: newObject(acc.errors, {
              [key]: obj2.errors,
            }),
            values: newObject(acc.values, {
              [key]: obj2.values,
            }),
          };
        },
        obj
      );
      obj.values = getOriginalFormObject(obj.values);
      obj.errors = getOriginalFormObject(obj.errors);
      return obj;
    };

    const validateCustomForm = ({
      isSetError,
      formConfig: form_config = {},
      values: __values = {},
      errors: __errors = {},
    }) => {
      // formRef.current.lastUpdated = generateTimeStamp();
      const _FORM_CONFIG = form_config;
      const _values = __values;
      const _errors = __errors;
      const isError = [];
      for (const key of Object.keys(_FORM_CONFIG)) {
        const { error: _error } = validateValue(
          _values[key],
          key,
          false,
          false,
          _FORM_CONFIG[key]
        );
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
        isValidatePassed: isError.length === 0,
      };
    };

    const onValidateCustomObject = (value, config) =>
      validateForm({
        isSetError: false,
        values: value,
        formConfig: config,
        isNewFormConfig: true,
        isResetValue: true,
        isResetError: true,
      });

    const onAddFormConfig = (isReset) => (config) => {
      const _config =
        typeof config === "function"
          ? config(formRef.current.getFormConfig())
          : config;
      const _configKeys = Object.keys(config);
      if (isReset) {
        return setFormConfig(newObject(_config), _configKeys);
      } else {
        // Object.assign(formConfig, _config);
        return setFormConfig(
          { ...formRef.current.getFormConfig(), ..._config },
          _configKeys
        );
      }
    };

    const onDeleteFormConfig = (keys) => {
      const _formConfig = { ...formConfig };
      if (Array.isArray(keys)) {
        keys.forEach((_key) => {
          if (typeOf(_key) === TYPE_STRING) delete _formConfig[_key];
        });
        setFormConfig(_formConfig, keys);
      }
    };

    const resetFormInput = (clearKeys = [], isDeleteKey) => {
      const _values = { ...values };
      const _errors = { ...errors };
      clearKeys.forEach((_key) => {
        if (isDeleteKey) {
          delete _values[_key];
          delete _errors[_key];
        } else {
          _values[_key] = formConfig[_key] && formConfig[_key].default;
          _errors[_key] = null;
        }
      });
      setValues(_values);
      setErrors(_errors);
    };

    const validateFields = (formFields = [], config) => {
      formFields.forEach((_key) => {
        if (values[_key]) {
          onChangeValues(values[_key], _key, config);
        }
      });
    };

    const commonInputProps = (
      key,
      {
        index,
        config,
        propKeyMap: {
          onChange = ON_CHANGE_KEY,
          onBlur = ON_BLUR_KEY,
          value = VALUE_KEY,
          error = ERROR_KEY,
        } = {},
        ...rest
      } = {}
    ) => {
      const INITIAL_FORM_CONFIG = formRef.current.formConfig[key];
      const initialConfig = newObject(
        (INITIAL_FORM_CONFIG._commonInputProps &&
          INITIAL_FORM_CONFIG._commonInputProps._defaultConfig) ||
          INITIAL_FORM_CONFIG
      );
      if (INITIAL_FORM_CONFIG)
        INITIAL_FORM_CONFIG._config = {
          index,
          config,
          key,
          ...rest,
        };
      let _commonInputProps = {
        [onChange]: (e) => {
          onChangeValues(e, key, config);
          const _validateFieldsOnChange =
            (config && config.validateFieldsOnChange) ||
            (INITIAL_FORM_CONFIG && INITIAL_FORM_CONFIG.validateFieldsOnChange);
          if (_validateFieldsOnChange && _validateFieldsOnChange.length > 0) {
            validateFields(
              _validateFieldsOnChange,
              INITIAL_FORM_CONFIG._config
            );
          }
          if (INITIAL_FORM_CONFIG.render) formRef.current.renderForm();
        },
        [onBlur]: (e) => onBlurValues(e, key, INITIAL_FORM_CONFIG),
        [value]: values[key],
        [error]: errors[key],
        keyName: key,
        lastUpdated: formRef.current.lastUpdated,
      };
      _commonInputProps = {
        formId,
        ..._commonInputProps,
        ...((INITIAL_FORM_CONFIG &&
          (typeof INITIAL_FORM_CONFIG.inputProps === "function"
            ? INITIAL_FORM_CONFIG.inputProps(
                formRef.current,
                INITIAL_FORM_CONFIG._config,
                {
                  onChange: _commonInputProps[onChange],
                  onBlur: _commonInputProps[onBlur],
                  value: _commonInputProps[value],
                  error: _commonInputProps[error],
                  key,
                }
              )
            : INITIAL_FORM_CONFIG.inputProps)) ||
          {}),
      };
      _commonInputProps.inputProps = {
        ..._commonInputProps,
      };
      _commonInputProps._fieldConfig = INITIAL_FORM_CONFIG;
      _commonInputProps._config = {
        ...formRef.current.formConfig[key],
      };
      _commonInputProps[IS_SCHEMA] = {
        validateField: (e) => {
          onChangeValues(e, key, { ...config, dontRender: true });
          const _validateFieldsOnChange =
            (config && config.validateFieldsOnChange) ||
            (INITIAL_FORM_CONFIG && INITIAL_FORM_CONFIG.validateFieldsOnChange);
          if (_validateFieldsOnChange && _validateFieldsOnChange.length > 0) {
            validateFields(_validateFieldsOnChange, {
              ...INITIAL_FORM_CONFIG._config,
              dontRender: true,
            });
          }
        },
      };
      _commonInputProps._defaultConfig = initialConfig;
      delete _commonInputProps._config.inputProps;
      delete _commonInputProps._config._commonInputProps;

      if (INITIAL_FORM_CONFIG) {
        INITIAL_FORM_CONFIG._commonInputProps = {
          ..._commonInputProps,
        };
      }
      return _commonInputProps;
    };

    const setInitialFormData = (value, isResetValue) => {
      const _values = Object.entries(formRef.current.formConfig).reduce(
        (acc, [key, val]) => {
          if (val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]) {
            if (val[IS_SCHEMA] || val._formId_)
              formRef.current._schema[key].formRef.setInitialFormData(
                value && value[key],
                isResetValue
              );
            else if (
              val[IS_MULTIPLE] &&
              formRef.current._schema[key] &&
              formRef.current._schema[key].formRef[IS_MULTIPLE]
                .setInitialFormData
            )
              formRef.current._schema[key].formRef[
                IS_MULTIPLE
              ].setInitialFormData(value && value[key], isResetValue);
            return acc;
          }
          return newObject(acc, {
            [key]: key in value || isResetValue ? value[key] : values[key],
          });
        },
        {}
      );
      setValues(_values);
    };

    const setFormErrors = (error, isResetError) => {
      const _errors = Object.entries(formRef.current.formConfig).reduce(
        (acc, [key, val]) => {
          if (val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]) {
            if (val[IS_SCHEMA] || val._formId_)
              formRef.current._schema[key].formRef.setFormErrors(
                (error && error[key]) || {},
                isResetValue
              );
            else if (
              val[IS_MULTIPLE] &&
              formRef.current._schema[key] &&
              formRef.current._schema[key].formRef[IS_MULTIPLE].setFormErrors
            )
              formRef.current._schema[key].formRef[IS_MULTIPLE].setFormErrors(
                error && error[key],
                isResetValue
              );
            return acc;
          }
          return newObject(acc, {
            [key]:
              (error && error[key]) !== undefined || isResetError
                ? error[key] || null
                : errors[key],
          });
        },
        {}
      );
      setErrors(_errors);
    };

    const resetForm = (isClear) => (resetOnlyThisForm) => {
      const _values = Object.entries(formConfig || {}).reduce(
        (acc, [key, val = {}]) => {
          const method = isClear ? "clearForm" : "resetForm";
          return newObject(
            acc,
            val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]
              ? resetOnlyThisForm
                ? {}
                : {
                    [key]: val[IS_MULTIPLE]
                      ? (formRef.current._schema[key] &&
                          formRef.current._schema[key].formRef[IS_MULTIPLE][
                            method
                          ] &&
                          formRef.current._schema[key].formRef[IS_MULTIPLE][
                            method
                          ]()) ||
                        []
                      : formRef.current._schema[key].formRef[method](),
                  }
              : {
                  [key]: isClear
                    ? "default" in val
                      ? val.default
                      : ""
                    : (initialValues[key] !== undefined &&
                        (typeof initialValues[key] === "function"
                          ? initialValues[key]()
                          : initialValues[key])) ||
                      ("default" in val ? val.default : ""),
                }
          );
        },
        values
      );
      formRef.current.setFormValues(_values, true);
      formRef.current.setFormErrors({}, true);
      return _values;
    };

    const getResponseValues = (_response) => {
      const _dontConvertKeysToObject =
        typeOf(_response) === TYPE_BOOLEAN && !_response;

      if (typeOf(_response) === TYPE_OBJECT) {
        return Object.entries(formRef.current.formConfig).reduce(
          (acc, [_key, _config = {}]) => ({
            ...acc,
            [_key]: Safe(_response, `.${_config.key || _key}`),
          }),
          {}
        );
      }
      let _value = values[_key];
      _value =
        typeof _config.payloadCallback === "function"
          ? _config.payloadCallback(_value)
          : _config.isAllowEmpty
          ? _value
          : _value || undefined;

      if (_dontConvertKeysToObject)
        return Object.entries(formRef.current.formConfig).reduce(
          (acc, [_key, _config = {}]) => ({
            ...acc,
            [_config.key || _key]: _value,
          }),
          {}
        );

      return Object.entries(formRef.current.formConfig).reduce(
        (acc, [_key, _config = {}]) =>
          updateIn(acc, (_config.key || _key).split("."), () => _value),
        {}
      );
    };

    const setResponseErrors = (_errors) => {
      const _keyErrors = Object.entries(formRef.current.formConfig).reduce(
        (acc, [_key, _config = {}]) => ({
          ...acc,
          [_key]: Safe(_errors, `.${_config.key || _key}`),
        }),
        {}
      );
      setErrors(_keyErrors);
    };

    const _getInputProps = () =>
      getInputProps(
        formRef.current._extraProps || __formRef.current._extraProps
      );

    const getInputProps = (extraProps = {}) =>
      Object.entries(formRef.current.formConfig).reduce(
        (prev, [key, val]) =>
          val[IS_SCHEMA] || val._formId_
            ? prev
            : {
                ...prev,
                [key]: commonInputProps(key, extraProps),
              },
        {
          [IS_SCHEMA]: {
            addFormConfig: formRef.current.modifyFormConfig,
            deleteFormConfig: formRef.current.deleteFormConfig,
            getInputProps: _getInputProps,
            onFormChangeCallback: _onFormChangeCallback,
            resetFormInput: formRef.current.resetFormInput,
          },
        }
      );

    const setValidate = (_config = {}) => {
      let __config = { ...formConfig };
      let __errors = { ...errors };
      Object.entries(_config).forEach(([_key, _value]) => {
        __config[_key]._noValidate = !_value;
        if (!_value) __errors[_key] = null;
      });
      setFormConfig(__config, Object.keys(_config));
      setErrors(__errors);
    };

    const setOptional = (_config = {}) => {
      let __config = { ...formConfig };
      let __errors = { ...errors };
      Object.entries(_config).forEach(([_key, _value]) => {
        __config[_key].optional = _value;
        __config[_key].isRequired = false;
        __errors[_key] = null;
      });
      setFormConfig(__config, Object.keys(_config));
      setErrors(__errors);
      validateFields(Object.keys(_config));
    };

    const setRequired = (_config = {}) => {
      let __config = { ...formConfig };
      let __errors = { ...errors };
      Object.entries(_config).forEach(([_key, _value]) => {
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
      return getOriginalFormObject(
        Object.entries(formRef.current.getFormConfig()).reduce(
          (acc, [key, val]) => {
            const _isSchema =
              val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];
            if (
              ((!_isSchema && !val._initiated) ||
                (_isSchema &&
                  !(
                    formRef.current._schema[key] &&
                    formRef.current._schema[key].formRef._is_form_initiated
                  ))) &&
              !_isSchema_or_isMultiple_config_is_root
            )
              return acc;
            if (!_isSchema && !val._initiated) return acc;
            let _value = val[IS_MULTIPLE]
              ? []
              : formRef.current._schema[key] &&
                formRef.current._schema[key].formRef.getValues();
            const getValues =
              formRef.current._schema[key] &&
              formRef.current._schema[key].formRef[IS_MULTIPLE].getValues;
            if (typeof getValues === "function" && val[IS_MULTIPLE])
              _value = getValues();
            return {
              ...acc,
              [key]: _isSchema
                ? _value
                : values[key] === undefined
                ? "default" in val
                  ? val.default
                  : ""
                : values[key],
            };
          },
          {}
        )
      );
    };

    const getErrors = () =>
      getOriginalFormObject(
        Object.entries(formConfig).reduce((acc, [key, val]) => {
          const _isSchema = val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];

          if (
            ((!_isSchema && !val._initiated) ||
              (_isSchema &&
                !(
                  formRef.current._schema[key] &&
                  formRef.current._schema[key].formRef._is_form_initiated
                ))) &&
            !_isSchema_or_isMultiple_config_is_root
          )
            return acc;

          let _error = val[IS_MULTIPLE]
            ? errors[key]
            : formRef.current._schema[key] &&
              formRef.current._schema[key].formRef.getErrors();
          const getErrors =
            formRef.current._schema[key] &&
            formRef.current._schema[key].formRef[IS_MULTIPLE].getErrors;
          if (typeof getErrors === "function") _error = getErrors();
          return {
            ...acc,
            [key]: _isSchema
              ? val[IS_MULTIPLE]
                ? Array.isArray(_error)
                  ? _error
                  : [_error]
                : _error
              : errors[key] || null,
          };
        }, {})
      );

    const getFormConfig = () =>
      newObject(
        getOriginalFormObject(
          Object.entries(formConfig).reduce((acc, [key, val]) => {
            const _isSchema =
              val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE];

            if (_isSchema) {
              let _getFormConfig =
                formRef.current._schema[key] &&
                formRef.current._schema[key].formRef.getFormConfig;

              if (typeof _getFormConfig === "function") {
                return {
                  ...acc,
                  [key]: {
                    ...val,
                    [SCHEMA_CONFIG]: val[IS_MULTIPLE]
                      ? (formRef.current._schema[key] &&
                          formRef.current._schema[key].formRef[IS_MULTIPLE]
                            .getFormConfig &&
                          formRef.current._schema[key].formRef[
                            IS_MULTIPLE
                          ].getFormConfig()) ||
                        _getFormConfig()
                      : _getFormConfig(),
                  },
                };
              }
              return acc;
            }
            return {
              ...acc,
              [key]: val,
            };
          }, {})
        )
      );

    const getSampleForm = () =>
      getOriginalFormObject(
        Object.entries(formConfig).reduce((acc, [key, val]) => {
          let _value;
          if (val[IS_MULTIPLE])
            _value =
              formRef.current._schema[key] &&
              formRef.current._schema[key].formRef[IS_MULTIPLE].getSampleForm &&
              formRef.current._schema[key].formRef[IS_MULTIPLE].getSampleForm();
          else
            _value =
              formRef.current._schema[key] &&
              formRef.current._schema[key].formRef.getSampleForm();

          return {
            ...acc,
            [key]:
              val[IS_SCHEMA] || val._formId_ || val[IS_MULTIPLE]
                ? val[IS_MULTIPLE]
                  ? Array.isArray(_value)
                    ? _value
                    : [_value]
                  : _value
                : val.default,
          };
        }, {})
      );

    // const isFormChanged = (
    //   () => !isEqual(formRef.current.initialLoadValues, formRef.current.values),
    //   [],
    // );

    const renderForm = () => {
      if (
        typeOf(renderFormCallback) === TYPE_FUNCTION &&
        (_rootRef || __formRef).current.getValues
      ) {
        const _data = {
          values: (_rootRef || __formRef).current.getValues(),
          errors: (_rootRef || __formRef).current.getErrors(),
          formConfig: (_rootRef || __formRef).current.getFormConfig(),
        };
        renderFormCallback(_data);
      }
    };

    const getFormRef = (key) => {
      if (key && key.length > 0 && typeOf(key) === TYPE_ARRAY) {
        const _formRef = formRef.current._formRef[key.join("_")];
        if (_formRef) return _formRef.formRef;
        else return null;
      } else if (!key) return formRef.current._formRef.__formRef__;
      return null;
    };
    const getFormRefById = (formId) => {
      if (_formRefs[formId]) return _formRefs[formId];
      return null;
    };

    const onUnMountForm = () => {
      __formRef.current._formIds.forEach((_id) => {
        deleteId(_id);
      });
    };

    /* formRef - start */
    if (!formRef.current._isMultipleForm) {
      formRef.current.getValues = getValues;
      formRef.current.getErrors = getErrors;
      formRef.current.setFormValues = setInitialFormData;
      formRef.current.setFormErrors = setFormErrors;
      formRef.current.getSampleForm = getSampleForm;
      formRef.current.deleteFormConfig = onDeleteFormConfig;
      formRef.current.validateForm = validateForm;
      formRef.current.modifyFormConfig = onAddFormConfig(false);
      formRef.current.resetFormConfig = onAddFormConfig(true);
      formRef.current.resetForm = resetForm(false);
      formRef.current.clearForm = resetForm(true);
      formRef.current.setValidate = setValidate;
      formRef.current.setOptional = setOptional;
      formRef.current.setRequired = setRequired;
    } else formRef.current._isMultipleForm = true;

    formRef.current.renderForm = renderForm;
    formRef.current.getFormRef = getFormRef;
    formRef.current.getFormRefById = getFormRefById;
    formRef.current._isRootRef = !_formRef;

    if (_formRef) FormRef.prototype._parentRef = _formRef.current;

    FormRef.prototype._ref = (_key) => {
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

    FormRef.prototype.setFormConfig = setFormConfig;
    FormRef.prototype.resetFormInput = resetFormInput;

    FormRef.prototype.validateCustomForm = validateCustomForm;
    FormRef.prototype.getResponseValues = getResponseValues;
    FormRef.prototype.setResponseErrors = setResponseErrors;
    FormRef.prototype.setKeyErrors = setResponseErrors;

    FormRef.prototype.getFormConfig = getFormConfig;
    FormRef.prototype._objKey = _objKey;
    FormRef.prototype._schema = formRef.current._schema;

    FormRef.prototype._formValidationHandler = _formValidationHandler;
    FormRef.prototype.formConfig = newObject(formRef.current._formConfig);
    FormRef.prototype._renderInputProps = () => {
      formRef.current._setInputProps(
        formRef.current.getInputProps(
          formRef.current._extraProps || __formRef.current._extraProps
        )
      );
    };

    // formRef.current._formRef = __formRef.current._formRef;

    /* Don't remove or modify [_formId_] key used in provider  */
    FormRef.prototype._formId_ = formId;
    formRef.current.formId = formId;
    /* end */

    FormRef.prototype._ref = (_key) => {
      if (_key === IS_FORMREF) return FormRef.prototype;
      return null;
    };

    _onFormChangeCallback();
    return {
      formRef: formRef.current,
      formId,
    };
  };

  const useFormValidationHook = ({
    renderForm,
    renderFormOnChange,
    ...props
  }) => {
    const [_renderForm, setRenderForm] = useState();
    const [{ formRef, formId }] = useState(() =>
      _formValidationHandler({
        ...props,
        renderFormCallback: setRenderForm,
        getFormData: renderForm ? setRenderForm : undefined,
      })
    );

    formRef._ref(IS_FORMREF)._setRenderForm = setRenderForm;
    formRef._ref(IS_FORMREF)._isRenderForm = renderForm;

    useEffect(() => {
      return () => {
        formRef._onUnMountForm();
      };
    }, [formRef]);

    return { formRef, formId };
  };

  return {
    useFormValidationHook,
    formValidationHandler: _formValidationHandler,
  };
};

export const FormValidationHandlerProvider = formValidationHandler;
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
/**
  const { formRef } = useFormValidationHandlerHook({
    VALIDATOR: validator // custom validator <optional>
    FORM_CONFIG: FORM_DATA_CONFIG.cab_once,
    initialValues: {
      entry_date: () => new Date(),
      entry_time: () => new Date(),
    },
  });

  formRef.values.<key>
  formRef.errors.<key>
  <input {...commonInputProps(<key>)} />
  const onChange = () => {
    formRef.onChangeValues(<value>, <key>);
  }
  const onBlur = () => {
    formRef.onBlurValues(<value>, <key>);
  }
  onClick={() => {
    formRef.modifyFormConfig(
      FORM_DATA_CONFIG.cab_once,
      true, // Reset and set value
      {
        entry_time: new Date(),
        entry_date: new Date(),
        repeat_days: '',
      }, // INITIAL_VALUE
    );
  }}
  const { values: _values, isError } = formRef.validateForm({
      isSetError: true,
      formConfig: __FORM_CONFIG = {}, // optional
      values: __values = {}, // optional
      errors: __errors = {}, // optional
      isNewFormConfig, // optional <Boolean>
  });
*/
