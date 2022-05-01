const createTable = () =>{
    dbLocal.transaction((tx) =>{
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS'
        +'todo'
        +'(ID VARCHAR(255) PRIMARY KEY,TodoItem VARCHAR(255);')
    })

    select()

  }
  createTable();


  function insert(todoItem = []){
    dbLocal.transaction( tx => {
      tx.executeSql('INSERT INTO Student_Table (INSERT INTO todo (ID, TodoItem) values (?, ?)',[todoItem[0], todoItem[1]],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Data Inserted Successfully....');
          } else Alert.alert('Failed....');
        }
      );
    });
  }
  insert([1,2])


  function select(){
    dbLocal.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM todo', null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, results) => {console.log('123')} ,
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => console.log('Error ', error)
        ) // end executeSQL
    }) // end transaction
  }