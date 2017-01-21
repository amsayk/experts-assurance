
/**
 * MaterialIcons icon set component.
 * Usage: <MaterialIcons name='icon-name' size={20} color='#4F8EF7' />
 */

import createIconSet from '../createIconSet';
import glyphMap from './glyphmaps/MaterialIcons.json';

const iconSet = createIconSet(glyphMap, 'Material Icons');

export default iconSet;

