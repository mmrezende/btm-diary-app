import React, {useState} from 'react';
import {View, Text, TextInput, FlatList, TouchableWithoutFeedback, SafeAreaView, StyleSheet,ScrollView, Keyboard} from 'react-native';
import {AddButton, EditButton, ArrowButton, RemoveButton, SubmitButton, ConfirmationDialog,ErrorDialog, SubmitButtons,DateInput, ImagePopUp, GaleryImgList, CalendarPopUp} from './Buttons';
import {SearchBar} from './Inputs';
import Header from './Header';

import styles from './assets/stylesheet';

import {getFullDate,getWeekDay} from './lib/utilities.js';

const Page = (props) => {
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Header/>
            {props.children}
        </SafeAreaView>
    );
}

const Building = (props) => {
    return(
        <TouchableWithoutFeedback 
            onPress={() => {
                props.setCurrentPage("viewBuilding");
                props.setCurrentBuilding(props.item);
            }}
        >
            <View style={styles.building} >
                <Text style={styles.buildingH1}>{props.item.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const HomePage = (props) => {
    const [textInput, setTextInput] = useState("");

    const renderBuilding = ({item}) => {
        if(item.name){
            return(
                (item.name.toLowerCase().includes(textInput.toLowerCase()) || !textInput) ?
                    (<Building 
                        item={item} 
                        setCurrentPage={props.setCurrentPage}
                        setCurrentBuilding={props.setCurrentBuilding}
                    />)
                : null
            );
        }
        return null;
    };

    return(
        <Page>
            {(props.buildings.length > 0) && 
            <SearchBar onChangeText={setTextInput}/>}
            <View style={styles.buildingList}>
                <FlatList 
                    data={props.buildings} 
                    renderItem={renderBuilding}
                    keyExtractor={(item) => item.name}
                    scrollIndicatorInsets={{ right: -2 }}
                />
            </View>
            <View style={styles.buttonList}>
                <AddButton onClick={() => props.setCurrentPage("addBuilding")}/>
            </View>
        </Page>
    );
}

const AddBuildingPage = (props) => {
    const [textInput, setTextInput] = useState("");

    const [existsPopUp, setExistsPopUp] = useState(false);
    const [emptyPopUp, setEmptyPopUp] = useState(false);

    return(
        <Page>
            <ArrowButton onClick={() => props.setCurrentPage("home")}/>
            <Text style={styles.title}>Cadastrar Obra</Text>
            <Text style={styles.label}>Nome da Obra</Text>
            <View style={styles.textInputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder=""
                    underlineColorAndroid="transparent"
                    onChangeText={setTextInput}
                />
            </View>
            <SubmitButton 
                title="Cadastrar" 
                onClick={() => {
                    try{
                        props.addBuilding({name: textInput, diaries: []});
                        props.setCurrentPage("home");
                    }catch (err){
                        //Input is empty
                        if(err === "empty"){
                            setEmptyPopUp(true);
                            return;
                        }

                        //Building name already exists
                        if(err === "exists"){
                            setExistsPopUp(true);
                            return;
                        }
                    }
                }}
            />
            <ErrorDialog
                onClick={()=> setEmptyPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Nenhum nome foi fornecido</Text>
                )}
                condition={emptyPopUp}
            />
            <ErrorDialog
                onClick={() => setExistsPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Já existe uma obra com este nome</Text>
                )}
                condition={existsPopUp}
            />
        </Page>
    );
}

const Diary = (props) => {
    const date = new Date(props.item.date);
    const fullDate = getFullDate(date);
    const weekDay = getWeekDay(date);
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                props.setCurrentPage("viewDiary");
                props.setCurrentDiary(props.item);
            }}
        >
            <View style={styles.diary}>
                <Text numberOfLines={2} style={styles.diaryH2}>{props.item.description}</Text>
                <Text style={styles.diaryH1}>{fullDate + " ("+ weekDay + ")"}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const ViewBuildingPage = (props) => {
    const [textInput, setTextInput] = useState("");

    const renderDiary = ({item}) => {
        return(
            (item.description.toLowerCase().includes(textInput.toLowerCase()) || !textInput) && (
            <Diary 
                item={item} 
                setCurrentPage={props.setCurrentPage}
                setCurrentDiary={props.setCurrentDiary}
            />)
        );
    };

    return(
        <Page>
            <ArrowButton onClick={() => props.setCurrentPage("home")}/>
            <Text style={styles.title}>{props.currentBuilding.name}</Text>
            {(props.currentBuilding.diaries.length > 0) && 
            <SearchBar onChangeText={setTextInput}/>}
            <View style={styles.diaryList}>
                <FlatList 
                    data={props.currentBuilding.diaries} 
                    renderItem={renderDiary}
                    keyExtractor={(item) => getFullDate(new Date(item.date))}
                    scrollIndicatorInsets={{ right: -2 }}
                />
            </View>
            <View style={styles.buttonList}>
                <EditButton onClick={() => props.setCurrentPage("editBuilding")}/>
                <AddButton onClick={() => props.setCurrentPage("addDiary")}/>
            </View>
        </Page>
    );
}

const EditBuildingPage = (props) => {
    const [textInput, setTextInput] = useState("");

    const [existsPopUp, setExistsPopUp] = useState(false);
    const [emptyPopUp, setEmptyPopUp] = useState(false);
    const [removePopUp, setRemovePopUp] = useState(false);
    

    return (
        <Page>
            <ArrowButton onClick={() => props.setCurrentPage("viewBuilding")} />
            <Text style={styles.title}>Editar Obra</Text>
            <Text style={styles.label}>Nome da Obra</Text>
            <View style={styles.textInputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder={props.currentBuilding.name}
                    underlineColorAndroid="transparent"
                    onChangeText={setTextInput}
                />
                <View style={styles.floatButton}>
                    <RemoveButton onClick={() => setRemovePopUp(true)}/>
                </View>
            </View>
            <SubmitButton
                title="Editar" 
                onClick={() => {
                    try{
                        props.editBuilding({name: textInput});
                        props.setCurrentPage("home");
                    }catch (err){
                        //Input is empty
                        if(err === "empty"){
                            setEmptyPopUp(true);
                        }

                        //Building name already exists
                        if(err === "exists"){
                            setExistsPopUp(true);
                        }
                    }
                }}
            />
            <ConfirmationDialog
                actions = {[
                    () => {
                        props.removeBuilding(); 
                        props.setCurrentPage("home");
                    },
                    () => setRemovePopUp(false)
                ]}
                titles = {["Deletar", "Cancelar"]}
                message = {(
                    <Text style={styles.confirmationDialogMessage}>
                        Você tem certeza que deseja <Text style={styles.bold}>deletar</Text> a obra <Text style={styles.bold}>“{props.currentBuilding.name}”</Text> e todas as anotações sobre ela?
                    </Text>
                )}
                condition={removePopUp}
            />

            <ErrorDialog
                onClick={()=> setEmptyPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Nenhum nome foi fornecido</Text>
                )}
                condition={emptyPopUp}
            />
            <ErrorDialog
                onClick={() => setExistsPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Já existe uma obra com este nome</Text>
                )}
                condition={existsPopUp}
            />
        </Page>
    );
}

