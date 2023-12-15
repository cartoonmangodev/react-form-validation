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
import { IS_FORMREF, newSchema } from "./constants";

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
    },
    ref
  ) => {
    const _ref = useRef({});
    const [_, setRefresh] = useState();

    const {
      formRef: __formRef,
      renderForm: _renderForm,
      setRefresh: _setRefresh,
      rootFormRef: _rootFormRef,
    } = useContext(FormRefContext) || {};

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

    let formRef = getFormRef(___formRef, id);

    if (!formRef) {
      if (id) {
        idRef.current.id = id;
        let newFormRef = ___formRef.modifyFormConfig({
          [id]: newSchema({}),
        });
        ___formRef = newFormRef;
        let _valueRef = getFormRef(___formRef, id);
        formRef = _valueRef;
      }
    }
    if (!formRef._setRenderForm)
      formRef._ref(IS_FORMREF)._setRenderForm = ___formRef._setRenderForm;

    const [inputProps, setInputProps] = useState(
      () => formRef && formRef.getInputProps(extraProps)
    );

    useEffect(() => {
      setInputProps(formRef && formRef.getInputProps(extraProps));
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

    useEffect(() => {
      return () => {
        if (formRef && formRef._ref(IS_FORMREF)._setInputProps)
          delete formRef._ref(IS_FORMREF)._setInputProps;
        if (formRef && formRef._ref(IS_FORMREF)._extraProps)
          delete formRef._ref(IS_FORMREF)._extraProps;
      };
    }, [formRef._formId_]);

    useEffect(() => {
      return () => {
        if (idRef.current.id) {
          ___formRef.deleteFormConfig([idRef.current.id]);
          _ref.current.__setRefresh({});
        }
      };
    }, [___formRef._formId_]);

    if (formRef && formRef._formId_)
      formRef._ref(IS_FORMREF)._extraProps = extraProps;

    useEffect(() => {
      formRef._ref(IS_FORMREF)._is_form_initiated = true;
      formRef._renderForm();
      formRef.renderForm();
      return () => {
        formRef._ref(IS_FORMREF)._is_form_initiated = false;
        formRef._renderForm();
        formRef.renderForm();
      };
    }, [formRef._formId_]);

    rootFormRef._formRef.__formRef__.values =
      rootFormRef._formRef.__formRef__.getValues();
    rootFormRef._formRef.__formRef__.errors =
      rootFormRef._formRef.__formRef__.getErrors();

    return (
      <FormContext.Provider
        value={{
          inputProps,
          idKey,
          onSubmit,
          setInputProps: () => setInputProps(formRef.getInputProps(extraProps)),
          formId: ___formRef._formId_,
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
          }}
        >
          {ref && "current" in ref && (ref.current = formRef) && null}
          {typeof children === "function"
            ? children(inputProps, {
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
