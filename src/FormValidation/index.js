// import {
//   useFormValidationHandlerHook as _useFormValidationHandlerHook,
//   useMultipleOptionsHook,
// } from "react-boilerplate-redux-saga-hoc/utils";
import { FormValidationHandlerProvider } from "./form";
import FormConsumer from "./consumer";
import FormProvider from "./provider";
import MultipleFormProvider from "./multipleProvider";
import { FormController } from "./controller";

const { useFormValidationHook, formValidationHandler, useFormRef } =
  FormValidationHandlerProvider({
    VALIDATOR: null,
    ON_CHANGE_KEY: "onChange",
    ON_BLUR_KEY: "onBlur",
    VALUE: "value",
    ERROR: "error",
  });
// export { useFormValidationHook, useMultipleOptionsHook };
const Form = {
  Consumer: FormConsumer,
  Provider: FormProvider,
  Controller: FormController,
  Multiple: MultipleFormProvider,
};
export { useFormValidationHook, formValidationHandler, useFormRef, Form };
