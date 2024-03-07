/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
  useContext,
} from "react";
import FormContext, { FormRefContext } from "./context";
import { newObject, typeOf, newFormArray } from "../utils";
import { TYPE_OBJECT } from "../constants";
import {
  SCHEMA_CONFIG,
  IS_FORMREF,
  IS_MULTIPLE,
  PRIMITIVE_VALUE,
} from "./constants";

const convertToOriginalData = (value) =>
  typeOf(value) === TYPE_OBJECT && PRIMITIVE_VALUE in value
    ? value[PRIMITIVE_VALUE]
    : value;

const generateNewFormRef = (
  formRef,
  _values,
  __formRef,
  rootFormRef,
  isMultiple
) => {
  const __values =
    typeOf(_values) === TYPE_OBJECT || _values === undefined
      ? _values
      : {
          [PRIMITIVE_VALUE]: _values,
        };
  const _formRef = formRef._formValidationHandler(
    newObject({
      ...newObject(formRef._initialConfig),
      FORM_CONFIG: isMultiple
        ? newFormArray({})
        : newObject(formRef._initialConfig.FORM_CONFIG),
      initialState: __values || {},
      renderFormCallback: rootFormRef._setRenderForm,
      _rootRef: { current: rootFormRef },
      getFormData: rootFormRef._isRenderForm
        ? __formRef._setRenderForm
        : undefined,
      _parentRef: formRef,
      _parentId: formRef.formId,
    })
  );
  return _formRef;
};

