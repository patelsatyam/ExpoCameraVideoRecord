import React from 'react';
import { Image, Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import Indicator from './ActivityIndicator';
import * as ImagePicker from 'expo-image-picker';


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
        FlashMode: Camera.Constants.FlashMode.off
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


    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
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
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <View style={{ marginTop: 30 }} />
                    <Camera
                        style={{ flex: 0.85 }}
                        type={this.state.type}
                        flashMode={this.state.FlashMode}
                        ref={ref => {
                            this.camera = ref;
                        }}
                    >
                    </Camera>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            position: 'absolute',
                            left: 20,
                            bottom: 2,
                            right: 20
                        }}>

                        <TouchableOpacity
                            style={{ marginTop: 27 }}
                            onPress={() => {
                                this.setState({
                                    type:
                                        this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                });
                            }}>
                            <Ionicons name="ios-reverse-camera" size={50} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { this.snap() }}
                        >
                            <Text style={{ fontSize: 22, color: '#ffba01', textAlign: 'center' }} >photo</Text>
                            <Ionicons name="ios-aperture" size={60} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ marginTop: 35 }}
                            onPress={() => {
                                this.setState({
                                    FlashMode:
                                        this.state.FlashMode === Camera.Constants.FlashMode.off
                                            ? Camera.Constants.FlashMode.on
                                            : Camera.Constants.FlashMode.off,
                                });
                            }}
                        >
                            <Ionicons name={ this.state.FlashMode ? "ios-flash" : "ios-flash-off"} size={35} color="#fff" />
                        </TouchableOpacity>
                    </View>
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