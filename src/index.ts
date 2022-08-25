/*
 * @Author: lyu
 * @Date: 2022-08-10 11:11:24
 */

import type { App, Directive, VNode, DirectiveBinding, ComponentInternalInstance } from 'vue';
import { isBoolean, isPromise, isFunction } from './utils';

interface CustomStyle {
  cursor: string;
  opacity: number;
  userSelect: string;
}
interface VNodeNormalizedRef {
  i: ComponentInternalInstance;
}
type ClickFunc = (e: MouseEvent, callback: () => void) => void | boolean | Promise<boolean>;
/**
 * 自定义防重指令
 * @param app APP
 * @param directiveName 指令名称
 */
export function autoLoadingDirective(app: App, directiveName = 'auto-loading') {
  const elWeakMap = new WeakMap();
  let comProps: Record<string, any> | null = null;
  const defaultStyle: CustomStyle = {
    cursor: 'pointer',
    opacity: 1,
    userSelect: 'unset'
  };
  const disabledStyle: CustomStyle = {
    cursor: 'not-allowed',
    opacity: 0.4,
    userSelect: 'none'
  };
  const destroy = (el: HTMLElement, isComponent: boolean) => {
    if (isComponent) {
      const props = elWeakMap.get(el);
      props.loading = false;
      props.disabled = false;

      elWeakMap.delete(el);
    } else {
      Object.assign(el.style, defaultStyle);
      elWeakMap.delete(el);
    }
  };

  function listenerHandler(el: HTMLElement, binding: DirectiveBinding<ClickFunc>, vnode: VNode, e: MouseEvent) {
    const isComponent = vnode.ref !== null;
    const curStyle = elWeakMap.has(el);

    if (!isComponent && curStyle) {
      return;
    }

    e.stopPropagation();
    const componentInstance: ComponentInternalInstance = (vnode.ref as VNodeNormalizedRef)?.i;

    if (isComponent && componentInstance) {
      comProps = componentInstance.props || {};
      comProps.loading = true;
      comProps.disabled = true;
      elWeakMap.set(el, comProps);
    } else {
      Object.assign(el.style, disabledStyle);
      elWeakMap.set(el, disabledStyle);
    }

    const clickFunc: ClickFunc | null = isFunction(binding.value) ? binding.value : null;

    if (clickFunc === null) {
      return;
    }

    const returnValue = clickFunc(e, () => destroy(el, isComponent));

    if (isBoolean(returnValue)) {
      returnValue && destroy(el, isComponent);
    } else if (isPromise(returnValue)) {
      (returnValue as Promise<boolean>).then(val => val && destroy(el, isComponent));
    }
  }

  let scopedListener: (e: MouseEvent) => void;

  const autoLoadingDirective: Directive<HTMLElement, ClickFunc> = {
    mounted(el, binding, vnode) {
      if (!binding.value || !isFunction(binding.value)) {
        console.error('binding.value is not a function');
        return
      }
      scopedListener = listenerHandler.bind(null, el, binding, vnode);

      if (!vnode.ref) {
        el.style.cursor = 'pointer';
      }

      el.addEventListener('click', scopedListener, { capture: true });
    },
    unmounted(el, binding) {
      if (!binding.value) return;

      el.removeEventListener('click', scopedListener, { capture: true });
    }
  };

  app.directive(directiveName, autoLoadingDirective);
}