const AddDiaryPage = (props) => {
    const [date, setDate] = useState(new Date());
    
    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);

    const [calendarPopUp, setCalendarPopUp] = useState(false);
    const [existsPopUp, setExistsPopUp] = useState(false);
    const [emptyPopUp, setEmptyPopUp] = useState(false);
    const [imagePopUp, setImagePopUp] = useState(null);

    const [height,setHeight] = useState(50);

    return (
        <Page>
        <ScrollView style={styles.container} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
            <ArrowButton onClick={() => props.setCurrentPage("viewBuilding")}/>
            <Text style={styles.title}>{props.currentBuilding.name}</Text>
            <CalendarPopUp
                condition={calendarPopUp}
                value={date}
                setCalendarPopUp={setCalendarPopUp}
                setDate={setDate}
            />
            <Text style={styles.subtitle}>Galeria</Text>
            <GaleryImgList
                addButton={true}
                images={images}
                setImagePopUp={setImagePopUp}
                setImages={setImages}
            />
                <TextInput 
                    style={StyleSheet.compose(styles.textInputDiary,{height: Math.max(height,300)})} 
                    placeholder="Descrição"
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical= "top"
                    scrollEnabled={false}
                    onContentSizeChange={(event) => {
                        setHeight(event.nativeEvent.contentSize.height);
                    }}
                    onSubmitEditing={Keyboard.dismiss}
                />
                <SubmitButton 
                title="Salvar" 
                onClick={() => {
                    try{
                        props.addDiary({
                            date: date.toDateString(), 
                            description: description,
                            images: images
                        });
                        props.setCurrentPage("viewBuilding");
                    }catch(err){
                        if(err==="exists") {
                            setExistsPopUp(true);
                            return;
                        }
                        if(err==="empty"){
                            setEmptyPopUp(true);
                        }
                    }
                }}
            />
        </ScrollView>
        <ImagePopUp
            uri={imagePopUp}
            removeButton={true}
            setImagePopUp={setImagePopUp}
            setImages={setImages}
            images={images}
        />
        <ErrorDialog
            onClick={()=> setEmptyPopUp(false)}
            message= {(
                <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Nenhuma descrição foi fornecida</Text>
            )}
            condition={emptyPopUp}
        />
        <ErrorDialog
            onClick={() => setExistsPopUp(false)}
            message= {(
                <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Já existe um diário referente a esta data</Text>
            )}
            condition={existsPopUp}
        />
        </Page>
    );
}

