import checkPropTypes from 'check-prop-types';

export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-testid="${val}"]`);
};

export const checkProps = (component, conformingProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    conformingProps,
    'prop',
    component.name);
  expect(propError).toBeUndefined();
};

export const authContext = {
  authUser: {
    uid: 1,
    email: 'test@example.com',
    providerData: ["google.com"],
  },
  dbUser: {
    displayName: "Jane Smith",
  },
  loading: false
};
