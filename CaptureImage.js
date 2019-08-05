import React from 'react';
import { Image, Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import Indicator from './ActivityIndicator';

class MyReview extends React.Component {
    state = {
        Retakeimage: false,
        loading: false,
        saving: false,
        saved: false
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _saveimage = async () => {

        this.setState({ loading: true });

        await this.askPermissionsAsync();

        const { image } = this.props;
        console.log("----> save" + image.uri)
        const asset = await MediaLibrary.createAssetAsync(image.uri);
        this.setState({ loading: false, saved: true })
    }


    render() {

        const { width, height } = Dimensions.get('window');

        if (this.state.Retakeimage || this.state.saved) {
            return (
                <CaptureImage />
            )
        }
        if (this.state.saving) {
            return <Indicator />
        }
        return (
            <View>
                <Image
                    source={{
                        uri: this.props.image.uri
                    }}
                    style={{ width: width - 40, height: height - 80, marginTop: 20, borderRadius: 10, marginLeft: 20 }}
                />
                <Text style={{ left: 30, position: 'absolute', top: 30, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10, paddingHorizontal: 5 }}>Preview</Text>
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between', bottom: 10, left: 10, right: 10, position: 'absolute', alignItems: 'center' }}>
                    <Button title="Save" style={{}} onPress={() => { this._saveimage() }} />
                    <Button title="Retake" onPress={() => { this.setState({ Retakeimage: true }) }} />
                </View>
                {this.state.loading &&
                    <View style={styles.loading}>
                        <Indicator />
                    </View>
                }
            </View>
        )
    }

}


export default class CaptureImage extends React.Component {
    state = {
        hasCameraPermission: null,
        image: null,
        type: Camera.Constants.Type.back,
        ReviewImage: false,
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
            this.setState({ image: photo })
        }


    };


    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (this.state.image) {
            return (
                <MyReview image={this.state.image} />
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
                                onPress={() => { this.snap() }}
                            >
                                <Ionicons name="ios-aperture" size={70} color="white" />
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