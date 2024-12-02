export const nodeToJson = (node: any) => {
    return {
        type: node.type,
        props: node.props,
        children: node.children.map((child: any) => nodeToJson(child)),
    };
}