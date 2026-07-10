import { StyleSheet } from "react-native";

export const registerStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff9e7",
  },

  screen: {
    flex: 1,
    backgroundColor: "#fff9e7",
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  brand: {
    alignItems: "center",
  },
    forgotPassword: {
    fontSize: 12,
    fontFamily: "sans-bold",
    color: "#ea7a53",
    
  },

  logo: {
    // width: 100,
    // height: 100,
    // borderRadius: 50,

    // alignItems: "center",
    // justifyContent: "center",

    // backgroundColor: "#081126",
    //     borderColor: 'red',
    // borderWidth: 2,
    // padding: 0


  },

  logoMark: {
      width: 100,
      height: 100
  },

  wordmark: {
    marginTop: 20,

    fontSize: 20,
    fontFamily: "sans-semibold",
    color: "#081126",
  },

  title: {
    marginTop: 12,

    fontSize: 30,
    fontFamily: "sans-extrabold",
    color: "#081126",
  },

  subtitle: {
    marginTop: 8,
    maxWidth: 300,

    textAlign: "center",

    fontSize: 16,
    lineHeight: 24,
    fontFamily: "sans-medium",

    color: "#45464d",
  },

  formCard: {
    marginTop: 40,

    padding: 16,

    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",

    backgroundColor: "#faf4de",
  },

  form: {
    gap: 16,
  },

  field: {
    gap: 8,
  },

  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    fontFamily: "sans-bold",
    color: "#081126",
    paddingHorizontal: 8
  },

  inputContainer: {
    minHeight: 64,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    

    borderRadius: 16,

    backgroundColor: "#ffffff",
  },

  inputContainerError: {
    borderWidth: 1,
    borderColor: "#ba1a1a",
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,

    paddingVertical: 20,

    fontSize: 16,
    fontFamily: "sans-medium",

    color: "#081126",
  },

  inputAction: {
    width: 32,
    height: 32,

    marginLeft: 12,

    alignItems: "center",
    justifyContent: "center",
  },

  error: {
    fontSize: 12,
    fontFamily: "sans-medium",
    color: "#ba1a1a",
  },

  helper: {
    fontSize: 14,
    fontFamily: "sans-medium",
    color: "#45464d",
    paddingHorizontal: 8
  },

  primaryButton: {
    marginTop: 28,

    minHeight: 64,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 12,

    borderRadius: 16,

    backgroundColor: "#ea7a53",
  },

  primaryButtonDisabled: {
    opacity: 0.45,
  },

  primaryButtonText: {
    fontSize: 18,
    fontFamily: "sans-bold",
    color: "#081126",
  },

  footer: {
    marginTop: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 4,
  },

  footerText: {
    fontSize: 16,
    fontFamily: "sans-medium",
    color: "#45464d",
  },

  link: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#ea7a53",
  },
});