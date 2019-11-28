import React, { useState, useEffect } from 'react';
import {
    FlatList,
    Text,
    View,
    ActivityIndicator, 
    StyleSheet,
    SafeAreaView
} from 'react-native';

// Constants
import CONSTANTS from '../constants/constants';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Actions
import * as tweetsActions from '../store/actions/tweets';

const HomePage = props => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [location, setLocation] = useState();

    // Retrieve tweet trends from redux store
    const tweetTrends = useSelector((state) => state.tweets.tweetTrends);

    const findDeviceLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {        
                setLocation(position);
            },
            error => Alert.alert(error.message), 
            {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 1000
            }
        );
    };

    //******* FIND DEVIDE LOCATION
    useEffect(() => {
        findDeviceLocation();
    }, []);

    //********* DATA LOADING
    // Load popular movies
    useEffect(() => {
        if (location) {
            const loadTweetTrends = async (location) => {
                setError(null);
                setIsLoading(true);
                try {
                    await dispatch(tweetsActions.getTrends(location));
                    setIsLoading(false);
                } catch (err) {
                    // Error rethrown from the dispatch action
                    setError(err.message);
                    setIsLoading(false);
                }
            };
            loadTweetTrends(location);
        }
    }, [location]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Trending near you</Text>
            </View> 
            {isLoading ? 
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='#0084b4'/>
                </View>
            :
                (error ? 
                    <View style={styles.container}>
                        <Text style={styles.warning}>There was a problem fetching the data</Text>
                    </View>                
                :
                    (tweetTrends.length > 0 ?
                        <FlatList
                            keyExtractor={(item) => String(item.name)}
                            data={tweetTrends}
                            renderItem={(itemData) =>
                                <View style={styles.trendContainer}>
                                    <Text style={styles.trendName}>{itemData.item.name}</Text>
                                    <Text style={styles.trendVolume}>{itemData.item.volume} tweets</Text>
                                </View>
                            }
                        />
                    :
                        <View style={styles.container}>
                            <Text style={styles.warning}>Ops...No content to show here</Text>
                        </View>
                    )
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
    paddingHorizontal: 15
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center'
  },
  header: {
    fontSize: 25,
    fontWeight: '700',
    color: CONSTANTS.COLOR_TITLE
  },
  warning: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center'
  },
  trendContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 20,
    borderColor: CONSTANTS.COLOR_PRIMARY,
    borderWidth: 2,
    marginTop: 15,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  trendName: {
    fontSize: 22,
    fontWeight: '600',
    color: CONSTANTS.COLOR_PRIMARY
  },
  trendVolume: {
    fontSize: 17,
    fontWeight: '300',
    color: CONSTANTS.COLOR_PRIMARY,
    marginTop: 5
  }
});

export default HomePage;