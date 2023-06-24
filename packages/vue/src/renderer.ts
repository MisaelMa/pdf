import { VNodeTypes } from '@vue/runtime-core';
interface Extract extends Record<string, any> {}
export async function extractDataFromVNode(vnode: Extract) {
  if (!vnode) {
    return null;
  }

  const { type, props, children } = vnode;
  const mySymbol = Symbol.for('v-txt');

  if (type === mySymbol) {
    return {
      type: 'TEXT_INSTANCE',
      value: children,
    };
  }

  const { style = {}, name = '', ...rest } = props || {};
  const extractedData: any = {
    box: {},
    type: name, //  ? type.toUpperCase(): type,
    style: style ?? {},
    props: rest,
    children: [],
  };

  if (Array.isArray(children)) {
    children.forEach(async (child) => {
      const extractedChild = await extractDataFromVNode(child);
      if (extractedChild) {
        extractedData.children.push(extractedChild);
      }
    });
  }

  return extractedData;
}
export function createVNode(type: any, show: boolean = false) {
  const newCompone: Record<string, any> = {};
  const components =
    type && type.setup ? type.setup({}, { expose: () => {} }) : {};

  for (let d of Object.keys(components)) {
    if (components[d].render) {
      newCompone[d] = createVNode(components[d]);
    } else {
      newCompone[d] = components[d];
    }
  }
  const ren =
    type && type.render
      ? type.render({}, {}, {}, { ...newCompone }, {}, {})
      : {};
  if (show) {
    console.log(ren);
  }
  return ren;
}

export async function createRenderer(component: any) {
  console.log('component', component);

  const vNode = createVNode(component.type || component, true);
  if (!Object.keys(vNode).length) {
    console.log('vNode if', vNode);

    return {
      type: 'ROOT',
      document: {
        children: [],
      },
    };
  }
  console.log('vNode', vNode);

  const document = await extractDataFromVNode(vNode);

  console.log('document', document);
  const container = {
    type: 'ROOT',
    document,
  };
  return container;
}
