import {Dimensions} from 'react-native';
import { scale } from './scalingHelper';

const {width, height} = Dimensions.get('window');

console.log(`@@@@ SCREEN UTILS : [${width} x ${height}]`);

const getCarouselHeight = (containerH:number,h: number): number => {
  const hScale = scale(h);
  const cHeight = (hScale ?? 0) > 0 ? hScale : containerH + hScale;
  return cHeight;
};

const getCarouselWidth = (containerW:number,w: number): number => {
  const wScale = scale(w);
  const cwidth = (wScale ?? 0) > 0 ? wScale : containerW + wScale;
  return cwidth;
};



export {getCarouselHeight, getCarouselWidth};
