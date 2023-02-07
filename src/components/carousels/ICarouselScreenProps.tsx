import { ListRenderItem } from '@shopify/flash-list';
import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  Carousel,
  CarouselItem,
  CarouselItemLayout,
  CarouselLayout,
} from '../../models/app.models';

export interface ICarouselScreenProps {
  carousel: Carousel;
  carouselLayout: CarouselLayout;
  index: number;
  hasTVPreferredFocus?: boolean;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  onSectionFocus?: (carousel: Carousel, index: number) => void;
}

export interface ICarouselItemsScreenProps {
  items?: Array<CarouselItem>;
  index: number;
  template: string;
  itemLayout: CarouselItemLayout;
  showTitle?: boolean;
  fallbackTemplate?: string;
  style?: StyleProp<ViewStyle>;
  onFocus?: (item: CarouselItem, index: number) => void;
  renderItem?: (item: CarouselItem, index: number) => ReactElement | null;
}

export interface ICarouselItemView {
  index: number;
  item: CarouselItem;
  template: string;
  itemLayout?: CarouselItemLayout;
  fallbackTemplate?: string;
  hasTVPreferredFocus?: boolean;
  blockFocusRight?: boolean;
  showTitle?: boolean;
  onEnterPress?: (item: CarouselItem) => void;
  onFocus?: (item: CarouselItem, index: number) => void;
}