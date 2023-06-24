import { asyncCompose } from '@react-pdf/fns/src';
import resolveAssets from './steps/resolveAssets';
import resolveBookmarks from './steps/resolveBookmarks';
import resolveDimensions from './steps/resolveDimensions';
import resolveInheritance from './steps/resolveInheritance';
import resolveLinkSubstitution from './steps/resolveLinkSubstitution';
import resolveOrigins from './steps/resolveOrigins';
import resolvePagePaddings from './steps/resolvePagePaddings';
import resolvePageSizes from './steps/resolvePageSizes';
import resolvePagination from './steps/resolvePagination';
import resolvePercentHeight from './steps/resolvePercentHeight';
import resolvePercentRadius from './steps/resolvePercentRadius';
import resolveStyles from './steps/resolveStyles';
import resolveSvg from './steps/resolveSvg';
import resolveTextLayout from './steps/resolveTextLayout';
import resolveZIndex from './steps/resolveZIndex';

const layout = asyncCompose(
  resolveZIndex,
  resolveOrigins,
  resolvePagination,
  resolveTextLayout,
  resolvePercentRadius,
  resolveDimensions,
  resolveSvg,
  resolveAssets,
  resolveInheritance,
  resolvePercentHeight,
  resolvePagePaddings,
  resolveStyles,
  resolveLinkSubstitution,
  resolveBookmarks,
  resolvePageSizes,
);

export default layout;
