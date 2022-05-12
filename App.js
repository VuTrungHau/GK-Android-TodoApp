import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import Item from './Item';
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';
import { LogBox } from 'react-native';
import * as SQLite from 'expo-sqlite'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import connect, {sql} from '@databases/expo';
LogBox.ignoreAllLogs();

// const dbLocal = connect('my.db');



function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}
const dbLocal = openDatabase();


export default function App() {
  
// Check internet connection
  const internetConnection = NetInfo.addEventListener(state => state.isConnected);

  const createTable = () =>{
    dbLocal.transaction((tx) =>{
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todo (id VARCHAR(255) PRIMARY KEY,TodoItem VARCHAR(255))'),  null, 
        (txObj, results) => {console.log(results)} ,
        (txObj, error) => console.log('Error create', error)
    })


  }
  createTable();


  function insert(todoItem = []){
    dbLocal.transaction( tx => {
      tx.executeSql('INSERT INTO todo (id, TodoItem) values (?, ?)',[todoItem[0], todoItem[1]],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Data Inserted Successfully....');
          } else Alert.alert('Failed....');
        },
        // error => {console.log(error)}
      );
    });
    
  }
  
 
  function deleteItem(id){
    dbLocal.transaction( tx => {
      tx.executeSql('delete from todo where id = ?;',[id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          // if (results.rowsAffected > 0) {
          //   Alert.alert('Data Delete Successfully....');
          // } else Alert.alert('Failed....');
        },
        // error => {console.log(error)}
      );
    });
  }
 deleteItem('-N12_VGEIkZumTe4Y7nz')
  
  function select(){
    dbLocal.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM todo', null,
        // success callback 
        (txObj, results) => {setTodoItems(results.rows._array)} ,
        // failure callback 
        (txObj, error) => console.log('Error select', error)
        ) 
    }) 
  }
  function selectShowLog(){
    dbLocal.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM todo', null,
        // success callback 
        (txObj, results) => {console.log(results.rows._array)} ,
        // failure callback 
        (txObj, error) => console.log('Error select', error)
        ) 
    }) 
  }

  selectShowLog()



  const [todo, setTodo] = useState();
  //todoItems là array chứa dữ liệu để đổ ra giao diện
  //gọi setTodoItems(array) để cập nhật todoItems
  const [todoItems, setTodoItems] = useState([]);
  
  function showAlert(item){
    Alert.alert(
      "",
      "Compeleted "+item.TodoItem+"?",
      [
        {
          text: "Remove",
          onPress: () => RemoveTodo(item.id),
          style: "cancel",
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  useEffect(()=>{
    //Đây là code kết nối firebase
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
    //Ở đây m kiểm tra có kết nối mạng hay không, nếu có thì gọi GetData(),
    //nếu không thì dùng local data để lấy ra dữ liệu rồi dùng setTodoItems() 
    
    if(internetConnection){
      GetData();
    }else{
      select();
    }

  }, [])

  

  function AddTodo(todoItem) {
    if(todoItem == null){
      todoItem = "Unname"
    }
    if(todoItem.trim()==""){
      todoItem = "Unname"
    }
    const db = getDatabase();
    const reference = ref(db, 'todo/');
    push(reference, {
      TodoItem: todoItem
    });
  }
  function RemoveTodo(id){
    console.log(id)
    deleteItem(id)
    if(internetConnection){
      const db = getDatabase();
      const reference = ref(db, 'todo/' + id);
      remove(reference)
    }
    
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
      //Viết câu lệnh lưu array vào local data ở đây
      
      if(array.length > 0 ){
        array.forEach(element =>{
          insert([element.id,element.TodoItem])
        })
      }
      // console.log(array)
      
      select()
    });
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <ScrollView style={{maxHeight: '81%'}}>
        <View style={styles.items}>
          <FlatList
            data = {todoItems}
            keyExtractor={({item}, index)=>{index.toString()}}
            renderItem={({item})=>
              <TouchableOpacity onPress={()=>{showAlert(item)}}><Item text={item.TodoItem} /></TouchableOpacity>
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
    alignItems: 'center',
  },
  input: {
    padding: 10,
    paddingHorizontal: 20,
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#7cd5f2',
    borderWidth: 1,
    borderRadius: 25
  },
  addWraper: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#7cd5f2',
    borderWidth: 1
  },
  addText: {
    fontSize: 30,
    color: '#609af7'
  }
});
