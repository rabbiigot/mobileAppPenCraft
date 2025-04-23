import React, { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Modal
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
const Ionicons = require('react-native-vector-icons/Ionicons').default;
const MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from './NotesContext';

type RootStackParamList = {
  Note: undefined;
}

export default function App() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addNote } = useNotes();
  const richText = useRef<RichEditor>(null);
  const UNDO = 'undo' as const;
  const REDO = 'redo' as const;
  const [descHTML, setDescHTML] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [showDescError, setShowDescError] = useState<boolean>(false);

  const richTextHandle = (descriptionText: string) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

  // const handleSave = async () => {
  //   const cleanedContent = descHTML.replace(/<(.|\n)*?>/g, "").replace(/&nbsp;/g, "").trim();
  
  //   if (!title.trim() || !cleanedContent) {
  //     setShowDescError(true);
  //     return;
  //   }
  
  //   try {
  //     const note = {
  //       id: Date.now().toString(),
  //       title,
  //       content: descHTML,
  //       createdAt: new Date().toISOString(),
  //     };
  
  //     const existingNotes = await AsyncStorage.getItem('@notes');
  //     const notes = existingNotes ? JSON.parse(existingNotes) : [];
  
  //     const updatedNotes = [note, ...notes];
  //     await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
  
  //     console.log("Note saved:", note);
  //     navigation.push('Note'); // or navigate to the notes list
  
  //   } catch (error) {
  //     console.error("Error saving note:", error);
  //   }
  // };

  const handleSave = () => {
    if (title && descHTML) {
      addNote({ title, content: descHTML, id: '' });
    }
    navigation.push('Note');
  };
  // const submitContentHandle = () => {
  //   const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
  //   const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

  //   if (replaceWhiteSpace.length <= 0) {
  //     setShowDescError(true);
  //   } else {
  //     // send data to your server!
  //     console.log("Submitted HTML:", descHTML);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Header */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDescError}
        onRequestClose={() => setShowDescError(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 16, color: 'red', marginBottom: 10 }}>
              Title or Note cannot be empty
            </Text>
            <TouchableOpacity
              onPress={() => setShowDescError(false)}
              style={{
                backgroundColor: '#312921',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: 'black',
          width: '100%',
        }}
      >
        <TouchableOpacity onPress={() => navigation.push('Note')}>
          <Ionicons name="arrow-back" color="white" size={30} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <RichToolbar
            editor={richText}
            actions={[UNDO, REDO]}
            iconMap={{
              [UNDO]: () => <MaterialIcons name="undo" size={24} color="white" />,
              [REDO]: () => <MaterialIcons name="redo" size={24} color="white" />,
            }}
            style={{ backgroundColor: 'black' }}
          />
          <TouchableOpacity onPress={handleSave}>
            <MaterialIcons name="check" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, paddingBottom: 60 }}>
              <TextInput
                placeholder="Title"
                placeholderTextColor="gray"
                value={title}
                onChangeText={setTitle}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  fontSize: 28,
                  padding: 13,
                  borderColor: 'gray',
                  margin: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                }}
              />

              <RichEditor
                ref={richText}
                onChange={richTextHandle}
                placeholder="Write your notes content here"
                style={{ minHeight: 250 }}
                editorStyle={{
                  backgroundColor: 'black',
                  color: 'white',
                  placeholderColor: 'gray',
                  contentCSSText: 'font-size: 16px; padding: 10px;',
                }}
              />
            </View>
          </ScrollView>

          {/* Bottom Toolbar */}
          <RichToolbar
            editor={richText}
            selectedIconTint="#873c1e"
            iconTint="#312921"
            actions={[
              actions.insertImage,
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.setStrikethrough,
              actions.setUnderline,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.blockquote,
            ]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              backgroundColor: 'black',
              borderTopWidth: 1,
              borderTopColor: '#333',
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: "flex-start",
    backgroundColor: "black",
    alignItems: "center",
  },
  toolbar:{
    backgroundColor: '#4B371c',
    color: 'white'
  },
  header:{
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#4B371c',
    flexDirection: 'row',
    zIndex: 10
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#312921",
    marginBottom: 10,
  },
  htmlBoxStyle: {
    height: 200,
    width: 330,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  richTextContainer: {
    top: 50,
    display: "flex",
    width: "100%",
    marginBottom: 10,
  },
  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  richTextToolbarStyle: {
    backgroundColor: "#c6c3b3",
    borderColor: "#c6c3b3",
    borderWidth: 1,
    
  },
  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },
  saveButtonStyle: {
    backgroundColor: "#c6c3b3",
    borderWidth: 1,
    borderColor: "#c6c3b3",
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#312921",
  },
});