const _getFormRef = (_formRef, id) => {
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
  // if (!formRef || formRef.constructor.name !== "FormRef") {
  if (!formRef) {
    throw new Error("Invalid FormRef");
  }
};
export default forwardRef(
  (
    {
      children,
      formRef: _formRef,
      noAutoLoop,
      id,
      renderForm: ___renderForm,
      defaultCount = 1,
      dontResetOnUnmount,
    },
    ref
  ) => {
    if (
      !_formRef &&
      !id
      // (!_formRef && !id) ||
      // (_formRef && _formRef.constructor.name !== "FormRef")
    ) {
      if (_formRef) throw new Error("Invalid FormRef");
      else throw new Error("Required props 'formRef' or 'id' ");
    }

    const {
      formRef: ___formRef,
      setRefresh: _setRefresh,
      renderForm: _renderForm,
      rootFormRef: _rootFormRef,
      _rootRef: __rootRef,
    } = useContext(FormRefContext) || {};

    const { setInputProps } = useContext(FormContext);
    const idRef = useRef({});
    const _ref = useRef({});
    const _rootRef = useRef({});

    const rootRef = __rootRef || _rootRef;

    _ref.current.dontResetOnUnmount = dontResetOnUnmount;

    const renderForm =
      ___renderForm !== undefined ? ___renderForm : _renderForm;

    const rootFormRef = _rootFormRef || _formRef;
    let _thisFormRef = _formRef || ___formRef;
    checkFormRefIsValid(_thisFormRef);
    const __formRef = _getFormRef(_thisFormRef, id);
    let formRef = __formRef;

    if (!formRef) {
      if (id) {
        idRef.current.id = id;
        let newFormRef = _thisFormRef.modifyFormConfig({
          [id]: newFormArray({}),
        });
        _thisFormRef = newFormRef;
        let _valueRef = _getFormRef(_thisFormRef, id);
        formRef = _valueRef;
      }
    } else if (__formRef && _formRef && !__formRef._multipleConfig) {
      if (__formRef._parentRef)
        __formRef._parentRef.modifyFormConfig({
          [__formRef._parentId]: {
            ...__formRef._parentConfig[__formRef._parentId],
            [SCHEMA_CONFIG]: newFormArray({}),
          },
        });
    }

    checkFormRefIsValid(formRef);
    if (!formRef._isMultipleForm)
      throw new Error(
        id
          ? `Invalid: This id (${id}) is configured for simple form. Please use the 'Form.Provider'`
          : `Invalid: This FormRef is configured for simple form. Please use the 'Form.Provider'`
      );

    const valueRef = useRef({});
    const [_, setRefresh] = useState();

    let __setRefresh;
    __setRefresh = (props) => {
      if (_setRefresh) _setRefresh(props);
      setRefresh(props);
    };

    const generate = () => {
      if (formRef[IS_MULTIPLE]._initialValues.length > 0) {
        return formRef[IS_MULTIPLE]._initialValues.map((_values) =>
          generateNewFormRef(
            formRef,
            _values,
            ___formRef,
            rootFormRef,
            !!___formRef._multipleConfig
          )
        );
      }
      return [
        ...Array(typeof defaultCount === "number" ? defaultCount : 0),
      ].map((_values) =>
        generateNewFormRef(
          formRef,
          _values,
          ___formRef,
          rootFormRef,
          !!___formRef._multipleConfig
        )
      );
    };
    const [formRefArray, setFormRefArray] = useState(() => generate());
    valueRef.current.formRefArray = formRefArray;

    const formIdIndex = {};

    const getFormIds = () =>
      valueRef.current.formRefArray.map(({ formId }, _index) => {
        formIdIndex[formId] = _index;
        return formId;
      });

    const formIds = getFormIds();
    valueRef.current.formIds = formIds;
    valueRef.current.formIdIndex = formIdIndex;

    const onChangeOrderForm = useCallback((sourceFormId, targetFormId) => {
      const currentIndex = valueRef.current.formIdIndex[sourceFormId];
      const targetIndex = valueRef.current.formIdIndex[targetFormId];
      if (
        currentIndex !== targetIndex &&
        valueRef.current.formRefArray.length > 1 &&
        targetIndex >= 0 &&
        targetIndex < valueRef.current.formRefArray.length &&
        currentIndex >= 0 &&
        currentIndex < valueRef.current.formRefArray.length
      ) {
        setFormRefArray((_val) => {
          const ___val = _val.slice();
          const __value = ___val[currentIndex];
          if (
            typeof targetIndex === "number" &&
            typeof currentIndex === "number"
          ) {
            ___val.splice(currentIndex, 1);
            ___val.splice(targetIndex, 0, __value);
          }
          return ___val;
        });
      }
    }, []);

    const onSwapForm = useCallback((sourceFormId, targetFormId) => {
      const currentIndex = valueRef.current.formIdIndex[sourceFormId];
      const targetIndex = valueRef.current.formIdIndex[targetFormId];
      if (
        currentIndex !== targetIndex &&
        valueRef.current.formRefArray.length > 1 &&
        targetIndex >= 0 &&
        targetIndex < valueRef.current.formRefArray.length &&
        currentIndex >= 0 &&
        currentIndex < valueRef.current.formRefArray.length
      )
        setFormRefArray((_val) => {
          const ___val = _val.slice();
          const __value = ___val[currentIndex];
          const __value2 = ___val[targetIndex];
          console.log(___val);
          if (
            typeof targetIndex === "number" &&
            typeof currentIndex === "number"
          ) {
            ___val.splice(currentIndex, 1, __value2);
            console.log(___val);
            ___val.splice(targetIndex, 1, __value);
            console.log(___val);
          }
          return ___val;
        });
    }, []);

    const onResetForm = (formIds = []) => {
      const _formIds = Array.isArray(formIds) ? formIds : [formIds];
      _formIds.forEach((_formId) => {
        const form =
          valueRef.current.formRefArray[valueRef.current.formIdIndex[_formId]];
        if (form && form.formRef) form.formRef.resetForm();
      });
    };

    const onClearForm = (formIds = []) => {
      const _formIds = Array.isArray(formIds) ? formIds : [formIds];
      _formIds.forEach((_formId) => {
        const form =
          valueRef.current.formRefArray[valueRef.current.formIdIndex[_formId]];
        if (form && form.formRef) form.formRef.clearForm();
      });
    };

    const onAddMultipleForm = (value = [], formId, formCount = 1, isAppend) => {
      const startIndex =
        valueRef.current.formIdIndex[formId] + (isAppend ? 1 : 0);
      if (startIndex >= 0 && startIndex <= valueRef.current.formRefArray.length)
        setFormRefArray((_val) => {
          let __val = _val.slice();
          const _newFormRef = [...Array(formCount)].map((_, _index) =>
            generateNewFormRef(formRef, value[_index], ___formRef, rootFormRef)
          );
          if (typeof startIndex === "number")
            __val.splice(startIndex, 0, ..._newFormRef);
          else __val.concat(_newFormRef);
          return __val;
        });
    };

    const onAddForm = (value = [], formId, formCount, isAppend) => {
      onAddMultipleForm(
        Array.isArray(value) ? value : value !== undefined ? [value] : [],
        formId,
        formCount,
        isAppend
      );
    };

    const onCloneForm = (sourceFormId, count = 1) => {
      const targetIndex = valueRef.current.formIdIndex[sourceFormId];
      if (
        targetIndex > -1 &&
        targetIndex < valueRef.current.formRefArray.length &&
        valueRef.current.formRefArray[targetIndex] &&
        valueRef.current.formRefArray[targetIndex].formRef
      ) {
        const value =
          valueRef.current.formRefArray[targetIndex].formRef.getValues();
        onAddMultipleForm(Array(count).fill(value), sourceFormId, count);
      }
    };

    const onDeleteMultipleForm = (deleteKey = []) => {
      if (deleteKey.length > 0)
        setFormRefArray((_options) => {
          const __options = _options.slice();
          return __options.filter(({ formId }) => !deleteKey.includes(formId));
        });
    };

    const onDeleteForm = useCallback((formIds = []) => {
      onDeleteMultipleForm(Array.isArray(formIds) ? formIds : [formIds]);
    }, []);

    const getValues = useCallback(() => {
      const _values = valueRef.current.formRefArray.map(({ formRef }) =>
        convertToOriginalData(formRef.getValues())
      );
      return _values;
    }, []);

    const setInitialFormData = useCallback((value = [], isResetValue) => {
      if (!Array.isArray(value)) return getValues();
      if (value.length > valueRef.current.formRefArray.length) {
        const _formArray = value
          .slice(valueRef.current.formRefArray.length)
          .map((_value) =>
            generateNewFormRef(formRef, _value, ___formRef, rootFormRef)
          );
        setFormRefArray(valueRef.current.formRefArray.concat(_formArray));
      }
      return valueRef.current.formRefArray.map(({ formRef }, _i) =>
        formRef.setInitialFormData(value[_i] || {}, isResetValue)
      );
    }, []);

    const setFormErrors = useCallback((error = [], isResetValue) => {
      return valueRef.current.formRefArray.map(({ formRef }, _i) =>
        formRef.setFormErrors(error[_i] || {}, isResetValue)
      );
    }, []);

    const getFormConfig = useCallback(() => {
      return valueRef.current.formRefArray.map(({ formRef }) =>
        formRef.getFormConfig()
      );
    }, []);

    const getFormRef = useCallback((_formId) => {
      if (_formId) {
        const _formRef = valueRef.current.formRefArray.find(
          ({ formId }) => formId === _formId
        );
        if (_formRef) return _formRef.formRef;
        return null;
      }
      return valueRef.current.formRefArray.map(({ formRef }) => formRef);
    }, []);

    const getErrors = useCallback(() => {
      return valueRef.current.formRefArray.map(({ formRef }) =>
        convertToOriginalData(formRef.getErrors())
      );
    }, []);

    const resetForm = useCallback((resetOnlyThisForm) => {
      return valueRef.current.formRefArray.map(({ formRef }) =>
        formRef.resetForm(resetOnlyThisForm)
      );
    }, []);

    const clearForm = useCallback((clearOnlyThisForm) => {
      return valueRef.current.formRefArray.map(({ formRef }) =>
        formRef.clearForm(clearOnlyThisForm)
      );
    }, []);

    const getSampleForm = useCallback(() => {
      if (!valueRef.current.formRefArray.length) return [];
      return valueRef.current.formRefArray.map(({ formRef }) =>
        formRef.getSampleForm()
      );
    }, []);

    const validateForm = useCallback((props) => {
      return valueRef.current.formRefArray.reduce(
        (acc, { formRef }) => {
          const form = formRef.validateForm(props);
          return {
            errorCount: acc.errorCount + form.errorCount,
            isError: acc.isError || form.isError,
            isValidatePassed: acc.isValidatePassed || form.isValidatePassed,
            totalErrorCount: acc.totalErrorCount + form.totalErrorCount,
            errors: acc.errors.concat([form.errors]),
            values: acc.values.concat([form.values]),
          };
        },
        {
          errors: [],
          values: [],
          errorCount: 0,
          totalErrorCount: 0,
          isError: false,
          isValidatePassed: false,
        }
      );
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
      append: (targetFormId, value = [], count) =>
        onAddForm(value, targetFormId, count, true),
      reset: onResetForm,
      clear: onClearForm,
      delete: onDeleteForm,
      clone: onCloneForm,
      swap: onSwapForm,
      move: onChangeOrderForm,
      insert: (targetFormId, value = [], count) =>
        onAddForm(value, targetFormId, count),
      prepend: (targetFormId, value = [], count) => {
        onAddForm(value, targetFormId, count);
      },
      formIds,
    };

    formRef.formArrayProps = multiple;

    rootFormRef._formRef.__formRef__.values =
      rootFormRef._formRef.__formRef__.getValues();
    rootFormRef._formRef.__formRef__.errors =
      rootFormRef._formRef.__formRef__.getErrors();

    useEffect(
      () => () => {
        if (_ref.current.dontResetOnUnmount) {
          rootRef.current.dontResetOnUnmount = _ref.current.dontResetOnUnmount;
        }
      },
      []
    );

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

    useEffect(() => {
      return () => {
        if (rootRef.current.dontResetOnUnmount) {
          if (!formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState)
            formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState =
              formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues;
          formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues = getValues();
        } else {
          formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialValues =
            formRef._ref(IS_FORMREF)[IS_MULTIPLE]._initialState;
        }
        if (idRef.current.id)
          if (!rootRef.current.dontResetOnUnmount) {
            _thisFormRef.deleteFormConfig([idRef.current.id]);
            // _thisFormRef.renderForm();
          }
      };
    }, [_thisFormRef._formId_]);

    if (!formRef._ref(IS_FORMREF)._setRenderForm)
      formRef._ref(IS_FORMREF)._setRenderForm = ___formRef._setRenderForm;

    if (formRef && formRef._formId_) {
      if (formRef) {
        formRef._ref(IS_FORMREF)._setInputProps = (props) => {
          if (_thisFormRef._renderInputProps) _thisFormRef._renderInputProps();
          setRefresh({});
        };
      } else formRef._setInputProps = setRefresh;
    }

    const _multipleProps = {
      ref: formRef,
      ...formRef,
    };

    const _formRefProps = (_index, _ref) => {
      const _props = {
        index: _index,
        totalArrayCount: formRefArray.length,
        append: (value = [], count) =>
          onAddForm(value, formIds[_index], count, true),
        reset: onResetForm.bind(null, formIds[_index]),
        clear: onClearForm.bind(null, formIds[_index]),
        delete: onDeleteForm.bind(null, formIds[_index]),
        clone: onCloneForm.bind(null, formIds[_index]),
        swap: onSwapForm.bind(null, formIds[_index]),
        validate: _ref.validateForm,
        move: (targetFormId) =>
          onChangeOrderForm.bind(null, _index, targetFormId),
        insert: (targetFormId, value = [], count) =>
          onAddForm(value, targetFormId, count),
        prepend: (value = [], count) => {
          onAddForm(value, formIds[_index], count);
        },
      };
      if (ref && "current" in ref) {
        ref.current = ref.current || {};
        ref.current.formArray = formRefArray;
        ref.current.form = _props;
        ref.current.formId = formRef._formId_;
      }
      return {
        ..._props,
        form: _props,
      };
    };
    return (
      <FormContext.Provider
        value={{ formId: _thisFormRef._formId_, setInputProps }}
      >
        <FormRefContext.Provider
          value={{
            formRef,
            formId: formRef._formId_,
            lastUpdated: formRef._lastUpdated,
            renderForm,
            setRefresh: __setRefresh,
            rootFormRef: _rootFormRef || _formRef,
            _rootRef: rootRef,
          }}
        >
          {noAutoLoop
            ? typeof children === "function"
              ? children(formRefArray, _multipleProps)
              : children
            : formRefArray.map((_ref, _i) =>
                typeof children === "function"
                  ? children(
                      {
                        ..._ref,
                        ..._formRefProps(_i, _ref.formRef),
                        index: _i,
                      },
                      _multipleProps,
                      _i
                    )
                  : children
              )}
        </FormRefContext.Provider>
      </FormContext.Provider>
    );
  }
);
