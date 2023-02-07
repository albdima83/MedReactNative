import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Screen resolution (points): 390 x 844
// Native resolution (pixels): 1170 x 2532 (460 ppi)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size:number) => width / guidelineBaseWidth * size;
const verticalScale = (size:number) => height / guidelineBaseHeight * size;
const moderateScale = (size:number, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};