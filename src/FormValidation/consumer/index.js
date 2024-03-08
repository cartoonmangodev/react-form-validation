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

const ConsumerWithoutMemo = ({ children, ...props }) => {
  return typeof children === "function" ? children(props) : children;
};

export default ({ children, render, ...props }) =>
  props.id && !render ? (
    <Consumer {...useConsumerHook(props)}>{children}</Consumer>
  ) : (
    <ConsumerWithoutMemo {...useConsumerHook(props)}>
      {children}
    </ConsumerWithoutMemo>
  );

export { useFormConsumer } from "./useConsumer";
