# @cartoonmangodev/react-form-handler

[@cartoonmangodev/react-form-handler]() is a package for react which simplifies form handling process. it simplifies the implementaion of form validation and error handling.

## # Installation

This package requires **React 16.8.4 or later.**

Use the package manager [npm](https://nodejs.org/en/) or [yarn](https://yarnpkg.com/) to install @cartoonmangodev/react-form-handler.

```bash
$ npm install @cartoonmangodev/react-form-handler
```

or

```bash
$ yarn add @cartoonmangodev/react-form-handler
```

<!-- ## # Setup

[ Beginner Tutorial](https://github.com/cartoonmangodev/react-form-validation) -->

## # Basic usage

### # Form Configuration

    Note:
    - Need to configure form Provider before start using form hook
    - Global config (one time configuration)

```js
/* form.js */
import { FormProvider, Form } from "@cartoonmangodev/react-form";
import { ON_CHANGE } from "@cartoonmangodev/react-form/constants";
const { useForm, useFormRef } = FormProvider({
  ON_CHANGE_KEY: ON_CHANGE /* use ON_CHANGE_TEXT if you are using react-native  */,
});
export { useForm, useFormRef, Form };
```

### # Getting inputprops using hook

```js
/* customInputField.js */
import { useFormConsumer } from "@cartoonmangodev/react-form";

const InputField = React.memo((props) => {
  const { id, name, ...restProps } = props;
  const { inputProps } = useFormConsumer({ id });
  return (
    <div>
      <div>{name}</div>
      <input {...inputProps} {...restProps} />
      {inputProps.error && <span>{inputProps.error}</span>}
    </div>
  );
});
```

### # Getting inputprops using context

```js
/* customInputField.js */
import { Form } from "@cartoonmangodev/react-form";

export const InputField = React.memo((props) => {
  const { id, name, ...restProps } = props;
  return (
    <Form.Consumer id={id}>
      {({ inputProps }) => (
        <div>
          <div>{name}</div>
          <input {...inputProps} {...restProps} />
          {inputProps.error && <span>{inputProps.error}</span>}
        </div>
      )}
    </Form.Consumer>
  );
});
```

### # creating basic form hook config

```js
/* hook.js */
import { useForm } from "./form.js";

const FORM_CONFIG = {
  name: { isRequired: true },
  age: { min: 18, max: 16 },
  comapny: { isRequired: true },
};
export const useFormHook = () =>
  useForm({
    FORM_CONFIG,
  });
```

### # using form hook in component

```js
/* basicForm.js */
import { useEffect, useRef } from "react";
import { useFormHook, Form } from "./hook.js";
import { InputField } from "./customInputField.js";

const BasicForm = () => {
  const { formRef, formId } = useFormHook();
  return (
    <Form.Provider formRef={formRef}>
      <InputField id="name" />
      <InputField id="age" />
      <InputField id="company" />
      <Button onClick={formRef.validateForm}>Submit</Button>
    </Form.Provider>
  );
};
```

### # creating nested form hook config

```js
/* hook.js */
import { newSchema } from "@cartoonmangodev/react-form";
import { useForm } from "./form.js";

const FORM_CONFIG = {
  person: newSchema({
    name: { isRequired: true },
    age: { min: 18, max: 16 },
    comapny: { isRequired: true },
  }),
};
export const useFormHook = () =>
  useForm({
    FORM_CONFIG,
  });
```

### # nested form

```js
/* schemaForm.js */
import { useEffect, useRef } from "react";
import { useFormHook, Form } from "./hook.js";
import { InputField } from "./customInputField.js";

const schemaForm = () => {
  const { formRef, formId } = useFormHook();
  console.log(formRef);
  const submit = useCallback(() => {
    console.log(formRef.validateForm());
  }, []);
  return (
    <Form.Provider formRef={formRef}>
      <Form.Provider id="person">
        <InputField id="name" />
        <InputField id="age" />
        <InputField id="company" />
      </Form.Provider>
      <Button onClick={submit}>Submit</Button>
    </Form.Provider>
  );
};
```

1. **This is the image from console FormRef object**

![  ](./images/1.png)

1. **This is the image from console after submitting form**

![  ](./images/2.png)

## # inputProps - `<Object>`

|  Props   | Default Value |   type   |
| :------: | :-----------: | :------: |
| onChange |   function    | function |
|  onBlur  |   function    | function |
|  value   |      any      | function |
|  error   |    string     | function |

## # Form config props - `<Object>`

|       Props        | Default Value |   type   |                          value                           |                 Description                  |
| :----------------: | :-----------: | :------: | :------------------------------------------------------: | :------------------------------------------: |
|     isRequired     |     false     | Boolean  |                     `true or false`                      |        throws error if field is empty        |
|      optional      |     false     | Boolean  |                     `true or false`                      |       validate only if field has value       |
|        min         |     null      |  number  |                            4                             |            minimum value required            |
|        max         |     null      |  number  |                            8                             |            maximum value required            |
|     maxLength      |     null      |  number  |                            7                             |          maximum characters allowed          |
|     minLength      |     null      |  number  |                            6                             |         minimum characters required          |
|  allowOnlyNumber   |     false     | Boolean  |                     `true or false`                      |          it will allow only number           |
|  allowValidNumber  |     false     |  number  |                     `true or false`                      | check whether entered number is valid or not |
|        type        |     null      |  number  |                    `"email","number"`                    |                validate email                |
|        trim        |     null      | Boolean  |                     `true or false`                      |             it won't allow space             |
|      pattern       |     null      |  regex   |                          `/$d/`                          |       validate based on regex pattern        |
|      message       |     null      |  object  |         `{min: 'mimimum 8 characters required'}`         |   will overwrite the default error message   |
|     validator      |     null      | function | `(value) => ({error: value < 5 ? 'Error' : null,value})` |              custom validation               |
|      callback      |     null      | function |       `({value}) => {console.log('do something')}`       |   callback will triggered after validation   |
|  isValidateOnBlur  |     true      | Boolean  |                     `true or false`                      |            validate field on blur            |
| isValidateOnChange |     true      | Boolean  |                     `true or false`                      |           validate field on change           |
|      vatidate      |     true      | Boolean  |                     `true or false`                      |           validate field on change           |

## # Whether this package will support for react-native

#### **Yes**, this package will support for both [react](https://reactjs.org/) and [react-native](https://reactnative.dev/)

###

<!-- > ### **Note:** Please read the detail documentation from [here](https://cartoonmangodev.github.io/react-boilerplate-redux-saga-hoc-docs/) -->

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Copyright (c) 2023-present Chrissie Fernando
