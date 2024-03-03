/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */
import { useContext, useEffect, useRef } from "react";
import isEqual from "fast-deep-equal";
import FormContext, { FormControllerContext, FormRefContext } from "../context";
import { newObject, typeOf } from "../../utils";
import { TYPE_OBJECT } from "../../constants";
import { IS_SCHEMA, PRIMITIVE_VALUE } from "../constants";

const ID_KEY = "id";

export default (props = {}) => {
  const ref = useRef({});
  const { inputProps = {}, idKey, onSubmit, setInputProps, extraProps } =
    useContext(FormContext) || {};

  const { render, inputConfig: _inputConfig, ...commonInputProps } =
    useContext(FormControllerContext) || {};

  const inputConfig = { ...props.inputConfig, ..._inputConfig };

  const { formRef, renderForm, _rootRef: rootRef } =
    useContext(FormRefContext) || {};

  let _inputFieldProps = inputProps[props[idKey || ID_KEY]] || {};

  const isIdExists = !!(
    props[idKey || ID_KEY] && typeof [props[idKey || ID_KEY]] === "string"
  );

  if (!isIdExists) return { inputProps: {} };

  if (
    _inputFieldProps._fieldConfig &&
    !isEqual(ref.current.inputConfig, inputConfig)
  ) {
    if (ref.current.inputConfig)
      Object.keys(ref.current.inputConfig).forEach(([key, val]) => {
        delete _inputFieldProps._fieldConfig[key];
      });
    _inputFieldProps._fieldConfig._initiated = isIdExists;

    if (typeOf(inputConfig) === TYPE_OBJECT)
      Object.entries(inputConfig).forEach(([key, val]) => {
        if (val !== undefined) _inputFieldProps._fieldConfig[key] = val;
      });
    formRef.setFormConfig(
      {
        ...formRef.getFormConfig(),
        [props[idKey || ID_KEY]]: newObject(
          _inputFieldProps._fieldConfig || {},
          {
            _initiated: isIdExists,
            render: !!(inputConfig.render !== undefined
              ? inputConfig.render
              : render !== undefined
              ? render
              : renderForm || render),
          }
        ),
      },
      [props[idKey || ID_KEY]],
      false
    );
    formRef._renderForm(true);
  }
  if (
    PRIMITIVE_VALUE === props[idKey || ID_KEY] &&
    !(formRef._parentRef && formRef._parentRef._isMultipleForm)
  )
    throw new Error(
      `Invalid: "PRIMITIVE_VALUE" can only be used directly under "Form.Multiple"`
    );

  const __inputProps = formRef.getInputProps(extraProps);
  if (
    PRIMITIVE_VALUE in __inputProps &&
    props[idKey || ID_KEY] !== PRIMITIVE_VALUE
  ) {
    throw new Error(
      `Invalid: "${
        props[idKey || ID_KEY]
      }" cannot add any field to primitive value `
    );
  }
  if (!(props[idKey || ID_KEY] in __inputProps) && !ref.current.id) {
    ref.current.id = props[idKey || ID_KEY];
    if (
      props[idKey || ID_KEY] === PRIMITIVE_VALUE &&
      Object.values(__inputProps).filter(
        (_config) => _config._config && _config._config._initiated
      ).length
    ) {
      throw new Error(
        `Invalid: cannot add id="PRIMITIVE_VALUE" field. Primitive value is always unique. Please remove the other fields in order to use id="PRIMITIVE_VALUE" `
      );
    }
    formRef.modifyFormConfig({
      [props[idKey || ID_KEY]]: newObject(inputConfig || {}, {
        _initiated: isIdExists,
        render: !!(inputConfig.render !== undefined
          ? inputConfig.render
          : renderForm || render),
      }),
    });
    formRef._setInputProps();
    formRef._renderForm();
    formRef.renderForm();
  }

  useEffect(() => {
    setInputProps();
    return () => {
      if (!rootRef.current.dontResetOnUnmount) {
        if (_inputFieldProps._fieldConfig) {
          _inputFieldProps._fieldConfig._initiated = false;
          if (typeOf(inputConfig) === TYPE_OBJECT)
            Object.keys(inputConfig).forEach((key) => {
              _inputFieldProps._fieldConfig[key] =
                _inputFieldProps._defaultConfig[key];
            });
        }
        if (ref.current.id)
          inputProps[IS_SCHEMA].deleteFormConfig([ref.current.id]);
        inputProps[IS_SCHEMA].resetFormInput(
          [props[idKey || ID_KEY]],
          !!ref.current.id
        );
        inputProps[IS_SCHEMA].onFormChangeCallback();
      }
    };
  }, [formRef._formId_]);

  ref.current.inputConfig = inputConfig;

  if (_inputFieldProps.error)
    _inputFieldProps[IS_SCHEMA].validateField(
      _inputFieldProps.value === undefined ? "" : _inputFieldProps.value
    );

  const _inputProps =
    formRef.getInputProps(extraProps)[props[idKey || ID_KEY]] || {};

  return {
    inputProps: { ...(_inputProps.inputProps || {}), ...commonInputProps },
    _inputFieldConfig: _inputProps._config,
    ...(onSubmit ? { onSubmit } : {}),
  };
};
