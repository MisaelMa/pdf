import type { Slots } from "vue";

export type VNodePDF = {
    children: VNode[];
  };

export function fetch_node(slots: Slots, slotName = "default"): VNode[] {
    if (slots[slotName]) {
      const slotContent = slots[slotName]!();
  
      const values = slotContent.map((vnode) => {
        return {
          ...vnode,
        }
      /*   //console.log(vnode, "VNODE");
        return {
          __v_isVNode: vnode.__v_isVNode,
          type: vnode.type,
          props: vnode.props,
          key: vnode.key,
          ref: vnode.ref,
          scopeId: vnode.scopeId,
          slotScopeIds: vnode.slotScopeIds,
          children: vnode.children,
          component: vnode.component,
          suspense: vnode.suspense,
          ssContent: vnode.ssContent,
          ssFallback: vnode.ssFallback,
          dirs: vnode.dirs,
          transition: vnode.transition,
          el: vnode.el,
          anchor: vnode.anchor,
          target: vnode.target,
          targetStart: vnode.targetStart,
          targetAnchor: vnode.targetAnchor,
          staticCount: vnode.staticCount,
          shapeFlag: vnode.shapeFlag,
          patchFlag: vnode.patchFlag,
          dynamicProps: vnode.dynamicProps,
          dynamicChildren: vnode.dynamicChildren,
          appContext: vnode.appContext,
          ctx: vnode.ctx,
        };*/
      }); 
  
      return values 
    }
  
    // Si el slot no existe, retornamos un array vacío
    return [];
  }