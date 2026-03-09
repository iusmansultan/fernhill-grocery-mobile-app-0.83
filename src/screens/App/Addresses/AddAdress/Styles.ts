import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  profile: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#0066B1",
  },
  imageEdit: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  text: {
    fontWeight: "bold",
    color: "#0066B1",
  },
  inputText: {
    height: 50,
    color: "#0066B1",
  },
  inputTextMulti: {
    // height: 50,
    color: "#0066B1",
  },
  inputView: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 1.5,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 10,
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputViewMulti: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 2,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 140,
    marginBottom: 20,
    // justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    marginTop: 5,
  },
  infoContainer: {
    width: "90%",
  },
  setDefult: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  saveBtn: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#0066B1",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    marginBottom: 40,
  },
  info: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  scrollView: {
    height: "100%",
    backgroundColor: "white",
  },
  switch: {
    marginRight: 10,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  placesContainer: {
    width: "90%",
    height: 300,
    zIndex: 1000,
    elevation: 10,
  },
  placesTextInputContainer: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 1.5,
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop:3
  },
  placesTextInput: {
    height: 47,
    color: "#0066B1",
  },
  placesListView: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  placesRow: {
    backgroundColor: "white",
    padding: 13,
    minHeight: 44,
  },
  placesDescription: {
    color: "#333",
    fontSize: 14,
  },
});

export default styles;
