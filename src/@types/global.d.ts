declare module "*.ttf";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";

declare interface StoreObject {
  lang: string
  theme: 'dark' | 'light'
}

declare interface CSSInlineStyleType {
  bs?: BoxSizingType
  position?: PositionType
  zIndex?: ZIndexType
  top?: PosType
  right?: PosType
  bottom?: PosType
  left?: PosType
  display?: DisplayType
  flex?: FlexType
  fBasis?: FlexBasisType
  fDir?: FlexDirectionType
  fFlow?: FlexFlowType
  fGrow?: FlexGrowType
  fShrink?: FlexShrinkType
  fWrap?: FlexWrapType
  alignContent?: AlignContentType
  alignItems?: AlignItemsType
  vAlign?: AlignItemsType
  alignSelf?: AlignSelfType
  alignTracks?: AlignTracksType
  justifyContent?: JustifyContentType
  hAlign?: JustifyContentType
  justifyItems?: JustifyItemsType
  justifySelf?: JustifySelfType
  justifyTracks?: JustifyTracksType
  g?: GapType
  gx?: GapType
  gy?: GapType
  h?: HeightType
  w?: WidthType
  minW?: WidthType
  maxW?: WidthType
  p?: PaddingType
  px?: PaddingType
  py?: PaddingType
  pt?: PaddingType
  pr?: PaddingType
  pb?: PaddingType
  pl?: PaddingType
  m?: MarginType
  mx?: MarginType
  my?: MarginType
  mt?: MarginType
  mr?: MarginType
  mb?: MarginType
  ml?: MarginType
  bg?: BgType
  fFamily?: FontFamilyType
  fSize?: FontSizeType
  fWeight?: FontWeightType
  tAlign?: TextAlignType
  txtTrans?: TextTransformType
  color?: ColorType
  bgAttachment?: BgAttachmentType
  bgBlendMode?: BgBlendModeType
  bgClip?: BgClipType
  bgColor?: BgColorType
  bgImg?: BgImageType
  bgOrigin?: BgOriginType
  bgPos?: BgPositionType
  bgPosX?: BgPositionXType
  bgPoxY?: BgPositionYType
  bgRepeat?: BgRepeatType
  bgSize?: BgSizeType
  backdrop?: BackdropFilterType
  bd?: BorderType
  bdt?: BorderType
  bdr?: BorderType
  bdb?: BorderType
  bdl?: BorderType
  overflow?: OverflowType
  overflowX?: OverflowType
  overflowY?: OverflowType
  cursor?: CursorType
  content?: ContentType
  clipPath?: ClipPathType
}

declare interface CSSElementStyleType extends CSSInlineStyleType {
  after?: CSSInlineStyleType
  before?: CSSInlineStyleType
  hover?: CSSInlineStyleType
  active?: CSSInlineStyleType
  other?: string
}

declare interface CSSResponsiveStyleType extends CSSElementStyleType {
  mobileS?: CSSElementStyleType
  mobileM?: CSSElementStyleType
  mobileL?: CSSElementStyleType
  tablet?: CSSElementStyleType
  laptop?: CSSElementStyleType
  laptopL?: CSSElementStyleType
  desktop?: CSSElementStyleType
  desktopL?: CSSElementStyleType
}

declare interface ElementEventType {
  onClick?: () => void
  onChange?: () => void
}

declare interface ElementDefaultProps extends CSSResponsiveStyleType, HTMLAttributes, ElementEventType { }