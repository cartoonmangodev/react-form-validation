// import {
//   useFormValidationHandlerHook as _useFormValidationHandlerHook,
//   useMultipleOptionsHook,
// } from "react-boilerplate-redux-saga-hoc/utils";
import FormConsumer, { useFormConsumer } from "./consumer";
import FormProvider from "./provider";
import MultipleFormProvider from "./multipleProvider";
import { FormController } from "./controller";

export { FormProvider } from "./form";
export const Form = {
  Consumer: FormConsumer,
  Provider: FormProvider,
  Controller: FormController,
  Multiple: MultipleFormProvider,
  Array: MultipleFormProvider,
};
export { useFormConsumer };
