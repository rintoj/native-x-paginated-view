import * as React from 'react'
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { styles as s } from 'tachyons-react-native'

interface Props {
  children: ReactNode[] | ReactNode
  style?: ViewStyle
  scrollEnabled?: boolean
  animated?: boolean
  showsHorizontalScrollIndicator?: boolean
  onIndexChange?: (index: number) => void
  keepAlreadyRendered?: boolean
  cachedPageCount?: number
  containerWidth?: number
  dynamicWidth?: boolean
}

export interface PaginatedViewRef {
  goto: (index: number, animate?: boolean) => void
}

function PaginatedViewComponent(props: Props, ref: Ref<any>) {
  const {
    cachedPageCount = 3,
    showsHorizontalScrollIndicator,
    children,
    onIndexChange,
    keepAlreadyRendered = true,
    scrollEnabled = true,
    animated = true,
    dynamicWidth = false,
    containerWidth,
    style = [s.flex],
  } = props

  const screenSize = useWindowDimensions()
  const alreadyRendered = useRef<any>({})
  const scrollView = useRef<ScrollView>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [maxContainerWidth, setMaxContainerWidth] = useState<number>(screenSize.width as number)

  const contentContainerWidth = useMemo(() => containerWidth || screenSize.width, [
    containerWidth,
    screenSize.width,
  ])

  const pages = React.Children.toArray(children)
  const itemCount = pages.length
  const totalWidth = itemCount * contentContainerWidth
  const isScrollEnabled = scrollEnabled && animated

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => setMaxContainerWidth(event.nativeEvent.layout.width),
    [],
  )

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = event.nativeEvent.contentOffset.x
      const finalIndex = Math.round(x / maxContainerWidth)
      setIsScrolling(false)

      setSelectedIndex(finalIndex)
      onIndexChange?.(finalIndex)
    },
    [onIndexChange, maxContainerWidth],
  )

  const onMomentumScrollBegin = useCallback(() => setIsScrolling(true), [])

  const shouldRenderPage = useCallback(
    (index: number) => {
      const cachedCount = cachedPageCount || 1
      return (
        selectedIndex != undefined &&
        ((index >= selectedIndex - cachedCount && index <= selectedIndex + cachedCount) ||
          (keepAlreadyRendered && alreadyRendered.current[index] === true))
      )
    },
    [cachedPageCount, selectedIndex, keepAlreadyRendered, alreadyRendered],
  )

  useImperativeHandle(ref, () => ({
    goto: (index: number, animate: boolean = animated) => {
      if (!isScrolling && index != undefined && index < itemCount) {
        const x = index * maxContainerWidth
        scrollView.current?.scrollTo({ x, animated: animate })
      }
    },
  }))

  const pageStyle = useMemo(() => [s.flex, s.h100, { width: contentContainerWidth }], [
    contentContainerWidth,
  ])

  const content = (
    <View style={[s.flexRow, s.flex, s.overflowHidden, { width: totalWidth }]}>
      {pages.map((page, index) => (
        <View key={index} style={pageStyle}>
          {shouldRenderPage(index) ? page : <ActivityIndicator />}
        </View>
      ))}
    </View>
  )

  return (
    <View style={style}>
      <ScrollView
        ref={scrollView}
        scrollEnabled={isScrollEnabled}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        overScrollMode={'never'}
        keyboardShouldPersistTaps='always'
        directionalLockEnabled={false}
        horizontal
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator || false}
        onLayout={dynamicWidth ? onLayout : undefined}
      >
        {content}
      </ScrollView>
    </View>
  )
}

export const PaginatedView = React.memo(forwardRef(PaginatedViewComponent))
