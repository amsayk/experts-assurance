
/**
 * SimpleLineIcons icon set component.
 * Usage: <SimpleLineIcons name='icon-name' size={20} color='#4F8EF7' />
 */

import createIconSet from '../createIconSet';
import glyphMap from './glyphmaps/SimpleLineIcons.json';

const iconSet = createIconSet(glyphMap, 'simple-line-icons');

export default iconSet;

