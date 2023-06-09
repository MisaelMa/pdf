const Yoga = require('..');

describe('Rounding', () => {
  test('rounding_flex_basis_flex_grow_row_width_of_100', () => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    root.setWidth(100);
    root.setHeight(100);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(33);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(33);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(34);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(67);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(33);
    expect(root_child2.getComputedHeight()).toBe(100);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(67);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(33);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(33);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(34);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(33);
    expect(root_child2.getComputedHeight()).toBe(100);
  });

  test('rounding_flex_basis_flex_grow_row_prime_number_width', () => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    root.setWidth(113);
    root.setHeight(100);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root.insertChild(root_child2, 2);

    const root_child3 = Yoga.Node.create();
    root_child3.setFlexGrow(1);
    root.insertChild(root_child3, 3);

    const root_child4 = Yoga.Node.create();
    root_child4.setFlexGrow(1);
    root.insertChild(root_child4, 4);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(113);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(23);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(23);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(22);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(45);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(23);
    expect(root_child2.getComputedHeight()).toBe(100);

    expect(root_child3.getComputedLeft()).toBe(68);
    expect(root_child3.getComputedTop()).toBe(0);
    expect(root_child3.getComputedWidth()).toBe(22);
    expect(root_child3.getComputedHeight()).toBe(100);

    expect(root_child4.getComputedLeft()).toBe(90);
    expect(root_child4.getComputedTop()).toBe(0);
    expect(root_child4.getComputedWidth()).toBe(23);
    expect(root_child4.getComputedHeight()).toBe(100);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(113);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(90);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(23);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(68);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(22);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(45);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(23);
    expect(root_child2.getComputedHeight()).toBe(100);

    expect(root_child3.getComputedLeft()).toBe(23);
    expect(root_child3.getComputedTop()).toBe(0);
    expect(root_child3.getComputedWidth()).toBe(22);
    expect(root_child3.getComputedHeight()).toBe(100);

    expect(root_child4.getComputedLeft()).toBe(0);
    expect(root_child4.getComputedTop()).toBe(0);
    expect(root_child4.getComputedWidth()).toBe(23);
    expect(root_child4.getComputedHeight()).toBe(100);
  });

  test('rounding_flex_basis_flex_shrink_row', () => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    root.setWidth(101);
    root.setHeight(100);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexShrink(1);
    root_child0.setFlexBasis(100);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexBasis(25);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexBasis(25);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(101);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(51);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(51);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(25);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(76);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(25);
    expect(root_child2.getComputedHeight()).toBe(100);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(101);
    expect(root.getComputedHeight()).toBe(100);

    expect(root_child0.getComputedLeft()).toBe(50);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(51);
    expect(root_child0.getComputedHeight()).toBe(100);

    expect(root_child1.getComputedLeft()).toBe(25);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(25);
    expect(root_child1.getComputedHeight()).toBe(100);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(25);
    expect(root_child2.getComputedHeight()).toBe(100);
  });

  test('rounding_flex_basis_overrides_main_size', () => {
    const root = Yoga.Node.create();
    root.setWidth(100);
    root.setHeight(113);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setFlexBasis(50);
    root_child0.setHeight(20);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);
  });

  test('rounding_total_fractial', () => {
    const root = Yoga.Node.create();
    root.setWidth(87.4);
    root.setHeight(113.4);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(0.7);
    root_child0.setFlexBasis(50.3);
    root_child0.setHeight(20.3);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1.6);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1.1);
    root_child2.setHeight(10.7);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(87);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(87);
    expect(root_child0.getComputedHeight()).toBe(59);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(59);
    expect(root_child1.getComputedWidth()).toBe(87);
    expect(root_child1.getComputedHeight()).toBe(30);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(87);
    expect(root_child2.getComputedHeight()).toBe(24);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(87);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(87);
    expect(root_child0.getComputedHeight()).toBe(59);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(59);
    expect(root_child1.getComputedWidth()).toBe(87);
    expect(root_child1.getComputedHeight()).toBe(30);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(87);
    expect(root_child2.getComputedHeight()).toBe(24);
  });

  test('rounding_total_fractial_nested', () => {
    const root = Yoga.Node.create();
    root.setWidth(87.4);
    root.setHeight(113.4);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(0.7);
    root_child0.setFlexBasis(50.3);
    root_child0.setHeight(20.3);
    root.insertChild(root_child0, 0);

    const root_child0_child0 = Yoga.Node.create();
    root_child0_child0.setFlexGrow(1);
    root_child0_child0.setFlexBasis(0.3);
    root_child0_child0.setPosition(Yoga.EDGE_BOTTOM, 13.3);
    root_child0_child0.setHeight(9.9);
    root_child0.insertChild(root_child0_child0, 0);

    const root_child0_child1 = Yoga.Node.create();
    root_child0_child1.setFlexGrow(4);
    root_child0_child1.setFlexBasis(0.3);
    root_child0_child1.setPosition(Yoga.EDGE_TOP, 13.3);
    root_child0_child1.setHeight(1.1);
    root_child0.insertChild(root_child0_child1, 1);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1.6);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1.1);
    root_child2.setHeight(10.7);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(87);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(87);
    expect(root_child0.getComputedHeight()).toBe(59);

    expect(root_child0_child0.getComputedLeft()).toBe(0);
    expect(root_child0_child0.getComputedTop()).toBe(-13);
    expect(root_child0_child0.getComputedWidth()).toBe(87);
    expect(root_child0_child0.getComputedHeight()).toBe(12);

    expect(root_child0_child1.getComputedLeft()).toBe(0);
    expect(root_child0_child1.getComputedTop()).toBe(25);
    expect(root_child0_child1.getComputedWidth()).toBe(87);
    expect(root_child0_child1.getComputedHeight()).toBe(47);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(59);
    expect(root_child1.getComputedWidth()).toBe(87);
    expect(root_child1.getComputedHeight()).toBe(30);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(87);
    expect(root_child2.getComputedHeight()).toBe(24);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(87);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(87);
    expect(root_child0.getComputedHeight()).toBe(59);

    expect(root_child0_child0.getComputedLeft()).toBe(0);
    expect(root_child0_child0.getComputedTop()).toBe(-13);
    expect(root_child0_child0.getComputedWidth()).toBe(87);
    expect(root_child0_child0.getComputedHeight()).toBe(12);

    expect(root_child0_child1.getComputedLeft()).toBe(0);
    expect(root_child0_child1.getComputedTop()).toBe(25);
    expect(root_child0_child1.getComputedWidth()).toBe(87);
    expect(root_child0_child1.getComputedHeight()).toBe(47);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(59);
    expect(root_child1.getComputedWidth()).toBe(87);
    expect(root_child1.getComputedHeight()).toBe(30);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(87);
    expect(root_child2.getComputedHeight()).toBe(24);
  });

  test('rounding_fractial_input_1', () => {
    const root = Yoga.Node.create();
    root.setWidth(100);
    root.setHeight(113.4);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setFlexBasis(50);
    root_child0.setHeight(20);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);
  });

  test('rounding_fractial_input_2', () => {
    const root = Yoga.Node.create();
    root.setWidth(100);
    root.setHeight(113.6);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setFlexBasis(50);
    root_child0.setHeight(20);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(114);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(65);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(65);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(24);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(25);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(114);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(65);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(65);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(24);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(25);
  });

  test('rounding_fractial_input_3', () => {
    const root = Yoga.Node.create();
    root.setPosition(Yoga.EDGE_TOP, 0.3);
    root.setWidth(100);
    root.setHeight(113.4);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setFlexBasis(50);
    root_child0.setHeight(20);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(114);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(65);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(24);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(25);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(114);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(65);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(24);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(25);
  });

  test('rounding_fractial_input_4', () => {
    const root = Yoga.Node.create();
    root.setPosition(Yoga.EDGE_TOP, 0.7);
    root.setWidth(100);
    root.setHeight(113.4);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setFlexBasis(50);
    root_child0.setHeight(20);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(1);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(1);
    expect(root.getComputedWidth()).toBe(100);
    expect(root.getComputedHeight()).toBe(113);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(100);
    expect(root_child0.getComputedHeight()).toBe(64);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(64);
    expect(root_child1.getComputedWidth()).toBe(100);
    expect(root_child1.getComputedHeight()).toBe(25);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(89);
    expect(root_child2.getComputedWidth()).toBe(100);
    expect(root_child2.getComputedHeight()).toBe(24);
  });

  test('rounding_inner_node_controversy_horizontal', () => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    root.setWidth(320);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setHeight(10);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeight(10);
    root.insertChild(root_child1, 1);

    const root_child1_child0 = Yoga.Node.create();
    root_child1_child0.setFlexGrow(1);
    root_child1_child0.setHeight(10);
    root_child1.insertChild(root_child1_child0, 0);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeight(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(320);
    expect(root.getComputedHeight()).toBe(10);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(107);
    expect(root_child0.getComputedHeight()).toBe(10);

    expect(root_child1.getComputedLeft()).toBe(107);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(106);
    expect(root_child1.getComputedHeight()).toBe(10);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(106);
    expect(root_child1_child0.getComputedHeight()).toBe(10);

    expect(root_child2.getComputedLeft()).toBe(213);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(107);
    expect(root_child2.getComputedHeight()).toBe(10);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(320);
    expect(root.getComputedHeight()).toBe(10);

    expect(root_child0.getComputedLeft()).toBe(213);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(107);
    expect(root_child0.getComputedHeight()).toBe(10);

    expect(root_child1.getComputedLeft()).toBe(107);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(106);
    expect(root_child1.getComputedHeight()).toBe(10);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(106);
    expect(root_child1_child0.getComputedHeight()).toBe(10);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(107);
    expect(root_child2.getComputedHeight()).toBe(10);
  });

  test('rounding_inner_node_controversy_vertical', () => {
    const root = Yoga.Node.create();
    root.setHeight(320);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setWidth(10);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setWidth(10);
    root.insertChild(root_child1, 1);

    const root_child1_child0 = Yoga.Node.create();
    root_child1_child0.setFlexGrow(1);
    root_child1_child0.setWidth(10);
    root_child1.insertChild(root_child1_child0, 0);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setWidth(10);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(10);
    expect(root.getComputedHeight()).toBe(320);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(10);
    expect(root_child0.getComputedHeight()).toBe(107);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(107);
    expect(root_child1.getComputedWidth()).toBe(10);
    expect(root_child1.getComputedHeight()).toBe(106);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(10);
    expect(root_child1_child0.getComputedHeight()).toBe(106);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(213);
    expect(root_child2.getComputedWidth()).toBe(10);
    expect(root_child2.getComputedHeight()).toBe(107);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(10);
    expect(root.getComputedHeight()).toBe(320);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(10);
    expect(root_child0.getComputedHeight()).toBe(107);

    expect(root_child1.getComputedLeft()).toBe(0);
    expect(root_child1.getComputedTop()).toBe(107);
    expect(root_child1.getComputedWidth()).toBe(10);
    expect(root_child1.getComputedHeight()).toBe(106);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(10);
    expect(root_child1_child0.getComputedHeight()).toBe(106);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(213);
    expect(root_child2.getComputedWidth()).toBe(10);
    expect(root_child2.getComputedHeight()).toBe(107);
  });

  test('rounding_inner_node_controversy_combined', () => {
    const root = Yoga.Node.create();
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    root.setWidth(640);
    root.setHeight(320);

    const root_child0 = Yoga.Node.create();
    root_child0.setFlexGrow(1);
    root_child0.setHeightPercent(100);
    root.insertChild(root_child0, 0);

    const root_child1 = Yoga.Node.create();
    root_child1.setFlexGrow(1);
    root_child1.setHeightPercent(100);
    root.insertChild(root_child1, 1);

    const root_child1_child0 = Yoga.Node.create();
    root_child1_child0.setFlexGrow(1);
    root_child1_child0.setWidthPercent(100);
    root_child1.insertChild(root_child1_child0, 0);

    const root_child1_child1 = Yoga.Node.create();
    root_child1_child1.setFlexGrow(1);
    root_child1_child1.setWidthPercent(100);
    root_child1.insertChild(root_child1_child1, 1);

    const root_child1_child1_child0 = Yoga.Node.create();
    root_child1_child1_child0.setFlexGrow(1);
    root_child1_child1_child0.setWidthPercent(100);
    root_child1_child1.insertChild(root_child1_child1_child0, 0);

    const root_child1_child2 = Yoga.Node.create();
    root_child1_child2.setFlexGrow(1);
    root_child1_child2.setWidthPercent(100);
    root_child1.insertChild(root_child1_child2, 2);

    const root_child2 = Yoga.Node.create();
    root_child2.setFlexGrow(1);
    root_child2.setHeightPercent(100);
    root.insertChild(root_child2, 2);
    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(640);
    expect(root.getComputedHeight()).toBe(320);

    expect(root_child0.getComputedLeft()).toBe(0);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(213);
    expect(root_child0.getComputedHeight()).toBe(320);

    expect(root_child1.getComputedLeft()).toBe(213);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(214);
    expect(root_child1.getComputedHeight()).toBe(320);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(214);
    expect(root_child1_child0.getComputedHeight()).toBe(107);

    expect(root_child1_child1.getComputedLeft()).toBe(0);
    expect(root_child1_child1.getComputedTop()).toBe(107);
    expect(root_child1_child1.getComputedWidth()).toBe(214);
    expect(root_child1_child1.getComputedHeight()).toBe(106);

    expect(root_child1_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child1_child0.getComputedWidth()).toBe(214);
    expect(root_child1_child1_child0.getComputedHeight()).toBe(106);

    expect(root_child1_child2.getComputedLeft()).toBe(0);
    expect(root_child1_child2.getComputedTop()).toBe(213);
    expect(root_child1_child2.getComputedWidth()).toBe(214);
    expect(root_child1_child2.getComputedHeight()).toBe(107);

    expect(root_child2.getComputedLeft()).toBe(427);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(213);
    expect(root_child2.getComputedHeight()).toBe(320);

    root.calculateLayout(undefined, undefined, Yoga.DIRECTION_RTL);

    expect(root.getComputedLeft()).toBe(0);
    expect(root.getComputedTop()).toBe(0);
    expect(root.getComputedWidth()).toBe(640);
    expect(root.getComputedHeight()).toBe(320);

    expect(root_child0.getComputedLeft()).toBe(427);
    expect(root_child0.getComputedTop()).toBe(0);
    expect(root_child0.getComputedWidth()).toBe(213);
    expect(root_child0.getComputedHeight()).toBe(320);

    expect(root_child1.getComputedLeft()).toBe(213);
    expect(root_child1.getComputedTop()).toBe(0);
    expect(root_child1.getComputedWidth()).toBe(214);
    expect(root_child1.getComputedHeight()).toBe(320);

    expect(root_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child0.getComputedWidth()).toBe(214);
    expect(root_child1_child0.getComputedHeight()).toBe(107);

    expect(root_child1_child1.getComputedLeft()).toBe(0);
    expect(root_child1_child1.getComputedTop()).toBe(107);
    expect(root_child1_child1.getComputedWidth()).toBe(214);
    expect(root_child1_child1.getComputedHeight()).toBe(106);

    expect(root_child1_child1_child0.getComputedLeft()).toBe(0);
    expect(root_child1_child1_child0.getComputedTop()).toBe(0);
    expect(root_child1_child1_child0.getComputedWidth()).toBe(214);
    expect(root_child1_child1_child0.getComputedHeight()).toBe(106);

    expect(root_child1_child2.getComputedLeft()).toBe(0);
    expect(root_child1_child2.getComputedTop()).toBe(213);
    expect(root_child1_child2.getComputedWidth()).toBe(214);
    expect(root_child1_child2.getComputedHeight()).toBe(107);

    expect(root_child2.getComputedLeft()).toBe(0);
    expect(root_child2.getComputedTop()).toBe(0);
    expect(root_child2.getComputedWidth()).toBe(213);
    expect(root_child2.getComputedHeight()).toBe(320);
  });
});
