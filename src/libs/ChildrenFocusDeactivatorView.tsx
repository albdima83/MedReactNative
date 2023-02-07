import {requireNativeComponent, NativeModules, View} from 'react-native';

let ChildrenFocusDeactivatorView = View;

if ('ChildrenFocusDeactivatorView' in NativeModules.UIManager) {
  // eslint-disable-next-line
  ChildrenFocusDeactivatorView = requireNativeComponent(
    'ChildrenFocusDeactivatorView',
  );
}

export default ChildrenFocusDeactivatorView;
