import React from 'react';
import {View,TextInput} from 'react-native';
import {SearchImg} from './assets/SvgComponents.jsx';

import styles from './assets/stylesheet.js';

const SearchBar = () => {
    
    return(
        <View style={styles.textInputView}>
            <SearchImg width={styles.searchImg.width} height={styles.searchImg.height} style={styles.searchImg}/>
            <TextInput
                style={styles.searchBar}
                placeholder="Pesquisar"
                underlineColorAndroid="transparent"
            />
        </View>
    );
}

export {SearchBar};