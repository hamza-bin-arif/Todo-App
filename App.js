import React, {useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './screens/task';


export default function App() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = async () => {
    Keyboard.dismiss();
    
	try {
		let allTasks = [];
		
		let prevTasks = await AsyncStorage.getItem('tasks');    
		if( prevTasks != null ) {
			allTasks = JSON.parse( prevTasks );
		}

		let task = {
			title: title,
			description: description,
		}

		setTaskItems([...taskItems, task]) //maintaining state...

		allTasks.push( task );
			
		const jsonTask = JSON.stringify(allTasks)
		AsyncStorage.setItem('tasks', jsonTask);
		
		setTitle(null);
		setDescription(null);

	} catch (e) {
		console.log(e);
	}
	
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)

	const jsonTask = JSON.stringify(itemsCopy)
	AsyncStorage.setItem('tasks', jsonTask);
  }

  useEffect( async() => {
	let tasks = await AsyncStorage.getItem('tasks');
	if( null != tasks ) {
		setTaskItems(JSON.parse(tasks));
	}
  }, []);

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
		<View>
			<TextInput style={ styles.searchField} placeholder='Search' />
		</View>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
                  <Task title={item.title} description={item.description} /> 
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <View style = {styles.fieldsWrapper}>
		<TextInput style={styles.input} placeholder={'Write a task'} value={title} onChangeText={text => setTitle(text)} />
		<TextInput style={styles.input} placeholder={'Description'} value={description} onChangeText={text => setDescription(text)} />
		</View>
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
	writeTaskWrapper: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	fieldsWrapper:{

  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
	marginVertical: 10,
  },
  searchField: {
    borderColor: '#C0C0C0',
    paddingVertical: 15,
	borderBottomWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});