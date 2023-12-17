/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useContext,
} from "react";
import FormContext, { FormRefContext } from "./context";
import { IS_FORMREF, PRIMITIVE_VALUE } from "./constants";
import { newSchema } from "./utils";
import { newObject } from "../util";

const getFormRef = (_formRef, id) => {
  let formRef = _formRef;
  if (formRef._isSchema_or_isMultiple_config_is_root) {
    formRef =
      formRef._schema[formRef._isSchema_or_isMultiple_config_is_root].formRef;
  }
  formRef = id
    ? formRef && formRef._schema[id] && formRef._schema[id].formRef
    : formRef;
  return formRef;
};

const checkFormRefIsValid = (formRef) => {
  if (!formRef || formRef.constructor.name !== "FormRef") {
    throw new Error("Invalid FormRef");
  }
};

export default forwardRef(
  (
    {
      children,
      idKey,
      onSubmit,
      formRef: _formRef,
      extraProps,
      id,
      renderForm: ___renderForm,
      dontResetOnUnmount,
    },
    ref
  ) => {
    if (
      (!_formRef && !id) ||
      (_formRef && _formRef.constructor.name !== "FormRef")
    ) {
      if (_formRef) throw new Error("Invalid FormRef");
      else throw new Error("Required props 'formRef' or 'id' ");
    }
    const {
      formRef: __formRef,
      renderForm: _renderForm,
      setRefresh: _setRefresh,
      rootFormRef: _rootFormRef,
      _rootRef: __rootRef,
    } = useContext(FormRefContext) || {};
    const _ref = useRef({});
    const _rootRef = useRef({});

    const rootRef = __rootRef || _rootRef;

    _ref.current.dontResetOnUnmount = dontResetOnUnmount;

    const [_, setRefresh] = useState();

    const { extraProps: _extraProps = {} } = useContext(FormContext) || {};

    const __extraProps = newObject(_extraProps, extraProps);

    const rootFormRef = _rootFormRef || _formRef;

    let __setRefresh;
    __setRefresh = (props) => {
      if (_setRefresh) _setRefresh(props);
      setRefresh(props);
    };
    _ref.current.__setRefresh = __setRefresh;

    const renderForm =
      ___renderForm !== undefined ? ___renderForm : _renderForm;

    const idRef = useRef({});

    let ___formRef = _formRef || __formRef;

    checkFormRefIsValid(___formRef);

    let formRef = getFormRef(___formRef, id);

    if (
      _formRef &&
      __formRef &&
      (__formRef.formId === _formRef.formId ||
        _formRef.formId === rootFormRef.formId)
    )
      throw new Error(
        'Invalid: Formref are not valid. Cannot be used formref inside nested formref. Please use "id" instead'
      );

    if (!formRef) {
      if (id) {
        checkFormRefIsValid(___formRef);
        if (___formRef._isMultipleForm)
          throw new Error(
            `Invalid: Cannot use 'id' directly under 'FormRef.Multiple'. Please use formRef props instead `
          );
        idRef.current.id = id;
        let newFormRef = ___formRef.modifyFormConfig({
          [id]: newSchema({}),
        });
        ___formRef = newFormRef;
        let _valueRef = getFormRef(___formRef, id);
        formRef = _valueRef;
      }
    }
    checkFormRefIsValid(formRef);

    if (formRef._isMultipleForm)
      throw new Error(
        id
          ? `Invalid: This id (${id}) is configured for multiple form. Please use the 'Form.Multiple'`
          : "Invalid: This FormRef is configured for multiple form. Please use the 'Form.Multiple'"
      );

    if (!formRef._setRenderForm)
      formRef._ref(IS_FORMREF)._setRenderForm = ___formRef._setRenderForm;

    const [inputProps, setInputProps] = useState(
      () => formRef && formRef.getInputProps(__extraProps)
    );

    useEffect(() => {
      setInputProps(formRef && formRef.getInputProps(__extraProps));
    }, [formRef._formId_]);

    if (formRef && formRef._formId_) {
      if (__formRef) {
        formRef._ref(IS_FORMREF)._setInputProps = (props) => {
          if (__formRef._renderInputProps) __formRef._renderInputProps();
          setInputProps(props);
        };
      } else {
        formRef._ref(IS_FORMREF)._setInputProps = setInputProps;
      }
    }

    useEffect(
      () => () => {
        if (_ref.current.dontResetOnUnmount) {
          rootRef.current.dontResetOnUnmount = _ref.current.dontResetOnUnmount;
        }
      },
      []
    );

    useEffect(() => {
      return () => {
        if (!rootRef.current.dontResetOnUnmount) {
          if (formRef && formRef._ref(IS_FORMREF)._setInputProps)
            delete formRef._ref(IS_FORMREF)._setInputProps;
          if (formRef && formRef._ref(IS_FORMREF)._extraProps)
            delete formRef._ref(IS_FORMREF)._extraProps;
        }
      };
    }, [formRef._formId_]);

    useEffect(() => {
      return () => {
        if (idRef.current.id && !rootRef.current.dontResetOnUnmount) {
          ___formRef.deleteFormConfig([idRef.current.id]);
          _ref.current.__setRefresh({});
        }
      };
    }, [___formRef._formId_]);

    if (formRef && formRef._formId_)
      formRef._ref(IS_FORMREF)._extraProps = __extraProps;

    useEffect(() => {
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

    return (
      <FormContext.Provider
        value={{
          inputProps,
          idKey,
          onSubmit,
          setInputProps: () =>
            setInputProps(() => formRef.getInputProps(__extraProps)),
          formId: ___formRef._formId_,
          extraProps: __extraProps,
        }}
      >
        <FormRefContext.Provider
          value={{
            formRef,
            formId: formRef._formId_,
            renderForm,
            lastUpdated: formRef._lastUpdated,
            setRefresh: __setRefresh,
            rootFormRef: _rootFormRef || _formRef,
            _rootRef: rootRef,
          }}
        >
          {ref && "current" in ref && (ref.current = formRef) && null}
          {typeof children === "function"
            ? children({
                inputProps,
                values: formRef.getValues(),
                errors: formRef.getErrors(),
                formRef,
              })
            : children}
        </FormRefContext.Provider>
      </FormContext.Provider>
    );
  }
);
