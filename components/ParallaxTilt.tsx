import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  /** Max tilt in degrees */
  maxTilt?: number;
  /** Springiness when returning to rest */
  spring?: boolean;
}>;

/**
 * A simple parallax/3D tilt wrapper using Reanimated + RNGH.
 * Works on native and web. Children render inside an Animated.View
 * that tilts based on pointer/touch position.
 */
export default function ParallaxTilt({ children, style, maxTilt = 12, spring = true }: Props) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      // Normalize pointer within the target size (0..1)
      const w = (e as any)?.width ?? 1;
      const h = (e as any)?.height ?? 1;
      const nx = e.x / w; // 0..1
      const ny = e.y / h; // 0..1
      // Convert to -max..max
      rotateY.value = interpolate(nx, [0, 0.5, 1], [maxTilt, 0, -maxTilt], Extrapolation.CLAMP);
      rotateX.value = interpolate(ny, [0, 0.5, 1], [-maxTilt, 0, maxTilt], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      const to = 0;
      if (spring) {
        rotateX.value = withSpring(to, { damping: 14, stiffness: 120 });
        rotateY.value = withSpring(to, { damping: 14, stiffness: 120 });
      } else {
        rotateX.value = withTiming(to, { duration: 160 });
        rotateY.value = withTiming(to, { duration: 160 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </GestureDetector>
  );
}

