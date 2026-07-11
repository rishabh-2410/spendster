import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
    forwardRef,
    useCallback,
    useMemo,
} from "react";



import {
  
    StyleSheet,
    Text,
} from "react-native";

import { ScrollView } from 'react-native-gesture-handler';


const AboutSheet = forwardRef<BottomSheetModal>(
    function AboutSheet(_, ref) {
        const snapPoints = useMemo(
            () => ["85%"],
            []
        );

        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    opacity={0.35}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />
            ),
            []
        );

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enablePanDownToClose
                enableDismissOnClose
                enableDynamicSizing={false}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                backgroundStyle={styles.background}
                handleIndicatorStyle={styles.handle}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView
                    style={styles.container}
                >
                    <Text style={styles.title}>
                        About
                    </Text>

                    {/**---------------Content Container----------------- */}

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                    >
                        <Text style={styles.modalSectionTitle}>
                            Spendster
                        </Text>

                        <Text style={styles.modalText}>
                            Spendster is a simple and modern personal expense tracker designed to help
                            you stay on top of your spending without unnecessary complexity.
                        </Text>

                        <Text style={styles.modalSectionTitle}>
                            Features
                        </Text>

                        <Text style={styles.modalText}>
                            • Track daily expenses{"\n"}
                            • View spending insights{"\n"}
                            • Organize expenses by category{"\n"}
                            • Secure account authentication{"\n"}
                            • Fast and lightweight experience
                        </Text>

                        <Text style={styles.modalSectionTitle}>
                            Version
                        </Text>

                        <Text style={styles.modalText}>
                            Spendster v1.0.0
                        </Text>

                        <Text style={styles.modalSectionTitle}>
                            Built With
                        </Text>

                        <Text style={styles.modalText}>
                            React Native (Expo), Golang, PostgreSQL, TanStack Query, Zustand and
                            React Hook Form.
                        </Text>

                        <Text style={styles.modalSectionTitle}>
                            Thank You
                        </Text>

                        <Text style={styles.modalText}>
                            Thank you for using Spendster. We hope it helps you build better financial
                            habits and makes expense tracking effortless.
                        </Text>
                    </ScrollView>

                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default AboutSheet;

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#FFF9E7",
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
    },

    handle: {
        backgroundColor: "#D8D2BE",
        width: 48,
    },

    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 60,
    },

    title: {
        fontFamily: "sans-bold",
        fontSize: 28,
        color: "#081126",
        marginBottom: 28,
    },

    modalSectionTitle: {
        marginTop: 20,
        marginBottom: 8,
        fontSize: 18,
        fontFamily: "sans-bold",
        color: "#081126",
    },

    modalText: {
        fontSize: 15,
        lineHeight: 24,
        fontFamily: "sans-medium",
        color: "#4D4D4D",
    },
});