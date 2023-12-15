/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */
import React, { useContext, memo, useEffect, useRef } from "react";
import FormContext, { FormControllerContext, FormRefContext } from "./context";
import { newObject, typeOf } from "../utils";
import { TYPE_OBJECT } from "../constants";
import { IS_SCHEMA, IS_LITERAL_VALUE } from "./constants";

const ID_KEY = "id";

const Consumer = memo(
  ({ children, ...props }) => {
    return typeof children === "function" ? children(props) : children;
  },
  (prev, next) =>
    prev.inputProps.value === next.inputProps.value &&
    prev.inputProps.error === next.inputProps.error &&
    prev.inputProps.lastUpdated === next.inputProps.lastUpdated
);

export default ({ children, ...props }) => {
  const ref = useRef({});
  const { inputProps = {}, idKey, onSubmit, setInputProps } =
    useContext(FormContext) || {};

  const { render, inputConfig: _inputConfig, ...commonInputProps } =
    useContext(FormControllerContext) || {};

  const inputConfig = { ...props.inputConfig, ..._inputConfig };

  const { formRef, renderForm } = useContext(FormRefContext) || {};

  let _inputFieldProps = inputProps[props[idKey || ID_KEY]] || {};

  if (_inputFieldProps._fieldConfig) {
    if (ref.current.inputConfig)
      Object.keys(ref.current.inputConfig).forEach(([key, val]) => {
        delete _inputFieldProps._fieldConfig[key];
      });
    _inputFieldProps._fieldConfig._initiated = true;
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
            _initiated: true,
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

  const __inputProps = formRef.getInputProps();
  if (!(props[idKey || ID_KEY] in __inputProps) && !ref.current.id) {
    ref.current.id = props[idKey || ID_KEY];
    if (IS_LITERAL_VALUE in __inputProps) {
      throw new Error(
        `Invalid: "${
          props[idKey || ID_KEY]
        }" cannot add any field to literal value `
      );
    }
    formRef.modifyFormConfig({
      [props[idKey || ID_KEY]]: newObject(inputConfig || {}, {
        _initiated: true,
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
    };
  }, [formRef._formId_]);

  ref.current.inputConfig = inputConfig;

  if (_inputFieldProps.error)
    _inputFieldProps[IS_SCHEMA].validateField(
      _inputFieldProps.value === undefined ? "" : _inputFieldProps.value
    );

  const _inputProps = formRef.getInputProps()[props[idKey || ID_KEY]] || {};

  const _props = {
    inputProps: { ...(_inputProps.inputProps || {}), ...commonInputProps },
    _inputFieldConfig: _inputProps._config,
    ...(onSubmit ? { onSubmit } : {}),
    ...props,
  };
  return <Consumer {..._props}>{children}</Consumer>;
};
