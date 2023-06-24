import { compose } from '@react-pdf/fns/src';
import expandStyles from './expand';
import flattenStyles from './flatten';
import resolveMediaQueries from './mediaQueries';
import transformStyles from './transform';

/**
 * Resolves styles
 *
 * @param {Object} container
 * @param {Object} style object
 * @returns {Object} resolved style object
 */
const resolveStyles = (container, style) => {
  const computeMediaQueries = value => resolveMediaQueries(container, value);

  return compose(
    transformStyles(container),
    expandStyles,
    computeMediaQueries,
    flattenStyles,
  )(style);
};

// Utils exported for SVG processing
export { default as transformColor } from './transform/colors';

export { default as processTransform } from './transform/transform';

export { default as flatten } from './flatten';

export default resolveStyles;
