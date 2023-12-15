import { FormControllerContext } from "./context";

export const FormController = ({
  children,
  hide,
  render,
  inputConfig,
  ...rest
}) => {
  return hide ? null : (
    <FormControllerContext.Provider value={{ render, inputConfig, ...rest }}>
      {children}
    </FormControllerContext.Provider>
  );
};
