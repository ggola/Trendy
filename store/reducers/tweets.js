import { GET_TRENDS } from '../actions/tweets';

// Constants
import CONSTANTS from '../../constants/constants';

// Set initial state
const initialState = {
    tweetTrends: []
};

const tweetsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TRENDS: {
            let trends = action.tweetTrends;
            if (trends.length > CONSTANTS.MAX_TRENDS) {
                // Take the first CONSTANTS.MAX_TRENDS trends only
                trends = trends.slice(0, CONSTANTS.MAX_TRENDS)
            }
            return {
                tweetTrends: trends.sort((a, b) => {
                    if (a.volume < b.volume) {
                        return 1;
                    }
                    return -1;
                })
            }
        };
    default:
        return state;
    };
};

export default tweetsReducer;