const ViewDiaryPage = (props) => {
    const date = new Date(props.currentDiary.date);
    const diaryDate = getFullDate(date) + " ("+ getWeekDay(date) + ")";

    const [imagePopUp, setImagePopUp] = useState(null);

    return (
        <Page>
            <ScrollView style={styles.container}>
            <ArrowButton onClick={() => props.setCurrentPage("viewBuilding")} />
            <Text style={styles.title}>{props.currentBuilding.name}</Text>
            <Text style={styles.diaryH1}>{diaryDate}</Text>

            <GaleryImgList
                images={props.currentDiary.images}
                addButton={false}
                setImagePopUp={setImagePopUp}
            />
            <Text style={styles.diaryDescription}>{props.currentDiary.description}</Text>
            </ScrollView>
            <View style={styles.buttonList}>
                <EditButton onClick={() => props.setCurrentPage("editDiary")}/>
            </View>
            <ImagePopUp
                uri={imagePopUp}
                removeButton={false}
                setImagePopUp={setImagePopUp}
            />
        </Page>
    );
}

const EditDiaryPage = (props) => {
    const [date, setDate] = useState(new Date(props.currentDiary.date));

    const [images, setImages] = useState(props.currentDiary.images);
    const [imagePopUp, setImagePopUp] = useState(null);
    
    const [textInput,setTextInput] = useState(props.currentDiary.description);

    const [calendarPopUp,setCalendarPopUp] = useState(false);

    const [cancelPopUp,setCancelPopUp] = useState(false);
    const [removePopUp,setRemovePopUp] = useState(false);
    const [existsPopUp,setExistsPopUp] = useState(false);
    const [emptyPopUp,setEmptyPopUp] = useState(false);

    const [height,setHeight] = useState(20);

    return (
        <Page>
            <ScrollView style={styles.editDiaryScrollView} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
            <ArrowButton onClick={() => props.setCurrentPage("viewBuilding")} />
            <Text style={styles.title}>{props.currentBuilding.name}</Text>
            <CalendarPopUp
                condition={calendarPopUp}
                value={date}
                setCalendarPopUp={setCalendarPopUp}
                setDate={setDate}
            />
            <GaleryImgList
                images={images}
                addButton={true}
                setImagePopUp={setImagePopUp}
                setImages={setImages}
            />            

            <TextInput 
                style={StyleSheet.compose(styles.textInputDiary,{height: Math.max(height,300)})}
                defaultValue={props.currentDiary.description}
                multiline={true}
                placeholder="Descrição"
                textAlign="left"
                textAlignVertical="top"
                onChangeText={setTextInput}
                onContentSizeChange={(event) => {
                    setHeight(event.nativeEvent.contentSize.height);
                }}
                onSubmitEditing={Keyboard.dismiss}
            />
            
            </ScrollView>
            <SubmitButtons
                onClick1={() => {
                    const newDiary = {date: date.toDateString(), description: textInput, images: images};
                    if(JSON.stringify(newDiary) !== JSON.stringify(props.currentDiary)){
                        setCancelPopUp(true);
                    }else {
                        props.setCurrentPage("viewDiary");
                    }
                }}
                onClick2={() => {
                    try{
                        props.editDiary({
                            date: date.toDateString(),
                            description: textInput, 
                            images: images
                        });
                        props.setCurrentPage("viewDiary");
                    }catch(err){
                        alert(err);
                        if(err==="exists") {
                            setExistsPopUp(true);
                            return;
                        }
                        if(err==="empty"){
                            setEmptyPopUp(true);
                        }
                    }
                }}
                titles = {["Cancelar", "Salvar"]}
            />
            <View style={StyleSheet.compose(styles.buttonList,{marginBottom: 50})}>
                <RemoveButton onClick={() => setRemovePopUp(true)}/>
            </View>
            <ImagePopUp
                uri={imagePopUp}
                removeButton={true}
                setImagePopUp={setImagePopUp}
                setImages={setImages}
                images={images}
            />
            <ConfirmationDialog
                actions = {[
                    () => {
                        props.removeDiary(); 
                        props.setCurrentPage("viewBuilding");
                    },
                    () => setRemovePopUp(false)
                ]}
                titles = {["Deletar", "Cancelar"]}
                message = {(
                    <Text style={styles.confirmationDialogMessage}>
                        Você tem certeza que deseja <Text style={styles.bold}>deletar</Text> essas anotações?
                    </Text>
                )}
                condition={removePopUp}
            />
            <ConfirmationDialog
                actions = {[
                    () => props.setCurrentPage("viewDiary"),
                    () => setCancelPopUp(false)
                ]}
                titles = {["Concluir", "Continuar"]}
                message = {(
                    <Text style={styles.confirmationDialogMessage}>
                        Ao cancelar, as informações atualizadas <Text style={styles.bold}>não serão salvas.</Text>
                    </Text>
                )}
                condition={cancelPopUp}
            />
            <ErrorDialog
                onClick={()=> setEmptyPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Nenhuma descrição foi fornecida</Text>
                )}
                condition={emptyPopUp}
            />
            <ErrorDialog
                onClick={() => setExistsPopUp(false)}
                message= {(
                    <Text style={styles.errorDialogMessage}><Text style={styles.bold}>Erro:</Text> Já existe um diário referente a esta data</Text>
                )}
                condition={existsPopUp}
            />
        </Page>
    );
}

export {HomePage, AddBuildingPage,ViewBuildingPage, EditBuildingPage, AddDiaryPage, ViewDiaryPage, EditDiaryPage};