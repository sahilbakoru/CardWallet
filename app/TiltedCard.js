import { useRef } from "react";
import {
    Animated,
    Image,
    ImageBackground,
    PanResponder,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TiltedCard({ item, scale, router, backgroundImage, styles }) {
  const tilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        tilt.setValue({
          x: gesture.dx / 20, // adjust divisor for sensitivity
          y: gesture.dy / 20,
        });
      },
      onPanResponderRelease: () => {
        Animated.spring(tilt, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const tiltStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: tilt.x.interpolate({ inputRange: [-15, 15], outputRange: ["-10deg", "10deg"] }) },
      { rotateX: tilt.y.interpolate({ inputRange: [-15, 15], outputRange: ["10deg", "-10deg"] }) },
      { scale },
    ],
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        router.push({ pathname: "/cardDetails", params: { id: item.id } });
      }}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, tiltStyle]}
      >
        {item.frontImage ? (
          <Image
            source={{ uri: item.frontImage }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <ImageBackground
            source={backgroundImage}
            imageStyle={{ borderRadius: 16, opacity: 1 }}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 16,
                padding: 20,
                justifyContent: "center",
              }}
            >
              <Text
                key={`${item.id}`}
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#000",
                  marginBottom: 12,
                  letterSpacing: 1.2,
                  textAlign: "center",
                }}
              >
                {item?.title || "Untitled"}
              </Text>
              {item.fields.slice(0, 2)?.map((field, index) => (
                <View key={`field-${index}-${item.timestamp}`}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#000",
                      marginBottom: 6,
                    }}
                  >
                    {field.key}:{" "}
                    <Text style={{ color: "#454545", fontWeight: "600" }}>
                      {field.value}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </ImageBackground>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
