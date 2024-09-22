import React, {useEffect, useReducer} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {Test} from "./Test";

// Define types for the state and actions

// State interface
interface State {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1Sets: number;
  player2Sets: number;
  currentSet: number;
}

// Action types
type Action =
  | { type: 'ADD_POINT_PLAYER_1' }
  | { type: 'ADD_POINT_PLAYER_2' }
  | { type: 'NEXT_SET' }
  | { type: 'RESET_MATCH' }
  | { type: 'SWITCH_SIDES' };

// Initial state for the reducer
const initialState: State = {
  player1Name: 'Player1',
  player2Name: 'Player2',
  player1Score: 0,
  player2Score: 0,
  player1Sets: 0,
  player2Sets: 0,
  currentSet: 1,
};

const switchSide = (state: State): State => ({
  ...state,
  player1Name: state.player2Name,
  player2Name: state.player1Name,
  player1Score: state.player2Score,
  player2Score: state.player1Score,
  player1Sets: state.player2Sets,
  player2Sets: state.player1Sets,
})

const isWin = (leftScore:number, rightScore:number) => {
   return leftScore === 30 || (leftScore >= 20 && Math.abs(leftScore - rightScore) > 1)
}

const switchIfNeeded = (state: State) => {
  if(state.currentSet === 3 && (state.player1Score === 11 || state.player2Score === 11)) {
    return switchSide(state)
  }

  return state
}

// Reducer function
const scoreReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_POINT_PLAYER_1':
      if(isWin(state.player1Score, state.player2Score)) {
        return winSet(state, 1);
      }
      return switchIfNeeded({...state, player1Score: state.player1Score + 1});

    case 'ADD_POINT_PLAYER_2':
      if(isWin(state.player2Score, state.player1Score)) {
        return winSet(state, 2);
      }
      return switchIfNeeded({...state, player2Score: state.player2Score + 1});

    case 'NEXT_SET':
      return {
        ...state,
        player1Score: 0,
        player2Score: 0,
        currentSet: state.currentSet + 1,
      };

    case 'RESET_MATCH':
      return initialState;

    case 'SWITCH_SIDES':
      return switchSide(state)

    default:
      return state;
  }
};

// Helper function to handle winning sets
const winSet = (state: State, winner: number): State => {
  if (winner === 1) {
    if (state.player1Sets === 1) {
      Alert.alert('Player 1 wins the match!');
      return initialState;
    }

    return switchSide({
      ...state,
      player1Sets: state.player1Sets + 1,
      player1Score: 0,
      player2Score: 0,
      currentSet: state.currentSet + 1
    })
  } else {
    if (state.player2Sets === 1) {
      Alert.alert('Player 2 wins the match!');
      return initialState;
    }
    return switchSide({
      ...state,
      player2Sets: state.player2Sets + 1,
      player1Score: 0,
      player2Score: 0,
      currentSet: state.currentSet + 1
    })
  }
};

const lockOrientation = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
};

export default function App() {
  const [state, dispatch] = useReducer(scoreReducer, initialState);

  useEffect(() => {
    void lockOrientation(); // Lock the orientation when the app starts

    return () => {
      void ScreenOrientation.unlockAsync(); // Unlock when the component unmounts
    };
  }, []);

  // Handle point addition for player 1
  const handleAddPointPlayer1 = () => {
    dispatch({type: 'ADD_POINT_PLAYER_1'});
  };

  // Handle point addition for player 2
  const handleAddPointPlayer2 = () => {
    dispatch({type: 'ADD_POINT_PLAYER_2'});
  };

  return (
    <View style={styles.container}>
      {/*/!* Player 1's side *!/*/}

      {/*<TouchableOpacity style={{...styles.playerSide, ...styles.playerSideLeft}} onPress={handleAddPointPlayer1}>*/}
      {/*  <Text style={styles.sets}>{state.player1Name}</Text>*/}
      {/*  <Text style={styles.score}>{state.player1Score}</Text>*/}
      {/*  <Text style={styles.sets}>Sets Won: {state.player1Sets}</Text>*/}
      {/*</TouchableOpacity>*/}

      {/*/!* Player 2's side *!/*/}
      {/*<TouchableOpacity style={{...styles.playerSide, ...styles.playerSideRight}} onPress={handleAddPointPlayer2}>*/}
      {/*  <Text style={styles.sets}>{state.player2Name}</Text>*/}
      {/*  <Text style={styles.score}>{state.player2Score}</Text>*/}
      {/*  <Text style={styles.sets}>Sets Won: {state.player2Sets}</Text>*/}
      {/*</TouchableOpacity>*/}

      {/*/!* Display current set and sides switch *!/*/}
      {/*<Text style={styles.set}>Current Set: {state.currentSet}</Text>*/}
      <Test />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: "relative"
  },
  playerSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerSideLeft: {
    backgroundColor: 'red'
  },
  playerSideRight: {
    backgroundColor: 'blue'
  },
  score: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  sets: {
    fontSize: 24,
    marginTop: 20,
  },
  set: {
    width: '100%',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    position: "absolute",
    color: "white"
  },
  switchSides: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
});
