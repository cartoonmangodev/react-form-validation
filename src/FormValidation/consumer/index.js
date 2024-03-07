/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, { memo } from "react";
import useConsumerHook from "./consumerHook";

const Consumer = memo(
  ({ children, ...props }) => {
    return typeof children === "function" ? children(props) : children;
  },
  (prev, next) =>
    prev.inputProps.value === next.inputProps.value &&
    prev.inputProps.error === next.inputProps.error &&
    (prev._inputFieldConfig && prev._inputFieldConfig._config.lastUpdated) ===
      (next._inputFieldConfig && next._inputFieldConfig._config.lastUpdated)
);

const ConsumerWithoutId = ({ children, ...props }) => {
  return typeof children === "function" ? children(props) : children;
};

export default ({ children, ...props }) =>
  props.id ? (
    <Consumer {...useConsumerHook(props)}>{children}</Consumer>
  ) : (
    <ConsumerWithoutId {...useConsumerHook(props)}>
      {children}
    </ConsumerWithoutId>
  );

export { useFormConsumer } from "./useConsumer";
