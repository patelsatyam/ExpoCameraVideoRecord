 
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import TryVideoRecord from '../VideoRecord';
import CaptureImage from '../CaptureImage';
 
class Swiper extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
        gestureName: 'none',
        left : true
    };
  }

  onSwipeLeft(gestureState) {
    this.setState({left: true});
  }
 
  onSwipeRight(gestureState) {
    this.setState({left: false});
  }
 
//   onSwipe(gestureName, gestureState) {
//     const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
//     this.setState({gestureName: gestureName});
//     switch (gestureName) {
//       case SWIPE_LEFT:
//         this.setState({backgroundColor: 'blue'});
//         break;
//       case SWIPE_RIGHT:
//         this.setState({backgroundColor: 'yellow'});
//         break;
//     }
//   }
 
  render() {
    
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
 
    return (
      <GestureRecognizer
        // onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
        }}
        >
            { this.state.left ? <CaptureImage /> : <TryVideoRecord /> }
      </GestureRecognizer>
    );
  }
}
 
export default Swiper;