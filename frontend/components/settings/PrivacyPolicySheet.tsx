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

const PrivacyPolicySheet = forwardRef<BottomSheetModal>(
  function PrivacyPolicySheet(_, ref) {
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
            Privacy Policy
          </Text>

          {/**------------------Content Container---------------- */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            
          >
            <Text style={styles.modalSectionTitle}>
              Data We Collect
            </Text>

            <Text style={styles.modalText}>
              Spendster only stores the information required to provide the app&apos;s
              features. This includes your name, email address, account credentials,
              and the expenses you create.
            </Text>

            <Text style={styles.modalSectionTitle}>
              How Your Data Is Used
            </Text>

            <Text style={styles.modalText}>
              Your data is used solely to provide expense tracking, generate summaries,
              and securely synchronize your information across your devices.
            </Text>

            <Text style={styles.modalSectionTitle}>
              Data Security
            </Text>

            <Text style={styles.modalText}>
              We use secure authentication and encrypted communication to protect your
              information. Your password is never stored in plain text.
            </Text>

            <Text style={styles.modalSectionTitle}>
              Third-Party Services
            </Text>

            <Text style={styles.modalText}>
              Spendster may use trusted third-party services for authentication,
              analytics, or cloud infrastructure. These providers only receive the
              information necessary to operate the service.
            </Text>

            <Text style={styles.modalSectionTitle}>
              Contact
            </Text>

            <Text style={styles.modalText}>
              If you have any questions regarding this Privacy Policy, please contact us
              through the app&apos;s support channels.
            </Text>
          </ScrollView>

        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default PrivacyPolicySheet;

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
    paddingTop: 4,
    paddingBottom: 50,
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