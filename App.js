import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Item from './Item';
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  const [todo, setTodo] = useState();
  const [todoItems, setTodoItems] = useState([]);

  useEffect(()=>{
    const firebaseConfig = {
      apiKey: "AIzaSyAg_zxkt0cATldAGylA1LTM7BYZ3uUsCOA",
      authDomain: "myapp-b3c94.firebaseapp.com",
      projectId: "myapp-b3c94",
      storageBucket: "myapp-b3c94.appspot.com",
      messagingSenderId: "1099036369840",
      appId: "1:1099036369840:web:69a1a5e1af436379d2ec75"
    };
    // Initialize Firebase
    initializeApp(firebaseConfig);
    console.log("Kết nối thành công");
    GetData();
  }, [])

  function AddTodo(todoItem) {
    const db = getDatabase();
    const reference = ref(db, 'todo/');
    push(reference, {
      TodoItem: todoItem
    });
  }

  function RemoveTodo(id){
    const db = getDatabase();
    const reference = ref(db, 'todo/' + id);
    remove(reference)
  }

  function GetData(){
    const db = getDatabase();
    const reference = ref(db, 'todo/');
    onValue(reference, (snapshot) => {
      let array = [];
      snapshot.forEach(function(childSnapshot){
        var childData = childSnapshot.val();
        array.push({
          TodoItem:childData.TodoItem,
          id: childSnapshot.key
        })
      });
      console.log(array);
      setTodoItems(array);
    });
    
  }

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Todo App</Text>
      <ScrollView>
        <View style={styles.items}>
          <FlatList
            data = {todoItems}
            keyExtractor={({item}, index)=>{index.toString()}}
            renderItem={({item}, index)=>
              <TouchableOpacity onPress={()=>{RemoveTodo(item.id)}}><Item text={item.TodoItem} /></TouchableOpacity>
            }
          />
      </View>
      </ScrollView>
      
      <KeyboardAvoidingView style={styles.inputWraper}>
        <TextInput style={styles.input} placeholder={'Nhập ở đây'} value={todo} onChangeText={text => setTodo(text)} />
        <TouchableOpacity style={styles.addWraper} onPress={()=>AddTodo(todo)}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8d9e6',
  },
  title:{
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold'
  },
  items:{
    padding: 20,
    paddingTop: 0,
    fontSize: 14
  },
  inputWraper:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center'
  },
  input: {
    padding: 10,
    paddingHorizontal: 20,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25
  },
  addWraper: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  addText: {
    fontSize: 30,
    color: '#c8d9e6'
  }
});
