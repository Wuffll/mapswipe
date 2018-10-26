/**
 * @author Pim de Witte (pimdewitte.me/pimdewitte95@gmail.com). Copyright MSF UK 2016.
 *
 * Main is the main class that is called from both Android and iOS on application startup.
 * It initializes the application and controls which scene is rendered to the end user through the Navigator component.
 */

import React from 'react';
import { Text, View, StyleSheet, Platform, Image, BackHandler} from "react-native";
import Button from "apsl-react-native-button";
import { createStackNavigator } from 'react-navigation';

var Tutorial = require('./views/Tutorial');
var ProjectNav = require('./views/ProjectNav');
var ProjectView = require('./views/ProjectView');
var WebviewWindow = require('./views/WebviewWindow');
var Login = require('./views/Login');
var Mapper = require('./views/Mapper');
var GLOBAL = require('./Globals');
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
var Modal = require('react-native-modalbox');
var ultimateParent = this;


var style = StyleSheet.create({
    tutContainer: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    startButton: {
        backgroundColor: '#ff0000',
        alignItems: 'stretch',

        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 260
    },

    pic: {
        height: 150,
        width: 150,
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    darkContainer: {
        flex: 1,
        backgroundColor: "#0d1949",
    },
    mainContainer: {
        height: GLOBAL.SCREEN_HEIGHT,
        width: GLOBAL.SCREEN_WIDTH,
        flex: 1,
        marginTop: GLOBAL.TOP_OFFSET
    },
    otherButton: {
        width: GLOBAL.SCREEN_WIDTH,
        height: 30,
        padding: 12,
        marginTop: 10,
        borderWidth: 0,
    },
    startButton: {
        backgroundColor: '#0d1949',
        alignItems: 'stretch',
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 260
    },
    header: {
        fontWeight: '700',
        color: '#212121',
        fontSize: 18,

    },
    tutRow: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 40,
    },

    tutPar: {
        fontSize: 14,
        color: '#575757',
        fontWeight: '500',
        lineHeight: 20,
        marginTop: 10,
    },

    tutText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#50acd4',
        marginTop: 10,
        lineHeight: 20,
    },


    modal: {
        padding: 20,
    },

    modal2: {
        height: 230,
        backgroundColor: "#3B5998"
    },

    modal3: {
        marginTop: 10,
        height: 300,
        width: 300,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        alignItems: 'center'
    },

});

/**
 * Main rendering class
 */

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            name: "",
            level: GLOBAL.DB.getLevel(),
            levelObject: GLOBAL.DB.getLevelObject()
        };
    }

    showAlert(alertObj) {
      MessageBarManager.showAlert(alertObj);
    }

    showLevelUp() {
        console.log("level up!!");
    }


    openModal3(level) {
        var parent = this;
        this.setState({
            levelObject: GLOBAL.DB.getCustomLevelObject(level),
            level: level
        });

        this.refs.modal3.open();

    }

    closeModal3(id) {
        this.refs.modal3.close();
        GLOBAL.DB.stopPopup();
    }

    checkInterval: null;

    /**
     * Starts the level up timer and register the notification bar
     */
    componentDidMount() {


        var parent = this;
      //GLOBAL.ANALYTICS.logEvent('mapswipe_open');
        MessageBarManager.registerMessageBar(parent.refs.alert);

        parent.checkInterval = setInterval(function () {
            if (GLOBAL.DB.getPendingLevelUp() > 0) {
                parent.openModal3(GLOBAL.DB.getPendingLevelUp());
                GLOBAL.DB.setPendingLevelUp(-1);
            }
        }, 500);


    }

    componentWillUnmount() {
        clearInterval(this.checkInterval);
    }

    levelUp() {
        this.openModal3();
    }

    render() {
        console.log('rendering main');
        return (
            <View style={style.mainContainer}>
            <RootStack />
            <Modal style={[style.modal, style.modal3]} backdropType="blur" position={"center"} ref={"modal3"}
                   isDisabled={this.state.isDisabled}>
                <Text style={style.header}>You are now level {this.state.level}</Text>
                <Image style={style.pic} key={this.state.level} source={this.state.levelObject.badge}/>
                <Button style={style.startButton} onPress={this.closeModal3}
                        textStyle={{fontSize: 13, color: '#ffffff', fontWeight: '700'}}>
                    Close
                </Button>
            </Modal>
            <MessageBarAlert ref="alert"/>
          </View>
      )
    }
}

const RootStack = createStackNavigator(
    {
        Tutorial: Tutorial,
        ProjectNav: ProjectNav,
        ProjectView: ProjectView,
        Mapper: Mapper,
        Login: Login,
        WebviewWindow: WebviewWindow,
    },
    {
        initialRouteName: 'Tutorial',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
);

module.exports = Main;
