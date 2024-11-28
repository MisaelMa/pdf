import { VNode, Component } from '@vue/runtime-core';
import { render } from 'vue';
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

  const { style = {}, name = '', ref, ...rest } = props || {};
  const extractedData: any = {
    box: {},
    type: name, //  ? type.toUpperCase(): type,
    style: style ?? {},
    props: rest,
    ref: ref,
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
  console.log('type', type);
  const components =type && type.setup ? type.setup({}, { expose: () => {}, }) : {};
// console.log('components', type.render({}, {}, {}, {  }, {}, {}));
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
    console.log("render", ren);
  }
  return ren;
}

export async function createRenderer(component: any) {
  //console.log('component', component);

  const vNode = createVNode(component.type || component, true);
  return vNode;
  if (!Object.keys(vNode).length) {
   // console.log('vNode if', vNode);

    return {
      type: 'ROOT',
      document: {
        children: [],
      },
    };
  }
  return vNode
 // console.log('vNode', vNode);

  const document = await extractDataFromVNode(vNode);

 // console.log('document', document);
  const container = {
    render: vNode,
    type: 'ROOT',
    document,
  };
  return container;
}
