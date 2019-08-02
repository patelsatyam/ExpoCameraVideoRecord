import React from 'react';
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Indicator from './ActivityIndicator';

class MyReview extends React.Component {
    state = {
        RetakeVideo: false,
        loading: false
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    // componentDidMount() {
    //     this.setState({ saving: false })
    // }
    _saveVideo = async () => {

        this.setState({ loading: true });

        await this.askPermissionsAsync();

        const { video } = this.props;
        console.log("----> save" + video.uri)
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        this.setState({ loading : false })
    }


    render() {

        const { width, height } = Dimensions.get('window');

        if (this.state.RetakeVideo) {
            return (
                <TryVideoRecord />
            )
        }
        if (this.state.saving) {
            return <Indicator />
        }
        return (
            <View>
                <Video
                    source={{
                        uri: this.props.video.uri
                    }}
                    shouldPlay={true}
                    resizeMode="cover"
                    isLooping
                    style={{ width: width - 40, height: height - 80, marginTop: 20, borderRadius: 10, marginLeft: 20 }}
                    isMuted={true}
                />
                <Text style={{ left: 30, position: 'absolute', top: 30, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10, paddingHorizontal: 5 }}>Preview</Text>
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between', bottom: 10, left: 10, right: 10, position: 'absolute', alignItems: 'center' }}>
                    <Button title="Save" style={{}} onPress={() => { this._saveVideo() }} />
                    <Button title="Retake" onPress={() => { this.setState({ RetakeVideo: true }) }} />
                </View>
                {this.state.loading &&
                    <View style={styles.loading}>
                        <Indicator/>
                    </View>
                }
            </View>
        )
    }

}


export default class TryVideoRecord extends React.Component {
    state = {
        hasCameraPermission: null,
        video: null,
        type: Camera.Constants.Type.back,
        recording: false,
        ReviewVideo: false
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    // function to take snap || click photo
    snap = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            console.log(photo);
        }
    };

    _StartRecord = async () => {
        console.log("video record started")
        if (this.camera) {
            this.setState({ recording: true }, async () => {
                const video = await this.camera.recordAsync();
                this.setState({ video });
                console.log(video)
            });
        }
    }

    _StopRecord = async () => {
        this.setState({ recording: false }, () => {
            this.camera.stopRecording();
        });
    };


    toogleRecord = () => {
        const { recording } = this.state;

        if (recording) {
            this._StopRecord();
        } else {
            this._StartRecord();
        }
    };


    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (this.state.video) {
            return (
                <MyReview video={this.state.video} />
            )
        }


        else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        style={{ flex: 1 }}
                        type={this.state.type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                position: 'absolute',
                                left: 10,
                                bottom: 2,
                                right: 10
                            }}>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        type:
                                            this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Ionicons name="ios-reverse-camera" size={70} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { this.toogleRecord() }}
                            >
                                <Ionicons name="ios-radio-button-on" size={70} color={this.state.recording ? "white" : "red"} />
                            </TouchableOpacity>
                        </View>

                    </Camera>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }
})